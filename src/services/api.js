import axios from "axios";
import { obtenerTokens, guardarTokens, limpiarSesion } from "./sesion";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const { accessToken } = obtenerTokens();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let renovacionEnCurso = null; 

async function renovarToken() {
  const { refreshToken } = obtenerTokens();
  if (!refreshToken) throw new Error("Sin refresh token");
  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  guardarTokens(data.accessToken, data.refreshToken);
  return data;
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config;
    const esRutaAuth = original?.url?.startsWith("/auth/login") || original?.url?.startsWith("/auth/refresh");

    if (error.response?.status === 401 && !original._reintento && !esRutaAuth && obtenerTokens().refreshToken) {
      original._reintento = true;
      try {
        renovacionEnCurso = renovacionEnCurso || renovarToken().finally(() => { renovacionEnCurso = null; });
        const data = await renovacionEnCurso;
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        limpiarSesion();
        window.dispatchEvent(new Event("auth:expirada"));
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export function mensajeError(error, porDefecto = "Ocurrió un error. Intenta nuevamente.") {
  if (!error?.response) return "No se pudo conectar con el servidor.";
  return error.response.data?.message || porDefecto;
}

export function erroresCampos(error) {
  return error?.response?.data?.errors || {};
}

export default api;
