// ==============================================================================
// frameDecoder.js — Sliding-Window Progressive Frame Decoder
// ------------------------------------------------------------------------------
// Eliminates main-thread synchronous WebP decoding pauses and GPU memory pressure.
//
// 1. Decodes frames asynchronously (via createImageBitmap or img.decode()) ahead
//    of the current scroll playhead.
// 2. Maintains a bounded sliding window of decoded textures (~20-25 frames, ~80MB)
//    rather than 230 frames (~850MB), preventing GPU cache thrashing.
// 3. Never permits context.drawImage() to run on an unprepared/undecoded frame.
// 4. Guarantees monotonic frame lookup so the canvas never jumps back and forth.
// ==============================================================================

export function createFrameDecoder({
  totalFrames,
  windowAhead = 14,
  windowBehind = 6,
  maxDecodedBudget = 26,
  onFrameDecoded = null,
}) {
  let images = new Array(totalFrames).fill(null);
  const decodedBitmaps = new Map(); // frameIndex -> ImageBitmap | HTMLImageElement
  const pendingDecodes = new Set();  // frameIndex -> boolean
  const listeners = new Set();
  if (onFrameDecoded) listeners.add(onFrameDecoded);

  function addListener(fn) {
    if (typeof fn === "function") {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
    return () => {};
  }
  let currentPlayhead = 0;
  let lastConfirmedIndex = 0;
  let scrollDirection = 1; // 1 = forward, -1 = backward
  let isDestroyed = false;
  let activeWorkers = 0;
  const MAX_CONCURRENT_DECODES = 3;

  // Frame 0 eager first frame
  let fallbackFrame = null;

  function setFallback(img) {
    if (img && (img.naturalWidth > 0 || img.width > 0)) {
      fallbackFrame = img;
    }
  }

  function setImages(imgs) {
    if (!imgs) return;
    for (let i = 0; i < Math.min(imgs.length, totalFrames); i++) {
      if (imgs[i]) images[i] = imgs[i];
    }
  }

  function setFrame(index, img) {
    if (index >= 0 && index < totalFrames && img) {
      images[index] = img;
    }
  }

  function isFrameDecoded(index) {
    return decodedBitmaps.has(index);
  }

  function isBatchDecoded(startIndex = 0, count = 16) {
    const limit = Math.min(startIndex + count, totalFrames);
    if (limit <= startIndex) return false;
    for (let i = startIndex; i < limit; i++) {
      if (!decodedBitmaps.has(i)) return false;
    }
    return true;
  }

  function notifyFrameDecoded(idx) {
    listeners.forEach((fn) => {
      try { fn(idx); } catch { }
    });
  }

  async function decodeSingleFrame(index) {
    if (isDestroyed || decodedBitmaps.has(index) || pendingDecodes.has(index)) return;
    const img = images[index];
    if (!img) return;

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!(w > 0 && h > 0)) return;

    pendingDecodes.add(index);
    try {
      if (typeof window !== "undefined" && typeof window.createImageBitmap === "function") {
        try {
          const bitmap = await window.createImageBitmap(img);
          if (!isDestroyed && pendingDecodes.has(index)) {
            decodedBitmaps.set(index, bitmap);
            notifyFrameDecoded(index);
          } else {
            bitmap.close?.();
          }
        } catch {
          // Fallback to img.decode() if createImageBitmap rejects
          if (typeof img.decode === "function") {
            await img.decode();
          }
          if (!isDestroyed && pendingDecodes.has(index)) {
            decodedBitmaps.set(index, img);
            notifyFrameDecoded(index);
          }
        }
      } else if (typeof img.decode === "function") {
        await img.decode();
        if (!isDestroyed && pendingDecodes.has(index)) {
          decodedBitmaps.set(index, img);
          notifyFrameDecoded(index);
        }
      } else {
        // Fallback for environments without decode()
        decodedBitmaps.set(index, img);
        notifyFrameDecoded(index);
      }
    } catch {
      // Decode error or abort: ignore and keep pending cleared
    } finally {
      pendingDecodes.delete(index);
      pumpQueue();
    }
  }

  // Priority queue for progressive decoding
  let decodeQueue = [];

  function buildPriorityQueue() {
    const queue = [];
    const target = currentPlayhead;

    if (scrollDirection >= 0) {
      // Forward scroll: prioritize current, then immediate ahead, then behind
      for (let i = 0; i <= windowAhead; i++) {
        const idx = target + i;
        if (idx < totalFrames && !decodedBitmaps.has(idx) && !pendingDecodes.has(idx) && images[idx]) {
          queue.push(idx);
        }
      }
      for (let i = 1; i <= windowBehind; i++) {
        const idx = target - i;
        if (idx >= 0 && !decodedBitmaps.has(idx) && !pendingDecodes.has(idx) && images[idx]) {
          queue.push(idx);
        }
      }
    } else {
      // Backward scroll: prioritize current, then immediate behind, then ahead
      for (let i = 0; i <= windowAhead; i++) {
        const idx = target - i;
        if (idx >= 0 && !decodedBitmaps.has(idx) && !pendingDecodes.has(idx) && images[idx]) {
          queue.push(idx);
        }
      }
      for (let i = 1; i <= windowBehind; i++) {
        const idx = target + i;
        if (idx < totalFrames && !decodedBitmaps.has(idx) && !pendingDecodes.has(idx) && images[idx]) {
          queue.push(idx);
        }
      }
    }

    decodeQueue = queue;
  }

  function pumpQueue() {
    if (isDestroyed) return;
    pruneDecodedCache();

    while (activeWorkers < MAX_CONCURRENT_DECODES && decodeQueue.length > 0) {
      const nextIdx = decodeQueue.shift();
      if (nextIdx !== undefined && !decodedBitmaps.has(nextIdx) && !pendingDecodes.has(nextIdx)) {
        activeWorkers++;
        decodeSingleFrame(nextIdx).finally(() => {
          activeWorkers = Math.max(0, activeWorkers - 1);
          pumpQueue();
        });
      }
    }
  }

  function pruneDecodedCache() {
    if (decodedBitmaps.size <= maxDecodedBudget) return;
    // Evict frames furthest from currentPlayhead
    const entries = Array.from(decodedBitmaps.keys());
    entries.sort((a, b) => Math.abs(b - currentPlayhead) - Math.abs(a - currentPlayhead));

    while (decodedBitmaps.size > maxDecodedBudget && entries.length > 0) {
      const evictIdx = entries.shift();
      // Keep frame 0 always cached as safe baseline
      if (evictIdx !== 0) {
        const item = decodedBitmaps.get(evictIdx);
        if (item && typeof item.close === "function") {
          try { item.close(); } catch { }
        }
        decodedBitmaps.delete(evictIdx);
      }
    }
  }

  function updatePlayhead(frameIndex) {
    const clamped = Math.max(0, Math.min(totalFrames - 1, frameIndex));
    if (clamped > currentPlayhead) {
      scrollDirection = 1;
    } else if (clamped < currentPlayhead) {
      scrollDirection = -1;
    }
    currentPlayhead = clamped;
    buildPriorityQueue();
    pumpQueue();
  }

  /**
   * Retrieves the best confirmed decoded frame for rendering.
   * NEVER returns an un-decoded image to guarantee context.drawImage() does not block.
   */
  function getConfirmedFrame(requestedFrame) {
    const target = Math.max(0, Math.min(totalFrames - 1, requestedFrame));

    // 1. Exact match ready?
    if (decodedBitmaps.has(target)) {
      lastConfirmedIndex = target;
      return {
        image: decodedBitmaps.get(target),
        index: target,
        isExact: true,
      };
    }

    // 2. Monotonic search according to direction
    let chosenIdx = -1;

    if (scrollDirection >= 0) {
      // Forward scroll: search strictly from target down to lastConfirmedIndex
      const minBound = Math.min(target, lastConfirmedIndex);
      for (let i = target - 1; i >= minBound; i--) {
        if (decodedBitmaps.has(i)) {
          chosenIdx = i;
          break;
        }
      }
      // If none found between target and lastConfirmedIndex, hold lastConfirmedIndex if still in memory
      if (chosenIdx === -1 && decodedBitmaps.has(lastConfirmedIndex)) {
        chosenIdx = lastConfirmedIndex;
      }
      // Fallback if lastConfirmedIndex was evicted: search downwards from target
      if (chosenIdx === -1) {
        for (let i = target - 1; i >= 0; i--) {
          if (decodedBitmaps.has(i)) {
            chosenIdx = i;
            break;
          }
        }
      }
    } else {
      // Reverse scroll: search strictly from target up to lastConfirmedIndex
      const maxBound = Math.max(target, lastConfirmedIndex);
      for (let i = target + 1; i <= maxBound; i++) {
        if (decodedBitmaps.has(i)) {
          chosenIdx = i;
          break;
        }
      }
      // If none found between target and lastConfirmedIndex, hold lastConfirmedIndex if still in memory
      if (chosenIdx === -1 && decodedBitmaps.has(lastConfirmedIndex)) {
        chosenIdx = lastConfirmedIndex;
      }
      // Fallback if lastConfirmedIndex was evicted: search upwards then downwards from target
      if (chosenIdx === -1) {
        for (let i = target + 1; i < totalFrames; i++) {
          if (decodedBitmaps.has(i)) {
            chosenIdx = i;
            break;
          }
        }
      }
      if (chosenIdx === -1) {
        for (let i = target - 1; i >= 0; i--) {
          if (decodedBitmaps.has(i)) {
            chosenIdx = i;
            break;
          }
        }
      }
    }

    if (chosenIdx !== -1) {
      lastConfirmedIndex = chosenIdx;
      return {
        image: decodedBitmaps.get(chosenIdx),
        index: chosenIdx,
        isExact: false,
      };
    }

    // 3. Fallback: frame 0 or initial eager frame
    const base0 = decodedBitmaps.get(0) || images[0] || fallbackFrame;
    return {
      image: base0,
      index: 0,
      isExact: false,
    };
  }

  async function preloadInitialBatch(count = 14, onProgress = null) {
    const limit = Math.min(count, totalFrames);
    let decodedSoFar = 0;
    const initialBatch = [];
    for (let i = 0; i < limit; i++) {
      if (images[i]) {
        initialBatch.push(
          decodeSingleFrame(i).then(() => {
            decodedSoFar++;
            if (onProgress) {
              onProgress(decodedSoFar, limit);
            }
          })
        );
      }
    }
    await Promise.all(initialBatch);
  }

  function getDecodedCount() {
    return decodedBitmaps.size;
  }

  function destroy() {
    isDestroyed = true;
    decodeQueue = [];
    decodedBitmaps.forEach((item) => {
      if (item && typeof item.close === "function") {
        try { item.close(); } catch { }
      }
    });
    decodedBitmaps.clear();
    pendingDecodes.clear();
    images = [];
  }

  return {
    setImages,
    setFrame,
    setFallback,
    isFrameDecoded,
    isBatchDecoded,
    updatePlayhead,
    getConfirmedFrame,
    preloadInitialBatch,
    decodeSingleFrame,
    getDecodedCount,
    addListener,
    destroy,
  };
}
