import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Views.css';

export default function Pagina404() {
  const navigate = useNavigate();

  return (
    <div className="view-container">
      <div className="view-card error-card">
        <div className="error-icon">🔍</div>
        <h1>404 - Página No Encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe</p>
        <div className="placeholder-content">
          <p>La ruta a la que intentas acceder no está disponible</p>
        </div>
        <button onClick={() => navigate('/inicio')} className="form-button">
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}