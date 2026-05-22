import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaSignInAlt, 
  FaUserPlus,
  FaExchangeAlt,
  FaSpinner 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../database/supabaseconfig';
import { mostrarExito, mostrarError, mostrarCargando } from '../components/NotificacionOperacion';
import '../styles/auth/iniciarSesion.css';
import '../styles/auth/registrarFormulario.css';

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData, esRegistro]);

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

    // Additional validations for registration
    if (esRegistro) {
      if (!formData.nombre) {
        newErrors.nombre = 'El nombre completo es requerido';
      } else if (formData.nombre.length < 3) {
        newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
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
    const allFields = esRegistro 
      ? ['nombre', 'email', 'password', 'confirmPassword']
      : ['email', 'password'];
    
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
    const loadingToastId = mostrarCargando(esRegistro ? 'Registrando usuario...' : 'Iniciando sesión...');

    try {
      if (esRegistro) {
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
          setEsRegistro(false);
          setFormData({
            nombre: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          setIsLoading(false);
        }
      } else {
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
      }
    } catch (error) {
      console.error('Error:', error);
      
      toast.dismiss(loadingToastId);
      
      let errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
      
      switch (error.message) {
        case 'Invalid login credentials':
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 'User already registered':
          errorMessage = 'Este correo ya está registrado';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres';
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
    <div className="auth-wrapper">
      <div className="auth-container">
        {esRegistro ? (
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
              onClick={() => {
                setEsRegistro(false);
                setErrors({});
                setTouched({});
                setFormData({
                  nombre: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }} 
              className="switch-button"
              disabled={isLoading}
            >
              <FaExchangeAlt className="switch-icon" />
              ¿Ya tienes cuenta? Inicia Sesión
            </button>
          </div>
        ) : (
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
              onClick={() => {
                setEsRegistro(true);
                setErrors({});
                setTouched({});
                setFormData({
                  nombre: '',
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }} 
              className="switch-button"
              disabled={isLoading}
            >
              <FaExchangeAlt className="switch-icon" />
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}