import './style.css';

const loader = document.getElementById('loader');
const home = document.getElementById('home');

const loaderDuration = 2400;
const blackPauseDuration = 450;

window.addEventListener('load', () => {
  setTimeout(() => {
    // Fade loader out into pure black.
    loader.classList.add('is-hidden');

    // After black pause, fade in real homepage.
    setTimeout(() => {
      home.classList.add('is-visible');
    }, 900 + blackPauseDuration);
  }, loaderDuration);
});