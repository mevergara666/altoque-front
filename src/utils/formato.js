export const clp = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

export function fechaLegible(iso) {
  if (!iso) return "";
  const f = new Date(iso);
  return Number.isNaN(f.getTime())
    ? iso
    : f.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}
