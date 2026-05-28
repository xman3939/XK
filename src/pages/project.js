import { navigate } from '../router.js';
import { projects } from './work.js';
import { transitionState, MOVE_MS } from '../transition-state.js';
import { fragmentElement, runReveal } from '../text-reveal.js';

let _cleanup = null;

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
    const imagesHtml    = project.images?.length ? project.images.map((src, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${src}" alt="" class="gallery-image" decoding="async"${i >= 4 ? ' loading="lazy"' : ''} />
      </div>`).join('') : '';

    return `
      <div class="project-page" style="opacity:0">
        <button class="home-nav-button project-back-btn" type="button">← BACK</button>
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
        ${imagesHtml ? `
        <section class="project-images">
          <div class="project-images-grid">${imagesHtml}</div>
        </section>` : ''}
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

    const backBtn = document.querySelector('.project-back-btn');
    if (backBtn) {
      fragmentElement(backBtn);
      backBtn.addEventListener('click', () => navigate('/work'));
    }

    document.querySelectorAll('.meta-label').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-item').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-value--more a').forEach(el => fragmentElement(el));
    const descToggleEl = document.querySelector('.desc-toggle');
    if (descToggleEl) fragmentElement(descToggleEl);

    const descToggle = document.querySelector('.desc-toggle');
    const descEl     = document.querySelector('.meta-value--desc');
    if (descToggle && descEl) {
      descToggle.addEventListener('click', () => {
        const expanded = descEl.classList.toggle('is-expanded');
        descToggle.innerHTML = (expanded ? 'VIEW LESS -' : 'VIEW MORE +')
          .split('').map(c => `<span class="reveal-chunk is-visible">${c}</span>`).join('');
        descToggle.setAttribute('aria-expanded', String(expanded));
      });
    }

    // Lightbox for project images
    if (document.querySelector('.project-images')) {
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

      document.querySelectorAll('.project-images .gallery-item').forEach(item => {
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
    }

    if (clone && transitionState.slug && info && heroImg && panel) {
      const panelRect = panel.getBoundingClientRect();

      heroImg.style.opacity = '0';
      info.style.opacity    = '0';
      info.style.transform  = 'translateX(-20px)';
      page.style.opacity    = '1';

      // Snap clone to the hero's object-position before animating so the crop
      // matches when the clone is removed and the real image takes over
      clone.style.objectPosition = heroImg.style.objectPosition || 'center center';

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

          setTimeout(() => {
            runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 });
            if (backBtn) runReveal(backBtn, { burstCount: 1, burstGap: 0, chunkGap: 20 });
          }, 80);

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
        setTimeout(() => {
          runReveal('.project-info', { burstCount: 5, burstGap: 45, chunkGap: 14 });
          if (backBtn) runReveal(backBtn, { burstCount: 1, burstGap: 0, chunkGap: 20 });
        }, 200);
      });
    }
  },
  exit() {
    if (_cleanup) _cleanup();
    return new Promise(resolve => {
      const page = document.querySelector('.project-page');
      if (!page) { resolve(); return; }
      page.style.transition = 'opacity 400ms ease';
      page.style.opacity    = '0';
      setTimeout(resolve, 400);
    });
  }
};
