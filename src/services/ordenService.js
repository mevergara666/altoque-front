import api from "./api";

export async function crearOrden(orden) {
  const { data } = await api.post("/ordenes", orden);
  return data;
}

// Todas las órdenes: solo ADMINISTRADOR y VENDEDOR
export async function listarOrdenes() {
  const { data } = await api.get("/ordenes");
  return data;
}

// Historial del usuario con sesión iniciada
export async function misOrdenes() {
  const { data } = await api.get("/ordenes/mis-ordenes");
  return data;
}

export async function obtenerOrden(id) {
  const { data } = await api.get(`/ordenes/${id}`);
  return data;
}
