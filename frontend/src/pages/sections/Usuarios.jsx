import { useState, useEffect } from 'react'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [registrando, setRegistrando] = useState(false)

  const usuarioLogueado = localStorage.getItem('usuario') || ''

  async function cargarUsuarios() {
    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';
      
      const response = await fetch(`${API_URL}/usuarios`)
      if (!response.ok) {
        throw new Error('Error al obtener la lista de usuarios.')
      }
      const data = await response.json()
      if (data.success) {
        setUsuarios(data.data)
      } else {
        setError(data.message || 'No se pudo cargar la lista de usuarios.')
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión con el servidor al obtener los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function handleRegistrar(e) {
    e.preventDefault()
    setRegistrando(true)
    setError('')
    setSuccess('')

    if (!usuario.trim() || !contrasena.trim()) {
      setError('El usuario y la contraseña son obligatorios.')
      setRegistrando(false)
      return
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';

      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, usuario, contrasena })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'Usuario registrado con éxito.')
        setNombre('')
        setUsuario('')
        setContrasena('')
        await cargarUsuarios()
      } else {
        setError(data.message || 'No se pudo registrar el usuario.')
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión al intentar registrar el usuario.')
    } finally {
      setRegistrando(false)
    }
  }

  async function handleEliminar(id, username) {
    if (username === 'admin') {
      alert('❌ El usuario principal "admin" no puede ser eliminado.')
      return
    }

    if (username === usuarioLogueado) {
      alert('❌ No puedes eliminar tu propia cuenta mientras estás en sesión.')
      return
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?`)) {
      return
    }

    setError('')
    setSuccess('')

    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || 'Usuario eliminado con éxito.')
        await cargarUsuarios()
      } else {
        setError(data.message || 'No se pudo eliminar el usuario.')
      }
    } catch (err) {
      console.error(err)
      setError('Error al intentar eliminar el usuario.')
    }
  }

  return (
    <>
      <h1 className="seccion-titulo">Gestión de Cuentas</h1>
      <p className="seccion-subtitulo">Administra los accesos de red y credenciales de los operadores del sistema</p>

      {/* Alertas de Mensaje */}
      {success && <div style={{ color: '#a7f3d0', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '12px 18px', borderRadius: 12, fontSize: '0.86rem', marginBottom: 20 }}>✅ {success}</div>}
      {error && <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px 18px', borderRadius: 12, fontSize: '0.86rem', marginBottom: 20 }}>❌ {error}</div>}

      <div className="row g-4">
        
        {/* Tabla de Usuarios Registrados */}
        <div className="col-md-7">
          <div className="card-custom" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#fff', marginBottom: 20, fontSize: '1.05rem', fontWeight: 700 }}>
              👥 Cuentas de Operadores Registrados
            </h5>
            
            {loading ? (
              <div style={{ margin: 'auto 0', textAlign: 'center', color: 'var(--color-texto-muted)' }}>
                <span>⏳ Obteniendo registros de usuarios...</span>
              </div>
            ) : (
              <div className="tabla-custom-wrapper" style={{ flex: 1 }}>
                <table className="tabla-custom">
                  <thead>
                    <tr>
                      <th>Operador</th>
                      <th>Identificador</th>
                      <th>Fecha Registro</th>
                      <th style={{ textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: user.usuario === 'admin' ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : 'linear-gradient(135deg, #10b981, #06b6d4)',
                                display: 'grid',
                                placeItems: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.78rem'
                              }}>
                                {user.nombre.charAt(0).toUpperCase()}
                              </div>
                              <strong style={{ color: '#fff' }}>{user.nombre}</strong>
                            </div>
                          </td>
                          <td>
                            <code style={{ background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 6, color: 'var(--color-acento)', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                              @{user.usuario}
                            </code>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--color-texto-muted)' }}>
                            {user.fecha_registro.split(' ')[0]}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-principal btn-sm"
                              style={{
                                background: user.usuario === 'admin' || user.usuario === usuarioLogueado 
                                  ? 'rgba(255, 255, 255, 0.02)' 
                                  : 'rgba(239, 68, 68, 0.12)',
                                color: user.usuario === 'admin' || user.usuario === usuarioLogueado 
                                  ? 'rgba(255,255,255,0.15)' 
                                  : 'var(--color-peligro)',
                                border: '1px solid ' + (user.usuario === 'admin' || user.usuario === usuarioLogueado ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.2)'),
                                cursor: user.usuario === 'admin' || user.usuario === usuarioLogueado ? 'not-allowed' : 'pointer',
                                boxShadow: 'none'
                              }}
                              onClick={() => handleEliminar(user.id, user.usuario)}
                              disabled={user.usuario === 'admin' || user.usuario === usuarioLogueado}
                              title={
                                user.usuario === 'admin' 
                                  ? 'Administrador maestro protegido' 
                                  : user.usuario === usuarioLogueado 
                                  ? 'Sesión de red activa' 
                                  : 'Dar de baja'
                              }
                            >
                              Dar de baja
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-texto-muted)', padding: 30 }}>
                          No hay usuarios registrados en el sistema.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Registro de Cuentas */}
        <div className="col-md-5">
          <div className="card-custom">
            <h5 style={{ color: '#fff', marginBottom: 20, fontSize: '1.05rem', fontWeight: 700 }}>
              ➕ Crear Credencial de Red
            </h5>
            
            <form onSubmit={handleRegistrar} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.74rem' }}>Nombre Completo</label>
                <input
                  type="text"
                  className="input-custom"
                  placeholder="Ej. Ing. Carlos Mendoza"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  style={{ marginBottom: 0 }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.74rem' }}>Nombre de Usuario (Red ID)</label>
                <input
                  type="text"
                  className="input-custom"
                  placeholder="Ej. cmendoza"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  style={{ marginBottom: 0 }}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.74rem' }}>Clave de Acceso Inicial</label>
                <input
                  type="password"
                  className="input-custom"
                  placeholder="Mínimo 4 caracteres"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  style={{ marginBottom: 0 }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-principal"
                style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                disabled={registrando}
              >
                {registrando ? '⏳ Registrando credencial...' : '➕ Habilitar Operador'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}
