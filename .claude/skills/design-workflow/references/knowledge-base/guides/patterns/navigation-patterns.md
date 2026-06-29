# Navigation Patterns

## Top navigation
Used for: main app navigation between major sections.

```
┌─────────────────────────────────────────────┐
│  Logo   │  Nav Item  │  Nav Item  │  Profile │
└─────────────────────────────────────────────┘
```
- Component: `Tabs` (horizontal variant) or custom nav bar
- Height: bound to `spacing/2xl`
- Background: `color/background/bold`

## Sidebar navigation
Used for: settings, multi-section flows, secondary navigation.

```
┌──────────┬────────────────────────┐
│ Nav Item │                        │
│ Nav Item │     Content            │
│ Nav Item │                        │
│ Nav Item │                        │
└──────────┴────────────────────────┘
```
- Component: `Sidebar`
- Width: fixed (typically 240–280px)
- Background: `color/background/bold` (sidebar) vs `color/background/subtle` (content)

## Breadcrumb
Used for: deep navigation paths, settings sub-pages.
- Component: `Breadcrumb`
- Placed: top of content area, below main nav

## Stepper (multi-step flows)
Used for: onboarding, account setup, forms with multiple steps.

```
Step 1 ──── Step 2 ──── Step 3 ──── Step 4
  ✓            ●            ○            ○
```
- Component: `Stepper`
- Variants: horizontal (top) or vertical (sidebar)
- Active step: `state: active`
- Completed: `state: completed`

## Tabs
Used for: switching between views within a page section.
- Component: `Tabs`
- Placement: inside a card or at section level
- Max recommended: 5–6 tabs
