import React, { useState } from 'react';
import FormularioLogin from '../components/auth/FormularioLogin';
import FormularioRegistro from '../components/auth/FormularioRegistrar';
import '../styles/auth/authPagina.css';

export default function AutenticacionPagina() {
  const [mostrarLogin, setMostrarLogin] = useState(true);

  const handleSwitchToRegistro = () => {
    setMostrarLogin(false);
  };

  const handleSwitchToLogin = () => {
    setMostrarLogin(true);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-container">
        {mostrarLogin ? (
          <FormularioLogin onSwitchToRegistro={handleSwitchToRegistro} />
        ) : (
          <FormularioRegistro onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    </div>
  );
}