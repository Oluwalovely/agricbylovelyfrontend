# Public landing page

The `/` route explains existing field records, planting and harvest tracking, local weather, calendar, notifications, and reports. It retains the logo, green identity, Lora headings, Plus Jakarta Sans body text, and six-part sequence: hero, app preview, features, setup steps, closing account action, and footer. Login and registration use their existing routes.

The full-width navigation stays at the top while scrolling, using an opaque theme-aware background. Section links and the skip link account for its desktop/mobile height so headings remain visible below it.

The approved visual enhancement adds a larger headline with a solid green italic phrase, an asymmetrically curved farm photograph with a crop-progress overlay, a deep green (`#173a28`) product section, alternating crop/weather illustrations, and a connected numbered setup list. All six feature descriptions remain; Reports describes recorded yields, without an income claim.

The product section has keyboard-accessible Dashboard, Crop progress, Weather, and Harvest dates tabs. Arrow keys, Home, and End change the selected tab and focus. Narrow screens provide a scrollable dashboard image and a visible hint. Focus outlines, the skip link, and reduced-motion support remain in place. The photograph has a restrained entrance; the product stage reveals once when it enters the viewport. Reduced-motion styles disable both animations.

`src/assets/dashboard-showcase.png`, `crop-showcase.png`, `weather-showcase.png`, and `harvest-showcase.png` capture the actual app with isolated example records and mock weather. Visible captions label the examples, including weather. No customer account or production data was used or changed to make the images. Captures are static and require no visitor account or database request. The older `dashboard-preview.png` is retained as an unused historical asset.

Copy uses concrete descriptions and action labels. It makes no testimonial, adoption, yield guarantee, pricing, or additional feature claims. Harvest dates are described as estimates.

Verification for this enhancement: lint and production build passed; all 29 existing frontend tests passed. Browser checks covered 1440px, 820px, 390px, and 320px in dark mode, including loaded images, responsive layout, keyboard preview tabs, and account navigation. The existing bundle-size warning remains non-blocking.

The broader app review is recorded separately in `FINAL-REVIEW.md`. `DESIGN.md` records the current landing-specific visual guidance without prescribing an app-wide redesign.
