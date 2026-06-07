// ============================================================
// App.jsx — Componente raíz: define las rutas de la app
// ============================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'

// useAuth: verifica si hay sesión activa en localStorage
function useAuth() {
  return localStorage.getItem('usuario') !== null
}

// ProtectedRoute: redirige al login si no hay sesión
function ProtectedRoute({ children }) {
  return useAuth() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas: solo accesibles con sesión activa */}
      <Route path="/inicio"           element={<ProtectedRoute><Dashboard seccion="inicio"          /></ProtectedRoute>} />
      <Route path="/nueva-deteccion"  element={<ProtectedRoute><Dashboard seccion="nueva_deteccion" /></ProtectedRoute>} />
      <Route path="/historial"        element={<ProtectedRoute><Dashboard seccion="historial"        /></ProtectedRoute>} />
      <Route path="/informacion"      element={<ProtectedRoute><Dashboard seccion="informacion"      /></ProtectedRoute>} />

      {/* Cualquier ruta desconocida redirige al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
