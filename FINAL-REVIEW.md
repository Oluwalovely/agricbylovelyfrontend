# Portfolio finish review

Reviewed 8 October 2026 after the public landing page was published.

## Verified

- All 29 frontend and 64 backend tests passed. Frontend lint and production build passed.
- Empty-account and unavailable-service fixtures rendered the dashboard, fields, crop catalogue, missing crop guide, My Crops, weather, calendar, notifications, reports, and profile without browser runtime errors or horizontal overflow at 320px.
- Dashboard, Fields, Notifications, and Reports exposed an error and recovery action when their API reads returned 503.
- The logout confirmation now identifies itself as a dialog, moves focus inside, keeps Tab/Shift+Tab inside, prevents interaction with the background, restores focus and body scrolling after cancellation, and fits short mobile screens. Confirmed logout clears the local session and opens Login. These checks passed at desktop and 320px widths.
- The backend health check returned HTTP 200 with the database connected during this review.

Page-state checks used isolated browser sessions and mocked responses. They do not claim a new production write test of every farm workflow. Earlier phase checks and the user's live confirmations remain recorded in the parent project plan.

## Changes

Fixed the logout dialog's keyboard access, close-button label, focus restoration, and viewport height handling. The account and farm-data flows are unchanged. Replaced the starter frontend README, added backend setup documentation and credential-free environment examples, and excluded private environment files from Git.

## Remaining user verification

Profile-photo upload, welcome email, password recovery, and the earlier farm workflows have been confirmed by the user. Confirm photo replacement, persistence after refresh, removal, and field/planting photo uploads on the live site. These provider-backed checks were exercised with mocks but are not yet recorded as user-confirmed production checks.

## Known limits

Scheduled jobs inside the free-host backend run only while it is awake. Scheduled email remains disabled. Harvest dates and crop progress are estimates until updated or recorded. Weather advisories are general guidance. The existing large-bundle warning does not fail the build and remains a possible future performance improvement.
