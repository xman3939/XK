import { navigate } from '../router.js';
import { runReveal } from '../text-reveal.js';

const BG_IMAGES = [
  '/assets/backgrounds-mobile/1.jpg',
  '/assets/backgrounds-mobile/2.png',
  '/assets/backgrounds-mobile/3.jpg',
  '/assets/backgrounds-mobile/4.jpg',
  '/assets/backgrounds-mobile/5.jpg',
  '/assets/backgrounds-mobile/6.jpg',
  '/assets/backgrounds-mobile/7.jpg',
  '/assets/backgrounds-mobile/8.jpg',
  '/assets/backgrounds-mobile/9.jpg',
  '/assets/backgrounds-mobile/10.jpg',
  '/assets/backgrounds-mobile/11.jpg',
  '/assets/backgrounds-mobile/12.jpg',
];

const SLIDE_INFO = [
  { name: 'ABSTRACT GALLERY', href: '/work/test-1' },
  { name: 'PYXL',             href: '/work/test-1' },
  { name: 'CRYSTAL GOBLET',   href: '/work/test-1' },
  { name: 'TERRA',            href: '/work/test-1' },
  { name: 'STREET GALLERY',   href: '/work/test-1' },
  { name: 'ABSTRACT GALLERY', href: '/work/test-1' },
  { name: 'ABSTRACT GALLERY', href: '/work/test-1' },
  { name: 'STREET GALLERY',   href: '/work/test-1' },
  { name: 'ABSTRACT GALLERY', href: '/work/test-1' },
  { name: 'PROJECT 152',      href: '/work/test-1' },
  { name: 'NATURE GALLERY',   href: '/work/test-1' },
  { name: 'STREET GALLERY',   href: '/work/test-1' },
];

let _bgCleanup = null;

const FADE_MS = 700;
const CYCLE_MS = 6000;

export default {
  title: 'XK',
  bodyClass: 'home-page',
  render() {
    return `<img src="/assets/XK1W.svg" alt="XK" class="home-logo" style="opacity:0;transition:opacity 900ms ease" />`;
  },
  init() {
    const logo = document.querySelector('.home-logo');
    if (logo) setTimeout(() => requestAnimationFrame(() => { logo.style.opacity = '1'; }), 380);

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

      function show(index) {
        if (transitioning || index === current) return;
        transitioning = true;

        const prev = slides[current];
        const next = slides[index];

        captionEl.style.opacity = '0';

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
