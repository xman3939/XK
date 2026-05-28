import { fragmentElement, runReveal } from '../text-reveal.js';

const designTools = [
  'Adobe Creative Suite',
  'Figma',
  'Product Photography',
  'Studio Photography',
  'Book Binding',
  'Webflow/Framer',
];

const devTools = [
  'Git/GitHub',
  'Python',
  'JavaScript',
  'SQL',
  'C/C++',
  'Java',
  'Go',
  'F#',
  'Firebase/Supabase',
];

export default {
  title: 'XK — About',
  bodyClass: 'about-page',
  render() {
    const designHtml = designTools.map(t => `<span class="meta-item">${t}</span>`).join('');
    const devHtml    = devTools.map(t => `<span class="meta-item">${t}</span>`).join('');

    return `
      <div class="project-page" style="opacity:0">
        <section class="project-hero">
          <div class="project-info">
            <div class="project-meta-grid">
              <span class="meta-label meta-label--title">ABOUT</span>
              <span class="meta-value"></span>
              <span class="meta-label">DESIGN TOOLS</span>
              <span class="meta-value meta-value--list">${designHtml}</span>
              <span class="meta-label">DEVELOPER TOOLS</span>
              <span class="meta-value meta-value--list">${devHtml}</span>
            </div>
          </div>
          <div class="project-image-panel">
            <img class="project-hero-img" src="/assets/other/me.png" alt="" decoding="async" style="object-position:center top" />
          </div>
        </section>
      </div>
    `;
  },
  init() {
    const page = document.querySelector('.project-page');
    if (!page) return;

    document.querySelectorAll('.meta-label').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-item').forEach(el => fragmentElement(el));

    const heroImg = document.querySelector('.project-hero-img');
    const imgReady = heroImg
      ? new Promise(resolve => {
          if (heroImg.complete && heroImg.naturalWidth > 0) { resolve(); return; }
          heroImg.addEventListener('load',  resolve, { once: true });
          heroImg.addEventListener('error', resolve, { once: true });
        })
      : Promise.resolve();

    Promise.race([imgReady, new Promise(r => setTimeout(r, 1000))]).then(() => {
      requestAnimationFrame(() => {
        page.style.transition = 'opacity 400ms ease';
        page.style.opacity = '1';
        setTimeout(() => {
          runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 });
        }, 200);
      });
    });
  },
  exit() {
    return new Promise(resolve => {
      const page = document.querySelector('.project-page');
      if (!page) { resolve(); return; }
      page.style.transition = 'opacity 400ms ease';
      page.style.opacity = '0';
      setTimeout(resolve, 400);
    });
  }
};
