import api from './api.js'

const calendarService = {
    getEvents: (params) => api.get('/calendar', { params }),
    getUpcoming: (days) => api.get('/calendar/upcoming', { params: { days } }),
    getSummary: (year) => api.get('/calendar/summary', { params: { year } }),
}
export default calendarService