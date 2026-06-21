// ============================================================
// Historial.jsx — Sección 3: Tabla con todos los análisis
// ============================================================
import { useState, useEffect } from 'react'

export default function Historial() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Carga los datos de la API al montar el componente
  useEffect(() => {
    async function cargarHistorial() {
      try {
        const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
        const API_URL = apiBase ? `${apiBase}/api` : '/api';
        
        const response = await fetch(`${API_URL}/historial`)
        if (!response.ok) {
          throw new Error('No se pudo establecer conexión con el servidor.')
        }
        const resData = await response.json()
        if (resData.success) {
          setDatos(resData.data)
        } else {
          setError(resData.message || 'Error al obtener el historial.')
        }
      } catch (err) {
        console.error(err)
        setError('Error de conexión al obtener el historial. Verifica que el servidor de base de datos esté activo.')
      } finally {
        setLoading(false)
      }
    }

    cargarHistorial()
  }, [])

  // Filtra las filas según el texto buscado (en cualquier columna)
  const datosFiltrados = datos.filter(d => {
    const fieldsToSearch = [
      d.id,
      d.fecha,
      d.lugar,
      d.area,
      d.confianza,
      d.nivel,
      d.resultado
    ].join(' ').toLowerCase();
    return fieldsToSearch.includes(busqueda.toLowerCase());
  })

  return (
    <>
      <h1 className="seccion-titulo">📊 Historial de Detecciones</h1>
      <p className="seccion-subtitulo">Registro en tiempo real de todos los análisis realizados en el sistema</p>

      {/* Barra de búsqueda */}
      <div className="card-custom" style={{ padding: '15px 20px', marginBottom: 15 }}>
        <input
          type="text"
          className="input-custom"
          placeholder="🔍 Buscar por fecha, ubicación o estado..."
          style={{ marginBottom: 0 }}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div className="card-custom">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#aaa' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 10 }}>⏳</span>
            Cargando historial de base de datos...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff6b6b' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 10 }}>⚠️</span>
            {error}
          </div>
        ) : (
          <table className="tabla-custom">
            <thead>
              <tr>
                <th>#</th><th>Fecha</th><th>Ubicación</th>
                <th>Área</th><th>Confianza IA</th><th>Severidad</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length > 0 ? (
                datosFiltrados.map(d => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.fecha}</td>
                    <td>{d.lugar}</td>
                    <td>{d.area}</td>
                    <td>{d.confianza}</td>
                    <td>
                      <span className={`badge-estado badge-${d.nivel}`}>
                        {d.nivel.charAt(0).toUpperCase() + d.nivel.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-principal btn-sm" 
                        onClick={() => setSelectedRecord(d)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* Mensaje cuando no hay resultados */
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#666', padding: 30 }}>
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setSelectedRecord(null)}>
          <div className="card-custom" style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #07130e 0%, #0a1c15 100%)',
            border: '1px solid rgba(111,141,255,0.25)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            padding: '30px',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 15 }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>🛰️ Detalle de Detección {selectedRecord.id}</h3>
              <button onClick={() => setSelectedRecord(null)} style={{
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1
              }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Resultado del Análisis:</span>
                <strong style={{
                  color: selectedRecord.nivel === 'alto' || selectedRecord.nivel === 'medio' ? '#ff6b6b' : '#00d084',
                  fontSize: '1.15rem'
                }}>
                  {selectedRecord.resultado || (selectedRecord.nivel === 'alto' || selectedRecord.nivel === 'medio' ? '⚠️ Derrame detectado' : '✅ Sin indicios de derrame')}
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Fecha de captura:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.fecha}</strong>
                </div>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Zona monitoreada:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.lugar}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Confianza IA:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.confianza}</strong>
                </div>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Área aproximada:</span>
                  <strong style={{ color: '#fff' }}>{selectedRecord.area || '0 km²'}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Probabilidad Derrame:</span>
                  <strong style={{ color: '#ff6b6b' }}>{selectedRecord.probabilidad_derrame ? `${selectedRecord.probabilidad_derrame}%` : selectedRecord.nivel === 'alto' ? '90%+' : '0%'}</strong>
                </div>
                <div>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Probabilidad Sin Derrame:</span>
                  <strong style={{ color: '#00d084' }}>{selectedRecord.probabilidad_sin_derrame ? `${selectedRecord.probabilidad_sin_derrame}%` : selectedRecord.nivel === 'bajo' ? '90%+' : '0%'}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: '#888', display: 'block', fontSize: '0.85rem' }}>Nivel de Severidad:</span>
                <span className={`badge-estado badge-${selectedRecord.nivel}`} style={{ marginTop: 5 }}>
                  {selectedRecord.nivel.charAt(0).toUpperCase() + selectedRecord.nivel.slice(1)}
                </span>
              </div>

              {selectedRecord.recomendacion && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', marginTop: 10 }}>
                  <span style={{ color: '#888', display: 'block', fontSize: '0.85rem', marginBottom: 5 }}>Recomendación:</span>
                  <p style={{ color: '#dde4f0', margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>{selectedRecord.recomendacion}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: 25, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-principal" onClick={() => setSelectedRecord(null)} style={{ background: '#2c3e50', boxShadow: 'none' }}>
                Cerrar Reporte
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
