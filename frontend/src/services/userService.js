import api from '../api'

export const getCurrentUser = () => api.get('/users/me')
export const updateProfile = (data) => api.put('/users/me/profile', data)
export const updateEmail = (data) => api.put('/users/me/email', data)
export const changePassword = (data) => api.put('/users/me/password', data)
export const getUserKpis = () => api.get('/users/me/kpis')
