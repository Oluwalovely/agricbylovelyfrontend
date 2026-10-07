# Weather and notifications

Weather displays conditions, daily forecasts and generated farming advisories using the saved farm coordinates. Missing coordinates link to Profile, provider errors offer Retry, and no advisories has a separate empty state. Forecast dates use the provider's location-day grouping; partial-day labels and a fetch timestamp make coverage/freshness visible. Refresh can reuse the backend's one-hour cache.

Notifications supports All/Unread filters, ten-item pages preserved in the URL, read-one/read-all, confirmed delete and confirmed clear-read. Empty final pages clamp after removal. Query/mutation failures preserve saved history and provide retry. Mutations refresh the current farmer's list, bell count and dashboard.

Socket messages carry farmer identity; events from another account are ignored, duplicate IDs do not repeat toasts, and reconnect refreshes persisted history. Existing token authentication/refresh remains in use. List/count polling provides a fallback every 30 seconds. No new notification is created simply by visiting Weather.

Verification: browser checks use isolated REST responses plus a local Socket.IO transport, covering missing location, provider retry, no advisories, read failures, filters/pages/reload, confirmed/cancelled removal, empty-page recovery, bulk actions, live list/badge updates, duplicate events and account switching. Desktop/mobile layouts were inspected. Unit tests validate URL filters, account identity and cache refresh scope.

Production requires backend `OPENWEATHER_API_KEY` and frontend `VITE_SOCKET_URL` pointing to the backend origin. Scheduled email remains Phase 7; free-host cron is best effort.
