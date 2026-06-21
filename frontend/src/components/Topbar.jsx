import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PerfilAjustesModal from './PerfilAjustesModal'

// Alertas de telemetría satelital simuladas
const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    text: '🚨 ALERTA CRÍTICA: Posible anomalía de hidrocarburo detectada en sector Río Napo.',
    time: 'Hace 5 minutos',
    unread: true
  },
  {
    id: 2,
    type: 'info',
    text: '🛰️ Sentinel-2: Adquisición de imagen multiespectral exitosa (Órbita 412 - Loreto).',
    time: 'Hace 30 minutos',
    unread: true
  },
  {
    id: 3,
    type: 'success',
    text: '🟢 Estación Hidrométrica: Caudal estable y calidad de agua óptima en cuenca Ucayali.',
    time: 'Hace 2 horas',
    unread: false
  }
]

export default function Topbar() {
  const [panelAbierto, setPanelAbierto] = useState(false)
  const [notifAbierto, setNotifAbierto] = useState(false)
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFICATIONS)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalTab, setModalTab] = useState('perfil')
  
  const panelRef = useRef(null)
  const notifRef = useRef(null)
  const navigate = useNavigate()
  
  const usuario = localStorage.getItem('usuario') || 'Usuario'
  const nombre = localStorage.getItem('nombre') || 'Administrador'
  const rol = localStorage.getItem('rol') || 'usuario'

  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    function handleClickFuera(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setPanelAbierto(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifAbierto(false)
      }
    }

    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  function handleLogout() {
    localStorage.removeItem('usuario')
    localStorage.removeItem('nombre')
    localStorage.removeItem('rol')
    navigate('/')
  }

  function abrirModal(tab) {
    setModalTab(tab)
    setModalAbierto(true)
    setPanelAbierto(false)
  }

  function marcarLeidas() {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })))
  }

  function leerNotificacion(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
  }

  return (
    <>
      <header className="topbar">
        
        {/* Left Side: Brand Indicator */}
        <div className="topbar-left">
          <div className="topbar-brand">
            <div className="topbar-brand-mark">DO</div>
            <div>
              <div className="topbar-brand-title">Consola de Control</div>
              <div className="topbar-brand-subtitle">Monitoreo Ambiental Satelital Activo</div>
            </div>
          </div>
        </div>

        {/* Right Side: Navigation utilities */}
        <div className="topbar-right">
          
          {/* Scientific Telemetry Search */}
          <div className="topbar-search">
            <span className="topbar-search-icon">🔎</span>
            <input
              className="topbar-search-input"
              type="search"
              placeholder="Buscar coordenadas, cuencas o satélites..."
              aria-label="Buscar"
            />
          </div>

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              className={`topbar-button ${notifAbierto ? 'active' : ''}`} 
              type="button" 
              onClick={() => {
                setNotifAbierto(prev => !prev)
                setPanelAbierto(false)
              }}
              aria-label="Notificaciones"
            >
              {unreadCount > 0 && <span className="notif-dot" />}
              🔔
            </button>

            {/* Notification Dropdown */}
            {notifAbierto && (
              <div className="notif-panel">
                <div className="notif-panel-header">
                  <span className="notif-panel-title">Alertas del Sistema ({unreadCount})</span>
                  {unreadCount > 0 && (
                    <button className="notif-panel-clear" onClick={marcarLeidas}>
                      Marcar leídas
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifs.map(n => (
                    <div 
                      key={n.id} 
                      className="notif-item" 
                      onClick={() => leerNotificacion(n.id)}
                      style={{ opacity: n.unread ? 1 : 0.6 }}
                    >
                      <div className={`notif-icon-box ${n.type}`}>
                        {n.type === 'alert' ? '⚠️' : n.type === 'info' ? '🛰️' : '🟢'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="notif-text">{n.text}</span>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account Trigger */}
          <div style={{ position: 'relative' }} ref={panelRef}>
            <button
              className={`profile-button ${panelAbierto ? 'active' : ''}`}
              type="button"
              onClick={() => {
                setPanelAbierto(prev => !prev)
                setNotifAbierto(false)
              }}
              aria-label="Perfil"
            >
              <span className="profile-avatar">
                {usuario.charAt(0).toUpperCase()}
              </span>
              <span className="profile-name">{nombre.split(' ')[0]}</span>
              <span className="profile-chevron">▼</span>
            </button>

            {/* Account Options Panel */}
            {panelAbierto && (
              <div className="profile-panel">
                <div className="profile-panel-user">
                  <div className="profile-panel-avatar">
                    {usuario.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="profile-panel-name">{nombre}</div>
                    <span 
                      className={`badge-estado badge-${rol === 'admin' ? 'alto' : 'bajo'}`} 
                      style={{ fontSize: '0.62rem', padding: '3px 8px', display: 'inline-block', marginTop: 4 }}
                    >
                      {rol.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="profile-panel-actions">
                  <button type="button" onClick={() => abrirModal('perfil')}>
                    <span>👤</span> Mi Perfil
                  </button>
                  <button type="button" onClick={() => abrirModal('ajustes')}>
                    <span>⚙️</span> Ajustes del Sistema
                  </button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                  <button type="button" className="logout-action" onClick={handleLogout}>
                    <span>🚪</span> Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Modal interactivo de Perfil y Ajustes */}
      <PerfilAjustesModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        initialTab={modalTab} 
      />
    </>
  )
}
