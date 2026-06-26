import api from '../api'

export const favoriteFolder = (folderId) => api.patch(`/folders/${folderId}/favorite`)
export const unfavoriteFolder = (folderId) => api.patch(`/folders/${folderId}/unfavorite`)
