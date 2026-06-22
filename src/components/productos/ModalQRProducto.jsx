import React from "react";
import {
  FaTimes,
  FaDownload,
  FaCopy,
  FaLink,
  FaQrcode,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import {
  mostrarExito,
  mostrarError,
} from "../NotificacionOperacion";
import "../../styles/productos/modalQRProducto.css";

export default function ModalQRProducto({ show, onClose, producto }) {
  if (!show || !producto) return null;

  // ========= CONFIGURACIÓN ==========
  // Cambia esta IP por la IP de tu computadora
  const DEV_IP = "192.168.1.184";
  const DEV_PORT = "5173";

  const baseUrl =
    window.location.hostname === "localhost"
      ? `http://192.168.1.184`
      : window.location.origin;

  const productUrl = `${baseUrl}/producto/${producto.id}`;

  // ================================

  const handleDownloadQR = () => {
    try {
      const svg = document.getElementById("qr-code");

      if (!svg) {
        mostrarError("No se pudo generar el QR.");
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = new Image();

      const blob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = 600;
        canvas.height = 600;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const enlace = document.createElement("a");
        enlace.download = `QR-${producto.nombre}.png`;
        enlace.href = canvas.toDataURL("image/png");
        enlace.click();

        URL.revokeObjectURL(url);

        mostrarExito("QR descargado correctamente.");
      };

      img.src = url;
    } catch (error) {
      console.error(error);
      mostrarError("Error al descargar el QR.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      mostrarExito("Enlace copiado.");
    } catch {
      mostrarError("No fue posible copiar el enlace.");
    }
  };

  return (
    <div
      className="modal-overlay-qr"
      onClick={onClose}
    >
      <div
        className="modal-container-qr"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-qr">
          <h2>
            <FaQrcode />
            Código QR del Producto
          </h2>

          <button
            className="modal-close-qr"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body-qr">
          <div className="product-info-qr">
            <h3>{producto.nombre}</h3>

            <p className="product-category-qr">
              {producto.categoria}
            </p>

            <p className="product-price-qr">
              Precio: $
              {Number(producto.precio).toFixed(2)}
            </p>
          </div>

          <div className="qr-container">
            <QRCode
              id="qr-code"
              value={productUrl}
              size={250}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
            />
          </div>

          <div className="qr-info">
            <p className="qr-description">
              <FaLink />
              Escanea el código QR para abrir el producto.
            </p>

            <div className="qr-link">
              <span className="link-text">
                {productUrl}
              </span>

              <button
                className="btn-copy-link"
                onClick={handleCopyLink}
              >
                <FaCopy />
              </button>
            </div>
          </div>

          <div className="qr-actions">
            <button
              className="btn-download-qr"
              onClick={handleDownloadQR}
            >
              <FaDownload />
              Descargar QR
            </button>
          </div>
        </div>

        <div className="modal-footer-qr">
          <button
            className="btn-cancel-qr"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}