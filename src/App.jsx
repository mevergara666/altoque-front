import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";
import { PERSONAL, SOLO_ADMIN, TODOS } from "./utils/roles";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import DetalleBlog from "./pages/DetalleBlog";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import MisOrdenes from "./pages/MisOrdenes";

import AdminHome from "./admin/AdminHome";
import AdminProductos from "./admin/AdminProductos";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminCategorias from "./admin/AdminCategorias";
import AdminOrdenes from "./admin/AdminOrdenes";
import ProductoForm from "./admin/ProductoForm";
import UsuarioForm from "./admin/UsuarioForm";

export default function App() {
  const [carrito, setCarrito] = useState(() => {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const totalCartCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <Router>
      <Navbar cartCount={totalCartCount} />
      <Routes>
        <Route path="/" element={<Home setCarrito={setCarrito} carrito={carrito} />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto setCarrito={setCarrito} carrito={carrito} />} />
        <Route path="/categorias" element={<Categorias setCarrito={setCarrito} carrito={carrito} />} />
        <Route path="/ofertas" element={<Ofertas setCarrito={setCarrito} carrito={carrito} />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<DetalleBlog />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
        <Route path="/checkout" element={<Checkout carrito={carrito} setCarrito={setCarrito} />} />

        {}
        <Route path="/mis-ordenes" element={<RutaProtegida roles={TODOS}><MisOrdenes /></RutaProtegida>} />

        {}
        <Route path="/admin/home" element={<RutaProtegida roles={PERSONAL}><AdminHome /></RutaProtegida>} />
        <Route path="/admin/productos" element={<RutaProtegida roles={PERSONAL}><AdminProductos /></RutaProtegida>} />
        <Route path="/admin/producto-form" element={<RutaProtegida roles={SOLO_ADMIN}><ProductoForm /></RutaProtegida>} />
        <Route path="/admin/producto-form/:id" element={<RutaProtegida roles={SOLO_ADMIN}><ProductoForm /></RutaProtegida>} />
        <Route path="/admin/categorias" element={<RutaProtegida roles={PERSONAL}><AdminCategorias /></RutaProtegida>} />
        <Route path="/admin/ordenes" element={<RutaProtegida roles={PERSONAL}><AdminOrdenes /></RutaProtegida>} />
        <Route path="/admin/usuarios" element={<RutaProtegida roles={PERSONAL}><AdminUsuarios /></RutaProtegida>} />
        <Route path="/admin/usuarios/nuevo" element={<RutaProtegida roles={SOLO_ADMIN}><UsuarioForm /></RutaProtegida>} />
        <Route path="/admin/usuarios/editar/:id" element={<RutaProtegida roles={SOLO_ADMIN}><UsuarioForm /></RutaProtegida>} />
      </Routes>
      <Footer />
    </Router>
  );
}