import React from 'react';
import { FaTimes, FaDownload, FaCopy, FaLink, FaQrcode } from 'react-icons/fa';
import QRCode from 'react-qr-code';
import { mostrarExito, mostrarError } from '../NotificacionOperacion';
import '../../styles/productos/modalQRProducto.css';

export default function ModalQRProducto({ show, onClose, producto }) {

  // Si no hay producto o no está visible, no renderizar
  if (!show) {
    return null;
  }

  if (!producto) {
    return null;
  }

  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/producto/${producto.id}`;

  const handleDownloadQR = () => {
    try {
      const svg = document.getElementById('qr-code');
      if (!svg) {
        mostrarError('Error al descargar el QR');
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.download = `qr-${producto.nombre}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        URL.revokeObjectURL(url);
        mostrarExito('QR descargado exitosamente');
      };
      img.onerror = () => {
        mostrarError('Error al generar la imagen del QR');
      };
      img.src = url;
    } catch (error) {
      console.error('Error en download:', error);
      mostrarError('Error al descargar el QR');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl)
      .then(() => {
        mostrarExito('¡Enlace copiado al portapapeles!');
      })
      .catch((err) => {
        console.error('Error al copiar:', err);
        mostrarError('Error al copiar el enlace');
      });
  };

  // Función para cerrar el modal
  const handleClose = () => {
    console.log('🟣 Cerrando modal QR');
    if (onClose) {
      onClose();
    }
  };

  // Manejar click en el overlay (fondo)
  const handleOverlayClick = (e) => {
    // Solo cerrar si el click fue en el overlay, no en el contenido
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Manejar click en el contenido del modal - evitar que cierre
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay-qr" onClick={handleOverlayClick}>
      <div className="modal-container-qr" onClick={handleModalClick}>
        <div className="modal-header-qr">
          <h2>
            <FaQrcode /> Código QR del Producto
          </h2>
          <button className="modal-close-qr" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body-qr">
          <div className="product-info-qr">
            <h3>{producto.nombre}</h3>
            <p className="product-category-qr">{producto.categoria}</p>
            <p className="product-price-qr">
              Precio: ${producto.precio?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className="qr-container">
            <QRCode
              id="qr-code"
              value={productUrl}
              size={250}
              bgColor="#ffffff"
              fgColor="#f3a4b5"
              level="H"
            />
          </div>

          <div className="qr-info">
            <p className="qr-description">
              <FaLink /> Escanea este código QR para ver el producto
            </p>
            <div className="qr-link">
              <span className="link-text">{productUrl}</span>
              <button className="btn-copy-link" onClick={handleCopyLink} title="Copiar enlace">
                <FaCopy />
              </button>
            </div>
          </div>

          <div className="qr-actions">
            <button className="btn-download-qr" onClick={handleDownloadQR}>
              <FaDownload /> Descargar QR
            </button>
          </div>
        </div>

        <div className="modal-footer-qr">
          <button className="btn-cancel-qr" onClick={handleClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}