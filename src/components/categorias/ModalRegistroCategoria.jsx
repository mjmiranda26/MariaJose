import React from 'react';
import { FaTimes, FaSave, FaEdit } from 'react-icons/fa';
import '../../styles/categorias/modalRegistro.css';

export default function ModalRegistroCategoria({
  show,
  onClose,
  onSave,
  formData,
  onInputChange,
  editingCategoria,
  loading
}) {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal-registro-overlay" onClick={handleOverlayClick}>
      <div className="modal-registro-container">
        <div className="modal-registro-header">
          <div className="modal-registro-title">
            {editingCategoria ? (
              <>
                <FaEdit className="modal-registro-icon" />
                <h2>Editar Categoría</h2>
              </>
            ) : (
              <>
                <FaSave className="modal-registro-icon" />
                <h2>Nueva Categoría</h2>
              </>
            )}
          </div>
          <button className="modal-registro-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-registro-body">
            <div className="form-group-registro">
              <label htmlFor="nombre">
                Nombre de la categoría <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                placeholder="Ej: Electrónicos, Ropa, Alimentos..."
                autoComplete="off"
                className="form-input-registro"
                disabled={loading}
              />
              <small className="form-hint-registro">Mínimo 3 caracteres</small>
            </div>

            <div className="form-group-registro">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={onInputChange}
                placeholder="Descripción opcional de la categoría..."
                rows="3"
                className="form-textarea-registro"
                disabled={loading}
              />
            </div>

            <div className="form-group-registro">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={onInputChange}
                className="form-select-registro"
                disabled={loading}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-registro-footer">
            <button type="button" className="btn-cancel-registro" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save-registro" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  {editingCategoria ? 'Actualizando...' : 'Guardando...'}
                </>
              ) : (
                <>
                  <FaSave className="btn-icon-registro" />
                  {editingCategoria ? 'Actualizar' : 'Guardar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}