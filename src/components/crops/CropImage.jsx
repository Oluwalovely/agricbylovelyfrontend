import { useState } from 'react'
import { Sprout } from 'lucide-react'

export default function CropImage({ crop, className = '' }) {
  const [failed, setFailed] = useState(false)
  return <div className={`overflow-hidden flex items-center justify-center ${className}`} style={{ background: 'var(--green-light)' }}>
    {crop.imageUrl && !failed ? <img src={crop.imageUrl} alt={crop.name} loading="lazy" className="w-full h-full object-cover" onError={() => setFailed(true)} /> : <Sprout size={32} aria-hidden="true" style={{ color: 'var(--green-dark)' }} />}
  </div>
}
