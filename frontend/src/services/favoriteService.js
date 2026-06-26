import api from '../api'

export const getFavorites = () => api.get('/favorites')
