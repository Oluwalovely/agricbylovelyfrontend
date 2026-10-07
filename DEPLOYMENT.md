# Free portfolio hosting

Deploy this repository as a Render Static Site. The `render.yaml` file provides the same settings for a Render Blueprint.

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node version: 24
- Rewrite: `/*` to `/index.html` (Rewrite, not Redirect)

Set these public environment variables before building:

- `VITE_API_URL`: the new backend HTTPS URL followed by `/api`.
- `VITE_SOCKET_URL`: the same backend origin without `/api` or a trailing slash.

Vite embeds these values during the build; rebuild after changing them. Never put database connection strings or private API keys in frontend variables.

After Render generates the frontend URL, set the backend's `CLIENT_URL` to this exact HTTPS origin without a trailing slash and redeploy the backend. Verify `/login`, `/register`, and a direct page refresh as well as API requests.

The rewrite makes React Router's page links work when opened directly. Existing assets are served normally before the fallback.
