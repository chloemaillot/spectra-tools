# UI References Guide

## Purpose
Screenshots in this folder are **composition and layout references ONLY**.

## What to extract from them
- Zone placement (sidebar, header, content area, footer)
- Information density and proportions
- Visual hierarchy (what's big, what's small)
- Navigation patterns (where nav lives, how sections are organized)

## What to NEVER extract from them
- Colors or hex values
- Font sizes or font weights
- Specific spacing values
- Component variants or styles

**Why**: The web app may not be on the latest DS version. All visual values come from the registries.

---

## Screenshot inventory

Add screenshots here as `XX-screen-name.png` (where XX is a sequence number).

### How to add a new reference
1. Take a screenshot of the screen
2. Save as `screenshots/XX-screen-name.png`
3. Add an entry below with composition notes

---

## Screens

_No screenshots added yet. Add them to `screenshots/` and document them here._

### Example entry format:
```
### 01-dashboard-overview.png
**Category**: Dashboard
**Shows**: Main layout with sidebar (240px) + content area. Chart at top, table below.
**Composition notes**:
- Sidebar: fixed left, full height
- Content: 2-column grid at top (chart + summary cards), full-width table below
- Header: 64px, contains page title + action button
```
