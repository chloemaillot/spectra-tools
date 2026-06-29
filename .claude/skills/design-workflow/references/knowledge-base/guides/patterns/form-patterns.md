# Form Patterns

## Standard form layout

```
┌────────────────────────────────┐
│  Label                         │
│  ┌──────────────────────────┐  │
│  │  Input                   │  │
│  └──────────────────────────┘  │
│  Helper text / error           │
│                                │
│  Label                         │
│  ┌──────────────────────────┐  │
│  │  Input                   │  │
│  └──────────────────────────┘  │
│                                │
│             [Cancel]  [Submit] │
└────────────────────────────────┘
```

## Field spacing
- Between fields: `spacing/lg`
- Between label and input: `spacing/2xs`
- Between input and helper text: `spacing/xs`

## Validation states
| State | Component prop | Color token |
|-------|---------------|-------------|
| Default | `state: default` | `color/border/neutral` |
| Focus | `state: focus` | `color/border/focus` |
| Error | `state: error` | `color/border/danger` |
| Success | `state: success` | `color/border/success` |
| Disabled | `isDisabled: true` | `color/border/neutral-subtle` |

## Error messages
- Show below the field
- Use `color/text/danger-bold` for error text
- Use `body/sm/regular` text style
- Always include an icon: `alert-circle` (sm, danger color)

## Form actions
- Primary action (Submit/Save): `Button` variant `primary` size `medium`
- Secondary action (Cancel): `Button` variant `ghost` size `medium`
- Destructive action (Delete): `Button` variant `danger` size `medium`
- Alignment: right-aligned at bottom of form
- Gap between buttons: `spacing/sm`

## Multi-step forms
- Use `Stepper` component at top or sidebar
- One logical group of fields per step
- Show progress: "Step 2 of 4"
- Validate current step before allowing next
