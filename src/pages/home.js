const BG_IMAGES = [
  '/assets/backgrounds-mobile/1.jpg',
  '/assets/backgrounds-mobile/2.jpg',
  '/assets/backgrounds-mobile/3.jpg',
  '/assets/backgrounds-mobile/4.jpg',
  '/assets/backgrounds-mobile/5.jpg',
  '/assets/backgrounds-mobile/6.jpg',
  '/assets/backgrounds-mobile/7.jpg',
  '/assets/backgrounds-mobile/8.jpg',
  '/assets/backgrounds-mobile/9.jpg',
  '/assets/backgrounds-mobile/10.jpg',
  '/assets/backgrounds-mobile/11.jpg',
];

let _bgCleanup = null;

const FADE_MS = 700;
const CYCLE_MS = 8000;

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

      let current = 0;
      let transitioning = false;
      let intervalId = null;

      function show(index) {
        if (transitioning || index === current) return;
        transitioning = true;

        const prev = slides[current];
        const next = slides[index];

        // next fades in on top; prev stays fully visible underneath — no black flash
        next.style.zIndex = '2';
        next.style.opacity = '1';

        setTimeout(() => {
          // prev is now hidden behind next — remove instantly, no visible transition
          prev.style.transition = 'none';
          prev.style.opacity = '0';
          prev.style.zIndex = '0';
          requestAnimationFrame(() => requestAnimationFrame(() => { prev.style.transition = ''; }));
          next.style.zIndex = '1';
          current = index;
          transitioning = false;
        }, FADE_MS + 50);
      }

      function advance() {
        show((current + 1) % slides.length);
      }

      function onTap(e) {
        if (e.target.closest('button, a')) return;
        advance();
      }
      document.addEventListener('click', onTap);

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => {
        slides[0].style.zIndex = '1';
        slides[0].style.opacity = '1';
        intervalId = setInterval(advance, CYCLE_MS);
      }, delay);

      _bgCleanup = () => {
        clearTimeout(startTimer);
        clearInterval(intervalId);
        document.removeEventListener('click', onTap);
        container.remove();
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
