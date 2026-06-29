# {Name} — Screen Specification

**Type**: Screen
**Status**: draft
**Created**: {date}

---

## Description
_Which screen is this? What is the user's goal? What is the context (first visit, returning user, etc.)?_

---

## Layout structure

```
┌─────────────────────────────────┐
│           Header / Nav          │  height: ...
├──────────┬──────────────────────┤
│          │                      │
│ Sidebar  │    Content Area      │  sidebar: ...px
│          │                      │
│          │                      │
├──────────┴──────────────────────┤
│              Footer             │  height: ...
└─────────────────────────────────┘
```

**Grid**: {columns} columns, {gutter} gutter, {margin} margin
**Breakpoints**: desktop only / responsive (define breakpoints)

---

## Sections breakdown

### Header
_Description, components used, behavior_

### Sidebar (if applicable)
_Navigation items, active state, collapse behavior_

### Content area
_Main content description, zones_

### Footer (if applicable)
_Content, links_

---

## DS components used

| Component | Variant | Size | Zone | Notes |
|-----------|---------|------|------|-------|
| Button | primary | medium | header | CTA |
| ... | | | | |

---

## Content structure

_Describe the data: realistic examples or placeholder patterns_

```
{field}: {example value}
{field}: {example value}
```

---

## States

| State | Description | Trigger |
|-------|-------------|---------|
| Loading | Skeleton placeholders | Initial load |
| Empty | Illustration + CTA | No data |
| Populated | Full content | Data loaded |
| Error | Error banner + retry | API failure |

---

## Design tokens

| Property | Token | Zone |
|----------|-------|------|
| Page background | `color/background/...` | root |
| Sidebar background | `color/background/...` | sidebar |
| Content background | `color/background/...` | content |
| Header height | `spacing/...` | header |
| Sidebar width | — | sidebar |
| Content padding | `spacing/...` | content |

---

## Acceptance criteria

- [ ] All states are present (loading, empty, populated, error)
- [ ] Layout matches structure diagram
- [ ] All DS components are used (no custom raw frames for existing components)
- [ ] All visual values are bound to Figma variables
- [ ] Layer names are semantic
- [ ] Real content / realistic placeholder data

---

## Open questions

- ?
