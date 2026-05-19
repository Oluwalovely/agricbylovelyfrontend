import api from './api.js'

const reportService = {
    getDashboard: () => api.get('/reports/dashboard'),
    getSummary: () => api.get('/reports/summary'),
    getHarvestHistory: (params) => api.get('/reports/harvest-history', { params }),
}
export default reportService