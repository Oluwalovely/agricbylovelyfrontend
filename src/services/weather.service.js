import api from './api.js'

const weatherService = {
    getMyWeather: () => api.get('/weather'),
    getByCoords: (lat, lon) => api.get('/weather/search', { params: { lat, lon } }),
    getAlerts: () => api.get('/weather/alerts'),
}
export default weatherService