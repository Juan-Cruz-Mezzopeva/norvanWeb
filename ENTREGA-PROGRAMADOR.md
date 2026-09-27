# NORVAN — Entrega del sitio web

Sitio estático de calzado masculino NORVAN. Para abrir o editar, no hace falta backend ni base de datos.

## Cómo abrirlo

1. Descomprimí `norvan-website.zip`
2. Entrá a la carpeta
3. Abrí `index.html` en el navegador  
   o serví localmente:
   ```bash
   python3 -m http.server 8080
   ```
   y entrá a `http://localhost:8080`

## Estructura

```
index.html          → Home (hero, catálogo, nosotros, contacto)
producto.html       → Ficha de producto (?id=...)
css/styles.css      → Estilos
js/
  products.js       → Catálogo + precios
  catalog-render.js → Grilla y filtros
  product-page.js   → Detalle, talles, agregar a selección
  cart.js           → Carrito / consulta WhatsApp
  main.js           → Nav, scroll, UI general
assets/
  hero.jpg / hero2.jpg
  products/         → Fotos de cada modelo
```

## Stack

- HTML + CSS + JavaScript (vanilla)
- Sin framework, sin build step
- Contacto / checkout por WhatsApp

## Notas para el programador

- Precios en `js/products.js` (campo `price`, formato ARS)
- Categorías: `borcegos`, `zapatos`, `zapatillas`, `accesorios`
- Cintos: talles de pantalón con largo en cm
- Collares: diámetro 45 / 50 / 55 cm
- Imágenes lifestyle sin caras visibles
- WhatsApp y datos de contacto están en el HTML / JS

## Repo / PR

- GitHub: https://github.com/Belenll/NORVAN
- Pull request: https://github.com/Belenll/NORVAN/pull/1
