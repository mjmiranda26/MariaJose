import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/assets/logo.jpg";
import { supabase } from "../../database/supabaseconfig";
import styles from "./Encabezado.module.css";

export default function Encabezado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [esLogin, setEsLogin] = useState(false);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setEsLogin(!!session);
  };

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const manejarCerrarSesion = async () => {
    await supabase.auth.signOut();
    setEsLogin(false);
    navigate("/login");
    setMostrarMenu(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo */}
          <div 
            className={styles.logo}
            onClick={() => manejarNavegacion("/inicio")}
          >
            <img src={logo} alt="Discosca" className={styles.logoImg} />
            <span className={styles.logoText}>Discosca</span>
          </div>

          {/* Desktop Menu */}
          <nav className={styles.navDesktop}>
            {!esLogin ? (
              <>
                <button onClick={() => manejarNavegacion("/inicio")} className={styles.link}>
                  Inicio
                </button>
                <button onClick={() => manejarNavegacion("/login")} className={styles.link}>
                  Iniciar Sesión
                </button>
                <button onClick={() => manejarNavegacion("/register")} className={styles.link}>
                  Registrarse
                </button>
                <button onClick={() => manejarNavegacion("/about")} className={styles.link}>
                  Acerca de Nosotros
                </button>
              </>
            ) : (
              <>
                <button onClick={() => manejarNavegacion("/inicio")} className={styles.link}>
                  Inicio
                </button>
                <button onClick={() => manejarNavegacion("/catalogo")} className={styles.link}>
                  Catálogo
                </button>
                <button onClick={() => manejarNavegacion("/productos")} className={styles.link}>
                  Productos
                </button>
                <button onClick={() => manejarNavegacion("/categorias")} className={styles.link}>
                  Categorías
                </button>
                <button onClick={() => manejarNavegacion("/about")} className={styles.link}>
                  Acerca de
                </button>
                <button onClick={manejarCerrarSesion} className={`${styles.link} ${styles.logout}`}>
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileBtn}
            onClick={() => setMostrarMenu(!mostrarMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mostrarMenu ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileHeader}>
          <span className={styles.mobileTitle}>Discosca</span>
          <button 
            className={styles.mobileClose}
            onClick={() => setMostrarMenu(false)}
          >
            ✕
          </button>
        </div>
        <div className={styles.mobileBody}>
          {!esLogin ? (
            <>
              <button onClick={() => manejarNavegacion("/inicio")} className={styles.mobileLink}>
                Inicio
              </button>
              <button onClick={() => manejarNavegacion("/login")} className={styles.mobileLink}>
                Iniciar Sesión
              </button>
              <button onClick={() => manejarNavegacion("/register")} className={styles.mobileLink}>
                Registrarse
              </button>
              <button onClick={() => manejarNavegacion("/about")} className={styles.mobileLink}>
                Acerca de
              </button>
            </>
          ) : (
            <>
              <button onClick={() => manejarNavegacion("/inicio")} className={styles.mobileLink}>
                Inicio
              </button>
              <button onClick={() => manejarNavegacion("/catalogo")} className={styles.mobileLink}>
                Catálogo
              </button>
              <button onClick={() => manejarNavegacion("/productos")} className={styles.mobileLink}>
                Productos
              </button>
              <button onClick={() => manejarNavegacion("/categorias")} className={styles.mobileLink}>
                Categorías
              </button>
              <button onClick={() => manejarNavegacion("/about")} className={styles.mobileLink}>
                Acerca de
              </button>
              <button onClick={manejarCerrarSesion} className={`${styles.mobileLink} ${styles.mobileLogout}`}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {mostrarMenu && (
        <div 
          className={styles.overlay}
          onClick={() => setMostrarMenu(false)}
        ></div>
      )}
    </>
  );
}