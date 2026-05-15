import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NotificacionOperacion from './components/NotificacionOperacion';
import RutaProtegida from './components/rutas/RutaProtegida';
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
    <NotificacionOperacion>
      <div className="app">
        <Encabezado />
        <main className="main-content">
          <Routes>
            {/* Rutas públicas - disponibles sin autenticación */}
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/home" element={<Navigate to="/inicio" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/about" element={<Inicio />} /> {/* O crea una página About */}
            
            {/* Rutas protegidas - requieren autenticación */}
            <Route 
              path="/catalogo" 
              element={
                <RutaProtegida>
                  <Catalogo />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/categorias" 
              element={
                <RutaProtegida>
                  <Categorias />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/products" 
              element={
                <RutaProtegida>
                  <Productos />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/productos" 
              element={
                <RutaProtegida>
                  <Productos />
                </RutaProtegida>
              } 
            />
            
            {/* Página 404 - Siempre al final */}
            <Route path="*" element={<Pagina404 />} />
          </Routes>
        </main>
      </div>
    </NotificacionOperacion>
  );
}

export default App;