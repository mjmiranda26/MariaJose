import React, { useState, useEffect } from 'react';
import { supabase } from '../database/supabaseconfig';
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import ModalEdicionProducto from '../components/productos/ModalEdicionProducto';
import ModalEliminacionProducto from '../components/productos/ModalEliminacionProducto';
import ModalQRProducto from '../components/productos/ModalQRProducto';
import TablaProductos from '../components/productos/TablaProductos';
import TarjetaProducto from '../components/productos/TarjetaProducto';
import Cargando from '../components/comun/Cargando';
import CuadroBusqueda from '../components/busquedas/CuadroBusquedas';
import { mostrarExito, mostrarError } from '../components/NotificacionOperacion';
import { FaPlus, FaTh, FaList, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/productos/productos.css';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalRegistro, setShowModalRegistro] = useState(false);
  const [showModalEdicion, setShowModalEdicion] = useState(false);
  const [showModalEliminacion, setShowModalEliminacion] = useState(false);
  const [showModalQR, setShowModalQR] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState(null);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [productoQR, setProductoQR] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria_id: '',
    stock: '',
    imagen_url: '',
    imagen_path: ''
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
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
        .select(`
          *,
          categorias!categoria_id (
            id,
            nombre,
            descripcion
          )
        `, { count: 'exact' });

      if (selectedCategory) {
        query = query.eq('categoria_id', selectedCategory);
      }

      if (searchTerm) {
        query = query.ilike('nombre', `%${searchTerm}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error, count } = await query
        .order('nombre', { ascending: true })
        .range(from, to);

      if (error) throw error;
      
      const productosConCategoria = data.map(producto => ({
        ...producto,
        categoria: producto.categorias?.nombre || 'Sin categoría',
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url || null,
        imagen_path: producto.imagen_path || null,
        categorias: undefined
      }));
      
      setProductos(productosConCategoria || []);
      setTotalItems(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
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
      categoria_id: '',
      stock: '',
      imagen_url: '',
      imagen_path: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl, imagePath) => {
    setFormData(prev => ({
      ...prev,
      imagen_url: imageUrl,
      imagen_path: imagePath
    }));
  };

  // Función para copiar producto
  const copiarProducto = (producto) => {
    const texto = `ID: ${producto.id}\nNombre: ${producto.nombre}\nPrecio: $${producto.precio}\nCategoría: ${producto.categoria}\nStock: ${producto.stock} unidades\nDescripción: ${producto.descripcion || 'Sin descripción'}`;
    
    navigator.clipboard.writeText(texto)
      .then(() => {
        mostrarExito('Producto copiado al portapapeles');
      })
      .catch((err) => {
        console.error('Error al copiar:', err);
        mostrarError('Error al copiar el producto');
      });
  };

  // Función para generar QR
  const generarQRImagen = (producto) => {
    console.log('🔴 QR: FUNCIÓN LLAMADA');
    console.log('🔴 Producto:', producto);
    
    if (!producto) {
      console.error('❌ Error: Producto es null');
      mostrarError('Error: No se pudo generar el QR');
      return;
    }
    
    setProductoQR(producto);
    setShowModalQR(true);
    console.log('✅ Modal QR abierto');
  };

  // ========================================
  // FUNCIÓN PARA GENERAR PDF DE PRODUCTO INDIVIDUAL
  // ========================================
  const generarPDFProducto = (producto) => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('Reporte de Producto', 14, 20);
      
      // Línea decorativa
      doc.line(14, 25, 195, 25);
      
      // Información del producto
      doc.setFontSize(12);
      autoTable(doc, {
        startY: 35,
        head: [['Campo', 'Valor']],
        body: [
          ['ID', producto.id],
          ['Nombre', producto.nombre],
          ['Precio', `$${producto.precio.toFixed(2)}`],
          ['Stock', `${producto.stock} unidades`],
          ['Categoría', producto.categoria],
          ['Descripción', producto.descripcion || 'Sin descripción'],
          ['Fecha Creación', new Date(producto.created_at).toLocaleDateString('es-ES')],
          ['Fecha Actualización', new Date(producto.updated_at).toLocaleDateString('es-ES')]
        ],
        theme: 'striped',
        headStyles: {
          fillColor: [243, 164, 181],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 11
        }
      });
      
      // Descargar PDF
      doc.save(`producto_${producto.id}.pdf`);
      mostrarExito('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      mostrarError('Error al generar el PDF');
    }
  };

  // ========================================
  // FUNCIÓN PARA GENERAR PDF DE TODOS LOS PRODUCTOS
  // ========================================
  const generarPDFTodosProductos = () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('Reporte de Todos los Productos', 14, 20);
      
      // Línea decorativa
      doc.line(14, 25, 195, 25);
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 14, 33);
      
      // Tabla con todos los productos
      doc.setFontSize(12);
      const tableBody = productos.map(p => [
        p.id,
        p.nombre,
        `$${p.precio.toFixed(2)}`,
        `${p.stock} uds`,
        p.categoria
      ]);
      
      autoTable(doc, {
        startY: 40,
        head: [['ID', 'Nombre', 'Precio', 'Stock', 'Categoría']],
        body: tableBody,
        theme: 'striped',
        headStyles: {
          fillColor: [243, 164, 181],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 60 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 }
        }
      });
      
      // Agregar total de productos al final
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total de productos: ${productos.length}`, 14, finalY);
      
      // Descargar PDF
      doc.save(`todos_productos.pdf`);
      mostrarExito('PDF de todos los productos generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      mostrarError('Error al generar el PDF');
    }
  };

  const handleSaveProducto = async () => {
    if (!formData.nombre || formData.nombre.trim().length < 3) {
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

    if (!formData.categoria_id || formData.categoria_id === '') {
      mostrarError('Debe seleccionar una categoría válida');
      return;
    }

    setModalLoading(true);
    try {
      const productoData = {
        nombre: formData.nombre.trim(),
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion?.trim() || '',
        categoria_id: parseInt(formData.categoria_id),
        stock: parseInt(formData.stock),
        imagen_url: formData.imagen_url || null,
        imagen_path: formData.imagen_path || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([productoData])
        .select();

      if (error) throw error;
      
      mostrarExito('Producto registrado exitosamente');
      setShowModalRegistro(false);
      resetForm();
      setCurrentPage(1);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar:', error);
      mostrarError('Error al guardar el producto: ' + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateProducto = async (data) => {
    setModalLoading(true);
    try {
      if (!data.categoria_id || data.categoria_id === '') {
        mostrarError('Debe seleccionar una categoría');
        setModalLoading(false);
        return;
      }

      const updateData = {
        nombre: data.nombre.trim(),
        precio: parseFloat(data.precio),
        descripcion: data.descripcion?.trim() || '',
        categoria_id: parseInt(data.categoria_id),
        stock: parseInt(data.stock),
        imagen_url: data.imagen_url || null,
        imagen_path: data.imagen_path || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', productoToEdit.id);

      if (error) throw error;
      
      mostrarExito('Producto actualizado exitosamente');
      setShowModalEdicion(false);
      setProductoToEdit(null);
      cargarProductos();
    } catch (error) {
      console.error('Error al actualizar:', error);
      mostrarError('Error al actualizar el producto: ' + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmEliminacion = async () => {
    setModalLoading(true);
    try {
      if (!productoToDelete || !productoToDelete.id) {
        mostrarError('Error: No se pudo identificar el producto a eliminar');
        setModalLoading(false);
        return;
      }

      if (productoToDelete.imagen_path) {
        await supabase.storage
          .from('productos-imagenes')
          .remove([productoToDelete.imagen_path]);
      }

      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id', productoToDelete.id);

      if (error) throw error;
      
      mostrarExito(`Producto "${productoToDelete.nombre}" eliminado exitosamente`);
      setShowModalEliminacion(false);
      setProductoToDelete(null);
      
      if (productos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await cargarProductos();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      mostrarError('Error al eliminar el producto: ' + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditModal = (producto) => {
    setProductoToEdit(producto);
    setShowModalEdicion(true);
  };

  const openDeleteModal = (producto) => {
    setProductoToDelete(producto);
    setShowModalEliminacion(true);
  };

  const PaginationComponent = () => (
    <div className="pagination">
      <button 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        ◀ Anterior
      </button>
      <span className="pagination-info">
        Página {currentPage} de {totalPages}
      </span>
      <button 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Siguiente ▶
      </button>
    </div>
  );

  return (
    <div className="productos-view">
      <div className="productos-view-header">
        <div className="header-info">
          <h1>Gestión de Productos</h1>
          <p>Administra el inventario de productos</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export-pdf" onClick={generarPDFTodosProductos}>
            <FaFilePdf /> Exportar Todos
          </button>
          <button className="btn-primary-producto" onClick={() => setShowModalRegistro(true)}>
            <FaPlus /> Nuevo Producto
          </button>
        </div>
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
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
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
        <span>Total: {totalItems} productos | Página {currentPage} de {totalPages} | {itemsPerPage} por página</span>
      </div>

      {loading ? (
        <Cargando />
      ) : viewMode === 'table' ? (
        <>
          <TablaProductos
            productos={productos}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onView={openEditModal}
            copiarProducto={copiarProducto}
            generarQRImagen={generarQRImagen}
            generarPDFProducto={generarPDFProducto}
            loading={loading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          {totalPages > 1 && <PaginationComponent />}
        </>
      ) : productos.length === 0 ? (
        <div className="empty-state-producto">
          <p>No hay productos registrados</p>
          <button className="btn-outline-producto" onClick={() => setShowModalRegistro(true)}>
            <FaPlus /> Crear primer producto
          </button>
        </div>
      ) : (
        <>
          <div className="productos-grid-producto">
            {productos.map((producto) => (
              <TarjetaProducto
                key={producto.id}
                producto={producto}
                onEdit={() => openEditModal(producto)}
                onDelete={() => openDeleteModal(producto)}
                onView={() => openEditModal(producto)}
                copiarProducto={copiarProducto}
                generarQRImagen={generarQRImagen}
                generarPDFProducto={generarPDFProducto}
              />
            ))}
          </div>
          {totalPages > 1 && <PaginationComponent />}
        </>
      )}

      <ModalRegistroProducto
        show={showModalRegistro}
        onClose={() => { setShowModalRegistro(false); resetForm(); }}
        onSave={handleSaveProducto}
        formData={formData}
        onInputChange={handleInputChange}
        onImageChange={handleImageChange}
        categorias={categorias}
        loading={modalLoading}
      />

      <ModalEdicionProducto
        show={showModalEdicion}
        onClose={() => { setShowModalEdicion(false); setProductoToEdit(null); }}
        onSave={handleUpdateProducto}
        producto={productoToEdit}
        categorias={categorias}
        loading={modalLoading}
      />

      <ModalEliminacionProducto
        show={showModalEliminacion}
        onClose={() => { setShowModalEliminacion(false); setProductoToDelete(null); }}
        onConfirm={handleConfirmEliminacion}
        producto={productoToDelete}
        loading={modalLoading}
      />

      <ModalQRProducto
        show={showModalQR}
        onClose={() => {
          setShowModalQR(false);
          setProductoQR(null);
        }}
        producto={productoQR}
      />
    </div>
  );
}