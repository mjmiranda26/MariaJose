import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/productos/tablaProductos.css';

export default function TablaProductos({
  productos,
  onEdit,
  onDelete,
  onView,
  loading
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="tabla-loading">
        <div className="spinner-tabla"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="tabla-empty">
        <p>No hay productos registrados</p>
      </div>
    );
  }

  return (
    <div className="tabla-container">
      <div className="tabla-responsive">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.id}>
                <td data-label="ID">{index + 1}</td>
                <td data-label="Nombre" className="nombre-columna">
                  <span className="nombre-link">{producto.nombre}</span>
                </td>
                <td data-label="Precio" className="precio-columna">
                  <span className="precio-valor">{formatPrice(producto.precio)}</span>
                </td>
                <td data-label="Stock">
                  <span className={`stock-badge ${producto.stock === 0 ? 'stock-out' : producto.stock < 5 ? 'stock-low' : 'stock-normal'}`}>
                    {producto.stock} unidades
                  </span>
                </td>
                <td data-label="Categoría">
                  <span className="categoria-badge">{producto.categoria}</span>
                </td>
                <td data-label="Descripción" className="descripcion-columna">
                  {producto.descripcion?.substring(0, 50) || '—'}
                  {producto.descripcion?.length > 50 && '...'}
                </td>
                <td data-label="Acciones">
                  <div className="acciones-buttons">
                    <button
                      className="accion-btn view-btn"
                      onClick={() => onView(producto)}
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="accion-btn edit-btn"
                      onClick={() => onEdit(producto)}
                      title="Editar producto"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="accion-btn delete-btn"
                      onClick={() => onDelete(producto)}
                      title="Eliminar producto"
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