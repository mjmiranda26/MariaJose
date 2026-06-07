import React from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/productos/modalProducto.css';

export default function ModalEliminacionProducto({ 
  show, 
  onClose, 
  onConfirm, 
  producto,
  loading 
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Eliminar Producto</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">
            <FaExclamationTriangle />
          </div>
          <p className="warning-text">
            ¿Estás seguro de que deseas eliminar el producto <strong>"{producto?.nombre}"</strong>?
          </p>
          <p className="warning-subtext">Esta acción no se puede deshacer.</p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn-danger" 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : <><FaTrash /> Sí, Eliminar</>}
          </button>
        </div>
      </div>
    </div>
  );
}