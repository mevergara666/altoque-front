const CLAVE = "altoque.sesion";

export function guardarTokens(accessToken, refreshToken) {
  localStorage.setItem(CLAVE, JSON.stringify({ accessToken, refreshToken }));
}

export function obtenerTokens() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || {};
  } catch {
    return {};
  }
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE);
  localStorage.removeItem("usuarioActivo"); 
}
