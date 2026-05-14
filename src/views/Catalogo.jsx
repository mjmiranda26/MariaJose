import React from 'react';
import './Views.css';

export default function Catalogo() {
  return (
    <div className="view-container">
      <div className="view-card">
        <h1>📚 Catálogo de Productos</h1>
        <p>Explora todos nuestros productos disponibles</p>
        <div className="placeholder-content">
          <div className="placeholder-icon">📀</div>
          <p>Vista de Catálogo - Próximamente productos</p>
          <small>Listado completo de discos y artículos musicales</small>
        </div>
      </div>
    </div>
  );
}