
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('theme'); } catch (error) { /* storage may be unavailable in restricted previews */ }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = storedTheme || (systemDark ? 'dark' : 'light');

  function updateThemeLabel() {
    if (!themeButton) return;
    const isDark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.innerHTML = isDark
      ? '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
  }
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (error) { /* non-fatal */ }
    updateThemeLabel();
  });

  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === page) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
  });

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 }) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  document.querySelectorAll('[data-bib-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.dataset.bibToggle);
      const open = panel.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span').textContent = open ? 'Hide BibTeX' : 'BibTeX';
    });
  });
  document.querySelectorAll('[data-copy-bib]').forEach(button => {
    button.addEventListener('click', async () => {
      const panel = document.getElementById(button.dataset.copyBib);
      try {
        await navigator.clipboard.writeText(panel.textContent.trim());
        const original = button.textContent;
        button.textContent = 'Copied';
        setTimeout(() => button.textContent = original, 1600);
      } catch (error) {
        panel.classList.add('open');
      }
    });
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-pub-type]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.pubType !== filter;
    });
  }));

  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());

  const github = window.SITE_CONFIG?.githubProfile || '';
  document.querySelectorAll('[data-github-link]').forEach(link => {
    if (github && !github.includes('YOUR_')) link.href = github;
    else link.hidden = true;
  });

  const counter = document.getElementById('visitor-count');
  const code = window.SITE_CONFIG?.goatCounterCode || '';
  if (counter && code && !code.includes('YOUR_')) {
    const script = document.createElement('script');
    script.src = 'https://gc.zgo.at/count.js';
    script.async = true;
    script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
    script.addEventListener('load', () => {
      counter.innerHTML = '';
      window.goatcounter?.visit_count({
        append: '#visitor-count',
        path: 'TOTAL',
        type: 'html',
        no_branding: true,
        attr: { 'aria-label': 'Total website visits' },
        style: 'div { padding: 8px 12px; min-width: 150px; text-align: center; } #gcvc-for { font-size: 11px; opacity: .75; } #gcvc-views { font-size: 18px; font-weight: 750; }'
      });
    });
    document.body.appendChild(script);
  }
})();
