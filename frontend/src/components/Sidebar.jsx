// ============================================================
// Sidebar.jsx — Menú lateral reutilizable
// Props: seccionActiva (string) — indica qué ítem resaltar
// ============================================================
import { useNavigate } from 'react-router-dom'

// Lista de ítems del menú (fácil de agregar o quitar)
const MENU_ITEMS = [
  { emoji: '🏠', label: 'Inicio',          ruta: '/inicio' },
  { emoji: '🛢️', label: 'Nueva Detección', ruta: '/nueva-deteccion' },
  { emoji: '📊', label: 'Historial',        ruta: '/historial' },
  { emoji: '📚', label: 'Información',      ruta: '/informacion' },
]

export default function Sidebar({ seccionActiva }) {
  const navigate = useNavigate()

  // Cierra la sesión borrando localStorage y vuelve al login
  function cerrarSesion() {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <nav className="sidebar">

      {/* Marca / Logo del sistema */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">🛢️</span>
        <span className="sidebar-brand-text">
          DetectOil IA<br />
          <small style={{ color: '#666', fontWeight: 300 }}>Grupo 05</small>
        </span>
      </div>

      {/* Ítems del menú generados desde el array MENU_ITEMS */}
      {MENU_ITEMS.map(item => (
        <button
          key={item.ruta}
          className={`sidebar-link ${seccionActiva === item.ruta ? 'activo' : ''}`}
          onClick={() => navigate(item.ruta)}
        >
          {item.emoji} {item.label}
        </button>
      ))}

      {/* Logout al fondo del sidebar */}
      <div className="sidebar-separador">
        <button className="sidebar-link logout" onClick={cerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </div>

    </nav>
  )
}
