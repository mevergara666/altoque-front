export default function EstadoCarga({ cargando, error }) {
  return (
    <main className="section container">
      {cargando && <p>Cargando…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
    </main>
  );
}
