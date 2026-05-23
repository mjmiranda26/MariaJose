import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import '../../../styles/componentes/comun/boton/boton.css';

export default function Boton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false
}) {
  const clases = `btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={clases}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <FaSpinner className="btn-spinner" />
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon className="btn-icon" />}
          {children}
        </>
      )}
    </button>
  );
}