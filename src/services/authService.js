import api from "./api";

export async function login(correo, password) {
  const { data } = await api.post("/auth/login", { correo, password });
  return data; 
}

export async function registro(datos) {
  const { data } = await api.post("/auth/registro", datos);
  return data;
}

export async function logout(refreshToken) {
  await api.post("/auth/logout", { refreshToken });
}

export async function perfil() {
  const { data } = await api.get("/auth/me");
  return data;
}
