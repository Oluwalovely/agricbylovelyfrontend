import api from './api.js'

const calendarService = {
    getEvents: (params, signal) => api.get('/calendar', { params, signal }),
    getUpcoming: (days, signal) => api.get('/calendar/upcoming', { params: { days }, signal }),
    getSummary: (year, signal) => api.get('/calendar/summary', { params: { year }, signal }),
}
export default calendarService
