import React, { useState } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import '../../styles/productos/modalProducto.css';

export default function ModalRegistroProducto({ 
  show, 
  onClose, 
  onSave, 
  formData, 
  onInputChange,
  onImageChange,
  categorias,
  loading 
}) {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const handleImageUpload = (imageUrl, imagePath) => {
    onImageChange(imageUrl, imagePath);
  };

  const handleRemoveImage = () => {
    onImageChange(null, null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nuevo Producto</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre || ''}
                onChange={onInputChange}
                placeholder="Ej: Guitarra Acústica Yamaha"
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio || ''}
                  onChange={onInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock || ''}
                  onChange={onInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoria_id">Categoría *</label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formData.categoria_id || ''}
                onChange={onInputChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Imagen del Producto</label>
              <ImageUploader
                onImageUploaded={handleImageUpload}
                currentImage={formData.imagen_url}
                onRemove={handleRemoveImage}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={onInputChange}
                placeholder="Descripción detallada del producto..."
                rows="4"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Guardando...' : <><FaSave /> Guardar Producto</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}