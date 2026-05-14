import React from 'react';
import './Views.css';

export default function Categorias() {
  return (
    <div className="view-container">
      <div className="view-card">
        <h1>🏷️ Categorías</h1>
        <p>Administra las categorías de productos</p>
        <div className="placeholder-content">
          <div className="placeholder-icon">📁</div>
          <p>Vista de Categorías - Próximamente gestión</p>
          <small>CRUD de categorías: Rock, Pop, Jazz, Electrónica, etc.</small>
        </div>
      </div>
    </div>
  );
}