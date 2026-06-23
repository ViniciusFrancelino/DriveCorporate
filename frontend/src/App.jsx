import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FilesPage from './pages/FilesPage'

const PrivateRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" replace />

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/drive/*" element={<PrivateRoute><FilesPage /></PrivateRoute>} />
    <Route path="/files" element={<Navigate to="/drive" replace />} />
    <Route path="*" element={<Navigate to="/drive" replace />} />
  </Routes>
}
