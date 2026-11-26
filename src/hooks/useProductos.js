import { useEffect, useState } from "react";
import { listarProductos } from "../services/productoService";
import { mensajeError } from "../services/api";

export default function useProductos(params) {
  const [estado, setEstado] = useState({ productos: [], cargando: true, error: "" });
  const clave = JSON.stringify(params || {});

  useEffect(() => {
    let activo = true;
    listarProductos(JSON.parse(clave))
      .then((productos) => {
        if (activo) setEstado({ productos, cargando: false, error: "" });
      })
      .catch((e) => {
        if (activo) setEstado({ productos: [], cargando: false, error: mensajeError(e, "No se pudo cargar el catálogo.") });
      });
    return () => {
      activo = false;
    };
  }, [clave]);

  return estado;
}
