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

    const img = document.querySelector('.project-hero-img');
    const info = document.querySelector('.project-info');

    if (transitionState.rect && img && info) {
      const startRect = transitionState.rect;
      const finalRect = img.getBoundingClientRect();

      const dx = startRect.left - finalRect.left;
      const dy = startRect.top - finalRect.top;
      const scaleX = startRect.width / finalRect.width;
      const scaleY = startRect.height / finalRect.height;

      img.style.transformOrigin = 'top left';
      img.style.transform = `translate(${dx}px, ${dy}px) scaleX(${scaleX}) scaleY(${scaleY})`;
      info.style.opacity = '0';
      info.style.transform = 'translateX(-16px)';
      page.style.opacity = '1';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.style.transition = 'transform 540ms cubic-bezier(0.25, 0.1, 0.25, 1)';
          img.style.transform = '';

          setTimeout(() => {
            info.style.transition = 'opacity 400ms ease, transform 400ms ease';
            info.style.opacity = '1';
            info.style.transform = '';
          }, 80);

          setTimeout(() => {
            transitionState.slug = null;
            transitionState.rect = null;
          }, 600);
        });
      });
    } else {
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
