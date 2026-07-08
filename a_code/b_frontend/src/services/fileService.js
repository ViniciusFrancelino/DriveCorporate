import api from '../api'

export const favoriteFile = (fileId) => api.patch(`/files/${fileId}/favorite`)
export const unfavoriteFile = (fileId) => api.patch(`/files/${fileId}/unfavorite`)
