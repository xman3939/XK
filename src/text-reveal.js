function chunkText(text) {
  const source = String(text ?? "");
  const parts = [];
  let i = 0;
  while (i < source.length) {
    const remaining = source.length - i;
    const size = Math.min(remaining, Math.random() < 0.55 ? 1 : 2);
    parts.push(source.slice(i, i + size));
    i += size;
  }
  return parts;
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function fragmentElement(el) {
  const text = String(el.textContent ?? "");
  el.innerHTML = chunkText(text)
    .map(c => `<span class="reveal-chunk">${esc(c)}</span>`)
    .join("");
}

function buildBurstPlan(nodes, burstCount) {
  const shuffled = [...nodes].sort(() => Math.random() - 0.5);
  const bursts = Array.from({ length: burstCount }, () => []);
  shuffled.forEach((node, i) => bursts[i % burstCount].push(node));
  return bursts.map(b => b.sort(() => Math.random() - 0.5));
}

export function runReveal(scope, { burstCount = 6, burstGap = 82, chunkGap = 24 } = {}) {
  const root = typeof scope === "string"
    ? document.querySelector(scope)
    : (scope ?? document.body);
  const chunks = [...(root?.querySelectorAll(".reveal-chunk") ?? [])];
  if (!chunks.length) return;

  const bursts = buildBurstPlan(chunks, burstCount);
  bursts.forEach((burst, bi) => {
    setTimeout(() => {
      burst.forEach((chunk, ci) => {
        setTimeout(() => chunk.classList.add("is-visible"), ci * chunkGap);
      });
    }, bi * burstGap);
  });
}
