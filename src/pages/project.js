import { projects } from './work.js';
import { transitionState } from '../transition-state.js';

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
    const page = document.querySelector('.project-page');
    if (!page) return;

    const info = document.querySelector('.project-info');
    const heroImg = document.querySelector('.project-hero-img');
    const clone = document.getElementById('project-transition-clone');

    if (clone && transitionState.slug && info && heroImg) {
      // Clone is still flying in from the work page.
      // Keep hero image hidden (clone covers that area), show the page shell.
      heroImg.style.opacity = '0';
      info.style.opacity = '0';
      info.style.transform = 'translateX(-16px)';
      page.style.opacity = '1';

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;

        // Crossfade: fade hero image in over the clone, then remove clone
        heroImg.style.transition = 'opacity 180ms ease';
        heroImg.style.opacity = '1';

        setTimeout(() => {
          clone.remove();

          // Slide+fade the info panel in
          info.style.transition = 'opacity 420ms ease, transform 420ms ease';
          info.style.opacity = '1';
          info.style.transform = '';
          transitionState.slug = null;
        }, 180);
      };

      // Fire when the width property finishes (all three transitions are 620ms)
      const handler = (e) => {
        if (e.target === clone && e.propertyName === 'width') finish();
      };
      clone.addEventListener('transitionend', handler);
      setTimeout(finish, 720); // fallback if transitionend misfires
    } else {
      if (clone) clone.remove();
      requestAnimationFrame(() => {
        page.style.transition = 'opacity 400ms ease';
        page.style.opacity = '1';
      });
    }
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
