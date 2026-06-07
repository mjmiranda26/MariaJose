import React from 'react';
import { FaEdit, FaTrash, FaEye, FaBox, FaMoneyBill, FaTags } from 'react-icons/fa';
import '../../styles/productos/tarjetaProducto.css';

export default function TarjetaProducto({
  producto,
  onEdit,
  onDelete,
  onView
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getStockClass = (stock) => {
    if (stock === 0) return 'stock-out';
    if (stock < 5) return 'stock-low';
    return 'stock-normal';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Agotado';
    if (stock < 5) return 'Stock bajo';
    return `${stock} unidades`;
  };

  return (
    <div className="tarjeta-producto">
      <div className="tarjeta-header">
        <div className="tarjeta-titulo">
          <FaBox className="tarjeta-icon" />
          <h3>{producto.nombre}</h3>
        </div>
        <span className={`stock-badge-tarjeta ${getStockClass(producto.stock)}`}>
          {getStockText(producto.stock)}
        </span>
      </div>
      
      <div className="tarjeta-body">
        <div className="producto-precio">
          <FaMoneyBill className="precio-icon" />
          <span className="precio-valor">{formatPrice(producto.precio)}</span>
        </div>
        
        <div className="producto-categoria">
          <FaTags className="categoria-icon" />
          <span>{producto.categoria}</span>
        </div>
        
        {producto.descripcion && (
          <p className="tarjeta-descripcion">
            {producto.descripcion.length > 100 
              ? `${producto.descripcion.substring(0, 100)}...` 
              : producto.descripcion}
          </p>
        )}
      </div>
      
      <div className="tarjeta-footer">
        <div className="tarjeta-acciones">
          <button
            className="tarjeta-btn view-btn"
            onClick={() => onView(producto)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button
            className="tarjeta-btn edit-btn"
            onClick={() => onEdit(producto)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="tarjeta-btn delete-btn"
            onClick={() => onDelete(producto)}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}