/* ============================================================
   LFTEAM — comportamentos da página
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- FAQ: deixa só a primeira aberta ---------- */
  document.querySelectorAll('.faq-item').forEach(function (el, i) {
    if (i > 0) el.removeAttribute('open');
  });

  /* ---------- menu do celular ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navPanel = document.querySelector('.nav-mobile-panel');
  var navEl = document.querySelector('.nav');

  function closeNavPanel() {
    if (!navPanel) return;
    navPanel.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', function () {
      var isOpen = navPanel.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navPanel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNavPanel);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNavPanel();
    });
  }

  /* ---------- menu some ao descer, volta ao subir (só no celular) ---------- */
  var isMobileNav = window.matchMedia('(max-width: 939px)');
  var lastScrollY = window.scrollY;

  window.addEventListener('scroll', function () {
    if (!navEl) return;
    if (!isMobileNav.matches) {
      navEl.classList.remove('nav-hidden');
      lastScrollY = window.scrollY;
      return;
    }
    var y = window.scrollY;
    if (y > lastScrollY && y > 90) {
      navEl.classList.add('nav-hidden');
      closeNavPanel();
    } else {
      navEl.classList.remove('nav-hidden');
    }
    lastScrollY = y;
  }, { passive: true });

  /* ---------- revelação dos blocos ao rolar ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- carrossel contínuo ----------
     Rola sozinho, pausa ao tocar, arrasta pra navegar na mão,
     e destaca o cartão que estiver passando pelo centro da tela.
     ------------------------------------------------------------ */
  document.querySelectorAll('.marquee').forEach(function (marquee) {
    var track = marquee.querySelector('.marquee-track');
    if (!track) return;

    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    // duplica os itens pra emenda do loop ficar invisível
    originals.forEach(function (node) {
      var clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
      track.appendChild(clone);
    });

    var wantsZoom = marquee.dataset.zoom === 'true';
    var speed = marquee.dataset.reverse === 'true' ? 0.32 : -0.32;

    var x = 0, halfWidth = 0;
    var paused = false, dragging = false, moved = false;
    var pointerStartX = 0, startX = 0;

    function wrap() {
      if (halfWidth <= 0) return;
      while (x <= -halfWidth) x += halfWidth;
      while (x > 0) x -= halfWidth;
    }

    function measure() {
      halfWidth = track.scrollWidth / 2;
      wrap();
    }

    function markCenter() {
      if (!wantsZoom) return;
      var mid = window.innerWidth / 2;
      var closest = null, closestDist = Infinity;
      var shots = track.querySelectorAll('.shot');
      shots.forEach(function (shot) {
        var box = shot.getBoundingClientRect();
        if (box.right < -80 || box.left > window.innerWidth + 80) {
          shot.classList.remove('is-center');
          return;
        }
        var dist = Math.abs(box.left + box.width / 2 - mid);
        if (dist < closestDist) { closestDist = dist; closest = shot; }
      });
      shots.forEach(function (shot) {
        shot.classList.toggle('is-center', shot === closest);
      });
    }

    function apply() { track.style.transform = 'translateX(' + x + 'px)'; }

    // sem animação: vira faixa rolável, sem loop nem destaque
    if (reduceMotion) {
      track.querySelectorAll('[aria-hidden="true"]').forEach(function (n) { n.remove(); });
      track.querySelectorAll('.shot').forEach(function (s) { s.classList.add('is-center'); });
      return;
    }

    var frame = 0;
    function tick() {
      if (!dragging && !paused && halfWidth > 0) {
        x += speed;
        wrap();
        apply();
      }
      // medir posição é caro: só a cada 3 quadros
      if (wantsZoom && (frame++ % 3 === 0)) markCenter();
      requestAnimationFrame(tick);
    }

    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    requestAnimationFrame(tick);

    marquee.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false;
      pointerStartX = e.clientX; startX = x;
      marquee.setPointerCapture(e.pointerId);
      marquee.classList.add('dragging');
    });

    marquee.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - pointerStartX;
      if (Math.abs(dx) > 4) moved = true;
      x = startX + dx;
      wrap();
      apply();
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      marquee.classList.remove('dragging');
      // toque curto (sem arrastar) alterna pausa
      if (!moved) paused = !paused;
    }
    marquee.addEventListener('pointerup', endDrag);
    marquee.addEventListener('pointercancel', endDrag);
    marquee.addEventListener('pointerleave', endDrag);
  });

  /* ---------- vídeo do aplicativo ---------- */
  document.querySelectorAll('.phone').forEach(function (phone) {
    var video = phone.querySelector('video');
    var playBtn = phone.querySelector('.phone-play');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', function () {
      video.play().then(function () {
        phone.classList.add('playing');
      }).catch(function () {
        phone.classList.remove('playing');
      });
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        phone.classList.add('playing');
      } else {
        video.pause();
      }
    });

    video.addEventListener('pause', function () { phone.classList.remove('playing'); });

    // toca sozinho ao entrar na tela, pausa ao sair (economiza dados no celular)
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            video.play().then(function () { phone.classList.add('playing'); }).catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.5 }).observe(phone);
    }
  });

  /* ---------- rastreio de cliques no WhatsApp ----------
     Falha em silêncio se o Analytics não estiver ativo —
     o link nunca pode quebrar por causa disso.
     ------------------------------------------------------------ */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
    link.addEventListener('click', function () {
      try {
        var secao = link.closest('section, header, nav, footer');
        if (window.va) {
          window.va('event', {
            name: 'clique_whatsapp',
            data: {
              secao: (secao && (secao.id || secao.className.split(' ')[0])) || 'flutuante',
              texto: link.textContent.trim().slice(0, 40)
            }
          });
        }
      } catch (e) { /* rastreio nunca deve atrapalhar o contato */ }
    });
  });
})();
