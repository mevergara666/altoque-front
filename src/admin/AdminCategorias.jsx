import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AdminSidebar from "./AdminSidebar";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/categoriaService";
import { listarProductos } from "../services/productoService";
import { mensajeError, erroresCampos } from "../services/api";

export default function AdminCategorias() {
  const { usuario } = useAuth();
  const esAdmin = usuario.rol === "ADMINISTRADOR";

  const [categorias, setCategorias] = useState([]);
  const [conteo, setConteo] = useState({}); 
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [errorNombre, setErrorNombre] = useState("");

  const cargar = async () => {
    try {
      const [cats, productos] = await Promise.all([listarCategorias(), listarProductos()]);
      setCategorias(cats);
      const cuenta = {};
      productos.forEach((p) => {
        cuenta[p.categoriaId] = (cuenta[p.categoriaId] || 0) + 1;
      });
      setConteo(cuenta);
    } catch (e) {
      setError(mensajeError(e, "No se pudieron cargar las categorías."));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiarForm = () => {
    setNombre("");
    setEditandoId(null);
    setErrorNombre("");
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");
    setErrorNombre("");

    if (!nombre.trim()) {
      setErrorNombre("El nombre es obligatorio");
      return;
    }

    try {
      if (editandoId) await actualizarCategoria(editandoId, { nombre });
      else await crearCategoria({ nombre });
      setExito(editandoId ? "Categoría actualizada." : "Categoría creada.");
      limpiarForm();
      cargar();
    } catch (err) {
      const campos = erroresCampos(err);
      if (campos.nombre) setErrorNombre(campos.nombre);
      else setError(mensajeError(err, "No se pudo guardar la categoría."));
    }
  };

  const editar = (c) => {
    setEditandoId(c.id);
    setNombre(c.nombre);
    setErrorNombre("");
    setExito("");
    setError("");
  };

  const eliminar = async (c) => {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    setError("");
    setExito("");
    try {
      await eliminarCategoria(c.id);
      setCategorias((lista) => lista.filter((x) => x.id !== c.id));
      setExito("Categoría eliminada.");
    } catch (err) {
      setError(
        err.response?.status === 409
          ? `No se puede eliminar "${c.nombre}": tiene productos asociados.`
          : mensajeError(err, "No se pudo eliminar la categoría.")
      );
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activo="categorias" />

      <main className="admin-content">
        <h1>Categorías</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        {!esAdmin && (
          <div className="alert alert-warning">
            Estás conectado como <strong>Vendedor</strong>: solo puedes visualizar las categorías.
          </div>
        )}

        {esAdmin && (
          <form onSubmit={guardar} noValidate className="form-inline-admin">
            <div className={`form-group ${errorNombre ? "invalid" : ""}`}>
              <label>{editandoId ? "Editar categoría" : "Nueva categoría"}</label>
              <input
                type="text"
                maxLength="100"
                placeholder="Ej: Postres"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errorNombre && <small className="error-message" style={{ display: "block" }}>{errorNombre}</small>}
            </div>
            <div>
              <button type="submit" className="btn">{editandoId ? "Guardar cambios" : "+ Agregar"}</button>{" "}
              {editandoId && (
                <button type="button" className="btn btn--dark" onClick={limpiarForm}>Cancelar</button>
              )}
            </div>
          </form>
        )}

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Productos</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr><td colSpan="4">No hay categorías registradas.</td></tr>
            ) : (
              categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{conteo[c.id] || 0}</td>
                  {esAdmin && (
                    <td>
                      <button className="btn btn-secondary btn-small me-2" onClick={() => editar(c)}>Editar</button>
                      <button className="btn btn-danger btn-small" onClick={() => eliminar(c)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
