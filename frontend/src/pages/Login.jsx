// ============================================================
// Login.jsx — Página de inicio de sesión
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [error, setError] = useState('')
  const [ingresando, setIngresando] = useState(false)

  const navigate = useNavigate()

  // Se ejecuta cuando el usuario presiona "Ingresar"
  async function handleSubmit(e) {
    e.preventDefault()
    setIngresando(true)
    setError('')

    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
      });

      const data = await response.json();

      if (data.success) {
        // Guardamos sesión en localStorage (memoria del navegador)
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('nombre', data.nombre || data.usuario);
        localStorage.setItem('rol', data.rol || 'usuario');
        navigate('/inicio');  // Redirigimos al dashboard
      } else {
        setError(data.message || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor de autenticación.');
    } finally {
      setIngresando(false)
    }
  }

  return (
    <div className="login-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Círculo luminoso de fondo */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,110,63,0.2) 0%, transparent 70%)',
        top: '-10%',
        left: '-10%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="login-card" style={{ zIndex: 1, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(7, 18, 23, 0.85)' }}>
        <div className="login-brand">
          <div className="login-brand-mark" style={{ background: 'linear-gradient(135deg, #0d6e3f, #22c7ff)' }}>DO</div>
          <div>
            <div className="login-title" style={{ background: 'linear-gradient(120deg, #fff, #9bb0c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DetectOil IA
            </div>
            <div className="login-subtitle">
              Plataforma inteligente de monitoreo satelital de hidrocarburos.
            </div>
          </div>
        </div>

        {error && <div className="alerta-error" style={{ borderRadius: 16 }}>❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-field"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            style={{ borderRadius: 14 }}
            required
          />

          <label className="form-label">Contraseña</label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <input
              type={verClave ? 'text' : 'password'}
              className="form-field"
              placeholder="Ingresa tu contraseña"
              value={clave}
              onChange={e => setClave(e.target.value)}
              style={{ paddingRight: '45px', marginBottom: 0, borderRadius: 14 }}
              required
            />
            <button
              type="button"
              onClick={() => setVerClave(!verClave)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none'
              }}
            >
              {verClave ? '👁️' : '🙈'}
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-ingresar" 
            style={{ borderRadius: 14, background: 'linear-gradient(135deg, #0d6e3f, #1a9e5f)', boxShadow: '0 12px 30px rgba(13,110,63,0.22)' }}
            disabled={ingresando}
          >
            {ingresando ? '⏳ Verificando credenciales...' : '🔐 Ingresar al Sistema'}
          </button>
        </form>

        {/* Caja de ayuda flotante */}
        <div className="card-custom" style={{
          marginTop: 24,
          padding: '14px 16px',
          background: 'rgba(111,141,255,0.05)',
          border: '1px solid rgba(111,141,255,0.12)',
          borderRadius: 16,
          textAlign: 'center',
          marginBottom: 0,
          boxShadow: 'none'
        }}>
          <span style={{ fontSize: '0.82rem', color: '#9bb0c8', display: 'block' }}>
            🧪 Acceso Demo de Prueba:
          </span>
          <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginTop: 4, display: 'inline-block' }}>
            Usuario: <code style={{ color: '#22c7ff', background: 'rgba(34,199,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>admin</code> | Clave: <code style={{ color: '#22c7ff', background: 'rgba(34,199,255,0.1)', padding: '2px 6px', borderRadius: 4 }}>1234</code>
          </span>
        </div>
      </div>
    </div>
  )
}
