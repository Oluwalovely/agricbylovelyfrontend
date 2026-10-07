# Phase 3: catalogue and planting

Crop Encyclopedia supports submitted text search, categories, 12-record pages, URL-preserved filters/page, reload and direct links to /crops/:id. Broken or missing crop images use a plant icon. Guides show recorded growing details and explicitly identify missing information; timing is an estimate.

The planting form loads owned fields, supports no field assigned, and saves planting date, optional positive quantity and notes. Quantity units belong in notes because the existing schema has no unit column. An estimated harvest date is previewed from the catalogue duration; no duration produces no estimate. A failed request leaves the form available for retry. Saving disables submission while pending, refreshes private farm queries, and provides links to the saved record, dashboard and field.

My Crops now lists saved plantings with active/harvested/all filters, field links and notes. This is a viewing surface for Phase 3. Stage updates, harvesting and record removal remain Phase 4. Dashboard crop cards link to these records. Fields links can carry a field selection into the catalogue and planting form.

Catalogue searches use the existing saved database only. They do not import external results or call AI services. No new dependencies, migration, seed or production data write was needed.

Verification: 20 frontend and 24 backend tests passed, along with frontend lint/build. Browser checks with mocked APIs covered search/category clearing, pagination/reload, failed image fallback, field preselection, planting failure/retry, record reload, dashboard/field refresh and mobile layout. Existing records were not changed by checks.
