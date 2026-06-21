// ============================================================
// Informacion.jsx — Sección 4: Descripción del proyecto
// ============================================================

// Tecnologías usadas con colores correspondientes
const TECNOLOGIAS = [
  { label: 'Frontend', valor: 'React, Vite, Bootstrap 5, Vanilla CSS3', color: 'rgba(111,141,255,0.15)', text: '#6f8dff' },
  { label: 'Backend', valor: 'Python, Flask, Gunicorn', color: 'rgba(0, 208, 132, 0.15)', text: '#00d084' },
  { label: 'Inteligencia Artificial', valor: 'TensorFlow, Keras (Deep Learning)', color: 'rgba(240, 165, 0, 0.15)', text: '#f0a500' },
  { label: 'Proveedor de Datos', valor: 'Imágenes Satelitales Sentinel-2 (Copernicus ESA)', color: 'rgba(155, 89, 182, 0.15)', text: '#bb8fce' },
]

// Flujo de funcionamiento en línea de tiempo
const PASOS_FLUJO = [
  { numero: '1', titulo: 'Captura Satelital', desc: 'Se obtiene la imagen multiespectral Sentinel-2 de la zona de interés en la Amazonía.' },
  { numero: '2', titulo: 'Preprocesamiento', desc: 'La imagen se convierte a escala de grises y se escala a una matriz de 128x128 píxeles.' },
  { numero: '3', titulo: 'Inferencia de la IA', desc: 'La Red Neuronal Convolucional (CNN) procesa las características y texturas de la imagen.' },
  { numero: '4', titulo: 'Clasificación Espectral', desc: 'La capa sigmoidea clasifica la imagen y define el porcentaje de probabilidad del derrame.' },
  { numero: '5', titulo: 'Alertamiento y Registro', desc: 'Se genera el reporte con el nivel de severidad y recomendación, guardándolo en la base de datos.' }
]

// Equipo del proyecto (pueden ser renombrados)
const EQUIPO = [
  { emoji: '👨‍💻', nombre: 'Alighan', rol: 'Arquitectura & Backend' },
  { emoji: '👩‍💻', nombre: 'Integrante 2', rol: 'Desarrollo Frontend' },
  { emoji: '👩‍🔬', nombre: 'Integrante 3', rol: 'Entrenamiento de IA' },
  { emoji: '👨‍🎨', nombre: 'Integrante 4', rol: 'Diseño UX/UI' },
]

export default function Informacion() {
  return (
    <>
      <h1 className="seccion-titulo">📚 Información del Sistema</h1>
      <p className="seccion-subtitulo">Detalles técnicos del modelo de Inteligencia Artificial y arquitectura de monitoreo</p>

      <div className="row g-4">

        {/* ¿Qué es DetectOil IA? */}
        <div className="col-12">
          <div className="card-custom" style={{
            background: 'linear-gradient(135deg, rgba(13,110,63,0.06) 0%, rgba(10,18,28,0.95) 100%)',
            borderLeft: '4px solid #00d084'
          }}>
            <h5 style={{ color: '#00d084', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>🎯</span> Diagnóstico Inteligente de Pasivos Ambientales
            </h5>
            <p style={{ color: '#aaa', fontSize: '0.92rem', lineHeight: 1.8, margin: 0 }}>
              <strong>DetectOil IA</strong> es una plataforma de apoyo técnico de monitoreo ambiental diseñada para automatizar la identificación de derrames de petróleo en fuentes hídricas y suelos de la Amazonía. Mediante técnicas avanzadas de <strong>Aprendizaje Profundo (Deep Learning)</strong>, el sistema procesa imágenes y genera alertas automatizadas de forma rápida para facilitar la toma de decisiones ecológicas en entidades gubernamentales e hidrométricas de supervisión (tipo SENAMHI / OEFA).
            </p>
          </div>
        </div>

        {/* Línea de Tiempo del Proceso */}
        <div className="col-md-7">
          <div className="card-custom" style={{ height: '100%' }}>
            <h5 style={{ color: '#fff', marginBottom: 20 }}>⚙️ Flujo del Procesamiento de Imágenes</h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', paddingLeft: 10, borderLeft: '2px solid rgba(255,255,255,0.05)', marginLeft: 15 }}>
              {PASOS_FLUJO.map((p, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 20 }}>
                  
                  {/* Círculo indicador de paso */}
                  <div style={{
                    position: 'absolute',
                    left: '-22px',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#0d6e3f',
                    border: '3px solid #071117',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 0 10px rgba(13,110,63,0.5)'
                  }}>
                    {p.numero}
                  </div>

                  <h6 style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{p.titulo}</h6>
                  <p style={{ margin: 0, color: '#8fa3b7', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ficha técnica del modelo CNN */}
        <div className="col-md-5">
          <div className="card-custom" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#fff', marginBottom: 20 }}>🤖 Ficha Técnica de la IA</h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: 'auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                <span style={{ color: '#666', fontSize: '0.86rem' }}>Arquitectura</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>Red Neuronal Convolucional (CNN)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                <span style={{ color: '#666', fontSize: '0.86rem' }}>Dimensión de Entrada</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>128 x 128 x 1 (Escala de Grises)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                <span style={{ color: '#666', fontSize: '0.86rem' }}>Capa de Salida</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>Capa Densar (Activación Sigmoide)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 10 }}>
                <span style={{ color: '#666', fontSize: '0.86rem' }}>Dataset de Entrenamiento</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>12,000 Capturas Espectrales</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666', fontSize: '0.86rem' }}>Métrica de Precisión (Val)</span>
                <span style={{ color: '#00d084', fontWeight: 700, fontSize: '0.86rem' }}>92.5% Precisión</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tecnologías */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#fff', marginBottom: 20 }}>🛠️ Stack Tecnológico del Proyecto</h5>
            <div className="row g-3">
              {TECNOLOGIAS.map((t, i) => (
                <div className="col-md-6" key={i}>
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: t.color,
                    border: `1px solid ${t.text}22`
                  }}>
                    <strong style={{ color: t.text, display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                      {t.label}
                    </strong>
                    <span style={{ color: '#fff', fontSize: '0.9rem' }}>{t.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipo de Desarrollo */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#fff', marginBottom: 20 }}>👥 Equipo de Investigación y Desarrollo (Grupo 05)</h5>
            <div className="row g-3">
              {EQUIPO.map((m, i) => (
                <div className="col-md-3 col-6" key={i}>
                  <div style={{
                    textAlign: 'center',
                    padding: 20,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'transform 0.25s'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{m.emoji}</div>
                    <strong style={{ color: '#fff', display: 'block', fontSize: '0.9rem' }}>{m.nombre}</strong>
                    <span style={{ color: '#9bb0c8', fontSize: '0.76rem', display: 'block', marginTop: 4 }}>{m.rol}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
