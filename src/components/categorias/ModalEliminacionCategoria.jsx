import React from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/categorias/modalEliminacion.css';

export default function ModalEliminacionCategoria({
  show,
  onClose,
  onConfirm,
  categoria,
  loading
}) {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-eliminacion-overlay" onClick={handleOverlayClick}>
      <div className="modal-eliminacion-container">
        <div className="modal-eliminacion-header">
          <div className="modal-eliminacion-title">
            <FaExclamationTriangle className="modal-eliminacion-icon warning" />
            <h2>Confirmar Eliminación</h2>
          </div>
          <button className="modal-eliminacion-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-eliminacion-body">
          <p>¿Estás seguro de que deseas eliminar la siguiente categoría?</p>
          <div className="categoria-info">
            <strong>{categoria?.nombre}</strong>
            {categoria?.descripcion && (
              <p className="categoria-descripcion">{categoria.descripcion}</p>
            )}
          </div>
          <p className="advertencia">
            Esta acción no se puede deshacer y podría afectar a los productos asociados.
          </p>
        </div>

        <div className="modal-eliminacion-footer">
          <button type="button" className="btn-cancel-eliminacion" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button type="button" className="btn-confirm-eliminacion" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Eliminando...
              </>
            ) : (
              <>
                <FaTrash className="btn-icon-eliminacion" />
                Sí, Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}