import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Encabezado from './components/navegacion/Encabezado';
import Inicio from './views/Inicio';
import Catalogo from './views/Catalogo';
import Categorias from './views/Categorias';
import Productos from './views/Productos';
import Login from './views/Login';
import Pagina404 from './views/Pagina404';
import './App.css';

function App() {
  const location = useLocation();

  // Debug: Log when App mounts
  useEffect(() => {
    console.log('🚀 App mounted successfully');
    console.log('📍 Current location:', location.pathname);
    console.log('📦 Environment variables loaded:', {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Yes' : '❌ No',
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Yes' : '❌ No',
    });
  }, []);

  // Debug: Log route changes
  useEffect(() => {
    console.log('🔄 Route changed to:', location.pathname);
  }, [location]);

  // Debug: Log component rendering
  console.log('🎨 App rendering, current path:', location.pathname);

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