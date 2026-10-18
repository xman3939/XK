import { fragmentElement, runReveal } from '../text-reveal.js';
import { LETTER_LOGOS, growLetterLogo } from '../letter-logo.js';

const clusters = [
  { label: 'EMAIL',     href: 'mailto:xavierkania1222@gmail.com',           display: 'XAVIERKANIA1222@GMAIL.COM' },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/xman3939',       display: 'XMAN3939' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/xavier_kania',     display: '@XAVIER_KANIA' },
  { label: 'GITHUB',    href: 'https://github.com/xman3939',                display: 'XMAN3939' },
];

// Resume PDF (end of the contact list); downloads with a friendly file name
const RESUME_URL = '/assets/pdf/RESUME_XK.pdf';
const RESUME_FILENAME = 'Xavier-Kania-Resume.pdf';

const allClusters = [
  ...clusters,
  { label: 'RESUME', href: RESUME_URL, display: 'DOWNLOAD PDF', download: true },
];

const clustersHtml = allClusters.map(c => `
  <div class="contact-cluster">
    <span class="contact-label">${c.label}</span>
    <a class="contact-link" href="${c.href}" ${c.download ? `download="${RESUME_FILENAME}"` : `target="${c.href.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener"`}>${c.display}</a>
  </div>
`).join('');

export default {
  title: 'XK — Contact',
  bodyClass: 'contact-page',

  render() {
    return `
      <div class="contact-desktop">
        <div class="contact-logo letter-logo" role="img" aria-label="Xavier Kania"></div>
        <div class="contact-links-row">${clustersHtml}</div>
      </div>
      <div class="contact-mobile">
        <div class="contact-mobile-links">${clustersHtml}</div>
        <div class="contact-mobile-logo letter-logo" role="img" aria-label="Xavier"></div>
      </div>
    `;
  },

  init() {
    const isMobile = window.innerWidth <= 768;

    // Build both logos (desktop + mobile) whatever the starting size, so resizing across
    // the breakpoint never leaves a logo missing; a hidden one grows in when it appears.
    const desktopLogo = document.querySelector('.contact-logo');
    const mobileLogo = document.querySelector('.contact-mobile-logo');
    if (desktopLogo) growLetterLogo(desktopLogo, LETTER_LOGOS.xavierKania);
    if (mobileLogo) growLetterLogo(mobileLogo, LETTER_LOGOS.xavier);

    if (isMobile) {
      document.querySelectorAll('.contact-mobile .contact-label').forEach(el => fragmentElement(el));
      document.querySelectorAll('.contact-mobile .contact-link').forEach(el => fragmentElement(el));

      setTimeout(() => {
        runReveal('.contact-mobile', { burstCount: 5, burstGap: 60, chunkGap: 18 });
      }, 450);
    } else {
      document.querySelectorAll('.contact-desktop .contact-label').forEach(el => fragmentElement(el));
      document.querySelectorAll('.contact-desktop .contact-link').forEach(el => fragmentElement(el));

      setTimeout(() => {
        runReveal('.contact-links-row', { burstCount: 4, burstGap: 65, chunkGap: 22 });
      }, 450);
    }
  },

  exit() {
    return new Promise(resolve => {
      const isMobile = window.innerWidth <= 768;
      const logo    = document.querySelector(isMobile ? '.contact-mobile-logo' : '.contact-logo');
      const textEl  = document.querySelector(isMobile ? '.contact-mobile-links' : '.contact-links-row');

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
