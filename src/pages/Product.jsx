import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CATALOG, CATEGORY_LABELS, PRODUCTS_BY_ID } from "../data/products";
import { useCart } from "../context/CartContext";
import { formatARS } from "../utils";
import { ORDER_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "../config";

const SHOE_SIZES = [39, 40, 41, 42, 43, 44];
const BELT_SIZES = [
  "38 - 40 (90 cm)",
  "40 - 42 (95 cm)",
  "42 - 44 (100 cm)",
  "44 - 46 (105 cm)",
  "46 - 48 (110 cm)",
  "48 - 50 (115 cm)",
  "50 - 52 (120 cm)",
];
const JEWELRY_SIZES = ["45 cm", "50 cm", "55 cm"];

const SIZE_CONFIG = {
  belt: { sizes: BELT_SIZES, selected: BELT_SIZES[3], label: "Talle de pantalón", wide: true },
  jewelry: { sizes: JEWELRY_SIZES, selected: JEWELRY_SIZES[1], label: "Diámetro", wide: true },
  onesize: { sizes: ["Único"], selected: "Único", label: "Talle", wide: true },
  shoe: { sizes: SHOE_SIZES, selected: 41, label: "Elegí tu talle", wide: false },
};

function productKind(p) {
  const text = `${p.id || ""} ${p.name || ""}`.toLowerCase();
  if (/cintur[oó]n|\bcinto\b/.test(text) && !/combo/.test(text)) return "belt";
  if (/pendulo|p[eé]ndulo/.test(text)) return "onesize";
  if (/collar/.test(text)) return "jewelry";
  return "shoe";
}

export default function Product() {
  const { id } = useParams();
  const product = PRODUCTS_BY_ID[id] || CATALOG[0];
  const config = SIZE_CONFIG[productKind(product)];
  const [selected, setSelected] = useState(config.selected);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    setSelected(config.selected);
    document.title = `${product.name} — NORVAN`;
    window.scrollTo(0, 0);
  }, [product, config]);

  const category = CATEGORY_LABELS[product.category] || "Colección";
  const description =
    product.description || `${product.name}. Elegí tu talle y consultanos por WhatsApp.`;

  function onAdd() {
    addItem(product, selected);
    openCart();
  }

  return (
    <main className="product-page">
      <div className="container product-layout">
        <div className="gallery">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <Link className="back-link" to="/#coleccion">← Volver a la colección</Link>
          <p className="product-cat">{category}</p>
          <h1>{product.name}</h1>
          <p className="price">{formatARS(product.price)}</p>
          <p className="desc">{description}</p>

          <p className="size-label">{config.label}</p>
          <div className={`sizes${config.wide ? " sizes--belt" : ""}`} role="listbox" aria-label={config.label}>
            {config.sizes.map((s) => {
              const on = String(s) === String(selected);
              return (
                <button
                  key={s}
                  type="button"
                  className={`size-btn${on ? " is-selected" : ""}`}
                  role="option"
                  aria-selected={on}
                  onClick={() => setSelected(s)}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div className="product-actions">
            <button className="btn btn-block" type="button" onClick={onAdd}>
              Agregar a mi selección
            </button>
            <a className="btn btn-ghost btn-block" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          </div>

          <div className="product-meta">
            <p><strong>Cómo comprar:</strong> elegís modelo + talle y nos escribís</p>
            <p><strong>WhatsApp:</strong> <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><strong>Email:</strong> <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a></p>
            <p><strong>Ubicación:</strong> Córdoba Capital · Centro</p>
            <p><strong>Atención:</strong> Lunes a lunes · 24 hs</p>
          </div>
        </div>
      </div>
    </main>
  );
}
