// ============================================================
// NuevaDeteccion.jsx — Sección 2: Carga y análisis de imágenes
// ============================================================
import { useState, useRef } from 'react'

export default function NuevaDeteccion() {
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analizando, setAnalizando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [progreso, setProgreso] = useState(0)
  const [fecha, setFecha] = useState('')
  const [zona, setZona] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const inputRef = useRef(null)

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const archivoSeleccionado = e.dataTransfer.files[0]
    if (archivoSeleccionado) {
      procesarArchivo(archivoSeleccionado)
    }
  }

  function handleArchivo(e) {
    const archivoSeleccionado = e.target.files[0]
    if (archivoSeleccionado) {
      procesarArchivo(archivoSeleccionado)
    }
  }

  function procesarArchivo(archivoSeleccionado) {
    setArchivo(archivoSeleccionado)
    const lector = new FileReader()
    lector.onload = ev => setPreview(ev.target.result)
    lector.readAsDataURL(archivoSeleccionado)
    setResultado(null)
    setProgreso(0)
    setError('')
  }

  async function handleAnalizar() {
    if (!archivo) {
      alert('⚠️ Primero carga una imagen.')
      return
    }

    setAnalizando(true)
    setProgreso(20)
    setResultado(null)
    setError('')

    try {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
      const API_URL = apiBase ? `${apiBase}/api` : '/api';

      const formData = new FormData()
      formData.append('imagen', archivo)
      formData.append('fecha', fecha)
      formData.append('zona', zona)

      setProgreso(50)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData
      })

      setProgreso(85)

      const data = await response.json()

      if (data.success) {
        setResultado(data)
        setProgreso(100)
      } else {
        setError(data.message || 'No se pudo analizar la imagen.')
      }

    } catch (err) {
      console.error(err)
      setError('Error de conexión al conectar con el servidor de análisis.')
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <>
      <h1 className="seccion-titulo">🛢️ Nueva Detección</h1>
      <p className="seccion-subtitulo">
        Carga una imagen satelital para diagnosticar y detectar posibles derrames de petróleo mediante IA
      </p>

      <div className="row g-4">

        {/* Columna izquierda */}
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%' }}>
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>📁 Cargar Imagen Satelital</h5>

            <div 
              className={`zona-carga ${isDragging ? 'arrastrando' : ''}`} 
              onClick={() => inputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #22c7ff' : '2px dashed rgba(255,255,255,0.15)',
                background: isDragging ? 'rgba(34,199,255,0.08)' : 'rgba(255,255,255,0.01)',
                transition: 'all 0.25s ease'
              }}
            >
              <span className="zona-carga-icon" style={{ transform: isDragging ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.25s' }}>🛰️</span>
              <p style={{ color: '#aaa', margin: 0 }}>
                {isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
              </p>
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: 8 }}>
                Formatos soportados: JPG, PNG, TIF (Escala de grises)
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleArchivo}
            />

            {preview && (
              <div style={{ textAlign: 'center', marginTop: 15 }}>
                <span style={{ fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: 6 }}>Vista previa de la captura satelital:</span>
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'contain',
                    borderRadius: 12,
                    background: '#0f241c',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: 20 }}>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Fecha de Captura</label>
                  <input
                    type="date"
                    className="input-custom"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    style={{ borderRadius: 12 }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Zona de Monitoreo</label>
                  <select
                    className="input-custom"
                    value={zona}
                    onChange={e => setZona(e.target.value)}
                    style={{ borderRadius: 12 }}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Loreto, Perú">Loreto, Perú</option>
                    <option value="Napo, Ecuador">Napo, Ecuador</option>
                    <option value="Sucumbíos, Ecuador">Sucumbíos, Ecuador</option>
                    <option value="Putumayo, Colombia">Putumayo, Colombia</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              className="btn-principal"
              onClick={handleAnalizar}
              disabled={analizando}
              style={{ width: '100%', justifyContent: 'center', borderRadius: 12, marginTop: 10 }}
            >
              {analizando ? '⏳ Procesando Diagnóstico IA...' : '🔍 Ejecutar Análisis Científico'}
            </button>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="card-custom" style={{ minHeight: '350px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>📊 Diagnóstico e Informe del Modelo</h5>

            {analizando && (
              <div style={{ margin: 'auto 0', textAlign: 'center' }}>
                <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: 12 }}>
                  Procesando bandas espectrales de la imagen...
                </p>
                <div className="barra-wrapper" style={{ borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                  <div className="barra-fill" style={{ width: `${progreso}%`, borderRadius: 999, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ color: '#22c7ff', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginTop: 10 }}>{progreso}%</span>
              </div>
            )}

            {error && (
              <div style={{ margin: 'auto 0', textAlign: 'center', padding: 20 }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 10 }}>❌</span>
                <p style={{ color: '#ff6b6b', margin: 0 }}>{error}</p>
              </div>
            )}

            {resultado && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                
                {/* Cabecera del diagnóstico */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 15 }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#9bb0c8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnóstico Técnico</span>
                    <h4 style={{
                      color: resultado.clase_tecnica === 'oil' ? '#ff6b6b' : '#00d084',
                      fontWeight: 700,
                      margin: 0,
                      fontSize: '1.25rem'
                    }}>
                      {resultado.clase_tecnica === 'oil' ? '🚨 ' : '🌿 '} {resultado.resultado}
                    </h4>
                  </div>
                  <span className={`badge-estado badge-${resultado.nivel_alerta.toLowerCase()}`}>
                    Severidad: {resultado.nivel_alerta}
                  </span>
                </div>

                {/* Dona SVG de confianza */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: '10px 0' }}>
                  <svg width="110" height="110" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke={resultado.clase_tecnica === 'oil' ? '#ff6b6b' : '#00d084'}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - resultado.confianza / 100)}
                      style={{
                        transition: 'stroke-dashoffset 1.5s ease-in-out',
                        strokeLinecap: 'round'
                      }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                      {resultado.confianza}%
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#9bb0c8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      IA Confianza
                    </span>
                  </div>
                </div>

                {/* Barras de probabilidad comparativas */}
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: '#ff6b6b', fontWeight: 600 }}>Derrame detectado:</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{resultado.probabilidad_derrame}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${resultado.probabilidad_derrame}%`, background: '#ff6b6b', borderRadius: 999, transition: 'width 1s ease' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ color: '#00d084', fontWeight: 600 }}>Sin indicios (Limpio):</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{resultado.probabilidad_sin_derrame}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${resultado.probabilidad_sin_derrame}%`, background: '#00d084', borderRadius: 999, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Detalles y ubicación */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 10, fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: '#666', display: 'block' }}>Zona:</span>
                    <strong style={{ color: '#fff' }}>{zona || 'No especificada'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#666', display: 'block' }}>Fecha de Captura:</span>
                    <strong style={{ color: '#fff' }}>{fecha || 'No especificada'}</strong>
                  </div>
                </div>

                {/* Protocolo de Emergencia Ambiental */}
                <div style={{
                  padding: 16,
                  borderRadius: 12,
                  background: resultado.clase_tecnica === 'oil' 
                    ? 'rgba(192, 57, 43, 0.07)' 
                    : 'rgba(13, 110, 63, 0.07)',
                  border: resultado.clase_tecnica === 'oil' 
                    ? '1px dashed rgba(255, 107, 107, 0.35)' 
                    : '1px dashed rgba(0, 208, 132, 0.35)',
                  animation: resultado.clase_tecnica === 'oil' ? 'alertPulse 2.5s infinite' : 'none'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: resultado.clase_tecnica === 'oil' ? '#ff6b6b' : '#00d084',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 6
                  }}>
                    📢 Protocolo de Emergencia ({resultado.nivel_alerta})
                  </span>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#dde4f0', lineHeight: 1.5 }}>
                    {resultado.recomendacion}
                  </p>
                </div>

              </div>
            )}

            {!analizando && !resultado && !error && (
              <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 20px', color: '#555' }}>
                <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 15 }}>🤖</span>
                <p style={{ marginTop: 0, fontSize: '0.92rem' }}>
                  El resultado y el reporte climatológico aparecerán aquí<br />después de procesar la imagen satelital.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes alertPulse {
          0% { border-color: rgba(255, 107, 107, 0.35); background-color: rgba(192, 57, 43, 0.07); }
          50% { border-color: rgba(255, 107, 107, 0.7); background-color: rgba(192, 57, 43, 0.12); }
          100% { border-color: rgba(255, 107, 107, 0.35); background-color: rgba(192, 57, 43, 0.07); }
        }
      `}</style>
    </>
  )
}
