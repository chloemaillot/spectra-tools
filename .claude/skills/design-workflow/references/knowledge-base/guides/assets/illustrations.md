# Illustrations Usage Guide

## When to use
Illustrations are used for **empty states**, **onboarding**, and **error pages**.
Never use illustrations as decorative elements in populated content.

## Placement rules
- Empty state: centered in the content zone, above the CTA
- Error page: centered on the page
- Onboarding: can be placed aside content (split layout)

## Size guidance
| Context | Recommended size |
|---------|-----------------|
| Empty state (card) | 80–120px |
| Empty state (full page) | 160–200px |
| Error page | 200–240px |
| Onboarding hero | 280–320px |

## Usage in scripts
```javascript
const illComp = await figma.importComponentByKeyAsync(illustrationKeys['empty-portfolio']);
const illustration = illComp.createInstance();
illustration.resize(120, 120);
emptyStateFrame.appendChild(illustration);
```

## Full registry
See `registries/illustrations.json` for all 76 illustrations with keys.
