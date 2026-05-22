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

      // insert before #app so it sits behind it in the stacking order
      const appEl = document.getElementById('app');
      document.body.insertBefore(container, appEl);

      let current = 0;

      function activate(index) {
        slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      }

      function advance() {
        current = (current + 1) % slides.length;
        activate(current);
      }

      container.addEventListener('click', advance);

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => activate(0), delay);

      _bgCleanup = () => {
        clearTimeout(startTimer);
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
