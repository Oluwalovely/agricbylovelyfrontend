import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import calendarService from '../services/calendar.service.js'
import useAuthStore from '../store/authStore.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import QueryState from '../components/reports/QueryState.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { calendarEntries, formatDate, monthDates, selectedMonth, utcToday } from '../lib/farmReports.js'

const colours = { Planted: 'var(--blue)', Harvested: 'var(--green-dark)', 'Estimated harvest': 'var(--amber)' }

export default function Calendar() {
  const farmer = useAuthStore(s => s.farmer)
  const [params, setParams] = useSearchParams()
  const { year, month } = selectedMonth(params)
  const [days, setDays] = useState(30)
  const dates = monthDates(year, month)
  const day = dates.includes(params.get('day')) ? params.get('day') : ''
  const title = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', year: 'numeric' })
  const monthly = useQuery({ queryKey: ['calendar', farmer.id, 'month', year, month], queryFn: ({ signal }) => calendarService.getEvents({ year, month }, signal).then(r => r.data.events) })
  const upcoming = useQuery({ queryKey: ['calendar', farmer.id, 'upcoming', days], queryFn: ({ signal }) => calendarService.getUpcoming(days, signal).then(r => r.data.events) })
  const entries = calendarEntries(monthly.data || [], year, month)
  const shown = day ? entries.filter(event => event.date === day) : entries
  const milestones = new Set(entries.map(event => event.recordId))
  const ongoing = (monthly.data || []).filter(event => !event.isHarvested && !milestones.has(event.id))
  function navigateMonth(offset) {
    const date = new Date(Date.UTC(year, month - 1 + offset, 1))
    setParams({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 })
  }
  function setDay(date) { setParams({ year, month, ...(date ? { day: date } : {}) }) }
  return <div className="space-y-6">
    <header><h1 className="text-3xl mb-2">Farm calendar</h1><p style={{ color: 'var(--text-secondary)' }}>See planting dates, estimated harvests and completed harvests from your crop records.</p></header>
    <section className="rounded-2xl p-4 sm:p-6" style={panelStyle}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5"><h2 className="text-2xl">{title}</h2><div className="flex flex-wrap items-end gap-2"><Button size="sm" variant="secondary" disabled={year === 1900 && month === 1} onClick={() => navigateMonth(-1)}>Previous month</Button><Button size="sm" variant="secondary" disabled={year === 2100 && month === 12} onClick={() => navigateMonth(1)}>Next month</Button><Button size="sm" variant="ghost" onClick={() => { const today = utcToday(); setParams({ year: today.slice(0, 4), month: Number(today.slice(5, 7)) }) }}>This month</Button></div></div>
      <div className="max-w-xs mb-4"><Input label="Choose month" type="month" min="1900-01" max="2100-12" value={`${year}-${String(month).padStart(2, '0')}`} onChange={e => { if (/^\d{4}-\d{2}$/.test(e.target.value)) { const [y, m] = e.target.value.split('-').map(Number); if (y >= 1900 && y <= 2100) setParams({ year: y, month: m }) } }} /></div>
      <QueryState query={monthly} label="calendar" />
      {monthly.isSuccess && <>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs mb-4">{Object.entries(colours).map(([label, colour]) => <span key={label} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: colour }} />{label}</span>)}</div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center" aria-label={`${title} dates`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(label => <div key={label} className="text-xs py-2 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>)}
          {dates.map((date, index) => { if (!date) return <div key={`blank-${index}`} aria-hidden="true" />; const daily = entries.filter(event => event.date === date); return <button key={date} type="button" aria-pressed={day === date} aria-label={`${formatDate(date)}, ${daily.length} events${date === utcToday() ? ', today' : ''}`} onClick={() => setDay(day === date ? '' : date)} className="min-w-0 rounded-lg border p-1 sm:p-2 flex flex-col items-center gap-2 min-h-[74px] sm:min-h-[94px] focus-visible:outline-2 focus-visible:outline-offset-2" style={{ borderColor: day === date || date === utcToday() ? 'var(--green-mid)' : 'var(--border)', background: day === date ? 'var(--green-light)' : 'var(--bg-primary)', color: day === date ? 'var(--green-dark)' : 'var(--text-primary)' }}><span className="text-sm font-medium">{Number(date.slice(8))}</span><span className="flex flex-wrap justify-center gap-1" aria-hidden="true">{[...new Set(daily.map(event => event.kind))].map(kind => <span key={kind} className="w-1.5 h-1.5 rounded-full" style={{ background: colours[kind] }} />)}</span>{daily.length > 0 && <span className="text-xs">{daily.length}<span className="hidden sm:inline"> events</span></span>}</button> })}
        </div>
        <div className="flex flex-wrap justify-between gap-3 mt-6 mb-3"><h3 className="text-lg">{day ? `Events on ${formatDate(day)}` : 'Dates in this month'}</h3>{day && <Button size="sm" variant="ghost" onClick={() => setDay('')}>Show whole month</Button>}</div>
        {shown.length ? <ul>{shown.map(event => <li key={event.id} className="py-3 border-b last:border-b-0 flex flex-wrap justify-between gap-3" style={{ borderColor: 'var(--border)' }}><div><Link to={`/my-crops?record=${event.recordId}&status=all`} className="font-medium underline">{event.name}</Link><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{event.field || 'No field assigned'}</p></div><div className="text-sm"><p style={{ color: colours[event.kind] }}>{event.kind}</p><p>{formatDate(event.date)}</p></div></li>)}</ul> : <p className="text-sm" role="status">No planting or harvest dates recorded {day ? 'on this day' : 'in this month'}.</p>}
        {!day && ongoing.length > 0 && <div className="mt-5"><h3 className="text-lg mb-2">Other growing crops</h3><p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>These active plantings have no planting or harvest milestone in this month.</p><ul className="space-y-2">{ongoing.map(event => <li key={event.id} className="text-sm"><Link className="underline" to={`/my-crops?record=${event.id}&status=all`}>{event.cropName}</Link> · {event.fieldName || 'No field assigned'}</li>)}</ul></div>}
      </>}
    </section>
    <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
      <div className="flex flex-wrap justify-between gap-4 mb-4"><div><h2 className="text-xl mb-2">Harvest estimates to check</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upcoming dates and overdue estimates for active crops. Record a completed harvest in My Crops.</p></div><div className="w-48"><Select label="Look ahead" value={days} onChange={e => setDays(Number(e.target.value))}>{[30, 60, 90].map(value => <option key={value} value={value}>Next {value} days</option>)}</Select></div></div>
      <QueryState query={upcoming} label="harvest estimates" />
      {upcoming.isSuccess && (upcoming.data.length ? <ul>{upcoming.data.map(event => <li key={event.farmerCropId} className="flex flex-wrap justify-between gap-3 py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}><div><Link className="text-sm font-medium underline" to={`/my-crops?record=${event.farmerCropId}&status=all`}>{event.cropName}</Link><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{event.fieldName || 'No field assigned'} · {formatDate(event.date)}</p></div><p className="text-sm font-medium" style={{ color: event.type === 'OVERDUE' ? 'var(--amber)' : 'var(--green-dark)' }}>{event.type === 'OVERDUE' ? `${event.daysOverdue} days past estimate` : event.daysLeft === 0 ? 'Estimated today' : `Estimated in ${event.daysLeft} days`}</p></li>)}</ul> : <p className="text-sm">No upcoming or overdue harvest estimates. Crops without a recorded harvest duration have no estimated date.</p>)}
    </section>
  </div>
}
