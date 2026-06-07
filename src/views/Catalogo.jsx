import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseconfig';
import Cargando from '../components/comun/Cargando';
import { 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaShoppingCart, 
  FaHeart, 
  FaStar, 
  FaStarHalfAlt,
  FaMusic,
  FaHeadphones,
  FaCompactDisc,
  FaGuitar
} from 'react-icons/fa';
import '../styles/catalogo/catalogo.css';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('nombre');
  const [showFilters, setShowFilters] = useState(false);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
    cargarFavoritos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('productos')
        .select(`
          *,
          categorias!categoria_id (
            id,
            nombre,
            descripcion
          )
        `);

      const { data, error } = await query;
      
      if (error) throw error;
      
      const productosFormateados = data.map(producto => ({
        ...producto,
        categoria_nombre: producto.categorias?.nombre || 'Sin categoría',
        rating: Math.random() * 2 + 3,
        reviews: Math.floor(Math.random() * 500) + 10
      }));
      
      setProductos(productosFormateados || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarFavoritos = () => {
    const saved = localStorage.getItem('favoritos');
    if (saved) {
      setFavoritos(JSON.parse(saved));
    }
  };

  const toggleFavorito = (productoId) => {
    let nuevosFavoritos;
    if (favoritos.includes(productoId)) {
      nuevosFavoritos = favoritos.filter(id => id !== productoId);
    } else {
      nuevosFavoritos = [...favoritos, productoId];
    }
    setFavoritos(nuevosFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getCategoryIcon = (categoriaNombre) => {
    if (categoriaNombre.includes('Vinilo') || categoriaNombre.includes('CD')) {
      return <FaCompactDisc />;
    }
    if (categoriaNombre.includes('Audio') || categoriaNombre.includes('Sonido')) {
      return <FaHeadphones />;
    }
    if (categoriaNombre.includes('Instrumento')) {
      return <FaGuitar />;
    }
    return <FaMusic />;
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star-empty" />);
    }
    return stars;
  };

  const productosFiltrados = productos
    .filter(producto => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || producto.categoria_id === parseInt(selectedCategory);
      const matchesPrice = producto.precio >= priceRange.min && producto.precio <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'precio_asc') return a.precio - b.precio;
      if (sortBy === 'precio_desc') return b.precio - a.precio;
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const categoriasUnicas = [...new Map(categorias.map(cat => [cat.id, cat])).values()];

  return (
    <div className="catalogo-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Tu Música, Tu Estilo</h1>
          <p className="hero-subtitle">Descubre los mejores productos musicales al mejor precio</p>
          <div className="hero-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Busca tu producto favorito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
          </div>
        </div>
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filters-container">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filtros
          </button>
          
          <div className="sort-section">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="nombre">Nombre</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificados</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel animate-slideDown">
            <div className="filter-group">
              <h4>Categorías</h4>
              <div className="category-chips">
                <button
                  className={`chip ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  Todas
                </button>
                {categoriasUnicas.map(cat => (
                  <button
                    key={cat.id}
                    className={`chip ${selectedCategory === cat.id.toString() ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id.toString())}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Rango de Precio</h4>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Stats */}
      <div className="results-stats">
        <p>Encontramos {productosFiltrados.length} productos para ti</p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <Cargando />
      ) : (
        <div className="products-grid-catalogo">
          {productosFiltrados.map((producto, index) => (
            <div key={producto.id} className="product-card-catalogo animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="product-badge">
                {producto.stock === 0 ? 'Agotado' : producto.stock < 5 ? 'Últimas unidades' : 'En stock'}
              </div>
              
              <button
                className={`favorite-btn ${favoritos.includes(producto.id) ? 'active' : ''}`}
                onClick={() => toggleFavorito(producto.id)}
              >
                <FaHeart />
              </button>

              <div className="product-image">
                <div className="image-placeholder">
                  {getCategoryIcon(producto.categoria_nombre)}
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-title">{producto.nombre}</h3>
                <p className="product-category">{producto.categoria_nombre}</p>
                
                <div className="product-rating">
                  {renderRating(producto.rating)}
                  <span className="rating-count">({producto.reviews})</span>
                </div>

                <p className="product-description">
                  {producto.descripcion?.substring(0, 80)}
                  {producto.descripcion?.length > 80 && '...'}
                </p>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="price">{formatPrice(producto.precio)}</span>
                    {producto.stock > 0 && (
                      <span className="stock-info">Stock disponible</span>
                    )}
                  </div>
                  
                  <button 
                    className="add-to-cart"
                    disabled={producto.stock === 0}
                    onClick={() => alert(`Agregaste ${producto.nombre} al carrito`)}
                  >
                    <FaShoppingCart /> Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && productosFiltrados.length === 0 && (
        <div className="empty-state-catalogo">
          <p>No encontramos productos que coincidan con tu búsqueda</p>
          <button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('');
            setPriceRange({ min: 0, max: 5000 });
          }}>
            <FaTimes /> Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}