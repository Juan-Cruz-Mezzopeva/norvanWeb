import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATALOG, CATEGORY_LABELS } from "../data/products";
import { formatARS } from "../utils";

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "borcegos", label: "Borcegos" },
  { id: "zapatos", label: "Zapatos" },
  { id: "zapatillas", label: "Zapatillas" },
  { id: "accesorios", label: "Accesorios" },
];

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const active = params.get("cat") || "all";
  const query = (params.get("q") || "").trim().toLowerCase();
  const [search, setSearch] = useState(params.get("q") || "");

  function update(next) {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true, preventScrollReset: true });
  }

  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.trim().toLowerCase();
      if (q !== query) update({ q });
    }, 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filters = useMemo(() => {
    const present = new Set(CATALOG.map((p) => p.category));
    return FILTERS.filter((f) => f.id === "all" || present.has(f.id)).map((f) => ({
      ...f,
      count: f.id === "all" ? CATALOG.length : CATALOG.filter((p) => p.category === f.id).length,
    }));
  }, []);

  const items = CATALOG.filter((p) => {
    const byCat = active === "all" || p.category === active;
    const byQuery =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (CATEGORY_LABELS[p.category] || "").toLowerCase().includes(query);
    return byCat && byQuery;
  });

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="tablist" aria-label="Filtrar por tipo">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-btn${f.id === active ? " is-active" : ""}`}
              aria-pressed={f.id === active}
              onClick={() => update({ cat: f.id === "all" ? "" : f.id })}
            >
              {f.label}
              <span className="filter-count">{f.count}</span>
            </button>
          ))}
        </div>
        <label className="catalog-search">
          <span className="sr-only">Buscar modelo</span>
          <input
            type="search"
            placeholder="Buscar modelo…"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <p className="catalog-count" aria-live="polite">
        {items.length === 1 ? "1 modelo" : `${items.length} modelos`}
      </p>

      <div className="product-grid product-grid-compact">
        {!items.length ? (
          <p className="catalog-empty">
            No encontramos ese modelo. Probá otro filtro o borrá la búsqueda.
          </p>
        ) : (
          items.map((p) => (
            <article className="product is-visible" data-category={p.category} key={p.id}>
              <Link className="product-card-link" to={`/producto/${encodeURIComponent(p.id)}`}>
                <div className="product-media">
                  <img src={p.image} alt={p.name} loading="lazy" />
                </div>
                <p className="product-cat">{CATEGORY_LABELS[p.category] || p.category}</p>
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">{formatARS(p.price)}</p>
                <span className="product-cta">Ver detalle</span>
              </Link>
            </article>
          ))
        )}
      </div>
    </>
  );
}
