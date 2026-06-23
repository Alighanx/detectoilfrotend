const TECNOLOGIAS = [
  { label: 'Frontend', valor: 'React, Vite, Bootstrap 5, Vanilla CSS3', color: 'rgba(6, 182, 212, 0.12)', text: 'var(--color-acento)' },
  { label: 'Backend', valor: 'Python, Flask, Gunicorn, PostgreSQL', color: 'rgba(16, 185, 129, 0.12)', text: 'var(--color-primario)' },
  { label: 'Inteligencia Artificial', valor: 'TensorFlow, Keras (Deep Learning)', color: 'rgba(245, 158, 11, 0.12)', text: 'var(--color-amarillo)' },
  { label: 'Proveedor de Datos', valor: 'Sentinel-2 (Agencia Espacial Europea Copernicus)', color: 'rgba(99, 102, 241, 0.12)', text: 'var(--color-morado)' },
]

const PASOS_FLUJO = [
  { numero: '1', titulo: 'Adquisición Satelital', desc: 'Se descarga la imagen multiespectral Sentinel-2 de la cuenca amazónica en bandas NIR/SWIR.' },
  { numero: '2', titulo: 'Preprocesamiento Espectral', desc: 'La captura se reduce a escala de grises y se normaliza en una matriz de 128x128 píxeles.' },
  { numero: '3', titulo: 'Convolución del Modelo', desc: 'La Red Neuronal Convolucional (CNN) extrae los gradientes de textura y firmas de reflectancia.' },
  { numero: '4', titulo: 'Clasificación Sigmoidea', desc: 'Una capa densa final calcula la probabilidad matemática de la presencia de hidrocarburos.' },
  { numero: '5', titulo: 'Registro y Alerta Temprana', desc: 'Se almacena el diagnóstico en la base de datos Postgres y se dispara el protocolo correspondiente.' }
]

const EQUIPO = [
  { emoji: '👨‍💻', nombre: 'Jesus Angel Pillco Quispe', rol: 'Arquitectura & API Backend' },
  { emoji: '👩‍💻', nombre: 'Anderson Jose Murrugarra Retamozo', rol: 'Desarrollo Frontend React' },
  { emoji: '👩‍🔬', nombre: 'Mauricio Franco Arias', rol: 'Entrenamiento CNN IA' },
  { emoji: '👨‍🎨', nombre: 'Lenin Allister Alvarez Jara', rol: 'Diseño UX/UI Científico' },
]

export default function Informacion() {
  return (
    <>
      <h1 className="seccion-titulo">Información del Sistema</h1>
      <p className="seccion-subtitulo">Detalles de la arquitectura técnica, modelo de IA y equipo de desarrollo</p>

      <div className="row g-4">

        {/* Core summary banner */}
        <div className="col-12">
          <div 
            className="card-custom" 
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(9, 18, 33, 0.8) 100%)',
              borderLeft: '4px solid var(--color-acento)',
              padding: '24px 28px'
            }}
          >
            <h5 style={{ color: 'var(--color-acento)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.1rem', fontWeight: 700 }}>
              🎯 Diagnóstico Inteligente de Pasivos Ambientales
            </h5>
            <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
              <strong>DetectOil IA</strong> es una estación digital de apoyo a la fiscalización ecológica. Automatiza la identificación de derrames de crudo en ríos y bosques amazónicos combinando <strong>Deep Learning</strong> con imágenes orbitales. Este sistema provee un diagnóstico ágil para facilitar acciones preventivas en entidades de supervisión ambiental.
            </p>
          </div>
        </div>

        {/* Processing flow line */}
        <div className="col-md-7">
          <div className="card-custom" style={{ height: '100%' }}>
            <h5 style={{ color: '#fff', marginBottom: 24, fontSize: '1.05rem', fontWeight: 700 }}>
              ⚙️ Pipeline de Procesamiento de Imagen
            </h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.04)', marginLeft: 16 }}>
              {PASOS_FLUJO.map((p, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: 22 }}>
                  
                  {/* Step counter ring */}
                  <div style={{
                    position: 'absolute',
                    left: '-25px',
                    top: '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--color-acento)',
                    border: '3px solid #020617',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
                  }}>
                    {p.numero}
                  </div>

                  <h6 style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.94rem', fontWeight: 700 }}>{p.titulo}</h6>
                  <p style={{ margin: 0, color: 'var(--color-texto-muted)', fontSize: '0.84rem', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CNN Specifications Table */}
        <div className="col-md-5">
          <div className="card-custom" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h5 style={{ color: '#fff', marginBottom: 24, fontSize: '1.05rem', fontWeight: 700 }}>
              🤖 Especificaciones del Modelo
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 12 }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem' }}>Clase de Red</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>Convolucional (CNN)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 12 }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem' }}>Formato Input</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>128 x 128 x 1 (Grises)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 12 }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem' }}>Capa de Activación</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>Sigmoide (Umbral 0.5)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 12 }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem' }}>Volumen de Muestras</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.86rem' }}>12,000 Firmas Espectrales</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.86rem' }}>Precisión de Validación</span>
                <span style={{ color: 'var(--color-primario)', fontWeight: 700, fontSize: '0.86rem' }}>92.5% Fiabilidad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack details */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#fff', marginBottom: 20, fontSize: '1.05rem', fontWeight: 700 }}>
              🛠️ Stack Tecnológico Unificado
            </h5>
            <div className="row g-3">
              {TECNOLOGIAS.map((t, i) => (
                <div className="col-md-6" key={i}>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: t.color,
                    border: `1px solid ${t.text}1c`
                  }}>
                    <strong style={{ color: t.text, display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                      {t.label}
                    </strong>
                    <span style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{t.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Development team details */}
        <div className="col-12">
          <div className="card-custom">
            <h5 style={{ color: '#fff', marginBottom: 20, fontSize: '1.05rem', fontWeight: 700 }}>
              👥 Consorcio de Desarrollo de Estación (Grupo 05)
            </h5>
            <div className="row g-3">
              {EQUIPO.map((m, i) => (
                <div className="col-md-3 col-6" key={i}>
                  <div style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{m.emoji}</div>
                    <strong style={{ color: '#fff', display: 'block', fontSize: '0.9rem', fontWeight: 700 }}>{m.nombre}</strong>
                    <span style={{ color: 'var(--color-texto-muted)', fontSize: '0.74rem', display: 'block', marginTop: 4, fontWeight: 500 }}>{m.rol}</span>
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
