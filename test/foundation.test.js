import assert from 'node:assert/strict'
import { test, beforeEach } from 'node:test'
import axios from 'axios'

const values = new Map()
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key),
}
let handler
axios.defaults.adapter = config => handler(config)
const { default: api, refreshAccessToken } = await import('../src/services/api.js')
const { default: useAuthStore } = await import('../src/store/authStore.js')
const { default: authService } = await import('../src/services/auth.service.js')
const { queryClient } = await import('../src/lib/queryClient.js')
const { sessionVersion, syncExternalSession } = await import('../src/services/session.js')

const farmerA = { id: 'farmer-A', firstName: 'Alice', farmName: 'Farm A' }
const farmerB = { id: 'farmer-B', firstName: 'Bob', farmName: 'Farm B' }
const response = (config, data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config })
const reject = (config, status) => Promise.reject(new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST',
  config, null, response(config, { message: 'Invalid email or password' }, status)))
const deferred = () => {
  let resolve
  let reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const tick = () => new Promise(resolve => setImmediate(resolve))

beforeEach(() => {
  useAuthStore.getState().clearAuth()
  handler = config => Promise.resolve(response(config, {}))
})

test('startup without tokens stays anonymous', async () => {
  let calls = 0
  handler = config => { calls++; return Promise.resolve(response(config, {})) }
  await useAuthStore.getState().checkAuth({ force: true })
  assert.equal(calls, 0)
  assert.equal(useAuthStore.getState().isInitializing, false)
  assert.equal(useAuthStore.getState().isLoggedIn, false)
})

test('startup restores the full profile before exposing authenticated state', async () => {
  values.set('accessToken', 'saved-access')
  values.set('refreshToken', 'saved-refresh')
  const pending = deferred()
  let calls = 0
  handler = async config => { calls++; await pending.promise; return response(config, { farmer: farmerA }) }
  const first = useAuthStore.getState().checkAuth({ force: true })
  const second = useAuthStore.getState().checkAuth({ force: true })
  assert.equal(first, second)
  assert.equal(useAuthStore.getState().isInitializing, true)
  assert.equal(useAuthStore.getState().farmer, null)
  pending.resolve()
  await first
  assert.equal(calls, 1)
  assert.equal(useAuthStore.getState().farmer.id, farmerA.id)
  assert.equal(useAuthStore.getState().isLoggedIn, true)
})

test('invalid login does not refresh, redirect or erase another saved session', async () => {
  useAuthStore.getState().setAuth(farmerA, 'access-A', 'refresh-A')
  const requests = []
  handler = config => { requests.push(config.url); return reject(config, 401) }
  await assert.rejects(authService.login({ email: 'wrong@example.test', password: 'wrong' }),
    error => error.response.status === 401)
  assert.deepEqual(requests, ['/auth/login'])
  assert.equal(values.get('accessToken'), 'access-A')
  assert.equal(useAuthStore.getState().farmer.id, farmerA.id)
})

test('simultaneous expired-token requests share one refresh and both retry', async () => {
  useAuthStore.getState().setAuth(farmerA, 'expired', 'refresh-A')
  let refreshes = 0
  handler = async config => {
    if (config.url === '/auth/refresh') {
      refreshes++
      await tick()
      return response(config, { accessToken: 'fresh' })
    }
    if (config.headers.Authorization !== 'Bearer fresh') return reject(config, 401)
    return response(config, { success: true })
  }
  const results = await Promise.all([api.get('/reports/dashboard'), api.get('/notifications')])
  assert.equal(refreshes, 1)
  assert.ok(results.every(result => result.data.success))
  assert.equal(values.get('accessToken'), 'fresh')
})

test('invalid refresh clears tokens, identity and cached private records', async () => {
  useAuthStore.getState().setAuth(farmerA, 'expired', 'invalid-refresh')
  queryClient.setQueryData(['dashboard', farmerA.id], { private: 'A' })
  handler = config => reject(config, 401)
  await assert.rejects(api.get('/farmers/me'))
  assert.equal(values.size, 0)
  assert.equal(useAuthStore.getState().farmer, null)
  assert.equal(queryClient.getQueryCache().getAll().length, 0)
})

test('a network outage preserves tokens and offers a session restoration retry', async () => {
  values.set('accessToken', 'saved-access')
  values.set('refreshToken', 'saved-refresh')
  handler = async () => { throw new axios.AxiosError('Offline', 'ERR_NETWORK') }
  await useAuthStore.getState().checkAuth({ force: true })
  assert.equal(values.get('refreshToken'), 'saved-refresh')
  assert.ok(useAuthStore.getState().sessionError)
  assert.equal(useAuthStore.getState().isInitializing, false)
  handler = config => Promise.resolve(response(config, { farmer: farmerA }))
  await useAuthStore.getState().checkAuth({ force: true })
  assert.equal(useAuthStore.getState().farmer.id, farmerA.id)
  assert.equal(useAuthStore.getState().sessionError, null)
})

test('refresh network failures do not log the user out', async () => {
  useAuthStore.getState().setAuth(farmerA, 'expired', 'refresh-A')
  handler = config => config.url === '/auth/refresh'
    ? Promise.reject(new axios.AxiosError('Offline', 'ERR_NETWORK'))
    : reject(config, 401)
  await assert.rejects(api.get('/reports/dashboard'))
  assert.equal(useAuthStore.getState().isLoggedIn, true)
  assert.equal(values.get('refreshToken'), 'refresh-A')
})

test('switching accounts clears cached data and rejects late responses', async () => {
  useAuthStore.getState().setAuth(farmerA, 'access-A', 'refresh-A')
  queryClient.setQueryData(['dashboard', farmerA.id], { private: 'A' })
  const pending = deferred()
  handler = async config => { await pending.promise; return response(config, { private: 'A' }) }
  const oldRequest = api.get('/reports/dashboard')
  const rejected = assert.rejects(oldRequest, error => axios.isCancel(error))
  await tick()
  useAuthStore.getState().setAuth(farmerB, 'access-B', 'refresh-B')
  pending.resolve()
  await rejected
  assert.equal(queryClient.getQueryData(['dashboard', farmerA.id]), undefined)
  assert.equal(useAuthStore.getState().farmer.id, farmerB.id)
})

test('late initialization never replaces a newly signed-in farmer', async () => {
  values.set('accessToken', 'access-A')
  values.set('refreshToken', 'refresh-A')
  const pending = deferred()
  handler = async config => { await pending.promise; return response(config, { farmer: farmerA }) }
  const restoring = useAuthStore.getState().checkAuth({ force: true })
  await tick()
  useAuthStore.getState().setAuth(farmerB, 'access-B', 'refresh-B')
  pending.resolve()
  await restoring
  assert.equal(useAuthStore.getState().farmer.id, farmerB.id)
})

test('a late refresh cannot overwrite another account or clear it on failure', async () => {
  for (const succeeds of [true, false]) {
    useAuthStore.getState().setAuth(farmerA, 'expired-A', 'refresh-A')
    const pending = deferred()
    handler = async config => {
      await pending.promise
      return succeeds ? response(config, { accessToken: 'fresh-A' }) : reject(config, 401)
    }
    const refreshing = refreshAccessToken()
    const rejected = assert.rejects(refreshing)
    await tick()
    useAuthStore.getState().setAuth(farmerB, 'access-B', 'refresh-B')
    pending.resolve()
    await rejected
    assert.equal(values.get('accessToken'), 'access-B')
    assert.equal(useAuthStore.getState().farmer.id, farmerB.id)
  }
})

test('logout immediately clears identity/cache and does not refresh a rejected logout', async () => {
  useAuthStore.getState().setAuth(farmerA, 'access-A', 'refresh-A')
  queryClient.setQueryData(['dashboard', farmerA.id], { private: 'A' })
  const version = sessionVersion()
  const requests = []
  handler = config => { requests.push(config); return reject(config, 401) }
  const logout = authService.logout()
  assert.equal(useAuthStore.getState().isLoggedIn, false)
  assert.ok(sessionVersion() > version)
  assert.equal(queryClient.getQueryCache().getAll().length, 0)
  await assert.rejects(logout)
  assert.deepEqual(requests.map(config => config.url), ['/auth/logout'])
  assert.equal(requests[0].headers.Authorization, 'Bearer access-A')
})

test('a second 401 after refreshing ends the rejected session', async () => {
  useAuthStore.getState().setAuth(farmerA, 'expired', 'refresh-A')
  handler = config => config.url === '/auth/refresh'
    ? Promise.resolve(response(config, { accessToken: 'still-rejected' })) : reject(config, 401)
  await assert.rejects(api.get('/farmers/me'))
  assert.equal(useAuthStore.getState().isLoggedIn, false)
  assert.equal(values.size, 0)
})

test('an account change in another tab clears private state and restores the new identity', async () => {
  useAuthStore.getState().setAuth(farmerA, 'access-A', 'refresh-A')
  queryClient.setQueryData(['dashboard', farmerA.id], { private: 'A' })
  values.set('accessToken', 'access-B')
  values.set('refreshToken', 'refresh-B')
  syncExternalSession()
  assert.equal(useAuthStore.getState().farmer, null)
  assert.equal(queryClient.getQueryCache().getAll().length, 0)
  assert.equal(values.get('accessToken'), 'access-B')
  handler = config => Promise.resolve(response(config, { farmer: farmerB }))
  await useAuthStore.getState().checkAuth({ force: true })
  assert.equal(useAuthStore.getState().farmer.id, farmerB.id)
})

test('a delayed logout always uses the departing account token', async () => {
  useAuthStore.getState().setAuth(farmerA, 'access-A', 'refresh-A')
  let sentToken
  handler = config => { sentToken = config.headers.Authorization; return Promise.resolve(response(config, { success: true })) }
  const logout = authService.logout()
  useAuthStore.getState().setAuth(farmerB, 'access-B', 'refresh-B')
  await logout
  assert.equal(sentToken, 'Bearer access-A')
  assert.equal(useAuthStore.getState().farmer.id, farmerB.id)
})
