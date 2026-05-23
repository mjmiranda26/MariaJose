import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../../styles/componentes/comun/cuadroBusqueda.css';

export default function CuadroBusqueda({ 
  valor, 
  onChange, 
  placeholder = 'Buscar...',
  onClear,
  disabled = false,
  autoFocus = false
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className="cuadro-busqueda-wrapper">
      <FaSearch className="cuadro-busqueda-icono" />
      <input
        type="text"
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        className="cuadro-busqueda-input"
        disabled={disabled}
        autoFocus={autoFocus}
      />
      {valor && (
        <button 
          className="cuadro-busqueda-limpiar"
          onClick={handleClear}
          title="Limpiar búsqueda"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}