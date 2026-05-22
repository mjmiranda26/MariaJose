import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaUserPlus,
  FaExchangeAlt,
  FaSpinner 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../../database/supabaseconfig';
import { mostrarExito, mostrarError, mostrarCargando } from '../NotificacionOperacion';
import '../../styles/auth/registrarFormulario.css';

export default function FormularioRegistro({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    // Nombre validation
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre completo es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

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

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    const allFields = ['nombre', 'email', 'password', 'confirmPassword'];
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
    const loadingToastId = mostrarCargando('Registrando usuario...');

    try {
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombre,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast.dismiss(loadingToastId);
        
        // Create user profile in a custom table (optional)
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                full_name: formData.nombre,
                email: formData.email,
                created_at: new Date(),
              }
            ]);

          if (profileError && profileError.code !== '42P01') {
            console.error('Error creating profile:', profileError);
          }
        } catch (profileErr) {
          console.log('Profile table not found, skipping');
        }

        mostrarExito('Registro exitoso. Por favor, verifica tu correo electrónico');
        
        // Reset form and switch to login
        setFormData({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
        setTouched({});
        setIsLoading(false);
        
        // Switch to login after successful registration
        onSwitchToLogin();
      }
    } catch (error) {
      console.error('Error:', error);
      
      toast.dismiss(loadingToastId);
      
      let errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'Este correo ya está registrado';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
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
    <div className="registrar-card">
      <div className="registrar-header">
        <FaUserPlus className="registrar-icon" />
        <h1>Registrarse</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="registrar-form">
        <div className="form-group">
          <div className="input-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className={`form-input ${hasError('nombre') ? 'error' : ''}`}
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
          </div>
          {hasError('nombre') && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </div>
        
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
        
        <div className="form-group">
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              className={`form-input ${hasError('confirmPassword') ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
            />
          </div>
          {hasError('confirmPassword') && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>
        
        <div className="terminos-container">
          <p className="terminos-text">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="terminos-link">Términos y Condiciones</a>
          </p>
        </div>
        
        <button 
          type="submit" 
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner-icon" />
              Registrando...
            </>
          ) : (
            <>
              <FaUserPlus />
              Registrarse
            </>
          )}
        </button>
      </form>
      
      <button 
        onClick={onSwitchToLogin}
        className="switch-button"
        disabled={isLoading}
      >
        <FaExchangeAlt className="switch-icon" />
        ¿Ya tienes cuenta? Inicia Sesión
      </button>
    </div>
  );
}