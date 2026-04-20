#!/usr/bin/env npx tsx
/**
 * Convert a markdown briefs file into TypeScript IDEA_BRIEFS format
 * Usage: npx tsx scripts/briefs-to-ts.ts <briefs.md> <output.ts>
 */
import * as fs from "fs";

const [,, inputPath, outputPath] = process.argv;
if (!inputPath) { console.error("Usage: npx tsx scripts/briefs-to-ts.ts <briefs.md> [output.ts]"); process.exit(1); }

const md = fs.readFileSync(inputPath, "utf-8");

// Split into individual briefs by "# " at start of line (not ##)
const briefBlocks = md.split(/\n(?=# [^#])/).filter(b => b.trim().startsWith("# "));

interface Brief {
  id: string;
  name: string;
  ticker: string;
  category: string;
  metrics: { label: string; value: string }[];
  sections: { label: string; items: { title?: string; text: string }[] }[];
  disclaimer: string;
}

function escapeTs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/—/g, "\\u2014")
    .replace(/'/g, "\\u2019")
    .replace(/'/g, "\\u2018")
    .replace(/"/g, "\\u201C")
    .replace(/"/g, "\\u201D")
    .replace(/€/g, "\\u20AC")
    .replace(/→/g, "\\u2192")
    .replace(/·/g, "\\u00b7")
    .replace(/~/g, "~")
    .replace(/¥/g, "\\u00A5")
    .replace(/₄/g, "\\u2084")
    .replace(/₂/g, "\\u2082")
    .replace(/μ/g, "\\u03BC");
}

function toId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s*[·—/]\s*/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const briefs: Brief[] = [];

for (const block of briefBlocks) {
  const lines = block.split("\n");

  // Parse title line: # Name (TICKER · EXCHANGE) — Brief
  const titleLine = lines[0];
  const titleMatch = titleLine.match(/^# (.+?)(?:\s*\(([^)]+)\))?\s*(?:—|\\u2014)\s*Brief/);
  if (!titleMatch) {
    // Try simpler pattern
    const simpleMatch = titleLine.match(/^# (.+?)(?:\s*—|\s*$)/);
    if (!simpleMatch) continue;
  }

  let name = "", ticker = "";
  const m1 = titleLine.match(/^# (.+?)\s*\(([^)]+)\)\s*(?:—|-)/);
  const m2 = titleLine.match(/^# (.+?)\s*(?:—|-)\s*Brief/);
  if (m1) {
    name = m1[1].trim();
    ticker = m1[2].trim();
  } else if (m2) {
    name = m2[1].trim();
  }

  // Find category from the WHERE THE MONEY IS line
  let category = "";

  // Parse metrics from the bold lines near the top
  const metrics: { label: string; value: string }[] = [];
  const metricsLines = lines.filter(l => l.startsWith("**") && (l.includes("Share price") || l.includes("Market cap") || l.includes("FY2") || l.includes("FY25") || l.includes("FY26") || l.includes("Net debt") || l.includes("52-week") || l.includes("Listed") || l.includes("Stage") || l.includes("Current price") || l.includes("Backlog") || l.includes("Germanium") || l.includes("Primary") || l.includes("Entity") || l.includes("Ownership") || l.includes("Status") || l.includes("Key asset") || l.includes("Preform") || l.includes("P/E") || l.includes("Free cash") || l.includes("Transmission") || l.includes("Debt") || l.includes("Key entities") || l.includes("Deployment") || l.includes("Price:") || l.includes("Supply") || l.includes("Substitute") || l.includes("Employees") || l.includes("Headquarters") || l.includes("Parent") || l.includes("Capacity") || l.includes("Proven") || l.includes("Key relation") || l.includes("HCF") || l.includes("Installed")));

  for (const ml of metricsLines) {
    // Parse **Label:** value or **Label:** value · **Label2:** value2
    const parts = ml.split(/\s*(?:\u00b7|·)\s*(?=\*\*)/);
    for (const part of parts) {
      const km = part.match(/\*\*(.+?):\*\*\s*(.+)/);
      if (km) {
        const label = km[1].trim();
        const value = km[2].trim().replace(/\s*\*\*.*/, "");
        // Pick top 5 most important metrics
        metrics.push({ label, value });
      }
    }
  }

  // Limit to 5 metrics
  const topMetrics = metrics.slice(0, 5);

  // Parse sections (## headers)
  const sections: { label: string; items: { title?: string; text: string }[] }[] = [];
  const sectionBlocks = block.split(/\n(?=## )/);

  for (const sb of sectionBlocks) {
    const sbLines = sb.split("\n");
    const headerMatch = sbLines[0].match(/^## (.+)/);
    if (!headerMatch) continue;

    const sectionLabel = headerMatch[1].trim();
    // Skip certain sections
    if (sectionLabel === "---" || !sectionLabel) continue;

    const items: { title?: string; text: string }[] = [];
    const body = sbLines.slice(1).join("\n").trim();

    // Split into paragraphs
    const paragraphs = body.split(/\n\n+/).filter(p => p.trim() && !p.trim().startsWith("---"));

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed || trimmed === "---") continue;
      // Skip disclaimer lines that appear inside sections
      if (trimmed.startsWith("*Stillpoint Intelligence")) continue;
      if (trimmed.startsWith("*Sources:")) continue;

      // Check if paragraph starts with **bold title**
      const boldMatch = trimmed.match(/^\*\*(.+?)\*\*\s*([\s\S]+)/);
      if (boldMatch) {
        const title = boldMatch[1].replace(/[.:]\s*$/, "").trim();
        const text = boldMatch[2].trim();
        if (text) {
          items.push({ title, text });
        } else {
          items.push({ text: trimmed.replace(/\*\*/g, "") });
        }
      } else {
        items.push({ text: trimmed.replace(/\*\*/g, "") });
      }
    }

    if (items.length > 0) {
      sections.push({ label: sectionLabel, items });
    }
  }

  // Extract disclaimer
  let disclaimer = "";
  const disclaimerLines = block.match(/\*Stillpoint Intelligence[^*]*\*\s*\n\*[^*]*Not investment advice\.\*/);
  if (disclaimerLines) {
    disclaimer = disclaimerLines[0].replace(/^\*|\*$/gm, "").replace(/\n/g, " ").trim();
  }

  // Determine ID
  const idMap: Record<string, string> = {
    "Umicore": "umicore",
    "5N Plus": "5n-plus",
    "LightPath Technologies": "lightpath",
    "Blue Moon Metals": "blue-moon",
    "Teck Resources": "teck",
    "Yunnan Chihong Zinc & Germanium": "yunnan-chihong",
    "Yunnan Chihong": "yunnan-chihong",
    "STL / Gécamines — Big Hill": "stl-gecamines",
    "STL / Gécamines": "stl-gecamines",
    "Germanium Metal": "germanium-metal",
    "Corning": "corning",
    "Prysmian": "prysmian",
    "Fujikura": "fujikura",
    "Rosendahl Nextrom": "rosendahl-nextrom",
    "YOFC": "yofc",
    "Hollow-Core Fiber Ecosystem": "hollow-core-fiber",
    "Hollow-core fiber ecosystem": "hollow-core-fiber",
    "Helium": "helium",
  };

  const id = idMap[name] || toId(name);

  // Determine category from existing data or guess
  const catMatch = block.match(/Layer:\s*(.+?)[\n*]/);
  category = catMatch ? catMatch[1].trim() : "";

  briefs.push({
    id,
    name,
    ticker: ticker || "",
    category,
    metrics: topMetrics,
    sections,
    disclaimer,
  });
}

// Generate TypeScript output
const tsLines: string[] = [];
tsLines.push("const IDEA_BRIEFS: Record<string, { name: string; ticker: string; category: string; metrics: { label: string; value: string }[]; sections: { label: string; items: { title?: string; text: string }[] }[]; disclaimer: string }> = {");

for (const b of briefs) {
  tsLines.push(`  "${b.id}": {`);
  tsLines.push(`    name: "${escapeTs(b.name)}",`);
  tsLines.push(`    ticker: "${escapeTs(b.ticker)}",`);
  tsLines.push(`    category: "${escapeTs(b.category)}",`);
  tsLines.push(`    metrics: [`);
  for (const m of b.metrics) {
    tsLines.push(`      { label: "${escapeTs(m.label)}", value: "${escapeTs(m.value)}" },`);
  }
  tsLines.push(`    ],`);
  tsLines.push(`    sections: [`);
  for (const s of b.sections) {
    tsLines.push(`      { label: "${escapeTs(s.label)}", items: [`);
    for (const item of s.items) {
      if (item.title) {
        tsLines.push(`        { title: "${escapeTs(item.title)}", text: "${escapeTs(item.text)}" },`);
      } else {
        tsLines.push(`        { text: "${escapeTs(item.text)}" },`);
      }
    }
    tsLines.push(`      ] },`);
  }
  tsLines.push(`    ],`);
  tsLines.push(`    disclaimer: "${escapeTs(b.disclaimer)}",`);
  tsLines.push(`  },`);
}

tsLines.push("};");

const output = tsLines.join("\n");
if (outputPath) {
  fs.writeFileSync(outputPath, output, "utf-8");
  console.log(`✓ Wrote ${briefs.length} briefs to ${outputPath}`);
} else {
  console.log(output);
}

// Also print brief IDs for reference
console.error(`\nBrief IDs: ${briefs.map(b => b.id).join(", ")}`);
