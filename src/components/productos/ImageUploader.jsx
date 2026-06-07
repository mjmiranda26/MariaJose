import React, { useState } from 'react';
import { supabase } from '../../database/supabaseconfig';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import '../../styles/productos/imageUploader.css';

export default function ImageUploader({ onImageUploaded, currentImage, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('La imagen no debe superar los 2MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Subir a Supabase
      const { data, error: uploadError } = await supabase.storage
        .from('productos-imagenes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('productos-imagenes')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl, filePath);
      
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setError('Error al subir la imagen. Intenta de nuevo.');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className="image-uploader">
      <div className="upload-area">
        {preview ? (
          <div className="image-preview-container">
            <img src={preview} alt="Vista previa" className="image-preview" />
            <div className="image-actions">
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={handleRemove}
                title="Eliminar imagen"
              >
                <FaTimes />
              </button>
              <label className="change-image-btn">
                <FaUpload />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="upload-placeholder">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-content">
              {uploading ? (
                <FaSpinner className="spinner" />
              ) : (
                <>
                  <FaUpload className="upload-icon" />
                  <p>Haz clic para subir una imagen</p>
                  <small>JPG, PNG o WEBP (Máx. 2MB)</small>
                </>
              )}
            </div>
          </label>
        )}
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}