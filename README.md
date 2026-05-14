# 🛍️ Maria Jose - Catálogo de Productos

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.22.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![CSS3](https://img.shields.io/badge/CSS3-Plain-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)

## 📋 Descripción del Proyecto

Este proyecto es desarrollado como parte del curso de **Aplicaciones Gráficas y Multimedia**. Es un sistema de catálogo de productos tipo tienda en línea donde los administradores pueden gestionar productos y categorías, mientras que los usuarios pueden visualizar los catálogos de productos.

### 🎯 Características Principales

- **Panel de Administración**: Los administradores pueden:
  - ✅ Crear nuevos productos
  - ✅ Editar productos existentes
  - ✅ Eliminar productos
  - ✅ Gestionar categorías
  - ✅ Subir imágenes de productos

- **Tienda / Catálogo**: Los usuarios pueden:
  - 👀 Ver todos los productos disponibles
  - 🔍 Filtrar por categorías
  - 📱 Navegación responsive
  - 🖼️ Ver detalles de productos

### 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|------------|
| **React** | 18.2.0 | Biblioteca principal para la interfaz de usuario |
| **Vite** | 5.0.0 | Bundler y servidor de desarrollo rápido |
| **React Router DOM** | 6.22.0 | Navegación y rutas de la aplicación |
| **React Icons** | 5.0.1 | Biblioteca de iconos para la UI |
| **Supabase** | - | Base de datos backend y autenticación |
| **CSS3** | - | Estilos y diseño responsive |

## 📦 Instalación y Configuración

### Prerrequisitos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes)

### Pasos para ejecutar el proyecto

1. **Clonar el repositorio**

`git clone https://github.com/mjmiranda26/MariaJose.git`
`cd MariaJose`

Instalar dependencias (ignorando scripts)


`pnpm install --ignore-scripts`

Ejecutar en modo desarrollo


`pnpm run dev`

4. Abrir en el navegador


`http://localhost:3000`


## 📋 Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Inicia el servidor de desarrollo |
| `pnpm run build` | Construye la aplicación para producción |
| `pnpm run preview` | Previsualiza la versión de producción |

## 🗄️ Configuración de Supabase

Este proyecto utiliza Supabase como base de datos. Para configurarlo:

1. Crear una cuenta en [Supabase](https://supabase.com/)
2. Crear un nuevo proyecto
3. Obtener las credenciales:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Crear archivo `.env` en la raíz del proyecto:


`VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_llave_anonima`

## 🎨 Funcionalidades Planificadas

### Fase 1 - MVP (Producto Mínimo Viable)
- ✅ CRUD de productos
- ✅ CRUD de categorías
- ✅ Visualización de catálogo
- ✅ Filtrado por categorías

### Fase 2 - Mejoras
- 🔄 Autenticación de usuarios
- 🔄 Carrito de compras
- 🔄 Sistema de búsqueda
- 🔄 Paginación de productos

### Fase 3 - Funcionalidades Avanzadas
- 📱 Aplicación móvil (React Native)
- 💳 Pasarela de pagos
- 📊 Dashboard de estadísticas
- 📧 Notificaciones por email

## 👥 Equipo de Desarrollo

- **Maria Jose** - Desarrolladora Principal
- **Curso**: Aplicaciones Gráficas y Multimedia

## 📄 Licencia

Este proyecto es de uso académico para el curso de Aplicaciones Gráficas y Multimedia.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para dudas o sugerencias, contacta a:

- **Email**: mjrivasmiranda@gmail.com
- **GitHub**: [@mjmiranda26](https://github.com/mjmiranda26)