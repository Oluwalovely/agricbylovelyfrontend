import { create } from 'zustand'


const useThemeStore = create((set) => ({
    isDark: localStorage.getItem('theme') === 'dark',

    toggleTheme: () => set((state) => {
        const newDark = !state.isDark
        // Apply to HTML element so Tailwind dark: variants work
        document.documentElement.classList.toggle('dark', newDark)
        localStorage.setItem('theme', newDark ? 'dark' : 'light')
        return { isDark: newDark }
    }),

    initTheme: () => {
        const isDark = localStorage.getItem('theme') === 'dark'
        document.documentElement.classList.toggle('dark', isDark)
        set({ isDark })
    },
}))

export default useThemeStore