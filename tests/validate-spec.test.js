const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseSpec,
  validate,
  indexComponents,
  indexVariables,
  indexTextStyles,
  KNOWN_TOKEN_CATEGORIES,
} = require("../scripts/validate-spec");

const SAMPLE_VARIABLES = {
  variables: [
    { name: "color/background/primary" },
    { name: "color/text/muted" },
    { name: "spacing/md" },
    { name: "spacing/lg" },
    { name: "radius/sm" },
  ],
};

const SAMPLE_COMPONENTS = {
  components: {
    Actions: [{ name: "Button" }, { name: "IconButton" }],
    Containers: [{ name: "Card" }, { name: "Sheet" }],
    Typography: [{ name: "Typography" }],
  },
};

const SAMPLE_TEXT_STYLES = {
  textStyles: [{ name: "Body" }, { name: "Heading-1" }],
};

test("known token categories include the basics", () => {
  for (const cat of ["color", "spacing", "radius", "font-size"]) {
    assert.ok(KNOWN_TOKEN_CATEGORIES.has(cat), `${cat} should be known`);
  }
});

test("parseSpec extracts backticked tokens with known categories", () => {
  const md = [
    "# Spec",
    "",
    "Use `spacing/md` for padding and `color/background/primary` for fill.",
    "Avoid `path/to/file` which is not a token.",
  ].join("\n");

  const parsed = parseSpec(md);
  const refs = parsed.tokens.map((t) => t.ref);
  assert.deepEqual(refs.sort(), ["color/background/primary", "spacing/md"]);
});

test("parseSpec extracts components from 'Reused DS components' section", () => {
  const md = [
    "# Spec",
    "",
    "## Reused DS components",
    "",
    "| Component | Variant | Size | Notes |",
    "|-----------|---------|------|-------|",
    "| Button | primary | medium | Submit |",
    "| Card | — | — | Wrapper |",
  ].join("\n");

  const parsed = parseSpec(md);
  const names = parsed.components.map((c) => c.name);
  assert.deepEqual(names.sort(), ["Button", "Card"]);
});

test("validate flags unknown tokens as errors", () => {
  const parsed = {
    tokens: [
      { ref: "spacing/md", line: 1, category: "spacing" },
      { ref: "spacing/extra-large", line: 2, category: "spacing" },
    ],
    components: [],
    textStyles: [],
  };
  const indexes = {
    components: indexComponents(SAMPLE_COMPONENTS),
    variables: indexVariables(SAMPLE_VARIABLES),
    textStyles: indexTextStyles(SAMPLE_TEXT_STYLES),
  };

  const issues = validate(parsed, indexes);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, "unknown-token");
  assert.equal(issues[0].severity, "error");
  assert.match(issues[0].message, /spacing\/extra-large/);
});

test("validate flags unknown components as warnings", () => {
  const parsed = {
    tokens: [],
    components: [
      { name: "Button", line: 5 },
      { name: "MysteryComponent", line: 6 },
    ],
    textStyles: [],
  };
  const indexes = {
    components: indexComponents(SAMPLE_COMPONENTS),
    variables: indexVariables(SAMPLE_VARIABLES),
    textStyles: indexTextStyles(SAMPLE_TEXT_STYLES),
  };

  const issues = validate(parsed, indexes);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].kind, "unknown-component");
  assert.equal(issues[0].severity, "warning");
  assert.match(issues[0].message, /MysteryComponent/);
});

test("validate returns empty when everything resolves", () => {
  const parsed = {
    tokens: [{ ref: "spacing/md", line: 1, category: "spacing" }],
    components: [{ name: "Button", line: 2 }],
    textStyles: [{ name: "Body", line: 3 }],
  };
  const indexes = {
    components: indexComponents(SAMPLE_COMPONENTS),
    variables: indexVariables(SAMPLE_VARIABLES),
    textStyles: indexTextStyles(SAMPLE_TEXT_STYLES),
  };

  assert.deepEqual(validate(parsed, indexes), []);
});

test("validate skips checks when a registry index is empty", () => {
  const parsed = {
    tokens: [{ ref: "spacing/anything", line: 1, category: "spacing" }],
    components: [{ name: "Anything", line: 2 }],
    textStyles: [],
  };
  const issues = validate(parsed, {
    components: new Map(),
    variables: new Set(),
    textStyles: new Set(),
  });
  assert.deepEqual(issues, []);
});

test("indexComponents accepts grouped registry shape", () => {
  const index = indexComponents(SAMPLE_COMPONENTS);
  assert.ok(index.has("button"));
  assert.ok(index.has("card"));
  assert.ok(index.has("typography"));
});
