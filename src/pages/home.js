const BG_IMAGES = [
  '/assets/backgrounds-mobile/0.mp4',
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
        const isVideo = src.endsWith('.mp4');
        const el = isVideo
          ? Object.assign(document.createElement('video'), { muted: true, playsInline: true })
          : document.createElement('img');
        el.src = src;
        el.className = 'mobile-bg-slide';
        if (!isVideo) el.decoding = 'async';
        container.appendChild(el);
        return el;
      });

      // insert before #app so it sits behind it in the stacking order
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
        const firstSlide = slides[0];
        if (current === 0 && firstSlide instanceof HTMLVideoElement && !firstSlide.ended) return;
        advance();
      }
      document.addEventListener('click', onTap);

      const delay = sessionStorage.getItem('loaderPlayed') ? 1200 : 4750;
      const startTimer = setTimeout(() => {
        const firstSlide = slides[0];
        const isVideo = firstSlide instanceof HTMLVideoElement;

        firstSlide.style.transition = 'opacity 900ms ease';
        activate(0);

        if (isVideo) {
          firstSlide.play();
          firstSlide.addEventListener('ended', () => {
            firstSlide.style.transition = '';
            advance();
            intervalId = setInterval(advance, 5000);
          }, { once: true });
        } else {
          setTimeout(() => {
            firstSlide.style.transition = '';
            intervalId = setInterval(advance, 5000);
          }, 950);
        }
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
