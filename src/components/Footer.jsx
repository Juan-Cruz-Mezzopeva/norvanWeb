import { Link } from "react-router-dom";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, ORDER_EMAIL, WHATSAPP_URL } from "../config";
import { Brand, InstagramIcon, MailIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-simple">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <Brand />
          </Link>
          <p>Calzado de hombre. Mirás, elegís y consultás.</p>
        </div>
        <div className="footer-col">
          <h3>Ir a</h3>
          <Link to="/#coleccion">Colección</Link>
          <Link to="/#envios">Envíos</Link>
          <Link to="/#nosotros">Nosotros</Link>
          <Link to="/#contacto">Contacto</Link>
        </div>
        <div className="footer-col">
          <h3>Contacto</h3>
          <div className="socials">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${INSTAGRAM_HANDLE}`}>
              <InstagramIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a href={`mailto:${ORDER_EMAIL}`} aria-label={`Email ${ORDER_EMAIL}`}>
              <MailIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 NORVAN</span>
        <span>Calzado para el camino.</span>
      </div>
    </footer>
  );
}
