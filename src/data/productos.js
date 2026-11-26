export function limpiarRutaImagen(ruta) {
  if (!ruta) return "";
  const limpia = ruta.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
  return "/" + limpia;
}

export function manejarErrorImagen(e) {
  const img = e.currentTarget;
  const srcActual = decodeURIComponent(img.getAttribute("src") || "");
  if (!img.dataset.intentadoEspacios && srcActual.includes("-")) {
    img.dataset.intentadoEspacios = "true";
    img.src = srcActual.replace(/\/img\/(.+)$/, (_, nombre) => "/img/" + nombre.replace(/-/g, " "));
  }
}
