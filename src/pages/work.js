import { navigate } from '../router.js';
import { fragmentElement, runReveal } from '../text-reveal.js';

export const projects = [
  { slug: 'test-1', title: 'TEST 1', date: 'MM/YYYY', image: '/assets/projects/project-1.jpg', alt: 'PYXL' },
  { slug: 'test-2', title: 'TEST 2', date: 'MM/YYYY', image: '/assets/projects/project-2.jpg', alt: 'TEST 2' },
  { slug: 'test-3', title: 'TEST 3', date: 'MM/YYYY', image: '/assets/projects/project-3.jpg', alt: 'TEST 3' },
  { slug: 'test-4', title: 'TEST 4', date: 'MM/YYYY', image: '/assets/projects/project-4.jpg', alt: 'TEST 4' },
  { slug: 'test-5', title: 'TEST 5', date: 'MM/YYYY', image: '/assets/projects/project-5.png', alt: 'TEST 5' },
  { slug: 'test-6', title: 'TEST 6', date: 'MM/YYYY', image: '/assets/projects/project-6.jpg', alt: 'TEST 6' },
];

export default {
  title: 'XK — Work',
  bodyClass: 'work-page',
  render() {
    const cards = projects.map(p => `
      <article class="project-card" data-project-slug="${p.slug}" role="button" tabindex="0">
        <div class="project-image-wrap">
          <img src="${p.image}" alt="${p.alt}" class="project-image" />
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

    Promise.all(images.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    })).then(() => {
      setTimeout(() => {
        if (layout) layout.style.opacity = '1';
        // fire reveal after layout fade completes
        setTimeout(() => runReveal('.projects-grid', { burstCount: 8, burstGap: 55, chunkGap: 20 }), 540);
      }, 380);
    });

    document.querySelectorAll('[data-project-slug]').forEach(card => {
      const go = () => navigate(`/work/${card.dataset.projectSlug}`);
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
  },
  exit() {
    return new Promise(resolve => {
      const layout = document.querySelector('.work-layout');
      if (!layout) { resolve(); return; }
      layout.style.transition = 'opacity 480ms ease';
      layout.style.opacity = '0';
      setTimeout(resolve, 480);
    });
  }
};
