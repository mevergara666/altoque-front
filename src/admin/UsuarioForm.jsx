import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { crearUsuario, actualizarUsuario, obtenerUsuario } from "../services/usuarioService";
import { mensajeError, erroresCampos } from "../services/api";
import { ROLES, ETIQUETA_ROL } from "../utils/roles";

const FORM_VACIO = {
  run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "",
  region: "", comuna: "", direccion: "", rol: ROLES.CLIENTE, password: ""
};

export default function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    if (!id) return undefined;
    let activo = true;
    obtenerUsuario(id)
      .then((u) => {
        if (!activo) return;
        setForm({
          run: u.run || "", nombre: u.nombre || "", apellidos: u.apellidos || "", correo: u.correo || "",
          fechaNacimiento: u.fechaNacimiento || "", region: u.region || "", comuna: u.comuna || "",
          direccion: u.direccion || "", rol: u.rol, password: ""
        });
      })
      .catch((e) => {
        if (activo) setErrorGeneral(mensajeError(e, "No se pudo cargar el usuario."));
      });
    return () => {
      activo = false;
    };
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores({});
    setErrorGeneral("");

    const datos = { ...form, password: form.password || undefined };

    try {
      if (esEdicion) await actualizarUsuario(id, datos);
      else await crearUsuario(datos);
      navigate("/admin/usuarios");
    } catch (err) {
      const campos = erroresCampos(err);
      if (Object.keys(campos).length > 0) setErrores(campos);
      else setErrorGeneral(mensajeError(err, "No se pudo guardar el usuario."));
    }
  };

  const campoError = (nombre) =>
    errores[nombre] && <small className="error-message" style={{ display: "block" }}>{errores[nombre]}</small>;

  return (
    <div className="admin-layout">
      <AdminSidebar activo="usuarios" />

      <main className="admin-content">
        <h1>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</h1>
        {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errores.run ? "invalid" : ""}`}>
            <label>RUT (sin puntos ni guión)</label>
            <input type="text" name="run" maxLength="9" value={form.run} onChange={handleChange} />
            {campoError("run")}
          </div>

          <div className={`form-group ${errores.nombre ? "invalid" : ""}`}>
            <label>Nombre</label>
            <input type="text" name="nombre" maxLength="50" value={form.nombre} onChange={handleChange} />
            {campoError("nombre")}
          </div>

          <div className={`form-group ${errores.apellidos ? "invalid" : ""}`}>
            <label>Apellidos</label>
            <input type="text" name="apellidos" maxLength="100" value={form.apellidos} onChange={handleChange} />
            {campoError("apellidos")}
          </div>

          <div className={`form-group ${errores.correo ? "invalid" : ""}`}>
            <label>Correo electrónico</label>
            <input type="email" name="correo" maxLength="100" value={form.correo} onChange={handleChange} />
            {campoError("correo")}
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Región</label>
            <select name="region" value={form.region} onChange={handleChange}>
              <option value="">Seleccione región</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
            </select>
          </div>

          <div className="form-group">
            <label>Comuna</label>
            <select name="comuna" value={form.comuna} onChange={handleChange}>
              <option value="">Seleccione comuna</option>
              <option value="La Florida">La Florida</option>
              <option value="Puente Alto">Puente Alto</option>
              <option value="Isla Maipo">Isla Maipo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input type="text" name="direccion" maxLength="300" value={form.direccion} onChange={handleChange} />
            {campoError("direccion")}
          </div>

          <div className="form-group">
            <label>Tipo de usuario (rol)</label>
            <select name="rol" value={form.rol} onChange={handleChange}>
              {Object.values(ROLES).map((r) => <option key={r} value={r}>{ETIQUETA_ROL[r]}</option>)}
            </select>
          </div>

          <div className={`form-group ${errores.password ? "invalid" : ""}`}>
            <label>{esEdicion ? "Nueva contraseña (dejar vacío para mantener la actual)" : "Contraseña (4 a 10 caracteres)"}</label>
            <input type="password" name="password" maxLength="10" value={form.password} onChange={handleChange} />
            {campoError("password")}
          </div>

          <button type="submit" className="btn">{esEdicion ? "Guardar cambios" : "Crear usuario"}</button>{" "}
          <Link to="/admin/usuarios" className="btn btn--dark">Cancelar</Link>
        </form>
      </main>
    </div>
  );
}
