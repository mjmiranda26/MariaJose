import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import '../../styles/productos/modalProducto.css';

export default function ModalEdicionProducto({ 
  show, 
  onClose, 
  onSave, 
  producto,
  categorias,
  loading 
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria_id: '',
    stock: '',
    imagen_url: '',
    imagen_path: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        precio: producto.precio || '',
        descripcion: producto.descripcion || '',
        categoria_id: producto.categoria_id || '',
        stock: producto.stock || '',
        imagen_url: producto.imagen_url || '',
        imagen_path: producto.imagen_path || ''
      });
    }
  }, [producto]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (imageUrl, imagePath) => {
    setFormData({
      ...formData,
      imagen_url: imageUrl,
      imagen_path: imagePath
    });
  };

  const handleRemoveImage = async () => {
    // Eliminar imagen de Storage si existe
    if (formData.imagen_path) {
      await supabase.storage
        .from('productos-imagenes')
        .remove([formData.imagen_path]);
    }
    
    setFormData({
      ...formData,
      imagen_url: null,
      imagen_path: null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Producto</h2>
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
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="precio">Precio *</label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
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
                  value={formData.stock}
                  onChange={handleInputChange}
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
                value={formData.categoria_id}
                onChange={handleInputChange}
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
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Actualizando...' : <><FaSave /> Actualizar</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}