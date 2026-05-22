const BG_IMAGES = [
  '/assets/backgrounds-mobile/1.jpg',
  '/assets/backgrounds-mobile/2.jpg',
  '/assets/backgrounds-mobile/3.jpg',
  '/assets/backgrounds-mobile/4.jpg',
  '/assets/backgrounds-mobile/5.jpg',
  '/assets/backgrounds-mobile/6.png',
  '/assets/backgrounds-mobile/7.jpg',
  '/assets/backgrounds-mobile/8.jpg',
];

const BG_IMAGES_DESKTOP = [
  '/assets/backgrounds-desktop/1.jpg',
  '/assets/backgrounds-desktop/2.jpg',
  '/assets/backgrounds-desktop/3.jpg',
  '/assets/backgrounds-desktop/4.jpg',
  '/assets/backgrounds-desktop/5.png',
  '/assets/backgrounds-desktop/6.jpg',
  '/assets/backgrounds-desktop/7.jpg',
  '/assets/backgrounds-desktop/8.jpg',
];

let _bgCleanup = null;

export default {
  title: 'XK',
  bodyClass: 'home-page',
  render() {
    return `<img src="/assets/XK1W.svg" alt="XK" class="home-logo" style="opacity:0;transition:opacity 900ms ease" />`;
  },
  init() {
    const logo = document.querySelector('.home-logo');
    if (logo) setTimeout(() => requestAnimationFrame(() => { logo.style.opacity = '1'; }), 380);

    const isMobile = window.innerWidth <= 768;
    const images = isMobile ? BG_IMAGES : BG_IMAGES_DESKTOP;
    const containerClass = isMobile ? 'mobile-bg-slideshow' : 'desktop-bg-slideshow';
    const slideClass = isMobile ? 'mobile-bg-slide' : 'desktop-bg-slide';

    {
      const container = document.createElement('div');
      container.className = containerClass;

      const slides = images.map(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = slideClass;
        img.decoding = 'async';
        container.appendChild(img);
        return img;
      });

      const appEl = document.getElementById('app');
      document.body.insertBefore(container, appEl);

      let current = 0;
      let intervalId = null;

      function activate(index) {
        slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      }

      function advance() {
        current = (current + 1) % slides.length;
        activate(current);
      }

      function onTap(e) {
        if (e.target.closest('button, a')) return;
        advance();
      }
      document.addEventListener('click', onTap);

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => {
        slides[0].style.transition = 'opacity 900ms ease';
        activate(0);
        setTimeout(() => {
          slides[0].style.transition = '';
          intervalId = setInterval(advance, 5000);
        }, 950);
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
