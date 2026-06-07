// ============================================================
// Inicio.jsx — Sección 1: Panel principal con estadísticas
// ============================================================
import { useEffect, useState } from 'react'

// Datos de las tarjetas estadísticas
const STATS = [
  { icono: '🛢️', color: 'verde',    meta: 42,  label: 'Derrames detectados' },
  { icono: '⚠️', color: 'rojo',     meta: 8,   label: 'Alertas críticas' },
  { icono: '🌿', color: 'amarillo', meta: 134, label: 'km² afectados' },
  { icono: '🤖', color: 'azul',     meta: 92,  label: 'Precisión del modelo', sufijo: '%' },
]

// Registros de actividad reciente (datos de ejemplo)
const ACTIVIDAD = [
  { fecha: '2025-05-10', lugar: 'Loreto, Perú',       area: '3.2 km²', nivel: 'alto' },
  { fecha: '2025-05-08', lugar: 'Napo, Ecuador',       area: '1.5 km²', nivel: 'medio' },
  { fecha: '2025-05-05', lugar: 'Sucumbíos, Ecuador',  area: '0.8 km²', nivel: 'bajo' },
]

// Componente de contador animado
function Contador({ meta, sufijo = '' }) {
  const [valor, setValor] = useState(0)

  useEffect(() => {
    // Animación: va subiendo el número hasta llegar a "meta"
    let actual = 0
    const paso = Math.ceil(meta / 40)
    const timer = setInterval(() => {
      actual += paso
      if (actual >= meta) { actual = meta; clearInterval(timer) }
      setValor(actual)
    }, 40)
    return () => clearInterval(timer)  // Limpia el timer si el componente se desmonta
  }, [meta])

  return <span>{valor}{sufijo}</span>
}

export default function Inicio() {
  return (
    <>
      <h1 className="seccion-titulo">🏠 Panel Principal</h1>
      <p className="seccion-subtitulo">Resumen general del sistema de detección</p>

      {/* Fila de estadísticas */}
      <div className="row g-3 mb-4">
        {STATS.map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card-custom">
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

      {/* Tabla de actividad reciente */}
      <div className="card-custom">
        <h5 style={{ marginBottom: 15, color: '#ccc' }}>📋 Actividad Reciente</h5>
        <table className="tabla-custom">
          <thead>
            <tr>
              <th>Fecha</th><th>Ubicación</th><th>Área</th><th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVIDAD.map((a, i) => (
              <tr key={i}>
                <td>{a.fecha}</td>
                <td>{a.lugar}</td>
                <td>{a.area}</td>
                <td><span className={`badge-estado badge-${a.nivel}`}>
                  {a.nivel.charAt(0).toUpperCase() + a.nivel.slice(1)}
                </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
