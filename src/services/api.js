import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
    headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor ───────────────────
// Runs before every request — attaches the access token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


api.interceptors.response.use(
    (response) => response, // success — pass through

    async (error) => {
        const original = error.config

        // If 401 and we haven't already retried this request
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) throw new Error('No refresh token')

                // Get a new access token
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8001/api'}/auth/refresh`,
                    { refreshToken }
                )

                const newToken = res.data.accessToken
                localStorage.setItem('accessToken', newToken)

                // Retry the original request with the new token
                original.headers.Authorization = `Bearer ${newToken}`
                return api(original)

            } catch {
                // Refresh failed — clear tokens and redirect to login
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                window.location.href = '/login'
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export default api