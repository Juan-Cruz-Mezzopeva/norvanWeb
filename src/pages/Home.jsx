
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Catalog from "../components/Catalog";
import { useCart } from "../context/CartContext";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  ORDER_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "../config";

const initialContact = {
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
  message: "",
};

const recipientFields = [
  { name: "name", label: "Nombre", autoComplete: "given-name" },
  { name: "lastName", label: "Apellido", autoComplete: "family-name" },
  { name: "dni", label: "DNI", inputMode: "numeric", maxLength: 8 },
  { name: "phone", label: "Teléfono", type: "tel", autoComplete: "tel" },
  {
    name: "email",
    label: "Correo electrónico",
    type: "email",
    autoComplete: "email",
  },
];

const addressFields = [
  { name: "street", label: "Calle", autoComplete: "address-line1" },
  { name: "streetNumber", label: "Número" },
  { name: "floor", label: "Piso", optional: true },
  { name: "apartment", label: "Departamento", optional: true },
  { name: "city", label: "Ciudad", autoComplete: "address-level2" },
  { name: "province", label: "Provincia", autoComplete: "address-level1" },
  { name: "postalCode", label: "Código postal", autoComplete: "postal-code" },
];

const allFields = [...recipientFields, ...addressFields];

export default function Home() {
  const { hash } = useLocation();
  const { showToast } = useCart();

  const [contact, setContact] = useState(initialContact);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactStatus, setContactStatus] = useState("");

  useEffect(() => {
    document.title = "NORVAN — Calzado para el camino";
  }, []);

  useEffect(() => {
    if (!hash) return;
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  function onContactChange(e) {
    const { name, value } = e.target;

    setContact((current) => ({
      ...current,
      [name]: value,
    }));

    setSent(false);
    setContactStatus("");
  }

  const requiredComplete = allFields
    .filter((field) => !field.optional)
    .every((field) => contact[field.name].trim() !== "");

  const dniValid = /^[0-9]{7,8}$/.test(contact.dni.trim());

  const phoneValid =
    contact.phone.replace(/\D/g, "").length >= 8;

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());

  const contactValid =
    requiredComplete && dniValid && phoneValid && emailValid;

  async function onContactSubmit(e) {
    e.preventDefault();

    if (!contactValid || sending || sent) {
      if (!sent) {
        setContactStatus(
          "Revisá los campos obligatorios antes de enviar."
        );
      }
      return;
    }

    setSending(true);
    setContactStatus("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${ORDER_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            _subject: `Nueva consulta NORVAN — ${contact.name} ${contact.lastName}`,
            _template: "table",
            _captcha: "false",
            _replyto: contact.email,

            Tipo: "Consulta desde la web",

            Nombre: contact.name.trim(),
            Apellido: contact.lastName.trim(),
            DNI: contact.dni.trim(),
            Telefono: contact.phone.trim(),
            Email: contact.email.trim(),

            Calle: contact.street.trim(),
            Numero: contact.streetNumber.trim(),
            Piso: contact.floor.trim() || "No informado",
            Departamento:
              contact.apartment.trim() || "No informado",
            Ciudad: contact.city.trim(),
            Provincia: contact.province.trim(),
            Codigo_postal: contact.postalCode.trim(),

            Mensaje:
              contact.message.trim() || "Sin mensaje adicional",

            Fecha: new Date().toLocaleString("es-AR"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al enviar la consulta: ${response.status}`
        );
      }

      const result = await response.json();

      if (
        result.success === false ||
        result.success === "false"
      ) {
        throw new Error("El servicio rechazó la consulta.");
      }

      // Confirmación visible del envío exitoso.
      setSent(true);
      setContactStatus(
        "¡Consulta enviada correctamente! Pronto nos pondremos en contacto con vos."
      );
      showToast("Consulta enviada correctamente");

      // Conservamos los datos visibles para que el cliente
      // pueda comprobar qué información envió.
    } catch (error) {
      console.error("No se pudo enviar la consulta:", error);

      setSent(false);
      setContactStatus(
        "No pudimos enviar tu consulta. Intentá nuevamente o contactanos por WhatsApp."
      );
      showToast("No se pudo enviar la consulta");
    } finally {
      setSending(false);
    }
  }

  function renderContactField(field) {
    return (
      <div className="field" key={field.name}>
        <label htmlFor={`contact-${field.name}`}>
          {field.label}
          {!field.optional && " *"}
        </label>

        <input
          id={`contact-${field.name}`}
          name={field.name}
          type={field.type || "text"}
          inputMode={field.inputMode}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          value={contact[field.name]}
          onChange={onContactChange}
          required={!field.optional}
          placeholder={
            field.optional
              ? "Opcional"
              : `Ingresá ${field.label.toLowerCase()}`
          }
          style={{ width: "100%" }}
        />
      </div>
    );
  }

  return (
    <main>
      <a className="skip-link" href="#coleccion">
        Ir a la colección
      </a>

      {/* INICIO */}
      <section className="hero" id="inicio">
        <div className="hero-media">
          <img
            src="/assets/hero.jpg"
            alt="Borcegos NORVAN"
            width="1466"
            height="2200"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <div className="hero-content">
          <p className="hero-brand">NORVAN</p>
          <h1 className="hero-title">Calzado para el camino.</h1>
          <p className="hero-copy">
            Mirás el modelo, elegís el talle y nos consultás. Simple.
          </p>

          <div className="hero-actions">
            <a className="btn" href="#coleccion">
              Ver modelos
            </a>
            <a
              className="btn btn-outline"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              className="btn btn-outline"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="trust" aria-label="Beneficios">
        <div className="container trust-grid">
          <article className="trust-item">
            <strong>Durabilidad</strong>
            <span>Hechos para el uso real</span>
          </article>
          <article className="trust-item">
            <strong>Envíos</strong>
            <span>Cubrimos hasta $15.000 por pedido</span>
          </article>
          <article className="trust-item">
            <strong>Consulta fácil</strong>
            <span>Te respondemos por WhatsApp</span>
          </article>
        </div>
      </section>

      {/* ENVÍOS */}
      <section
        className="section shipping-section"
        id="envios"
        aria-label="Información de envíos"
      >
        <div className="container">
          <header className="section-head">
            <p className="section-kicker">
              Envíos a toda Argentina
            </p>
            <h2 className="section-title">
              Cubrimos hasta $15.000 de tu envío
            </h2>
            <p className="section-copy">
              NORVAN cubre el costo de envío de tu pedido
              hasta $15.000. Si el envío supera ese importe,
              solo abonás la diferencia. El beneficio se
              aplica al pedido completo, sin importar
              cuántos productos incluyas. Consultanos con
              tu código postal para confirmar el costo
              antes de pagar.
            </p>
          </header>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section
        className="section section-catalog"
        id="coleccion"
      >
        <div className="container">
          <header className="section-head">
            <p className="section-kicker">Colección</p>
            <h2 className="section-title">Elegí tu modelo</h2>
            <p className="section-copy">
              Filtrá por tipo o buscá por nombre. Sin vueltas.
            </p>
          </header>
          <Catalog />
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="split" id="nosotros">
        <div className="split-media">
          <img
            src="/assets/hero2.jpg"
            alt="Comunidad NORVAN con borcegos"
          />
        </div>

        <div className="split-body">
          <p className="section-kicker">Nosotros</p>
          <h2 className="section-title">
            Calzado para el camino
          </h2>
          <p>
            NORVAN es calzado de hombre pensado para
            acompañarte años: borcegos, zapatos y
            zapatillas con buena pinta y mejor construcción.
          </p>

          <ul className="split-points">
            <li>Materiales firmes</li>
            <li>Talles claros</li>
            <li>Atención directa</li>
          </ul>

          <a className="btn btn-light" href="#coleccion">
            Volver a la colección
          </a>
        </div>
      </section>

      {/* CONTACTO */}
      <section
        className="section section-contact"
        id="contacto"
      >
        <div className="container">
          <header
            className="section-head"
            style={{
              textAlign: "center",
              maxWidth: "780px",
              margin: "0 auto 42px",
            }}
          >
            <p className="section-kicker">
              Contacto NORVAN
            </p>
            <h2 className="section-title">
              Estamos para ayudarte.
            </h2>
            <p className="section-copy">
              Completá tus datos y contanos qué necesitás.
              Así podemos asesorarte y tener preparada
              la información necesaria para coordinar
              una posible entrega.
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* INFORMACIÓN DE CONTACTO */}
            <div>
              <div
                style={{
                  background: "#23382e",
                  color: "#ffffff",
                  padding: "32px",
                  borderRadius: "14px",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    opacity: 0.75,
                    marginBottom: "12px",
                  }}
                >
                  Atención personalizada
                </p>

                <h3
                  style={{
                    fontSize: "26px",
                    lineHeight: 1.3,
                    marginBottom: "14px",
                  }}
                >
                  Tu próximo par empieza acá.
                </h3>

                <p
                  style={{
                    lineHeight: 1.8,
                    opacity: 0.9,
                  }}
                >
                  Consultanos por modelos, talles,
                  disponibilidad o envíos.
                  Nuestro equipo te ayudará a encontrar
                  lo que buscás.
                </p>

                <div
                  className="contact-actions"
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <a
                    className="btn"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>

                  <a
                    className="btn btn-ghost"
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#ffffff",
                      borderColor: "rgba(255,255,255,.4)",
                    }}
                  >
                    Instagram
                  </a>
                </div>
              </div>

              <div className="contact-meta">
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${ORDER_EMAIL}`}>
                    {ORDER_EMAIL}
                  </a>
                </div>

                <div>
                  <strong>WhatsApp</strong>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>

                <div>
                  <strong>Instagram</strong>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {INSTAGRAM_HANDLE}
                  </a>
                </div>

                <div>
                  <strong>Ubicación</strong>
                  Córdoba Capital · Centro
                </div>

                <div>
                  <strong>Atención</strong>
                  Lunes a lunes · 24 hs
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <form
              className="contact-form"
              onSubmit={onContactSubmit}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "clamp(20px, 4vw, 36px)",
                boxShadow:
                  "0 14px 45px rgba(24, 35, 28, 0.09)",
                border: "1px solid rgba(35, 56, 46, 0.12)",
              }}
            >
              <div
                style={{
                  marginBottom: "28px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #e6e7e1",
                }}
              >
                <p
                  className="section-kicker"
                  style={{ marginBottom: "8px" }}
                >
                  Formulario de consulta
                </p>

                <h3
                  style={{
                    fontSize: "24px",
                    color: "#23382e",
                    marginBottom: "8px",
                  }}
                >
                  Tus datos
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#666",
                  }}
                >
                  Los campos marcados con * son obligatorios.
                </p>
              </div>

              {/* DATOS PERSONALES */}
              <div style={{ marginBottom: "30px" }}>
                <h4
                  style={{
                    fontSize: "14px",
                    letterSpacing: "1px",
                    color: "#23382e",
                    marginBottom: "18px",
                    textTransform: "uppercase",
                  }}
                >
                  01 / Datos del destinatario
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                    gap: "16px",
                  }}
                >
                  {recipientFields.map(renderContactField)}
                </div>
              </div>

              {/* DOMICILIO */}
              <div
                style={{
                  marginBottom: "30px",
                  paddingTop: "24px",
                  borderTop: "1px solid #e6e7e1",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    letterSpacing: "1px",
                    color: "#23382e",
                    marginBottom: "18px",
                    textTransform: "uppercase",
                  }}
                >
                  02 / Domicilio del destinatario
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                    gap: "16px",
                  }}
                >
                  {addressFields.map(renderContactField)}
                </div>
              </div>

              {/* CONSULTA ADICIONAL */}
              <div
                style={{
                  paddingTop: "24px",
                  borderTop: "1px solid #e6e7e1",
                  marginBottom: "24px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    letterSpacing: "1px",
                    color: "#23382e",
                    marginBottom: "18px",
                    textTransform: "uppercase",
                  }}
                >
                  03 / Tu consulta
                </h4>

                <div className="field">
                  <label htmlFor="contact-message">
                    Mensaje adicional (opcional)
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={contact.message}
                    onChange={onContactChange}
                    rows={5}
                    placeholder="Contanos qué modelo, talle o producto te interesa..."
                    style={{
                      width: "100%",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  fontSize: "12px",
                  color: "#666",
                  lineHeight: 1.7,
                  marginBottom: "18px",
                }}
              >
                Utilizaremos tus datos para responder
                la consulta y, si confirmás una compra,
                coordinar la entrega. NORVAN cubre
                hasta $15.000 del envío por pedido.
              </p>

              {/* BOTÓN CON ESTADO ENVIADO */}
              <button
                className="btn btn-block"
                type="submit"
                disabled={!contactValid || sending || sent}
                style={{
                  backgroundColor: sent ? "#2f6546" : undefined,
                  color: sent ? "#ffffff" : undefined,
                  opacity: sent ? 1 : undefined,
                  cursor: sent ? "default" : undefined,
                }}
              >
                {sending
                  ? "Enviando consulta..."
                  : sent
                    ? "✓ Enviado"
                    : "Enviar consulta"}
              </button>

              {contactStatus && (
                <p
                  role="status"
                  aria-live="polite"
                  style={{
                    marginTop: "16px",
                    textAlign: "center",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: sent ? "#2f6546" : "#8a3c32",
                    fontWeight: sent ? 600 : 400,
                  }}
                >
                  {contactStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
