import { create } from 'zustand'


const useAuthStore = create((set) => ({
    farmer: null,
    isLoggedIn: false,

    // Called after login or register
    setAuth: (farmer, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({ farmer, isLoggedIn: true })
    },

    // Called after fetching fresh farmer profile
    setFarmer: (farmer) => set({ farmer }),

    // Called on logout
    clearAuth: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ farmer: null, isLoggedIn: false })
    },

    // Called on app load to check if tokens exist
    checkAuth: () => {
        const token = localStorage.getItem('accessToken')
        set({ isLoggedIn: !!token })
    },
}))

export default useAuthStore