import { navigate } from '../router.js';
import { fragmentElement, runReveal } from '../text-reveal.js';
import { transitionState } from '../transition-state.js';

export const projects = [
  { slug: 'test-1', title: 'PYXL',        date: '05/2026',       image: '/assets/projects/project-1.png', alt: 'PYXL' },
  { slug: 'test-2', title: 'TERRA',        date: '04/2026',       image: '/assets/projects/project-2.jpg', alt: 'TERRA' },
  { slug: 'test-3', title: 'PROJECT 152',  date: '11/2025',       image: '/assets/projects/project-3.jpg', alt: 'PROJECT 152' },
  { slug: 'test-4', title: 'STREET',       date: 'PHOTO GALLERY', image: '/assets/projects/project-4.jpg', alt: 'STREET', gallery: '3' },
  { slug: 'test-5', title: 'NATURE',       date: 'PHOTO GALLERY', image: '/assets/projects/project-5.png', alt: 'NATURE', gallery: '2' },
  { slug: 'test-6', title: 'ABSTRACT',     date: 'PHOTO GALLERY', image: '/assets/projects/project-6.jpg', alt: 'ABSTRACT', gallery: '1' },
];

export default {
  title: 'XK — Work',
  bodyClass: 'work-page',
  render() {
    const cards = projects.map((p, i) => `
      <article class="project-card" data-project-slug="${p.slug}" role="button" tabindex="0">
        <div class="project-image-wrap">
          <img src="${p.image}" alt="${p.alt}" class="project-image" decoding="async"${i >= 3 ? ' loading="lazy"' : ''} />
        </div>
        <div class="project-meta">
          <span class="project-title">${p.title}</span>
          <span class="project-date">${p.date}</span>
        </div>
      </article>
    `).join('');

    return `
      <main class="work-layout" style="opacity:0;transition:opacity 520ms ease">
        <section class="projects-grid">${cards}</section>
      </main>
    `;
  },
  init() {
    const layout = document.querySelector('.work-layout');
    const images = [...document.querySelectorAll('.project-image')];

    document.querySelectorAll('.project-title, .project-date').forEach(el => fragmentElement(el));

    const eagerImages = images.filter(img => img.getAttribute('loading') !== 'lazy');
    const waitForImages = Promise.all(eagerImages.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));
    const timeout = new Promise(resolve => setTimeout(resolve, 1500));

    Promise.race([waitForImages, timeout]).then(() => {
      setTimeout(() => {
        if (layout) layout.style.opacity = '1';
        // fire reveal after layout fade completes
        setTimeout(() => runReveal('.projects-grid', { burstCount: 8, burstGap: 55, chunkGap: 20 }), 540);
      }, 380);
    });

    document.querySelectorAll('[data-project-slug]').forEach(card => {
      const p = projects.find(proj => proj.slug === card.dataset.projectSlug);
      const go = () => {
        if (p?.gallery) {
          navigate(`/gallery/${p.gallery}`);
        } else {
          const img = card.querySelector('.project-image');
          transitionState.slug = p.slug;
          transitionState.rect = img ? img.getBoundingClientRect() : null;
          navigate(`/work/${card.dataset.projectSlug}`);
        }
      };
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
  },
  exit() {
    return new Promise(resolve => {
      const layout = document.querySelector('.work-layout');
      if (!layout) { resolve(); return; }

      if (transitionState.slug) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
          if (card.dataset.projectSlug !== transitionState.slug) {
            card.style.transition = 'opacity 200ms ease';
            card.style.opacity = '0';
          }
        });
        setTimeout(resolve, 220);
      } else {
        layout.style.transition = 'opacity 480ms ease';
        layout.style.opacity = '0';
        setTimeout(resolve, 480);
      }
    });
  }
};
