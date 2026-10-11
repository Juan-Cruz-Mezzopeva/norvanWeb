import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Brand } from "./Icons";

const NAV = [
  { hash: "inicio", label: "Inicio" },
  { hash: "coleccion", label: "Colección" },
  { hash: "nosotros", label: "Nosotros" },
  { hash: "contacto", label: "Contacto" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="NORVAN inicio">
          <Brand />
        </Link>

        <nav className={`nav${menuOpen ? " is-open" : ""}`} id="nav" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.hash} to={`/#${n.hash}`} onClick={() => setMenuOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Abrir carrito" type="button" onClick={openCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
            <span className="cart-count">{count}</span>
          </button>
          <button
            className="icon-btn menu-toggle"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
