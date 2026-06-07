// ============================================================
// Login.jsx — Página de inicio de sesión
// ============================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Nota: Las credenciales ahora se validan en el backend

export default function Login() {
  // useState: variables que React actualiza automáticamente en la pantalla
  const [usuario, setUsuario] = useState('')
  const [clave,   setClave]   = useState('')
  const [error,   setError]   = useState('')

  const navigate = useNavigate()  // Para navegar a otra página

  // Se ejecuta cuando el usuario presiona "Ingresar"
  async function handleSubmit(e) {
    e.preventDefault()  // Evita que la página se recargue

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
        navigate('/inicio');  // Redirigimos al dashboard
      } else {
        setError(data.message || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">DO</div>
          <div>
            <div className="login-title">DetectOil IA</div>
            <div className="login-subtitle">
              Plataforma de monitoreo inteligente para derrames de petróleo.
            </div>
          </div>
        </div>

        {error && <div className="alerta-error">❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-field"
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />

          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-field"
            placeholder="Ingresa tu contraseña"
            value={clave}
            onChange={e => setClave(e.target.value)}
            required
          />

          <button type="submit" className="btn-ingresar">
            🔐 Ingresar al sistema
          </button>
        </form>

        <p className="login-note">
          🧪 Demo: <strong>admin</strong> / <strong>1234</strong>
        </p>
      </div>
    </div>
  )
}
