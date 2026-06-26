import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaArrowLeft, FaDownload, FaEllipsisV, FaFileAlt, FaFolder, FaFolderOpen,
  FaRegStar, FaSignOutAlt, FaStar, FaUserCircle
} from 'react-icons/fa'
import api from '../api'
import { getFavorites } from '../services/favoriteService'
import { unfavoriteFile } from '../services/fileService'
import { unfavoriteFolder } from '../services/folderService'

const formatSize = (size = 0) => size < 1024 ? `${size} B` : size < 1024 ** 2 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 ** 2).toFixed(1)} MB`
const formatDate = (date) => new Date(date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const errorMessage = (error, fallback) => error.response?.data?.message || fallback

export default function Favorites() {
  const navigate = useNavigate()
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [folderMenu, setFolderMenu] = useState(null)
  const [fileMenu, setFileMenu] = useState(null)
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {} } catch { return {} }
  })()

  useEffect(() => { load() }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  async function load() {
    setLoading(true)
    setError('')
    try {
      const result = await getFavorites()
      setFolders(result.data.folders || [])
      setFiles(result.data.files || [])
    } catch (requestError) {
      if (requestError.response?.status === 401) logout()
      else setError(errorMessage(requestError, 'Não foi possível carregar favoritos.'))
    } finally {
      setLoading(false)
    }
  }

  async function removeFolder(folder) {
    try {
      await unfavoriteFolder(folder.id)
      setFolders(current => current.filter(item => item.id !== folder.id))
      setFolderMenu(null)
      notify('Pasta removida dos favoritos.')
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível remover dos favoritos.'))
    }
  }

  async function removeFile(file) {
    try {
      await unfavoriteFile(file.id)
      setFiles(current => current.filter(item => item.id !== file.id))
      setFileMenu(null)
      notify('Arquivo removido dos favoritos.')
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível remover dos favoritos.'))
    }
  }

  async function download(file) {
    try {
      const { data } = await api.get(`/files/${file.id}/download`, { responseType: 'blob' })
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = file.originalName
      link.click()
      URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível baixar o arquivo.'))
    }
  }

  const empty = !loading && folders.length === 0 && files.length === 0

  return <div className="drive-shell">
    <aside className="drive-sidebar">
      <div className="brand"><FaFolderOpen /><span>Drive Corporativo</span></div>
      <nav className="drive-nav" aria-label="Navegação principal">
        <button onClick={() => navigate('/drive')}><FaFolder /> Arquivos</button>
        <button className="active"><FaRegStar /> Favoritos</button>
        <button onClick={() => navigate('/settings')}><FaUserCircle /> Configurações</button>
        <button onClick={logout}><FaSignOutAlt /> Sair</button>
      </nav>
    </aside>

    <div className="drive-main">
      <header className="drive-topbar">
        <div className="favorites-topbar-title"><FaStar /> Favoritos</div>
        <div className="user-area"><FaUserCircle /><span>{user.name || user.email || 'Usuário'}</span><button onClick={logout}>Sair</button></div>
      </header>

      <main className="drive-content" onClick={() => { setFolderMenu(null); setFileMenu(null) }}>
        {toast && <div className="drive-toast success">{toast}</div>}
        {error && <div className="drive-toast error">{error}<button onClick={() => setError('')} aria-label="Fechar">x</button></div>}

        <div className="content-heading">
          <Link className="favorites-back" to="/drive"><FaArrowLeft /> Voltar aos arquivos</Link>
        </div>
        <div className="section-title"><h1>Favoritos</h1>{loading && <span className="loading-dot">Carregando...</span>}</div>

        {loading ? <div className="empty-state"><span className="spinner-border spinner-border-sm" /> Carregando favoritos...</div> : empty ? <div className="empty-state favorites-empty"><FaRegStar /><p>Nenhum arquivo ou pasta favoritado ainda.</p></div> : <>
          <section className="folder-section">
            <h2>Pastas favoritas</h2>
            {folders.length === 0 ? <div className="favorites-muted">Nenhuma pasta favorita.</div> : <div className="folder-grid">{folders.map(folder => <article className="folder-card" key={folder.id}>
              <button className="folder-open" onClick={() => navigate(`/drive/${folder.id}`)}><FaFolder /><span>{folder.name}</span><small>{formatDate(folder.updatedAt || folder.createdAt)}</small></button>
              <div className="folder-actions" onClick={event => event.stopPropagation()}>
                <button className="icon-button" aria-label={`Ações da pasta ${folder.name}`} onClick={() => setFolderMenu(folderMenu === folder.id ? null : folder.id)}><FaEllipsisV /></button>
                {folderMenu === folder.id && <div className="action-menu">
                  <button onClick={() => navigate(`/drive/${folder.id}`)}><FaFolderOpen /> Abrir</button>
                  <button onClick={() => removeFolder(folder)}><FaRegStar /> Desfavoritar</button>
                </div>}
              </div>
            </article>)}</div>}
          </section>

          <section className="files-section">
            <div className="files-heading"><h2>Arquivos favoritos</h2><span>{files.length} item(ns)</span></div>
            {files.length === 0 ? <div className="empty-state"><FaFileAlt /><p>Nenhum arquivo favorito.</p></div> : <div className="table-responsive"><table className="files-table"><thead><tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Pasta</th><th>Atualizado em</th><th aria-label="Ações" /></tr></thead><tbody>{files.map(file => <tr key={file.id}>
              <td><span className="file-name"><FaFileAlt />{file.originalName}</span></td>
              <td>{file.extension?.toUpperCase() || 'Arquivo'}</td>
              <td>{formatSize(file.size)}</td>
              <td>{file.folderName || 'Sem pasta'}</td>
              <td>{formatDate(file.updatedAt || file.createdAt)}</td>
              <td><div className="file-actions menu-actions" onClick={event => event.stopPropagation()}>
                <button title="Ações" aria-label={`Ações do arquivo ${file.originalName}`} onClick={() => setFileMenu(fileMenu === file.id ? null : file.id)}><FaEllipsisV /></button>
                {fileMenu === file.id && <div className="action-menu file-menu">
                  <button onClick={() => download(file)}><FaDownload /> Baixar</button>
                  <button onClick={() => removeFile(file)}><FaRegStar /> Desfavoritar</button>
                </div>}
              </div></td>
            </tr>)}</tbody></table></div>}
          </section>
        </>}
      </main>
    </div>
  </div>
}
