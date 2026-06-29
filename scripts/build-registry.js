#!/usr/bin/env node
/**
 * Build components.json registry from Figma API tool-result files.
 *
 * Usage:
 *   FIGMA_FILE_KEY=<key> TOOL_RESULTS_DIR=<path> node scripts/build-registry.js
 *
 * Reads all mcp-figma-console-figma_get_library_components-*.txt files
 * from the tool-results directory and builds a grouped registry.
 *
 * Environment variables:
 *   FIGMA_FILE_KEY      Figma library file key to filter by (required)
 *   TOOL_RESULTS_DIR    Directory holding Figma MCP tool-result text files (required)
 *   OUTPUT_PATH         Where to write components.json (defaults to standard registry path)
 */

const fs = require("fs");
const path = require("path");

const FILE_KEY = process.env.FIGMA_FILE_KEY;
const TOOL_RESULTS_DIR = process.env.TOOL_RESULTS_DIR;
const OUTPUT_PATH =
  process.env.OUTPUT_PATH ||
  path.join(
    __dirname,
    "..",
    ".claude",
    "skills",
    "design-workflow",
    "references",
    "knowledge-base",
    "registries",
    "components.json",
  );

if (!FIGMA_FILE_KEY_OR_DIR_MISSING()) {
  process.exit(1);
}

function FIGMA_FILE_KEY_OR_DIR_MISSING() {
  if (!FILE_KEY) {
    console.error("Error: FIGMA_FILE_KEY environment variable is required.");
    return false;
  }
  if (!TOOL_RESULTS_DIR) {
    console.error("Error: TOOL_RESULTS_DIR environment variable is required.");
    return false;
  }
  if (!fs.existsSync(TOOL_RESULTS_DIR)) {
    console.error(`Error: TOOL_RESULTS_DIR does not exist: ${TOOL_RESULTS_DIR}`);
    return false;
  }
  return true;
}

// Collect all components from tool-result files
const allComponents = [];
const files = fs
  .readdirSync(TOOL_RESULTS_DIR)
  .filter((f) => f.startsWith("mcp-figma-console-figma_get_library_components"))
  .sort();

for (const fname of files) {
  try {
    const raw = fs.readFileSync(path.join(TOOL_RESULTS_DIR, fname), "utf8");
    const data = JSON.parse(raw);
    const parsed = JSON.parse(data[0].text);

    if (parsed.libraryFileKey !== FILE_KEY) continue;

    const offset = parsed.pagination?.offset ?? "?";
    const results = parsed.results || [];
    allComponents.push(...results);
    console.log(`  ${fname}: offset=${offset}, count=${results.length}`);
  } catch (e) {
    console.error(`  ERROR ${fname}: ${e.message}`);
  }
}

console.log(`\nTotal from files: ${allComponents.length}`);

// Deduplicate by key
const seen = new Set();
const unique = [];
for (const c of allComponents) {
  if (!seen.has(c.key)) {
    seen.add(c.key);
    unique.push(c);
  }
}
console.log(`Unique by key: ${unique.length}`);

// Group by top-level category (first segment before " / ")
const categories = {};
let totalComponentSets = 0;
let totalStandalone = 0;

for (const c of unique) {
  const parts = c.name.split(" / ");
  const category = parts[0].trim();

  if (!categories[category]) {
    categories[category] = [];
  }

  const entry = {
    name: c.name,
    key: c.key,
    id: c.nodeId,
    type: c.type,
  };

  if (c.type === "COMPONENT_SET") {
    totalComponentSets++;
    entry.variants = c.variantCount || (c.variants ? c.variants.length : 0);

    // Extract properties from variant names
    if (c.variants && c.variants.length > 0) {
      const props = {};
      const firstVariant = c.variants[0].name;
      const pairs = firstVariant.split(", ");
      for (const pair of pairs) {
        const [propName] = pair.split("=");
        if (propName) {
          const values = new Set();
          for (const v of c.variants) {
            const vPairs = v.name.split(", ");
            for (const vp of vPairs) {
              const [vn, vv] = vp.split("=");
              if (vn && vn.trim() === propName.trim() && vv) {
                values.add(vv.trim());
              }
            }
          }
          props[propName.trim()] = `VARIANT(${[...values].join(",")})`;
        }
      }
      if (Object.keys(props).length > 0) {
        entry.properties = props;
      }
    }
  } else {
    totalStandalone++;
    entry.properties = {};
  }

  categories[category].push(entry);
}

// Sort categories alphabetically
const sortedCategories = {};
for (const key of Object.keys(categories).sort()) {
  sortedCategories[key] = categories[key];
}

// Build final registry
const registry = {
  meta: {
    fileKey: FILE_KEY,
    extractedAt: new Date().toISOString().slice(0, 10),
    totalComponents: unique.length,
    totalComponentSets: totalComponentSets,
  },
  components: sortedCategories,
};

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

// Write output
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(registry, null, 2), "utf8");
console.log(`\nRegistry written to: ${OUTPUT_PATH}`);
console.log(`Total components: ${unique.length}`);
console.log(`Total component sets: ${totalComponentSets}`);
console.log(`Total standalone: ${totalStandalone}`);
console.log(`Total categories: ${Object.keys(sortedCategories).length}`);

// Summary of top categories
console.log(`\n--- Top Categories ---`);
const catCounts = Object.entries(sortedCategories)
  .map(([name, items]) => ({ name, count: items.length }))
  .sort((a, b) => b.count - a.count);

for (const { name, count } of catCounts.slice(0, 20)) {
  console.log(`  ${name}: ${count}`);
}
