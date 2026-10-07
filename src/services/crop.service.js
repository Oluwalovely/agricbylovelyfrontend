import api from './api.js'

const cropService = {
    getAll: (params, signal) => api.get('/crops', { params, signal }),
    getById: (id, signal) => api.get(`/crops/${id}`, { signal }),
    getCategories: (signal) => api.get('/crops/categories', { signal }),
    getMyCrops: (signal) => api.get('/crops/my-crops', { signal }),
    plant: (id, data) => api.post(`/crops/${id}/plant`, data),
    updateMyCrop: (id, data) => api.put(`/crops/my-crops/${id}`, data),
    removeMyCrop: (id) => api.delete(`/crops/my-crops/${id}`),
}
export default cropService
