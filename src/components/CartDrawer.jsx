
import { useState } from "react";
import { useCart } from "../context/CartContext";
import {
  sendOrderEmail,
  whatsappOrderUrl,
} from "../services/orderNotifications";
import { cartTotal, formatARS } from "../utils";
import { CloseIcon } from "./Icons";

const initialCustomer = {
  name: "",
  lastName: "",
  dni: "",
  phone: "",
  email: "",
  street: "",
  streetNumber: "",
  floor: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
};

const recipientFields = [
  {
    name: "name",
    label: "Nombre",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Apellido",
    autoComplete: "family-name",
  },
  {
    name: "dni",
    label: "DNI",
    inputMode: "numeric",
    maxLength: 8,
  },
  {
    name: "phone",
    label: "Teléfono",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    autoComplete: "email",
  },
];

const addressFields = [
  {
    name: "street",
    label: "Calle",
    autoComplete: "address-line1",
  },
  {
    name: "streetNumber",
    label: "Número",
  },
  {
    name: "floor",
    label: "Piso (opcional)",
    optional: true,
  },
  {
    name: "apartment",
    label: "Dpto. (opcional)",
    optional: true,
  },
  {
    name: "city",
    label: "Ciudad",
    autoComplete: "address-level2",
  },
  {
    name: "province",
    label: "Provincia",
    autoComplete: "address-level1",
  },
  {
    name: "postalCode",
    label: "Código Postal",
    autoComplete: "postal-code",
  },
];

const allFields = [...recipientFields, ...addressFields];

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    showToast,
  } = useCart();

  const [customer, setCustomer] = useState(initialCustomer);
  const [sending, setSending] = useState(false);

  const sum = cartTotal(items);

  const onField = (e) => {
    const { name, value } = e.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Verificamos todos los campos obligatorios.
  const requiredComplete = allFields
    .filter((field) => !field.optional)
    .every((field) => customer[field.name].trim() !== "");

  // DNI argentino de 7 u 8 dígitos.
  const dniValid = /^[0-9]{7,8}$/.test(
    customer.dni.trim()
  );

  // El correo electrónico es obligatorio.
  const emailValid =
    customer.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      customer.email.trim()
    );

  // El teléfono debe contener al menos 8 dígitos.
  const phoneValid =
    customer.phone.replace(/\D/g, "").length >= 8;

  // Solo permitimos continuar con todos los datos válidos.
  const isValid =
    items.length > 0 &&
    requiredComplete &&
    dniValid &&
    emailValid &&
    phoneValid;

  async function onCheckout(e) {
    e.preventDefault();

    if (!isValid || sending) {
      showToast(
        "Completá correctamente todos los datos obligatorios"
      );
      return;
    }

    const url = whatsappOrderUrl(items, customer);

    // Abrimos WhatsApp desde la acción del usuario.
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setSending(true);

    try {
      await sendOrderEmail(items, customer);
    } catch (error) {
      console.error(
        "Error al enviar el correo del pedido:",
        error
      );

      showToast(
        "No pudimos enviar el correo. Continuá por WhatsApp."
      );
    } finally {
      setSending(false);
    }
  }

  const renderField = (field) => (
    <div className="field" key={field.name}>
      <label htmlFor={`cart-${field.name}`}>
        {field.label}
        {!field.optional && " *"}
      </label>

      <input
        id={`cart-${field.name}`}
        name={field.name}
        type={field.type || "text"}
        inputMode={field.inputMode}
        autoComplete={field.autoComplete}
        maxLength={field.maxLength}
        value={customer[field.name]}
        onChange={onField}
        required={!field.optional}
        placeholder={field.label}
      />
    </div>
  );

  return (
    <>
      {/* Fondo oscuro al abrir el carrito */}
      <div
        className={`cart-overlay${
          isOpen ? " is-open" : ""
        }`}
        onClick={closeCart}
      />

      {/* Panel lateral del carrito */}
      <aside
        className={`cart-drawer${
          isOpen ? " is-open" : ""
        }`}
        aria-hidden={!isOpen}
        aria-label="Carrito"
      >
        {/* Encabezado */}
        <div className="cart-head">
          <h2>Tu selección</h2>

          <button
            className="icon-btn"
            aria-label="Cerrar carrito"
            type="button"
            onClick={closeCart}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Contenido desplazable */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
          }}
        >
          {/* Productos seleccionados */}
          <div className="cart-items">
            {!items.length ? (
              <p className="cart-empty">
                Tu carrito está vacío.
              </p>
            ) : (
              items.map((item) => (
                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      Talle {item.size} · Cant.{" "}
                      {item.qty}
                    </p>

                    <p className="cart-item-price">
                      {item.price != null
                        ? formatARS(item.price)
                        : "A consultar"}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          item.id,
                          item.size
                        )
                      }
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Formulario del destinatario */}
          {items.length > 0 && (
            <form
              id="norvan-checkout-form"
              onSubmit={onCheckout}
              style={{
                padding: "0 20px 20px",
              }}
            >
              <div className="cart-customer">
                <h3>
                  DATOS DEL DESTINATARIO
                </h3>

                {recipientFields.map(
                  renderField
                )}

                <h3
                  style={{
                    marginTop: "24px",
                  }}
                >
                  DOMICILIO DEL DESTINATARIO
                </h3>

                {addressFields.map(
                  renderField
                )}

                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "14px",
                  }}
                >
                  * Campos obligatorios.
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  Los datos proporcionados se
                  utilizarán para gestionar tu
                  consulta y, si confirmás la
                  compra, coordinar la entrega
                  con nuestro proveedor
                  logístico.
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  NORVAN cubre hasta $15.000
                  del envío por pedido completo.
                  Si el costo supera ese
                  importe, te informaremos la
                  diferencia antes del pago.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Pie fijo del carrito */}
        <div className="cart-foot">
          <div className="cart-total">
            <span>
              Total de productos
            </span>

            <span>
              {!items.length
                ? "—"
                : sum != null
                  ? formatARS(sum)
                  : "A consultar"}
            </span>
          </div>

          <button
            className="btn btn-block"
            type="submit"
            form="norvan-checkout-form"
            disabled={
              !isValid || sending
            }
          >
            {sending
              ? "Procesando consulta..."
              : "Consultar por WhatsApp"}
          </button>
        </div>
      </aside>
    </>
  );
}
