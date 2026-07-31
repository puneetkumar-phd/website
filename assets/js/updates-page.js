(() => {
  'use strict';

  const RESOURCE_PAGE_SIZE = 12;
  const ACTIVITY_PAGE_SIZE = 8;
  const BLOG_LATEST_COUNT = 2;
  const years = (window.UPDATE_YEARS || []).map(String);
  const categoryDefs = (window.RESOURCE_CATEGORIES || []).filter(item => item.id !== 'all');
  const quickTags = window.RESOURCE_QUICK_TAGS || ['all'];

  const state = {
    pastOpportunityPage: 1,
    blogArchivePage: 1,
    publicationPage: 1,
    resourceQuery: '',
    resourceCategory: '',
    resourceTag: 'all',
    resourcePage: 1
  };

  const loadedUpdateYears = new Set();
  const loadedResourceFiles = new Set();

  const el = {
    activityAccordion: document.querySelector('#activity-accordion'),
    opportunityCount: document.querySelector('#opportunity-count'),
    opportunityList: document.querySelector('#opportunity-list'),
    pastOpportunitiesPanel: document.querySelector('#past-opportunities-panel'),
    pastOpportunitiesLabel: document.querySelector('#past-opportunities-label'),
    pastOpportunityList: document.querySelector('#past-opportunity-list'),
    pastOpportunityPagination: document.querySelector('#past-opportunity-pagination'),
    pastOpportunityPrev: document.querySelector('#past-opportunity-prev'),
    pastOpportunityNext: document.querySelector('#past-opportunity-next'),
    pastOpportunityPage: document.querySelector('#past-opportunity-page'),
    blogCount: document.querySelector('#blog-count'),
    blogLatestList: document.querySelector('#blog-latest-list'),
    blogArchivePanel: document.querySelector('#blog-archive-panel'),
    blogArchiveLabel: document.querySelector('#blog-archive-label'),
    blogArchiveList: document.querySelector('#blog-archive-list'),
    blogArchivePagination: document.querySelector('#blog-archive-pagination'),
    blogArchivePrev: document.querySelector('#blog-archive-prev'),
    blogArchiveNext: document.querySelector('#blog-archive-next'),
    blogArchivePage: document.querySelector('#blog-archive-page'),
    publicationCount: document.querySelector('#publication-count'),
    publicationList: document.querySelector('#publication-list'),
    publicationPagination: document.querySelector('#publication-pagination'),
    publicationPrev: document.querySelector('#publication-prev'),
    publicationNext: document.querySelector('#publication-next'),
    publicationPage: document.querySelector('#publication-page'),
    resourceSearch: document.querySelector('#resource-search'),
    resourceClear: document.querySelector('#resource-clear'),
    resourceTabs: document.querySelector('#resource-category-tabs'),
    resourceTagFilters: document.querySelector('#resource-tag-filters'),
    resourceSummary: document.querySelector('#resource-summary'),
    resourceList: document.querySelector('#resource-list'),
    resourcePagination: document.querySelector('#resource-pagination'),
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
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
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

  async function loadAllUpdateYears() {
    await Promise.all(years.map(loadUpdateYear));
  }

  async function loadResourceFiles() {
    const files = categoryDefs.flatMap(item => item.files || []);
    await Promise.all(files.map(async file => {
      if (loadedResourceFiles.has(file)) return;
      await loadScript(file);
      loadedResourceFiles.add(file);
    }));
  }

  const formatFullDate = value => new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(`${value}T12:00:00`));

  function allUpdates() {
    return years
      .flatMap(year => window.UPDATE_POSTS?.[year] || [])
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function isExpired(item) {
    return Boolean(item.expires && new Date(`${item.expires}T23:59:59`) < new Date());
  }

  function activityLabel(type, expired = false) {
    if (type === 'opportunity') return expired ? 'Closed opportunity' : 'Job opportunity';
    if (type === 'publication') return 'Publication alert';
    return 'Thought / blog post';
  }

  function renderActivityItem(item) {
    const expired = isExpired(item);
    let expiryText = '';
    if (item.type === 'opportunity') {
      if (item.expires) expiryText = `${expired ? 'Closed' : 'Closes'} ${formatFullDate(item.expires)}`;
      else expiryText = 'No closing date specified';
    }

    return `
      <article class="activity-item">
        <time class="activity-date" datetime="${escapeHtml(item.date)}">${escapeHtml(formatFullDate(item.date))}</time>
        <div>
          <div class="activity-meta">
            <span class="activity-badge ${expired ? 'is-closed' : ''}">${escapeHtml(activityLabel(item.type, expired))}</span>
            ${expiryText ? `<span class="activity-expiry">${escapeHtml(expiryText)}</span>` : ''}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary)}</p>
          ${item.url ? `<a class="resource-link activity-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.linkLabel || 'Open link')}</a>` : ''}
        </div>
      </article>`;
  }

  function renderPagedList(items, pageKey, listElement, paginationElement, prevButton, nextButton, indicator) {
    const totalPages = Math.max(1, Math.ceil(items.length / ACTIVITY_PAGE_SIZE));
    state[pageKey] = Math.min(Math.max(1, state[pageKey]), totalPages);
    const start = (state[pageKey] - 1) * ACTIVITY_PAGE_SIZE;
    const visible = items.slice(start, start + ACTIVITY_PAGE_SIZE);

    listElement.innerHTML = visible.length
      ? visible.map(renderActivityItem).join('')
      : '<div class="empty-state">No entries are available.</div>';

    paginationElement.hidden = totalPages <= 1;
    indicator.textContent = `Page ${state[pageKey]} of ${totalPages}`;
    prevButton.disabled = state[pageKey] <= 1;
    nextButton.disabled = state[pageKey] >= totalPages;
  }

  function renderActivities() {
    const posts = allUpdates();
    const opportunities = posts.filter(item => item.type === 'opportunity');
    const activeOpportunities = opportunities.filter(item => !isExpired(item));
    const pastOpportunities = opportunities.filter(isExpired);
    const blogs = posts.filter(item => item.type === 'blog');
    const latestBlogs = blogs.slice(0, BLOG_LATEST_COUNT);
    const archivedBlogs = blogs.slice(BLOG_LATEST_COUNT);
    const publications = posts.filter(item => item.type === 'publication');

    el.opportunityCount.textContent = activeOpportunities.length
      ? `${activeOpportunities.length} active`
      : 'No active posts';
    el.opportunityList.innerHTML = activeOpportunities.length
      ? activeOpportunities.map(renderActivityItem).join('')
      : '<div class="empty-state">No active job opportunity is posted at present.</div>';

    el.pastOpportunitiesPanel.hidden = pastOpportunities.length === 0;
    if (pastOpportunities.length) {
      el.pastOpportunitiesLabel.textContent = `Past opportunities (${pastOpportunities.length})`;
      renderPagedList(
        pastOpportunities,
        'pastOpportunityPage',
        el.pastOpportunityList,
        el.pastOpportunityPagination,
        el.pastOpportunityPrev,
        el.pastOpportunityNext,
        el.pastOpportunityPage
      );
    }

    el.blogCount.textContent = blogs.length
      ? `${Math.min(BLOG_LATEST_COUNT, blogs.length)} latest${archivedBlogs.length ? ` + ${archivedBlogs.length} archived` : ''}`
      : 'No posts';
    el.blogLatestList.innerHTML = latestBlogs.length
      ? latestBlogs.map(renderActivityItem).join('')
      : '<div class="empty-state">No thought or blog post has been added yet.</div>';

    el.blogArchivePanel.hidden = archivedBlogs.length === 0;
    if (archivedBlogs.length) {
      el.blogArchiveLabel.textContent = `Thought / blog archive (${archivedBlogs.length})`;
      renderPagedList(
        archivedBlogs,
        'blogArchivePage',
        el.blogArchiveList,
        el.blogArchivePagination,
        el.blogArchivePrev,
        el.blogArchiveNext,
        el.blogArchivePage
      );
    }

    el.publicationCount.textContent = publications.length
      ? `${publications.length} alert${publications.length === 1 ? '' : 's'}`
      : 'No alerts';
    renderPagedList(
      publications,
      'publicationPage',
      el.publicationList,
      el.publicationPagination,
      el.publicationPrev,
      el.publicationNext,
      el.publicationPage
    );
  }

  function allResources() {
    const library = window.RESOURCE_LIBRARY || {};
    const items = [];
    categoryDefs.forEach(category => {
      (library[category.id] || []).forEach((resource, index) => {
        items.push({
          ...resource,
          category: category.id,
          categoryLabel: category.label,
          number: index + 1
        });
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
      const count = resources.filter(item => item.category === category.id).length;
      const active = state.resourceCategory === category.id;
      return `
        <button
          class="section-tab ${active ? 'is-active' : ''}"
          type="button"
          data-resource-category="${escapeHtml(category.id)}"
          aria-pressed="${active}"
        >
          <span>${escapeHtml(category.label)}</span>
          <small>${count} resource${count === 1 ? '' : 's'}</small>
        </button>`;
    }).join('');

    el.resourceTabs.querySelectorAll('[data-resource-category]').forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.resourceCategory;
        state.resourceCategory = state.resourceCategory === selected ? '' : selected;
        state.resourcePage = 1;
        renderResources();
      });
    });
  }

  function prettyTag(tag) {
    if (tag === 'all') return 'Any type';
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  function renderTagFilters() {
    const label = '<span>Filter by type:</span>';
    const buttons = quickTags.map(tag => `
      <button
        class="tag-filter ${state.resourceTag === tag ? 'is-active' : ''}"
        type="button"
        data-resource-tag="${escapeHtml(tag)}"
      >${escapeHtml(prettyTag(tag))}</button>`).join('');
    el.resourceTagFilters.innerHTML = label + buttons;

    el.resourceTagFilters.querySelectorAll('[data-resource-tag]').forEach(button => {
      button.addEventListener('click', () => {
        state.resourceTag = button.dataset.resourceTag;
        state.resourcePage = 1;
        renderResources();
      });
    });
  }

  function hasResourceIntent() {
    return Boolean(
      state.resourceCategory ||
      state.resourceQuery.trim() ||
      state.resourceTag !== 'all'
    );
  }

  function filteredResources(resources) {
    const query = state.resourceQuery.trim().toLowerCase();
    return resources.filter(resource => {
      if (state.resourceCategory && resource.category !== state.resourceCategory) return false;
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

  function setPaginationVisibility(show, currentPage = 1, totalPages = 1) {
    if (el.resourcePagination) el.resourcePagination.hidden = !show;
    el.resourcePageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    el.resourcePrev.disabled = currentPage <= 1;
    el.resourceNext.disabled = currentPage >= totalPages;
  }

  function renderResources() {
    const resources = allResources();
    renderCategoryTabs(resources);
    renderTagFilters();

    if (!hasResourceIntent()) {
      el.resourceSummary.innerHTML = '<strong>No section is expanded.</strong> Select a section, choose a resource type, or enter a keyword to view matching entries.';
      el.resourceList.innerHTML = `
        <div class="empty-state resource-start-state">
          <strong>Start with a section or search.</strong><br>
          Nothing is displayed by default, so this page remains compact even when the directory contains hundreds of resources.
        </div>`;
      setPaginationVisibility(false);
      return;
    }

    const filtered = filteredResources(resources);
    const totalPages = Math.max(1, Math.ceil(filtered.length / RESOURCE_PAGE_SIZE));
    state.resourcePage = Math.min(Math.max(1, state.resourcePage), totalPages);
    const start = (state.resourcePage - 1) * RESOURCE_PAGE_SIZE;
    const visible = filtered.slice(start, start + RESOURCE_PAGE_SIZE);

    const activeCategory = categoryDefs.find(item => item.id === state.resourceCategory);
    const scope = activeCategory ? ` in ${activeCategory.label}` : ' across all sections';
    el.resourceSummary.innerHTML = `<strong>${filtered.length}</strong> matching resource${filtered.length === 1 ? '' : 's'}${escapeHtml(scope)}`;
    setPaginationVisibility(totalPages > 1, state.resourcePage, totalPages);

    if (!visible.length) {
      el.resourceList.innerHTML = '<div class="empty-state">No matching resources were found. Try another section, type, or keyword.</div>';
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
        state.resourceCategory = '';
        if (quickTags.includes(tag)) {
          state.resourceTag = tag;
          state.resourceQuery = '';
          el.resourceSearch.value = '';
        } else {
          state.resourceTag = 'all';
          state.resourceQuery = tag;
          el.resourceSearch.value = tag;
        }
        state.resourcePage = 1;
        renderResources();
        document.querySelector('#resource-directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function resetResourceView() {
    state.resourceQuery = '';
    state.resourceCategory = '';
    state.resourceTag = 'all';
    state.resourcePage = 1;
    el.resourceSearch.value = '';
    renderResources();
  }

  function bindPagedButtons(prevButton, nextButton, pageKey, render) {
    prevButton.addEventListener('click', () => {
      if (state[pageKey] <= 1) return;
      state[pageKey] -= 1;
      render();
    });
    nextButton.addEventListener('click', () => {
      state[pageKey] += 1;
      render();
    });
  }

  function bindEvents() {
    el.activityAccordion.querySelectorAll('.activity-panel').forEach(panel => {
      panel.addEventListener('toggle', () => {
        if (!panel.open) return;
        el.activityAccordion.querySelectorAll('.activity-panel').forEach(other => {
          if (other !== panel) other.open = false;
        });
      });
    });

    bindPagedButtons(el.pastOpportunityPrev, el.pastOpportunityNext, 'pastOpportunityPage', renderActivities);
    bindPagedButtons(el.blogArchivePrev, el.blogArchiveNext, 'blogArchivePage', renderActivities);
    bindPagedButtons(el.publicationPrev, el.publicationNext, 'publicationPage', renderActivities);

    let searchTimer;
    el.resourceSearch.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.resourceQuery = el.resourceSearch.value;
        state.resourcePage = 1;
        renderResources();
      }, 160);
    });

    el.resourceClear.addEventListener('click', resetResourceView);

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
    bindEvents();
    try {
      await loadAllUpdateYears();
      renderActivities();
    } catch (error) {
      const message = `<div class="empty-state">${escapeHtml(error.message)}. Confirm that each year listed in <code>updates-index.js</code> has a matching data file.</div>`;
      el.opportunityList.innerHTML = message;
      el.blogLatestList.innerHTML = message;
      el.publicationList.innerHTML = message;
    }
    await loadResourceFiles();
    renderResources();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
