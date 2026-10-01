// =========================================
// scrollFX — premium scroll effects layer
// Inspired by: thewatch.60fps.fr (custom cursor, velocity marquee),
// noth.in (image parallax + clip reveals), aardvarkbookclub.com
// (playful marquee, magnetic CTA), thebhiveresort / mhdesignbuild
// (scroll progress, section pop-ins)
// =========================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requestScrollRefresh, cancelScrollRefresh } from "./scrollRefresh";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function ScrollFX() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduceMotion()) return undefined;

    // declared here so the cleanup below can always see it
    let marqueeTween = null;

    const ctx = gsap.context(() => {
      /* ---------- 1. Scroll progress bar (top gold line) ---------- */
      const bar = document.querySelector(".page-progress");
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: "max", scrub: true },
          },
        );
        bar.style.transformOrigin = "left center";
      }

      /* ---------- 2. Image parallax (GPU accelerated) ---------- */
      const parallaxImgs = gsap.utils.toArray(
        ".image-card img, .gallery-tile img, " +
          ".blog-image img, .intro-feature-image img, " +
          ".academic-tracks img, .honors-feature img, .event-body img",
      );
      parallaxImgs.forEach((img) => {
        const holder = img.parentElement;
        if (!holder) return;
        img.classList.add("fx-parallax");
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: holder,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      /* ---------- 3. Consolidated GPU-accelerated image reveals with inner zoom ---------- */
      gsap.utils
        .toArray(
          ".image-card, .intro-image, " +
            ".honor-card, .gallery-tile, .story-image-frame, .academic-track-media, .honor-card-media",
        )
        .forEach((el) => {
          const innerImg = el.querySelector("img");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onComplete: () => {
              gsap.set(el, { clearProps: "opacity" });
              if (innerImg) gsap.set(innerImg, { clearProps: "transform,scale" });
              el.classList.add("revealed");
            },
          });
          tl.fromTo(el, { opacity: 0.88 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
          if (innerImg) {
            tl.fromTo(innerImg, { scale: 1.06 }, { scale: 1.0, duration: 0.6, ease: "power2.out" }, 0);
          }
        });

      /* ---------- 4. Velocity marquee (60fps style - lightweight & smooth) ---------- */
      const track = document.querySelector(".marquee-track");
      if (track) {
        track.style.animation = "none";
        marqueeTween = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 22,
          ease: "none",
        });
        const clampSpeed = gsap.utils.clamp(1, 3.5);
        let marqueeVelocityTicking = false;
        ScrollTrigger.create({
          trigger: track.closest("section") || track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (marqueeVelocityTicking) return;
            marqueeVelocityTicking = true;
            requestAnimationFrame(() => {
              const v = Math.abs(self.getVelocity()) / 900;
              const targetSpeed = v > 0.15 ? clampSpeed(1 + v) : 1;
              const currentSpeed = marqueeTween.timeScale();
              if (Math.abs(targetSpeed - currentSpeed) > 0.1) {
                gsap.to(marqueeTween, {
                  timeScale: targetSpeed,
                  duration: targetSpeed > 1 ? 0.35 : 0.8,
                  overwrite: "auto",
                });
              }
              marqueeVelocityTicking = false;
            });
          },
        });
        // settle back to normal speed
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onRefresh: () => {
            gsap.to(marqueeTween, {
              timeScale: 1,
              duration: 0.8,
              overwrite: true,
            });
          },
        });
      }

      /* ---------- 5. Stat strip pop-in (aardvark style) ---------- */
      const stats = document.querySelectorAll(
        ".stat-strip b, .stat-strip span",
      );
      if (stats.length) {
        gsap.from(stats, {
          y: 34,
          opacity: 0,
          rotate: 2,
          stagger: 0.09,
          duration: 0.9,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: ".stat-strip",
            start: "top 88%",
            once: true,
          },
        });
      }

      /* ---------- 6. CTA headline word slide + magnetic circle ---------- */
      const ctaH2 = document.querySelector(".cta h2");
      if (ctaH2 && !ctaH2.dataset.fxSplit) {
        ctaH2.dataset.fxSplit = "1";
        const words = ctaH2.textContent.trim().split(/\s+/);
        ctaH2.innerHTML = words
          .map(
            (w) =>
              `<span class="fx-word-mask"><span class="fx-word">${w}</span></span>`,
          )
          .join(" ");
        gsap.from(ctaH2.querySelectorAll(".fx-word"), {
          yPercent: 120,
          rotate: 4,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: { trigger: ctaH2, start: "top 85%", once: true },
        });
      }

      /* ---------- 7. Magnetic buttons (60fps style) ---------- */
      if (finePointer()) {
        gsap.utils
          .toArray(".circle-cta, .header-cta, .pill.green")
          .forEach((btn) => {
            if (btn.dataset.fxMagnet) return;
            btn.dataset.fxMagnet = "1";
            const xTo = gsap.quickTo(btn, "x", { duration: 0.35 });
            const yTo = gsap.quickTo(btn, "y", { duration: 0.35 });
            const move = (e) => {
              const r = btn.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            btn.addEventListener("mousemove", move);
            btn.addEventListener("mouseleave", leave);
          });
      }

      /* ---------- 8. Big rows: slide + image wipe ---------- */
      gsap.utils.toArray(".big-row").forEach((row) => {
        gsap.from(row, {
          x: -46,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
        });
      });

      /* ---------- 9. Footer link cascade ---------- */
      const footerLinks = document.querySelectorAll(".footer-links > div");
      if (footerLinks.length) {
        gsap.from(footerLinks, {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".footer", start: "top 82%", once: true },
        });
      }

      /* ---------- 10. Page intro content entrance animation ----------
         Premium fade + reveal with a sequential stagger of the copy's
         inner elements. Reversible: re-plays when you scroll back up to
         the section, but never hides content while it's above the fold
         (we only reset on onLeaveBack). CSS drives the actual transitions
         via the `.visible` class + per-child --reveal-i index. */
      gsap.utils.toArray(".page-intro-content").forEach((section) => {
        // Assign a stagger index to each direct child of the copy column
        // so CSS can delay them sequentially.
        const copy = section.querySelector(".page-intro-copy");
        if (copy && !copy.dataset.fxStaggered) {
          copy.dataset.fxStaggered = "1";
          Array.from(copy.children).forEach((child, i) => {
            child.style.setProperty("--reveal-i", i);
          });
        }
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => section.classList.add("visible"),
          once: true,
        });
      });

      /* ---------- 11. AARDVARK-INSPIRED: Text Scramble Effect ---------- */
      gsap.utils.toArray("[data-text-scramble]").forEach((el) => {
        const text = el.textContent;
        el.textContent = "";

        // Create character spans
        text.split("").forEach((char, i) => {
          const span = document.createElement("span");
          span.className = "text-scramble-char";
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.animationDelay = `${i * 0.03}s`;
          el.appendChild(span);
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            el.querySelectorAll(".text-scramble-char").forEach((char, i) => {
              gsap.fromTo(
                char,
                {
                  opacity: 0,
                  y: 30,
                  rotationX: -60,
                  scale: 0.8,
                  filter: "blur(3px)",
                },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 0.6,
                  delay: i * 0.03,
                  ease: "back.out(1.7)",
                },
              );
            });
          },
          once: true,
        });
      });

      /* ---------- 12. AARDVARK-INSPIRED: Bouncy Card Grid Reveal ---------- */
      gsap.utils.toArray("[data-bouncy-grid]").forEach((grid) => {
        const cards = grid.querySelectorAll(":scope > *");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 60,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              delay: i * 0.08,
              ease: "elastic.out(1, 0.75)",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            },
          );
        });
      });

      /* ---------- 13. AARDVARK-INSPIRED: Magnetic Buttons Enhanced ---------- */
      gsap.utils.toArray("[data-magnetic-btn]").forEach((btn) => {
        if (btn.dataset.fxMagnet) return;
        btn.dataset.fxMagnet = "1";

        const xTo = gsap.quickTo(btn, "x", {
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        });
        const yTo = gsap.quickTo(btn, "y", {
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
        });
        const scaleTo = gsap.quickTo(btn, "scale", { duration: 0.3 });

        const move = (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) * 0.35;
          const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
          xTo(x);
          yTo(y);
          scaleTo(1.08);
        };

        const leave = () => {
          xTo(0);
          yTo(0);
          scaleTo(1);
        };

        btn.addEventListener("mousemove", move);
        btn.addEventListener("mouseleave", leave);
      });

      /* ---------- 14. AARDVARK-INSPIRED: Number Counter Animation ---------- */
      gsap.utils.toArray("[data-counter]").forEach((el) => {
        const target = parseInt(el.dataset.counter, 10) || 0;
        const suffix = el.dataset.counterSuffix || "";
        const prefix = el.dataset.counterPrefix || "";
        const duration = parseFloat(el.dataset.counterDuration) || 2;

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: duration,
              ease: "power2.out",
              onUpdate: function () {
                el.textContent =
                  prefix + Math.round(obj.val).toLocaleString() + suffix;
              },
            });
          },
          once: true,
        });
      });

      /* ---------- 15. AARDVARK-INSPIRED: Word Reveal Animation ---------- */
      gsap.utils.toArray("[data-word-reveal]").forEach((el) => {
        const words = el.textContent.split(" ");
        el.innerHTML = "";

        words.forEach((word) => {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.overflow = "hidden";
          wordSpan.style.marginRight = "0.25em";

          const innerSpan = document.createElement("span");
          innerSpan.textContent = word;
          innerSpan.style.display = "inline-block";
          innerSpan.style.opacity = "0";
          innerSpan.style.transform = "translateY(100%)";

          wordSpan.appendChild(innerSpan);
          el.appendChild(wordSpan);
        });

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.to(el.querySelectorAll("span span"), {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            });
          },
          once: true,
        });
      });

      /* ---------- 16. AARDVARK-INSPIRED: Spotlight Effect ---------- */
      gsap.utils.toArray("[data-spotlight]").forEach((el) => {
        let spotRaf = false;
        let mouseX = 0, mouseY = 0;
        let rect = null;
        const handleEnter = () => {
          rect = el.getBoundingClientRect();
        };
        const handleMove = (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!spotRaf) {
            spotRaf = true;
            requestAnimationFrame(() => {
              if (!rect) rect = el.getBoundingClientRect();
              const x = mouseX - rect.left;
              const y = mouseY - rect.top;
              el.style.setProperty("--mouse-x", `${x}px`);
              el.style.setProperty("--mouse-y", `${y}px`);
              spotRaf = false;
            });
          }
        };
        const handleLeave = () => {
          rect = null;
        };

        el.addEventListener("mouseenter", handleEnter, { passive: true });
        el.addEventListener("mousemove", handleMove, { passive: true });
        el.addEventListener("mouseleave", handleLeave, { passive: true });
      });

      /* ---------- 17. AARDVARK-INSPIRED: Scroll-triggered animations ---------- */
      gsap.utils.toArray("[data-scroll-fade-up]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("visible"),
          once: true,
        });
      });

      gsap.utils.toArray("[data-scroll-scale]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("visible"),
          once: true,
        });
      });

      gsap.utils.toArray("[data-scroll-slide-left]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("visible"),
          once: true,
        });
      });

      gsap.utils.toArray("[data-scroll-slide-right]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("visible"),
          once: true,
        });
      });

      /* ---------- 18. AARDVARK-INSPIRED: Pulse CTA ---------- */
      gsap.utils.toArray("[data-pulse-cta]").forEach((el) => {
        el.classList.add("pulse-cta");
      });

      /* ---------- 19. AARDVARK-INSPIRED: Gradient Border ---------- */
      gsap.utils.toArray("[data-gradient-border]").forEach((el) => {
        el.classList.add("gradient-border");
      });

      /* ---------- 20. AARDVARK-INSPIRED: Scroll Reveal ---------- */
      gsap.utils.toArray(".scroll-reveal").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => el.classList.add("is-visible"),
          once: true,
        });
      });

      /* ---------- 21. AARDVARK-INSPIRED: Spotlight Card Mouse Tracking ---------- */
      gsap.utils.toArray(".spotlight-card").forEach((card) => {
        let moveRaf = false;
        let rect = null;
        const onEnter = () => { rect = card.getBoundingClientRect(); };
        const onMove = (e) => {
          if (moveRaf) return;
          moveRaf = true;
          requestAnimationFrame(() => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            moveRaf = false;
          });
        };
        const onLeave = () => { rect = null; };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });

      /* ---------- 22. AARDVARK-INSPIRED: Floating Books (Viewport-Throttled) ----------
         Depth-aware parallax: near books drift more, far books less.
         Paused automatically when off-screen to preserve 60fps scroll. */
      const bookObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const tweens = gsap.getTweensOf(entry.target);
            if (entry.isIntersecting) {
              tweens.forEach((tw) => tw.play());
            } else {
              tweens.forEach((tw) => tw.pause());
            }
          });
        },
        { rootMargin: "250px 0px" }
      );

      gsap.utils.toArray(".floating-book").forEach((book, i) => {
        const far = book.classList.contains("floating-book--depth-far");
        const amp = far ? 6 : 12;
        gsap.to(book, {
          x: i % 2 ? -amp : amp,
          duration: 7 + (i % 4) * 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(book, {
          rotate: (i % 2 ? 1 : -1) * (far ? 3 : 5),
          duration: 5 + (i % 3) * 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
        bookObserver.observe(book);
      });

      /* ---------- 23. AARDVARK-INSPIRED: Books scroll parallax ----------
         Books glide at slightly different rates as you scroll — near books
         lead, far books lag — so the cluster feels dimensional. */
      gsap.utils.toArray(".floating-books-decoration").forEach((cloud) => {
        gsap.utils
          .toArray(cloud.querySelectorAll(".floating-book"))
          .forEach((book, i) => {
            const far = book.classList.contains("floating-book--depth-far");
            gsap.fromTo(
              book,
              { y: 0 },
              {
                y: (i % 2 ? -1 : 1) * (far ? 18 : 34 + i * 6),
                ease: "none",
                scrollTrigger: {
                  trigger: cloud.closest(".hero-scroll") || cloud,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.8,
                },
              },
            );
          });
      });

      /* ---------- 23b. Subtle 3D scrub tilt on the layered books ---------- */
      gsap.utils
        .toArray(".floating-book:not(.floating-book--depth-far)")
        .forEach((book, i) => {
          gsap.fromTo(
            book.querySelector(".floating-book-inner"),
            { rotateY: -6, rotateX: 3 },
            {
              rotateY: 8,
              rotateX: -3,
              ease: "none",
              scrollTrigger: {
                trigger: book,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

      /* ---------- 24. AARDVARK-INSPIRED: Section heading gold sweep ---------- */
      gsap.utils.toArray(".section-head").forEach((head) => {
        if (head.dataset.fxSweep) return;
        head.dataset.fxSweep = "1";
        const kicker = head.querySelector(".sh-kicker");
        const rule = head.querySelector(".sh-rule");
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: head, start: "top 86%", once: true },
          });
        }
        if (kicker) {
          gsap.from(kicker, {
            opacity: 0,
            y: 0,
            letterSpacing: "0.35em",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: head, start: "top 86%", once: true },
          });
        }
      });

      /* ---------- 25. AARDVARK-INSPIRED: Playful 3D tilt on interactive cards ----------
         Subtle 3D hover tilt (desktop only). Composes with existing hover CSS
         because it drives `rotateX/rotateY` only. */
      if (finePointer()) {
        gsap.utils
          .toArray(
            ".image-card, .gallery-tile, .blog-card, .honor-card, .academic-card, .document-card, .story-image-frame, .story-grid-card, .feature-card",
          )
          .forEach((card) => {
            if (card.dataset.fxTilt) return;
            card.dataset.fxTilt = "1";
            const rx = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
            const ry = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });
            let r = null;
            let moveRaf = false;
            card.addEventListener("mouseenter", () => {
              card.style.willChange = "transform";
              r = card.getBoundingClientRect();
            });
            card.addEventListener("mousemove", (e) => {
              if (moveRaf) return;
              moveRaf = true;
              requestAnimationFrame(() => {
                if (!r) r = card.getBoundingClientRect();
                const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
                const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
                ry(px * 7);
                rx(-py * 7);
                const mx = ((e.clientX - r.left) / r.width) * 100;
                const my = ((e.clientY - r.top) / r.height) * 100;
                card.style.setProperty("--mouse-x", `${mx}%`);
                card.style.setProperty("--mouse-y", `${my}%`);
                card.style.setProperty("--glare-opacity", "1");
                moveRaf = false;
              });
            });
            card.addEventListener("mouseleave", () => {
              r = null;
              rx(0);
              ry(0);
              card.style.setProperty("--glare-opacity", "0");
              card.style.willChange = "auto";
            });
          });
      }

      /* ---------- 26. Smooth page transition (fade + lift on route change) ----------
         Pure visual: runs after the new page mounts; never blocks rendering.

         CRITICAL — this is why the horizontal gallery skipped its middle cards.
         Animating `y` on <main> makes GSAP write an inline
         `transform: translate(0px, 0px)` on it that it NEVER removes. A
         non-`none` transform turns <main> into the containing block for every
         `position: fixed` descendant — so ScrollTrigger's pinned
         .hscroll-section ended up fixed *relative to <main>* instead of the
         viewport, and slid off the top of the screen (measured top: -6179px
         while `position: fixed`) as soon as the pin engaged. The track then
         travelled its full distance with nothing on screen, which reads as
         "only the first and last cards are ever visible".

         Fix: drive the entrance on a transform-free property (opacity) and
         explicitly clear any leftover inline transform/translate so <main>
         stays a plain, un-transformed containing block forever. */
      const mainEl = document.querySelector("#root main, main");
      if (mainEl) {
        gsap.set(mainEl, {
          translate: "none",
          rotate: "none",
          scale: "none",
          transform: "none",
        });
        gsap.fromTo(
          mainEl,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "opacity,transform,translate,rotate,scale",
          },
        );
      }

      /* ---------- 27. Floating decorative elements (anthem quote mark) ---------- */
      gsap.utils
        .toArray(".anthem-mark span")
        .forEach((el, i) => {
          gsap.to(el, {
            y: -8,
            rotate: i % 2 ? 2.5 : -2.5,
            duration: 4 + (i % 3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

      /* ---------- 28. Editorial marquee (em-track) velocity scroll ---------- */
      const emTrack = document.querySelector(".em-track");
      if (emTrack) {
        emTrack.style.animation = "none";
        const existingAnim = gsap.getTweensOf(emTrack)[0];
        if (!existingAnim) {
          const emTween = gsap.to(emTrack, {
            xPercent: -50,
            repeat: -1,
            duration: 30,
            ease: "none",
          });
          let emVelocityTicking = false;
          ScrollTrigger.create({
            trigger: emTrack.closest(".editorial-marquee") || emTrack,
            start: "top 95%",
            end: "bottom top",
            onUpdate: (self) => {
              if (emVelocityTicking) return;
              emVelocityTicking = true;
              requestAnimationFrame(() => {
                const v = Math.abs(self.getVelocity()) / 1100;
                const targetScale = v > 0.12 ? gsap.utils.clamp(1, 3)(1 + v) : 1;
                const currentScale = emTween.timeScale();
                if (Math.abs(targetScale - currentScale) > 0.08) {
                  gsap.to(emTween, {
                    timeScale: targetScale,
                    duration: targetScale > 1 ? 0.35 : 0.8,
                    overwrite: "auto",
                  });
                }
                emVelocityTicking = false;
              });
            },
          });
        }
      }

      /* ---------- 29. Cinematic image reveal (cr-image) — clip-path scrub ----------
         Picks up images that were NOT already animated in-component (e.g. if React
         rendered them after scrollFX ran). Checks for the sentinel class first. */
      gsap.utils.toArray(".cr-image").forEach((img) => {
        if (img.dataset.fxClipDone) return;
        img.dataset.fxClipDone = "1";
        gsap.fromTo(
          img,
          { clipPath: "inset(0 100% 0 0)", scale: 1.1 },
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: img, start: "top 80%", once: true },
            onComplete: () => {
              img.classList.add("cr-revealed");
            },
          }
        );
      });

      /* ---------- 30. Cinematic reveal copy words stagger ---------- */
      gsap.utils.toArray(".cr-copy").forEach((copy) => {
        if (copy.dataset.fxRevealDone) return;
        copy.dataset.fxRevealDone = "1";
        gsap.fromTo(
          Array.from(copy.children),
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: copy, start: "top 78%", once: true },
          }
        );
      });

      /* ---------- 31. Section divider line draw ---------- */
      gsap.utils.toArray(".sd-line").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: line, start: "top 90%", once: true },
          }
        );
      });

      /* ---------- 32. Horizontal scroll track: marquee coordination owned cleanly by HorizontalScrollStrip ---------- */

      /* ---------- 33. Sticky storyteller: transitions owned cleanly by StickyStoryteller component ---------- */

      /* ---------- 34. CTA headline premium entrance ---------- */
      const ctaSection = document.querySelector(".cta--editorial");
      if (ctaSection && !ctaSection.dataset.fxCta) {
        ctaSection.dataset.fxCta = "1";
      }

      /* ---------- 35. Story-section books: handled cleanly in cloud parallax above ---------- */

      /* ---------- 36. hscroll-card image parallax inside the horizontal strip ----------
         Uses the horizontal strip's own scrubbed tween as the
         containerAnimation. The strip exposes it on the track node
         (track.__hscrollTween) so we don't depend on gsap.getTweensOf
         timing. Only runs on desktop where the strip is actually pinned;
         on mobile the strip wraps and has no tween. */
      const attachHscrollParallax = () => {
        const hscrollTrack = document.querySelector(".hscroll-track");
        const hscrollTween =
          hscrollTrack && hscrollTrack.__hscrollTween
            ? hscrollTrack.__hscrollTween
            : null;
        if (hscrollTween) {
          gsap.utils.toArray(".hscroll-card img").forEach((img) => {
            if (img.dataset.fxParallax) return;
            img.dataset.fxParallax = "1";
            gsap.fromTo(
              img,
              { scale: 1.08, xPercent: -4 },
              {
                scale: 1,
                xPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: img.closest(".hscroll-card"),
                  containerAnimation: hscrollTween,
                  start: "left right",
                  end: "right left",
                  scrub: 0.8,
                },
              }
            );
          });
        }
      };
      attachHscrollParallax();
      document.addEventListener("qb-loader-done", attachHscrollParallax, { once: true });

      /* ---------- 38. data-split-reveal: word-by-word slide-up reveal ---------- */
      gsap.utils.toArray("[data-split-reveal]").forEach((el) => {
        if (el.dataset.fxSplit) return;
        el.dataset.fxSplit = "1";

        const rawText = el.textContent.trim();
        const words = rawText.split(/\s+/);
        el.innerHTML = words.map((word) =>
          `<span class="sr-word-wrap"><span class="sr-word">${word}</span></span>`
        ).join(" ");

        const wordEls = el.querySelectorAll(".sr-word");
        ScrollTrigger.create({
          trigger: el,
          start: "top 84%",
          onEnter: () => {
            wordEls.forEach((w, i) => {
              setTimeout(() => w.classList.add("sr-visible"), i * 60);
            });
          },
          once: true,
        });
      });

      /* ---------- 39. Section-to-section smooth fade-through ----------
         Adds a subtle opacity animation as each top-level section enters
         the viewport, giving a cinematic breathing feel.

         CRITICAL: this effect must NEVER target a section that is (or
         contains) a pin/sticky owner, and must never touch its transform.
         Writing an inline `opacity < 1` — which GSAP does together with a
         `translate/rotate/scale: none` transform reset — creates a new
         containing block and stacking context on the section. That silently
         breaks `position: sticky` for the qb book viewport and the sticky
         storyteller column, and corrupts ScrollTrigger's pin measurements
         for the hscroll strip (pin baked wrong → only start/end visible).
         Those sections are therefore excluded and the effect runs on the
         inner content only, where it is visually identical. */
      const fxFadeSafe = (sec) =>
        !sec.classList.contains("hero-scroll") &&
        !sec.classList.contains("scroll-reveal") &&
        !sec.classList.contains("cinematic-section") &&
        !sec.matches(".qb-section, .story-section, .hscroll-section, .sticky-storyteller") &&
        !sec.querySelector(
          ":scope > .qb-section, :scope > .qb-sticky, :scope > .hscroll-section, " +
            ":scope > .sticky-storyteller, :scope > .pin-spacer, " +
            ":scope > .sst-sticky"
        ) &&
        !sec.closest(".pin-spacer");

      /* ---------- 39. Section entrance smoothly handled via CSS .scroll-reveal without forced inline opacity ---------- */

      /* ---------- 40. Sticky-storyteller wrapper: uncorrupted sticky positioning ---------- */

      /* ---------- 41. Cinematic-section headline: editorial word rise ----------
         The "OUR PILLARS" heading rises subtly into place — large editorial
         typography motion adapted from the reference sites. Reuses the
         existing scrub pattern; runs once so text stays fully readable. */
      gsap.utils.toArray(".cinematic-section .section-head h2").forEach((h) => {
        if (h.dataset.fxRise) return;
        h.dataset.fxRise = "1";
        gsap.fromTo(h,
          { yPercent: 0, opacity: 0.35 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: h,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.8,
            },
          }
        );
      });

      /* ---------- 42. Section header rule stretch (Royal Baagh style) ---------- */
      gsap.utils.toArray(".sh-rule, .section-line").forEach((rule) => {
        if (rule.dataset.fxRule) return;
        rule.dataset.fxRule = "1";
        gsap.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: rule, start: "top 90%", once: true },
          }
        );
      });

      /* ---------- 43. Watermark numerals float (MH Design Build style) ---------- */
      gsap.utils.toArray(".academic-card-num, .honor-year-num").forEach((num) => {
        if (num.dataset.fxDrift) return;
        num.dataset.fxDrift = "1";
        gsap.fromTo(
          num,
          { y: -14 },
          {
            y: 14,
            ease: "none",
            scrollTrigger: {
              trigger: num.closest("article, .story-row, .journey-card") || num,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      /* ---------- 44. Document card numeral float (MH Design Build style) ---------- */
      gsap.utils.toArray(".document-card .doc-num").forEach((num) => {
        if (num.dataset.fxDrift) return;
        num.dataset.fxDrift = "1";
        gsap.fromTo(
          num,
          { y: -10 },
          {
            y: 10,
            ease: "none",
            scrollTrigger: {
              trigger: num.closest(".document-card") || num,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      /* ---------- 45. Documents meta banner reveal (The B Hive Resort style) ---------- */
      gsap.utils.toArray(".documents-meta-banner").forEach((banner) => {
        if (banner.dataset.fxBanner) return;
        banner.dataset.fxBanner = "1";
        gsap.fromTo(
          banner,
          { y: 0, opacity: 0.6 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: banner, start: "top 88%", once: true },
          }
        );
      });

      /* ---------- 46. Cinematic Parallax Zoom on Showcase Imagery (SeaSats Style) ---------- */
      const showcaseImg = document.querySelector(".intro-image.interactive-showcase img");
      if (showcaseImg) {
        gsap.fromTo(
          showcaseImg,
          { scale: 0.94, yPercent: -4 },
          {
            scale: 1.05,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: ".intro-image.interactive-showcase",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }

      /* ---------- 47. Floating Depth Badges Parallax (SeaSats Style) ---------- */
      gsap.utils.toArray(".floating-depth-badge").forEach((badge) => {
        const speed = parseFloat(badge.dataset.speed || "1");
        gsap.fromTo(
          badge,
          { y: -26 * speed },
          {
            y: 26 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: badge.closest(".interactive-showcase") || badge,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      /* ---------- 48. Atmospheric Background Aura Drift (SeaSats Style) ---------- */
      const auraGold = document.querySelector(".aura-gold");
      const auraEmerald = document.querySelector(".aura-emerald");
      if (auraGold && auraEmerald) {
        gsap.to(auraGold, {
          y: "22vh",
          ease: "none",
          scrollTrigger: { start: "top top", end: "max", scrub: 1.2 },
        });
        gsap.to(auraEmerald, {
          y: "-18vh",
          ease: "none",
          scrollTrigger: { start: "top top", end: "max", scrub: 1.2 },
        });
      }

    }); // end ctx

    /* ---------- Interactive Mouse-Tracking Card Ambient Glow (SeaSats Spec Style) ---------- */
    let glowCleanup = null;
    if (finePointer()) {
      const cards = document.querySelectorAll(".card-glow-track");
      const cardMoveHandlers = [];
      cards.forEach((card) => {
        let rect = null;
        let glowRaf = false;
        const onEnter = () => {
          rect = card.getBoundingClientRect();
        };
        const onMove = (e) => {
          if (glowRaf) return;
          glowRaf = true;
          requestAnimationFrame(() => {
            if (!rect) rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
            glowRaf = false;
          });
        };
        const onLeave = () => {
          rect = null;
        };
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cardMoveHandlers.push({ card, onEnter, onMove, onLeave });
      });
      glowCleanup = () => {
        cardMoveHandlers.forEach(({ card, onEnter, onMove, onLeave }) => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      };
    }

    /* ---------- 10. Custom cursor (60fps style) ---------- */
    let cursorCleanup = null;
    if (finePointer()) {
      const dot = document.createElement("div");
      const ring = document.createElement("div");
      dot.className = "fx-cursor-dot";
      ring.className = "fx-cursor-ring";
      document.body.append(dot, ring);

      const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
      const rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
      const ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

      let cursorRaf = false;
      let mouseX = 0, mouseY = 0;
      const move = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursorRaf) {
          cursorRaf = true;
          requestAnimationFrame(() => {
            dx(mouseX);
            dy(mouseY);
            rx(mouseX);
            ry(mouseY);
            cursorRaf = false;
          });
        }
      };
      const over = (e) => {
        if (e.target.closest("a, button, .image-card, .gallery-tile, input, .interactive-hotspot")) {
          ring.classList.add("fx-cursor-active");
        } else {
          ring.classList.remove("fx-cursor-active");
        }
      };
      window.addEventListener("mousemove", move, { passive: true });
      window.addEventListener("mouseover", over, { passive: true });
      cursorCleanup = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseover", over);
        dot.remove();
        ring.remove();
      };
    }

    return () => {
      cancelScrollRefresh();
      if (marqueeTween) marqueeTween.kill();
      if (cursorCleanup) cursorCleanup();
      if (glowCleanup) glowCleanup();
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
