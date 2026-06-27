import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [error, setError] = useState('')
  const [ingresando, setIngresando] = useState(false)

  const navigate = useNavigate()

  // Obtener tema actual para ToastContainer
  const [tema] = useState(() => {
    const guardado = localStorage.getItem('tema')
    return guardado || 'dark'
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setIngresando(true)
    setError('')

    try {
      // Primero intentar con el backend
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('nombre', data.nombre || data.usuario);
        localStorage.setItem('rol', data.rol || 'usuario');
        toast.success(`👋 Bienvenido, ${data.nombre || data.usuario}`);
        setTimeout(() => navigate('/inicio'), 500);
      } else {
        toast.error(data.message || 'Usuario o contraseña incorrectos.');
        setError(data.message || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      // Fallback a autenticación local si el backend no está disponible
      const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios') || '[]');
      
      // Verificar credenciales admin por defecto
      if (usuario === 'admin' && clave === 'admin123') {
        localStorage.setItem('usuario', 'admin');
        localStorage.setItem('nombre', 'Administrador');
        localStorage.setItem('rol', 'admin');
        toast.success('👋 Bienvenido, Administrador');
        setTimeout(() => navigate('/inicio'), 500);
        setIngresando(false);
        return;
      }
      
      // Buscar en usuarios locales
      const usuarioEncontrado = usuariosExistentes.find(
        u => u.usuario.toLowerCase() === usuario.toLowerCase() && u.clave === clave
      );
      
      if (usuarioEncontrado) {
        localStorage.setItem('usuario', usuarioEncontrado.usuario);
        localStorage.setItem('nombre', usuarioEncontrado.nombre);
        localStorage.setItem('rol', usuarioEncontrado.rol || 'usuario');
        toast.success(`👋 Bienvenido, ${usuarioEncontrado.nombre}`);
        setTimeout(() => navigate('/inicio'), 500);
      } else {
        toast.error('❌ Usuario o contraseña incorrectos.');
        setError('Usuario o contraseña incorrectos.');
      }
    } finally {
      setIngresando(false)
    }
  }

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={tema}
      />
    
      <div className="login-wrapper" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100vw' }}>
      
      {/* Dynamic drifting background light orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.005) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="login-card" style={{ zIndex: 1, position: 'relative' }}>
        
        {/* Brand details */}
        <div className="login-brand">
          <div className="login-brand-mark" style={{ background: 'linear-gradient(135deg, var(--color-primario), var(--color-acento))', position: 'relative', overflow: 'hidden' }}>
            {/* Satellite/Scanner SVG Icon for Login */}
            <svg viewBox="0 0 64 64" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
              {/* Central satellite body */}
              <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.1)"/>
              <circle cx="32" cy="32" r="4" fill="white"/>
              {/* Solar panels */}
              <rect x="14" y="28" width="12" height="8" rx="1.5" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
              <rect x="38" y="28" width="12" height="8" rx="1.5" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
              {/* Antenna */}
              <path d="M32 18V12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="32" cy="10" r="3" stroke="white" strokeWidth="2" fill="none"/>
              {/* Signal waves */}
              <path d="M44 14c2-2 4-3 6-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6">
                <animate attributeName="d" values="M44 14c2-2 4-3 6-3;M46 14c3-2 5-3 8-3" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.6;0.2" dur="1.5s" repeatCount="indefinite"/>
              </path>
              <path d="M47 18c3-2 5-3 8-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4">
                <animate attributeName="d" values="M47 18c3-2 5-3 8-3;M49 18c4-2 6-3 10-3" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
                <animate attributeName="stroke-opacity" values="0.4;0.1" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
              </path>
              {/* Orbit ring */}
              <ellipse cx="32" cy="32" rx="24" ry="24" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" transform="rotate(-30 32 32)"/>
            </svg>
            {/* Pulse effect */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', animation: 'pulseGlow 2s ease-in-out infinite', background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)' }}/>
          </div>
          <div>
            <div className="login-title">DetectOil IA</div>
            <div className="login-subtitle">
              Plataforma de Detección Temprana de Hidrocarburos
            </div>
          </div>
        </div>

        {error && <div className="alerta-error"> {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          
          <div>
            <label className="form-label">Usuario de Red</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                className="form-field"
                placeholder="Identificador del operador"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                style={{ paddingLeft: 44, marginBottom: 0 }}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Código de Seguridad</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={verClave ? 'text' : 'password'}
                className="form-field"
                placeholder="Contraseña de acceso"
                value={clave}
                onChange={e => setClave(e.target.value)}
                style={{ paddingLeft: 44, paddingRight: 45, marginBottom: 0 }}
                required
              />
              <button
                type="button"
                onClick={() => setVerClave(!verClave)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--icon-color-default, rgba(15, 23, 42, 0.5))',
                  cursor: 'pointer',
                  padding: 5,
                  display: 'flex',
                  alignItems: 'center',
                  outline: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-acento)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--icon-color-default, rgba(15, 23, 42, 0.5))'}
              >
                {verClave ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-ingresar" 
            style={{ 
              marginTop: 8,
              background: 'linear-gradient(135deg, var(--color-acento), var(--color-primario))',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)'
            }}
            disabled={ingresando}
          >
            {ingresando ? (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'orbitRotate 1.5s linear infinite' }}>
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                </svg>
                <span>Validando acceso...</span>
              </>
            ) : (
              <>
                <span>Establecer Conexión</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Demo box readouts */}
        <div style={{
          marginTop: 28,
          padding: '16px 20px',
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.18)',
          borderRadius: 14,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.08)'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-acento)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            🔐 Credenciales de Demostración
          </span>
          <div style={{ fontSize: '0.88rem', color: 'var(--color-texto)', fontWeight: 500, marginBottom: 4 }}>
            Usuario Admin: <code style={{ color: 'var(--color-texto)', background: 'rgba(6, 182, 212, 0.1)', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace', border: '1px solid rgba(6, 182, 212, 0.2)' }}>admin</code>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--color-texto)', fontWeight: 500, marginBottom: 10 }}>
            Contraseña: <code style={{ color: 'var(--color-texto)', background: 'rgba(6, 182, 212, 0.1)', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace', border: '1px solid rgba(6, 182, 212, 0.2)' }}>admin123</code>
          </div>
          <div style={{ borderTop: '1px solid rgba(6, 182, 212, 0.15)', paddingTop: 10, marginTop: 8 }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--color-texto-muted)' }}>
              ¿Nuevo en el sistema?{' '}
              <button 
                onClick={() => navigate('/registro')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primario)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                Crear cuenta de operador →
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Orbs floating animation styles */}
      <style>{`
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
        }
        .orb-1 {
          width: 350px;
          height: 350px;
          background: rgba(6, 182, 212, 0.2);
          top: 10%;
          left: 10%;
          animation: floatOrb1 15s infinite alternate ease-in-out;
        }
        .orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(16, 185, 129, 0.15);
          bottom: 10%;
          right: 15%;
          animation: floatOrb2 20s infinite alternate ease-in-out;
        }
        .orb-3 {
          width: 250px;
          height: 250px;
          background: rgba(99, 102, 241, 0.12);
          top: 50%;
          left: 60%;
          animation: floatOrb3 18s infinite alternate ease-in-out;
        }
        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1.1); }
          100% { transform: translate(-80px, -50px) scale(0.9); }
        }
        @keyframes floatOrb3 {
          0% { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(50px, -60px) scale(1.1); }
        }
      `}</style>
    </div>
  </>
  )
}
