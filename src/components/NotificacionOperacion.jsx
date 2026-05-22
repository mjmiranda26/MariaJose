import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import '../styles/NotificacionOperacion.css';

// Toast notification functions
export const mostrarExito = (mensaje) => {
  toast.success(mensaje, {
    duration: 4000,
    position: 'top-right',
    icon: <FaCheckCircle />,
    style: {
      background: 'var(--color-success)',
      color: 'var(--color-white)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
    },
  });
};

export const mostrarError = (mensaje) => {
  toast.error(mensaje, {
    duration: 5000,
    position: 'top-right',
    icon: <FaExclamationCircle />,
    style: {
      background: 'var(--color-error)',
      color: 'var(--color-white)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
    },
  });
};

export const mostrarInfo = (mensaje) => {
  toast(mensaje, {
    duration: 3000,
    position: 'top-right',
    icon: <FaInfoCircle />,
    style: {
      background: 'var(--color-info)',
      color: 'var(--color-white)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
    },
  });
};

export const mostrarCargando = (mensaje) => {
  return toast.loading(mensaje, {
    position: 'top-right',
    icon: <FaSpinner />,
    style: {
      background: 'var(--color-gray-600)',
      color: 'var(--color-white)',
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
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
              background: 'var(--color-success)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: 'var(--color-error)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
            },
          },
          loading: {
            style: {
              background: 'var(--color-gray-600)',
              color: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
            },
          },
        }}
      />
      {children}
    </>
  );
}