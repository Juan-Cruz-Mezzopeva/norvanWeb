import { useState } from "react";
import { useCart } from "../context/CartContext";
import { sendOrderEmail, whatsappOrderUrl } from "../services/orderNotifications";
import { cartTotal, formatARS } from "../utils";
import { CloseIcon } from "./Icons";
import { WHATSAPP_URL } from "../config";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, showToast } = useCart();
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const sum = cartTotal(items);

  const onField = (e) => setCustomer((c) => ({ ...c, [e.target.name]: e.target.value }));

  function onCheckout(e) {
    if (!items.length) {
      e.preventDefault();
      showToast("Tu selección está vacía");
      return;
    }
    // WhatsApp se abre por el propio link (href); el mail se envía en paralelo.
    showToast("Abrimos WhatsApp · también te enviamos el pedido por mail");
    sendOrderEmail(items, customer).catch((err) => {
      console.error("No se pudo enviar el mail del pedido", err);
      showToast("No pudimos enviar el mail · tu pedido sigue por WhatsApp");
    });
  }

  return (
    <>
      <div className={`cart-overlay${isOpen ? " is-open" : ""}`} onClick={closeCart} />
      <aside className={`cart-drawer${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen} aria-label="Carrito">
        <div className="cart-head">
          <h2>Tu selección</h2>
          <button className="icon-btn" aria-label="Cerrar carrito" type="button" onClick={closeCart}>
            <CloseIcon />
          </button>
        </div>

        <div className="cart-items">
          {!items.length ? (
            <p className="cart-empty">Tu carrito está vacío.</p>
          ) : (
            items.map((i) => (
              <article className="cart-item" key={`${i.id}-${i.size}`}>
                <img src={i.image} alt="" />
                <div>
                  <h3>{i.name}</h3>
                  <p>
                    Talle {i.size} · Cant. {i.qty}
                  </p>
                  <p className="cart-item-price">
                    {i.price != null ? formatARS(i.price) : "A consultar"}
                  </p>
                  <button type="button" onClick={() => removeItem(i.id, i.size)}>
                    Quitar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="cart-total">
            <span>Estado</span>
            <span>{!items.length ? "—" : sum != null ? formatARS(sum) : "A consultar"}</span>
          </div>
          {items.length > 0 && (
            <div className="cart-customer">
              <div className="field">
                <label htmlFor="cart-name">Nombre</label>
                <input id="cart-name" name="name" type="text" autoComplete="name" placeholder="Tu nombre" value={customer.name} onChange={onField} />
              </div>
              <div className="field">
                <label htmlFor="cart-email">Email (opcional)</label>
                <input id="cart-email" name="email" type="email" autoComplete="email" placeholder="tu@email.com" value={customer.email} onChange={onField} />
              </div>
            </div>
          )}
          <a
            className="btn btn-block"
            href={items.length ? whatsappOrderUrl(items, customer) : WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCheckout}
          >
            Consultar por WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
