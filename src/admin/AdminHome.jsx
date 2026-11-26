import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AdminSidebar from "./AdminSidebar";
import { listarProductos, listarCriticos } from "../services/productoService";
import { listarUsuarios } from "../services/usuarioService";
import { listarCategorias } from "../services/categoriaService";
import { listarOrdenes } from "../services/ordenService";
import { clp } from "../utils/formato";

export default function AdminHome() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState({ productos: 0, usuarios: 0, categorias: 0, ordenes: 0, ventas: 0, criticos: [] });

  useEffect(() => {
    let activo = true;
    Promise.all([listarProductos(), listarCriticos(), listarUsuarios(), listarCategorias(), listarOrdenes()])
      .then(([productos, criticos, usuarios, categorias, ordenes]) => {
        if (activo) {
          setDatos({
            productos: productos.length,
            usuarios: usuarios.length,
            categorias: categorias.length,
            ordenes: ordenes.length,
            ventas: ordenes.reduce((suma, o) => suma + o.total, 0),
            criticos,
          });
        }
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar activo="home" />

      <main className="admin-content">
        <h1>¡Hola {usuario.tipoUsuario}!</h1>
        <p>Sesión iniciada como {usuario.nombre || usuario.correo} ({usuario.tipoUsuario}).</p>

        {usuario.rol === "VENDEDOR" && (
          <div className="alert alert-warning">
            Estás conectado como <strong>Vendedor</strong>: solo puedes visualizar productos, categorías, órdenes y usuarios.
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0" }}>
          <div className="alert alert-primary" style={{ minWidth: "180px" }}>
            <strong>{datos.productos}</strong> productos
          </div>
          <div className="alert alert-success" style={{ minWidth: "180px" }}>
            <strong>{datos.usuarios}</strong> usuarios
          </div>
          <div className="alert alert-warning" style={{ minWidth: "180px" }}>
            <strong>{datos.categorias}</strong> categorías
          </div>
          <div className="alert alert-primary" style={{ minWidth: "180px" }}>
            <strong>{datos.ordenes}</strong> órdenes · {clp(datos.ventas)}
          </div>
          <div className="alert alert-danger" style={{ minWidth: "180px" }}>
            <strong>{datos.criticos.length}</strong> productos con stock crítico
          </div>
        </div>

        {datos.criticos.length > 0 && (
          <>
            <h2>Productos con stock crítico</h2>
            <ul>
              {datos.criticos.map((p) => (
                <li key={p.id}>{p.nombre}: quedan <strong>{p.stock}</strong> (crítico: {p.stockCritico})</li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
