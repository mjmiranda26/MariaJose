import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaSignInAlt,
  FaExchangeAlt,
  FaSpinner 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../../database/supabaseconfig';
import { mostrarExito, mostrarError, mostrarCargando } from '../NotificacionOperacion';
import '../../styles/auth/iniciarSesion.css';

export default function FormularioLogin({ onSwitchToRegistro }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['email', 'password'];
    const touchedFields = {};
    allFields.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    // Validate form
    if (!validateForm()) {
      mostrarError('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    const loadingToastId = mostrarCargando('Iniciando sesión...');

    try {
      // Login user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast.dismiss(loadingToastId);
        mostrarExito('Bienvenido de nuevo');
        setIsLoading(false);
        navigate('/inicio');
      }
    } catch (error) {
      console.error('Error:', error);
      
      toast.dismiss(loadingToastId);
      
      let errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
      
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 'Email not confirmed':
          errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión';
          break;
        default:
          errorMessage = error.message;
      }
      
      mostrarError(errorMessage);
      setIsLoading(false);
    }
  };

  const hasError = (field) => {
    return touched[field] && errors[field];
  };

  return (
    <div className="iniciar-sesion-card">
      <div className="iniciar-sesion-header">
        <FaSignInAlt className="iniciar-sesion-icon" />
        <h1>Iniciar Sesión</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="iniciar-sesion-form">
        <div className="form-group">
          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className={`form-input ${hasError('email') ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
          </div>
          {hasError('email') && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>
        
        <div className="form-group">
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={`form-input ${hasError('password') ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
          </div>
          {hasError('password') && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="form-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner-icon" />
              Ingresando...
            </>
          ) : (
            <>
              <FaSignInAlt />
              Ingresar
            </>
          )}
        </button>
      </form>
      
      <button 
        onClick={onSwitchToRegistro}
        className="switch-button"
        disabled={isLoading}
      >
        <FaExchangeAlt className="switch-icon" />
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  );
}