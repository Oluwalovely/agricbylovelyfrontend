export const soilTypes = ['LOAMY', 'CLAY', 'SANDY', 'SILTY', 'PEATY', 'CHALKY']
export const panelStyle = { background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
export const soilLabel = value => value.charAt(0) + value.slice(1).toLowerCase()

export function farmPayload(values, kind = 'field') {
  const data = { ...values }
  const size = kind === 'field' ? 'sizeHa' : 'farmSizeHa'
  data[size] = values[size] === '' ? null : Number(values[size])
  if (data[size] !== null && (!Number.isFinite(data[size]) || data[size] <= 0)) throw new Error('Size must be greater than zero, or left blank.')
  for (const [key, limit] of [['latitude', 90], ['longitude', 180]]) {
    data[key] = values[key] === '' ? null : Number(values[key])
    if (data[key] !== null && (!Number.isFinite(data[key]) || Math.abs(data[key]) > limit)) throw new Error(`${soilLabel(key)} must be between -${limit} and ${limit}.`)
  }
  if ((data.latitude === null) !== (data.longitude === null)) throw new Error('Enter both latitude and longitude, or leave both blank.')
  return data
}

export function invalidateFarm(queryClient) {
  return Promise.all(['fields', 'field', 'profile', 'dashboard', 'weather', 'reports', 'my-crops', 'calendar'].map(key => queryClient.invalidateQueries({ queryKey: [key] })))
}

export function needsFarmSetup(farmer, fields) {
  return !!farmer && (!farmer.state && (farmer.latitude == null || farmer.longitude == null) || fields.length === 0)
}
