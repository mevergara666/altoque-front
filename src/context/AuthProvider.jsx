import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import * as authService from "../services/authService";
import { guardarTokens, obtenerTokens, limpiarSesion } from "../services/sesion";
import { adaptarUsuario } from "../utils/roles";

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(() => Boolean(obtenerTokens().refreshToken));

  useEffect(() => {
    if (!obtenerTokens().refreshToken) return undefined;
    let activo = true;
    authService
      .perfil()
      .then((u) => {
        if (activo) setUsuario(adaptarUsuario(u));
      })
      .catch(() => {
        limpiarSesion();
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener("auth:expirada", alExpirar);
    return () => window.removeEventListener("auth:expirada", alExpirar);
  }, []);

  const login = useCallback(async (correo, password) => {
    const data = await authService.login(correo, password);
    guardarTokens(data.accessToken, data.refreshToken);
    const u = adaptarUsuario(data.usuario);
    setUsuario(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = obtenerTokens();
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch {
    }
    limpiarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, cargando, login, logout }), [usuario, cargando, login, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
