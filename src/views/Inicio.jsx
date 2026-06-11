import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../database/supabaseconfig';
import { 
  FaShoppingCart, 
  FaTruck, 
  FaCreditCard, 
  FaShieldAlt, 
  FaHeadphones,
  FaArrowRight,
  FaStar,
  FaStarHalfAlt,
  FaPlay,
  FaGem,
  FaTint,
  FaGift,
  FaLeaf,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaHeart
} from 'react-icons/fa';
import '../styles/secciones/inicio.css';

export default function Inicio() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductosDestacados();
    cargarCategorias();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          categorias!categoria_id (
            id,
            nombre,
            descripcion
          )
        `)
        .limit(6);

      if (error) throw error;
      
      const productosConCategoria = data.map(producto => ({
        ...producto,
        categoria_nombre: producto.categorias?.nombre || 'Sin categoría'
      }));
      
      setProductosDestacados(productosConCategoria);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('estado', 'activo')
        .limit(3);

      if (error) throw error;
      setCategorias(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getCategoryIcon = (categoriaNombre) => {
    if (categoriaNombre === 'Perfumes') return <FaGem />;
    if (categoriaNombre === 'Aguas Corporales') return <FaTint />;
    if (categoriaNombre === 'Sets y Regalos') return <FaGift />;
    return <FaLeaf />;
  };

  const renderRating = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className="star-filled-small" />);
    }
    return stars;
  };

  return (
    <div className="inicio-container">
      {/* Hero Section */}
      <section className="hero-section-inicio">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content-inicio">
          <div className="hero-badge">Bienvenidos a Mache Store</div>
          <h1 className="hero-title-inicio">
            Descubre tu <span className="highlight">Fragrancia</span> Perfecta
          </h1>
          <p className="hero-description-inicio">
            Encuentra los mejores perfumes y aguas corporales de las marcas más exclusivas. 
            Calidad premium con los mejores precios del mercado.
          </p>
          <div className="hero-buttons">
            <Link to="/catalogo" className="btn-primary-inicio">
              Comprar Ahora <FaArrowRight />
            </Link>
            <button className="btn-secondary-inicio">
              <FaPlay /> Ver Catálogo
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Clientes Felices</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Fragancias</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Marcas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Categorías</span>
            <h2 className="section-title">Explora por Categoría</h2>
            <p className="section-subtitle">Encuentra la fragancia perfecta para cada ocasión</p>
          </div>
          <div className="categories-grid">
            {categorias.map((categoria, index) => (
              <Link to="/catalogo" key={categoria.id} className="category-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="category-icon">
                  {getCategoryIcon(categoria.nombre)}
                </div>
                <h3 className="category-name">{categoria.nombre}</h3>
                <p className="category-description">{categoria.descripcion}</p>
                <span className="category-link">Explorar <FaArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Lo Más Vendido</span>
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Las fragancias que todos aman</p>
          </div>
          <div className="featured-grid">
            {productosDestacados.map((producto, index) => (
              <div key={producto.id} className="product-card-inicio" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="product-badge-inicio">
                  {producto.stock === 0 ? 'Agotado' : 'En Stock'}
                </div>
                <div className="product-image-inicio">
                  {producto.imagen_url ? (
                    <img src={producto.imagen_url} alt={producto.nombre} />
                  ) : (
                    <div className="image-placeholder-inicio">
                      {getCategoryIcon(producto.categoria_nombre)}
                    </div>
                  )}
                </div>
                <div className="product-info-inicio">
                  <h3 className="product-title-inicio">{producto.nombre}</h3>
                  <div className="product-rating-inicio">
                    {renderRating()}
                    <span className="rating-count">(128 reseñas)</span>
                  </div>
                  <p className="product-description-inicio">
                    {producto.descripcion?.substring(0, 60)}...
                  </p>
                  <div className="product-price-inicio">
                    <span className="price">{formatPrice(producto.precio)}</span>
                    <button className="add-to-cart-btn" disabled={producto.stock === 0}>
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="featured-footer">
            <Link to="/catalogo" className="btn-outline-inicio">
              Ver Todos los Productos <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Ventajas</span>
            <h2 className="section-title">¿Por qué elegir Mache Store?</h2>
            <p className="section-subtitle">Experiencia de compra única y garantizada</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaTruck />
              </div>
              <h3>Envío Gratis</h3>
              <p>En compras superiores a $1,000 MXN en todo México</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaShieldAlt />
              </div>
              <h3>Productos Originales</h3>
              <p>100% autenticidad garantizada</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaCreditCard />
              </div>
              <h3>Pago Seguro</h3>
              <p>Múltiples métodos de pago</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaHeadphones />
              </div>
              <h3>Soporte 24/7</h3>
              <p>Atención al cliente personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-icon">
            <FaHeart />
          </div>
          <h2>Suscríbete a nuestro Newsletter</h2>
          <p>Recibe ofertas exclusivas y novedades directamente en tu correo</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Tu correo electrónico" />
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-subtitle">Opiniones reales de nuestros clientes</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "Excelente servicio, los productos llegaron antes de lo esperado y en perfectas condiciones. Definitivamente volveré a comprar."
              </p>
              <div className="testimonial-author">
                <strong>María González</strong>
                <span>Cliente Verificada</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "La calidad de los perfumes es increíble. El empaque es muy cuidado y el envío fue rápido. Muy recomendados."
              </p>
              <div className="testimonial-author">
                <strong>Carlos Rodríguez</strong>
                <span>Cliente Verificada</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "Me encanta la variedad de productos que ofrecen. Encontré mi perfume favorito a un excelente precio."
              </p>
              <div className="testimonial-author">
                <strong>Ana Martínez</strong>
                <span>Cliente Verificada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Social Links */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>Mache Store</h2>
              <p>Tu destino para encontrar la fragancia perfecta</p>
              <div className="social-links">
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaFacebook /></a>
                <a href="#"><FaTwitter /></a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Sobre Nosotros</h4>
                <ul>
                  <li><a href="#">Nuestra Historia</a></li>
                  <li><a href="#">Políticas</a></li>
                  <li><a href="#">Términos y Condiciones</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Atención al Cliente</h4>
                <ul>
                  <li><a href="#">Contacto</a></li>
                  <li><a href="#">Preguntas Frecuentes</a></li>
                  <li><a href="#">Devoluciones</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Mi Cuenta</h4>
                <ul>
                  <li><a href="#">Mis Pedidos</a></li>
                  <li><a href="#">Lista de Deseos</a></li>
                  <li><a href="#">Newsletter</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Mache Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}