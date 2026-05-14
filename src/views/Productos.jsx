import React from 'react';
import './Views.css';

export default function Productos() {
  return (
    <div className="view-container">
      <div className="view-card">
        <h1>📦 Productos</h1>
        <p>Gestión completa de productos</p>
        <div className="placeholder-content">
          <div className="placeholder-icon">🎸</div>
          <p>Vista de Productos - Próximamente CRUD</p>
          <small>Crear, editar, eliminar y actualizar productos</small>
        </div>
      </div>
    </div>
  );
}