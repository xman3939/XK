import { projects } from './work.js';
import { transitionState, MOVE_MS } from '../transition-state.js';
import { fragmentElement, runReveal } from '../text-reveal.js';

export default {
  title: 'XK — Project',
  bodyClass: 'project-detail-page',
  render({ slug } = {}) {
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return `<div class="project-page"><p class="project-not-found">PROJECT NOT FOUND</p></div>`;
    }

    const toolsHtml     = project.tools?.length     ? project.tools.join('<br>')     : '';
    const languagesHtml = project.languages?.length ? project.languages.join('<br>') : '';

    return `
      <div class="project-page" style="opacity:0">
        <section class="project-hero">
          <div class="project-info">
            <div class="project-meta-grid">
              <span class="meta-label meta-label--title">${project.title}</span>
              <span class="meta-value">${project.description ?? ''}</span>
              <span class="meta-label">TOOLS</span>
              <span class="meta-value">${toolsHtml}</span>
              <span class="meta-label">LANGUAGES</span>
              <span class="meta-value">${languagesHtml}</span>
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
    const panel   = document.querySelector('.project-image-panel');

    // Fragment text elements so reveal can stagger them in
    document.querySelectorAll('.meta-label').forEach(el => fragmentElement(el));

    if (clone && transitionState.slug && info && heroImg && panel) {
      // Measure the actual rendered panel position — this is exact and accounts
      // for scrollbar width, padding, or any layout quirk
      const panelRect = panel.getBoundingClientRect();

      heroImg.style.opacity = '0';
      info.style.opacity    = '0';
      info.style.transform  = 'translateX(-20px)';
      page.style.opacity    = '1';

      // Kick off the clone animation toward the exact panel rect
      const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
      requestAnimationFrame(() => {
        clone.style.transition = [
          `left   ${MOVE_MS}ms ${ease}`,
          `top    ${MOVE_MS}ms ${ease}`,
          `width  ${MOVE_MS}ms ${ease}`,
          `height ${MOVE_MS}ms ${ease}`,
        ].join(',');
        clone.style.left   = `${panelRect.left}px`;
        clone.style.top    = `${panelRect.top}px`;
        clone.style.width  = `${panelRect.width}px`;
        clone.style.height = `${panelRect.height}px`;
      });

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;

        // Crossfade real hero image in over the clone
        heroImg.style.transition = 'opacity 160ms ease';
        heroImg.style.opacity    = '1';

        setTimeout(() => {
          clone.remove();

          // Slide info panel in
          info.style.transition = 'opacity 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
          info.style.opacity    = '1';
          info.style.transform  = 'none';

          // Staggered text reveal fires as info slides in
          setTimeout(() => runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 }), 80);

          transitionState.slug = null;
        }, 160);
      };

      const handler = (e) => {
        if (e.target === clone && e.propertyName === 'width') finish();
      };
      clone.addEventListener('transitionend', handler);
      setTimeout(finish, MOVE_MS + 120); // fallback
    } else {
      if (clone) clone.remove();
      requestAnimationFrame(() => {
        page.style.transition = 'opacity 400ms ease';
        page.style.opacity    = '1';
        setTimeout(() => runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 }), 200);
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
