import { navigate } from '../router.js';
import { projects } from './work.js';

export default {
  title: 'XK — Project',
  bodyClass: 'work-page',
  render({ slug } = {}) {
    const project = projects.find(p => p.slug === slug);

    if (!project) {
      return `
        <main class="project-detail">
          <p class="project-not-found">PROJECT NOT FOUND</p>
          <button class="home-nav-button project-back-button" type="button" data-back>← BACK</button>
        </main>
      `;
    }

    return `
      <main class="project-detail">
        <div class="project-detail-image-wrap">
          <img src="${project.image}" alt="${project.alt}" class="project-detail-image" />
        </div>
        <div class="project-detail-meta">
          <span class="project-title">${project.title}</span>
          <span class="project-date">${project.date}</span>
        </div>
        <button class="home-nav-button project-back-button" type="button" data-back>← BACK</button>
      </main>
    `;
  },
  init() {
    document.querySelector('[data-back]')?.addEventListener('click', () => navigate('/work'));
  }
};
