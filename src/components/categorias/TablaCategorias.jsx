import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/categorias/tablaCategorias.css';

export default function TablaCategorias({
  categorias,
  onEdit,
  onDelete,
  onView,
  loading
}) {
  const getEstadoBadgeClass = (estado) => {
    return estado === 'activo' ? 'badge-tabla-success' : 'badge-tabla-inactive';
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

  if (loading) {
    return (
      <div className="tabla-loading">
        <div className="spinner-tabla"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="tabla-empty">
        <p>No hay categorías registradas</p>
      </div>
    );
  }

  return (
    <div className="tabla-container">
      <div className="tabla-responsive">
        <table className="tabla-categorias">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, index) => (
              <tr key={categoria.id}>
                <td data-label="ID">{index + 1}</td>
                <td data-label="Nombre" className="nombre-columna">
                  <span className="nombre-link">{categoria.nombre}</span>
                </td>
                <td data-label="Descripción" className="descripcion-columna">
                  {categoria.descripcion || '—'}
                </td>
                <td data-label="Estado">
                  <span className={`estado-badge-tabla ${getEstadoBadgeClass(categoria.estado)}`}>
                    {getEstadoTexto(categoria.estado)}
                  </span>
                </td>
                <td data-label="Fecha Creación" className="fecha-columna">
                  {formatDate(categoria.created_at)}
                </td>
                <td data-label="Acciones">
                  <div className="acciones-buttons">
                    <button
                      className="accion-btn view-btn"
                      onClick={() => onView(categoria)}
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="accion-btn edit-btn"
                      onClick={() => onEdit(categoria)}
                      title="Editar categoría"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="accion-btn delete-btn"
                      onClick={() => onDelete(categoria)}
                      title="Eliminar categoría"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}