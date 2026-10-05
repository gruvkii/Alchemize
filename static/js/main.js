/* ═══════════════════════════════════════════════════════════════
   ALCHEMIZE — Main JavaScript (Plain ES6)
   FAQ Accordion Toggle · Marquee Pause Handling
   ═══════════════════════════════════════════════════════════════ */

'use strict';

function initAlchemize() {

  /* ──────────────────────────
     1. FAQ ACCORDION
     ────────────────────────── */
  const accordion = document.getElementById('faq-accordion');

  if (accordion) {
    const triggers = accordion.querySelectorAll('[data-accordion-trigger]');

    triggers.forEach((trigger) => {
      // Initialise panels as hidden
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) {
        panel.setAttribute('aria-hidden', 'true');
        panel.style.maxHeight = '0px';
      }

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        const targetPanel = document.getElementById(trigger.getAttribute('aria-controls'));

        if (!targetPanel) return;

        if (isOpen) {
          // ── Close this panel ──
          trigger.setAttribute('aria-expanded', 'false');
          targetPanel.setAttribute('aria-hidden', 'true');
          targetPanel.style.maxHeight = '0px';
        } else {
          // ── Close any currently open panel first (single-open behaviour) ──
          triggers.forEach((otherTrigger) => {
            if (otherTrigger !== trigger) {
              const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
              if (otherTrigger.getAttribute('aria-expanded') === 'true') {
                otherTrigger.setAttribute('aria-expanded', 'false');
                if (otherPanel) {
                  otherPanel.setAttribute('aria-hidden', 'true');
                  otherPanel.style.maxHeight = '0px';
                }
              }
            }
          });

          // ── Open the clicked panel ──
          trigger.setAttribute('aria-expanded', 'true');
          targetPanel.setAttribute('aria-hidden', 'false');
          // Compute the full scroll height and set it for smooth CSS transition
          targetPanel.style.maxHeight = targetPanel.scrollHeight + 'px';
        }
      });
    });
  }


  /* ──────────────────────────
     2. MARQUEE PAUSE ON HOVER
     ────────────────────────── */
  // The marquee pause is handled in Tailwind via
  //   group-hover:[animation-play-state:paused] on the track.
  // However, we also wire up JS-based pause for keyboard/touch accessibility.

  const marquees = document.querySelectorAll('[data-marquee]');

  marquees.forEach((m) => {
    const track = m.querySelector('[data-marquee-track]');
    if (!track) return;

    // Pause on focus-within (keyboard navigation into a marquee item)
    m.addEventListener('focusin', () => {
      track.style.animationPlayState = 'paused';
    });

    m.addEventListener('focusout', () => {
      track.style.animationPlayState = 'running';
    });

    // Touch devices: pause on touchstart, resume on touchend
    m.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });

    m.addEventListener('touchend', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  });


  /* ──────────────────────────
     3. SMOOTH SCROLL (Lenis)
     ────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.Lenis && !prefersReducedMotion) {
    const lenis = new Lenis({
      duration: 1.2,                                            // glide length (seconds)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // soft ease-out
      smoothWheel: true,
      anchors: true                                             // smooth-scroll #hash links
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initAlchemize); } else { initAlchemize(); }

