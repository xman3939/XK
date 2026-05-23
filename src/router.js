const routes = [
  { path: '/',           page: () => import('./pages/home.js') },
  { path: '/work',       page: () => import('./pages/work.js') },
  { path: '/about',      page: () => import('./pages/about.js') },
  { path: '/contact',    page: () => import('./pages/contact.js') },
  { path: '/work/:slug',    page: () => import('./pages/project.js') },
  { path: '/gallery/:id',  page: () => import('./pages/gallery.js') },
];

function matchRoute(pathname) {
  const exact = routes.find(r => r.path === pathname);
  if (exact) return { route: exact, params: {} };

  for (const route of routes) {
    if (!route.path.includes(':')) continue;
    const pattern = route.path.replace(/:([^/]+)/g, '([^/]+)');
    const match = pathname.match(new RegExp(`^${pattern}$`));
    if (match) {
      const keys = [...route.path.matchAll(/:([^/]+)/g)].map(m => m[1]);
      const params = Object.fromEntries(keys.map((k, i) => [k, match[i + 1]]));
      return { route, params };
    }
  }

  return null;
}

function updateNavActive(pathname) {
  document.querySelectorAll('[data-route], [data-mobile-route]').forEach(btn => {
    const route = btn.getAttribute('data-route') ?? btn.getAttribute('data-mobile-route');
    const isActive = pathname === route
      || (route !== '/' && pathname.startsWith(route))
      || (route === '/work' && pathname.startsWith('/gallery'));
    btn.classList.toggle('is-active', isActive);
  });
}

let currentPage = null;

export async function render(pathname) {
  const matched = matchRoute(pathname);
  if (!matched) return;

  updateNavActive(pathname);
  await currentPage?.exit?.();

  const { default: page } = await matched.route.page();
  const app = document.getElementById('app');

  document.body.className = page.bodyClass ?? '';
  app.innerHTML = page.render(matched.params);
  document.title = page.title ?? 'XK';

  currentPage = page;
  page.init?.(matched.params);
}

export async function navigate(path) {
  history.pushState(null, '', path);
  await render(path);
}

window.addEventListener('popstate', () => render(location.pathname));
