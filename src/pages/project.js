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

    const toolsHtml     = project.tools?.length     ? project.tools.map(t => `<span class="meta-item">${t}</span>`).join('')     : '';
    const languagesHtml = project.languages?.length ? project.languages.map(l => `<span class="meta-item">${l}</span>`).join('') : '';

    return `
      <div class="project-page" style="opacity:0">
        <section class="project-hero">
          <div class="project-info">
            <div class="project-meta-grid">
              <span class="meta-label meta-label--title">${project.title}</span>
              <span class="meta-value meta-value--desc">${project.description ?? ''}</span>
              ${project.description ? `<button class="desc-toggle" aria-expanded="false">VIEW MORE +</button>` : ''}
              ${project.tools?.length ? `
              <span class="meta-label">TOOLS</span>
              <span class="meta-value meta-value--list">${toolsHtml}</span>` : ''}
              ${project.languages?.length ? `
              <span class="meta-label">LANGUAGES</span>
              <span class="meta-value meta-value--list">${languagesHtml}</span>` : ''}
              ${project.more ? `
              <span class="meta-label">MORE</span>
              <span class="meta-value meta-value--more">${project.more}</span>` : ''}
            </div>
          </div>
          <div class="project-image-panel">
            <img class="project-hero-img" src="${project.image}" alt="${project.alt}" decoding="async"${project.objectPosition ? ` style="object-position:${project.objectPosition}"` : ''} />
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

    // Word-level fragmentation for description — keeps reveal short and spaces intact
    document.querySelectorAll('.meta-value--desc').forEach(el => {
      const words = el.textContent.trim().split(/(\s+)/);
      el.innerHTML = words.map(w =>
        /\s/.test(w) ? w : `<span class="reveal-chunk">${w}</span>`
      ).join('');
    });

    // Char-level fragmentation for labels, list items, and more link
    document.querySelectorAll('.meta-label').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-item').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-value--more a').forEach(el => fragmentElement(el));

    const descToggle = document.querySelector('.desc-toggle');
    const descEl     = document.querySelector('.meta-value--desc');
    if (descToggle && descEl) {
      descToggle.addEventListener('click', () => {
        const expanded = descEl.classList.toggle('is-expanded');
        descToggle.textContent = expanded ? 'VIEW LESS -' : 'VIEW MORE +';
        descToggle.setAttribute('aria-expanded', String(expanded));
      });
    }

    if (clone && transitionState.slug && info && heroImg && panel) {
      const panelRect = panel.getBoundingClientRect();

      heroImg.style.opacity = '0';
      info.style.opacity    = '0';
      info.style.transform  = 'translateX(-20px)';
      page.style.opacity    = '1';

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

        heroImg.style.transition = 'opacity 160ms ease';
        heroImg.style.opacity    = '1';

        setTimeout(() => {
          clone.remove();

          info.style.transition = 'opacity 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
          info.style.opacity    = '1';
          info.style.transform  = 'none';

          setTimeout(() => runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 }), 80);

          transitionState.slug = null;
        }, 160);
      };

      const handler = (e) => {
        if (e.target === clone && e.propertyName === 'width') finish();
      };
      clone.addEventListener('transitionend', handler);
      setTimeout(finish, MOVE_MS + 120);
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
