/* ============================================================
   Inder — portfolio behaviour
   Everything here degrades gracefully without JS.
   ============================================================ */

(function () {
  'use strict';

  try {

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------- */
  /* Mobile menu                                              */
  /* -------------------------------------------------------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');

  function closeMenu() {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  /* -------------------------------------------------------- */
  /* Nav hairline appears once the page has moved             */
  /* -------------------------------------------------------- */
  var bar = document.getElementById('nav-bar');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------- */
  /* Reveal                                                   */
  /* -------------------------------------------------------- */
  var risers = document.querySelectorAll('[data-rise]');

  if (reduced) {
    risers.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    requestAnimationFrame(function () {
      risers.forEach(function (el) {
        var step = parseInt(el.getAttribute('data-rise'), 10) || 1;
        el.style.animationDelay = (step - 1) * 110 + 'ms';
        el.classList.add('is-in');
      });
    });
  }

  var targets = document.querySelectorAll(
    '.sec-head, .stat, .case, .stack-group, .creds li, .tl-item, ' +
    '.about-copy, .portrait, .channels, .form, .sec-foot'
  );

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------- */
  /* Scrollspy                                                */
  /* -------------------------------------------------------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = nav ? nav.querySelectorAll('a') : [];

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* -------------------------------------------------------- */
  /* Hero chart — draws on view, replayable                   */
  /* -------------------------------------------------------- */
  var viz = document.getElementById('viz');
  var vizLine = document.getElementById('viz-line');
  var vizDots = document.getElementById('viz-dots');
  var vizReplay = document.getElementById('viz-replay');

  function countTo(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';

    if (reduced) { el.textContent = prefix + target.toFixed(dec) + suffix; return; }

    var start = null;
    var dur = 1200;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function drawViz() {
    if (!viz || !vizLine) return;

    viz.classList.remove('is-drawn');

    var len = vizLine.getTotalLength();
    vizLine.style.transition = 'none';
    vizLine.style.strokeDasharray = len;
    vizLine.style.strokeDashoffset = reduced ? 0 : len;

    if (vizDots) {
      Array.prototype.forEach.call(vizDots.children, function (dot, i) {
        dot.style.transitionDelay = reduced ? '0ms' : (280 + i * 135) + 'ms';
      });
    }

    void vizLine.getBoundingClientRect();

    requestAnimationFrame(function () {
      if (!reduced) {
        vizLine.style.transition = 'stroke-dashoffset 1300ms cubic-bezier(.35,.8,.35,1)';
      }
      vizLine.style.strokeDashoffset = 0;
      viz.classList.add('is-drawn');
    });

    viz.querySelectorAll('.kpi-val').forEach(countTo);
  }

  if (viz) {
    if (reduced || !('IntersectionObserver' in window)) {
      drawViz();
    } else {
      var vizIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          drawViz();
          vizIo.unobserve(entry.target);
        });
      }, { threshold: 0.3 });
      vizIo.observe(viz);
    }
    if (vizReplay) vizReplay.addEventListener('click', drawViz);
  }

  /* -------------------------------------------------------- */
  /* Lightbox                                                 */
  /* -------------------------------------------------------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');
  var lastFocused = null;

  function openLightbox(btn) {
    if (!lb) return;
    lastFocused = btn;
    lbImg.src = btn.getAttribute('data-full');
    var inner = btn.querySelector('img');
    lbImg.alt = inner ? inner.alt : '';
    lbCap.textContent = btn.getAttribute('data-caption') || '';
    lb.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      lb.hidden = true;
      lbImg.removeAttribute('src');
    }, reduced ? 0 : 300);
    if (lastFocused) lastFocused.focus();
  }

  if (lb && lbImg && lbCap && lbClose) {
    document.querySelectorAll('.shot').forEach(function (btn) {
      btn.addEventListener('click', function () { openLightbox(btn); });
    });

    lbClose.addEventListener('click', closeLightbox);

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-figure')) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
    });
  }

  /* -------------------------------------------------------- */
  /* Contact form — real submission, honest states            */
  /* -------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  if (form && status && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      status.textContent = 'Sending…';
      status.className = 'form-status';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          status.textContent = 'Message sent. I will reply within a day.';
          status.className = 'form-status is-ok';
        })
        .catch(function () {
          status.textContent = 'That did not send. Email sinhainder616@gmail.com instead.';
          status.className = 'form-status is-err';
        })
        .finally(function () { submitBtn.disabled = false; });
    });
  }

  /* -------------------------------------------------------- */
  /* Scroll progress line                                     */
  /* -------------------------------------------------------- */
  var progress = document.getElementById('progress');
  if (progress) {
    var ticking = false;
    var paint = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = 'scaleX(' + Math.min(Math.max(p, 0), 1) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }

  /* -------------------------------------------------------- */
  /* Cursor spotlight on cards (pointer devices only)         */
  /* -------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.case, .stack-group').forEach(function (card) {
      var queued = false;
      var lastX = 0, lastY = 0;

      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          card.style.setProperty('--mx', lastX + 'px');
          card.style.setProperty('--my', lastY + 'px');
          queued = false;
        });
      });
    });
  }

  /* -------------------------------------------------------- */
  /* Numbers count up as they scroll into view                */
  /* -------------------------------------------------------- */
  var counters = document.querySelectorAll(
    '.stat-val span[data-count], .finding-val span[data-count], .plate-val span[data-count]'
  );

  if (counters.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(countTo);
    } else {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countTo(entry.target);
          countIo.unobserve(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIo.observe(el); });
    }
  }

  /* -------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  } catch (err) {
    /* Content is visible regardless, so a failure here only costs animation. */
    if (window.console && console.error) console.error('portfolio init failed:', err);
  }
})();
