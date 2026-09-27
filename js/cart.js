(function () {
  const STORAGE_KEY = "norvan-cart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderCart();
  }

  function addItem(product, size) {
    const items = readCart();
    const sizeKey = String(size);
    const existing = items.find(
      (i) => i.id === product.id && String(i.size) === sizeKey
    );
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        qty: 1,
      });
    }
    writeCart(items);
    showToast("Agregado al carrito");
  }

  function removeItem(id, size) {
    const sizeKey = String(size);
    writeCart(
      readCart().filter((i) => !(i.id === id && String(i.size) === sizeKey))
    );
  }

  function total(items) {
    const values = items.filter((i) => i.price != null);
    if (!values.length) return null;
    return values.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-show"), 2200);
  }

  function openCart() {
    document.getElementById("cart-drawer")?.classList.add("is-open");
    document.getElementById("cart-overlay")?.classList.add("is-open");
    document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    document.getElementById("cart-drawer")?.classList.remove("is-open");
    document.getElementById("cart-overlay")?.classList.remove("is-open");
    document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "true");
  }

  function renderCart() {
    const items = readCart();
    const countEl = document.getElementById("cart-count");
    const listEl = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!listEl) return;

    const count = items.reduce((n, i) => n + i.qty, 0);
    if (countEl) countEl.textContent = String(count);

    if (!items.length) {
      listEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    } else {
      listEl.innerHTML = items
        .map(
          (i) => `
        <article class="cart-item">
          <img src="${i.image}" alt="" />
          <div>
            <h3>${i.name}</h3>
            <p>Talle ${i.size} · Cant. ${i.qty}</p>
            <p class="cart-item-price">${
              i.price != null
                ? window.formatARS(i.price)
                : "A consultar"
            }</p>
            <button type="button" data-remove="${i.id}" data-size="${i.size}">Quitar</button>
          </div>
        </article>`
        )
        .join("");
    }

    if (totalEl) {
      const sum = total(items);
      totalEl.textContent = !items.length
        ? "—"
        : sum != null
          ? window.formatARS(sum)
          : "A consultar";
    }
  }

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      removeItem(removeBtn.dataset.remove, removeBtn.dataset.size);
    }
  });

  document.getElementById("cart-open")?.addEventListener("click", openCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);
  document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
  document.getElementById("checkout-btn")?.addEventListener("click", (e) => {
    const items = readCart();
    if (!items.length) {
      e.preventDefault();
      showToast("Tu selección está vacía");
      return;
    }
    const sum = total(items);
    const lines = items.map((i) => {
      const price = i.price != null ? ` · ${window.formatARS(i.price)}` : "";
      return `• ${i.name} (talle ${i.size}) x${i.qty}${price}`;
    });
    if (sum != null) lines.push("", `Total: ${window.formatARS(sum)}`);
    const msg = encodeURIComponent(
      `Hola NORVAN, quiero consultar esta selección:\n${lines.join("\n")}`
    );
    e.currentTarget.setAttribute(
      "href",
      `https://wa.me/543472520204?text=${msg}`
    );
    showToast("Abrimos WhatsApp · contales tu selección");
  });

  window.NorvanCart = { addItem, openCart, closeCart, renderCart, showToast };
  renderCart();
})();
