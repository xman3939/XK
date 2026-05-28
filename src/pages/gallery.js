import { navigate } from '../router.js';

export const GALLERIES = {
  '1': {
    title: 'ABSTRACT',
    images: [
      '/assets/abstract-gallery/1.jpg',
      '/assets/abstract-gallery/2.jpg',
      '/assets/abstract-gallery/3.jpg',
      '/assets/abstract-gallery/4.jpg',
      '/assets/abstract-gallery/5.jpg',
      '/assets/abstract-gallery/6.jpg',
      '/assets/abstract-gallery/7.jpg',
      '/assets/abstract-gallery/8.jpg',
      '/assets/abstract-gallery/9.jpg',
      '/assets/abstract-gallery/10.jpg',
      '/assets/abstract-gallery/11.jpg',
      '/assets/abstract-gallery/12.jpg',
      '/assets/abstract-gallery/13.jpg',
      '/assets/abstract-gallery/14.jpg',
      '/assets/abstract-gallery/15.jpg',
      '/assets/abstract-gallery/16.jpg',
    ]
  },
  '3': {
    title: 'STREET',
    images: [
      '/assets/street-gallery/1.jpg',
      '/assets/street-gallery/2.jpg',
      '/assets/street-gallery/3.jpg',
      '/assets/street-gallery/4.jpg',
      '/assets/street-gallery/5.jpg',
      '/assets/street-gallery/6.jpg',
      '/assets/street-gallery/7.jpg',
      '/assets/street-gallery/8.jpg',
      '/assets/street-gallery/9.jpg',
      '/assets/street-gallery/10.jpg',
      '/assets/street-gallery/11.jpg',
      '/assets/street-gallery/12.jpg',
      '/assets/street-gallery/13.jpg',
      '/assets/street-gallery/14.jpg',
      '/assets/street-gallery/15.jpg',
      '/assets/street-gallery/16.jpg',
      '/assets/street-gallery/17.jpg',
      '/assets/street-gallery/18.jpg',
      '/assets/street-gallery/19.jpg',
      '/assets/street-gallery/20.jpg',
      '/assets/street-gallery/21.jpg',
      '/assets/street-gallery/22.jpg',
      '/assets/street-gallery/23.jpg',
      '/assets/street-gallery/24.jpg',
      '/assets/street-gallery/25.jpg',
      '/assets/street-gallery/26.jpg',
    ]
  },
  '2': {
    title: 'NATURE',
    images: [
      '/assets/nature-gallery/1.jpg',
      '/assets/nature-gallery/2.jpg',
      '/assets/nature-gallery/3.jpg',
      '/assets/nature-gallery/4.jpg',
      '/assets/nature-gallery/5.jpg',
      '/assets/nature-gallery/6.jpg',
      '/assets/nature-gallery/7.jpg',
      '/assets/nature-gallery/8.jpg',
      '/assets/nature-gallery/9.jpg',
      '/assets/nature-gallery/10.jpg',
      '/assets/nature-gallery/11.jpg',
      '/assets/nature-gallery/12.jpg',
      '/assets/nature-gallery/13.jpg',
      '/assets/nature-gallery/14.jpg',
      '/assets/nature-gallery/15.jpg',
      '/assets/nature-gallery/16.jpg',
      '/assets/nature-gallery/17.jpg',
      '/assets/nature-gallery/18.jpg',
      '/assets/nature-gallery/19.jpg',
      '/assets/nature-gallery/20.jpg',
      '/assets/nature-gallery/21.jpg',
      '/assets/nature-gallery/22.jpg',
      '/assets/nature-gallery/23.jpg',
      '/assets/nature-gallery/24.jpg',
      '/assets/nature-gallery/25.jpg',
    ]
  }
};

let _cleanup = null;

export default {
  title: 'XK — Gallery',
  bodyClass: 'work-page',
  render({ id } = {}) {
    const gallery = GALLERIES[id];
    if (!gallery) {
      return `
        <main class="gallery-layout">
          <p class="project-not-found">GALLERY NOT FOUND</p>
          <button class="home-nav-button project-back-btn" type="button" data-back>← BACK</button>
        </main>
      `;
    }
    const imgs = gallery.images.map((src, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${src}" alt="" class="gallery-image" decoding="async"${i >= 6 ? ' loading="lazy"' : ''} />
      </div>
    `).join('');

    return `
      <main class="gallery-layout" style="opacity:0;transition:opacity 520ms ease">
        <div class="gallery-grid">${imgs}</div>
        <button class="home-nav-button project-back-btn" type="button" data-back>← BACK</button>
      </main>
    `;
  },
  init({ id } = {}) {
    document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/work'));

    const gallery = GALLERIES[id];
    if (!gallery) return;

    const layout = document.querySelector('.gallery-layout');
    const images = [...document.querySelectorAll('.gallery-image')];
    const eager = images.filter(img => !img.getAttribute('loading'));

    const waitForImages = Promise.all(eager.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));

    Promise.race([waitForImages, new Promise(r => setTimeout(r, 1500))]).then(() => {
      setTimeout(() => { if (layout) layout.style.opacity = '1'; }, 380);
    });

    // Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = `
      <div class="gallery-lightbox-img-wrap">
        <img class="gallery-lightbox-img" src="" alt="" />
      </div>
      <button class="gallery-lightbox-close" type="button">[X]</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.gallery-lightbox-img');

    function openLightbox(src) {
      lbImg.src = src;
      requestAnimationFrame(() => lightbox.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => { if (!lightbox.classList.contains('is-open')) lbImg.src = ''; }, 300);
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item.querySelector('.gallery-image').src));
    });

    lightbox.addEventListener('click', e => {
      if (!e.target.closest('.gallery-lightbox-img')) closeLightbox();
    });

    const onKeyDown = e => { if (e.key === 'Escape') closeLightbox(); };
    document.addEventListener('keydown', onKeyDown);

    _cleanup = () => {
      document.removeEventListener('keydown', onKeyDown);
      lightbox.remove();
      document.body.style.overflow = '';
      _cleanup = null;
    };
  },
  exit() {
    if (_cleanup) _cleanup();
    return new Promise(resolve => {
      const layout = document.querySelector('.gallery-layout');
      if (!layout) { resolve(); return; }
      layout.style.transition = 'opacity 480ms ease';
      layout.style.opacity = '0';
      setTimeout(resolve, 480);
    });
  }
};
