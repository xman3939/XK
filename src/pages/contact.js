import { fragmentElement, runReveal } from '../text-reveal.js';

const clusters = [
  { label: 'EMAIL',     href: 'mailto:xavierkania1222@gmail.com',           display: 'XAVIERKANIA1222@GMAIL.COM' },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/xman3939',       display: 'XMAN3939' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/xavier_kania',     display: '@XAVIER_KANIA' },
  { label: 'GITHUB',    href: 'https://github.com/xman3939',                display: 'XMAN3939' },
];

const clustersHtml = clusters.map(c => `
  <div class="contact-cluster">
    <span class="contact-label">${c.label}</span>
    <a class="contact-link" href="${c.href}" target="${c.href.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener">${c.display}</a>
  </div>
`).join('');

export default {
  title: 'XK — Contact',
  bodyClass: 'contact-page',

  render() {
    return `
      <div class="contact-desktop">
        <img class="contact-logo" src="/assets/XK1W.svg" alt="XK" />
        <div class="contact-links-row">${clustersHtml}</div>
      </div>
      <div class="contact-mobile">
        <div class="contact-grid">
          <div class="contact-grid-left">
            <span class="contact-heading">CONTACT</span>
          </div>
          <div class="contact-grid-right">${clustersHtml}</div>
        </div>
        <img class="contact-mobile-logo" src="/assets/XK1W.svg" alt="XK" />
      </div>
    `;
  },

  init() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      document.querySelectorAll('.contact-mobile .contact-heading').forEach(el => fragmentElement(el));
      document.querySelectorAll('.contact-mobile .contact-label').forEach(el => fragmentElement(el));
      document.querySelectorAll('.contact-mobile .contact-link').forEach(el => fragmentElement(el));

      const logo = document.querySelector('.contact-mobile-logo');
      if (logo) logo.classList.add('is-decompressing');

      setTimeout(() => {
        runReveal('.contact-mobile', { burstCount: 5, burstGap: 60, chunkGap: 18 });
      }, 450);
    } else {
      document.querySelectorAll('.contact-desktop .contact-label').forEach(el => fragmentElement(el));
      document.querySelectorAll('.contact-desktop .contact-link').forEach(el => fragmentElement(el));

      const logo = document.querySelector('.contact-logo');
      if (logo) logo.classList.add('is-decompressing');

      setTimeout(() => {
        runReveal('.contact-links-row', { burstCount: 4, burstGap: 65, chunkGap: 22 });
      }, 450);
    }
  },

  exit() {
    return new Promise(resolve => {
      const isMobile = window.innerWidth <= 768;
      const logo    = document.querySelector(isMobile ? '.contact-mobile-logo' : '.contact-logo');
      const textEl  = document.querySelector(isMobile ? '.contact-grid'        : '.contact-links-row');

      if (!logo) { resolve(); return; }

      // Step 1: flatten logo (inline style overrides the decompressing class animation)
      logo.style.animation = 'loaderSquish 380ms cubic-bezier(0.4, 0, 1, 1) forwards';

      // Step 2: fade text after squish
      setTimeout(() => {
        if (textEl) {
          textEl.style.transition = 'opacity 280ms ease';
          textEl.style.opacity = '0';
        }
        setTimeout(resolve, 280);
      }, 380);
    });
  }
};
