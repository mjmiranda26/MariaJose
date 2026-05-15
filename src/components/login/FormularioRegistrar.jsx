import React, { useState } from 'react';
import { supabase } from '../../database/supabaseconfig';
import { useNotificacion } from '../NotificacionOperacion';
import styles from './FormularioRegister.module.css';

export default function FormularioRegister({ onCambiarVista }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error, warning } = useNotificacion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!nombreCompleto || !email || !password || !confirmarPassword) {
      warning('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (password !== confirmarPassword) {
      warning('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      warning('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nombreCompleto,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        success('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
        
        // Limpiar formulario
        setNombreCompleto('');
        setEmail('');
        setPassword('');
        setConfirmarPassword('');
        
        // Cambiar a login después de 3 segundos
        setTimeout(() => {
          onCambiarVista();
        }, 3000);
      }
    } catch (error) {
      if (error.message.includes('User already registered')) {
        error('Este correo ya está registrado');
      } else {
        error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>👤</span>
          Nombre completo
        </label>
        <input
          type="text"
          className={styles.input}
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          placeholder="María José Pérez"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>📧</span>
          Correo electrónico
        </label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>🔒</span>
          Contraseña
        </label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <span className={styles.labelIcon}>✓</span>
          Confirmar contraseña
        </label>
        <input
          type="password"
          className={styles.input}
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          placeholder="Repite tu contraseña"
          required
        />
      </div>

      <button 
        type="submit" 
        className={styles.button}
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <div className={styles.footer}>
        <p className={styles.text}>
          ¿Ya tienes cuenta?{' '}
          <button 
            type="button"
            onClick={onCambiarVista}
            className={styles.link}
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </form>
  );
}