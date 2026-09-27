(function () {
  const grid = document.getElementById("product-grid");
  const filtersEl = document.getElementById("catalog-filters");
  const countEl = document.getElementById("catalog-count");
  const searchEl = document.getElementById("catalog-search");
  if (!grid || !window.NORVAN_CATALOG) return;

  const LABELS = {
    borcegos: "Borcegos",
    zapatos: "Zapatos",
    zapatillas: "Zapatillas",
    accesorios: "Accesorios",
  };

  const FILTERS = [
    { id: "all", label: "Todos" },
    { id: "borcegos", label: "Borcegos" },
    { id: "zapatos", label: "Zapatos" },
    { id: "zapatillas", label: "Zapatillas" },
    { id: "accesorios", label: "Accesorios" },
  ];

  const params = new URLSearchParams(window.location.search);
  let active = params.get("cat") || "all";
  let query = (params.get("q") || "").trim().toLowerCase();

  if (searchEl && query) searchEl.value = query;

  function availableFilters() {
    const present = new Set(window.NORVAN_CATALOG.map((p) => p.category));
    return FILTERS.filter((f) => f.id === "all" || present.has(f.id));
  }

  function countFor(id) {
    if (id === "all") return window.NORVAN_CATALOG.length;
    return window.NORVAN_CATALOG.filter((p) => p.category === id).length;
  }

  function filtered() {
    return window.NORVAN_CATALOG.filter((p) => {
      const byCat = active === "all" || p.category === active;
      const byQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (LABELS[p.category] || "").toLowerCase().includes(query);
      return byCat && byQuery;
    });
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    if (active === "all") url.searchParams.delete("cat");
    else url.searchParams.set("cat", active);
    if (!query) url.searchParams.delete("q");
    else url.searchParams.set("q", query);
    history.replaceState(null, "", url);
  }

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = availableFilters()
      .map((f) => {
        const n = countFor(f.id);
        return `<button type="button" class="filter-btn${
          f.id === active ? " is-active" : ""
        }" data-filter="${f.id}" aria-pressed="${f.id === active}">
          ${f.label}<span class="filter-count">${n}</span>
        </button>`;
      })
      .join("");
  }

  function renderGrid() {
    const items = filtered();
    if (countEl) {
      countEl.textContent =
        items.length === 1
          ? "1 modelo"
          : `${items.length} modelos`;
    }

    if (!items.length) {
      grid.innerHTML =
        '<p class="catalog-empty">No encontramos ese modelo. Probá otro filtro o borrá la búsqueda.</p>';
      return;
    }

    grid.innerHTML = items
      .map((p) => {
        const cat = LABELS[p.category] || p.category;
        return `
      <article class="product is-visible" data-category="${p.category}">
        <a class="product-card-link" href="producto.html?id=${encodeURIComponent(p.id)}">
          <div class="product-media">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </div>
          <p class="product-cat">${cat}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${window.formatARS(p.price)}</p>
          <span class="product-cta">Ver detalle</span>
        </a>
      </article>`;
      })
      .join("");
  }

  function refresh() {
    syncUrl();
    renderFilters();
    renderGrid();
  }

  filtersEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    active = btn.dataset.filter;
    refresh();
  });

  let searchTimer;
  searchEl?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      query = searchEl.value.trim().toLowerCase();
      refresh();
    }, 160);
  });

  refresh();
})();
