// ============================================================
// Usuarios.jsx — Sección para la gestión de usuarios en base de datos
// ============================================================
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

  // Carga la lista de usuarios desde el backend
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

  // Registrar un nuevo usuario
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
        // Limpiar campos
        setNombre('')
        setUsuario('')
        setContrasena('')
        // Recargar lista de usuarios
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

  // Eliminar un usuario
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
      <h1 className="seccion-titulo">👥 Gestión de Usuarios</h1>
      <p className="seccion-subtitulo">Administra las cuentas y contraseñas con acceso al sistema</p>

      {/* Alertas de Mensaje */}
      {success && <div className="card-custom" style={{ padding: '15px 20px', color: '#96f3b1', background: 'rgba(13,110,63,0.18)', border: '1px solid rgba(13,110,63,0.3)', marginBottom: 20 }}>✅ {success}</div>}
      {error && <div className="card-custom" style={{ padding: '15px 20px', color: '#ff9a9a', background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', marginBottom: 20 }}>❌ {error}</div>}

      <div className="row g-4">
        
        {/* Tabla de Usuarios */}
        <div className="col-md-7">
          <div className="card-custom" style={{ minHeight: '350px' }}>
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>Lista de Cuentas</h5>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#aaa' }}>
                <span>⏳ Cargando usuarios...</span>
              </div>
            ) : (
              <table className="tabla-custom">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Registro</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length > 0 ? (
                    usuarios.map(user => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.nombre}</strong>
                        </td>
                        <td>
                          <code style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 6px', borderRadius: 4, color: '#6f8dff' }}>
                            {user.usuario}
                          </code>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#9bb0c8' }}>
                          {user.fecha_registro.split(' ')[0]}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn-principal btn-sm"
                            style={{
                              background: user.usuario === 'admin' || user.usuario === usuarioLogueado 
                                ? 'rgba(255, 93, 93, 0.04)' 
                                : 'rgba(255, 93, 93, 0.15)',
                              color: user.usuario === 'admin' || user.usuario === usuarioLogueado 
                                ? '#ff9a9a55' 
                                : '#ff9a9a',
                              border: 'none',
                              cursor: user.usuario === 'admin' || user.usuario === usuarioLogueado ? 'not-allowed' : 'pointer',
                              boxShadow: 'none'
                            }}
                            onClick={() => handleEliminar(user.id, user.usuario)}
                            disabled={user.usuario === 'admin' || user.usuario === usuarioLogueado}
                            title={
                              user.usuario === 'admin' 
                                ? 'No se puede eliminar el administrador por defecto' 
                                : user.usuario === usuarioLogueado 
                                ? 'No puedes eliminar tu propio usuario en sesión' 
                                : 'Eliminar usuario'
                            }
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#666', padding: 30 }}>
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className="col-md-5">
          <div className="card-custom">
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>➕ Registrar Nuevo Usuario</h5>
            
            <form onSubmit={handleRegistrar}>
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="input-custom"
                placeholder="Ej. Juan Pérez"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />

              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="input-custom"
                placeholder="Ej. jperez (letras, números y guiones)"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
              />

              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="input-custom"
                placeholder="Mínimo 4 caracteres"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn-principal"
                style={{ width: '100%', marginTop: 10 }}
                disabled={registrando}
              >
                {registrando ? '⏳ Registrando...' : '👤 Crear Cuenta'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}
