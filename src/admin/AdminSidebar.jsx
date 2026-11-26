import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminSidebar({ activo }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  const clase = (nombre) => (activo === nombre ? "active" : undefined);

  return (
    <aside className="admin-sidebar">
      <h2>Al<span style={{ color: "var(--mustard)" }}>Toque</span></h2>
      <ul>
        <li><Link to="/admin/home" className={clase("home")}>Inicio</Link></li>
        <li><Link to="/admin/productos" className={clase("productos")}>Productos</Link></li>
        <li><Link to="/admin/categorias" className={clase("categorias")}>Categorías</Link></li>
        <li><Link to="/admin/ordenes" className={clase("ordenes")}>Órdenes</Link></li>
        <li><Link to="/admin/usuarios" className={clase("usuarios")}>Usuarios</Link></li>
        <li><Link to="/">Volver al sitio</Link></li>
        <li><Link to="#" onClick={cerrarSesion}>Cerrar sesión</Link></li>
      </ul>
    </aside>
  );
}
