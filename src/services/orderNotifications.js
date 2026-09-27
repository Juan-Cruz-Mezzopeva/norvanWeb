import emailjs from "@emailjs/browser";
import { ORDER_EMAIL, WHATSAPP_URL } from "../config";
import { cartTotal, formatARS } from "../utils";

const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export function orderLines(items) {
  const lines = items.map((i) => {
    const price = i.price != null ? ` · ${formatARS(i.price)}` : "";
    return `• ${i.name} (talle ${i.size}) x${i.qty}${price}`;
  });
  const sum = cartTotal(items);
  if (sum != null) lines.push("", `Total: ${formatARS(sum)}`);
  return lines;
}

export function whatsappOrderUrl(items, customer = {}) {
  const who = customer.name ? `, soy ${customer.name}` : "";
  const msg = `Hola NORVAN${who}, quiero consultar esta selección:\n${orderLines(
    items
  ).join("\n")}`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`;
}

/**
 * Envía el pedido por mail a la tienda.
 * Usa EmailJS si está configurado (VITE_EMAILJS_*); si no, FormSubmit
 * (la primera vez FormSubmit manda un mail a ORDER_EMAIL para activarlo).
 */
export async function sendOrderEmail(items, customer = {}) {
  const summary = orderLines(items).join("\n");
  const total = cartTotal(items);
  const data = {
    customer_name: customer.name || "Sin nombre",
    customer_email: customer.email || "No informado",
    order_summary: summary,
    order_total: total != null ? formatARS(total) : "A consultar",
    order_date: new Date().toLocaleString("es-AR"),
  };

  if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
    await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data, {
      publicKey: EMAILJS.publicKey,
    });
    return;
  }

  const res = await fetch(`https://formsubmit.co/ajax/${ORDER_EMAIL}`, {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Nuevo pedido web — ${data.customer_name}`,
      _template: "table",
      _captcha: "false",
      ...(customer.email ? { _replyto: customer.email } : {}),
      Nombre: data.customer_name,
      Email: data.customer_email,
      Pedido: summary,
      Total: data.order_total,
      Fecha: data.order_date,
    }),
  });
  if (!res.ok) throw new Error(`FormSubmit respondió ${res.status}`);
}
