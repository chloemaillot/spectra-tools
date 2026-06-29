# Action: `validate`

Run the spec validator against the active spec to catch unknown DS references before generating a design.

## When to use

- After writing a spec, before running `design`
- After updating a spec to make sure all referenced tokens, components, and text styles still exist in the DS

## Procedure

1. Find the active spec in `specs/active/` (there should be exactly one)
2. Run the validator:

   ```bash
   node scripts/validate-spec.js specs/active/<spec-name>.md
   ```

3. Read the report:
   - **Errors** (unknown tokens): block the design step until fixed
   - **Warnings** (unknown components or text styles): surface them to the user and ask whether to proceed

4. If the spec is clean, tell the user:

   > Spec validated against the DS registries. No unknown references. Run `/design-workflow design` when ready.

5. If there are issues, present them as a punch list with file:line, then ask the user to fix the spec or update the DS registries.

## What the validator catches

- Backticked token references (`spacing/md`, `color/background/primary`, etc.) that don't exist in `variables.json`
- Component names mentioned under "Reused DS components" or "Component hierarchy" sections that don't exist in `components.json`
- Text style names mentioned under "Text styles" or "Typography" sections that don't exist in `text-styles.json`

## What it doesn't catch

- Semantic correctness of the spec (only existence of references)
- Style consistency, padding rhythm, etc. (out of scope, handled by `review` step after design)
- Spec template completeness (use `quality-gates.md` for that)

## Exit codes

- `0` — spec is clean, design can proceed
- `1` — unknown references found, spec needs fixing
- `2` — setup issue (missing spec file or missing registries)
