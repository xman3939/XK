import { navigate } from '../router.js';
import { runReveal } from '../text-reveal.js';

const DESKTOP_BG_IMAGES = [
  '/assets/backgrounds-desktop/1.jpg',
  '/assets/backgrounds-desktop/2.jpg',
  '/assets/backgrounds-desktop/3.jpg',
  '/assets/backgrounds-desktop/4.jpg',
  '/assets/backgrounds-desktop/5.jpg',
  '/assets/backgrounds-desktop/6.jpg',
  '/assets/backgrounds-desktop/7.jpg',
  '/assets/backgrounds-desktop/8.jpg',
  '/assets/backgrounds-desktop/9.jpg',
  '/assets/backgrounds-desktop/10.jpg',
  '/assets/backgrounds-desktop/11.jpg',
  '/assets/backgrounds-desktop/12.jpg',
  '/assets/backgrounds-desktop/13.jpg',
  '/assets/backgrounds-desktop/14.jpg',
  '/assets/backgrounds-desktop/15.jpg',
];

const DESKTOP_SLIDE_OVERLAY = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

const DESKTOP_SLIDE_INFO = [
  { name: 'PYXL',           href: '/work/pyxl' },
  { name: 'ABSTRACT',       href: '/gallery/abstract-gallery' },
  { name: 'STREET',         href: '/gallery/street-gallery' },
  { name: 'CRYSTAL GOBLET', href: '/work/crystal-goblet' },
  { name: 'ABSTRACT',    href: '/gallery/abstract-gallery' },
  { name: 'NATURE',      href: '/gallery/nature-gallery' },
  { name: 'PROJECT 152', href: '/work/project-152' },
  { name: 'TERRA',       href: '/work/terra' },
  { name: 'NATURE',      href: '/gallery/nature-gallery' },
  { name: 'STREET',      href: '/gallery/street-gallery' },
  { name: 'STREET',      href: '/gallery/street-gallery' },
  { name: 'STREET',      href: '/gallery/street-gallery' },
  { name: 'NATURE',      href: '/gallery/nature-gallery' },
  { name: 'NATURE',      href: '/gallery/nature-gallery' },
  { name: 'NATURE',      href: '/gallery/nature-gallery' },
];

let _bgCleanup = null;

const DESKTOP_CAROUSEL_ENABLED = true;
const DESKTOP_FADE_MS = 900;
const CYCLE_MS = 4000;

export default {
  title: 'XK',
  bodyClass: 'home-page',
  render() {
    if (window.innerWidth <= 768) {
      return `
        <div class="mobile-home" style="opacity:0;transition:opacity 700ms ease">
          <div class="mobile-home-hero">
            <div class="mobile-home-logo-tile mobile-home-logo-tile--left">
              <img src="/assets/XK1W.svg" alt="" class="mobile-home-logo-half" />
            </div>
            <div class="mobile-home-logo-tile mobile-home-logo-tile--right">
              <img src="/assets/XK1W.svg" alt="" class="mobile-home-logo-half" />
            </div>
          </div>
        </div>
      `;
    }
    return `<img src="/assets/XK1W.svg" alt="XK" class="home-logo" style="opacity:0;transition:opacity 900ms ease" />`;
  },
  init() {
    if (window.innerWidth <= 768) {
      const home = document.querySelector('.mobile-home');
      if (!home) return;

      const reveal = () => {
        requestAnimationFrame(() => { home.style.opacity = '1'; });
      };

      if (sessionStorage.getItem('loaderPlayed')) {
        setTimeout(reveal, 380);
      } else {
        window.addEventListener('loaderHide', reveal, { once: true });
      }
      return;
    }

    const logo = document.querySelector('.home-logo');
    if (logo) {
      if (sessionStorage.getItem('loaderPlayed')) {
        setTimeout(() => requestAnimationFrame(() => { logo.style.opacity = '1'; }), 380);
      } else {
        window.addEventListener('loaderHide', () => {
          requestAnimationFrame(() => { logo.style.opacity = '1'; });
        }, { once: true });
      }
    }

    if (DESKTOP_CAROUSEL_ENABLED) {
      const container = document.createElement('div');
      container.className = 'desktop-bg-slideshow';

      const slides = DESKTOP_BG_IMAGES.map((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'desktop-bg-slide';
        img.decoding = 'async';
        if (i === 0) { img.style.objectPosition = '50% 40%'; img.fetchPriority = 'high'; }
        container.appendChild(img);
        return img;
      });

      const overlay = document.createElement('div');
      overlay.className = 'desktop-bg-overlay';
      container.appendChild(overlay);

      const appEl = document.getElementById('app');
      document.body.insertBefore(container, appEl);

      const navCaption = document.getElementById('nav-slide-caption');

      let current = 0;
      let transitioning = false;
      let intervalId = null;
      let destroyed = false;

      function showNavCaption(index) {
        if (destroyed || !navCaption) return;
        const info = DESKTOP_SLIDE_INFO[index];
        if (!info) { navCaption.style.opacity = '0'; return; }
        navCaption.dataset.href = info.href;
        navCaption.innerHTML = [...(info.name + ' - SEE MORE')]
          .map(c => `<span class="reveal-chunk">${c === ' ' ? '&nbsp;' : c}</span>`)
          .join('');
        navCaption.style.opacity = '1';
        navCaption.classList.add('is-visible');
        runReveal(navCaption, { burstCount: 12, burstGap: 30, chunkGap: 10 });
      }

      function setOverlay(index) {
        overlay.style.background = `rgba(0,0,0,${DESKTOP_SLIDE_OVERLAY[index] ?? 0.2})`;
      }

      function show(index) {
        if (transitioning || index === current) return;
        transitioning = true;

        const prev = slides[current];
        const next = slides[index];

        if (navCaption) {
          navCaption.style.opacity = '0';
          navCaption.classList.remove('is-visible');
        }
        setOverlay(index);

        next.style.zIndex = '2';
        next.style.opacity = '1';

        setTimeout(() => {
          if (destroyed) return;
          prev.style.transition = 'none';
          prev.style.opacity = '0';
          prev.style.zIndex = '0';
          requestAnimationFrame(() => requestAnimationFrame(() => { prev.style.transition = ''; }));
          next.style.zIndex = '1';
          current = index;
          transitioning = false;
          showNavCaption(index);
        }, DESKTOP_FADE_MS + 50);
      }

      function advance() {
        show((current + 1) % slides.length);
      }

      function onTap(e) {
        if (e.target.closest('button, a')) return;
        clearInterval(intervalId);
        advance();
        intervalId = setInterval(advance, CYCLE_MS);
      }
      document.addEventListener('click', onTap);

      function onNavCaptionClick(e) {
        e.preventDefault();
        if (navCaption.dataset.href) navigate(navCaption.dataset.href);
      }
      if (navCaption) navCaption.addEventListener('click', onNavCaptionClick);

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => {
        if (destroyed) return;
        function start() {
          if (destroyed) return;
          slides[0].style.zIndex = '1';
          slides[0].style.opacity = '1';
          setOverlay(0);
          intervalId = setInterval(advance, CYCLE_MS);
          setTimeout(() => showNavCaption(0), DESKTOP_FADE_MS);
        }
        if (slides[0].complete) {
          start();
        } else {
          slides[0].onload = start;
          slides[0].onerror = start;
        }
      }, delay);

      _bgCleanup = () => {
        destroyed = true;
        clearTimeout(startTimer);
        clearInterval(intervalId);
        document.removeEventListener('click', onTap);
        container.remove();
        if (navCaption) {
          navCaption.removeEventListener('click', onNavCaptionClick);
          navCaption.style.opacity = '0';
          navCaption.classList.remove('is-visible');
          navCaption.innerHTML = '';
        }
        _bgCleanup = null;
      };
    }
  },
  exit() {
    if (_bgCleanup) _bgCleanup();
    return new Promise(resolve => {
      const el = document.querySelector('.mobile-home, .home-logo');
      if (!el) { resolve(); return; }
      el.style.transition = 'opacity 480ms ease';
      el.style.opacity = '0';
      setTimeout(resolve, 480);
    });
  }
};
