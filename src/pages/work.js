import { navigate } from '../router.js';
import { fragmentElement, runReveal } from '../text-reveal.js';
import { transitionState, PRE_DELAY } from '../transition-state.js';

export const projects = [
  { slug: 'pyxl', title: 'PYXL',        date: '05/2026',       image: '/assets/projects/project-1.jpg', alt: 'PYXL', objectPosition: 'center 25%',
    images: [
      '/assets/pyxl-images/1.webp',
      '/assets/pyxl-images/2.webp',
      '/assets/pyxl-images/3.webp',
      '/assets/pyxl-images/4.webp',
      '/assets/pyxl-images/5.webp',
      '/assets/pyxl-images/6.webp',
      '/assets/pyxl-images/7.webp',
      '/assets/pyxl-images/8.webp',
      '/assets/pyxl-images/9.webp',
      '/assets/pyxl-images/pyxl_booklet.webp',
      '/assets/pyxl-images/pyxl_booklet2.webp',
      '/assets/pyxl-images/pyxl_booklet3.webp',
      '/assets/pyxl-images/pyxl_booklet4.webp',
      '/assets/pyxl-images/pyxl_booklet5.webp',
      '/assets/pyxl-images/pyxl_booklet6.webp',
      '/assets/pyxl-images/pyxl_booklet7.webp',
      '/assets/pyxl-images/pyxl_booklet9.webp',
      '/assets/pyxl-images/pyxl_booklet10.webp',
      '/assets/pyxl-images/pyxl_booklet11.webp',
      '/assets/pyxl-images/pyxl_booklet12.webp',
      '/assets/pyxl-images/pyxl_booklet13.webp',
      '/assets/pyxl-images/pyxl_booklet14.webp',
      '/assets/pyxl-images/pyxl_booklet15.webp',
      '/assets/pyxl-images/pyxl_booklet16.webp',
      '/assets/pyxl-images/pyxl_booklet17.webp',
    ],
    description: 'PYXL is a web experience for anyone interested in looking at their photography through a new lens. Daily themes guide users\' photo submissions and the site generates distorted versions of their images based on their responses, creating a warped image that reflects their emotions, perceptions and memory of that moment in time.',
    sections: [
      { label: 'DEVELOPMENT', text: 'Photography apps treat images as static outputs, but memory is fluid and how we perceive moments changes over time. I conducted qualitative user research to understand how people relate to their photography, then iterated through multiple concept directions. As a full-stack designer-engineer, I built the frontend in React, programmed custom distortion algorithms in the backend, and architected the data layer with Supabase. The monochrome, minimal aesthetic was designed after testing revealed that color competed with user-submitted images and that a minimal interface kept focus on the photos themselves.' },
      { label: 'RESULTS', text: 'PYXL was exhibited at UIC\'s Year End Show where we showed it off live to dozens of random visitors who got to experience it in real time. Users understood the concept immediately and became emotionally engaged with their warped images.' },
    ],
    tools: ['React', 'JavaScript', 'HTML/CSS', 'Python', 'Supabase', 'Adobe Creative Suite'],
    more: '<a href="https://pyxlarchive.digital/" target="_blank" rel="noopener" class="meta-link">VIEW LIVE SITE</a>',
  },
  { slug: 'terra', title: 'TERRA',        date: '04/2026',       image: '/assets/projects/project-2.jpg', alt: 'TERRA',
    images: [
      '/assets/terra-images/branding1.webp',
      '/assets/terra-images/branding2.webp',
      '/assets/terra-images/1.webp',
      '/assets/terra-images/2.webp',
      '/assets/terra-images/3.webp',
      '/assets/terra-images/4.webp',
      '/assets/terra-images/5.webp',
      '/assets/terra-images/6.webp',
      '/assets/terra-images/7.webp',
      '/assets/terra-images/8.webp',
      '/assets/terra-images/9.webp',
      '/assets/terra-images/10.webp',
      '/assets/terra-images/11.webp',
      '/assets/terra-images/12.webp',
      '/assets/terra-images/13.webp',
      '/assets/terra-images/14.webp',
      '/assets/terra-images/15.webp',
      '/assets/terra-images/16.webp',
      '/assets/terra-images/17.webp',
      '/assets/terra-images/18.webp',
      '/assets/terra-images/19.webp',
      '/assets/terra-images/c1.webp',
      '/assets/terra-images/s1.webp',
      '/assets/terra-images/s2.webp',
      '/assets/terra-images/s3.webp',
      '/assets/terra-images/slide1.webp',
      '/assets/terra-images/slide2.webp',
    ],
    description: 'Studio Terra is a sustainable plant care brand and product experience designed for beginner plant owners. As part of a four-person team, we synthesized extensive user research, brand identity, and product design into a cohesive system that makes plant ownership less intimidating.',
    sections: [
      { label: 'PROBLEM', text: 'How might we make plant care accessible and approachable for people new to plant ownership?' },
      { label: 'PROCESS', text: 'Our team conducted user research with plant owners to understand their pain points, then ideated and developed multiple design directions based on feedback. We landed on a brand identity centered around sustainability and simplicity. As creative director, I led the visual direction—designing the typography system, visual identity, and directing product photography. Our team prototyped and manufactured custom pots that embody the brand system, creating a complete experience from packaging to product.' },
    ],
    tools: ['Adobe Creative Suite', 'Photography', 'Product Design', 'Brand Systems'],
  },
  { slug: 'project-152', title: 'PROJECT 152',  date: '11/2024',       image: '/assets/projects/project-3.jpg', alt: 'PROJECT 152',
    images: [
      '/assets/p152-images/1.webp',
      '/assets/p152-images/2.webp',
      '/assets/p152-images/3.webp',
      '/assets/p152-images/4.webp',
    ],
    description: 'PROJECT 152 is a CTA-based publication that explores design practice through research, photography, and typography. The zine synthesizes an extensive interview with designer Joe Nelson alongside original photography shot during Fall 2024, examining how visual systems can tell stories about design culture and community.',
    sections: [
      { label: 'PROCESS', text: 'I conducted research into the CTA design world and interviewed designer Joe Nelson to understand his practice. The interview revealed a designer who balances logical, structured design with personal passion for the CTA\'s street art culture. Throughout the design process, I shot original photography that became integral to the visual system. Photography was used as compositional building blocks within the hierarchy, creating dynamic layouts that reflect Joe\'s dual practice. I designed the full publication system across multiple chapters, each with distinct visual treatments tied to the CTA line color system. Multiple copies were printed on risograph and laser printers.' },
    ],
    tools: ['Adobe InDesign', 'Adobe Photoshop', 'Photography', 'Risograph', 'Book Binding'],
  },
  { slug: 'crystal-goblet', title: 'CRYSTAL GOBLET', date: '11/2024', image: '/assets/projects/project-4.jpg', alt: 'CRYSTAL GOBLET',
    images: [
      '/assets/crystalgoblet-images/1.webp',
      '/assets/crystalgoblet-images/2.webp',
      '/assets/crystalgoblet-images/3.webp',
      '/assets/crystalgoblet-images/4.webp',
      '/assets/crystalgoblet-images/5.webp',
      '/assets/crystalgoblet-images/6.webp',
      '/assets/crystalgoblet-images/7.webp',
      '/assets/crystalgoblet-images/8.webp',
      '/assets/crystalgoblet-images/9.webp',
      '/assets/crystalgoblet-images/10.webp',
      '/assets/crystalgoblet-images/11.webp',
    ],
    description: 'Beatrice Warde\'s "Crystal Goblet" claims that typography needs to follow strict rules to succeed. The "Post Typographic Manifesto" argues the opposite, and claims that expression and experimentation are more important. In my first study of type, I created a booklet juxtaposing these two theories. The first section includes standard type layouts, all using the Garamond typeface. The study continues with type specimens, illustrations and grids. The booklet concludes with experimental typography, all using the font Helvetica, including photography, collages, and lyrical type illustrations. This booklet was designed in Adobe InDesign, printed at UIC\'s print lab, and bound with a chain stitch.',
    skills: ['Graphic Design', 'Publication Design', 'Typography', 'Book Binding', 'Print Media'],
    tools: ['Adobe InDesign', 'Adobe Photoshop', 'Book Binding Tools'],
  },
  { href: '/gallery/street-gallery', title: 'STREET',   date: 'PHOTO GALLERY', image: '/assets/projects/project-5.jpg', alt: 'STREET' },
  { href: '/gallery/nature-gallery', title: 'NATURE',   date: 'PHOTO GALLERY', image: '/assets/projects/project-6.jpg', alt: 'NATURE' },
  { href: '/gallery/abstract-gallery', title: 'ABSTRACT', date: 'PHOTO GALLERY', image: '/assets/projects/project-7.jpg', alt: 'ABSTRACT' },
];

export default {
  title: 'XK — Work',
  bodyClass: 'work-page',
  render() {
    const cards = projects.map((p, i) => `
      <article class="project-card" ${p.slug ? `data-project-slug="${p.slug}"` : `data-project-href="${p.href}"`} role="button" tabindex="0">
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

    let navigating = false;
    document.querySelectorAll('[data-project-slug],[data-project-href]').forEach(card => {
      const p = projects.find(proj => proj.slug === card.dataset.projectSlug);
      const go = () => {
        if (navigating) return;
        navigating = true;
        if (card.dataset.projectHref) {
          navigate(card.dataset.projectHref);
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
