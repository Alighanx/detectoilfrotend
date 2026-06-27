import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

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
    }, 40)
    return () => clearInterval(timer)
  }, [meta])

  return <span>{valor}{sufijo}</span>
}

export default function Inicio() {
  const [stats, setStats] = useState({
    total_analisis: 0,
    derrames: 0,
    alertas_criticas: 0,
    area_afectada: 0,
    precision_promedio: 0
  })
  const [actividad, setActividad] = useState([])
  const [loading, setLoading] = useState(true)

  // Variables climatológicas simuladas tipo SENAMHI
  const [tempAgua, setTempAgua] = useState(24.5)
  const [humedad, setHumedad] = useState(85)
  const [nivelRio, setNivelRio] = useState(112.4)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : '';
        const API_URL = apiBase ? `${apiBase}/api` : '/api';

        const resStats = await fetch(`${API_URL}/stats`)
        const dataStats = await resStats.json()

        const resAct = await fetch(`${API_URL}/actividad`)
        const dataAct = await resAct.json()

        if (dataStats.success) {
          setStats({
            total_analisis: dataStats.total_analisis,
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
        console.error('Error al cargar datos:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()

    const interval = setInterval(() => {
      setTempAgua(prev => roundToDecimals(prev + (Math.random() - 0.5) * 0.2, 1))
      setHumedad(prev => Math.min(100, Math.max(50, Math.round(prev + (Math.random() - 0.5) * 2))))
      setNivelRio(prev => roundToDecimals(prev + (Math.random() - 0.5) * 0.05, 2))
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals)
    return Math.round(num * factor) / factor
  }

  const STATS_CARDS = [
    { 
      icono: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ), 
      color: 'verde', 
      meta: stats.total_analisis, 
      label: 'Análisis Totales' 
    },
    { 
      icono: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
        </svg>
      ), 
      color: 'rojo', 
      meta: stats.alertas_criticas, 
      label: 'Alertas Críticas' 
    },
    { 
      icono: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ), 
      color: 'amarillo', 
      meta: stats.area_afectada, 
      label: 'Área Estimada km²' 
    },
    { 
      icono: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
      ), 
      color: 'azul', 
      meta: stats.precision_promedio, 
      label: 'Fiabilidad Promedio', 
      sufijo: '%' 
    },
  ]

  const nombreUsuario = localStorage.getItem('nombre') || 'Usuario'

  return (
    <>
      {/* Page header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 className="seccion-titulo">Panel de Control</h1>
          <p className="seccion-subtitulo" style={{ marginBottom: 0 }}>
            Visualización general de telemetría y diagnóstico de hidrocarburos.
          </p>
        </div>
        <div style={{
          background: 'rgba(6, 182, 212, 0.05)',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          padding: '10px 18px',
          borderRadius: 12,
          fontSize: '0.86rem',
          color: 'var(--color-texto)',
          fontWeight: 600
        }}>
          Estación: <strong style={{ color: 'var(--color-acento)' }}>🛰️ Red de Monitoreo Activa</strong>
        </div>
      </div>

      {/* Banner / Connection Health */}
      <div 
        className="card-custom" 
        style={{
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, var(--color-card) 100%)',
          borderLeft: '4px solid var(--color-primario)',
          padding: '20px 24px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div>
          <h4 style={{ margin: 0, color: 'var(--color-texto)', fontSize: '1.1rem', fontWeight: 700 }}>Conexión Establecida, {nombreUsuario}</h4>
          <p style={{ margin: '4px 0 0', color: 'var(--color-texto-muted)', fontSize: '0.84rem' }}>
            Último barrido orbital de Sentinel-2 sincronizado y almacenado en base de datos.
          </p>
        </div>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--color-primario)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '6px 12px',
          borderRadius: 99,
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span className="live-pulse-dot" />
          SISTEMA ONLINE
        </span>
      </div>

      {/* Fila de estadísticas */}
      <div className="row g-3 mb-4">
        {STATS_CARDS.map((s, i) => (
          <div className="col-md-3 col-sm-6" key={i}>
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
          <div className="card-custom" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ marginBottom: 12, color: 'var(--color-texto)', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.05rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--color-acento)' }}>🌡️</span> Variables Ambientales en Tiempo Real
            </h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-texto-muted)', marginBottom: 24 }}>
              Telemetría de estaciones hidrométricas y sensores satelitales integrados:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
              
              {/* Variable 1: Caudal */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <span style={{ color: 'var(--color-texto)', fontSize: '0.86rem', fontWeight: 600 }}>Nivel Hidrométrico</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-texto-muted)', display: 'block' }}>Rango óptimo: 100m - 120m</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-texto)' }}>{nivelRio} m</strong>
                </div>
                {/* Visual bar range */}
                <div style={{ height: '6px', background: 'var(--border-glass)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (nivelRio / 130) * 100)}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: 99 }} />
                </div>
              </div>

              {/* Variable 2: Temperatura */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <span style={{ color: 'var(--color-texto)', fontSize: '0.86rem', fontWeight: 600 }}>Temperatura Superficial</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-texto-muted)', display: 'block' }}>Sensor subacuático calibrado</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-texto)' }}>{tempAgua} °C</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--border-glass)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, (tempAgua / 35) * 100)}%`, background: 'linear-gradient(90deg, #10b981, #f59e0b)', borderRadius: 99 }} />
                </div>
              </div>

              {/* Variable 3: Humedad */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <span style={{ color: 'var(--color-texto)', fontSize: '0.86rem', fontWeight: 600 }}>Humedad Relativa</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-texto-muted)', display: 'block' }}>Sensor higrométrico ambiental</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-texto)' }}>{humedad}%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--border-glass)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${humedad}%`, background: 'linear-gradient(90deg, #06b6d4, #6366f1)', borderRadius: 99 }} />
                </div>
              </div>

              {/* Variable 4: Calidad general */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-card)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-glass)' }}>
                <div>
                  <span style={{ color: 'var(--color-texto)', fontSize: '0.86rem', fontWeight: 600 }}>Estado Sanitario del Ecosistema</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-texto-muted)', display: 'block' }}>Monitoreo integrado por IA</span>
                </div>
                {stats.alertas_criticas > 0 ? (
                  <span className="badge-estado badge-alto" style={{ animation: 'threatPulse 2s infinite' }}>⚠️ ALERTA</span>
                ) : (
                  <span className="badge-estado badge-bajo">🟢 ÓPTIMO</span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Tabla de actividad reciente */}
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ marginBottom: 12, color: 'var(--color-texto)', display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.05rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--color-acento)' }}>📋</span> Registros Recientes en Base de Datos
            </h5>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-texto-muted)', marginBottom: 20 }}>
              Últimas 4 detecciones registradas por analistas:
            </p>
            
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton-table-row">
                    <div className="skeleton skeleton-table-cell" />
                    <div className="skeleton skeleton-table-cell" />
                    <div className="skeleton skeleton-table-cell" />
                    <div className="skeleton skeleton-table-cell" />
                  </div>
                ))}
              </div>
            ) : actividad.length > 0 ? (
              <div className="tabla-custom-wrapper" style={{ flex: 1 }}>
                <table className="tabla-custom" style={{ fontSize: '0.82rem' }}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Lugar</th>
                      <th>Área</th>
                      <th>Severidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividad.map((a, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{a.fecha}</td>
                        <td style={{ color: 'var(--color-texto)', fontWeight: 600 }}>{a.lugar}</td>
                        <td>{a.area}</td>
                        <td>
                          <span className={`badge-estado badge-${a.nivel}`}>
                            {a.nivel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ margin: 'auto 0', textAlign: 'center', padding: '40px 20px', color: 'var(--color-texto-muted)' }}>
                <span style={{ fontSize: '0.86rem' }}>Sin análisis en base de datos. Completa un diagnóstico para poblar la lista.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Gráficos Estadísticos */}
      <div className="row g-4 mt-2" style={{ marginBottom: '2rem' }}>
        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%', maxHeight: '420px', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ marginBottom: 16, color: 'var(--color-texto)', fontSize: '1.05rem', fontWeight: 700, flexShrink: 0 }}>
              🥧 Distribución de Derrames vs. No Derrames
            </h5>
            <div style={{ flex: 1, minHeight: '280px', maxHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {stats.total_analisis > 0 ? (
                <Pie
                  data={{
                    labels: ['Derrames Detectados', 'Zonas Limpias'],
                    datasets: [{
                      data: [stats.derrames, stats.total_analisis - stats.derrames],
                      backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                      ],
                      borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(16, 185, 129, 1)'
                      ],
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#64748b',
                          font: { size: 12 }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = ((context.raw / total) * 100).toFixed(1)
                            return `${context.label}: ${context.raw} (${percentage}%)`
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <p style={{ color: 'var(--color-texto-muted)', textAlign: 'center' }}>
                  No hay datos suficientes para mostrar el gráfico
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-custom" style={{ height: '100%', maxHeight: '420px', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ marginBottom: 16, color: 'var(--color-texto)', fontSize: '1.05rem', fontWeight: 700, flexShrink: 0 }}>
              📊 Distribución por Nivel de Alerta
            </h5>
            <div style={{ flex: 1, minHeight: '280px', maxHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {actividad.length > 0 ? (
                <Bar
                  data={{
                    labels: ['Alto', 'Medio', 'Bajo'],
                    datasets: [{
                      label: 'Cantidad de Alertas',
                      data: [
                        actividad.filter(a => a.nivel === 'alto').length,
                        actividad.filter(a => a.nivel === 'medio').length,
                        actividad.filter(a => a.nivel === 'bajo').length
                      ],
                      backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                      ],
                      borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(16, 185, 129, 1)'
                      ],
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          color: '#64748b'
                        },
                        grid: {
                          color: 'rgba(100, 116, 139, 0.12)'
                        }
                      },
                      x: {
                        ticks: {
                          color: '#64748b'
                        },
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                />
              ) : (
                <p style={{ color: 'var(--color-texto-muted)', textAlign: 'center' }}>
                  No hay datos suficientes para mostrar el gráfico
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-primario);
          animation: pulseGlow 1.8s infinite;
        }
        @keyframes pulseGlow {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes threatPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </>
  )
}
