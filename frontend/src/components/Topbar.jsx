import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const [panelAbierto, setPanelAbierto] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const usuario = localStorage.getItem('usuario') || 'Usuario'

  useEffect(() => {
    function handleClickFuera(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelAbierto(false)
      }
    }

    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  function handleLogout() {
    localStorage.removeItem('usuario')
    navigate('/')
  }

  return (
    <header className="topbar" ref={panelRef}>
      <div className="topbar-left">
        <div className="topbar-brand">
          <span className="topbar-brand-mark">DO</span>
          <div>
            <div className="topbar-brand-title">DetectOil IA</div>
            <div className="topbar-brand-subtitle">Inteligencia ambiental en tiempo real</div>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <span className="topbar-search-icon">🔎</span>
          <input
            className="topbar-search-input"
            type="search"
            placeholder="Buscar detecciones, zonas o alertas..."
            aria-label="Buscar"
          />
        </div>

        <button className="topbar-button" type="button" aria-label="Notificaciones">
          <span className="notif-dot" />
          🔔
        </button>

        <button
          className={`topbar-button profile-button ${panelAbierto ? 'active' : ''}`}
          type="button"
          onClick={() => setPanelAbierto(prev => !prev)}
          aria-label="Perfil"
        >
          <span className="profile-avatar">{usuario.charAt(0).toUpperCase()}</span>
          <span className="profile-name">{usuario}</span>
          <span className="profile-chevron">⌄</span>
        </button>

        {panelAbierto && (
          <div className="profile-panel">
            <div className="profile-panel-user">
              <div className="profile-panel-avatar">{usuario.charAt(0).toUpperCase()}</div>
              <div>
                <div className="profile-panel-name">{usuario}</div>
                <div className="profile-panel-email">usuario@detectoil.com</div>
              </div>
            </div>

            <div className="profile-panel-actions">
              <button type="button" onClick={() => setPanelAbierto(false)}>
                Mi Perfil
              </button>
              <button type="button" onClick={() => setPanelAbierto(false)}>
                Ajustes
              </button>
              <button type="button" className="logout-action" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
