import { useState } from 'react'

export default function Avatar({ farmer }) {
  const [broken, setBroken] = useState(null)
  return farmer?.avatarUrl && broken !== farmer.avatarUrl
    ? <img src={farmer.avatarUrl} alt="" onError={() => setBroken(farmer.avatarUrl)} className="w-full h-full rounded-full object-cover" />
    : <span>{farmer?.firstName?.[0] || 'F'}</span>
}
