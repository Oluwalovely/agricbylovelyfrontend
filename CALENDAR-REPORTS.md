# Phase 5: calendar and reports

Calendar provides a month grid, previous/next/current month navigation, month picker and day selection. Planting, estimated harvest and actual harvested dates have distinct labels. Dates link to their planting records; active crops without milestones in a selected month remain visible. Upcoming estimates include overdue crops and a 30/60/90-day horizon. The calendar reflects saved crop records, without separate custom tasks.

Reports displays all-time plantings, active crops, completed harvests, fields, recorded yield and harvest completion. Active-stage bars show counts. The year chart separates planted, harvested and estimated harvest counts and links each month to Calendar. Recent activity and harvest history link to My Crops, which scrolls to the selected record. Harvest history uses ten-record pages with stable all-page yield totals. Zero yield differs from unknown yield.

Month/day, report year and history page are preserved in URLs. Private queries are farmer-scoped and accept cancellation signals; existing farm mutations invalidate both pages. Loading, retry and empty states are distinct. Charts use labelled data tables and bars with visible counts rather than an additional chart dependency.

Verification: 25 frontend and 41 backend tests passed; lint/build; mocked desktop/mobile browser checks for outage/retry, month/day navigation/reload, year selection, pagination/reload and consistent yield, record links, empty farm/year/history, and saved harvest refresh across cached pages. No production records were changed during verification. The bundle size warning remains non-blocking; no migration is needed.
