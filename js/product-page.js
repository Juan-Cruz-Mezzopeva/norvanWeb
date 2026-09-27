(function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const catalog = window.NORVAN_CATALOG || [];
  const map = window.NORVAN_PRODUCTS || {};
  const product =
    map[id] ||
    catalog.find((p) => p.id === id) ||
    catalog[0] ||
    Object.values(map)[0];

  if (!product) return;

  const LABELS = {
    borcegos: "Borcegos",
    zapatos: "Zapatos",
    zapatillas: "Zapatillas",
    accesorios: "Accesorios",
  };

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

  function productKind(p) {
    const text = `${p.id || ""} ${p.name || ""}`.toLowerCase();
    if (/cintur[oó]n|\bcinto\b/.test(text) && !/combo/.test(text)) return "belt";
    if (/pendulo|p[eé]ndulo/.test(text)) return "onesize";
    if (/collar/.test(text)) return "jewelry";
    return "shoe";
  }

  const kind = productKind(product);
  const sizeConfig = {
    belt: {
      sizes: BELT_SIZES,
      selected: BELT_SIZES[3],
      label: "Talle de pantalón",
      wide: true,
      parse: (v) => v,
    },
    jewelry: {
      sizes: JEWELRY_SIZES,
      selected: JEWELRY_SIZES[1],
      label: "Diámetro",
      wide: true,
      parse: (v) => v,
    },
    onesize: {
      sizes: ["Único"],
      selected: "Único",
      label: "Talle",
      wide: true,
      parse: (v) => v,
    },
    shoe: {
      sizes: SHOE_SIZES,
      selected: 41,
      label: "Elegí tu talle",
      wide: false,
      parse: (v) => Number(v),
    },
  }[kind];

  const sizes = sizeConfig.sizes;
  let selected = sizeConfig.selected;
  const sizeLabel = sizeConfig.label;
  const category = LABELS[product.category] || "Colección";
  const description =
    product.description ||
    `${product.name}. Elegí tu talle y consultanos por WhatsApp.`;

  document.title = `${product.name} — NORVAN`;

  const root = document.getElementById("product-root");
  if (!root) return;

  root.innerHTML = `
    <div class="gallery">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="product-info">
      <a class="back-link" href="index.html#coleccion">← Volver a la colección</a>
      <p class="product-cat">${category}</p>
      <h1>${product.name}</h1>
      <p class="price">${window.formatARS(product.price)}</p>
      <p class="desc">${description}</p>

      <p class="size-label">${sizeLabel}</p>
      <div class="sizes${sizeConfig.wide ? " sizes--belt" : ""}" role="listbox" aria-label="${sizeLabel}">
        ${sizes
          .map(
            (s) =>
              `<button type="button" class="size-btn${
                String(s) === String(selected) ? " is-selected" : ""
              }" data-size="${s}" role="option" aria-selected="${
                String(s) === String(selected)
              }">${s}</button>`
          )
          .join("")}
      </div>

      <div class="product-actions">
        <button class="btn btn-block" type="button" id="add-to-cart">Agregar a mi selección</button>
        <a class="btn btn-ghost btn-block" href="https://wa.me/543472520204" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
      </div>

      <div class="product-meta">
        <p><strong>Cómo comprar:</strong> elegís modelo + talle y nos escribís</p>
        <p><strong>WhatsApp:</strong> <a href="https://wa.me/543472520204" target="_blank" rel="noopener noreferrer">+54 3472 520204</a></p>
        <p><strong>Email:</strong> <a href="mailto:norvan.arg@gmail.com">norvan.arg@gmail.com</a></p>
        <p><strong>Ubicación:</strong> Córdoba Capital · Centro</p>
        <p><strong>Atención:</strong> Lunes a lunes · 24 hs</p>
      </div>
    </div>
  `;

  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".size-btn");
    if (!btn) return;
    selected = sizeConfig.parse(btn.dataset.size);
    root.querySelectorAll(".size-btn").forEach((el) => {
      const on = String(el.dataset.size) === String(selected);
      el.classList.toggle("is-selected", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });
  });

  document.getElementById("add-to-cart")?.addEventListener("click", () => {
    window.NorvanCart.addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price ?? null,
        image: product.image,
      },
      selected
    );
    window.NorvanCart.openCart();
  });
})();
