# Public landing page

The `/` route explains the app's existing field records, planting and harvest tracking, local weather, calendar, notifications, and reports. It uses the existing logo, farm image, green colours, Lora headings, and Plus Jakarta Sans body text. Login and registration continue through their existing routes.

Copy uses concrete descriptions and action labels. No testimonials, adoption statistics, yield guarantees, pricing promises, or additional product features are claimed. Estimated harvest dates are explicitly described as estimates.

`src/assets/dashboard-preview.png` is a screenshot of the actual dashboard rendered locally with isolated example data, not a customer's account. Its caption labels the records as examples. No production data was changed to make the image. The image is static; public visitors do not need an account or a database request to view it.

Verification: lint and production build passed; all 29 existing frontend tests passed. Browser checks covered 1440px desktop, 390px mobile, and 320px dark mode, loaded images, absence of horizontal overflow, and login/registration navigation. The existing bundle-size warning remains; it does not fail the build.

The landing page is the first part of Phase 8. The broader final review of the full app is still separate work.
