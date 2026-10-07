import api from './api.js'

const reportService = {
    getDashboard: (signal) => api.get('/reports/dashboard', { signal }),
    getSummary: (signal) => api.get('/reports/summary', { signal }),
    getHarvestHistory: (params, signal) => api.get('/reports/harvest-history', { params, signal }),
}
export default reportService
