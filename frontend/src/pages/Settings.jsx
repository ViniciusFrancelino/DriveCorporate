import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEnvelope, FaExclamationTriangle, FaFileAlt, FaFolder, FaKey, FaSignOutAlt, FaTrashAlt, FaUserCircle, FaUserEdit } from 'react-icons/fa'
import { changePassword, deleteAccount, getCurrentUser, getUserKpis, updateEmail, updateProfile } from '../services/userService'

const errorMessage = (error, fallback) => error.response?.data?.message || fallback

export default function Settings() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [kpis, setKpis] = useState(null)
  const [name, setName] = useState('')
  const [emailForm, setEmailForm] = useState({ email: '', currentPassword: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [deleteForm, setDeleteForm] = useState({ confirmation: '', currentPassword: '' })
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState('')
  const [loadError, setLoadError] = useState('')
  const [kpiError, setKpiError] = useState('')
  const [success, setSuccess] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setLoadError('')
      setKpiError('')
      try {
        const userResult = await getCurrentUser()
        if (!active) return
        setUser(userResult.data)
        setName(userResult.data.name || '')
        setEmailForm(form => ({ ...form, email: userResult.data.email || '' }))
        localStorage.setItem('user', JSON.stringify({ id: userResult.data.id, name: userResult.data.name, email: userResult.data.email }))
      } catch (error) {
        if (error.response?.status === 401) return logout()
        if (active) setLoadError('Não foi possível carregar os dados da conta.')
      } finally {
        if (active) setLoading(false)
      }

      try {
        const kpiResult = await getUserKpis()
        if (active) setKpis(kpiResult.data)
      } catch (error) {
        if (error.response?.status === 401) return logout()
        if (active) setKpiError('Não foi possível carregar os indicadores da conta.')
      }
    }
    load()
    return () => { active = false }
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  function resetMessages() {
    setSuccess('')
    setFormError('')
  }

  async function saveName(event) {
    event.preventDefault()
    resetMessages()
    setSaving('name')
    try {
      const result = await updateProfile({ name })
      setUser(result.data)
      setName(result.data.name)
      localStorage.setItem('user', JSON.stringify({ id: result.data.id, name: result.data.name, email: result.data.email }))
      setSuccess('Dados atualizados com sucesso.')
    } catch (error) {
      setFormError(errorMessage(error, 'Não foi possível atualizar o nome.'))
    } finally {
      setSaving('')
    }
  }

  async function saveEmail(event) {
    event.preventDefault()
    resetMessages()
    setSaving('email')
    try {
      const result = await updateEmail(emailForm)
      setUser(result.data)
      setEmailForm({ email: result.data.email, currentPassword: '' })
      localStorage.setItem('user', JSON.stringify({ id: result.data.id, name: result.data.name, email: result.data.email }))
      setSuccess('E-mail atualizado com sucesso.')
    } catch (error) {
      setFormError(errorMessage(error, 'Não foi possível atualizar o e-mail.'))
    } finally {
      setSaving('')
    }
  }

  async function savePassword(event) {
    event.preventDefault()
    resetMessages()
    setSaving('password')
    try {
      await changePassword(passwordForm)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess('Senha alterada com sucesso.')
    } catch (error) {
      setFormError(errorMessage(error, 'Não foi possível alterar a senha.'))
    } finally {
      setSaving('')
    }
  }

  async function confirmDeleteAccount(event) {
    event.preventDefault()
    resetMessages()
    if (!deleteForm.currentPassword.trim()) {
      setFormError('Informe sua senha atual.')
      return
    }
    if (deleteForm.confirmation !== 'EXCLUIR') {
      setFormError('Digite EXCLUIR para confirmar.')
      return
    }
    setSaving('delete')
    try {
      await deleteAccount({ currentPassword: deleteForm.currentPassword })
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login', { replace: true })
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
        return
      }
      setFormError(errorMessage(error, 'Não foi possível deletar a conta.'))
    } finally {
      setSaving('')
    }
  }

  return <div className="settings-shell">
    <header className="settings-topbar">
      <Link className="settings-back" to="/drive"><FaArrowLeft /> Voltar aos arquivos</Link>
      <button className="settings-logout" onClick={logout}><FaSignOutAlt /> Sair</button>
    </header>

    <main className="settings-content">
      <div className="settings-heading">
        <h1>Configurações</h1>
        {user && <span>{user.name || user.email}</span>}
      </div>

      {loading && <div className="alert alert-info">Carregando dados da conta...</div>}
      {loadError && <div className="alert alert-danger">{loadError}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {formError && <div className="alert alert-danger">{formError}</div>}

      <section className="settings-section">
        <h2>Resumo da conta</h2>
        {kpiError && <div className="alert alert-warning">{kpiError}</div>}
        <div className="settings-kpis">
          <article><FaFileAlt /><span>Arquivos</span><strong>{kpis?.totalFiles ?? '-'}</strong></article>
          <article><FaFolder /><span>Pastas</span><strong>{kpis?.totalFolders ?? '-'}</strong></article>
          <article><FaUserCircle /><span>Armazenamento utilizado</span><strong>{kpis?.storageUsedFormatted ?? '-'}</strong></article>
        </div>
      </section>

      <section className="settings-section">
        <h2>Dados do usuário</h2>
        <div className="user-summary">
          <div><span>Nome atual</span><strong>{user?.name || '-'}</strong></div>
          <div><span>E-mail atual</span><strong>{user?.email || '-'}</strong></div>
        </div>
      </section>

      <div className="settings-forms">
        <form className="settings-card" onSubmit={saveName}>
          <h3><FaUserEdit /> Alterar nome</h3>
          <label className="form-label" htmlFor="name">Nome</label>
          <input id="name" className="form-control" value={name} onChange={event => setName(event.target.value)} minLength="2" required />
          <button className="btn btn-primary" disabled={saving === 'name'}>{saving === 'name' ? 'Salvando...' : 'Salvar nome'}</button>
        </form>

        <form className="settings-card" onSubmit={saveEmail}>
          <h3><FaEnvelope /> Alterar e-mail</h3>
          <label className="form-label" htmlFor="email">Novo e-mail</label>
          <input id="email" className="form-control" type="email" value={emailForm.email} onChange={event => setEmailForm({ ...emailForm, email: event.target.value })} required />
          <label className="form-label" htmlFor="emailPassword">Senha atual</label>
          <input id="emailPassword" className="form-control" type="password" value={emailForm.currentPassword} onChange={event => setEmailForm({ ...emailForm, currentPassword: event.target.value })} required />
          <button className="btn btn-primary" disabled={saving === 'email'}>{saving === 'email' ? 'Salvando...' : 'Salvar e-mail'}</button>
        </form>

        <form className="settings-card" onSubmit={savePassword}>
          <h3><FaKey /> Alterar senha</h3>
          <label className="form-label" htmlFor="currentPassword">Senha atual</label>
          <input id="currentPassword" className="form-control" type="password" value={passwordForm.currentPassword} onChange={event => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} required />
          <label className="form-label" htmlFor="newPassword">Nova senha</label>
          <input id="newPassword" className="form-control" type="password" minLength="6" value={passwordForm.newPassword} onChange={event => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} required />
          <label className="form-label" htmlFor="confirmPassword">Confirmar nova senha</label>
          <input id="confirmPassword" className="form-control" type="password" minLength="6" value={passwordForm.confirmPassword} onChange={event => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} required />
          <button className="btn btn-primary" disabled={saving === 'password'}>{saving === 'password' ? 'Alterando...' : 'Alterar senha'}</button>
        </form>
      </div>

      <section className="settings-section danger-zone">
        <div className="alert alert-danger border border-danger">
          <h2><FaExclamationTriangle /> Zona de perigo</h2>
          <p>Ao deletar sua conta, seu acesso será desativado e você será desconectado.</p>
          <p>Esta ação não pode ser desfeita pela interface.</p>
          {!deleteOpen ? <button className="btn btn-danger" onClick={() => { resetMessages(); setDeleteOpen(true) }}><FaTrashAlt /> Deletar conta</button> : <form className="delete-account-form" onSubmit={confirmDeleteAccount}>
            <label className="form-label" htmlFor="deleteConfirmation">Digite EXCLUIR para confirmar</label>
            <input id="deleteConfirmation" className="form-control" value={deleteForm.confirmation} onChange={event => setDeleteForm({ ...deleteForm, confirmation: event.target.value })} autoComplete="off" />
            <label className="form-label" htmlFor="deletePassword">Senha atual</label>
            <input id="deletePassword" className="form-control" type="password" value={deleteForm.currentPassword} onChange={event => setDeleteForm({ ...deleteForm, currentPassword: event.target.value })} required />
            <div className="delete-actions">
              <button type="button" className="btn btn-light" onClick={() => { setDeleteOpen(false); setDeleteForm({ confirmation: '', currentPassword: '' }) }} disabled={saving === 'delete'}>Cancelar</button>
              <button className="btn btn-danger" disabled={saving === 'delete' || deleteForm.confirmation !== 'EXCLUIR' || !deleteForm.currentPassword.trim()}>{saving === 'delete' ? 'Deletando...' : 'Confirmar exclusão da conta'}</button>
            </div>
          </form>}
        </div>
      </section>
    </main>
  </div>
}
