import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AdminSidebar from "./AdminSidebar";
import { listarProductos, eliminarProducto } from "../services/productoService";
import { mensajeError } from "../services/api";
import { limpiarRutaImagen, manejarErrorImagen } from "../data/productos";

export default function AdminProductos() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  const esAdmin = usuario.rol === "ADMINISTRADOR"; 

  useEffect(() => {
    let activo = true;
    listarProductos()
      .then((lista) => {
        if (activo) setProductos(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeError(e, "No se pudieron cargar los productos."));
      });
    return () => {
      activo = false;
    };
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      setProductos((lista) => lista.filter((p) => p.id !== id));
    } catch (e) {
      alert(mensajeError(e, "No se pudo eliminar el producto."));
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activo="productos" />

      <main className="admin-content">
        <h1>Productos</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {esAdmin && (
          <p>
            <button className="btn btn-primary mb-3" onClick={() => navigate("/admin/producto-form")}>
              + Nuevo producto
            </button>
          </p>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>
                  <img
                    src={limpiarRutaImagen(prod.imagen)}
                    alt={prod.nombre}
                    onError={manejarErrorImagen}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{prod.codigo}</td>
                <td>{prod.nombre}</td>
                <td>
                  ${prod.precioOriginal.toLocaleString("es-CL")}
                  {prod.enOferta && <small style={{ color: "var(--paprika)" }}> (-{prod.descuento}%)</small>}
                </td>
                <td>{prod.stock}</td>
                <td>{prod.categoria}</td>
                {esAdmin && (
                  <td>
                    <button className="btn btn-secondary btn-small me-2" onClick={() => navigate(`/admin/producto-form/${prod.id}`)}>Editar</button>
                    <button className="btn btn-danger btn-small" onClick={() => eliminar(prod.id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
