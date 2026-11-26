import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AdminSidebar from "./AdminSidebar";
import { listarUsuarios, eliminarUsuario } from "../services/usuarioService";
import { mensajeError } from "../services/api";
import { ETIQUETA_ROL } from "../utils/roles";

export default function AdminUsuarios() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  const esAdmin = usuario.rol === "ADMINISTRADOR";

  useEffect(() => {
    let activo = true;
    listarUsuarios()
      .then((lista) => {
        if (activo) setUsuarios(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeError(e, "No se pudieron cargar los usuarios."));
      });
    return () => {
      activo = false;
    };
  }, []);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setUsuarios((lista) => lista.filter((u) => u.id !== id));
    } catch (e) {
      alert(mensajeError(e, "No se pudo eliminar el usuario."));
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activo="usuarios" />

      <main className="admin-content">
        <h1>Usuarios</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {esAdmin && (
          <p>
            <Link to="/admin/usuarios/nuevo" className="btn btn-primary mb-3">+ Nuevo usuario</Link>
          </p>
        )}
        <table className="admin-table">
          <thead>
            <tr>
              <th>RUT / RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr><td colSpan="5">No hay usuarios registrados.</td></tr>
            ) : (
              usuarios.map((usu) => (
                <tr key={usu.id}>
                  <td>{usu.run}</td>
                  <td>{usu.nombre} {usu.apellidos}</td>
                  <td>{usu.correo}</td>
                  <td>{ETIQUETA_ROL[usu.rol]}</td>
                  {esAdmin && (
                    <td>
                      <button className="btn btn-secondary btn-small me-2" onClick={() => navigate(`/admin/usuarios/editar/${usu.id}`)}>Editar</button>
                      <button className="btn btn-danger btn-small" onClick={() => eliminar(usu.id)}>Eliminar</button>
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
