import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Encabezado from './components/navegacion/Encabezado';
import Inicio from './views/Inicio';
import Catalogo from './views/Catalogo';
import Categorias from './views/Categorias';
import Productos from './views/Productos';
import Login from './views/Login';
import Pagina404 from './views/Pagina404';
import './App.css';

function App() {
  return (
    <div className="app">
      <Encabezado />
      <main className="main-content">
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/home" element={<Navigate to="/inicio" replace />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/products" element={<Productos />} />
          <Route path="/productos" element={<Productos />} />
          
          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          
          {/* Página 404 - Siempre al final */}
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;