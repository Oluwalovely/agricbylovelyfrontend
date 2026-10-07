import api from './api.js'

const weatherService = {
    getMyWeather: (signal) => api.get('/weather', { signal }),
    getByCoords: (lat, lon) => api.get('/weather/search', { params: { lat, lon } }),
    getAlerts: () => api.get('/weather/alerts'),
}
export default weatherService
