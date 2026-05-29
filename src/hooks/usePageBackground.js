import { useLocation } from 'react-router-dom'

const backgrounds = {
    '/dashboard': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', 
    '/crops': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80', 
    '/my-crops': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80', 
    '/fields': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80', 
    '/weather': 'https://media.istockphoto.com/id/2197040005/photo/sunset-sky.webp?a=1&b=1&s=612x612&w=0&k=20&c=bruGa8XI2djdhV8MJg71VELC9sl8p4AESAgDvPKtnr0=', 
    '/calendar': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80', 
    '/notifications': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80', 
    '/reports': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80', 
}

const usePageBackground = () => {
    const { pathname } = useLocation()

    // Match the most specific route first
    const match = Object.keys(backgrounds)
        .sort((a, b) => b.length - a.length)
        .find(route => pathname.startsWith(route))

    return match ? backgrounds[match] : null
}

export default usePageBackground