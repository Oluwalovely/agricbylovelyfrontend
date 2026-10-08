import api from './api.js'

export const photoPath = (kind, id) => kind === 'avatar' ? '/upload/avatar' : `/upload/${kind}/${id}`
export default {
  upload: (kind, id, file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post(photoPath(kind, id), form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  remove: (kind, id) => api.delete(photoPath(kind, id)),
}
