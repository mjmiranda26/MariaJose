import React from 'react'
import { FaHeart } from 'react-icons/fa'
import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            Maria Jose
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="hero">
          <h1>Welcome to Maria Jose</h1>
          <p>Your React application is ready!</p>
          <div className="heart-icon">
            <FaHeart />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2026 Maria Jose. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App