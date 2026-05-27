import { projects } from './work.js';
import { transitionState, PRE_DELAY, MOVE_MS } from '../transition-state.js';

export default {
  title: 'XK — Project',
  bodyClass: 'project-detail-page',
  render({ slug } = {}) {
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return `<div class="project-page"><p class="project-not-found">PROJECT NOT FOUND</p></div>`;
    }

    const toolsHtml = project.tools?.length ? project.tools.join('<br>') : '';

    return `
      <div class="project-page" style="opacity:0">
        <section class="project-hero">
          <div class="project-info">
            <h1 class="project-hero-title">${project.title}</h1>
            <div class="project-meta-grid">
              <span class="meta-label">DESCRIPTION</span>
              <span class="meta-value">${project.description ?? ''}</span>
              <span class="meta-label">TOOLS</span>
              <span class="meta-value">${toolsHtml}</span>
              <span class="meta-label">MORE</span>
              <span class="meta-value">${project.more ?? ''}</span>
            </div>
          </div>
          <div class="project-image-panel">
            <img class="project-hero-img" src="${project.image}" alt="${project.alt}" decoding="async" />
          </div>
        </section>
      </div>
    `;
  },
  init() {
    const page    = document.querySelector('.project-page');
    if (!page) return;

    const info    = document.querySelector('.project-info');
    const heroImg = document.querySelector('.project-hero-img');
    const clone   = document.getElementById('project-transition-clone');

    if (clone && transitionState.slug && info && heroImg) {
      // Clone is mid-flight from the work page.
      // Keep hero image invisible (clone is covering that region),
      // reveal the page shell so the dark bg shows through.
      heroImg.style.opacity = '0';
      info.style.opacity    = '0';
      info.style.transform  = 'translateX(-20px)';
      page.style.opacity    = '1';

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;

        // Crossfade: real hero image fades in over the clone
        heroImg.style.transition = 'opacity 160ms ease';
        heroImg.style.opacity    = '1';

        setTimeout(() => {
          clone.remove();

          // Info panel slides in after clone is gone
          info.style.transition = 'opacity 440ms ease, transform 440ms cubic-bezier(0.22, 1, 0.36, 1)';
          info.style.opacity    = '1';
          info.style.transform  = 'none';
          transitionState.slug  = null;
        }, 160);
      };

      // Fire when the `width` property finishes animating
      const handler = (e) => {
        if (e.target === clone && e.propertyName === 'width') finish();
      };
      clone.addEventListener('transitionend', handler);

      // Fallback: fire at expected completion time in case transitionend misfires
      setTimeout(finish, PRE_DELAY + MOVE_MS + 100);

    } else {
      // Direct URL load — no clone, simple fade in
      if (clone) clone.remove();
      requestAnimationFrame(() => {
        page.style.transition = 'opacity 400ms ease';
        page.style.opacity    = '1';
      });
    }
  },
  exit() {
    return new Promise(resolve => {
      const page = document.querySelector('.project-page');
      if (!page) { resolve(); return; }
      page.style.transition = 'opacity 400ms ease';
      page.style.opacity    = '0';
      setTimeout(resolve, 400);
    });
  }
};
