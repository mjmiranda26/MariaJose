import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Views.css';

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporal - solo simula login
    alert(esRegistro ? 'Registro temporal - Conecta con Supabase' : 'Login temporal - Conecta con Supabase');
    navigate('/inicio');
  };

  return (
    <div className="view-container">
      <div className="view-card login-card">
        <h1>{esRegistro ? '📝 Registrarse' : '🔐 Iniciar Sesión'}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {esRegistro && (
            <input type="text" placeholder="Nombre completo" className="form-input" />
          )}
          <input type="email" placeholder="Correo electrónico" className="form-input" />
          <input type="password" placeholder="Contraseña" className="form-input" />
          {esRegistro && (
            <input type="password" placeholder="Confirmar contraseña" className="form-input" />
          )}
          <button type="submit" className="form-button">
            {esRegistro ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>
        <button 
          onClick={() => setEsRegistro(!esRegistro)} 
          className="switch-button"
        >
          {esRegistro ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
        <div className="placeholder-content small">
          <p>⏳ Temporal - Próximamente conexión con Supabase</p>
        </div>
      </div>
    </div>
  );
}