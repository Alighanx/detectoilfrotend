// ============================================================
// Informacion.jsx — Sección 4: Descripción del proyecto
// ============================================================

// Datos del equipo (reemplaza con los nombres reales)
const EQUIPO = [
  { emoji: '👩‍💻', nombre: 'Nombre 1', rol: 'Frontend' },
  { emoji: '👨‍💻', nombre: 'Nombre 2', rol: 'Backend'  },
  { emoji: '👩‍🔬', nombre: 'Nombre 3', rol: 'Modelo IA' },
  { emoji: '👨‍🎨', nombre: 'Nombre 4', rol: 'Diseño / UX' },
]

// Tecnologías usadas
const TECNOLOGIAS = [
  { label: 'Frontend',             valor: 'HTML5, CSS3, Bootstrap 5, React' },
  { label: 'Backend (futuro)',     valor: 'Python + Flask' },
  { label: 'Inteligencia Artificial', valor: 'TensorFlow / Keras (Deep Learning)' },
  { label: 'Imágenes satelitales', valor: 'Sentinel-2 / Landsat (NASA)' },
]

export default function Informacion() {
  return (
    <>
      <h1 className="seccion-titulo">📚 Información del Sistema</h1>
      <p className="seccion-subtitulo">Conoce más sobre el proyecto y la tecnología detrás</p>

      <div className="row g-3">

        {/* Card: Qué es el sistema */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#4caf50', marginBottom: 12 }}>🎯 ¿Qué es DetectOil IA?</h5>
            <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8 }}>
              DetectOil IA es una aplicación web inteligente que utiliza técnicas de{' '}
              <strong style={{ color: '#fff' }}>Aprendizaje Profundo (Deep Learning)</strong>{' '}
              para detectar automáticamente derrames de petróleo en imágenes satelitales
              de la Amazonía. El sistema procesa imágenes y clasifica las zonas afectadas
              con alta precisión, permitiendo una respuesta rápida ante emergencias ambientales.
            </p>
          </div>
        </div>

        {/* Card: Cómo funciona */}
        <div className="col-md-6">
          <div className="card-custom">
            <h5 style={{ color: '#f0a500', marginBottom: 15 }}>⚙️ ¿Cómo funciona?</h5>
            <ol style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 2, paddingLeft: 20 }}>
              <li>Se carga una imagen satelital de la zona a monitorear</li>
              <li>El modelo de IA analiza píxel a píxel la imagen</li>
              <li>Se identifican patrones asociados a derrames de petróleo</li>
              <li>Se genera un reporte con el área afectada y nivel de riesgo</li>
              <li>El resultado queda registrado en el historial del sistema</li>
            </ol>
          </div>
        </div>

        {/* Card: Tecnologías */}
        <div className="col-md-6">
          <div className="card-custom">
            <h5 style={{ color: '#2980b9', marginBottom: 15 }}>🛠️ Tecnologías Utilizadas</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TECNOLOGIAS.map((t, i) => (
                <div key={i}>
                  <strong style={{ color: '#fff' }}>{t.label}:</strong>{' '}
                  <span style={{ color: '#aaa' }}>{t.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Equipo */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#9b59b6', marginBottom: 15 }}>👥 Equipo de Desarrollo — Grupo 05</h5>
            <div className="row g-3">
              {EQUIPO.map((m, i) => (
                <div className="col-md-3" key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem' }}>{m.emoji}</div>
                  <div style={{ color: '#fff', fontWeight: 600, marginTop: 8 }}>{m.nombre}</div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>{m.rol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
