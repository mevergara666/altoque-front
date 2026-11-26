import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { obtenerProducto, crearProducto, actualizarProducto } from "../services/productoService";
import { listarCategorias } from "../services/categoriaService";
import { mensajeError, erroresCampos } from "../services/api";

const FORM_VACIO = {
  codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "",
  categoriaId: "", imagen: "", enOferta: false, descuento: 0
};

export default function ProductoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState(FORM_VACIO);
  const [categorias, setCategorias] = useState([]);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    let activo = true;
    listarCategorias()
      .then((lista) => {
        if (!activo) return;
        setCategorias(lista);
        if (!id && lista.length > 0) setForm((f) => (f.categoriaId ? f : { ...f, categoriaId: lista[0].id }));
      })
      .catch((e) => {
        if (activo) setErrorGeneral(mensajeError(e, "No se pudieron cargar las categorías."));
      });

    if (id) {
      obtenerProducto(id)
        .then((p) => {
          if (!activo) return;
          setForm({
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion || "",
            precio: p.precioOriginal,
            stock: p.stock,
            stockCritico: p.stockCritico,
            categoriaId: p.categoriaId,
            imagen: p.imagen || "",
            enOferta: Boolean(p.enOferta),
            descuento: p.descuento || 0,
          });
        })
        .catch((e) => {
          if (activo) setErrorGeneral(mensajeError(e, "No se pudo cargar el producto."));
        });
    }
    return () => {
      activo = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const valor = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: valor });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorGeneral("");

    const datos = {
      codigo: form.codigo,
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio === "" ? null : Number(form.precio),
      stock: form.stock === "" ? null : Number(form.stock),
      stockCritico: form.stockCritico === "" ? null : Number(form.stockCritico),
      categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
      imagen: form.imagen || "img/completo-italiano.PNG",
      enOferta: form.enOferta,
      descuento: form.enOferta ? Number(form.descuento) || 0 : 0,
    };

    try {
      if (esEdicion) await actualizarProducto(id, datos);
      else await crearProducto(datos);
      alert("Producto guardado con éxito.");
      navigate("/admin/productos");
    } catch (err) {
      const campos = erroresCampos(err);
      if (Object.keys(campos).length > 0) setErrores(campos);
      else setErrorGeneral(mensajeError(err, "No se pudo guardar el producto."));
    }
  };

  const campoError = (nombre) =>
    errores[nombre] && <small className="error-message" style={{ display: "block" }}>{errores[nombre]}</small>;

  return (
    <div className="admin-layout">
      <AdminSidebar activo="productos" />

      <main className="admin-content">
        <h1>{esEdicion ? "Editar Producto" : "Nuevo Producto"}</h1>
        {errorGeneral && <div className="alert alert-danger" style={{ maxWidth: "500px" }}>{errorGeneral}</div>}

        <form onSubmit={handleSubmit} className="form-box" style={{ maxWidth: "500px" }} noValidate>
          <div className={`form-group ${errores.codigo ? "invalid" : ""}`}>
            <label>Código de producto</label>
            <input type="text" name="codigo" value={form.codigo} onChange={handleChange} maxLength="20" />
            {campoError("codigo")}
          </div>
          <div className={`form-group ${errores.nombre ? "invalid" : ""}`}>
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} maxLength="100" />
            {campoError("nombre")}
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" maxLength="500"></textarea>
            {campoError("descripcion")}
          </div>
          <div className={`form-group ${errores.precio ? "invalid" : ""}`}>
            <label>Precio</label>
            <input type="number" name="precio" value={form.precio} onChange={handleChange} min="0" />
            {campoError("precio")}
          </div>
          <div className={`form-group ${errores.stock ? "invalid" : ""}`}>
            <label>Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
            {campoError("stock")}
          </div>
          <div className={`form-group ${errores.stockCritico ? "invalid" : ""}`}>
            <label>Stock crítico</label>
            <input type="number" name="stockCritico" value={form.stockCritico} onChange={handleChange} min="0" />
            {campoError("stockCritico")}
          </div>
          <div className={`form-group ${errores.categoriaId ? "invalid" : ""}`}>
            <label>Categoría</label>
            <select name="categoriaId" value={form.categoriaId} onChange={handleChange}>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {campoError("categoriaId")}
          </div>
          <div className="form-group">
            <label>Ruta de imagen</label>
            <input type="text" name="imagen" value={form.imagen} onChange={handleChange} placeholder="img/completo-italiano.PNG" />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" name="enOferta" checked={form.enOferta} onChange={handleChange} /> Producto en oferta
            </label>
          </div>
          {form.enOferta && (
            <div className={`form-group ${errores.descuento ? "invalid" : ""}`}>
              <label>Descuento (%)</label>
              <input type="number" name="descuento" value={form.descuento} onChange={handleChange} min="0" max="90" />
              {campoError("descuento")}
            </div>
          )}
          <button type="submit" className="btn btn-primary">Guardar Producto</button>{" "}
          <Link to="/admin/productos" className="btn btn--dark">Cancelar</Link>
        </form>
      </main>
    </div>
  );
}
