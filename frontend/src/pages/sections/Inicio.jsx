// ============================================================
// Inicio.jsx — Sección 1: Panel principal con estadísticas
// ============================================================
import { useEffect, useState } from 'react'

// Componente de contador animado
function Contador({ meta, sufijo = '' }) {
  const [valor, setValor] = useState(0)

  useEffect(() => {
    let actual = 0
    if (meta === 0) {
      setValor(0)
      return
    }
    const paso = Math.ceil(meta / 40) || 1
    const timer = setInterval(() => {
      actual += paso
      if (actual >= meta) { 
        actual = meta
        clearInterval(timer) 
      }
      setValor(actual)
    }, 45)
    return () => clearInterval(timer)
  }, [meta])

  return <span>{valor}{sufijo}</span>
}

export default function Inicio() {
  const [stats, setStats] = useState({
    derrames: 0,
    alertas_criticas: 0,
    area_afectada: 0,
    precision_promedio: 0
  })
  const [actividad, setActividad] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Variables climatológicas simuladas tipo SENAMHI
  const [tempAgua, setTempAgua] = useState(24.5)
  const [humedad, setHumedad] = useState(85)
  const [nivelRio, setNivelRio] = useState(112.4)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
        const API_URL = apiBase ? `${apiBase}/api` : '/api';

        // Cargar Estadísticas
        const resStats = await fetch(`${API_URL}/stats`)
        const dataStats = await resStats.json()

        // Cargar Actividad Reciente
        const resAct = await fetch(`${API_URL}/actividad`)
        const dataAct = await resAct.json()

        if (dataStats.success) {
          setStats({
            derrames: dataStats.derrames,
            alertas_criticas: dataStats.alertas_criticas,
            area_afectada: dataStats.area_afectada,
            precision_promedio: dataStats.precision_promedio
          })
        }
        if (dataAct.success) {
          setActividad(dataAct.data)
        }
      } catch (err) {
        console.error(err)
        setError('Error al conectar con la base de datos de monitoreo.')
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()

    // Simular variaciones ligeras en variables de SENAMHI cada 5 segundos
    const interval = setInterval(() => {
      setTempAgua(prev => roundToDecimals(prev + (Math.random() - 0.5) * 0.2, 1))
      setHumedad(prev => Math.min(100, Math.max(50, Math.round(prev + (Math.random() - 0.5) * 2))))
      setNivelRio(prev => roundToDecimals(prev + (Math.random() - 0.5) * 0.05, 2))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals)
    return Math.round(num * factor) / factor
  }

  // Tarjetas estadísticas adaptadas
  const STATS_CARDS = [
    { icono: '🛢️', color: 'verde',    meta: stats.derrames,  label: 'Derrames detectados' },
    { icono: '⚠️', color: 'rojo',     meta: stats.alertas_criticas, label: 'Alertas críticas' },
    { icono: '🌿', color: 'amarillo', meta: stats.area_afectada, label: 'km² afectados' },
    { icono: '🤖', color: 'azul',     meta: stats.precision_promedio, label: 'Confianza IA Promedio', sufijo: '%' },
  ]

  const nombreUsuario = localStorage.getItem('nombre') || 'Usuario'

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <h1 className="seccion-titulo">🏠 Panel de Monitoreo</h1>
          <p className="seccion-subtitulo">Resumen general del Sistema de Alerta Temprana de Hidrocarburos</p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '10px 18px',
          borderRadius: 14,
          fontSize: '0.9rem',
          color: '#dde4f0'
        }}>
          Estación activa: <strong style={{ color: '#00d084' }}>🛰️ Loreto-Napo</strong>
        </div>
      </div>

      {/* Banner de Bienvenida y Estado del Sistema */}
      <div className="card-custom" style={{
        background: 'linear-gradient(90deg, rgba(13,110,63,0.15) 0%, rgba(10,18,28,0.95) 100%)',
        borderLeft: '4px solid #00d084',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 15
      }}>
        <div>
          <h4 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>Bienvenido/a, {nombreUsuario}</h4>
          <p style={{ margin: '5px 0 0', color: '#9bb0c8', fontSize: '0.88rem' }}>
            Última sincronización satelital realizada con éxito en la cuenca amazónica.
          </p>
        </div>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          background: 'rgba(0, 208, 132, 0.15)',
          color: '#00d084',
          padding: '6px 12px',
          borderRadius: 999,
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d084', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          SISTEMA OPERATIVO
        </span>
      </div>

      {/* Fila de estadísticas */}
      <div className="row g-3 mb-4">
        {STATS_CARDS.map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card-custom" style={{ marginBottom: 0 }}>
              <div className="stat-card">
                <div className={`stat-icon ${s.color}`}>{s.icono}</div>
                <div>
                  <div className="stat-numero">
                    <Contador meta={s.meta} sufijo={s.sufijo} />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Monitoreo Ambiental Estilo SENAMHI */}
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%' }}>
            <h5 style={{ marginBottom: 20, color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>🌡️</span> Variables Ambientales Auxiliares (Amazonía)
            </h5>
            <p style={{ fontSize: '0.84rem', color: '#9bb0c8', marginBottom: 20 }}>
              Telemetría local en tiempo real provista por estaciones hidrométricas asociadas:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Variable 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div>
                  <span style={{ color: '#8fa3b7', fontSize: '0.88rem', display: 'block' }}>Nivel del Río (Caudal)</span>
                  <span style={{ fontSize: '0.76rem', color: '#666' }}>Estación Hidrométrica Río Napo</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>{nivelRio} m</span>
                  <span style={{ color: '#00d084', fontSize: '0.76rem', display: 'block' }}>📈 +0.02 (Normal)</span>
                </div>
              </div>

              {/* Variable 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div>
                  <span style={{ color: '#8fa3b7', fontSize: '0.88rem', display: 'block' }}>Temperatura del Agua</span>
                  <span style={{ fontSize: '0.76rem', color: '#666' }}>Sensor térmico subacuático</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>{tempAgua} °C</span>
                  <span style={{ color: '#f0a500', fontSize: '0.76rem', display: 'block' }}>☀️ Promedio Estacional</span>
                </div>
              </div>

              {/* Variable 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div>
                  <span style={{ color: '#8fa3b7', fontSize: '0.88rem', display: 'block' }}>Humedad Relativa</span>
                  <span style={{ fontSize: '0.76rem', color: '#666' }}>Sensor higrométrico ambiente</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>{humedad}%</span>
                  <span style={{ color: '#6f8dff', fontSize: '0.76rem', display: 'block' }}>💧 Alta Nubosidad</span>
                </div>
              </div>

              {/* Variable 4 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#8fa3b7', fontSize: '0.88rem', display: 'block' }}>Estado de Calidad de Aguas</span>
                  <span style={{ fontSize: '0.76rem', color: '#666' }}>Monitoreo integrado IA</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {stats.alertas_criticas > 0 ? (
                    <>
                      <span style={{ fontSize: '1rem', color: '#ff6b6b', fontWeight: 700 }}>⚠️ Alerta de Derrame</span>
                      <span style={{ color: '#ff6b6b', fontSize: '0.76rem', display: 'block' }}>Requiere Verificación</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1rem', color: '#00d084', fontWeight: 700 }}>🟢 Óptima</span>
                      <span style={{ color: '#00d084', fontSize: '0.76rem', display: 'block' }}>Sin hidrocarburos</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de actividad reciente */}
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%', overflow: 'hidden' }}>
            <h5 style={{ marginBottom: 20, color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>📋</span> Actividad Reciente en Base de Datos
            </h5>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#aaa' }}>
                <span>⏳ Cargando actividad...</span>
              </div>
            ) : actividad.length > 0 ? (
              <table className="tabla-custom" style={{ fontSize: '0.88rem' }}>
                <thead>
                  <tr>
                    <th>Fecha</th><th>Ubicación</th><th>Área</th><th>Severidad</th>
                  </tr>
                </thead>
                <tbody>
                  {actividad.map((a, i) => (
                    <tr key={i}>
                      <td>{a.fecha}</td>
                      <td>{a.lugar}</td>
                      <td>{a.area}</td>
                      <td>
                        <span className={`badge-estado badge-${a.nivel}`} style={{ fontSize: '0.7rem', padding: '4px 10px' }}>
                          {a.nivel.charAt(0).toUpperCase() + a.nivel.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <span>No se registran análisis recientes. Realiza un análisis para poblar el historial.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 208, 132, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(0, 208, 132, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 208, 132, 0); }
        }
      `}</style>
    </>
  )
}
