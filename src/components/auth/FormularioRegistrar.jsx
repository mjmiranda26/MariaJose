import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaUser, FaUserPlus, FaExchangeAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../../database/supabaseconfig';
import { mostrarExito, mostrarError, mostrarCargando } from '../NotificacionOperacion';
import Input from '../comun/inputs/Input';
import Boton from '../comun/boton/Boton';
import EnlaceBoton from '../comun/boton/EnlaceBoton';
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

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre completo es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

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
    
    const allFields = ['nombre', 'email', 'password', 'confirmPassword'];
    const touchedFields = {};
    allFields.forEach(field => { touchedFields[field] = true; });
    setTouched(touchedFields);

    if (!validateForm()) {
      mostrarError('Por favor, corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);
    const loadingToastId = mostrarCargando('Registrando usuario...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.nombre } }
      });

      if (error) throw error;

      if (data.user) {
        toast.dismiss(loadingToastId);
        
        try {
          await supabase.from('profiles').insert([{
            id: data.user.id,
            full_name: formData.nombre,
            email: formData.email,
            created_at: new Date(),
          }]);
        } catch (profileErr) {
          console.log('Profile table not found, skipping');
        }

        mostrarExito('Registro exitoso. Por favor, verifica tu correo electrónico');
        setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
        setErrors({});
        setTouched({});
        setIsLoading(false);
        onSwitchToLogin();
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      let errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
      if (error.message === 'User already registered') {
        errorMessage = 'Este correo ya está registrado';
      } else if (error.message === 'Password should be at least 6 characters') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      }
      mostrarError(errorMessage);
      setIsLoading(false);
    }
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <div className="registrar-card">
      <div className="registrar-header">
        <FaUserPlus className="registrar-icon" />
        <h1>Registrarse</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="registrar-form">
        <Input
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nombre completo"
          icon={FaUser}
          error={hasError('nombre') ? errors.nombre : null}
          disabled={isLoading}
        />
        
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Correo electrónico"
          icon={FaEnvelope}
          error={hasError('email') ? errors.email : null}
          disabled={isLoading}
        />
        
        <Input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Contraseña"
          icon={FaLock}
          error={hasError('password') ? errors.password : null}
          disabled={isLoading}
        />
        
        <Input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirmar contraseña"
          icon={FaLock}
          error={hasError('confirmPassword') ? errors.confirmPassword : null}
          disabled={isLoading}
        />
        
        <div className="terminos-container">
          <p className="terminos-text">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="terminos-link">Términos y Condiciones</a>
          </p>
        </div>
        
        <Boton
          type="submit"
          variant="primary"
          icon={FaUserPlus}
          loading={isLoading}
          fullWidth
        >
          Registrarse
        </Boton>
      </form>
      
      <EnlaceBoton onClick={onSwitchToLogin} icon={FaExchangeAlt} disabled={isLoading}>
        ¿Ya tienes cuenta? Inicia Sesión
      </EnlaceBoton>
    </div>
  );
}