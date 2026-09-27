# NORVAN — Entrega del sitio web

Sitio de calzado masculino NORVAN en React (Vite). No necesita backend ni base de datos.

## Cómo abrirlo

```bash
npm install
npm run dev
```

y entrá a `http://localhost:5173`. Para publicar: `npm run build` y subir `dist/`.
Ver `README.md` para hosting y configuración del mail de pedidos.

## Estructura

```
index.html                          → Entrada de Vite
src/
  main.jsx / App.jsx                → Router (/, /producto/:id)
  pages/Home.jsx, Product.jsx       → Páginas
  components/                       → Header, Footer, Catalog, CartDrawer, Toast
  context/CartContext.jsx           → Carrito
  services/orderNotifications.js    → WhatsApp + mail del pedido
  data/products.js                  → Catálogo + precios
  config.js                         → WhatsApp, email, Instagram
  styles.css                        → Estilos
public/assets/                      → Imágenes y logo
```

## Stack

- React 18 + Vite (JavaScript), React Router
- Checkout por WhatsApp + aviso del pedido por mail (FormSubmit o EmailJS)

## Notas para el programador

- Precios en `src/data/products.js` (campo `price`, formato ARS)
- Categorías: `borcegos`, `zapatos`, `zapatillas`, `accesorios`
- Cintos: talles de pantalón con largo en cm
- Collares: diámetro 45 / 50 / 55 cm
- Imágenes lifestyle sin caras visibles
- WhatsApp, email e Instagram están en `src/config.js`

## Repo / PR

- GitHub: https://github.com/Belenll/NORVAN
- Pull request: https://github.com/Belenll/NORVAN/pull/1
