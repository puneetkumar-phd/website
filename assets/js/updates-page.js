(() => {
  'use strict';

  const UPDATE_PAGE_SIZE = 50;
  const RESOURCE_PAGE_SIZE = 12;
  const years = (window.UPDATE_YEARS || []).map(String);
  const updateTypes = window.UPDATE_TYPES || { all: 'All entries' };
  const categoryDefs = window.RESOURCE_CATEGORIES || [];
  const quickTags = window.RESOURCE_QUICK_TAGS || ['all'];
  const categoryMap = Object.fromEntries(categoryDefs.map(item => [item.id, item]));

  const state = {
    updateYear: years[0] || String(new Date().getFullYear()),
    updateType: 'all',
    resourceQuery: '',
    resourceCategory: 'all',
    resourceTag: 'all',
    resourcePage: 1
  };

  const loadedUpdateYears = new Set();
  const loadedResourceFiles = new Set();

  const el = {
    updateYear: document.querySelector('#update-year'),
    updateType: document.querySelector('#update-type'),
    updateTimeline: document.querySelector('#update-timeline'),
    resourceSearch: document.querySelector('#resource-search'),
    resourceClear: document.querySelector('#resource-clear'),
    resourceTabs: document.querySelector('#resource-category-tabs'),
    resourceTagFilters: document.querySelector('#resource-tag-filters'),
    resourceSummary: document.querySelector('#resource-summary'),
    resourceList: document.querySelector('#resource-list'),
    resourcePrev: document.querySelector('#resource-prev'),
    resourceNext: document.querySelector('#resource-next'),
    resourcePageIndicator: document.querySelector('#resource-page-indicator')
  };

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));

  const loadScript = src => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.dynamicSrc = src;
    script.addEventListener('load', () => { script.dataset.loaded = 'true'; resolve(); }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Could not load ${src}`)), { once: true });
    document.head.appendChild(script);
  });

  async function loadUpdateYear(year) {
    if (loadedUpdateYears.has(year) || window.UPDATE_POSTS?.[year]) {
      loadedUpdateYears.add(year);
      return;
    }
    await loadScript(`assets/data/updates-${year}.js`);
    loadedUpdateYears.add(year);
  }

  async function loadResourceFiles() {
    const files = categoryDefs.filter(item => item.id !== 'all').flatMap(item => item.files || []);
    await Promise.all(files.map(async file => {
      if (loadedResourceFiles.has(file)) return;
      await loadScript(file);
      loadedResourceFiles.add(file);
    }));
  }

  const formatFullDate = value => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(`${value}T12:00:00`));

  const formatMonth = value => new Intl.DateTimeFormat('en-GB', {
    month: 'long', year: 'numeric'
  }).format(new Date(`${value}-15T12:00:00`));

  function fillUpdateControls() {
    el.updateYear.innerHTML = years.map(year => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join('');
    el.updateType.innerHTML = Object.entries(updateTypes).map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`).join('');
    el.updateYear.value = state.updateYear;
    el.updateType.value = state.updateType;
  }

  function groupByMonth(items) {
    return items.reduce((groups, item) => {
      const month = item.date.slice(0, 7);
      (groups[month] ||= []).push(item);
      return groups;
    }, {});
  }

  async function renderUpdates() {
    try {
      await loadUpdateYear(state.updateYear);
      const posts = (window.UPDATE_POSTS?.[state.updateYear] || [])
        .filter(item => state.updateType === 'all' || item.type === state.updateType)
        .sort((a, b) => b.date.localeCompare(a.date));

      if (!posts.length) {
        el.updateTimeline.innerHTML = '<div class="empty-state">No entries match the selected year and type.</div>';
        return;
      }

      const groups = groupByMonth(posts);
      const months = Object.keys(groups).sort((a, b) => b.localeCompare(a));
      el.updateTimeline.innerHTML = months.map((month, monthIndex) => {
        const entries = groups[month];
        return `
          <details class="month-group" ${monthIndex === 0 ? 'open' : ''}>
            <summary><span>${escapeHtml(formatMonth(month))}</span><small>${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}</small></summary>
            <div class="month-content">
              ${entries.map(item => {
                const expired = item.expires && new Date(`${item.expires}T23:59:59`) < new Date();
                const label = expired ? 'Closed opportunity' : (updateTypes[item.type] || item.type);
                return `
                  <article class="update-log-item">
                    <time class="update-date" datetime="${escapeHtml(item.date)}">${escapeHtml(formatFullDate(item.date))}</time>
                    <div>
                      <span class="update-type">${escapeHtml(label)}</span>
                      <h3>${escapeHtml(item.title)}</h3>
                      <p>${escapeHtml(item.summary)}</p>
                      ${item.url ? `<a class="resource-link update-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.linkLabel || 'Open link')}</a>` : ''}
                    </div>
                  </article>`;
              }).join('')}
            </div>
          </details>`;
      }).join('');
    } catch (error) {
      el.updateTimeline.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}. Confirm that the yearly file exists in <code>assets/data</code>.</div>`;
    }
  }

  function allResources() {
    const library = window.RESOURCE_LIBRARY || {};
    const items = [];
    categoryDefs.filter(category => category.id !== 'all').forEach(category => {
      (library[category.id] || []).forEach((resource, index) => {
        items.push({ ...resource, category: category.id, categoryLabel: category.label, number: index + 1 });
      });
    });
    return items;
  }

  function derivedTags(resource) {
    const tags = new Set((resource.tags || []).map(tag => String(tag).toLowerCase()));
    ['website', 'tutorial', 'code', 'dataset', 'documentation'].forEach(kind => {
      if (resource[kind]) tags.add(kind);
    });
    return [...tags];
  }

  function renderCategoryTabs(resources) {
    el.resourceTabs.innerHTML = categoryDefs.map(category => {
      const count = category.id === 'all' ? resources.length : resources.filter(item => item.category === category.id).length;
      return `<button class="section-tab ${state.resourceCategory === category.id ? 'is-active' : ''}" type="button" data-resource-category="${escapeHtml(category.id)}">${escapeHtml(category.label)} (${count})</button>`;
    }).join('');

    el.resourceTabs.querySelectorAll('[data-resource-category]').forEach(button => {
      button.addEventListener('click', () => {
        state.resourceCategory = button.dataset.resourceCategory;
        state.resourcePage = 1;
        renderResources();
      });
    });
  }

  function prettyTag(tag) {
    if (tag === 'all') return 'All';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  function renderTagFilters() {
    const label = '<span>Show:</span>';
    const buttons = quickTags.map(tag => `<button class="tag-filter ${state.resourceTag === tag ? 'is-active' : ''}" type="button" data-resource-tag="${escapeHtml(tag)}">${escapeHtml(prettyTag(tag))}</button>`).join('');
    el.resourceTagFilters.innerHTML = label + buttons;
    el.resourceTagFilters.querySelectorAll('[data-resource-tag]').forEach(button => {
      button.addEventListener('click', () => {
        state.resourceTag = button.dataset.resourceTag;
        state.resourcePage = 1;
        renderResources();
      });
    });
  }

  function filteredResources(resources) {
    const query = state.resourceQuery.trim().toLowerCase();
    return resources.filter(resource => {
      if (state.resourceCategory !== 'all' && resource.category !== state.resourceCategory) return false;
      const tags = derivedTags(resource);
      if (state.resourceTag !== 'all' && !tags.includes(state.resourceTag)) return false;
      if (!query) return true;
      const haystack = [
        resource.name,
        resource.description,
        resource.categoryLabel,
        ...tags
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  function resourceLink(resource, field, label) {
    if (!resource[field]) return '';
    return `<a class="resource-link" href="${escapeHtml(resource[field])}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
  }

  function renderResources() {
    const resources = allResources();
    renderCategoryTabs(resources);
    renderTagFilters();

    const filtered = filteredResources(resources);
    const totalPages = Math.max(1, Math.ceil(filtered.length / RESOURCE_PAGE_SIZE));
    state.resourcePage = Math.min(Math.max(1, state.resourcePage), totalPages);
    const start = (state.resourcePage - 1) * RESOURCE_PAGE_SIZE;
    const visible = filtered.slice(start, start + RESOURCE_PAGE_SIZE);

    el.resourceSummary.innerHTML = `<strong>${filtered.length}</strong> matching resource${filtered.length === 1 ? '' : 's'}`;
    el.resourcePageIndicator.textContent = `Page ${state.resourcePage} of ${totalPages}`;
    el.resourcePrev.disabled = state.resourcePage <= 1;
    el.resourceNext.disabled = state.resourcePage >= totalPages;

    if (!visible.length) {
      el.resourceList.innerHTML = '<div class="empty-state">No matching resources were found. Try another section, tag, or keyword.</div>';
      return;
    }

    el.resourceList.innerHTML = visible.map(resource => {
      const displayTags = [...new Set((resource.tags || []).map(String))];
      const seenUrls = new Set();
      const linkSpecs = [
        ['website', 'Website'],
        ['tutorial', 'Tutorial'],
        ['documentation', 'Documentation'],
        ['code', 'Code'],
        ['dataset', 'Dataset']
      ];
      const links = linkSpecs.map(([field, label]) => {
        const url = resource[field];
        if (!url || seenUrls.has(url)) return '';
        seenUrls.add(url);
        return resourceLink(resource, field, label);
      }).filter(Boolean).join('');

      return `
        <article class="resource-row">
          <div class="resource-number">${String(resource.number).padStart(2, '0')}</div>
          <div>
            <div class="resource-heading">
              <h3>${escapeHtml(resource.name)}</h3>
              <span class="resource-category">${escapeHtml(resource.categoryLabel)}</span>
            </div>
            <p>${escapeHtml(resource.description)}</p>
            <div class="resource-tags">
              ${displayTags.map(tag => `<button class="resource-tag" type="button" data-click-tag="${escapeHtml(tag.toLowerCase())}">${escapeHtml(tag)}</button>`).join('')}
            </div>
            ${links ? `<div class="resource-links">${links}</div>` : ''}
          </div>
        </article>`;
    }).join('');

    el.resourceList.querySelectorAll('[data-click-tag]').forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.dataset.clickTag;
        if (quickTags.includes(tag)) {
          state.resourceTag = tag;
          state.resourceQuery = '';
          el.resourceSearch.value = '';
        } else {
          state.resourceQuery = tag;
          el.resourceSearch.value = tag;
        }
        state.resourcePage = 1;
        renderResources();
        document.querySelector('#resource-directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function bindEvents() {
    el.updateYear.addEventListener('change', () => {
      state.updateYear = el.updateYear.value;
      renderUpdates();
    });
    el.updateType.addEventListener('change', () => {
      state.updateType = el.updateType.value;
      renderUpdates();
    });

    let searchTimer;
    el.resourceSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.resourceQuery = el.resourceSearch.value;
        state.resourceCategory = 'all';
        state.resourcePage = 1;
        renderResources();
      }, 160);
    });

    el.resourceClear.addEventListener('click', () => {
      state.resourceQuery = '';
      state.resourceCategory = 'all';
      state.resourceTag = 'all';
      state.resourcePage = 1;
      el.resourceSearch.value = '';
      renderResources();
    });

    el.resourcePrev.addEventListener('click', () => {
      if (state.resourcePage <= 1) return;
      state.resourcePage -= 1;
      renderResources();
      document.querySelector('#resource-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    el.resourceNext.addEventListener('click', () => {
      state.resourcePage += 1;
      renderResources();
      document.querySelector('#resource-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  async function init() {
    fillUpdateControls();
    bindEvents();
    await Promise.all([renderUpdates(), loadResourceFiles()]);
    renderResources();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
