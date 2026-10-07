import api from './api.js'

const notificationService = {
    getAll: (params, signal) => api.get('/notifications', { params, signal, timeout: 20000 }),
    markOneRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
    deleteOne: (id) => api.delete(`/notifications/${id}`),
    clearRead: () => api.delete('/notifications/clear-read'),
}
export default notificationService
