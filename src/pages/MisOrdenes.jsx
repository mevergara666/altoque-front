import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { misOrdenes } from "../services/ordenService";
import { mensajeError } from "../services/api";
import OrdenCard from "../components/OrdenCard";
import EstadoCarga from "../components/EstadoCarga";

// Historial de compras del usuario con sesión
export default function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    misOrdenes()
      .then((lista) => {
        if (activo) setOrdenes(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeError(e, "No se pudieron cargar tus órdenes."));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  if (cargando || error) return <EstadoCarga cargando={cargando} error={error} />;

  return (
    <main className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1>Mis órdenes</h1>
            <p>Historial de tus compras en Al Toque.</p>
          </div>
        </div>

        {ordenes.length === 0 ? (
          <div className="alert alert-warning">
            Aún no tienes compras. <Link to="/productos"><strong>Mira nuestros productos</strong></Link>.
          </div>
        ) : (
          <div className="orden-grid">
            {ordenes.map((o) => (
              <OrdenCard key={o.id} orden={o} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
