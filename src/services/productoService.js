import api from "./api";

const adaptar = (p) => ({
  ...p,
  categoria: p.categoriaNombre,
  precioOriginal: p.precio,
  precio: p.precioFinal,
});

export async function listarProductos(params = {}) {
  const { data } = await api.get("/productos", { params });
  return data.map(adaptar);
}

export async function obtenerProducto(id) {
  const { data } = await api.get(`/productos/${id}`);
  return adaptar(data);
}

export async function listarCriticos() {
  const { data } = await api.get("/productos/criticos");
  return data.map(adaptar);
}

export async function crearProducto(producto) {
  const { data } = await api.post("/productos", producto);
  return adaptar(data);
}

export async function actualizarProducto(id, producto) {
  const { data } = await api.put(`/productos/${id}`, producto);
  return adaptar(data);
}

export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}`);
}
