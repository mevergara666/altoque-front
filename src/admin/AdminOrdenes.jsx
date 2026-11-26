import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import OrdenCard from "../components/OrdenCard";
import { listarOrdenes } from "../services/ordenService";
import { mensajeError } from "../services/api";
import { clp } from "../utils/formato";

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    let activo = true;
    listarOrdenes()
      .then((lista) => {
        if (activo) setOrdenes(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeError(e, "No se pudieron cargar las órdenes."));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const visibles = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return ordenes;
    return ordenes.filter((o) =>
      [o.numero, o.nombre, o.apellidos, o.correo].some((v) => v?.toLowerCase().includes(t))
    );
  }, [ordenes, busqueda]);

  const ventas = visibles.reduce((suma, o) => suma + o.total, 0);

  return (
    <div className="admin-layout">
      <AdminSidebar activo="ordenes" />

      <main className="admin-content">
        <h1>Órdenes</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="admin-resumen">
          <div className="alert alert-primary">
            <strong>{visibles.length}</strong> órdenes
          </div>
          <div className="alert alert-success">
            Ventas: <strong>{clp(ventas)}</strong>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: "420px" }}>
          <input
            type="search"
            placeholder="Buscar por número, cliente o correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando órdenes…</p>
        ) : visibles.length === 0 ? (
          <p>No hay órdenes para mostrar.</p>
        ) : (
          <div className="orden-grid">
            {visibles.map((o) => (
              <OrdenCard key={o.id} orden={o} mostrarCliente />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
