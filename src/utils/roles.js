// Roles que entrega el backend y su etiqueta para mostrar en pantalla
export const ROLES = {
  CLIENTE: "CLIENTE",
  VENDEDOR: "VENDEDOR",
  ADMINISTRADOR: "ADMINISTRADOR",
};

export const TODOS = Object.values(ROLES); // cualquier usuario con sesión
export const PERSONAL = [ROLES.ADMINISTRADOR, ROLES.VENDEDOR];
export const SOLO_ADMIN = [ROLES.ADMINISTRADOR];

export const ETIQUETA_ROL = {
  CLIENTE: "Cliente",
  VENDEDOR: "Vendedor",
  ADMINISTRADOR: "Administrador",
};

export function adaptarUsuario(usuario) {
  return usuario ? { ...usuario, tipoUsuario: ETIQUETA_ROL[usuario.rol] || "Cliente" } : null;
}
