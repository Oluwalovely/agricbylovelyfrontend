---
name: AgricByLovely — incumbent identity and landing extension
description: Existing app identity, with visual guidance bounded to the public landing route.
colors:
  green-dark: "#3B6D11"
  green-mid: "#639922"
  green-light: "#EAF3DE"
  green-pale: "#F2F8EA"
  bg-primary: "#FFFFFF"
  bg-secondary: "#F8FAF5"
  bg-tertiary: "#F2F5EE"
  text-primary: "#1A1A1A"
  text-secondary: "#4B5563"
  border-dark: "#D1D9CA"
  button-hover: "#2c530c"
typography:
  display:
    fontFamily: "Lora, serif"
    fontSize: "clamp(36px, 4.35vw, 60px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Lora, serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Lora, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
rounded:
  action: "999px"
  photograph: "16px"
  preview: "12px"
components:
  landing-button-primary:
    backgroundColor: "{colors.green-dark}"
    textColor: "#fff"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "15px 24px"
  landing-button-primary-hover:
    backgroundColor: "{colors.button-hover}"
---

# Design System: AgricByLovely

## Overview

The existing app is the visual authority. Preserve its green palette, Lora headings, Plus Jakarta Sans body text, and the existing logo asset at `src/assets/logo.png`. This document records that identity and the current public landing route extension; it does not authorize a redesign of authenticated screens or establish new product facts.

The landing page uses readable serif headings, pale backgrounds, concrete farm imagery, and clear account actions. Its presentation follows the incumbent identity rather than introducing a new visual metaphor. The measurements and component details below describe the landing surface only unless explicitly identified as global tokens.

**The Incumbent Authority Rule.** Use `src/index.css` as the live source for global color and font variables. Use `src/pages/Landing.css` for landing-specific measurements and behavior. If implementation changes, refresh this record rather than treating an outdated snapshot as a competing theme.

## Colors

Primary: the existing dark green carries account actions and light-mode feature icons. Mid green provides visible keyboard focus. Light and pale green remain part of the incumbent app palette; their presence here does not require adding new landing decorations.

Neutral: primary, secondary, and tertiary backgrounds separate the landing's sections; primary text carries headings and navigation, secondary text carries explanatory copy, and the darker border separates features and the footer. The frontmatter values capture light mode.

The global `.dark` class replaces backgrounds with `#111827`, `#0D1410`, and `#1A2318`; primary and secondary text become `#F9FAFB` and `#D1D5DB`, and the darker border becomes `#2D3F28`. Landing feature icons use `#b2d68d` in dark mode. These existing overrides must remain functional.

**The Shared Color Rule.** Resolve landing surfaces and text through existing CSS variables so the route follows the app's theme. Keep the existing primary button hover treatment; do not introduce another accent palette.

## Typography

Lora is the global heading family and the landing footer's brand-name family. Plus Jakarta Sans is the global body family, used for explanatory paragraphs, navigation, captions, and action labels. Font loading is already defined in `src/index.css`.

The frontmatter records the landing heading hierarchy. Hero paragraphs use larger body text (17px, line-height 1.8, maximum 54ch), reduced to 16px on small screens. Feature and step descriptions use compact body text (14px, line-height 1.8). Preview captions use 13px text with line-height 1.7. Headings use balanced wrapping.

**The Existing Type Rule.** Preserve these two font families and use type size, weight, and spacing to clarify hierarchy within the landing route.

## Layout

The public route has a header followed by the existing six-part sequence: hero, dashboard preview, features, setup steps, closing account action, and footer. Keep that sequence. `LANDING.md` holds the surface's content and screenshot context; neither this sequence nor its marketing strategy is a rule for authenticated app screens.

Landing content uses a centered container capped at 1184px, with 40px side margins. The desktop hero pairs copy and a photograph in a two-column grid (1.12fr / 1fr). The features form three columns; setup steps use two columns. Section spacing ranges from 80px to 96px vertically, with larger gaps between section introductions and content.

At 1000px and below, features become two columns and horizontal gaps reduce. At 700px and below, the container uses 20px side margins, the hero, features, and setup steps become single-column, section spacing reduces to 56px, and the footer stacks. Header section links hide while login and registration remain available. Account actions wrap rather than overflowing.

## Elevation & Depth

Section backgrounds and thin dividers provide most of the landing's separation. Features are open articles rather than raised cards. The dashboard screenshot has the existing preview shadow (`0 14px 48px rgba(30, 50, 20, .12)`). The global app also defines small, medium, and large shadow variables; this landing record does not prescribe their use elsewhere.

## Shapes

Account actions use pill corners (999px). The hero photograph uses softly rounded corners (16px) with clipping; the dashboard image uses a smaller radius (12px). Feature articles begin with a thin top border. Retain this division between rounded imagery and open text regions.

## Components

Primary account links use the green pill style, white text, a minimum height of 48px, and a short background transition (160ms, ease-out). The header variant uses tighter padding (11px 20px; 10px 16px on small screens). Supporting actions use text links with small arrows and a minimum height of 44px; hover adds an underline.

Header navigation keeps the original logo, existing account routes, and in-page anchors. Navigation and footer links underline on hover. Every landing link has a visible focus outline (3px, mid green, 5px offset). A skip link reveals itself on focus and targets the main content.

The hero uses the existing farm photograph with an attached caption. The dashboard preview uses the real interface screenshot with explicitly labeled example records. Features use existing line icons, headings, and descriptions without enclosed cards. Setup uses a native numbered list. The footer combines the brand name, a short description, and existing navigation links.

Reduced-motion behavior removes landing transitions and disables smooth scrolling. Preserve this behavior when adding polish.

## Do's and Don'ts

- **Do** preserve the existing green colors, two font families, logo, and six-part landing sequence.
- **Do** use existing theme variables, readable wrapping, and visible keyboard focus.
- **Do** retain truthful image captions and concrete descriptions of implemented behavior.
- **Don't** turn landing-specific measurements into a mandatory app-wide component system.
- **Don't** invent testimonials, adoption statistics, yield guarantees, pricing promises, or additional product features.
- **Don't** present screenshot example records as customer data or guaranteed outcomes.

This is a bounded extraction from `src/index.css`, `src/pages/Landing.jsx`, `src/pages/Landing.css`, and `LANDING.md`. No additional product or visual direction is inferred. A component-preview sidecar is intentionally omitted: this task records the existing landing authority rather than defining a new reusable component library.
