// ==============================================================================
// frameDecoder.js — High-Performance Frame Decoder & Texture Synchronizer
// ------------------------------------------------------------------------------
// Eliminates stutter, shivering, frame skipping, and delayed rendering during scroll.
// 1. Delivers exact requested frames directly from pre-warmed image cache.
// 2. Pre-decodes frames asynchronously via native img.decode() without GC thrashing.
// 3. Smooth bidirectional fallback only during initial asset download streaming.
// ==============================================================================

export function createFrameDecoder({
  totalFrames,
  windowAhead = 16,
  windowBehind = 8,
  maxDecodedBudget = 100,
  onFrameDecoded = null,
}) {
  let images = new Array(totalFrames).fill(null);
  const decodedBitmaps = new Map(); // frameIndex -> HTMLImageElement | ImageBitmap
  const pendingDecodes = new Set();
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
  let scrollDirection = 1;
  let isDestroyed = false;
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
    if (decodedBitmaps.has(index)) return true;
    const img = images[index];
    return Boolean(img && (img.naturalWidth > 0 || img.width > 0));
  }

  function isBatchDecoded(startIndex = 0, count = 16) {
    const limit = Math.min(startIndex + count, totalFrames);
    if (limit <= startIndex) return false;
    for (let i = startIndex; i < limit; i++) {
      if (!isFrameDecoded(i)) return false;
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
      if (typeof img.decode === "function") {
        try {
          await img.decode();
        } catch { }
      }
      if (!isDestroyed && pendingDecodes.has(index)) {
        decodedBitmaps.set(index, img);
        notifyFrameDecoded(index);
      }
    } catch {
      // Decode error or abort: ignore and keep pending cleared
    } finally {
      pendingDecodes.delete(index);
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

    // Asynchronously pre-warm frames in the direction of scroll
    const aheadLimit = scrollDirection >= 0
      ? Math.min(totalFrames - 1, clamped + windowAhead)
      : Math.max(0, clamped - windowAhead);
    const start = Math.min(clamped, aheadLimit);
    const end = Math.max(clamped, aheadLimit);

    for (let i = start; i <= end; i++) {
      if (!decodedBitmaps.has(i) && images[i]) {
        decodeSingleFrame(i);
      }
    }
  }

  /**
   * Retrieves the best confirmed frame for rendering.
   * Guarantees exact frame presentation whenever loaded,
   * completely eliminating frame skips, jumps, and shivering.
   */
  function getConfirmedFrame(requestedFrame) {
    const target = Math.max(0, Math.min(totalFrames - 1, requestedFrame));

    // 1. Decoded bitmap ready?
    if (decodedBitmaps.has(target)) {
      lastConfirmedIndex = target;
      return {
        image: decodedBitmaps.get(target),
        index: target,
        isExact: true,
      };
    }

    // 2. Direct loaded image element ready?
    const directImg = images[target];
    if (directImg && (directImg.naturalWidth > 0 || directImg.complete)) {
      lastConfirmedIndex = target;
      return {
        image: directImg,
        index: target,
        isExact: true,
      };
    }

    // 3. Fallback to nearest loaded frame around target (only during initial streaming)
    for (let offset = 1; offset < totalFrames; offset++) {
      const before = target - offset;
      if (before >= 0) {
        const bImg = decodedBitmaps.get(before) || (images[before]?.naturalWidth > 0 ? images[before] : null);
        if (bImg) {
          lastConfirmedIndex = before;
          return { image: bImg, index: before, isExact: false };
        }
      }
      const after = target + offset;
      if (after < totalFrames) {
        const aImg = decodedBitmaps.get(after) || (images[after]?.naturalWidth > 0 ? images[after] : null);
        if (aImg) {
          lastConfirmedIndex = after;
          return { image: aImg, index: after, isExact: false };
        }
      }
    }

    // 4. Baseline fallback: frame 0 or fallbackFrame
    const base0 = decodedBitmaps.get(0) || images[0] || fallbackFrame;
    return {
      image: base0,
      index: 0,
      isExact: false,
    };
  }

  async function preloadInitialBatch(count = 16, onProgress = null) {
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

