# Phase 4: growing and harvesting

My Crops now edits active growth stages and notes, records harvests, corrects completed harvest dates/yields/notes, and confirms permanent planting removal. Saving a harvest selects the Harvested view. Removing a planting removes its contribution to totals but retains its crop guide and field. All affected farm queries refresh after saves and deletion.

Harvest dates use UTC calendar days and must fall between planting and today. Blank yield means unknown (null); zero is a recorded zero yield. Harvested records cannot be reopened as active plantings: use a new planting for the next growing cycle. A failed save retains inputs for retry. No migration or production farm mutation was performed during verification.

Verification: 22 frontend and 35 backend tests passed; lint/build and mocked browser journeys passed for stage/notes save failures/retry/reload, harvest history/reload, active/dashboard/field refresh, yield corrections including zero and unknown, mobile layout, and cancel/confirmed deletion. Calendar and report pages remain Phase 5; their underlying lifecycle dates and totals are corrected now.
