import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseconfig';
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import ModalEdicionCategoria from '../components/categorias/ModalEdicionCategoria';
import ModalEliminacionCategoria from '../components/categorias/ModalEliminacionCategoria';
import TablaCategorias from '../components/categorias/TablaCategorias';
import TarjetaCategoria from '../components/categorias/TarjetaCategoria';
import { mostrarExito, mostrarError } from '../components/NotificacionOperacion';
import { FaPlus, FaSearch, FaTimes, FaTh, FaList } from 'react-icons/fa';
import '../styles/categorias/categorias.css';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalRegistro, setShowModalRegistro] = useState(false);
  const [showModalEdicion, setShowModalEdicion] = useState(false);
  const [showModalEliminacion, setShowModalEliminacion] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState(null);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activo'
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      mostrarError('No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    });
  };

  const handleOpenModalRegistro = () => {
    resetForm();
    setShowModalRegistro(true);
  };

  const handleCloseModalRegistro = () => {
    setShowModalRegistro(false);
    resetForm();
  };

  const handleSaveCategoria = async () => {
    if (!formData.nombre.trim()) {
      mostrarError('El nombre de la categoría es requerido');
      return;
    }

    if (formData.nombre.length < 3) {
      mostrarError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setModalLoading(true);

    try {
      const { error } = await supabase
        .from('categorias')
        .insert([{
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          estado: formData.estado,
          created_at: new Date(),
          updated_at: new Date()
        }]);

      if (error) throw error;
      
      mostrarExito('Categoría registrada exitosamente');
      handleCloseModalRegistro();
      cargarCategorias();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        mostrarError('Ya existe una categoría con este nombre');
      } else {
        mostrarError('Error al guardar la categoría');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenModalEdicion = (categoria) => {
    setCategoriaToEdit(categoria);
    setShowModalEdicion(true);
  };

  const handleCloseModalEdicion = () => {
    setShowModalEdicion(false);
    setCategoriaToEdit(null);
  };

  const handleUpdateCategoria = async (formData) => {
    setModalLoading(true);

    try {
      const { error } = await supabase
        .from('categorias')
        .update({
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          estado: formData.estado,
          updated_at: new Date()
        })
        .eq('id', categoriaToEdit.id);

      if (error) throw error;
      
      mostrarExito('Categoría actualizada exitosamente');
      handleCloseModalEdicion();
      cargarCategorias();
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      
      if (error.message.includes('duplicate key') || error.message.includes('unique')) {
        mostrarError('Ya existe una categoría con este nombre');
      } else {
        mostrarError('Error al actualizar la categoría');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteFromModal = async () => {
    setModalLoading(true);

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaToEdit.id);

      if (error) throw error;

      mostrarExito('Categoría eliminada exitosamente');
      handleCloseModalEdicion();
      cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      mostrarError('Error al eliminar la categoría');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenModalEliminacion = (categoria) => {
    setCategoriaToDelete(categoria);
    setShowModalEliminacion(true);
  };

  const handleCloseModalEliminacion = () => {
    setShowModalEliminacion(false);
    setCategoriaToDelete(null);
  };

  const handleConfirmEliminacion = async () => {
    if (!categoriaToDelete) return;

    setModalLoading(true);

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', categoriaToDelete.id);

      if (error) throw error;

      mostrarExito('Categoría eliminada exitosamente');
      handleCloseModalEliminacion();
      cargarCategorias();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      mostrarError('Error al eliminar la categoría');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="categorias-view">
      <div className="categorias-view-header">
        <div className="header-info">
          <h1>Gestión de Categorías</h1>
          <p>Administra las categorías de productos</p>
        </div>
        <button 
          className="btn-primary-categoria"
          onClick={handleOpenModalRegistro}
        >
          <FaPlus className="btn-icon" />
          Nueva Categoría
        </button>
      </div>

      <div className="categorias-controls">
        <div className="search-wrapper-categoria">
          <FaSearch className="search-icon-categoria" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-categoria"
          />
          {searchTerm && (
            <button 
              className="search-clear-categoria"
              onClick={() => setSearchTerm('')}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Vista de tarjetas"
          >
            <FaTh />
          </button>
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Vista de tabla"
          >
            <FaList />
          </button>
        </div>
      </div>

      <div className="stats-categoria">
        <span>Total: {filteredCategorias.length} categorías</span>
      </div>

      {viewMode === 'table' ? (
        <TablaCategorias
          categorias={filteredCategorias}
          onEdit={handleOpenModalEdicion}
          onDelete={handleOpenModalEliminacion}
          onView={handleOpenModalEdicion}
          loading={loading}
        />
      ) : (
        <div className="categorias-grid-categoria">
          {loading ? (
            <div className="loading-state-categoria">
              <div className="spinner-categoria"></div>
              <p>Cargando categorías...</p>
            </div>
          ) : filteredCategorias.length === 0 ? (
            <div className="empty-state-categoria">
              <p>No hay categorías registradas</p>
              <button 
                className="btn-outline-categoria"
                onClick={handleOpenModalRegistro}
              >
                <FaPlus className="btn-icon" />
                Crear primera categoría
              </button>
            </div>
          ) : (
            filteredCategorias.map((categoria) => (
              <TarjetaCategoria
                key={categoria.id}
                categoria={categoria}
                onEdit={handleOpenModalEdicion}
                onDelete={handleOpenModalEliminacion}
                onView={handleOpenModalEdicion}
                variant="grid"
              />
            ))
          )}
        </div>
      )}

      <ModalRegistroCategoria
        show={showModalRegistro}
        onClose={handleCloseModalRegistro}
        onSave={handleSaveCategoria}
        formData={formData}
        onInputChange={handleInputChange}
        editingCategoria={null}
        loading={modalLoading}
      />

      <ModalEdicionCategoria
        show={showModalEdicion}
        onClose={handleCloseModalEdicion}
        onSave={handleUpdateCategoria}
        onDelete={handleDeleteFromModal}
        categoria={categoriaToEdit}
        loading={modalLoading}
      />

      <ModalEliminacionCategoria
        show={showModalEliminacion}
        onClose={handleCloseModalEliminacion}
        onConfirm={handleConfirmEliminacion}
        categoria={categoriaToDelete}
        loading={modalLoading}
      />
    </div>
  );
}