import { useEffect } from "react";
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

export default function Home() {
  const { hash } = useLocation();
  const { showToast } = useCart();

  useEffect(() => {
    document.title = "NORVAN — Calzado para el camino";
  }, []);

  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  function onContactSubmit(e) {
    e.preventDefault();
    showToast("Mensaje enviado");
    e.target.reset();
  }

  return (
    <main>
      <a className="skip-link" href="#coleccion">
        Ir a la colección
      </a>

      <section className="hero" id="inicio">
        <div className="hero-media">
          <img src="/assets/hero.jpg" alt="Borcegos NORVAN" width="1466" height="2200" fetchpriority="high" decoding="async" />
        </div>
        <div className="hero-content">
          <p className="hero-brand">NORVAN</p>
          <h1 className="hero-title">Calzado para el camino.</h1>
          <p className="hero-copy">Mirás el modelo, elegís el talle y nos consultás. Simple.</p>
          <div className="hero-actions">
            <a className="btn" href="#coleccion">Ver modelos</a>
            <a className="btn btn-outline" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="btn btn-outline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Beneficios">
        <div className="container trust-grid">
          <article className="trust-item">
            <strong>Durabilidad</strong>
            <span>Hechos para el uso real</span>
          </article>
          <article className="trust-item">
            <strong>Envíos</strong>
            <span>A todo el país</span>
          </article>
          <article className="trust-item">
            <strong>Consulta fácil</strong>
            <span>Te respondemos por WhatsApp</span>
          </article>
        </div>
      </section>

      <section className="section section-catalog" id="coleccion">
        <div className="container">
          <header className="section-head">
            <p className="section-kicker">Colección</p>
            <h2 className="section-title">Elegí tu modelo</h2>
            <p className="section-copy">Filtrá por tipo o buscá por nombre. Sin vueltas.</p>
          </header>
          <Catalog />
        </div>
      </section>

      <section className="split" id="nosotros">
        <div className="split-media">
          <img src="/assets/hero2.jpg" alt="Comunidad NORVAN con borcegos" />
        </div>
        <div className="split-body">
          <p className="section-kicker">Nosotros</p>
          <h2 className="section-title">Calzado para el camino</h2>
          <p>NORVAN es calzado de hombre pensado para acompañarte años: borcegos, zapatos y zapatillas con buena pinta y mejor construcción.</p>
          <ul className="split-points">
            <li>Materiales firmes</li>
            <li>Talles claros</li>
            <li>Atención directa</li>
          </ul>
          <a className="btn btn-light" href="#coleccion">Volver a la colección</a>
        </div>
      </section>

      <section className="section section-contact" id="contacto">
        <div className="container contact-wrap">
          <div>
            <header className="section-head section-head-left">
              <p className="section-kicker">Contacto</p>
              <h2 className="section-title">¿Dudas de talle?</h2>
              <p className="section-copy">Escribinos y te ayudamos a elegir. También podés mandarnos el modelo que te gustó.</p>
            </header>
            <div className="contact-actions">
              <a className="btn" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="btn btn-ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
            <div className="contact-meta">
              <div>
                <strong>Email</strong>
                <a href={`mailto:${ORDER_EMAIL}`}>{ORDER_EMAIL}</a>
              </div>
              <div>
                <strong>WhatsApp</strong>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a>
              </div>
              <div>
                <strong>Instagram</strong>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a>
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
          <form className="contact-form" onSubmit={onContactSubmit}>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" required autoComplete="name" placeholder="Tu nombre" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" />
            </div>
            <div className="field">
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" name="message" required placeholder="Modelo, talle y consulta…" />
            </div>
            <button className="btn btn-block" type="submit">Enviar consulta</button>
          </form>
        </div>
      </section>
    </main>
  );
}
