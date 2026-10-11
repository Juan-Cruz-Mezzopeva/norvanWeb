# NORVAN

Sitio web de **NORVAN** — borcegos de hombre.  
Tagline: *Boots for the Journey*.

## Cómo verlo

Proyecto React + Vite (JavaScript).

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera dist/ para publicar
```

El sitio usa rutas del navegador (`/producto/:id`), así que el hosting tiene que
redirigir todas las rutas a `index.html` (ya incluidos `public/_redirects` para
Netlify y `vercel.json` para Vercel). Los links viejos `producto.html?id=...`
redirigen a la ruta nueva.

## Pedidos: WhatsApp + mail

Al tocar **Consultar por WhatsApp** en el carrito se abre WhatsApp con el pedido
y, en paralelo, se envía el mismo pedido por mail a `norvan.arg@gmail.com`
(configurable en `src/config.js`). El cliente puede dejar nombre y email
(opcionales); el email se usa como *reply-to*.

- **Por defecto** se usa [FormSubmit](https://formsubmit.co): no requiere cuenta.
  El primer pedido dispara un mail de activación a `norvan.arg@gmail.com` que hay
  que confirmar una sola vez; recién después llegan los pedidos.
- **Opcional: EmailJS.** Copiá `.env.example` a `.env` y completá
  `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` y `VITE_EMAILJS_PUBLIC_KEY`.
  La plantilla recibe `customer_name`, `customer_email`, `order_summary`,
  `order_total` y `order_date`.

## Estructura

- `src/pages/Home.jsx` — Home (hero, colección, nosotros, contacto)
- `src/pages/Product.jsx` — Ficha de producto + talles (`/producto/:id`)
- `src/components/` — Header, Footer, Catálogo, Carrito, Toast
- `src/context/CartContext.jsx` — Estado del carrito (guardado en localStorage)
- `src/services/orderNotifications.js` — Mensaje de WhatsApp y envío por mail
- `src/data/products.js` — Catálogo + precios
- `src/config.js` — WhatsApp, email, Instagram
- `src/styles.css` — Identidad visual
- `public/assets/` — Logo e imágenes

## Identidad

| Token | Hex |
|-------|-----|
| Negro | `#0D0D0D` |
| Verde bosque | `#1F2A22` |
| Taupe | `#8A806E` |
| Beige | `#E7E3DA` |
| Blanco | `#FFFFFF` |

Tipografía: **Montserrat** (Regular / Medium / SemiBold / Bold).
