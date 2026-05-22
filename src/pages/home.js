const BG_IMAGES = [
  '/assets/backgrounds-mobile/DSC03365.jpg',
  '/assets/backgrounds-mobile/DSC03657.jpg',
  '/assets/backgrounds-mobile/fractured-perception-output-full-res (12).png',
  '/assets/backgrounds-mobile/posterSOCIALMEDIA-1.png',
  '/assets/backgrounds-mobile/test9.jpg',
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
      let intervalId = null;

      function activate(index) {
        slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      }

      function startCycle() {
        activate(0);
        intervalId = setInterval(() => {
          current = (current + 1) % slides.length;
          activate(current);
        }, 5000);
      }

      // First load: wait for loader (2400ms) + fade (900ms) + black pause (450ms) + 1s of black
      // Subsequent: loader is already gone, just wait ~1.2s after logo fades in
      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(startCycle, delay);

      _bgCleanup = () => {
        clearTimeout(startTimer);
        clearInterval(intervalId);
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
