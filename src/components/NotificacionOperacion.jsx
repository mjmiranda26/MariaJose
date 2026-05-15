import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/NotificacionOperacion.css'

// Toast notification functions
export const mostrarExito = (mensaje) => {
  toast.success(mensaje, {
    duration: 4000,
    position: 'top-right',
    icon: '✅',
    style: {
      background: '#10b981',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
  });
};

export const mostrarError = (mensaje) => {
  toast.error(mensaje, {
    duration: 5000,
    position: 'top-right',
    icon: '❌',
    style: {
      background: '#ef4444',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
  });
};

export const mostrarInfo = (mensaje) => {
  toast(mensaje, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3b82f6',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
  });
};

export const mostrarCargando = (mensaje) => {
  return toast.loading(mensaje, {
    position: 'top-right',
    style: {
      background: '#6b7280',
      color: '#fff',
      padding: '16px',
      borderRadius: '12px',
    },
  });
};

// Toast Container Component
export default function NotificacionOperacion({ children }) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 4000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      {children}
    </>
  );
}