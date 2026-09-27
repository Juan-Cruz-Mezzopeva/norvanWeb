export function formatARS(value) {
  if (value == null || value === "") return "Consultar";
  return (
    "$" +
    Number(value)
      .toLocaleString("es-AR", { maximumFractionDigits: 0 })
      .replace(/\u00a0/g, ".")
  );
}

export function cartTotal(items) {
  const values = items.filter((i) => i.price != null);
  if (!values.length) return null;
  return values.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
}
