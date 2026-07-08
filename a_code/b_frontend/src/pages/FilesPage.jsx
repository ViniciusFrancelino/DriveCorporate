import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  FaChevronRight, FaCloudUploadAlt, FaCog, FaDownload, FaEllipsisV, FaFileAlt, FaFolder,
  FaFolderOpen, FaHome, FaInfoCircle, FaPlus, FaRegClock, FaRegStar,
  FaSearch, FaStar, FaTrashAlt, FaUserCircle
} from 'react-icons/fa'
import api from '../api'
import { favoriteFile, unfavoriteFile } from '../services/fileService'
import { favoriteFolder, unfavoriteFolder } from '../services/folderService'

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024
const formatSize = (size = 0) => size < 1024 ? `${size} B` : size < 1024 ** 2 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 ** 2).toFixed(1)} MB`
const formatDate = (date) => new Date(date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const errorMessage = (error, fallback) => error.response?.data?.message || fallback

export default function FilesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const pathIds = useMemo(() => location.pathname.replace(/^\/drive\/?/, '').split('/').filter(Boolean).map(Number).filter(Number.isFinite), [location.pathname])
  const currentFolderId = pathIds.at(-1) || null
  const [allFolders, setAllFolders] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [view, setView] = useState('drive')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const [panel, setPanel] = useState(null)
  const [folderName, setFolderName] = useState('')
  const [folderMenu, setFolderMenu] = useState(null)
  const [fileMenu, setFileMenu] = useState(null)
  const [folderToDelete, setFolderToDelete] = useState(null)
  const [details, setDetails] = useState(null)
  const [toast, setToast] = useState(null)
  const [error, setError] = useState('')
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {} } catch { return {} }
  }, [])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      if (view === 'trash') {
        const [trashResult, folderResult] = await Promise.all([api.get('/files/trash'), api.get('/folders')])
        setFiles(trashResult.data)
        setAllFolders(folderResult.data)
        setFolders([])
        return
      }

      const requests = [api.get('/folders'), api.get('/files')]
      if (currentFolderId) requests.push(api.get(`/folders/${currentFolderId}/contents`))
      const [folderResult, fileResult, contentsResult] = await Promise.all(requests)
      const everyFolder = folderResult.data
      const everyFile = fileResult.data
      setAllFolders(everyFolder)
      setAllFiles(everyFile)

      if (search.trim()) {
        const searchResult = await api.get('/files/search', { params: { name: search.trim() } })
        setFiles(searchResult.data)
        setFolders([])
      } else if (view === 'recent') {
        setFolders([])
        setFiles(everyFile.slice(0, 12))
      } else if (contentsResult) {
        setFolders(contentsResult.data.subFolders)
        setFiles(contentsResult.data.files)
      } else {
        setFolders(everyFolder.filter(folder => !folder.parentFolderId))
        setFiles(everyFile.filter(file => !file.folderId))
      }
    } catch (requestError) {
      if (requestError.response?.status === 401) logout()
      else if (requestError.response?.status === 404 && currentFolderId) navigate('/drive', { replace: true })
      else setError(errorMessage(requestError, 'Não foi possível carregar seus arquivos.'))
    } finally {
      setLoading(false)
    }
  }, [currentFolderId, navigate, search, view])

  useEffect(() => { load() }, [load])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function openDrive() {
    setView('drive')
    setSearch('')
    navigate('/drive')
  }

  function openFolder(folder) {
    setView('drive')
    setSearch('')
    navigate(`/drive/${[...pathIds, folder.id].join('/')}`)
  }

  const breadcrumbs = useMemo(() => {
    if (!currentFolderId) return []
    const byId = new Map(allFolders.map(folder => [folder.id, folder]))
    const result = []
    let current = byId.get(currentFolderId)
    while (current) {
      result.unshift(current)
      current = current.parentFolderId ? byId.get(current.parentFolderId) : null
    }
    return result
  }, [allFolders, currentFolderId])

  function openCrumb(index) {
    const ids = breadcrumbs.slice(0, index + 1).map(folder => folder.id)
    setView('drive')
    setSearch('')
    navigate(`/drive/${ids.join('/')}`)
  }

  async function createFolder(event) {
    event.preventDefault()
    if (!folderName.trim()) return
    setBusy(true)
    try {
      await api.post('/folders', { name: folderName.trim(), parentFolderId: currentFolderId })
      setFolderName('')
      setPanel(null)
      notify('Pasta criada com sucesso.')
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível criar a pasta.'))
    } finally { setBusy(false) }
  }

  function chooseFiles(fileList) {
    const selected = Array.from(fileList || [])
    if (!selected.length) return
    const tooLarge = selected.find(file => file.size > MAX_UPLOAD_SIZE)
    if (tooLarge) { setError(`"${tooLarge.name}" ultrapassa o limite de 50 MB.`); return }
    setPendingFiles(selected)
  }

  async function uploadFiles() {
    if (!pendingFiles.length) { setError('Selecione ao menos um arquivo para enviar.'); return }
    setBusy(true)
    setProgress(0)
    try {
      for (let index = 0; index < pendingFiles.length; index += 1) {
        const data = new FormData()
        data.append('file', pendingFiles[index])
        if (currentFolderId) data.append('folderId', currentFolderId)
        await api.post('/files/upload', data, { onUploadProgress: event => {
          const partial = event.total ? event.loaded / event.total : 0
          setProgress(Math.round(((index + partial) / pendingFiles.length) * 100))
        } })
      }
      setPendingFiles([])
      setProgress(100)
      setPanel(null)
      notify(pendingFiles.length > 1 ? 'Arquivos enviados com sucesso.' : 'Arquivo enviado com sucesso.')
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível enviar o arquivo.'))
    } finally { setBusy(false); setProgress(0) }
  }

  async function removeFile(file) {
    if (!window.confirm(`Mover "${file.originalName}" para a lixeira?`)) return
    try {
      await api.delete(`/files/${file.id}`)
      notify('Arquivo movido para a lixeira.')
      await load()
    } catch (requestError) { setError(errorMessage(requestError, 'Não foi possível excluir o arquivo.')) }
  }

  async function toggleFileFavorite(file) {
    try {
      if (file.favorite) {
        await unfavoriteFile(file.id)
        notify('Arquivo removido dos favoritos.')
      } else {
        await favoriteFile(file.id)
        notify('Arquivo adicionado aos favoritos.')
      }
      setFileMenu(null)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, file.favorite ? 'Não foi possível remover dos favoritos.' : 'Não foi possível favoritar o item.'))
    }
  }

  async function toggleFolderFavorite(folder) {
    try {
      if (folder.favorite) {
        await unfavoriteFolder(folder.id)
        notify('Pasta removida dos favoritos.')
      } else {
        await favoriteFolder(folder.id)
        notify('Pasta adicionada aos favoritos.')
      }
      setFolderMenu(null)
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, folder.favorite ? 'Não foi possível remover dos favoritos.' : 'Não foi possível favoritar o item.'))
    }
  }

  async function deleteFolder() {
    if (!folderToDelete) return
    setBusy(true)
    try {
      await api.delete(`/folders/${folderToDelete.id}`)
      setFolderToDelete(null)
      setFolderMenu(null)
      notify('Pasta excluída e arquivos enviados para a lixeira.')
      await load()
    } catch (requestError) {
      setError(errorMessage(requestError, 'Não foi possível excluir a pasta.'))
    } finally { setBusy(false) }
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
    } catch (requestError) { setError(errorMessage(requestError, 'Não foi possível baixar o arquivo.')) }
  }

  const usedSpace = allFiles.reduce((total, file) => total + file.size, 0)
  const quota = 5 * 1024 ** 3
  const usagePercent = Math.max(2, Math.min(100, (usedSpace / quota) * 100))
  const sectionTitle = view === 'trash' ? 'Lixeira' : view === 'recent' ? 'Recentes' : search.trim() ? `Resultados para “${search.trim()}”` : 'Meu Drive'
  const folderContainsFiles = (folder) => {
    const ids = new Set([folder.id])
    let changed = true
    while (changed) {
      changed = false
      for (const candidate of allFolders) {
        if (ids.has(candidate.parentFolderId) && !ids.has(candidate.id)) { ids.add(candidate.id); changed = true }
      }
    }
    return allFiles.some(file => ids.has(file.folderId))
  }

  return <div className="drive-shell">
    <aside className="drive-sidebar">
      <div className="brand"><FaFolderOpen /><span>Drive Corporativo</span></div>
      <button className="new-button" onClick={() => setPanel('folder')}><FaPlus /> Novo</button>
      <nav className="drive-nav" aria-label="Navegação principal">
        <button className={view === 'drive' ? 'active' : ''} onClick={openDrive}><FaFolder /> Arquivos</button>
        <button className={view === 'recent' ? 'active' : ''} onClick={() => { setView('recent'); setSearch(''); navigate('/drive') }}><FaRegClock /> Recentes</button>
        <button onClick={() => navigate('/favorites')}><FaRegStar /> Favoritos</button>
        <button className={view === 'trash' ? 'active' : ''} onClick={() => { setView('trash'); setSearch(''); navigate('/drive') }}><FaTrashAlt /> Lixeira</button>
        <button onClick={() => navigate('/settings')}><FaCog /> Configurações</button>
      </nav>
      <div className="storage-card"><div className="small text-muted mb-2">Armazenamento</div><div className="storage-track"><span style={{ width: `${usagePercent}%` }} /></div><div className="storage-label">{formatSize(usedSpace)} de 5 GB usados</div></div>
    </aside>

    <div className="drive-main">
      <header className="drive-topbar">
        <form className="search-box" onSubmit={event => { event.preventDefault(); setView('drive'); load() }}>
          <FaSearch /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar no Drive" aria-label="Pesquisar arquivos" />
        </form>
        <div className="user-area"><FaUserCircle /><span>{user.name || user.email || 'Usuário'}</span><button onClick={logout}>Sair</button></div>
      </header>

      <main className="drive-content" onClick={() => { setFolderMenu(null); setFileMenu(null) }}>
        {toast && <div className="drive-toast success">{toast}</div>}
        {error && <div className="drive-toast error">{error}<button onClick={() => setError('')} aria-label="Fechar">×</button></div>}
        <div className="content-heading">
          <div className="breadcrumbs"><button onClick={openDrive}><FaHome /> Meu Drive</button>{breadcrumbs.map((folder, index) => <span key={folder.id}><FaChevronRight /><button onClick={() => openCrumb(index)}>{folder.name}</button></span>)}</div>
          <button className="upload-quick" onClick={() => setPanel('upload')}><FaCloudUploadAlt /> Enviar arquivos</button>
        </div>

        <div className="section-title"><h1>{sectionTitle}</h1>{loading && <span className="loading-dot">Carregando…</span>}</div>

        {!loading && folders.length > 0 && <section className="folder-section"><h2>Pastas</h2><div className="folder-grid">{folders.map(folder => {
          const count = allFiles.filter(file => file.folderId === folder.id).length
          return <article className="folder-card" key={folder.id}>
            <button className="folder-open" onClick={() => openFolder(folder)}><FaFolder /><span>{folder.name}</span><small>{count} {count === 1 ? 'arquivo' : 'arquivos'}{folder.favorite ? ' • favorito' : ''}</small></button>
            <div className="folder-actions" onClick={event => event.stopPropagation()}><button className="icon-button" aria-label={`Ações da pasta ${folder.name}`} onClick={() => setFolderMenu(folderMenu === folder.id ? null : folder.id)}><FaEllipsisV /></button>{folderMenu === folder.id && <div className="action-menu"><button onClick={() => openFolder(folder)}><FaFolderOpen /> Abrir</button><button onClick={() => toggleFolderFavorite(folder)}>{folder.favorite ? <FaRegStar /> : <FaStar />} {folder.favorite ? 'Desfavoritar' : 'Favoritar'}</button><button className="danger" onClick={() => setFolderToDelete(folder)}><FaTrashAlt /> Excluir</button></div>}</div>
          </article>
        })}</div></section>}

        <section className="files-section"><div className="files-heading"><h2>{view === 'trash' ? 'Arquivos excluídos' : 'Arquivos'}</h2><span>{files.length} item(ns)</span></div>
          {loading ? <div className="empty-state"><span className="spinner-border spinner-border-sm" /> Carregando arquivos…</div> : files.length === 0 ? <div className="empty-state"><FaFileAlt /><p>{view === 'trash' ? 'A lixeira está vazia.' : 'Nenhum arquivo neste local.'}</p>{view === 'drive' && <button className="btn btn-primary" onClick={() => setPanel('upload')}>Enviar arquivo</button>}</div> : <div className="table-responsive"><table className="files-table"><thead><tr><th>Nome</th><th>Tipo</th><th>Tamanho</th><th>Pasta</th><th>Data de upload</th><th aria-label="Ações" /></tr></thead><tbody>{files.map(file => <tr key={file.id}><td><span className="file-name"><FaFileAlt />{file.originalName}{file.favorite && <FaStar className="favorite-marker" title="Favorito" />}</span></td><td>{file.extension?.toUpperCase() || 'Arquivo'}</td><td>{formatSize(file.size)}</td><td>{file.folderName || 'Sem pasta'}</td><td>{formatDate(file.createdAt)}</td><td><div className="file-actions menu-actions" onClick={event => event.stopPropagation()}><button title="Ações" aria-label={`Ações do arquivo ${file.originalName}`} onClick={() => setFileMenu(fileMenu === file.id ? null : file.id)}><FaEllipsisV /></button>{fileMenu === file.id && <div className="action-menu file-menu">{view !== 'trash' && <button onClick={() => download(file)}><FaDownload /> Baixar</button>}<button onClick={() => setDetails(file)}><FaInfoCircle /> Detalhes</button>{view !== 'trash' && <button onClick={() => toggleFileFavorite(file)}>{file.favorite ? <FaRegStar /> : <FaStar />} {file.favorite ? 'Desfavoritar' : 'Favoritar'}</button>}{view !== 'trash' && <button className="danger" onClick={() => removeFile(file)}><FaTrashAlt /> Excluir</button>}</div>}</div></td></tr>)}</tbody></table></div>}
        </section>
      </main>
    </div>

    {panel && <div className="modal-backdrop" role="presentation"><div className="drive-modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setPanel(null)}>×</button>{panel === 'folder' ? <form onSubmit={createFolder}><h2>Nova pasta</h2><p>Crie uma pasta em {breadcrumbs.at(-1)?.name || 'Meu Drive'}.</p><input className="form-control" autoFocus maxLength="150" value={folderName} onChange={event => setFolderName(event.target.value)} placeholder="Nome da pasta" /><div className="modal-footer"><button type="button" className="btn btn-light" onClick={() => setPanel(null)}>Cancelar</button><button className="btn btn-primary" disabled={busy}>Criar pasta</button></div></form> : <div><h2>Enviar arquivos</h2><p>Os arquivos serão enviados para {breadcrumbs.at(-1)?.name || 'Meu Drive'}.</p><div className={`dropzone ${dragging ? 'dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); chooseFiles(event.dataTransfer.files) }} onClick={() => inputRef.current?.click()}><FaCloudUploadAlt /><strong>Arraste arquivos aqui</strong><span>ou clique para selecionar</span><input ref={inputRef} type="file" multiple hidden onChange={event => chooseFiles(event.target.files)} /></div>{pendingFiles.length > 0 && <div className="selected-files">{pendingFiles.map(file => <div key={`${file.name}-${file.lastModified}`}><FaFileAlt /> {file.name} <span>{formatSize(file.size)}</span></div>)}</div>}{busy && <div className="progress mt-3"><div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div></div>}<div className="modal-footer"><button className="btn btn-light" onClick={() => setPanel(null)} disabled={busy}>Cancelar</button><button className="btn btn-primary" onClick={uploadFiles} disabled={busy || !pendingFiles.length}>{busy ? 'Enviando…' : 'Enviar'}</button></div></div>}</div></div>}

    {folderToDelete && <div className="modal-backdrop" role="presentation"><div className="drive-modal confirmation" role="dialog" aria-modal="true"><FaTrashAlt className="warning-icon" /><h2>Excluir pasta?</h2><p>{folderContainsFiles(folderToDelete) ? 'A pasta contém arquivos. Deseja excluir mesmo assim?' : 'Deseja excluir esta pasta vazia?'}</p><p className="muted">Os arquivos da pasta e de subpastas serão movidos para a lixeira.</p><div className="modal-footer"><button className="btn btn-light" onClick={() => setFolderToDelete(null)} disabled={busy}>Cancelar</button><button className="btn btn-danger" onClick={deleteFolder} disabled={busy}>{busy ? 'Excluindo…' : 'Excluir tudo'}</button></div></div></div>}

    {details && <div className="modal-backdrop" role="presentation"><div className="drive-modal confirmation" role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setDetails(null)}>×</button><FaInfoCircle className="info-icon" /><h2>Detalhes do arquivo</h2><dl className="details-list"><dt>Nome</dt><dd>{details.originalName}</dd><dt>Tipo</dt><dd>{details.contentType || details.extension}</dd><dt>Tamanho</dt><dd>{formatSize(details.size)}</dd><dt>Pasta</dt><dd>{details.folderName || 'Sem pasta'}</dd><dt>Enviado em</dt><dd>{formatDate(details.createdAt)}</dd></dl></div></div>}
  </div>
}
