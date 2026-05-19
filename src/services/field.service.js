import api from './api.js'

const fieldService = {
    getAll: () => api.get('/fields'),
    getSummary: () => api.get('/fields/summary'),
    getById: (id) => api.get(`/fields/${id}`),
    create: (data) => api.post('/fields', data),
    update: (id, data) => api.put(`/fields/${id}`, data),
    remove: (id) => api.delete(`/fields/${id}`),
}
export default fieldService