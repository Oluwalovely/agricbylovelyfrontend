import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import notificationService from '../services/notification.service.js'
import Button from '../components/ui/Button.jsx'
import QueryState from '../components/reports/QueryState.jsx'
import { Message } from '../components/farm/FarmForm.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { notificationSelection, refreshNotifications } from '../lib/notifications.js'
import { apiErrorMessage } from '../services/api.js'

export default function Notifications() {
  const farmer = useAuthStore(s => s.farmer)
  const client = useQueryClient()
  const [params, setParams] = useSearchParams()
  const { page, unreadOnly } = notificationSelection(params)
  const [confirm, setConfirm] = useState(null)
  const [notice, setNotice] = useState('')
  const query = useQuery({ queryKey: ['notifications', farmer.id, page, unreadOnly], queryFn: ({ signal }) => notificationService.getAll({ page, limit: 10, unreadOnly: String(unreadOnly) }, signal).then(r => r.data), refetchInterval: 30000 })
  const data = query.data
  useEffect(() => {
    if (data && page > Math.max(1, data.pages)) setParams({ status: unreadOnly ? 'unread' : 'all', page: Math.max(1, data.pages) }, { replace: true })
  }, [data, page, unreadOnly, setParams])
  const mutation = useMutation({ mutationFn: ({ action, id }) => ({ read: () => notificationService.markOneRead(id), all: notificationService.markAllRead, delete: () => notificationService.deleteOne(id), clear: notificationService.clearRead })[action](), onSuccess: async (_response, { action }) => { setConfirm(null); setNotice(action === 'read' || action === 'all' ? 'Notifications marked as read.' : 'Notifications removed.'); await refreshNotifications(client, farmer.id) } })
  function act(action, id) { setNotice(''); mutation.reset(); mutation.mutate({ action, id }) }
  function select(status, nextPage = 1) { setConfirm(null); mutation.reset(); setParams({ status, page: nextPage }) }
  return <div className="space-y-6">
    <header><h1 className="text-3xl mb-2">Your notifications</h1><p style={{ color: 'var(--text-secondary)' }}>Farm reminders and saved alerts. Reading an alert keeps it in your history.</p></header>
    <section className="rounded-2xl p-5 sm:p-6" style={panelStyle}>
      <div className="flex flex-wrap justify-between gap-4 mb-5"><div className="flex flex-wrap gap-2" role="group" aria-label="Notification status"><Button variant={!unreadOnly ? 'primary' : 'secondary'} onClick={() => select('all')}>All notifications</Button><Button variant={unreadOnly ? 'primary' : 'secondary'} onClick={() => select('unread')}>Unread only</Button></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" disabled={!data?.unreadCount || mutation.isPending} onClick={() => act('all')}>Mark all as read</Button><Button size="sm" variant="ghost" disabled={!data?.total || mutation.isPending} onClick={() => { mutation.reset(); setConfirm({ action: 'clear' }) }}>Clear read notifications</Button><Button size="sm" variant="ghost" loading={query.isFetching} onClick={() => query.refetch()}>Refresh notifications</Button></div></div>
      <Message>{notice}</Message><Message error>{mutation.error && apiErrorMessage(mutation.error)}</Message>
      {confirm?.action === 'clear' && <div className="rounded-xl p-4 mb-5" style={{ background: 'var(--bg-tertiary)' }}><p className="text-sm mb-3">Remove all read notifications from your history? Unread notifications will stay.</p><div className="flex gap-2"><Button variant="danger" loading={mutation.isPending} onClick={() => act('clear')}>Confirm clear read</Button><Button variant="secondary" disabled={mutation.isPending} onClick={() => setConfirm(null)}>Cancel</Button></div></div>}
      <QueryState query={query} label="notifications" />
      {query.isSuccess && data && <><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{data.unreadCount} unread · {data.total} {unreadOnly ? 'unread notifications' : 'notifications'} in this view</p>{data.notifications.length ? <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>{data.notifications.map(notification => <li key={notification.id} className="py-5 break-words"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{notification.type.charAt(0) + notification.type.slice(1).toLowerCase()} · {notification.isRead ? 'Read' : 'Unread'}</p><h2 className="text-lg" style={{ fontWeight: notification.isRead ? 500 : 700 }}>{notification.title}</h2></div><time className="text-xs" dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString()}</time></div><p className="text-sm leading-relaxed mt-2 mb-3 max-w-prose whitespace-pre-line">{notification.message}</p><div className="flex flex-wrap gap-2">{!notification.isRead && <Button size="sm" variant="secondary" disabled={mutation.isPending} onClick={() => act('read', notification.id)}>Mark as read</Button>}{notification.type === 'HARVEST' && <Link className="text-sm underline self-center px-2" to="/calendar">Check harvest estimates</Link>}{['WEATHER', 'PEST', 'PLANTING'].includes(notification.type) && <Link className="text-sm underline self-center px-2" to="/weather">View weather advisories</Link>}<Button size="sm" variant="ghost" disabled={mutation.isPending} onClick={() => { mutation.reset(); setConfirm({ action: 'delete', id: notification.id }) }}>Delete</Button></div>{confirm?.action === 'delete' && confirm.id === notification.id && <div className="mt-3 p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}><p className="text-sm mb-3">Delete this notification from your history?</p><div className="flex gap-2"><Button size="sm" variant="danger" loading={mutation.isPending} onClick={() => act('delete', notification.id)}>Confirm delete</Button><Button size="sm" variant="secondary" disabled={mutation.isPending} onClick={() => setConfirm(null)}>Cancel</Button></div></div>}</li>)}</ul> : <div className="py-6"><h2 className="text-xl mb-2">{unreadOnly ? 'You are all caught up' : 'No notifications yet'}</h2><p className="text-sm">{unreadOnly ? 'Read notifications remain in All notifications.' : 'Saved farming alerts and harvest reminders will appear here.'}</p></div>}{data.pages > 1 && <div className="flex flex-wrap items-center justify-between gap-3 mt-5"><p className="text-sm">Page {page} of {data.pages}</p><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => select(unreadOnly ? 'unread' : 'all', page - 1)}>Previous page</Button><Button size="sm" variant="secondary" disabled={page >= data.pages} onClick={() => select(unreadOnly ? 'unread' : 'all', page + 1)}>Next page</Button></div></div>}</>}
    </section>
  </div>
}
