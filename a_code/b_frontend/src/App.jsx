import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FilesPage from './pages/FilesPage'
import Settings from './pages/Settings'
import Favorites from './pages/Favorites'

const PrivateRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" replace />

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/drive/*" element={<PrivateRoute><FilesPage /></PrivateRoute>} />
    <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    <Route path="/files" element={<Navigate to="/drive" replace />} />
    <Route path="*" element={<Navigate to="/drive" replace />} />
  </Routes>
}
