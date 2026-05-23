import React from 'react';
import '../../../styles/componentes/comun/boton/boton.css';

export default function EnlaceBoton({ children, onClick, icon: Icon, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-link"
      disabled={disabled}
    >
      {Icon && <Icon className="btn-icon" />}
      {children}
    </button>
  );
}