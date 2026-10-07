export function notificationSelection(params) {
  const page = Number(params.get('page') || 1)
  return { page: Number.isInteger(page) && page > 0 && page <= 1000000 ? page : 1, unreadOnly: params.get('status') === 'unread' }
}
export function refreshNotifications(client, farmerId) {
  return Promise.all(['notifications', 'notifications-count', 'dashboard'].map(key => client.invalidateQueries({ queryKey: [key, farmerId] }, { cancelRefetch: false })))
}
export function notificationPollInterval(query) {
  return query.state.status === 'success' && query.state.fetchStatus === 'idle' ? 60000 : false
}
export function belongsToFarmer(notification, farmerId) {
  return !!farmerId && notification.farmerId === farmerId
}
