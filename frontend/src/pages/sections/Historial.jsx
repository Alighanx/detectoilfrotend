// ============================================================
// Historial.jsx — Sección 3: Tabla con todos los análisis
// ============================================================
import { useState } from 'react'

// Datos de ejemplo del historial (reemplazar con datos reales del backend)
const DATOS = [
  { id: '#001', fecha: '2025-05-10', lugar: 'Loreto, Perú',        area: '3.2 km²', confianza: '91%', nivel: 'alto' },
  { id: '#002', fecha: '2025-05-08', lugar: 'Napo, Ecuador',        area: '1.5 km²', confianza: '87%', nivel: 'medio' },
  { id: '#003', fecha: '2025-05-05', lugar: 'Sucumbíos, Ecuador',   area: '0.8 km²', confianza: '78%', nivel: 'bajo' },
  { id: '#004', fecha: '2025-04-28', lugar: 'Putumayo, Colombia',   area: '5.1 km²', confianza: '95%', nivel: 'alto' },
  { id: '#005', fecha: '2025-04-20', lugar: 'Loreto, Perú',         area: '2.0 km²', confianza: '82%', nivel: 'medio' },
]

export default function Historial() {
  // Estado para el texto del buscador
  const [busqueda, setBusqueda] = useState('')

  // Filtra las filas según el texto buscado (en cualquier columna)
  const datosFiltrados = DATOS.filter(d =>
    Object.values(d).join(' ').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <h1 className="seccion-titulo">📊 Historial de Detecciones</h1>
      <p className="seccion-subtitulo">Registro de todos los análisis realizados en el sistema</p>

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
                    <button className="btn-principal btn-sm">Ver</button>
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
      </div>
    </>
  )
}
