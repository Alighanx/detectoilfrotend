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

  const inputRef = useRef(null)

  function handleArchivo(e) {
    const archivoSeleccionado = e.target.files[0]
    if (!archivoSeleccionado) return

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
      setError('Error al conectar con el servidor.')
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <>
      <h1 className="seccion-titulo">🛢️ Nueva Detección</h1>
      <p className="seccion-subtitulo">
        Carga una imagen satelital para detectar derrames de petróleo
      </p>

      <div className="row g-3">

        {/* Columna izquierda */}
        <div className="col-md-6">
          <div className="card-custom">
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>📁 Cargar Imagen</h5>

            <div className="zona-carga" onClick={() => inputRef.current.click()}>
              <span className="zona-carga-icon">🛰️</span>
              <p style={{ color: '#aaa', margin: 0 }}>
                Haz clic aquí para seleccionar<br />una imagen satelital
              </p>
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: 8 }}>
                Formatos: JPG, PNG, TIF
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
              <img
              src={preview}
              alt="Vista previa"
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'contain',
                borderRadius: 10,
                marginTop: 15,
                background: '#0f241c'
              }}
            />
            )}

            <div style={{ marginTop: 20 }}>
              <label className="form-label">Fecha de captura</label>
              <input
                type="date"
                className="input-custom"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />

              <label className="form-label">Zona de monitoreo</label>
              <select
                className="input-custom"
                value={zona}
                onChange={e => setZona(e.target.value)}
              >
                <option value="">Selecciona una zona...</option>
                <option value="Loreto, Perú">Loreto, Perú</option>
                <option value="Napo, Ecuador">Napo, Ecuador</option>
                <option value="Sucumbíos, Ecuador">Sucumbíos, Ecuador</option>
                <option value="Putumayo, Colombia">Putumayo, Colombia</option>
              </select>
            </div>

            <button
              className="btn-principal"
              onClick={handleAnalizar}
              disabled={analizando}
            >
              {analizando ? '⏳ Analizando...' : '🔍 Analizar Imagen'}
            </button>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-md-6">
          <div className="card-custom" style={{ minHeight: 300 }}>
            <h5 style={{ color: '#ccc', marginBottom: 20 }}>📊 Resultado del Análisis</h5>

            {analizando && (
              <>
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                  Procesando imagen con modelo IA...
                </p>
                <div className="barra-wrapper">
                  <div className="barra-fill" style={{ width: `${progreso}%` }} />
                </div>
              </>
            )}

            {error && (
              <p style={{ color: '#ff6b6b', marginTop: 15 }}>
                ❌ {error}
              </p>
            )}

            {resultado && (
              <div style={{ marginTop: 20 }}>
                <p style={{
                  color: resultado.clase_tecnica === 'oil' ? '#ff6b6b' : '#00d084',
                  fontWeight: 700,
                  fontSize: '1.1rem'
                }}>
                  {resultado.clase_tecnica === 'oil' ? '⚠️' : '✅'} {resultado.resultado}
                </p>

                <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <span style={{ color: '#888' }}>Confianza IA:</span>{' '}
                    <strong style={{ color: '#fff' }}>{resultado.confianza}%</strong>
                  </div>

                  <div>
                    <span style={{ color: '#888' }}>Probabilidad de derrame:</span>{' '}
                    <strong style={{ color: '#fff' }}>{resultado.probabilidad_derrame}%</strong>
                  </div>

                  <div>
                    <span style={{ color: '#888' }}>Probabilidad sin derrame:</span>{' '}
                    <strong style={{ color: '#fff' }}>{resultado.probabilidad_sin_derrame}%</strong>
                  </div>

                  <div>
                    <span style={{ color: '#888' }}>Fecha de captura:</span>{' '}
                    <strong style={{ color: '#fff' }}>{fecha || 'No especificada'}</strong>
                  </div>

                  <div>
                    <span style={{ color: '#888' }}>Zona monitoreada:</span>{' '}
                    <strong style={{ color: '#fff' }}>{zona || 'No especificada'}</strong>
                  </div>
                </div>
              </div>
            )}

            {!analizando && !resultado && !error && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
                <span style={{ fontSize: '3rem' }}>🤖</span>
                <p style={{ marginTop: 10 }}>
                  El resultado aparecerá aquí<br />después de analizar la imagen
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
