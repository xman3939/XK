import { navigate } from '../router.js';
import { runReveal } from '../text-reveal.js';

const BG_IMAGES = [
  '/assets/backgrounds-mobile/1.webp',
  '/assets/backgrounds-mobile/2.webp',
  '/assets/backgrounds-mobile/3.webp',
  '/assets/backgrounds-mobile/4.webp',
  '/assets/backgrounds-mobile/5.webp',
  '/assets/backgrounds-mobile/6.webp',
  '/assets/backgrounds-mobile/7.webp',
  '/assets/backgrounds-mobile/8.webp',
  '/assets/backgrounds-mobile/9.webp',
  '/assets/backgrounds-mobile/10.webp',
  '/assets/backgrounds-mobile/11.webp',
  '/assets/backgrounds-mobile/12.webp',
  '/assets/backgrounds-mobile/13.webp',
];

const SLIDE_OVERLAY = [0.25, 0.55, 0.25, 0.55, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.55, 0.25];

const SLIDE_INFO = [
  { name: 'ABSTRACT GALLERY', href: '/work/abstract-gallery' },
  { name: 'PYXL',             href: '/work/pyxl' },
  { name: 'PYXL',             href: '/work/pyxl' },
  { name: 'TERRA',            href: '/work/terra' },
  { name: 'STREET GALLERY',   href: '/work/street-gallery' },
  { name: 'ABSTRACT GALLERY', href: '/work/abstract-gallery' },
  { name: 'ABSTRACT GALLERY', href: '/work/abstract-gallery' },
  { name: 'STREET GALLERY',   href: '/work/street-gallery' },
  { name: 'ABSTRACT GALLERY', href: '/work/abstract-gallery' },
  { name: 'PROJECT 152',      href: '/work/project-152' },
  { name: 'NATURE GALLERY',   href: '/work/nature-gallery' },
  { name: 'STREET GALLERY',   href: '/work/street-gallery' },
  { name: 'STREET GALLERY',   href: '/work/street-gallery' },
];

const DESKTOP_BG_IMAGES = [
  '/assets/backgrounds-desktop/1.jpg',
  '/assets/backgrounds-desktop/2.mp4',
  '/assets/backgrounds-desktop/3.jpg',
  '/assets/backgrounds-desktop/4.jpg',
  '/assets/backgrounds-desktop/5.jpg',
  '/assets/backgrounds-desktop/6.jpg',
  '/assets/backgrounds-desktop/7.jpg',
  '/assets/backgrounds-desktop/8.jpg',
];

const DESKTOP_SLIDE_OVERLAY = [0.35, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];

const DESKTOP_SLIDE_INFO = [
  { name: 'ABSTRACT',       href: '/work/abstract-gallery' },
  { name: 'PYXL',           href: '/work/pyxl' },
  { name: 'CRYSTAL GOBLET', href: '/work/pyxl' },
  { name: 'ABSTRACT',       href: '/work/abstract-gallery' },
  { name: 'STREET',         href: '/work/street-gallery' },
  { name: 'NATURE',         href: '/work/nature-gallery' },
  { name: 'NATURE',         href: '/work/nature-gallery' },
  { name: 'STREET',         href: '/work/street-gallery' },
];

let _bgCleanup = null;

const FADE_MS = 700;
const DESKTOP_FADE_MS = 900;
const CYCLE_MS = 6000;

export default {
  title: 'XK',
  bodyClass: 'home-page',
  render() {
    return `<img src="/assets/XK1W.svg" alt="XK" class="home-logo" style="opacity:0;transition:opacity 900ms ease" />`;
  },
  init() {
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

    if (window.innerWidth <= 768) {
      const container = document.createElement('div');
      container.className = 'mobile-bg-slideshow';

      const slides = BG_IMAGES.map(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'mobile-bg-slide';
        img.decoding = 'async';
        container.appendChild(img);
        return img;
      });

      const overlay = document.createElement('div');
      overlay.className = 'mobile-bg-overlay';
      container.appendChild(overlay);

      const appEl = document.getElementById('app');
      document.body.insertBefore(container, appEl);

      const captionEl = document.createElement('a');
      captionEl.className = 'slide-caption';
      document.body.insertBefore(captionEl, appEl);
      captionEl.addEventListener('click', e => {
        e.preventDefault();
        if (captionEl.dataset.href) navigate(captionEl.dataset.href);
      });

      let current = 0;
      let transitioning = false;
      let intervalId = null;

      function showCaption(index) {
        const info = SLIDE_INFO[index];
        if (!info) { captionEl.style.opacity = '0'; return; }
        captionEl.dataset.href = info.href;
        captionEl.innerHTML = [...(info.name + ' - SEE MORE')]
          .map(c => `<span class="reveal-chunk">${c === ' ' ? '&nbsp;' : c}</span>`)
          .join('');
        captionEl.style.opacity = '1';
        runReveal(captionEl, { burstCount: 12, burstGap: 30, chunkGap: 10 });
      }

      function setOverlay(index) {
        overlay.style.background = `rgba(0,0,0,${SLIDE_OVERLAY[index] ?? 0.25})`;
      }

      function show(index) {
        if (transitioning || index === current) return;
        transitioning = true;

        const prev = slides[current];
        const next = slides[index];

        captionEl.style.opacity = '0';
        setOverlay(index);

        next.style.zIndex = '2';
        next.style.opacity = '1';

        setTimeout(() => {
          prev.style.transition = 'none';
          prev.style.opacity = '0';
          prev.style.zIndex = '0';
          requestAnimationFrame(() => requestAnimationFrame(() => { prev.style.transition = ''; }));
          next.style.zIndex = '1';
          current = index;
          transitioning = false;
          showCaption(index);
        }, FADE_MS + 50);
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

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => {
        slides[0].style.zIndex = '1';
        slides[0].style.opacity = '1';
        setOverlay(0);
        intervalId = setInterval(advance, CYCLE_MS);
        setTimeout(() => showCaption(0), FADE_MS);
      }, delay);

      _bgCleanup = () => {
        clearTimeout(startTimer);
        clearInterval(intervalId);
        document.removeEventListener('click', onTap);
        container.remove();
        captionEl.remove();
        _bgCleanup = null;
      };

    }
  },
  exit() {
    if (_bgCleanup) _bgCleanup();
    return new Promise(resolve => {
      const logo = document.querySelector('.home-logo');
      if (!logo) { resolve(); return; }
      logo.style.transition = 'opacity 480ms ease';
      logo.style.opacity = '0';
      setTimeout(resolve, 480);
    });
  }
};
