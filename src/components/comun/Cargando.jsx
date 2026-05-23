import React from 'react';
import '../../styles/componentes/comun/Cargando.css';

export default function Loader({ size = 'medium', text = 'Cargando...' }) {
  const sizeClass = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  };

  return (
    <div className={`loader-container ${sizeClass[size]}`}>
      <div className="loader-spinner"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}