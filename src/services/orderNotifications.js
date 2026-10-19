
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
  if (sum != null) lines.push("", `Total de productos: ${formatARS(sum)}`);

  return lines;
}

export function customerLines(customer = {}) {
  return [
    "DATOS DEL DESTINATARIO",
    `Nombre: ${customer.name || ""}`,
    `Apellido: ${customer.lastName || ""}`,
    `DNI: ${customer.dni || ""}`,
    `Teléfono: ${customer.phone || ""}`,
    `Email: ${customer.email || "No informado"}`,
    "",
    "DOMICILIO DEL DESTINATARIO",
    `Calle: ${customer.street || ""}`,
    `Número: ${customer.streetNumber || ""}`,
    `Piso: ${customer.floor || "No informado"}`,
    `Dpto: ${customer.apartment || "No informado"}`,
    `Ciudad: ${customer.city || ""}`,
    `Provincia: ${customer.province || ""}`,
    `Código Postal: ${customer.postalCode || ""}`,
  ];
}

export function whatsappOrderUrl(items, customer = {}) {
  const msg = [
    "Hola NORVAN, quiero consultar este pedido:",
    "",
    "PRODUCTOS SOLICITADOS",
    ...orderLines(items),
    "",
    ...customerLines(customer),
    "",
    "Quedo a la espera de la confirmación de disponibilidad y envío.",
  ].join("\n");

  const separator = WHATSAPP_URL.includes("?") ? "&" : "?";
  return `${WHATSAPP_URL}${separator}text=${encodeURIComponent(msg)}`;
}

export async function sendOrderEmail(items, customer = {}) {
  const summary = orderLines(items).join("\n");
  const customerDetails = customerLines(customer).join("\n");
  const total = cartTotal(items);

  const data = {
    customer_name: `${customer.name || ""} ${customer.lastName || ""}`.trim(),
    customer_email: customer.email || "No informado",
    customer_phone: customer.phone || "",
    customer_dni: customer.dni || "",
    customer_address: [
      customer.street,
      customer.streetNumber,
      customer.floor ? `Piso ${customer.floor}` : "",
      customer.apartment ? `Dpto ${customer.apartment}` : "",
      customer.city,
      customer.province,
      customer.postalCode ? `CP ${customer.postalCode}` : "",
    ].filter(Boolean).join(", "),
    customer_details: customerDetails,
    order_summary: summary,
    order_total: total != null ? formatARS(total) : "A consultar",
    order_date: new Date().toLocaleString("es-AR"),
  };

  if (EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey) {
    await emailjs.send(
      EMAILJS.serviceId,
      EMAILJS.templateId,
      data,
      { publicKey: EMAILJS.publicKey }
    );
    return;
  }

  const res = await fetch(`https://formsubmit.co/ajax/${ORDER_EMAIL}`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `Nuevo pedido web — ${data.customer_name}`,
      _template: "table",
      _captcha: "false",
      ...(customer.email ? { _replyto: customer.email } : {}),
      Destinatario: data.customer_name,
      DNI: data.customer_dni,
      Telefono: data.customer_phone,
      Email: data.customer_email,
      Domicilio: data.customer_address,
      Datos_completos: customerDetails,
      Pedido: summary,
      Total_productos: data.order_total,
      Fecha: data.order_date,
    }),
  });

  if (!res.ok) {
    throw new Error(`FormSubmit respondió ${res.status}`);
  }
}
