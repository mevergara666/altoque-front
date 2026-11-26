import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { mensajeError } from "../services/api";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const desde = useLocation().state?.desde; // ruta que el usuario quería abrir antes de iniciar sesión

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorCorreo("");
    setErrorPassword("");

    let valido = true;

    
    if (!correo.trim()) {
      setErrorCorreo("El correo es obligatorio");
      valido = false;
    } else {
      const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
      const dominioValido = dominiosPermitidos.some((dom) => correo.endsWith(dom));
      if (!dominioValido) {
        setErrorCorreo("Dominio de correo no permitido (@duoc.cl, @profesor.duoc.cl, @gmail.com)");
        valido = false;
      }
    }

   
    if (!password.trim()) {
      setErrorPassword("La contraseña es obligatoria");
      valido = false;
    } else if (password.length < 4 || password.length > 10) {
      setErrorPassword("La contraseña debe tener entre 4 y 10 caracteres");
      valido = false;
    }

    if (!valido) return;

    try {
      const usuario = await login(correo, password);
      if (usuario.rol === "ADMINISTRADOR" || usuario.rol === "VENDEDOR") {
        navigate(desde || "/admin/home");
      } else {
        navigate(desde || "/");
      }
    } catch (err) {
      setErrorPassword(mensajeError(err, "Correo o contraseña incorrectos"));
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: "640px" }}>
        <section className="login-container">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para acceder a tu cuenta.</p>

          <form onSubmit={handleLogin} noValidate>
            <div className={`form-group ${errorCorreo ? "invalid" : ""}`}>
              <label htmlFor="correo">Correo Electrónico</label>
              <input 
                type="email" 
                id="correo" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                maxLength="100"
              />
              {errorCorreo && <small className="error-message" style={{ display: "block" }}>{errorCorreo}</small>}
            </div>

            <div className={`form-group ${errorPassword ? "invalid" : ""}`}>
              <label htmlFor="password">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength="4"
                maxLength="10"
              />
              {errorPassword && <small className="error-message" style={{ display: "block" }}>{errorPassword}</small>}
            </div>

            <button type="submit" className="btn">Ingresar</button>
          </form>

          <div className="extra-links">
            <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}