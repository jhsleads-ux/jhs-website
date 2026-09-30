// =========================================
// scrollRefresh — single coordinated ScrollTrigger refresh
// -----------------------------------------
// Root cause this module exists to kill:
//
// App.jsx and scrollFX.js used to call the GLOBAL `ScrollTrigger.refresh()`
// from six independent places — a 300ms Lenis timer, a window `load` handler,
// a `qb-loader-done` event listener, a 900ms QuoteBook timer, an rAF in the
// story section, a 400ms timer, and a 600ms ScrollFX timer. Several of those
// fire AFTER the pinned hscroll strip and the sticky sections have already
// measured themselves.
//
// Every global refresh makes ScrollTrigger re-measure and re-apply pin state
// for EVERY trigger on the page. When two refreshes land while the user is
// mid-scroll, the hscroll pin gets re-baked from a half-settled layout: its
// start/end stop matching the spacer height, so the strip jumps start↔end and
// skips every middle card, and the pinned element's `position:fixed`/`top`
// pair goes inconsistent (we measured `position: fixed` at `top: -6179px`,
// i.e. pinned but nowhere near the viewport).
//
// The fix: one debounced entry point. Any number of callers may request a
// refresh; they collapse into a SINGLE `ScrollTrigger.refresh()` on the next
// animation frame after the storm settles. Targeted refreshes of one trigger
// (`st.refresh()`) are still preferred where available and are NOT routed
// through here.
// =========================================
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pending = 0;
let rafId = 0;
let scheduled = false;
let scrollWaitTimeout = 0;

/**
 * Request a global ScrollTrigger refresh. Safe to call many times in the same
 * frame — only one real refresh runs. If the user is actively scrolling,
 * defers execution until scrolling pauses to prevent mid-scroll layout freezes.
 */
export function requestScrollRefresh() {
  pending += 1;
  if (scheduled) return;
  scheduled = true;

  const attemptRefresh = () => {
    const isAtTop = typeof window !== "undefined" && (window.scrollY === 0 || !window.scrollY);
    const isScrolling =
      typeof window !== "undefined" &&
      (window.__isUserScrolling || (window.__lenis && window.__lenis.isScrolling));

    if (!isAtTop && isScrolling) {
      clearTimeout(scrollWaitTimeout);
      scrollWaitTimeout = setTimeout(attemptRefresh, 200);
      return;
    }

    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        scheduled = false;
        const count = pending;
        pending = 0;
        if (count > 0) {
          ScrollTrigger.refresh();
        }
      });
    });
  };

  attemptRefresh();
}

/** Cancel any refresh that has not fired yet (call on unmount). */
export function cancelScrollRefresh() {
  if (rafId) cancelAnimationFrame(rafId);
  if (scrollWaitTimeout) clearTimeout(scrollWaitTimeout);
  scheduled = false;
  pending = 0;
}

