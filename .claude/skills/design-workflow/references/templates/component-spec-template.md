# {Name} — Component Specification

**Type**: Component
**Status**: draft
**Created**: {date}

---

## Description
_What is this component, why does it exist, what design principle does it embody?_

---

## Architecture overview

```
{Name}
├── {SubComponent1}
│   ├── {Primitive1}
│   └── {Primitive2}
└── {SubComponent2}
    └── {Primitive3}
```

---

## Component hierarchy

| Level | Name | Role |
|-------|------|------|
| Primitive | Box | Layout container |
| Primitive | Typography | Text rendering |
| Block | {BlockName} | ... |
| Composition | {Name} | Full component |

---

## Props API

```typescript
interface {Name}Props {
  // Variants
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'small' | 'medium' | 'large';

  // Booleans (is prefix)
  isDisabled?: boolean;
  isLoading?: boolean;

  // Events (on prefix)
  onPress?: () => void;

  // Content
  label: string;
  icon?: string; // icon name from icons registry
}
```

---

## Layout specs

| Property | Value | Token |
|----------|-------|-------|
| Padding horizontal | ... | `spacing/...` |
| Padding vertical | ... | `spacing/...` |
| Gap | ... | `spacing/...` |
| Border radius | ... | `radius/...` |
| Min width | ... | — |
| Height | ... | — |

---

## Design tokens

| Property | Token | Notes |
|----------|-------|-------|
| Background | `color/background/...` | |
| Text color | `color/text/...` | |
| Border | `color/border/...` | |
| Border radius | `radius/...` | |
| Padding | `spacing/...` | |
| Gap | `spacing/...` | |

---

## Reused DS components

| Component | Variant | Size | Notes |
|-----------|---------|------|-------|
| Typography | — | — | Label text |
| Icon | — | sm | Left icon |

---

## States

| State | Visual change |
|-------|--------------|
| Default | — |
| Hover | Background lightens |
| Active | Background darkens |
| Disabled | Opacity 40%, no interaction |
| Loading | Icon replaced with spinner |

---

## Acceptance criteria

- [ ] All variants render correctly (primary, secondary, ghost)
- [ ] All sizes render correctly (small, medium, large)
- [ ] Disabled state blocks interaction
- [ ] All visual values are bound to Figma variables
- [ ] Text uses correct text style (not hardcoded font)
- [ ] Layer names are semantic

---

## Open questions

- ?
