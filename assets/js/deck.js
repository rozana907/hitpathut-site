/* ==========================================================================
   deck.js — slide deck behaviour for the presentation pages (scarcity.html).
   No dependencies. Nothing is hidden without JS: the CSS only switches the
   deck into "one slide at a time" mode once main.js has flagged .has-js.

   Keyboard (RTL): ArrowLeft / Space / PageDown advance, ArrowRight / PageUp
   go back, Home and End jump to the edges. Touch: swipe left to advance.
   ========================================================================== */

(function () {
  'use strict';

  var SLIDE = '\u05e9\u05e7\u05d5\u05e4\u05d9\u05ea '; /* "slide "  */
  var OF = ' \u05de\u05ea\u05d5\u05da ';               /* " of "  */

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function initDeck() {
    var deck = document.querySelector('[data-deck]');
    if (!deck) return;

    var slides = Array.prototype.slice.call(
      deck.querySelectorAll('[data-slide]')
    );
    if (!slides.length) return;

    var total = slides.length;
    var prevBtn = deck.querySelector('[data-deck-prev]');
    var nextBtn = deck.querySelector('[data-deck-next]');
    var dotsBox = deck.querySelector('[data-deck-dots]');
    var countEl = deck.querySelector('[data-deck-count]');
    var barEl = deck.querySelector('[data-deck-progress]');
    var dots = [];
    var current = 0;

    /* ---- dot navigation ------------------------------------------------- */
    if (dotsBox) {
      slides.forEach(function (slide, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'deck__dot';
        dot.setAttribute('aria-label', SLIDE + (i + 1));
        dot.addEventListener('click', function () {
          show(i, true);
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    /* ---- helpers -------------------------------------------------------- */
    function hashIndex() {
      var n = parseInt((window.location.hash || '').slice(1), 10);
      if (isNaN(n) || n < 1 || n > total) return 0;
      return n - 1;
    }

    function syncHash() {
      var hash = '#' + (current + 1);
      if (window.location.hash === hash) return;
      if (!window.location.hash && current === 0) return;
      /* location.replace() keeps the history clean and also works when the
         page is opened directly from the file system. */
      window.location.replace(hash);
    }

    function show(index, scroll) {
      current = Math.max(0, Math.min(total - 1, index));

      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle('is-active', active);
        if (active) slide.removeAttribute('aria-hidden');
        else slide.setAttribute('aria-hidden', 'true');
        /* keep keyboard focus out of the hidden slides where supported */
        if ('inert' in slide) slide.inert = !active;
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        if (i === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });

      if (countEl) countEl.textContent = current + 1 + OF + total;
      if (barEl) barEl.style.width = ((current + 1) / total) * 100 + '%';
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;

      if (scroll && deck.getBoundingClientRect().top < 0) {
        deck.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }

      syncHash();
    }

    function go(step) {
      show(current + step, true);
    }

    /* ---- controls ------------------------------------------------------- */
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); });

    document.addEventListener('keydown', function (event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      var tag = (event.target && event.target.tagName) || '';
      if (/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(tag)) return;

      var key = event.key;
      if (key === 'ArrowLeft' || key === ' ' || key === 'PageDown') go(1);
      else if (key === 'ArrowRight' || key === 'PageUp') go(-1);
      else if (key === 'Home') show(0, true);
      else if (key === 'End') show(total - 1, true);
      else return;

      event.preventDefault();
    });

    window.addEventListener('hashchange', function () {
      var n = hashIndex();
      if (n !== current) show(n, false);
    });

    /* ---- touch (swipe left = next, matching the RTL reading order) ------ */
    var startX = null;

    deck.addEventListener('touchstart', function (event) {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    deck.addEventListener('touchend', function (event) {
      if (startX === null) return;
      var dx = event.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      go(dx < 0 ? 1 : -1);
    }, { passive: true });

    show(hashIndex(), false);
  }

  ready(initDeck);
})();