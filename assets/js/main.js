/* ==========================================================================
   main.js — העוצמה שבך
   Progressive enhancement only: every module guards against missing markup,
   so the page works (and looks the same as before) when JS is unavailable.

   Loaded with `defer` from index.html — no dependencies, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* Flag scripting support so CSS can enhance conditionally
     (e.g. the mobile navigation button stays hidden without JS). */
  document.documentElement.classList.add('has-js');

  /**
   * Runs `fn` once the DOM is ready (defer usually means it already is).
   * @param {() => void} fn
   */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  /**
   * Mobile navigation: toggles `.is-open` on the link list and keeps
   * `aria-expanded` in sync. Desktop CSS never shows the button, so this
   * module is effectively a no-op above the mobile breakpoint.
   */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.links');
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
      setOpen(!links.classList.contains('is-open'));
    });

    /* Close the menu after picking a destination */
    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  /**
   * Writes the current year into `[data-current-year]` (footer),
   * replacing the hard-coded fallback that ships in the HTML.
   */
  function initCurrentYear() {
    var slots = document.querySelectorAll('[data-current-year]');
    if (!slots.length) return;

    var year = String(new Date().getFullYear());
    slots.forEach(function (slot) {
      slot.textContent = year;
    });
  }

  /**
   * Scroll-spy: marks the navigation link of the section currently in view
   * with `.is-current`. Uses IntersectionObserver when available.
   */
  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.links a[href^="#"]')
    );
    if (!links.length || typeof IntersectionObserver === 'undefined') return;

    var sections = links
      .map(function (link) {
        return document.getElementById(link.hash.slice(1));
      })
      .filter(Boolean);
    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          links.forEach(function (link) {
            link.classList.toggle(
              'is-current',
              link.hash === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  ready(function () {
    initNavToggle();
    initCurrentYear();
    initScrollSpy();
  });
})();