export default {
  title: 'XK — Contact',
  bodyClass: 'work-page',
  render() {
    return `
      <main class="contact-layout" style="opacity:0;transition:opacity 520ms ease">
        <span class="contact-heading">CONTACT</span>
        <div class="contact-items">
          <div class="contact-item">
            <span class="contact-label">EMAIL</span>
            <a class="contact-link" href="#">LINK</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">LINKEDIN</span>
            <a class="contact-link" href="#">LINK</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">INSTAGRAM</span>
            <a class="contact-link" href="#">LINK</a>
          </div>
        </div>
      </main>
    `;
  },
  init() {
    const layout = document.querySelector('.contact-layout');
    setTimeout(() => { if (layout) layout.style.opacity = '1'; }, 120);
  },
  exit() {
    return new Promise(resolve => {
      const layout = document.querySelector('.contact-layout');
      if (!layout) { resolve(); return; }
      layout.style.transition = 'opacity 480ms ease';
      layout.style.opacity = '0';
      setTimeout(resolve, 480);
    });
  }
};
