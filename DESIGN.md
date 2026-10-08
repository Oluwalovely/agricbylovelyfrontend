---
name: AgricByLovely — landing extension
description: Existing app identity with visual guidance scoped to the public landing route.
colors:
  green-dark: "#3B6D11"
  green-mid: "#639922"
  bg-primary: "#FFFFFF"
  bg-secondary: "#F8FAF5"
  bg-tertiary: "#F2F5EE"
  text-primary: "#1A1A1A"
  text-secondary: "#4B5563"
  border-dark: "#D1D9CA"
  showcase-green: "#173a28"
  showcase-surface: "#f2f6ec"
  focus-green: "#80ad48"
  button-hover: "#2c530c"
  white: "#fff"
  photo-ground: "#203517"
  crop-overlay-surface: "#f2f7eb"
  crop-overlay-heading: "#365422"
  crop-overlay-caption: "#526746"
  headline-dark-mode: "#b9d998"
  showcase-heading: "#f5faef"
  showcase-copy: "#d1e0cd"
  tab-border: "#52735d"
  tab-text: "#e0edd9"
  tab-hover: "#28513a"
  tab-selected-surface: "#deedc7"
  tab-selected-text: "#193720"
  stage-heading: "#192919"
  stage-copy: "#4a5e41"
  feature-icon-dark-mode: "#b2d68d"
  crop-detail-surface: "#e8efdc"
  weather-detail-surface: "#ede8dc"
  detail-caption: "#495d3b"
typography:
  display:
    fontFamily: "Lora, serif"
    fontSize: "clamp(42px, 5.25vw, 76px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Lora, serif"
    fontSize: "clamp(30px, 3.6vw, 50px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.03em"
  title:
    fontFamily: "Lora, serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    lineHeight: 1.6
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  hero-body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "16px"
    lineHeight: 1.85
  feature-body:
    fontSize: "15px"
    lineHeight: 1.85
  overlay-label:
    fontSize: "13px"
    fontWeight: 600
  example-label:
    fontSize: "10px"
    fontWeight: 400
  example-label-small:
    fontSize: "9px"
  overlay-caption:
    fontSize: "11px"
    lineHeight: 1.7
  caption:
    fontSize: "12px"
    lineHeight: 1.8
  scroll-hint:
    fontSize: "12px"
    lineHeight: 1.7
  stage-title:
    fontFamily: "Lora, serif"
    fontSize: "28px"
  stage-title-small:
    fontSize: "24px"
  step-number:
    fontFamily: "Lora, serif"
    fontSize: "22px"
  display-tablet:
    fontSize: "clamp(42px, 8vw, 64px)"
  display-small:
    fontSize: "43px"
rounded:
  action: "999px"
  surface: "16px"
components:
  landing-button-primary:
    backgroundColor: "{colors.green-dark}"
    textColor: "#fff"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "16px 26px"
  landing-button-primary-hover:
    backgroundColor: "{colors.button-hover}"
---

# Design System: AgricByLovely

## Overview

Landing navigation stays at the viewport top while scrolling. The outer `.landing-header` uses sticky positioning, `top: 0`, z-index 50, and the opaque secondary background. `.landing-header-inner` retains the centered content width. Section scroll offsets are 145px on desktop and 113px below 800px, leaving room below the 121px/89px header.

The existing app remains the visual authority: preserve its green palette, Lora headings, Plus Jakarta Sans body text, and `src/assets/logo.png`. This record covers the user-approved landing enhancement only. It does not prescribe a redesign of authenticated screens or establish additional product facts.

The public route pairs a stronger serif headline and farm photograph with real interface captures. A deep green product section and alternating crop/weather illustrations give the page a clearer rhythm while retaining its six-part structure and concrete copy.

**The Incumbent Authority Rule.** Global identity and theme variables come from `src/index.css`; landing measurements and behaviors come from `src/pages/Landing.css`. This document records their implementation rather than creating a competing theme.

## Colors

Existing green carries account actions and feature icons. Existing background, text, and border variables follow the app's light/dark theme. The landing's product showcase uses a fixed deep green background, pale screenshot stage, and light text; illustration surfaces remain pale so actual app captures remain legible.

The headline's final phrase is green and italic, with a lighter green override in dark mode. It is a solid color, without a gradient. The frontmatter includes the observed landing focus color, which is distinct from the global mid-green token.

## Typography

Keep Lora for headings and the footer brand name; use Plus Jakarta Sans for paragraphs, navigation, captions, and controls. The frontmatter captures desktop heading roles. At 800px and below the hero heading uses `clamp(42px, 8vw, 64px)`; at 480px and below it uses 43px. Hero paragraphs use 16px text, line-height 1.85, and a maximum 53ch on desktop. Feature descriptions use 15px text. Product-stage titles use 28px, reduced to 24px at 800px.

## Layout

The route retains a header followed by hero, app preview, features, setup steps, closing account action, and footer. This composition is specific to the landing route.

The centered container caps at 1240px with 48px side margins. Desktop hero columns use a 1.08fr / 1fr split. The photograph has an overlapping crop-progress capture. The preview stage pairs a screenshot with supporting text; features alternate paired descriptions and crop/weather illustrations, followed by two remaining feature descriptions. The setup section pairs its introduction with a connected three-step list. Desktop section spacing generally ranges from 88px to 100px.

At 1100px and below, container margins become 32px and gaps tighten. At 800px and below, margins become 20px; the hero, preview stage, feature stories, and setup layout stack. Header section links hide while account routes remain visible. At 480px and below, major section spacing becomes 60px, the final feature pair and footer stack, and the dashboard image becomes scrollable with an explicit hint. Account actions and preview tabs wrap.

## Elevation & Depth

Tonal sections provide the main separation. Soft shadows lift the hero's crop overlay and selected screenshot close-ups. Primary buttons gain a small shadow on hover. Feature descriptions remain open text regions; their final pair has a shared top divider.

## Shapes

Actions and screenshot tabs use pill corners. Product and illustration surfaces use 16px corners. The hero photograph has an asymmetric curved top-left corner (160px desktop, 120px at 800px, 90px at 480px) with the other corners at 16px. Step numbers use circular 48px outlines, joined by thin vertical lines.

## Components

Primary account links retain the existing dark green and white treatment, 48px minimum height, and 180ms hover transitions. Supporting text links use small arrows; arrows move 3px on hover. Header navigation keeps the existing logo and account routes. Landing links, buttons, and focusable preview regions have a visible 3px focus outline with 5px offset. Preserve the skip link.

The app preview has four tabs: Dashboard, Crop progress, Weather, and Harvest dates. Selected tabs use a pale green fill. Arrow keys cycle tabs; Home and End jump to the first and last. Roving tab stops, selected state, and panel labeling keep keyboard navigation understandable. On narrow screens the dashboard capture remains horizontally scrollable and keyboard focusable.

Actual app captures use isolated example farm records and weather, with visible example labels. The crop overlay, crop detail, and weather detail reuse these captures. The setup remains a semantic ordered list with decorative numbers hidden from assistive technology.

The photograph enters with a restrained 800ms scale/clip animation. An IntersectionObserver triggers the product stage's 650ms reveal once, at a 0.15 threshold. Content remains visible if the observer is unavailable. Reduced-motion styles disable landing animations, transitions, and smooth scrolling.

## Do's and Don'ts

- **Do** retain the existing green identity, fonts, logo, and six-part landing sequence.
- **Do** preserve visible focus, keyboard tab operation, responsive wrapping, and reduced-motion behavior.
- **Do** label captures as examples and keep harvest dates explicitly estimated.
- **Don't** promote these landing compositions into an app-wide redesign prescription.
- **Don't** invent testimonials, adoption statistics, yield guarantees, pricing promises, or additional features.
- **Don't** describe Reports as income reporting; the current copy describes recorded yields.

Source scope: `src/index.css`, `src/pages/Landing.jsx`, `src/pages/Landing.css`, and `LANDING.md`. No component-preview sidecar is maintained for this bounded surface.
