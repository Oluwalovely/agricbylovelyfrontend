import api from './api.js'

const fieldService = {
    getAll: (signal) => api.get('/fields', { signal }),
    getSummary: () => api.get('/fields/summary'),
    getById: (id, signal) => api.get(`/fields/${id}`, { signal }),
    create: (data) => api.post('/fields', data),
    update: (id, data) => api.put(`/fields/${id}`, data),
    remove: (id) => api.delete(`/fields/${id}`),
}
export default fieldService
