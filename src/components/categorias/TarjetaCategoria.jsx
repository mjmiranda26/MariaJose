import React from 'react';
import { FaEdit, FaTrash, FaEye, FaCalendarAlt, FaTag } from 'react-icons/fa';
import '../../styles/categorias/tarjetaCategoria.css';

export default function TarjetaCategoria({
  categoria,
  onEdit,
  onDelete,
  onView,
  variant = 'grid' // 'grid' o 'list'
}) {
  const getEstadoBadgeClass = (estado) => {
    return estado === 'activo' ? 'badge-tarjeta-success' : 'badge-tarjeta-inactive';
  };

  const getEstadoTexto = (estado) => {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (variant === 'list') {
    return (
      <div className="tarjeta-categoria-list">
        <div className="tarjeta-list-content">
          <div className="list-info">
            <div className="list-header">
              <FaTag className="list-icon" />
              <h3>{categoria.nombre}</h3>
              <span className={`estado-badge-tarjeta ${getEstadoBadgeClass(categoria.estado)}`}>
                {getEstadoTexto(categoria.estado)}
              </span>
            </div>
            {categoria.descripcion && (
              <p className="list-description">{categoria.descripcion}</p>
            )}
            <div className="list-meta">
              <FaCalendarAlt className="meta-icon" />
              <span>Creado: {formatDate(categoria.created_at)}</span>
            </div>
          </div>
          <div className="list-actions">
            <button
              className="tarjeta-btn view-btn"
              onClick={() => onView(categoria)}
              title="Ver detalles"
            >
              <FaEye />
            </button>
            <button
              className="tarjeta-btn edit-btn"
              onClick={() => onEdit(categoria)}
              title="Editar"
            >
              <FaEdit />
            </button>
            <button
              className="tarjeta-btn delete-btn"
              onClick={() => onDelete(categoria)}
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Variant: grid (default)
  return (
    <div className="tarjeta-categoria">
      <div className="tarjeta-header">
        <div className="tarjeta-titulo">
          <FaTag className="tarjeta-icon" />
          <h3>{categoria.nombre}</h3>
        </div>
        <span className={`estado-badge-tarjeta ${getEstadoBadgeClass(categoria.estado)}`}>
          {getEstadoTexto(categoria.estado)}
        </span>
      </div>
      
      <div className="tarjeta-body">
        {categoria.descripcion ? (
          <p className="tarjeta-descripcion">{categoria.descripcion}</p>
        ) : (
          <p className="tarjeta-descripcion vacio">Sin descripción</p>
        )}
      </div>
      
      <div className="tarjeta-footer">
        <div className="tarjeta-fecha">
          <FaCalendarAlt className="fecha-icon" />
          <span>{formatDate(categoria.created_at)}</span>
        </div>
        <div className="tarjeta-acciones">
          <button
            className="tarjeta-btn view-btn"
            onClick={() => onView(categoria)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button
            className="tarjeta-btn edit-btn"
            onClick={() => onEdit(categoria)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="tarjeta-btn delete-btn"
            onClick={() => onDelete(categoria)}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}