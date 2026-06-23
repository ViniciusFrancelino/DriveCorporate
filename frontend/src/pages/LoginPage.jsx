import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
export default function LoginPage() {
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false),navigate=useNavigate()
 async function submit(e){e.preventDefault();setError('');setLoading(true);try{const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));navigate('/files')}catch(e){setError(e.response?.data?.message||'Não foi possível entrar.')}finally{setLoading(false)}}
 return <main className="auth-shell"><form className="card shadow-sm p-4 auth-card" onSubmit={submit}><h1 className="h3 mb-3">Drive Corporativo</h1><p className="text-muted">Entre para acessar seus arquivos.</p>{error&&<div className="alert alert-danger">{error}</div>}<label className="form-label">E-mail</label><input className="form-control mb-3" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus/><label className="form-label">Senha</label><input className="form-control mb-4" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn btn-primary w-100" disabled={loading}>{loading?'Entrando...':'Entrar'}</button><p className="mt-3 mb-0 text-center">Ainda não possui conta? <Link to="/register">Cadastre-se</Link></p></form></main>
}
