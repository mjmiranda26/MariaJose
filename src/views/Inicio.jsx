import React from 'react';
import { FaHome, FaMusic, FaStore } from 'react-icons/fa';
import './Views.css';

export default function Inicio() {
  return (
    <div className="view-container">
      <div className="view-card">
        <div className="welcome-header">
          <FaStore className="welcome-icon" />
          <h1>Bienvenido a Discosca</h1>
        </div>
        <p>Tu tienda de discos y música favorita</p>
        <div className="placeholder-content">
          <div className="placeholder-icon">
            <FaMusic />
          </div>
          <p>Vista de Inicio - Próximamente contenido</p>
          <small>Página principal del catálogo de productos</small>
        </div>
      </div>
    </div>
  );
}