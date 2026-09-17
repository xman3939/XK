export const clusters = [
  { label: 'EMAIL',     href: 'mailto:xavierkania1222@gmail.com',           display: 'XAVIERKANIA1222@GMAIL.COM' },
  { label: 'LINKEDIN',  href: 'https://www.linkedin.com/in/xman3939',       display: 'XMAN3939' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/xavier_kania',     display: '@XAVIER_KANIA' },
  { label: 'GITHUB',    href: 'https://github.com/xman3939',                display: 'XMAN3939' },
];

export const clustersHtml = clusters.map(c => `
  <div class="contact-cluster">
    <span class="contact-label">${c.label}</span>
    <a class="contact-link" href="${c.href}" target="${c.href.startsWith('mailto') ? '_self' : '_blank'}" rel="noopener">${c.display}</a>
  </div>
`).join('');
