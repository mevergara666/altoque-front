import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RutaProtegida({ roles, children }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return (
      <main className="section container">
        <p>Verificando sesión…</p>
      </main>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <main className="section container" style={{ maxWidth: "640px" }}>
        <div className="alert alert-danger p-4">
          <h2>403 · Acceso denegado</h2>
          <p>Tu rol ({usuario.tipoUsuario}) no tiene permiso para ver esta página.</p>
          <Link to="/" className="btn btn--dark">Volver al inicio</Link>
        </div>
      </main>
    );
  }

  return children;
}
