// Splits a wordmark SVG into its letters so each one can grow in on its own,
// one after another (stagger lives in CSS: .letter-logo__letter animation-delay).
// Used by the contact page (XK on desktop and mobile).

// `starts` lists the x where each letter begins in that SVG's viewBox.
// If the artwork changes, these positions need updating too.
export const LETTER_LOGOS = {
  xk: {
    src: '/assets/XK1W.svg',
    starts: [0, 228.11], // X K
  },
};

// Leftmost x a shape reaches: polygons via their points, paths via absolute M/L/H/V commands
function shapeMinX(el) {
  if (el.tagName === 'polygon') {
    const nums = (el.getAttribute('points').match(/-?\d*\.?\d+/g) || []).map(Number);
    return Math.min(...nums.filter((_, i) => i % 2 === 0));
  }
  const d = el.getAttribute('d');
  const xs = [];
  let x = 0;
  for (const [, cmd, args] of d.matchAll(/([MLHV])([^MLHVZ]*)/g)) {
    const nums = (args.match(/-?\d*\.?\d+/g) || []).map(Number);
    if (cmd === 'M' || cmd === 'L') { for (let i = 0; i < nums.length; i += 2) { x = nums[i]; xs.push(x); } }
    else if (cmd === 'H') nums.forEach(n => { x = n; xs.push(x); });
    else xs.push(x);
  }
  return Math.min(...xs);
}

// Loads the SVG into `container`, grouping its shapes into one <g> per letter (all start flat)
export async function buildLetterLogo(container, { src, starts }) {
  const svgText = await (await fetch(src)).text();
  const svg = new DOMParser().parseFromString(svgText, 'image/svg+xml').documentElement;
  // Reserve the logo's exact proportions before it grows in
  const [, , vbW, vbH] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
  container.style.aspectRatio = `${vbW} / ${vbH}`;
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('aria-hidden', 'true');
  const ns = 'http://www.w3.org/2000/svg';
  const groups = starts.map((_, i) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'letter-logo__letter');
    g.style.setProperty('--i', i);
    return g;
  });
  // Only filled shapes are drawn; stray zero-width <line>s in the artwork are dropped
  svg.querySelectorAll('line').forEach(line => line.remove());
  [...svg.querySelectorAll('path, polygon')].forEach(shape => {
    const minX = shapeMinX(shape);
    let idx = 0;
    starts.forEach((start, i) => { if (minX >= start - 1) idx = i; });
    groups[idx].appendChild(shape);
  });
  groups.forEach(g => svg.appendChild(g));
  container.appendChild(document.importNode(svg, true));
}

// Grows the letters in one by one. Once the last settles, the animation is dropped
// so the logo renders crisp and static.
export function startLetterGrow(container) {
  const letters = container.querySelectorAll('.letter-logo__letter');
  if (!letters.length) return;
  requestAnimationFrame(() => container.classList.add('is-growing'));
  letters[letters.length - 1].addEventListener('animationend', () => {
    container.classList.add('is-grown');
  }, { once: true });
}

// Build + grow right away
export function growLetterLogo(container, logo) {
  return buildLetterLogo(container, logo).then(() => startLetterGrow(container));
}
