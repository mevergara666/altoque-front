import { clp, fechaLegible } from "../utils/formato";

export default function OrdenCard({ orden, mostrarCliente = false }) {
  return (
    <article className="orden-card">
      <header className="orden-card__head">
        <div>
          <strong className="orden-card__numero">{orden.numero}</strong>
          <small>{fechaLegible(orden.fecha)}</small>
        </div>
        <span className="badge-estado">{orden.estado}</span>
      </header>

      {mostrarCliente && (
        <p className="orden-card__cliente">
          <strong>{orden.nombre} {orden.apellidos}</strong> · {orden.correo}
        </p>
      )}

      <ul className="orden-card__items">
        {orden.detalles.map((d, i) => (
          <li key={`${orden.id}-${i}`}>
            <span>{d.cantidad} × {d.nombre}</span>
            <span>{clp(d.subtotal)}</span>
          </li>
        ))}
      </ul>

      <footer className="orden-card__foot">
        <small>
          Entrega: {orden.calle}{orden.departamento ? `, ${orden.departamento}` : ""}, {orden.comuna}
        </small>
        <strong>Total {clp(orden.total)}</strong>
      </footer>
    </article>
  );
}
