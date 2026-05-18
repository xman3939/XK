import './style.css';
import { fragmentElement, runReveal } from './text-reveal.js';
import { navigate, render } from './router.js';

const loader = document.getElementById('loader');
const loaderDuration = 2400;
const blackPauseDuration = 450;

// Fragment nav buttons into reveal chunks before anything shows
document.querySelectorAll('[data-route]').forEach(btn => fragmentElement(btn));

// Wire nav clicks
document.querySelectorAll('[data-route]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.route));
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
    loader.classList.add('is-hidden');

    setTimeout(() => {
      loader.style.display = 'none';
      sessionStorage.setItem('loaderPlayed', '1');
      setTimeout(() => runReveal('#main-nav'), 120);
    }, 900 + blackPauseDuration);
  }, loaderDuration);
});
