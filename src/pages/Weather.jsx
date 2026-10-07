import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CloudSun, Droplets, Wind } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import weatherService from '../services/weather.service.js'
import Button from '../components/ui/Button.jsx'
import QueryState from '../components/reports/QueryState.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { formatDate } from '../lib/farmReports.js'

export default function Weather() {
  const farmer = useAuthStore(s => s.farmer)
  const hasLocation = farmer.latitude != null && farmer.longitude != null
  const query = useQuery({ queryKey: ['weather', farmer.id, farmer.latitude, farmer.longitude], enabled: hasLocation, queryFn: ({ signal }) => weatherService.getMyWeather(signal).then(r => r.data.weather), staleTime: 5 * 60000 })
  const locationRequired = !hasLocation || query.error?.response?.data?.code === 'LOCATION_REQUIRED'
  const weather = query.data
  return <div className="space-y-6">
    <header className="flex flex-wrap justify-between gap-4"><div><h1 className="text-3xl mb-2">Weather for your farm</h1><p style={{ color: 'var(--text-secondary)' }}>Local conditions, forecast and farming advisories for your saved coordinates.</p></div><Link className="text-sm underline self-start" to="/profile">Edit farm location</Link></header>
    {locationRequired ? <section className="rounded-2xl p-6" style={panelStyle}><h2 className="text-xl mb-2">Add your farm location</h2><p className="text-sm mb-4">Weather needs both latitude and longitude. A state name alone cannot locate your farm.</p><Link className="underline" to="/profile">Add coordinates in Profile</Link></section> : <>
      <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
        <div className="flex flex-wrap justify-between gap-3 mb-4"><h2 className="text-xl">Current conditions</h2><Button size="sm" variant="secondary" loading={query.isFetching} onClick={() => query.refetch()}>Refresh weather</Button></div>
        <QueryState query={query} label="weather" />
        {query.isSuccess && weather && <><p className="text-sm mb-4">{weather.location.name}, {weather.location.country} · {weather.location.latitude}, {weather.location.longitude}</p><div className="flex flex-wrap items-center gap-6"><CloudSun size={42} style={{ color: 'var(--green-dark)' }} aria-hidden="true" /><div><p className="text-4xl">{weather.current.temp}°C</p><p className="capitalize text-sm mt-1">{weather.current.description}</p><p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Feels like {weather.current.feelsLike}°C</p></div><dl className="flex flex-wrap gap-6 text-sm"><div><dt className="flex gap-1 items-center"><Droplets size={14} />Humidity</dt><dd className="font-semibold mt-1">{weather.current.humidity}%</dd></div><div><dt className="flex gap-1 items-center"><Wind size={14} />Wind</dt><dd className="font-semibold mt-1">{weather.current.windSpeed} m/s</dd></div><div><dt>Pressure</dt><dd className="font-semibold mt-1">{weather.current.pressure} hPa</dd></div></dl></div><p className="text-xs mt-5" style={{ color: 'var(--text-secondary)' }}>Source: OpenWeather. Fetched {new Date(weather.fetchedAt).toLocaleString()}. Conditions are cached for up to one hour.</p></>}
      </section>
      {query.isSuccess && weather && <>
        <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}><h2 className="text-xl mb-2">Forecast by day</h2><p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Dates follow the location's time zone. Partial days cover only the available forecast hours.</p>{weather.forecast.length ? <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>{weather.forecast.map(day => <li key={day.date} className="py-4 flex flex-wrap justify-between gap-x-6 gap-y-3"><div className="sm:w-48"><h3 className="font-semibold text-sm">{formatDate(day.date)}</h3><p className="text-sm capitalize">{day.description}</p>{day.partialDay && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Partial day</p>}</div><dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm"><div><dt>Low / high</dt><dd className="font-semibold">{day.tempMin}° / {day.tempMax}°C</dd></div><div><dt>Rainfall</dt><dd>{day.rainfallMm} mm</dd></div><div><dt>Humidity</dt><dd>{day.humidity}%</dd></div><div><dt>Peak wind</dt><dd>{day.windSpeed} m/s</dd></div></dl></li>)}</ul> : <p>No forecast available for this location.</p>}</section>
        <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}><h2 className="text-xl mb-2">Farming advisories</h2><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Generated from weather conditions and seasonal rules. These are general guidance, not official weather warnings or a diagnosis of your crops.</p>{weather.alerts.length ? <ul className="space-y-5">{weather.alerts.map((alert, i) => <li key={`${alert.title}-${i}`}><h3 className="text-base font-semibold">{alert.title}</h3><p className="text-sm mt-1 leading-relaxed max-w-prose">{alert.message}</p></li>)}</ul> : <p className="text-sm" role="status">No farming advisories for the current conditions.</p>}</section>
      </>}
    </>}
  </div>
}
