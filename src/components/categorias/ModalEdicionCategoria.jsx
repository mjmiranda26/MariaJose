import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/categorias/modalEdicion.css';

export default function ModalEdicionCategoria({
  show,
  onClose,
  onSave,
  onDelete,
  categoria,
  loading
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  });
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (categoria && show) {
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        estado: categoria.estado || 'activo'
      });
    }
  }, [categoria, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la categoría es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder los 100 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder los 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSave) {
      await onSave(formData);
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      if (onDelete) {
        onDelete();
      }
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal-edicion-overlay" onClick={handleOverlayClick}>
      <div className="modal-edicion-container">
        <div className="modal-edicion-header">
          <div className="modal-edicion-title">
            <FaEdit className="modal-edicion-icon" />
            <h2>Editar Categoría</h2>
          </div>
          <button className="modal-edicion-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-edicion-body">
            <div className="form-group-edicion">
              <label htmlFor="nombre">
                Nombre de la categoría <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Electrónicos, Ropa, Alimentos..."
                autoComplete="off"
                className={`form-input-edicion ${errors.nombre ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.nombre && (
                <span className="error-message-edicion">{errors.nombre}</span>
              )}
              <small className="form-hint-edicion">Mínimo 3 caracteres, máximo 100</small>
            </div>

            <div className="form-group-edicion">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción opcional de la categoría..."
                rows="4"
                className={`form-textarea-edicion ${errors.descripcion ? 'error' : ''}`}
                disabled={loading}
              />
              {errors.descripcion && (
                <span className="error-message-edicion">{errors.descripcion}</span>
              )}
              <small className="form-hint-edicion">
                {formData.descripcion.length}/500 caracteres
              </small>
            </div>

            <div className="form-group-edicion">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="form-select-edicion"
                disabled={loading}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <small className="form-hint-edicion">
                Las categorías inactivas no se mostrarán en productos
              </small>
            </div>

            {showDeleteConfirm && (
              <div className="delete-confirm-edicion">
                <div className="delete-confirm-content">
                  <FaTrash className="delete-confirm-icon" />
                  <p>¿Estás seguro de eliminar esta categoría?</p>
                  <p className="delete-warning">
                    Esta acción no se puede deshacer y podría afectar a los productos asociados.
                  </p>
                  <div className="delete-confirm-buttons">
                    <button
                      type="button"
                      className="btn-cancel-delete"
                      onClick={handleCancelDelete}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-confirm-delete"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-edicion-footer">
            {!showDeleteConfirm && (
              <>
                <button
                  type="button"
                  className="btn-delete-edicion"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <FaTrash className="btn-icon-edicion" />
                  Eliminar
                </button>
                <div className="footer-actions">
                  <button
                    type="button"
                    className="btn-cancel-edicion"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-save-edicion"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-small-edicion"></div>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <FaSave className="btn-icon-edicion" />
                        Actualizar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}