# Icons Usage Guide

## Rules
- Icons are DS components — always import via `importComponentByKeyAsync` using `icons.json`
- Never use raw rectangles or SVGs directly
- Icon size is controlled by the `size` variant property
- Icon color is bound via `setBoundVariable` to a color token

## Standard sizes

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 12px | Inline with small text |
| sm | 16px | Standard inline usage |
| md | 20px | Standalone icons, buttons |
| lg | 24px | Feature icons, headers |
| xl | 32px | Empty states, illustrations |

## Color binding
```javascript
const iconComp = await figma.importComponentByKeyAsync(iconKeys['chevron-right']);
const icon = iconComp.createInstance();
icon.setProperties({ size: 'sm' });

// Find the inner icon vector and bind color
const vector = icon.findOne(n => n.type === 'VECTOR' || n.name === 'icon');
if (vector) {
  vector.setBoundVariable('fills', 0, colorVars['color/icon/neutral-bold'].id);
}
```

## Full registry
See `registries/icons.json` for all 350 icons with keys.
