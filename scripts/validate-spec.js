#!/usr/bin/env node
/**
 * validate-spec.js
 *
 * Validate a design specification (markdown) against the local design system
 * registries. Catches references to tokens, components, and text styles that
 * don't exist in the DS before any design generation happens.
 *
 * Usage:
 *   node scripts/validate-spec.js <path/to/spec.md>
 *
 * Exit codes:
 *   0  spec is valid (no unknown references)
 *   1  spec has unknown references
 *   2  setup error (missing registries, missing spec file)
 *
 * Env vars:
 *   REGISTRIES_DIR  Override path to registries directory (defaults to the
 *                   knowledge-base/registries inside the design-workflow skill)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_REGISTRIES_DIR = path.join(
  ROOT,
  ".claude",
  "skills",
  "design-workflow",
  "references",
  "knowledge-base",
  "registries",
);

const TOKEN_PATTERN = /`([a-z][a-z0-9-]*(?:\/[a-z0-9-]+){1,3})`/g;
const TABLE_ROW = /^\|\s*([^|]+?)\s*\|/;

const COMPONENT_SECTION_HEADERS = [
  /^##+\s*(Reused DS components|Component hierarchy|Components used)/i,
];
const TEXT_STYLE_SECTION_HEADERS = [
  /^##+\s*(Text styles|Typography)/i,
];

// Token categories the validator knows about. Anything else in `category/value`
// shape is ignored to avoid false positives on prose like `path/to/file`.
const KNOWN_TOKEN_CATEGORIES = new Set([
  "color",
  "spacing",
  "radius",
  "font-size",
  "font-weight",
  "line-height",
  "shadow",
  "border",
  "opacity",
  "z-index",
  "duration",
  "easing",
  "breakpoint",
  "height",
  "width",
]);

function loadRegistries(registriesDir) {
  const files = {
    components: path.join(registriesDir, "components.json"),
    variables: path.join(registriesDir, "variables.json"),
    "text-styles": path.join(registriesDir, "text-styles.json"),
  };

  const present = {};
  const missing = [];

  for (const [name, file] of Object.entries(files)) {
    if (fs.existsSync(file)) {
      try {
        present[name] = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (e) {
        throw new Error(`Failed to parse ${file}: ${e.message}`);
      }
    } else {
      missing.push(name);
    }
  }

  return { present, missing };
}

function indexComponents(registry) {
  const index = new Map();
  if (!registry || !registry.components) return index;
  for (const items of Object.values(registry.components)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      if (!item.name) continue;
      const top = item.name.split(" / ")[0].trim();
      index.set(top.toLowerCase(), { name: top });
      index.set(item.name.toLowerCase(), { name: item.name });
    }
  }
  return index;
}

function indexVariables(registry) {
  const index = new Set();
  if (!registry || !registry.variables) return index;
  const variables = Array.isArray(registry.variables)
    ? registry.variables
    : Object.values(registry.variables).flat();
  for (const v of variables) {
    if (typeof v === "string") {
      index.add(v.toLowerCase());
    } else if (v && v.name) {
      index.add(v.name.toLowerCase());
    }
  }
  return index;
}

function indexTextStyles(registry) {
  const index = new Set();
  if (!registry) return index;
  const styles = Array.isArray(registry)
    ? registry
    : registry.textStyles || registry["text-styles"] || [];
  for (const s of styles) {
    if (typeof s === "string") {
      index.add(s.toLowerCase());
    } else if (s && s.name) {
      index.add(s.name.toLowerCase());
    }
  }
  return index;
}

function parseSpec(text) {
  const lines = text.split(/\r?\n/);

  const tokens = [];
  const components = [];
  const textStyles = [];

  let currentSection = null;

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo];

    // Track current section (## or ###)
    if (/^##+\s+/.test(line)) {
      currentSection = line.replace(/^##+\s+/, "").trim();
    }

    // Extract tokens from backticked references
    let match;
    TOKEN_PATTERN.lastIndex = 0;
    while ((match = TOKEN_PATTERN.exec(line)) !== null) {
      const ref = match[1];
      const category = ref.split("/")[0];
      if (KNOWN_TOKEN_CATEGORIES.has(category)) {
        tokens.push({ ref, line: lineNo + 1, category });
      }
    }

    // Extract component names from rows under known sections
    if (currentSection && isComponentSection(currentSection)) {
      const rowMatch = line.match(TABLE_ROW);
      if (rowMatch && !line.startsWith("|---") && !line.startsWith("| Component") && !line.startsWith("| Level")) {
        const name = rowMatch[1].trim();
        // Skip headers like "Component", "—", empty
        if (
          name &&
          name !== "—" &&
          name !== "..." &&
          name.toLowerCase() !== "component" &&
          name.toLowerCase() !== "level" &&
          !name.startsWith("{") &&
          !name.startsWith("Primitive")
        ) {
          components.push({ name, line: lineNo + 1 });
        }
      }
    }

    // Extract text style names under typography sections
    if (currentSection && isTextStyleSection(currentSection)) {
      const rowMatch = line.match(TABLE_ROW);
      if (rowMatch && !line.startsWith("|---")) {
        const name = rowMatch[1].trim();
        if (
          name &&
          name !== "—" &&
          name.toLowerCase() !== "role" &&
          name.toLowerCase() !== "style" &&
          !name.startsWith("{")
        ) {
          textStyles.push({ name, line: lineNo + 1 });
        }
      }
    }
  }

  return { tokens, components, textStyles };
}

function isComponentSection(section) {
  return COMPONENT_SECTION_HEADERS.some((re) => re.test(`## ${section}`));
}

function isTextStyleSection(section) {
  return TEXT_STYLE_SECTION_HEADERS.some((re) => re.test(`## ${section}`));
}

function validate(parsed, indexes) {
  const issues = [];

  for (const { ref, line, category } of parsed.tokens) {
    if (!indexes.variables.has(ref.toLowerCase()) && indexes.variables.size > 0) {
      issues.push({
        severity: "error",
        kind: "unknown-token",
        message: `Unknown ${category} token: \`${ref}\``,
        line,
      });
    }
  }

  for (const { name, line } of parsed.components) {
    if (!indexes.components.has(name.toLowerCase()) && indexes.components.size > 0) {
      issues.push({
        severity: "warning",
        kind: "unknown-component",
        message: `Component not found in DS: "${name}"`,
        line,
      });
    }
  }

  for (const { name, line } of parsed.textStyles) {
    if (!indexes.textStyles.has(name.toLowerCase()) && indexes.textStyles.size > 0) {
      issues.push({
        severity: "warning",
        kind: "unknown-text-style",
        message: `Text style not found in DS: "${name}"`,
        line,
      });
    }
  }

  return issues;
}

function formatReport(specPath, issues, parsed) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const lines = [];
  lines.push(`Spec: ${specPath}`);
  lines.push(
    `Parsed: ${parsed.tokens.length} tokens, ${parsed.components.length} components, ${parsed.textStyles.length} text styles`,
  );
  lines.push("");

  if (issues.length === 0) {
    lines.push("✓ No unknown references against the DS registries.");
    return lines.join("\n");
  }

  for (const issue of issues) {
    const marker = issue.severity === "error" ? "✗" : "!";
    lines.push(`${marker} ${specPath}:${issue.line}  ${issue.message}`);
  }
  lines.push("");
  lines.push(`${errors.length} error(s), ${warnings.length} warning(s)`);
  return lines.join("\n");
}

function main(argv) {
  const specPath = argv[2];
  if (!specPath) {
    console.error("Usage: node scripts/validate-spec.js <path/to/spec.md>");
    process.exit(2);
  }

  if (!fs.existsSync(specPath)) {
    console.error(`Spec file not found: ${specPath}`);
    process.exit(2);
  }

  const registriesDir = process.env.REGISTRIES_DIR || DEFAULT_REGISTRIES_DIR;
  const { present, missing } = loadRegistries(registriesDir);

  if (missing.length === Object.keys(present).length + missing.length) {
    console.error(
      `No registries found at ${registriesDir}.\n` +
        "Run '/design-workflow setup' first to extract your DS into the knowledge base.",
    );
    process.exit(2);
  }

  if (missing.length > 0) {
    console.warn(`Note: skipping checks for missing registries: ${missing.join(", ")}`);
  }

  const indexes = {
    components: indexComponents(present.components),
    variables: indexVariables(present.variables),
    textStyles: indexTextStyles(present["text-styles"]),
  };

  const specText = fs.readFileSync(specPath, "utf8");
  const parsed = parseSpec(specText);
  const issues = validate(parsed, indexes);

  console.log(formatReport(specPath, issues, parsed));

  const hasErrors = issues.some((i) => i.severity === "error");
  process.exit(hasErrors ? 1 : 0);
}

module.exports = {
  parseSpec,
  validate,
  indexComponents,
  indexVariables,
  indexTextStyles,
  formatReport,
  loadRegistries,
  KNOWN_TOKEN_CATEGORIES,
};

if (require.main === module) {
  main(process.argv);
}
