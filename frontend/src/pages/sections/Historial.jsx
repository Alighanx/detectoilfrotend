import { useState, useEffect } from 'react'

export default function Historial() {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const rol = localStorage.getItem('rol') || 'usuario'

  async function handleEliminarHistorial(id) {
    const numericId = typeof id === 'string' ? parseInt(id.replace('#', ''), 10) : id;
    
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el registro #${numericId}?`)) {
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';

      const response = await fetch(`${API_URL}/historial/${numericId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        alert('Registro de detección eliminado con éxito.');
        setDatos(prev => prev.filter(item => {
          const itemNumId = typeof item.id === 'string' ? parseInt(item.id.replace('#', ''), 10) : item.id;
          return itemNumId !== numericId;
        }));
      } else {
        alert(data.message || 'No se pudo eliminar el registro.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al eliminar el registro.');
    }
  }

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
      <h1 className="seccion-titulo">Historial de Detecciones</h1>
      <p className="seccion-subtitulo">Registro histórico de imágenes analizadas y diagnósticos almacenados</p>

      {/* Glowing Search Filter */}
      <div className="card-custom" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 16, opacity: 0.6, fontSize: '0.9rem' }}>🔍</span>
          <input
            type="text"
            className="input-custom"
            placeholder="Buscar por fecha de captura, zona de monitoreo, severidad..."
            style={{ paddingLeft: 44, marginBottom: 0 }}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Database Table Container */}
      <div className="card-custom">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--color-texto-muted)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>⏳</span>
            Sincronizando registros con la base de datos central...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-peligro)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>⚠️</span>
            {error}
          </div>
        ) : (
          <div className="tabla-custom-wrapper">
            <table className="tabla-custom">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Fecha Captura</th>
                  <th>Ubicación / Sector</th>
                  <th>Área Afectada</th>
                  <th>Fiabilidad IA</th>
                  <th>Nivel Severidad</th>
                  <th>Operador</th>
                  <th style={{ textAlign: 'center', width: '165px', minWidth: '165px' }}>Ficha / Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--color-acento)' }}>#{d.id}</td>
                      <td>{d.fecha}</td>
                      <td style={{ color: '#fff', fontWeight: 600 }}>{d.lugar}</td>
                      <td>{d.area}</td>
                      <td style={{ fontWeight: 600 }}>{d.confianza}%</td>
                      <td>
                        <span className={`badge-estado badge-${d.nivel}`}>
                          {d.nivel}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#e2e8f0' }}>@{d.usuario}</td>
                      <td style={{ textAlign: 'center', width: '165px', minWidth: '165px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <button 
                            className="btn-principal btn-sm" 
                            onClick={() => setSelectedRecord(d)}
                            style={{
                              background: 'rgba(6, 182, 212, 0.15)',
                              color: 'var(--color-acento)',
                              border: '1px solid rgba(6, 182, 212, 0.25)',
                              boxShadow: 'none',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = 'var(--color-acento)'
                              e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)'
                              e.currentTarget.style.color = 'var(--color-acento)'
                            }}
                          >
                            Ver Reporte
                          </button>
                          {rol === 'admin' && (
                            <button
                              className="btn-principal btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEliminarHistorial(d.id);
                              }}
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--color-peligro)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                boxShadow: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 30,
                                height: 30,
                                padding: 0,
                                flexShrink: 0
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--color-peligro)'
                                e.currentTarget.style.color = '#fff'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
                                e.currentTarget.style.color = 'var(--color-peligro)'
                              }}
                              title="Eliminar esta detección de la base de datos"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-texto-muted)', padding: 36 }}>
                      No se encontraron registros de telemetría coincidentes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Official Spectral Incident Report Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => setSelectedRecord(null)}>
          <div className="card-custom" style={{
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(9, 18, 33, 0.96)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.15), 0 30px 70px rgba(0,0,0,0.5)',
            padding: 0,
            borderRadius: 20,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              borderBottom: '1px solid rgba(255,255,255,0.06)', 
              padding: '20px 24px',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>🛰️ Reporte de Diagnóstico Satelital</h3>
                <small style={{ color: 'var(--color-acento)', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Ficha Oficial de Incidencia #{selectedRecord.id}
                </small>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-texto-muted)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {/* Technical Verdict */}
              <div style={{ 
                borderLeft: `4px solid ${selectedRecord.nivel === 'alto' || selectedRecord.nivel === 'medio' ? 'var(--color-peligro)' : 'var(--color-primario)'}`,
                paddingLeft: 14,
                background: 'rgba(255,255,255,0.01)',
                paddingTop: 8,
                paddingBottom: 8
              }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnóstico Espectral</span>
                <strong style={{
                  color: selectedRecord.nivel === 'alto' || selectedRecord.nivel === 'medio' ? 'var(--color-peligro)' : 'var(--color-primario)',
                  fontSize: '1.15rem',
                  display: 'block',
                  marginTop: 2
                }}>
                  {selectedRecord.resultado || (selectedRecord.nivel === 'alto' || selectedRecord.nivel === 'medio' ? 'Derrame de Petróleo Detectado' : 'Zona Libre de Hidrocarburos')}
                </strong>
              </div>

              {/* Grid 1: Geographics & Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Fecha de captura</span>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedRecord.fecha}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Zona de Monitoreo</span>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedRecord.lugar}</strong>
                </div>
              </div>

              {/* Grid 2: Area & Confidence */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Área Estimada</span>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedRecord.area || 'N/A (Limpio)'}</strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Fiabilidad de la IA</span>
                  <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedRecord.confianza}%</strong>
                </div>
              </div>

              {/* Grid 3: Probability Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Probabilidad Hidrocarburo</span>
                  <strong style={{ color: 'var(--color-peligro)', fontSize: '0.9rem' }}>
                    {selectedRecord.probabilidad_derrame ? `${selectedRecord.probabilidad_derrame}%` : selectedRecord.nivel === 'alto' ? '92%' : '4%'}
                  </strong>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 2 }}>Probabilidad Zona Limpia</span>
                  <strong style={{ color: 'var(--color-primario)', fontSize: '0.9rem' }}>
                    {selectedRecord.probabilidad_sin_derrame ? `${selectedRecord.probabilidad_sin_derrame}%` : selectedRecord.nivel === 'bajo' ? '96%' : '8%'}
                  </strong>
                </div>
              </div>

              {/* Severity Category & Analyst */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 6 }}>Nivel de Gravedad Asignado</span>
                  <span className={`badge-estado badge-${selectedRecord.nivel}`}>
                    {selectedRecord.nivel}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.74rem', marginBottom: 6 }}>Analista Registrador</span>
                  <strong style={{ color: '#fff', fontSize: '0.94rem', display: 'inline-block', marginTop: 4 }}>@{selectedRecord.usuario}</strong>
                </div>
              </div>

              {/* Action recommendation */}
              {selectedRecord.recomendacion && (
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  padding: 16, 
                  borderRadius: 12, 
                  border: '1px dashed rgba(255,255,255,0.08)' 
                }}>
                  <span style={{ color: 'var(--color-acento)', display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                    📋 Medidas de Mitigación Recomendadas
                  </span>
                  <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.86rem', lineHeight: 1.5 }}>
                    {selectedRecord.recomendacion}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ 
              background: 'rgba(255,255,255,0.01)', 
              borderTop: '1px solid rgba(255,255,255,0.05)', 
              padding: '16px 24px', 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <button 
                className="btn-principal" 
                onClick={() => setSelectedRecord(null)} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  color: '#fff', 
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.08)' 
                }}
              >
                Cerrar Reporte
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
