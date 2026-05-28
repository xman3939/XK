import './style.css';
import { fragmentElement, runReveal } from './text-reveal.js';
import { navigate, render } from './router.js';

const loader = document.getElementById('loader');
const loaderLogo = loader.querySelector('.loader-logo');
const loaderText = loader.querySelector('.loader-text');
const loaderDuration = 2800;

// Fragment nav buttons into reveal chunks before anything shows
document.querySelectorAll('[data-route]').forEach(btn => fragmentElement(btn));

// Wire nav clicks
document.querySelectorAll('[data-route]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.route));
});

// Mobile menu
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
const menuBlurOverlay = document.getElementById('menu-blur-overlay');

function openMobileMenu() {
  mobileMenuLinks.forEach(link => link.classList.remove('menu-link-animate'));
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuBlurOverlay.classList.add('is-active');
  mobileMenuLinks.forEach((link, i) => {
    setTimeout(() => link.classList.add('menu-link-animate'), 200 + i * 90);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileMenuLinks.forEach(link => link.classList.remove('menu-link-animate'));
  menuBlurOverlay.classList.remove('is-active');
}

mobileMenuToggle.addEventListener('click', openMobileMenu);
mobileMenuClose.addEventListener('click', closeMobileMenu);

mobileMenuLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    closeMobileMenu();
    navigate(btn.dataset.mobileRoute);
  });
});

window.addEventListener('load', () => {
  if (sessionStorage.getItem('loaderPlayed')) {
    loader.style.display = 'none';
    render(location.pathname);
    setTimeout(() => runReveal('#main-nav'), 80);
    return;
  }

  // Render page content behind the loader immediately
  render(location.pathname);

  setTimeout(() => {
    // Step 1: text slides down and fades
    loaderText.classList.add('is-hiding');

    // Step 2: logo fades out slowly
    setTimeout(() => {
      loaderLogo.classList.add('is-hiding');

      // Step 3: hide loader, hold black screen, then reveal home elements
      setTimeout(() => {
        loader.style.display = 'none';
        sessionStorage.setItem('loaderPlayed', '1');
        setTimeout(() => {
          window.dispatchEvent(new Event('loaderHide'));
          runReveal('#main-nav');
        }, 350);
      }, 850);
    }, 300);
  }, loaderDuration);
});
