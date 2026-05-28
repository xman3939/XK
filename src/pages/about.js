import { fragmentElement, runReveal } from '../text-reveal.js';

const bio = [
  `HI, I'M XAVIER KANIA, A GRAPHIC DESIGNER AND DEVELOPER. I AM A RECENT UIC GRADUATE FROM THE FIRST COHORT OF COMPUTER SCIENCE AND DESIGN STUDIES. WHETHER IT'S DESIGNING OR DEVELOPING, MY WORK IS STRUCTURED THROUGH ITERATION AND RESEARCH.`,
  `WITH A BACKGROUND IN COMPUTER SCIENCE, I HAVE THE FOUNDATION TO ADAPT QUICKLY WITH A CONTINUALLY EVOLVING TECHNOLOGICAL MARKET. THIS ALSO INFORMS MY DESIGNS, AND I AM ABLE TO CONSIDER DEVELOPER AND DESIGNER ROLES WHEN WORKING IN A TEAM SETTING. MY DESIGN BACKGROUND INFORMS ALL OF MY WORK, USABILITY IS NEVER AN AFTERTHOUGHT WHEN MAKING SOMETHING VISUALLY APPEALING. AND ALTHOUGH MY PHOTOGRAPHY WORK STARTED AS JUST A HOBBY, IT HAS NOT ONLY HEAVILY INFLUENCED MY PERSONAL DESIGN PREFERENCES, BUT ALSO TRAINED MY EYE TO UNDERSTAND THE SUCCESSFUL AND UNSUCCESSFUL IN VARIOUS VISUAL CONTEXTS.`,
  `ULTIMATELY, MY PROCESS IS ABOUT CAREFULLY BALANCING MY DESIGN VALUES AND APPLYING THAT TOWARDS ANY PROJECT I'M WORKING ON. WHETHER IT'S FORM VERSUS FUNCTION, OR CREATIVITY VERSUS LOGIC, I WANT TO CREATE PROJECTS THAT HAVE A BASIS IN RESEARCH, TRIAL AND ERROR, AND CREATE A MEANINGFUL IMPACT.`,
];

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
    const bioHtml    = bio.map(p => `<p class="bio-para">${p}</p>`).join('');

    return `
      <div class="project-page" style="opacity:0">
        <section class="project-hero">
          <div class="project-info">
            <div class="project-meta-grid">
              <span class="meta-label">ABOUT</span>
              <span class="meta-value meta-value--desc">${bioHtml}</span>
              <button class="desc-toggle" aria-expanded="false">VIEW MORE +</button>
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

    // Word-level fragmentation for each bio paragraph
    document.querySelectorAll('.bio-para').forEach(p => {
      const words = p.textContent.trim().split(/(\s+)/);
      p.innerHTML = words.map(w =>
        /\s/.test(w) ? w : `<span class="reveal-chunk">${w}</span>`
      ).join('');
    });

    document.querySelectorAll('.meta-label').forEach(el => fragmentElement(el));
    document.querySelectorAll('.meta-item').forEach(el => fragmentElement(el));

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
          if (descToggle) runReveal(descToggle, { burstCount: 1, burstGap: 0, chunkGap: 20 });
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
