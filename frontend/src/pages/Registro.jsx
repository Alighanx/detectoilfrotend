import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [confirmarClave, setConfirmarClave] = useState('')
  const [verClave, setVerClave] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  
  const navigate = useNavigate()

  function validarFormulario() {
    if (!nombre.trim()) {
      toast.error('⚠️ El nombre completo es obligatorio')
      return false
    }
    if (nombre.trim().length < 3) {
      toast.error('⚠️ El nombre debe tener al menos 3 caracteres')
      return false
    }
    if (!usuario.trim()) {
      toast.error('⚠️ El nombre de usuario es obligatorio')
      return false
    }
    if (usuario.trim().length < 3) {
      toast.error('⚠️ El usuario debe tener al menos 3 caracteres')
      return false
    }
    if (!clave) {
      toast.error('⚠️ La contraseña es obligatoria')
      return false
    }
    if (clave.length < 4) {
      toast.error('⚠️ La contraseña debe tener al menos 4 caracteres')
      return false
    }
    if (clave !== confirmarClave) {
      toast.error('⚠️ Las contraseñas no coinciden')
      return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setRegistrando(true)

    try {
      // Obtener usuarios existentes de localStorage
      const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios') || '[]')
      
      // Validación case-insensitive para evitar duplicados
      const usuarioExiste = usuariosExistentes.some(
        u => u.usuario.toLowerCase() === usuario.toLowerCase()
      )
      
      if (usuarioExiste) {
        toast.error('❌ El nombre de usuario ya está registrado. Intenta con otro.')
        setRegistrando(false)
        return
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre.trim(),
        usuario: usuario.trim(),
        clave: clave,
        rol: 'usuario',
        fechaRegistro: new Date().toLocaleDateString('es-ES')
      }

      // Guardar en localStorage
      usuariosExistentes.push(nuevoUsuario)
      localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes))

      toast.success('✅ Usuario registrado exitosamente. Redirigiendo al login...')
      
      // Limpiar formulario
      setNombre('')
      setUsuario('')
      setClave('')
      setConfirmarClave('')
      
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        navigate('/')
      }, 2000)
      
    } catch (err) {
      console.error(err)
      toast.error('❌ Error al registrar el usuario. Intente nuevamente.')
    } finally {
      setRegistrando(false)
    }
  }

  // Obtener tema actual para ToastContainer
  const [tema] = useState(() => {
    const guardado = localStorage.getItem('tema')
    return guardado || 'dark'
  })

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

        <div className="login-card" style={{ zIndex: 1, position: 'relative', maxWidth: '520px' }}>
          
          {/* Brand details */}
          <div className="login-brand">
            <div className="login-brand-mark" style={{ background: 'linear-gradient(135deg, var(--color-primario), var(--color-acento))', position: 'relative', overflow: 'hidden' }}>
              {/* Shield/Protection SVG Icon for Registro */}
              <svg viewBox="0 0 64 64" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
                {/* Outer shield shape */}
                <path d="M32 4L10 12v16c0 14 10 24 22 28 12-4 22-14 22-28V12L32 4z" stroke="white" strokeWidth="2.5" fill="rgba(255,255,255,0.1)"/>
                {/* Inner shield */}
                <path d="M32 10L16 16v12c0 10 7 18 16 21 9-3 16-11 16-21V16L32 10z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)"/>
                {/* Checkmark in center */}
                <path d="M24 32l6 6 10-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                {/* Security dots */}
                <circle cx="32" cy="24" r="2" fill="white"/>
                <circle cx="26" cy="38" r="1.5" fill="white" opacity="0.7"/>
                <circle cx="38" cy="38" r="1.5" fill="white" opacity="0.7"/>
                {/* Pulse rings */}
                <circle cx="32" cy="32" r="18" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none">
                  <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite"/>
                </circle>
              </svg>
              {/* Pulse effect */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', animation: 'pulseGlow 2s ease-in-out infinite', background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)' }}/>
            </div>
            <div>
              <div className="login-title">Crear Cuenta</div>
              <div className="login-subtitle">
                Registro de nuevos operadores del sistema
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            
            {/* Nombre Completo */}
            <div>
              <label className="form-label">Nombre Completo</label>
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
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  style={{ paddingLeft: 44, marginBottom: 0 }}
                  required
                />
              </div>
            </div>

            {/* Usuario */}
            <div>
              <label className="form-label">Nombre de Usuario</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="form-field"
                  placeholder="Ej: jperez"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  style={{ paddingLeft: 44, marginBottom: 0 }}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="form-label">Contraseña</label>
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
                  placeholder="Mínimo 4 caracteres"
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
                    color: 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    padding: 5,
                    display: 'flex',
                    alignItems: 'center',
                    outline: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-acento)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
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

            {/* Confirmar Contraseña */}
            <div>
              <label className="form-label">Confirmar Contraseña</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  type={verClave ? 'text' : 'password'}
                  className="form-field"
                  placeholder="Repite tu contraseña"
                  value={confirmarClave}
                  onChange={e => setConfirmarClave(e.target.value)}
                  style={{ paddingLeft: 44, marginBottom: 0 }}
                  required
                />
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
              disabled={registrando}
            >
              {registrando ? (
                <>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'orbitRotate 1.5s linear infinite' }}>
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  </svg>
                  <span>Registrando usuario...</span>
                </>
              ) : (
                <>
                  <span>📝 Crear Cuenta</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Link para volver al login */}
          <div style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: '0.86rem',
            color: 'var(--color-texto-muted)'
          }}>
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-acento)',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
                padding: 0,
                font: 'inherit'
              }}
            >
              Iniciar Sesión
            </button>
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
