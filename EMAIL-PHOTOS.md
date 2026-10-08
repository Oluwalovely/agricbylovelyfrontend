# Password recovery and photos

Profile includes a separate photo editor; Fields details and My Crops include optional record photos. Choose a JPEG, PNG or WebP up to 5 MB, then Save photo or Save replacement. Remove photo asks for confirmation. The current image remains during upload failures; successful changes refresh saved records and farm caches. Avatars update the current identity, with initials as a broken-image fallback in the header/sidebar.

Forgot password keeps connection, configuration and rate-limit errors visible. Its successful response acknowledges a request without claiming inbox delivery or revealing account existence. Reset password validates the link format and displays API errors separately from connection failures.

Run `npm test`, `npm run lint`, and `npm run build`. Browser checks with mocked APIs verified multipart file contents, avatar failures/retry/replacement/reload/removal, field/planting photos after reload, invalid files, recovery errors, and mobile width. Backend provider setup and a real user-controlled reset email are still required; see the backend's EMAIL-PHOTOS.md.
