
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../database/supabaseconfig';
import Cargando from '../components/comun/Cargando'; 
import { FaArrowLeft, FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import '../styles/productos/productoDetalle.css';

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    setLoading(true);
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
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const productoConCategoria = {
        ...data,
        categoria: data.categorias?.nombre || 'Sin categoría'
      };
      
      setProducto(productoConCategoria);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) return <Cargando />;
  if (error) return <div className="error-container">{error}</div>;
  if (!producto) return <div className="error-container">Producto no encontrado</div>;

  return (
    <div className="producto-detalle-container">
      <Link to="/catalogo" className="btn-back">
        <FaArrowLeft /> Volver al catálogo
      </Link>

      <div className="producto-detalle-card">
        <div className="producto-detalle-imagen">
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} />
          ) : (
            <div className="imagen-placeholder-detalle">
              <span>📦</span>
            </div>
          )}
        </div>

        <div className="producto-detalle-info">
          <div className="producto-badge">
            {producto.stock === 0 ? 'Agotado' : 'En stock'}
          </div>
          
          <h1 className="producto-titulo">{producto.nombre}</h1>
          <p className="producto-categoria-detalle">{producto.categoria}</p>
          
          <div className="producto-precio-detalle">
            <span className="precio-detalle">{formatPrice(producto.precio)}</span>
          </div>

          <div className="producto-stock-detalle">
            <span className="stock-label">Stock disponible:</span>
            <span className="stock-cantidad">{producto.stock} unidades</span>
          </div>

          <div className="producto-descripcion-detalle">
            <h3>Descripción</h3>
            <p>{producto.descripcion || 'Sin descripción disponible'}</p>
          </div>

          <div className="producto-acciones-detalle">
            <button 
              className="btn-comprar"
              disabled={producto.stock === 0}
            >
              <FaShoppingCart /> Comprar ahora
            </button>
            <button className="btn-favorito">
              <FaHeart /> Agregar a favoritos
            </button>
            <button 
              className="btn-compartir"
              onClick={() => {
                navigator.share({
                  title: producto.nombre,
                  text: `Mira este producto: ${producto.nombre}`,
                  url: window.location.href
                }).catch(() => {});
              }}
            >
              <FaShare /> Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}