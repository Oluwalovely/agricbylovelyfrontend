import api from './api.js'

const cropService = {
    getAll: (params) => api.get('/crops', { params }),
    getById: (id) => api.get(`/crops/${id}`),
    getCategories: () => api.get('/crops/categories'),
    getMyCrops: () => api.get('/crops/my-crops'),
    plant: (id, data) => api.post(`/crops/${id}/plant`, data),
    updateMyCrop: (id, data) => api.put(`/crops/my-crops/${id}`, data),
    removeMyCrop: (id) => api.delete(`/crops/my-crops/${id}`),
}
export default cropService