import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AuthCard from '../components/AuthCard'
import AuthLayout from '../components/AuthLayout'
import InputField from '../components/InputField'
import LoadingButton from '../components/LoadingButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/files')
    } catch (e) {
      setError(e.response?.data?.message || 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Entrar"
        subtitle="Acesse seus arquivos corporativos com segurança."
        onSubmit={submit}
      >
        <>
          {error && <div className="auth-alert error">{error}</div>}
          <InputField
            id="login-email"
            label="E-mail"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            autoComplete="email"
            placeholder="voce@empresa.com"
          />
          <InputField
            id="login-password"
            label="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Digite sua senha"
          />
          <LoadingButton type="submit" loading={loading} loadingText="Entrando...">
            Entrar
          </LoadingButton>
          <p className="auth-switch">
            Ainda não possui conta? <Link to="/register">Cadastre-se</Link>
          </p>
        </>
      </AuthCard>
    </AuthLayout>
  )
}
