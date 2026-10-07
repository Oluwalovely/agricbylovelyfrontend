import api from './api.js'

const reportService = {
    getDashboard: (signal) => api.get('/reports/dashboard', { signal }),
    getSummary: () => api.get('/reports/summary'),
    getHarvestHistory: (params) => api.get('/reports/harvest-history', { params }),
}
export default reportService