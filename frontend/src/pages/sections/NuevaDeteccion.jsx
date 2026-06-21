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
      alert('⚠️ Por favor, cargue una imagen satelital primero.')
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
      <h1 className="seccion-titulo">Nueva Detección</h1>
      <p className="seccion-subtitulo">
        Carga una captura multiespectral para procesar mediante la Red Neuronal Convolucional (CNN).
      </p>

      <div className="row g-4">
        
        {/* Columna Izquierda: Input y Carga */}
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#fff', marginBottom: 16, fontSize: '1.05rem', fontWeight: 700 }}>
              📁 Adquisición Espectral de Imagen
            </h5>

            {/* Radar Sweep Upload Box */}
            <div 
              className="zona-carga" 
              onClick={() => inputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                border: isDragging ? '2px dashed var(--color-acento)' : '2px dashed rgba(6, 182, 212, 0.25)',
                background: isDragging ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0, 0, 0, 0.15)',
                padding: '44px 20px',
                overflow: 'hidden',
                borderRadius: 16,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
            >
              {/* Radar sweep scanning line overlay */}
              <div className="radar-sweep-line" style={{ display: isDragging ? 'block' : 'none' }} />

              <span className="zona-carga-icon" style={{ 
                transform: isDragging ? 'scale(1.2)' : 'scale(1)', 
                transition: 'transform 0.2s', 
                fontSize: '2.8rem' 
              }}>
                🛰️
              </span>
              <p style={{ color: '#e2e8f0', margin: '12px 0 0', fontWeight: 600, fontSize: '0.9rem' }}>
                {isDragging ? '¡Soltar imagen orbital!' : 'Arrastra tu archivo aquí o haz clic para buscar'}
              </p>
              <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.78rem', marginTop: 6 }}>
                Formatos recomendados: JPG, PNG o TIF multiespectral
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
              <div style={{ marginTop: 20 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-muted)', display: 'block', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Matriz Espectral de Entrada (Vista Previa):
                </span>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#040712',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={preview}
                    alt="Vista previa orbital"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                  {/* Scanner overlay effect on preview */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'var(--color-acento)',
                    boxShadow: '0 0 10px var(--color-acento)',
                    animation: 'scanLine 2.5s ease-in-out infinite'
                  }} />
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', paddingTop: 20 }}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.74rem' }}>Fecha de Captura</label>
                  <input
                    type="date"
                    className="input-custom"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontSize: '0.74rem' }}>Zona Geográfica</label>
                  <select
                    className="input-custom"
                    value={zona}
                    onChange={e => setZona(e.target.value)}
                    style={{ marginBottom: 0, background: 'rgba(9, 18, 33, 0.95)', color: '#fff', outline: 'none' }}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Loreto, Perú">Loreto, Perú</option>
                    <option value="Napo, Ecuador">Napo, Ecuador</option>
                    <option value="Sucumbíos, Ecuador">Sucumbíos, Ecuador</option>
                    <option value="Putumayo, Colombia">Putumayo, Colombia</option>
                  </select>
                </div>
              </div>

              <button
                className="btn-principal"
                onClick={handleAnalizar}
                disabled={analizando}
                style={{ width: '100%', justifyContent: 'center', height: 44, borderRadius: 10 }}
              >
                {analizando ? (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'orbitRotate 1.5s linear infinite' }}>
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    </svg>
                    <span>Ejecutando diagnóstico...</span>
                  </>
                ) : (
                  <>
                    <span>🔍 Ejecutar Análisis Espectral</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Reporte y Gráficas de Confianza */}
        <div className="col-md-6">
          <div className="card-custom" style={{ minHeight: '400px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#fff', marginBottom: 20, fontSize: '1.05rem', fontWeight: 700 }}>
              📊 Lectura de Diagnóstico IA
            </h5>

            {analizando && (
              <div style={{ margin: 'auto 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem', marginBottom: 12 }}>
                  Procesando firmas espectrales en red neuronal...
                </p>
                <div className="barra-wrapper">
                  <div className="barra-fill" style={{ width: `${progreso}%` }} />
                </div>
                <span style={{ color: 'var(--color-acento)', fontSize: '0.9rem', fontWeight: 700, display: 'block', marginTop: 10 }}>
                  {progreso}%
                </span>
              </div>
            )}

            {error && (
              <div style={{ margin: 'auto 0', textAlign: 'center', padding: 20 }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 10 }}>❌</span>
                <p style={{ color: 'var(--color-peligro)', margin: 0, fontWeight: 600 }}>{error}</p>
              </div>
            )}

            {resultado && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.5s ease' }}>
                
                {/* Diagnóstico Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                      Resultado del Diagnóstico
                    </span>
                    <h4 style={{
                      color: resultado.clase_tecnica === 'oil' ? 'var(--color-peligro)' : 'var(--color-primario)',
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      margin: '4px 0 0'
                    }}>
                      {resultado.clase_tecnica === 'oil' ? '🚨 ' : '🌿 '} {resultado.resultado}
                    </h4>
                  </div>
                  <span className={`badge-estado badge-${resultado.nivel_alerta.toLowerCase()}`}>
                    Severidad: {resultado.nivel_alerta}
                  </span>
                </div>

                {/* SVG Orbital Dona de Confianza */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: '14px 0' }}>
                  
                  {/* Glowing orbital tracker circle */}
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', position: 'relative' }}>
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke={resultado.clase_tecnica === 'oil' ? 'var(--color-peligro)' : 'var(--color-primario)'}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - resultado.confianza / 100)}
                      style={{
                        transition: 'stroke-dashoffset 1.5s ease-in-out',
                        strokeLinecap: 'round'
                      }}
                    />
                  </svg>
                  
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Outfit, sans-serif' }}>
                      {resultado.confianza}%
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--color-texto-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      Confianza IA
                    </span>
                  </div>
                </div>

                {/* Probability comparison bars */}
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--color-peligro)', fontWeight: 600 }}>Probabilidad de Hidrocarburo:</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{resultado.probabilidad_derrame}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${resultado.probabilidad_derrame}%`, background: 'var(--color-peligro)', borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--color-primario)', fontWeight: 600 }}>Probabilidad de Zona Limpia:</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>{resultado.probabilidad_sin_derrame}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${resultado.probabilidad_sin_derrame}%`, background: 'var(--color-primario)', borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Metadata details block */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 12, 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  padding: 14, 
                  borderRadius: 12, 
                  fontSize: '0.84rem',
                  border: '1px solid rgba(255,255,255,0.04)'
                }}>
                  <div>
                    <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.76rem' }}>Zona Registrada</span>
                    <strong style={{ color: '#fff' }}>{zona || 'No especificada'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-texto-muted)', display: 'block', fontSize: '0.76rem' }}>Fecha de Registro</span>
                    <strong style={{ color: '#fff' }}>{fecha || 'No especificada'}</strong>
                  </div>
                </div>

                {/* Emergency Protocol Notification widget */}
                <div style={{
                  padding: 18,
                  borderRadius: 12,
                  background: resultado.clase_tecnica === 'oil' 
                    ? 'rgba(239, 68, 68, 0.07)' 
                    : 'rgba(16, 185, 129, 0.07)',
                  border: resultado.clase_tecnica === 'oil' 
                    ? '1px dashed rgba(239, 68, 68, 0.35)' 
                    : '1px dashed rgba(16, 185, 129, 0.35)',
                  boxShadow: resultado.clase_tecnica === 'oil' ? '0 0 15px rgba(239, 68, 68, 0.15)' : 'none',
                  animation: resultado.clase_tecnica === 'oil' ? 'alertPulse 2s infinite' : 'none'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: resultado.clase_tecnica === 'oil' ? 'var(--color-peligro)' : 'var(--color-primario)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 8
                  }}>
                    📢 Protocolo de Emergencia ({resultado.nivel_alerta})
                  </span>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.5, fontWeight: 500 }}>
                    {resultado.recomendacion}
                  </p>
                </div>

              </div>
            )}

            {!analizando && !resultado && !error && (
              <div style={{ textAlign: 'center', margin: 'auto 0', padding: '40px 20px', color: 'var(--color-texto-muted)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: 16 }}>🤖</span>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  El diagnóstico espectral y el reporte del modelo se presentarán aquí una vez procesada la captura.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .radar-sweep-line {
          position: absolute;
          width: 200%;
          height: 200%;
          background: linear-gradient(0deg, rgba(6, 182, 212, 0.1) 0%, transparent 60%);
          top: -50%;
          left: -50%;
          transform-origin: center center;
          animation: sweepRadar 4s infinite linear;
          pointer-events: none;
        }
        @keyframes sweepRadar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes alertPulse {
          0% { border-color: rgba(239, 68, 68, 0.35); background-color: rgba(239, 68, 68, 0.05); }
          50% { border-color: rgba(239, 68, 68, 0.65); background-color: rgba(239, 68, 68, 0.12); }
          100% { border-color: rgba(239, 68, 68, 0.35); background-color: rgba(239, 68, 68, 0.05); }
        }
      `}</style>
    </>
  )
}
