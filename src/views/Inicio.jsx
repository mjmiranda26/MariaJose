import React from 'react';
import { FaStore, FaMusic, FaHeadphones, FaCompactDisc, FaTshirt } from 'react-icons/fa';
import '../styles/secciones/inicio.css';

export default function Inicio() {
  const features = [
    { icon: FaCompactDisc, title: 'Discos Exclusivos', desc: 'Los mejores discos de colección' },
    { icon: FaHeadphones, title: 'Audio de Calidad', desc: 'Formatos digitales de alta fidelidad' },
    { icon: FaTshirt, title: 'Merchandising', desc: 'Productos oficiales de tus artistas' }
  ];

  return (
    <div className="inicio-container">
      <div className="inicio-card">
        <div className="welcome-header">
          <FaStore className="welcome-icon" />
          <h1>¡Bienvenido a Discosca!</h1>
        </div>
        <p>Tu tienda de discos y música favorita</p>
        
        <div className="inicio-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}