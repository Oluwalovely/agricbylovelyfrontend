import api from './api.js'

const farmerService = {
    getProfile: () => api.get('/farmers/me'),
    updateProfile: (data) => api.put('/farmers/me', data),
    changePassword: (data) => api.put('/farmers/me/password', data),
    deleteAccount: () => api.delete('/farmers/me'),
    uploadAvatar: (file) => {
        const form = new FormData()
        form.append('image', file)
        return api.post('/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    },
}
export default farmerService