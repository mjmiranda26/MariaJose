import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseconfig';
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import ModalEdicionProducto from '../components/productos/ModalEdicionProducto';
import ModalEliminacionProducto from '../components/productos/ModalEliminacionProducto';
import TablaProductos from '../components/productos/TablaProductos';
import TarjetaProducto from '../components/productos/TarjetaProducto';
import Cargando from '../components/comun/Cargando';
import CuadroBusqueda from '../components/busquedas/CuadroBusquedas';
import { mostrarExito, mostrarError } from '../components/NotificacionOperacion';
import { FaPlus, FaTh, FaList } from 'react-icons/fa';
import '../styles/productos/productos.css';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalRegistro, setShowModalRegistro] = useState(false);
  const [showModalEdicion, setShowModalEdicion] = useState(false);
  const [showModalEliminacion, setShowModalEliminacion] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState(null);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    stock: '',
  });

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, [currentPage, selectedCategory, searchTerm]);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const cargarProductos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('productos')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (selectedCategory) {
        query = query.eq('categoria', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('nombre', `%${searchTerm}%`);
      }

      // Paginación
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await query
        .order('nombre', { ascending: true })
        .range(from, to);

      if (error) throw error;
      
      setProductos(data || []);
      setTotalPages(Math.ceil(count / itemsPerPage));
    } catch (error) {
      console.error('Error:', error);
      mostrarError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      descripcion: '',
      categoria: '',
      stock: '',
    });
  };

  const handleSaveProducto = async () => {
    if (!formData.nombre.trim() || formData.nombre.length < 3) {
      mostrarError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      mostrarError('El precio debe ser mayor a 0');
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      mostrarError('El stock no puede ser negativo');
      return;
    }

    if (!formData.categoria) {
      mostrarError('Debe seleccionar una categoría');
      return;
    }

    setModalLoading(true);
    try {
      const { error } = await supabase.from('productos').insert([{
        nombre: formData.nombre.trim(),
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        stock: parseInt(formData.stock),
        created_at: new Date(),
        updated_at: new Date()
      }]);

      if (error) throw error;
      
      mostrarExito('Producto registrado exitosamente');
      setShowModalRegistro(false);
      resetForm();
      setCurrentPage(1);
      cargarProductos();
    } catch (error) {
      mostrarError(error.message.includes('duplicate') ? 'Ya existe un producto con ese nombre' : 'Error al guardar el producto');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateProducto = async (data) => {
    setModalLoading(true);
    try {
      const { error } = await supabase
        .from('productos')
        .update({ 
          ...data, 
          precio: parseFloat(data.precio),
          stock: parseInt(data.stock),
          updated_at: new Date() 
        })
        .eq('id', productoToEdit.id);

      if (error) throw error;
      
      mostrarExito('Producto actualizado exitosamente');
      setShowModalEdicion(false);
      cargarProductos();
    } catch (error) {
      mostrarError('Error al actualizar el producto');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmEliminacion = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('productos').delete().eq('id', productoToDelete.id);
      if (error) throw error;
      
      mostrarExito('Producto eliminado exitosamente');
      setShowModalEliminacion(false);
      
      // Si es la última página y no hay productos, ir a la página anterior
      if (productos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        cargarProductos();
      }
    } catch (error) {
      mostrarError('Error al eliminar el producto');
    } finally {
      setModalLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="productos-view">
      <div className="productos-view-header">
        <div className="header-info">
          <h1>Gestión de Productos</h1>
          <p>Administra el inventario de productos</p>
        </div>
        <button className="btn-primary-producto" onClick={() => setShowModalRegistro(true)}>
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      <div className="productos-controls">
        <div className="filters-section">
          <CuadroBusqueda
            valor={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setSearchTerm('');
              setCurrentPage(1);
            }}
            placeholder="Buscar productos..."
          />
          
          <select 
            className="category-filter"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        
        <div className="view-toggle">
          <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <FaTh />
          </button>
          <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
            <FaList />
          </button>
        </div>
      </div>

      <div className="stats-producto">
        <span>Total: {filteredProductos.length} productos | Página {currentPage} de {totalPages}</span>
      </div>

      {loading ? (
        <Cargando />
      ) : viewMode === 'table' ? (
        <TablaProductos
          productos={filteredProductos}
          onEdit={(p) => { setProductoToEdit(p); setShowModalEdicion(true); }}
          onDelete={(p) => { setProductoToDelete(p); setShowModalEliminacion(true); }}
          onView={(p) => { setProductoToEdit(p); setShowModalEdicion(true); }}
          loading={loading}
        />
      ) : filteredProductos.length === 0 ? (
        <div className="empty-state-producto">
          <p>No hay productos registrados</p>
          <button className="btn-outline-producto" onClick={() => setShowModalRegistro(true)}>
            <FaPlus /> Crear primer producto
          </button>
        </div>
      ) : (
        <>
          <div className="productos-grid-producto">
            {filteredProductos.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onEdit={() => { setProductoToEdit(producto); setShowModalEdicion(true); }}
                onDelete={() => { setProductoToDelete(producto); setShowModalEliminacion(true); }}
                onView={() => { setProductoToEdit(producto); setShowModalEdicion(true); }}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      <ModalRegistroProducto
        show={showModalRegistro}
        onClose={() => { setShowModalRegistro(false); resetForm(); }}
        onSave={handleSaveProducto}
        formData={formData}
        onInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        categorias={categorias}
        loading={modalLoading}
      />

      <ModalEdicionProducto
        show={showModalEdicion}
        onClose={() => setShowModalEdicion(false)}
        onSave={handleUpdateProducto}
        producto={productoToEdit}
        categorias={categorias}
        loading={modalLoading}
      />

      <ModalEliminacionProducto
        show={showModalEliminacion}
        onClose={() => setShowModalEliminacion(false)}
        onConfirm={handleConfirmEliminacion}
        producto={productoToDelete}
        loading={modalLoading}
      />
    </div>
  );
}