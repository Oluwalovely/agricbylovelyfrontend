import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import reportService from '../services/report.service.js'
import calendarService from '../services/calendar.service.js'
import Button from '../components/ui/Button.jsx'
import Select from '../components/ui/Select.jsx'
import QueryState from '../components/reports/QueryState.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { displayLabel } from '../lib/planting.js'
import { formatDate, numberLabel } from '../lib/farmReports.js'

function YearChart({ months, year }) {
  const max = Math.max(1, ...months.flatMap(month => [month.plantings, month.harvests, month.plannedHarvests]))
  const columns = [['plantings', 'Planted', 'var(--blue)'], ['harvests', 'Harvested', 'var(--green-dark)'], ['plannedHarvests', 'Estimated', 'var(--amber)']]
  return <figure><figcaption className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Each count represents one planting record. Estimated harvests are active crop estimates; harvested counts use actual completion dates.</figcaption>
    <table className="w-full table-fixed text-sm"><thead><tr><th className="text-left py-2 w-1/4" scope="col">Month</th>{columns.map(([key, label]) => <th key={key} className="text-left py-2 text-xs sm:text-sm" scope="col">{label}</th>)}</tr></thead><tbody>{months.map(month => <tr key={month.month} className="border-t" style={{ borderColor: 'var(--border)' }}><th scope="row" className="text-left font-normal py-3"><Link to={`/calendar?year=${year}&month=${month.month}`} className="underline">{month.monthName.slice(0, 3)}</Link></th>{columns.map(([key, , colour]) => <td key={key} className="py-3 pr-3"><span>{numberLabel(month[key])}</span><div aria-hidden="true" className="h-1.5 rounded mt-1" style={{ width: `${(month[key] / max) * 100}%`, background: colour }} /></td>)}</tr>)}</tbody></table>
  </figure>
}

export default function Reports() {
  const farmer = useAuthStore(s => s.farmer)
  const [params, setParams] = useSearchParams()
  const requestedYear = Number(params.get('year'))
  const year = Number.isInteger(requestedYear) && requestedYear >= 1900 && requestedYear <= 2100 ? requestedYear : new Date().getUTCFullYear()
  const requestedPage = Number(params.get('page'))
  const page = Number.isInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000 ? requestedPage : 1
  const summary = useQuery({ queryKey: ['reports', farmer.id, 'summary'], queryFn: ({ signal }) => reportService.getSummary(signal).then(r => r.data) })
  const annual = useQuery({ queryKey: ['calendar', farmer.id, 'summary', year], queryFn: ({ signal }) => calendarService.getSummary(year, signal).then(r => r.data.months) })
  const history = useQuery({ queryKey: ['reports', farmer.id, 'history', page], queryFn: ({ signal }) => reportService.getHarvestHistory({ page, limit: 10 }, signal).then(r => r.data) })
  const update = values => setParams({ year, page, ...values })
  const stats = summary.data?.summary
  const maximum = Math.max(1, ...(summary.data?.stageBreakdown || []).map(stage => stage.count))
  return <div className="space-y-6">
    <header><h1 className="text-3xl mb-2">Farm reports</h1><p style={{ color: 'var(--text-secondary)' }}>Review your saved plantings, completed harvests and recorded yields.</p></header>
    <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
      <h2 className="text-xl mb-4">All-time farm totals</h2><QueryState query={summary} label="farm totals" />
      {summary.isSuccess && <><dl className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">{[['Total plantings', stats.totalCropsPlanted], ['Active plantings', stats.activeCrops], ['Completed harvests', stats.harvestedCrops], ['Fields', stats.totalFields], ['Recorded yield', `${numberLabel(stats.totalYieldKg)} kg`], ['Harvest completion', `${stats.harvestCompletionRate}%`]].map(([label, value]) => <div key={label}><dt className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</dt><dd className="text-xl font-semibold">{typeof value === 'number' ? numberLabel(value) : value}</dd></div>)}</dl><p className="text-xs mt-5" style={{ color: 'var(--text-secondary)' }}>Harvest completion is completed harvests divided by all planting records. Recorded yield excludes harvests where yield is unknown. Removed plantings no longer contribute to these totals.</p></>}
    </section>
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}><h2 className="text-xl mb-4">Active growth stages</h2><QueryState query={summary} label="growth stages" />{summary.isSuccess && (summary.data.stageBreakdown.length ? <ul className="space-y-4">{summary.data.stageBreakdown.map(stage => <li key={stage.stage}><div className="flex justify-between text-sm gap-3 mb-2"><span>{displayLabel(stage.stage)}</span><span>{numberLabel(stage.count)} {stage.count === 1 ? 'planting' : 'plantings'}</span></div><div className="h-2 rounded overflow-hidden" style={{ background: 'var(--bg-tertiary)' }} aria-hidden="true"><div className="h-full rounded" style={{ width: `${stage.count / maximum * 100}%`, background: 'var(--green-mid)' }} /></div></li>)}</ul> : <p className="text-sm">No active plantings. <Link to="/crops" className="underline">Add a planting</Link> or review your harvest history below.</p>)}</section>
      <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}><h2 className="text-xl mb-4">Recently updated plantings</h2><QueryState query={summary} label="recent activity" />{summary.isSuccess && (summary.data.recentActivity.length ? <ul>{summary.data.recentActivity.map(record => <li key={record.id} className="py-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}><Link className="font-medium text-sm underline" to={`/my-crops?record=${record.id}&status=all`}>{record.cropName}</Link><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{record.fieldName || 'No field assigned'} · {displayLabel(record.stage)} · Updated {formatDate(record.updatedAt)}</p></li>)}</ul> : <p className="text-sm">No planting activity recorded yet.</p>)}</section>
    </div>
    <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
      <div className="flex flex-wrap justify-between gap-4 mb-5"><h2 className="text-xl">Planting and harvest activity · {year}</h2><div className="w-40"><Select label="Report year" value={year} onChange={e => update({ year: Number(e.target.value) })}>{Array.from({ length: 201 }, (_, index) => 1900 + index).map(value => <option key={value} value={value}>{value}</option>)}</Select></div></div>
      <QueryState query={annual} label="yearly activity" />{annual.isSuccess && <><YearChart months={annual.data} year={year} />{annual.data.every(month => !month.plantings && !month.harvests && !month.plannedHarvests) && <p className="text-sm mt-4" role="status">No planting or harvest dates recorded in {year}.</p>}</>}
    </section>
    <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
      <h2 className="text-xl mb-3">Harvest history</h2><QueryState query={history} label="harvest history" />
      {history.isSuccess && <><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{numberLabel(history.data.total)} completed harvests · {numberLabel(history.data.totalYieldKg)} kg recorded across all pages</p>
        {history.data.harvested.length ? <ul>{history.data.harvested.map(record => <li key={record.id} className="py-4 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}><div className="flex flex-wrap justify-between gap-3"><div><Link to={`/my-crops?record=${record.id}&status=harvested`} className="font-medium underline">{record.cropName}</Link><p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{record.fieldName || 'No field assigned'} · {displayLabel(record.category)}</p></div><p className="text-sm font-semibold">{record.yieldKg == null ? 'Yield not recorded' : `${numberLabel(record.yieldKg)} kg`}</p></div><p className="text-sm mt-3">Planted {formatDate(record.plantedAt)} · Harvested {formatDate(record.harvestedAt)}{record.daysToHarvest != null && ` · ${record.daysToHarvest} days`}</p>{record.notes && <p className="text-sm mt-2 whitespace-pre-line break-words" style={{ color: 'var(--text-secondary)' }}>{record.notes}</p>}</li>)}</ul> : <p className="text-sm">{history.data.total ? 'No records on this page. Return to an earlier page.' : 'No harvests recorded yet. Record a harvest in My Crops to see it here.'}</p>}
        {(history.data.pages > 1 || page > 1) && <nav aria-label="Harvest history pages" className="flex flex-wrap justify-center items-center gap-3 mt-5"><Button variant="secondary" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</Button><span className="text-sm">Page {page} of {Math.max(1, history.data.pages)}</span><Button variant="secondary" disabled={page >= history.data.pages} onClick={() => update({ page: page + 1 })}>Next</Button></nav>}
      </>}
    </section>
  </div>
}
