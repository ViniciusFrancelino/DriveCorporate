import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AuthCard from '../components/AuthCard'
import AuthLayout from '../components/AuthLayout'
import InputField from '../components/InputField'
import LoadingButton from '../components/LoadingButton'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas informadas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      await api.post('/auth/register', payload)
      setSuccess('Conta criada. Redirecionando para o login...')
      setTimeout(() => navigate('/login'), 900)
    } catch (e) {
      setError(e.response?.data?.message || 'Não foi possível criar a conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Criar conta"
        subtitle="Crie sua conta para organizar e acessar seus documentos."
        onSubmit={submit}
      >
        <>
          {error && <div className="auth-alert error">{error}</div>}
          {success && <div className="auth-alert success">{success}</div>}
          <InputField
            id="register-name"
            label="Nome"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            maxLength="120"
            autoComplete="name"
            placeholder="Seu nome"
          />
          <InputField
            id="register-email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
            placeholder="voce@empresa.com"
          />
          <InputField
            id="register-password"
            label="Senha"
            type="password"
            minLength="6"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="new-password"
            placeholder="Mínimo de 6 caracteres"
          />
          <InputField
            id="register-confirm-password"
            label="Confirmar senha"
            type="password"
            minLength="6"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            required
            autoComplete="new-password"
            placeholder="Repita sua senha"
          />
          <LoadingButton type="submit" loading={loading} loadingText="Criando...">
            Criar conta
          </LoadingButton>
          <p className="auth-switch">
            Já possui conta? <Link to="/login">Voltar para login</Link>
          </p>
        </>
      </AuthCard>
    </AuthLayout>
  )
}
