// ============================================================
// main.jsx — Punto de entrada de la aplicación React
// Aquí arrancamos todo y configuramos el Router
// ============================================================
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // Maneja las rutas/páginas
import 'bootstrap/dist/css/bootstrap.min.css'      // Bootstrap 5
import './index.css'                                // Nuestro CSS personalizado
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita la navegación entre páginas sin recargar */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
