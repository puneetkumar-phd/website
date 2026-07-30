(() => {
  const PAGE_SIZE = 10;
  const categories = {
    all: { label: 'All knowledge areas', short: 'All resources', description: 'Search the complete library.' },
    'molecular-simulation': { label: 'Molecular simulation & free-energy methods', short: 'Molecular simulation', description: 'MD, enhanced sampling, free energy, and trajectory analysis.' },
    'computational-chemistry': { label: 'Computational chemistry & structure-based design', short: 'Computational chemistry', description: 'Docking, virtual screening, QM/MM, DFT, and lead design.' },
    cheminformatics: { label: 'Cheminformatics & QSAR', short: 'Cheminformatics & QSAR', description: 'RDKit, curation, descriptors, fingerprints, chemical space, and QSAR.' },
    bioinformatics: { label: 'Bioinformatics & multi-omics', short: 'Bioinformatics & multi-omics', description: 'Transcriptomics, pathways, biomarkers, and multi-omics integration.' },
    'machine-learning': { label: 'Machine learning & AI for drug discovery', short: 'Machine learning & AI', description: 'Classical ML, deep learning, GNNs, explainability, and validation.' },
    'research-software': { label: 'Research software, Linux & reproducibility', short: 'Software & reproducibility', description: 'GPU environments, Linux, package management, automation, and benchmarks.' },
    alerts: { label: 'Publications, datasets, conferences & opportunities', short: 'Alerts & opportunities', description: 'Papers, datasets, events, vacancies, and deadlines.' }
  };

  const types = {
    all: 'All content types',
    tutorial: 'Tutorial',
    software: 'Software information',
    research: 'Research update',
    publication: 'Publication alert',
    dataset: 'Dataset',
    opportunity: 'Vacancy or opportunity',
    resource: 'Reference resource'
  };

  const years = Array.isArray(window.UPDATE_YEARS) ? window.UPDATE_YEARS.map(String) : [];
  const latestYear = years[0] || String(new Date().getFullYear());
  const loadedYears = new Set();
  const state = { search: '', category: 'all', type: 'all', year: latestYear, page: 1 };

  const el = {
    notices: document.querySelector('#latest-notices'),
    directory: document.querySelector('#category-directory'),
    search: document.querySelector('#updates-search'),
    category: document.querySelector('#updates-category'),
    type: document.querySelector('#updates-type'),
    year: document.querySelector('#updates-year'),
    clear: document.querySelector('#updates-clear'),
    summary: document.querySelector('#results-summary'),
    list: document.querySelector('#resource-list'),
    prev: document.querySelector('#page-prev'),
    next: document.querySelector('#page-next'),
    indicator: document.querySelector('#page-indicator')
  };

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const formatDate = value => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`));

  function loadYear(year) {
    if (loadedYears.has(year) || window.UPDATE_LIBRARY?.[year]) {
      loadedYears.add(year);
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `assets/data/updates-${year}.js`;
      script.onload = () => { loadedYears.add(year); resolve(); };
      script.onerror = () => reject(new Error(`Could not load updates-${year}.js`));
      document.head.appendChild(script);
    });
  }

  async function ensureYearData(year) {
    if (year === 'all') await Promise.all(years.map(loadYear));
    else await loadYear(year);
  }

  function entriesFor(year) {
    const library = window.UPDATE_LIBRARY || {};
    if (year === 'all') return years.flatMap(y => library[y] || []);
    return library[year] || [];
  }

  function activeFeaturedEntries() {
    const today = new Date();
    const all = years.flatMap(y => window.UPDATE_LIBRARY?.[y] || []);
    return all
      .filter(item => item.featured)
      .filter(item => !item.expires || new Date(`${item.expires}T23:59:59`) >= today)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }

  function renderNotices() {
    const items = activeFeaturedEntries();
    if (!items.length) {
      el.notices.innerHTML = '<div class="empty-state">No active notices are currently posted. New research updates, vacancies, deadlines, and publication alerts will appear here.</div>';
      return;
    }
    el.notices.innerHTML = items.map(item => `
      <article class="notice-card">
        <div class="notice-meta">
          <span class="notice-kind">${escapeHtml(item.status || types[item.type] || 'Update')}</span>
          <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDate(item.date))}</time>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        ${item.url ? `<a class="resource-link notice-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.linkLabel || 'Open item')}</a>` : ''}
      </article>`).join('');
  }

  function fillSelects() {
    el.category.innerHTML = Object.entries(categories).map(([key, item]) => `<option value="${key}">${escapeHtml(item.label)}</option>`).join('');
    el.type.innerHTML = Object.entries(types).map(([key, label]) => `<option value="${key}">${escapeHtml(label)}</option>`).join('');
    el.year.innerHTML = [`<option value="all">All years</option>`, ...years.map(year => `<option value="${year}">${year}</option>`)].join('');
  }

  function renderDirectory(entries) {
    const counts = Object.keys(categories).reduce((acc, key) => {
      acc[key] = key === 'all' ? entries.length : entries.filter(item => item.category === key).length;
      return acc;
    }, {});
    el.directory.innerHTML = Object.entries(categories).map(([key, item]) => `
      <button class="category-card ${state.category === key ? 'is-active' : ''}" type="button" data-category-card="${key}">
        <strong>${escapeHtml(item.short)}</strong>
        <small>${escapeHtml(item.description)}</small>
        <span class="category-count">${counts[key]} item${counts[key] === 1 ? '' : 's'} in selected year</span>
      </button>`).join('');
    el.directory.querySelectorAll('[data-category-card]').forEach(button => {
      button.addEventListener('click', () => {
        state.category = button.dataset.categoryCard;
        state.page = 1;
        el.category.value = state.category;
        render();
        document.querySelector('#resource-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function filteredEntries(entries) {
    const q = state.search.trim().toLowerCase();
    return entries
      .filter(item => state.category === 'all' || item.category === state.category)
      .filter(item => state.type === 'all' || item.type === state.type)
      .filter(item => {
        if (!q) return true;
        const haystack = [item.title, item.summary, item.status, categories[item.category]?.label, types[item.type], ...(item.tags || [])].join(' ').toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  }

  function renderResources(items) {
    if (!items.length) {
      el.list.innerHTML = '<div class="empty-state">No matching resources were found. Clear one or more filters or try a broader search term.</div>';
      return;
    }
    el.list.innerHTML = items.map(item => `
      <article class="resource-card">
        <div class="resource-date"><time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDate(item.date))}</time></div>
        <div>
          <div class="resource-meta">
            <span class="resource-type">${escapeHtml(types[item.type] || item.type)}</span>
            <span class="resource-category">${escapeHtml(categories[item.category]?.label || item.category)}</span>
          </div>
          <h3>${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          <div class="resource-footer">
            <div class="resource-tags">${(item.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
            ${item.url ? `<a class="resource-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.linkLabel || 'Open resource')}</a>` : ''}
          </div>
        </div>
      </article>`).join('');
  }

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.search) params.set('q', state.search);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.type !== 'all') params.set('type', state.type);
    if (state.year !== latestYear) params.set('year', state.year);
    if (state.page > 1) params.set('page', String(state.page));
    const next = `${location.pathname}${params.toString() ? `?${params}` : ''}${location.hash}`;
    history.replaceState(null, '', next);
  }

  async function render() {
    try {
      await ensureYearData(state.year);
      const allForYear = entriesFor(state.year);
      const filtered = filteredEntries(allForYear);
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      state.page = Math.min(Math.max(1, state.page), totalPages);
      const start = (state.page - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);

      renderDirectory(allForYear);
      renderResources(pageItems);
      el.summary.innerHTML = `<strong>${filtered.length}</strong> matching item${filtered.length === 1 ? '' : 's'}`;
      el.indicator.textContent = `Page ${state.page} of ${totalPages}`;
      el.prev.disabled = state.page <= 1;
      el.next.disabled = state.page >= totalPages;
      updateUrl();
    } catch (error) {
      el.list.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}. Confirm that the corresponding yearly data file was uploaded to <code>assets/data</code>.</div>`;
    }
  }

  function readUrlState() {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const type = params.get('type');
    const year = params.get('year');
    state.search = params.get('q') || '';
    if (category && categories[category]) state.category = category;
    if (type && types[type]) state.type = type;
    if (year === 'all' || years.includes(year)) state.year = year;
    state.page = Math.max(1, Number(params.get('page') || 1));
  }

  function bind() {
    let timer;
    el.search.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.search = el.search.value; state.page = 1; render(); }, 180);
    });
    el.category.addEventListener('change', () => { state.category = el.category.value; state.page = 1; render(); });
    el.type.addEventListener('change', () => { state.type = el.type.value; state.page = 1; render(); });
    el.year.addEventListener('change', () => { state.year = el.year.value; state.page = 1; render(); });
    el.clear.addEventListener('click', () => {
      Object.assign(state, { search: '', category: 'all', type: 'all', year: latestYear, page: 1 });
      el.search.value = '';
      el.category.value = 'all';
      el.type.value = 'all';
      el.year.value = latestYear;
      render();
    });
    el.prev.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; render(); window.scrollTo({ top: el.summary.offsetTop - 120, behavior: 'smooth' }); } });
    el.next.addEventListener('click', () => { state.page += 1; render(); window.scrollTo({ top: el.summary.offsetTop - 120, behavior: 'smooth' }); });
  }

  async function init() {
    readUrlState();
    fillSelects();
    el.search.value = state.search;
    el.category.value = state.category;
    el.type.value = state.type;
    el.year.value = state.year;
    bind();
    await loadYear(latestYear);
    renderNotices();
    await render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
