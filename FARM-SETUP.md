# Phase 2: farm setup

Profile now reads and edits the farmer's personal details, farm name, hectares, soil and location. The sign-in email is read-only. Coordinates are optional and can be detected at the farm or entered manually. Clearing both coordinates or the optional size clears the saved value. Profile saves update the account display and invalidate dependent farm queries.

Password changes require the current password and matching new-password confirmation, then end the local session so the farmer signs in again. Account deletion requires typing the exact account email and explains the permanent removal of farm records. Avatar uploads remain in Phase 7.

Fields now supports listing, creation, editing, record inspection and confirmed deletion. Details include active and harvested planting records. Deleting a field preserves its planting records via the existing database ON DELETE SET NULL relation. Crop editing and planting navigation are completed alongside My Crops in Phases 3–4.

Dashboard setup eligibility depends on missing location/fields, without an account-age deadline. The wizard saves through the same forms, reports failures, updates the account and refreshes caches. Skipping/finishing is remembered per farmer in this browser; saved fields/location persist on the server. A different browser can offer setup again if details remain missing. Profile and Fields always remain available to finish later. No schema migration or database reset is required.

Validation: 17 frontend and 18 backend tests; frontend lint/build; desktop/mobile browser checks with mocked APIs for profile error/save/reload, zero coordinates, field create/edit/reload/details/delete, and onboarding persistence. No production user was created, modified or deleted by these checks. The existing bundle-size warning remains non-blocking.
