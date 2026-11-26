# Al Toque - Frontend (React + Vite)

## Cómo correrlo
1. Abre una terminal en esta carpeta (la que tiene package.json).
2. `npm install`
3. `npm run dev`  -> http://localhost:5173
4. El backend debe estar corriendo en http://localhost:8080 (ver `.env`).
   Para AWS cambia `VITE_API_URL` por `http://IP_PUBLICA:8080/api`.

## Pantallas por rol
| Ruta | Quién puede entrar | Qué hace |
|---|---|---|
| `/mis-ordenes` | Cualquier usuario con sesión | Historial de compras (`GET /api/ordenes/mis-ordenes`) |
| `/admin/home` | Admin y Vendedor | Resumen: productos, categorías, órdenes, ventas, stock crítico |
| `/admin/productos` | Admin y Vendedor (solo Admin edita) | CRUD de productos |
| `/admin/categorias` | Admin y Vendedor (solo Admin edita) | CRUD de categorías (no deja borrar si tiene productos) |
| `/admin/ordenes` | Admin y Vendedor | Todas las órdenes, con buscador y total de ventas |
| `/admin/usuarios` | Admin y Vendedor (solo Admin edita) | CRUD de usuarios |

Las rutas se protegen con `<RutaProtegida roles={...}>`; sin sesión redirige al login y con rol insuficiente muestra "403".
El backend valida los mismos permisos con `@PreAuthorize`, así que ocultar botones en el frontend es solo comodidad: la seguridad real está en la API.

## Sesión
Los tokens JWT se guardan en `localStorage` (`src/services/sesion.js`) para que la sesión sobreviva a recargas.
El access token dura 15 minutos y se renueva solo con el refresh token (interceptor de `src/services/api.js`).
