import { limpiarRutaImagen, manejarErrorImagen } from "../data/productos";
import { Link } from "react-router-dom";
import useProductos from "../hooks/useProductos";
import EstadoCarga from "../components/EstadoCarga";

export default function Ofertas({ setCarrito, carrito }) {
  const { productos: productosEnOferta, cargando, error } = useProductos({ enOferta: true });

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, imagen: limpiarRutaImagen(producto.imagen), cantidad: 1 }]);
    }
    alert("¡Oferta añadida al carrito!");
  };

  if (cargando || error) return <EstadoCarga cargando={cargando} error={error} />;

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h1>Ofertas Imperdibles</h1>
              <p>Aprovecha nuestros descuentos especiales por tiempo limitado.</p>
            </div>
          </div>

          {productosEnOferta.length === 0 && <p>Por ahora no hay productos en oferta.</p>}
          <div className="product-grid">
            {productosEnOferta.map((producto) => (
              <article className="product-card" key={producto.id} style={{ position: "relative" }}>
                <span style={{ position: "absolute", top: "10px", right: "10px", background: "var(--paprika)", color: "#fff", padding: "2px 8px", fontSize: "0.8rem", fontWeight: "bold", borderRadius: "4px" }}>
                  ¡{producto.descuento}% OFF!
                </span>
                <img
                  src={limpiarRutaImagen(producto.imagen)}
                  alt={producto.nombre}
                  width="200"
                  height="150"
                  onError={manejarErrorImagen}
                />
                <p className="product-name">{producto.nombre}</p>
                <div className="product-row">
                  <div>
                    <span className="product-price" style={{ marginRight: "8px" }}>
                      ${producto.precio.toLocaleString("es-CL")}
                    </span>
                    <span style={{ textDecoration: "line-through", fontSize: "0.9rem", color: "#666" }}>
                      ${producto.precioOriginal.toLocaleString("es-CL")}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <Link to={`/producto/${producto.id}`} className="add-btn">Detalle</Link>
                    <button className="add-btn" type="button" onClick={() => agregarAlCarrito(producto)}>
                      Añadir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}