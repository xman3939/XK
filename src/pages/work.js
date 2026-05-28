import { navigate } from '../router.js';
import { fragmentElement, runReveal } from '../text-reveal.js';
import { transitionState, PRE_DELAY } from '../transition-state.js';

export const projects = [
  { slug: 'test-1', title: 'PYXL',        date: '05/2026',       image: '/assets/projects/project-1.jpg', alt: 'PYXL', objectPosition: 'center 25%',
    images: [
      '/assets/pyxl-images/1.gif',
      '/assets/pyxl-images/2.gif',
      '/assets/backgrounds-mobile/3.jpg',
      '/assets/pyxl-images/3.gif',
      '/assets/pyxl-images/4.png',
      '/assets/pyxl-images/5.png',
      '/assets/pyxl-images/6.png',
      '/assets/pyxl-images/7.png',
      '/assets/pyxl-images/8.jpg',
    ],
    description: 'PYXL is a web experience for anyone interested in looking at their photography through a new lens. Daily themes will guide the users\' photo submissions and incentivize them to answer a few questions about their image. The site will generate a distorted version of their image in several ways based on their responses and they will now have a warped image that reflects their emotions, perceptions and memory of that moment in time. Designed with a monochrome, minimal, "pixel" themed aesthetic, the site\'s experience highlights the photographs submitted by users. You can explore other users\' memories through the archive. The archive is not only a collection of these distorted images, but also a time-capsule for these uniquely human experiences, showing memory and emotion warped through time.',
    tools: ['Adobe Creative Suite', 'VSCode', 'GitHub'],
    languages: ['JavaScript', 'HTML', 'CSS', 'Python', 'SQL'],
    more: '<a href="https://pyxlarchive.digital/" target="_blank" rel="noopener" class="meta-link">VIEW LIVE SITE</a>',
  },
  { slug: 'test-2', title: 'TERRA',        date: '04/2026',       image: '/assets/projects/project-2.jpg', alt: 'TERRA',
    images: [
      '/assets/terra-images/1.jpg',
      '/assets/terra-images/2.jpg',
      '/assets/terra-images/3.jpg',
      '/assets/terra-images/4.jpg',
      '/assets/terra-images/5.jpg',
      '/assets/terra-images/6.jpg',
      '/assets/terra-images/7.jpg',
      '/assets/terra-images/8.jpg',
      '/assets/terra-images/9.jpg',
      '/assets/terra-images/10.jpg',
      '/assets/terra-images/11.jpg',
      '/assets/terra-images/12.jpg',
    ],
    description: 'Studio Terra is a collaborative branding and product development project focused on sustainable plant care. We simulated a realistic workflow and environment for a design studio, and established a visual identity, studio values, and a brand system with a real prototyped product. We were a team of four, and I served as creative director, focusing on typography, visual identity, and product photography.',
    tools: ['Adobe InDesign', 'Adobe Illustrator', 'Photography Studio'],
  },
  { slug: 'test-3', title: 'PROJECT 152',  date: '11/2024',       image: '/assets/projects/project-3.jpg', alt: 'PROJECT 152',
    description: 'Project 152 is a CTA-based publication/zine that revolves around a shared space that has personally influenced my design practice. This publication is primarily informative but includes personal themes throughout its pages. Research and iteration are principles that persist throughout the design process, including an extensive interview with CTA Designer Joe Nelson. Photography was also a large part of the process, every photograph was shot during Fall 2024 and helped develop my understanding of composition and street photography. Experimenting with new forms of photography has opened me up to new avenues of design. This project is not only a memento to a design system that has inspired me, it\'s a physical representation of my growth as a photographer and designer. Several copies were printed on risograph and laser printers at UIC\'s print lab.',
    tools: ['Adobe InDesign', 'Adobe Photoshop', 'Risograph', 'Book Binding Tools'],
  },
  { slug: 'test-4', title: 'STREET',       date: 'PHOTO GALLERY', image: '/assets/projects/project-4.jpg', alt: 'STREET', gallery: '3' },
  { slug: 'test-5', title: 'NATURE',       date: 'PHOTO GALLERY', image: '/assets/projects/project-5.jpg', alt: 'NATURE', gallery: '2' },
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
        setTimeout(() => runReveal('.projects-grid', { burstCount: 8, burstGap: 55, chunkGap: 20 }), 540);
      }, 380);
    });

    document.querySelectorAll('[data-project-slug]').forEach(card => {
      const p = projects.find(proj => proj.slug === card.dataset.projectSlug);
      const go = () => {
        if (p?.gallery) {
          navigate(`/gallery/${p.gallery}`);
          return;
        }

        const img = card.querySelector('.project-image');

        // Skip animated transition on mobile
        if (!img || window.innerWidth <= 768) {
          navigate(`/work/${card.dataset.projectSlug}`);
          return;
        }

        const rect = img.getBoundingClientRect();

        // Place clone at thumbnail position — animation starts in project.js
        // init() after the page renders so we can measure the exact panel rect
        const clone = img.cloneNode();
        clone.id = 'project-transition-clone';
        clone.removeAttribute('class');
        clone.style.cssText = [
          'position:fixed',
          `left:${rect.left}px`,
          `top:${rect.top}px`,
          `width:${rect.width}px`,
          `height:${rect.height}px`,
          'object-fit:cover',
          'object-position:center center',
          'z-index:1000',
          'margin:0',
          'padding:0',
          'border:none',
          'display:block',
          'pointer-events:none',
          'transition:none',
          'will-change:left,top,width,height',
        ].join(';');
        document.body.appendChild(clone);

        transitionState.slug = p.slug;
        navigate(`/work/${card.dataset.projectSlug}`);
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
        // Fade work layout during the pre-delay window; clone handles the visual
        layout.style.transition = `opacity ${PRE_DELAY}ms ease`;
        layout.style.opacity = '0';
        setTimeout(resolve, PRE_DELAY + 20);
      } else {
        layout.style.transition = 'opacity 480ms ease';
        layout.style.opacity = '0';
        setTimeout(resolve, 480);
      }
    });
  }
};
