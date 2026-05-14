import React from 'react';
import './Views.css';

export default function Inicio() {
  return (
    <div className="view-container">
      <div className="view-card">
        <h1>🏠 Bienvenido a Discosca</h1>
        <p>Tu tienda de discos y música favorita</p>
        <div className="placeholder-content">
          <div className="placeholder-icon">🎵</div>
          <p>Vista de Inicio - Próximamente contenido</p>
          <small>Página principal del catálogo de productos</small>
        </div>
      </div>
    </div>
  );
}