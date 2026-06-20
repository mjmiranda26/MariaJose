import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseconfig';
import ModalRegistroCategoria from '../components/categorias/ModalRegistroCategoria';
import ModalEdicionCategoria from '../components/categorias/ModalEdicionCategoria';
import ModalEliminacionCategoria from '../components/categorias/ModalEliminacionCategoria';
import TablaCategorias from '../components/categorias/TablaCategorias';
import TarjetaCategoria from '../components/categorias/TarjetaCategoria';
import Cargando from '../components/comun/Cargando';
import CuadroBusqueda from '../components/busquedas/CuadroBusquedas';
import { mostrarExito, mostrarError } from '../components/NotificacionOperacion';
import { FaPlus, FaTh, FaList } from 'react-icons/fa';
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
      console.error('Error:', error);
      mostrarError('No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'activo'
    });
  };

  // Función para copiar categoría
  const copiarCategoria = (categoria) => {
    const texto = `ID: ${categoria.id}\nNombre: ${categoria.nombre}\nDescripción: ${categoria.descripcion || 'Sin descripción'}\nEstado: ${categoria.estado}`;
    
    navigator.clipboard.writeText(texto)
      .then(() => {
        mostrarExito('Categoría copiada al portapapeles');
      })
      .catch((err) => {
        console.error('Error al copiar:', err);
        mostrarError('Error al copiar la categoría');
      });
  };

  const handleSaveCategoria = async () => {
    if (!formData.nombre.trim() || formData.nombre.length < 3) {
      mostrarError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    setModalLoading(true);
    try {
      const { error } = await supabase.from('categorias').insert([{
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estado: formData.estado,
        created_at: new Date(),
        updated_at: new Date()
      }]);

      if (error) throw error;
      
      mostrarExito('Categoría registrada');
      setShowModalRegistro(false);
      resetForm();
      cargarCategorias();
    } catch (error) {
      mostrarError(error.message.includes('duplicate') ? 'Ya existe' : 'Error al guardar');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateCategoria = async (data) => {
    setModalLoading(true);
    try {
      const { error } = await supabase
        .from('categorias')
        .update({ ...data, updated_at: new Date() })
        .eq('id', categoriaToEdit.id);

      if (error) throw error;
      
      mostrarExito('Categoría actualizada');
      setShowModalEdicion(false);
      cargarCategorias();
    } catch (error) {
      mostrarError(error.message.includes('duplicate') ? 'Ya existe' : 'Error al actualizar');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategoria = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', categoriaToEdit.id);
      if (error) throw error;
      
      mostrarExito('Categoría eliminada');
      setShowModalEdicion(false);
      cargarCategorias();
    } catch (error) {
      mostrarError('Error al eliminar');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmEliminacion = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', categoriaToDelete.id);
      if (error) throw error;
      
      mostrarExito('Categoría eliminada');
      setShowModalEliminacion(false);
      cargarCategorias();
    } catch (error) {
      mostrarError('Error al eliminar');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredCategorias = categorias.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descripcion && c.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="categorias-view">
      <div className="categorias-view-header">
        <div className="header-info">
          <h1>Gestión de Categorías</h1>
          <p>Administra las categorías de productos</p>
        </div>
        <button className="btn-primary-categoria" onClick={() => setShowModalRegistro(true)}>
          <FaPlus /> Nueva Categoría
        </button>
      </div>

      <div className="categorias-controls">
        <CuadroBusqueda
          valor={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Buscar categorías..."
        />
        
        <div className="view-toggle">
          <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <FaTh />
          </button>
          <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
            <FaList />
          </button>
        </div>
      </div>

      <div className="stats-categoria">
        <span>Total: {filteredCategorias.length} categorías</span>
      </div>

      {loading ? (
        <Cargando />
      ) : viewMode === 'table' ? (
        <TablaCategorias
          categorias={filteredCategorias}
          onEdit={(c) => { setCategoriaToEdit(c); setShowModalEdicion(true); }}
          onDelete={(c) => { setCategoriaToDelete(c); setShowModalEliminacion(true); }}
          onView={(c) => { setCategoriaToEdit(c); setShowModalEdicion(true); }}
          copiarCategoria={copiarCategoria}
          loading={loading}
        />
      ) : filteredCategorias.length === 0 ? (
        <div className="empty-state-categoria">
          <p>No hay categorías</p>
          <button className="btn-outline-categoria" onClick={() => setShowModalRegistro(true)}>
            <FaPlus /> Crear primera
          </button>
        </div>
      ) : (
        <div className="categorias-grid-categoria">
          {filteredCategorias.map((categoria) => (
            <TarjetaCategoria
              key={categoria.id}
              categoria={categoria}
              onEdit={() => { setCategoriaToEdit(categoria); setShowModalEdicion(true); }}
              onDelete={() => { setCategoriaToDelete(categoria); setShowModalEliminacion(true); }}
              onView={() => { setCategoriaToEdit(categoria); setShowModalEdicion(true); }}
              copiarCategoria={copiarCategoria}
              variant="grid"
            />
          ))}
        </div>
      )}

      <ModalRegistroCategoria
        show={showModalRegistro}
        onClose={() => { setShowModalRegistro(false); resetForm(); }}
        onSave={handleSaveCategoria}
        formData={formData}
        onInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        editingCategoria={null}
        loading={modalLoading}
      />

      <ModalEdicionCategoria
        show={showModalEdicion}
        onClose={() => setShowModalEdicion(false)}
        onSave={handleUpdateCategoria}
        onDelete={handleDeleteCategoria}
        categoria={categoriaToEdit}
        loading={modalLoading}
      />

      <ModalEliminacionCategoria
        show={showModalEliminacion}
        onClose={() => setShowModalEliminacion(false)}
        onConfirm={handleConfirmEliminacion}
        categoria={categoriaToDelete}
        loading={modalLoading}
      />
    </div>
  );
}