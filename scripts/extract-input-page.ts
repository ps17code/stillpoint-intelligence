#!/usr/bin/env npx tsx
/**
 * Extract all data and analysis from a Stillpoint Intelligence input page
 * into a structured markdown file.
 *
 * Usage:
 *   npx tsx scripts/extract-input-page.ts germanium
 *   npx tsx scripts/extract-input-page.ts fiber-optic-cable
 */

import * as fs from "fs";
import * as path from "path";

const inputName = process.argv[2];
if (!inputName) {
  console.error("Usage: npx tsx scripts/extract-input-page.ts <input-name>");
  console.error("  e.g. npx tsx scripts/extract-input-page.ts germanium");
  process.exit(1);
}

const srcPath = path.resolve(__dirname, `../app/input/${inputName}/page.tsx`);
if (!fs.existsSync(srcPath)) {
  console.error(`File not found: ${srcPath}`);
  process.exit(1);
}

const src = fs.readFileSync(srcPath, "utf-8");

// ─── helpers ────────────────────────────────────────────────────────────

/** Decode common JSX/HTML entities and unicode escapes in source strings */
function decode(s: string | undefined): string {
  if (!s) return "";
  return s
    .replace(/&rarr;/g, "→")
    .replace(/&mdash;/g, "—")
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8324;/g, "₄")
    .replace(/&#8322;/g, "₂")
    .replace(/\\u2014/g, "—")
    .replace(/\\u2019/g, "'")
    .replace(/\\u201C/g, "\u201C")
    .replace(/\\u201D/g, "\u201D")
    .replace(/\\u00b7/g, "·")
    .replace(/\\u2084/g, "₄")
    .replace(/\\u2192/g, "→")
    .replace(/\\u00e9/g, "é")
    .replace(/\\u03BCm/g, "μm")
    .replace(/\\u203A/g, "›")
    .replace(/\{"\\'"\}/g, "'")
    .replace(/\{"'"\}/g, "'")
    .replace(/\{`([^`]*)`\}/g, "$1")
    .replace(/<span[^>]*>([^<]*)<\/span>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/** Extract all string literals from an array pattern like ["foo", "bar"] */
function extractStringArray(text: string): string[] {
  const results: string[] = [];
  // Match quoted strings (both single and double)
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    results.push(decode(m[1] ?? m[2]));
  }
  return results;
}

/** Extract objects from an array literal in source code */
function extractObjectArray(text: string): Record<string, string>[] {
  const results: Record<string, string>[] = [];
  // Find each { ... } block
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        const block = text.slice(start + 1, i);
        const obj: Record<string, string> = {};
        // Parse key: "value" or key: 'value' pairs
        const kvRe = /(\w+)\s*:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`]*)`|([^,}\s]+))/g;
        let kv: RegExpExecArray | null;
        while ((kv = kvRe.exec(block)) !== null) {
          const key = kv[1];
          const val = kv[2] ?? kv[3] ?? kv[4] ?? kv[5] ?? "";
          obj[key] = decode(val);
        }
        if (Object.keys(obj).length > 0) results.push(obj);
        start = -1;
      }
    }
  }
  return results;
}

/** Find a section of source between two patterns */
function between(src: string, startPat: RegExp, endPat: RegExp): string {
  const sm = startPat.exec(src);
  if (!sm) return "";
  const rest = src.slice(sm.index + sm[0].length);
  const em = endPat.exec(rest);
  return em ? rest.slice(0, em.index) : rest;
}

/** Extract balanced [...] starting from a position in source */
function extractBalancedBrackets(text: string, openChar = "[", closeChar = "]"): string {
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === openChar) {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === closeChar) {
      depth--;
      if (depth === 0 && start >= 0) {
        return text.slice(start, i + 1);
      }
    }
  }
  return "";
}

/** Find pattern and extract the balanced array that follows */
function findArray(src: string, pattern: RegExp): string {
  const m = pattern.exec(src);
  if (!m) return "";
  const rest = src.slice(m.index);
  // Find the first [
  const bracketIdx = rest.indexOf("[");
  if (bracketIdx < 0) return "";
  return extractBalancedBrackets(rest.slice(bracketIdx));
}

// ─── extract sections ───────────────────────────────────────────────────

const lines: string[] = [];
const title = inputName
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

lines.push(`# ${title} — Full Data Extract`);
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push(`Source: Stillpoint Intelligence input page (/app/input/${inputName}/page.tsx)`);
lines.push("");
lines.push("---");
lines.push("");

// ─── EXECUTIVE SUMMARY ─────────────────────────────────────────────────

lines.push("## EXECUTIVE SUMMARY");
lines.push("");

// Find the exec summary array - it's an array of strings mapped with .map
const execSumSection = between(src, /EXECUTIVE SUMMARY/, /HOW IT/);
// Extract string array from the .map(
const execArrayMatch = execSumSection.match(/\[\s*\n\s*"([\s\S]*?)\]\s*\.map/);
if (execArrayMatch) {
  const arrText = "[" + execArrayMatch[0].slice(0, -4) ; // remove .map
  const points = extractStringArray(arrText);
  points.forEach((p) => {
    lines.push(`- ${decode(p)}`);
  });
} else {
  // Try alternate pattern - individual string literals in array
  const arrStart = execSumSection.indexOf("[");
  if (arrStart >= 0) {
    const arrBlock = extractBalancedBrackets(execSumSection.slice(arrStart));
    const points = extractStringArray(arrBlock);
    points.forEach((p) => {
      if (p.length > 20) lines.push(`- ${decode(p)}`);
    });
  }
}

lines.push("");
lines.push("---");
lines.push("");

// ─── HOW IT'S MADE ─────────────────────────────────────────────────────

lines.push("## HOW IT'S MADE");
lines.push("");

const howSection = between(src, /HOW IT/, /SUPPLY TREE|supply-tree/);

// Extract cards by finding the pattern: 0N · TITLE
const cardPattern = /(\d{2})\s*(?:&middot;|·|\\u00b7)\s*([A-Z][A-Z\s&;']+)/g;
let cardMatch: RegExpExecArray | null;
const cardPositions: { num: string; title: string; pos: number }[] = [];
while ((cardMatch = cardPattern.exec(howSection)) !== null) {
  cardPositions.push({
    num: cardMatch[1],
    title: decode(cardMatch[2].trim()),
    pos: cardMatch.index,
  });
}

for (let ci = 0; ci < cardPositions.length; ci++) {
  const card = cardPositions[ci];
  const cardEnd = ci + 1 < cardPositions.length ? cardPositions[ci + 1].pos : howSection.length;
  const cardText = howSection.slice(card.pos, cardEnd);

  lines.push(`### Step ${card.num}: ${card.title}`);

  // Extract description (first prose paragraph after title)
  const descMatch = cardText.match(
    /fontSize:\s*"?11\.5(?:px)?"?[^>]*>\s*\n?\s*([\s\S]*?)\s*<\/p>/
  );
  if (descMatch) {
    lines.push(`- **Description:** ${decode(descMatch[1])}`);
  }

  // Extract WHY IT'S HARD
  const whyMatch = cardText.match(
    /WHY IT(?:'|&apos;|\\u2019)S HARD[\s\S]*?fontSize:\s*"?10\.5(?:px)?"?[^>]*>\s*\n?\s*([\s\S]*?)\s*<\/p>/
  );
  if (whyMatch) {
    lines.push(`- **Why it's hard:** ${decode(whyMatch[1])}`);
  }

  // Extract WHO CAN DO IT
  const whoMatch = cardText.match(
    /WHO CAN DO IT[\s\S]*?fontSize:\s*"?10\.5(?:px)?"?[^>]*>\s*\n?\s*([\s\S]*?)\s*<\/p>/
  );
  if (whoMatch) {
    lines.push(`- **Who can do it:** ${decode(whoMatch[1])}`);
  }

  // Extract output stat
  const statMatch = cardText.match(
    /fontSize:\s*"?12px"?[^>]*fontWeight:\s*500[^>]*>\s*([\s\S]*?)<\/span>\s*\n?\s*<span[^>]*>\s*([\s\S]*?)<\/span>/
  );
  if (statMatch) {
    lines.push(`- **Output:** ${decode(statMatch[1])} ${decode(statMatch[2])}`);
  }

  lines.push("");
}

lines.push("---");
lines.push("");

// ─── SUPPLY TREE ────────────────────────────────────────────────────────

lines.push("## SUPPLY TREE");
lines.push("");

// Key takeaway
const takeawaySection = between(src, /KEY TAKEAWAY/, /Expand|TreeMap|<\/div>\s*<\/div>/);
const takeawayMatch = takeawaySection.match(
  /fontSize:\s*13[^>]*>\s*\n?\s*([\s\S]*?)\s*<\/p>/
);
if (takeawayMatch) {
  lines.push("### Key Takeaway");
  lines.push(decode(takeawayMatch[1]));
  lines.push("");
}

// Extract node data from nodes.json
const nodesPath = path.resolve(__dirname, "../data/nodes.json");
if (fs.existsSync(nodesPath)) {
  const nodesData = JSON.parse(fs.readFileSync(nodesPath, "utf-8"));

  // Determine which chain data is used
  const chainsPath = path.resolve(__dirname, "../data/chains.json");
  const chainsData = JSON.parse(fs.readFileSync(chainsPath, "utf-8"));

  // Determine relevant chain keys from the source file
  let chainKeys: string[] = [];
  if (src.includes("RAW_DATA")) {
    // Germanium page uses RAW chain
    const rawMatch = src.match(/RAW_DATA\["([^"]+)"\]/);
    if (rawMatch) chainKeys.push(rawMatch[1]);
  }
  if (src.includes("COMP_DATA")) {
    const compMatch = src.match(/COMP_DATA\["([^"]+)"\]/);
    if (compMatch) chainKeys.push(compMatch[1]);
  }
  if (src.includes("SUB_DATA")) {
    const subMatch = src.match(/SUB_DATA\["([^"]+)"\]/);
    if (subMatch) chainKeys.push(subMatch[1]);
  }

  // Collect all node names from the relevant chains
  const nodeNames = new Set<string>();
  for (const key of chainKeys) {
    const chainSets = [
      chainsData.RAW_DATA?.[key],
      chainsData.COMP_DATA?.[key],
      chainsData.SUB_DATA?.[key],
      chainsData.EU_DATA?.[key],
    ];
    for (const chain of chainSets) {
      if (!chain) continue;
      for (const val of Object.values(chain)) {
        if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
          (val as string[]).forEach((n: string) => nodeNames.add(n));
        } else if (typeof val === "string") {
          nodeNames.add(val);
        }
      }
    }
  }

  if (nodeNames.size > 0) {
    lines.push("### Nodes");
    lines.push("");
    for (const name of nodeNames) {
      const node = nodesData[name];
      if (!node) continue;
      lines.push(`#### ${name}`);
      lines.push(`- **Type:** ${node.type ?? "—"}`);
      lines.push(`- **Location:** ${node.loc ?? "—"}`);
      lines.push(`- **Key stat:** ${node.stat ?? "—"}`);
      lines.push(`- **Risk:** ${node.risk ?? "—"}`);
      if (node.stats?.length) {
        lines.push(`- **Stats:**`);
        for (const [label, value] of node.stats) {
          lines.push(`  - ${label}: ${value}`);
        }
      }
      if (node.role) lines.push(`- **Role:** ${node.role}`);
      if (node.inv) lines.push(`- **Investment angle:** ${node.inv}`);
      if (node.risks?.length) {
        lines.push(`- **Risks:**`);
        node.risks.forEach((r: string) => lines.push(`  - ${r}`));
      }
      lines.push("");
    }
  }
}

lines.push("---");
lines.push("");

// ─── DEPENDENCIES ───────────────────────────────────────────────────────

lines.push("## DEPENDENCIES");
lines.push("");

// Upstream table
const upstreamSection = between(src, /UPSTREAM/, /DOWNSTREAM|<\/div>\s*\{\/\*/);
if (upstreamSection) {
  lines.push("### Upstream");
  lines.push("");

  // Extract header columns
  const headerArrayMatch = upstreamSection.match(/\[\{[^}]*l:\s*"[^"]*"[^}]*w:\s*"[^"]*"[\s\S]*?\]\.map/);
  if (headerArrayMatch) {
    const headers = extractObjectArray(headerArrayMatch[0]);
    const headerLabels = headers.map((h) => h.l || "");
    lines.push("| " + headerLabels.join(" | ") + " |");
    lines.push("| " + headerLabels.map(() => "---").join(" | ") + " |");
  }

  // Extract data rows
  const rowArrayStart = upstreamSection.indexOf("].map((row");
  if (rowArrayStart > 0) {
    // Find the array before .map
    let searchArea = upstreamSection.slice(0, rowArrayStart + 1);
    // Find the last [ that starts this array
    const lastBracket = searchArea.lastIndexOf("[");
    if (lastBracket >= 0) {
      const arrText = searchArea.slice(lastBracket);
      const rows = extractObjectArray(arrText);
      for (const row of rows) {
        const vals = Object.values(row).filter(
          (v) => v !== "true" && v !== "false" && !v.startsWith("#")
        );
        lines.push("| " + vals.join(" | ") + " |");
      }
    }
  }

  // Extract summary rows (Production cost, Market price)
  const summaryMatches = upstreamSection.matchAll(/fontWeight:\s*500[^>]*>\s*(~?\$[\d.,–\-]+[^<]*)/g);
  const summaryValues: string[] = [];
  for (const sm of summaryMatches) {
    summaryValues.push(decode(sm[1]));
  }
  if (summaryValues.length > 0) {
    lines.push("");
    // Try to find labeled summary rows
    const prodCostMatch = upstreamSection.match(/Production cost[^<]*/);
    const marketPriceMatch = upstreamSection.match(/Market price[^<]*/);
    if (prodCostMatch) lines.push(`**${decode(prodCostMatch[0])}**`);
    if (marketPriceMatch) lines.push(`**${decode(marketPriceMatch[0])}**`);
  }

  // Extract insight/takeaway
  const insightMatch = upstreamSection.match(
    /borderTop[\s\S]*?fontSize:\s*11[^>]*>\s*([\s\S]*?)\s*<\/p>/
  );
  if (insightMatch) {
    lines.push("");
    lines.push(`**Takeaway:** ${decode(insightMatch[1])}`);
  }

  lines.push("");
}

// Downstream table
const downstreamSection = between(src, /DOWNSTREAM/, /SUPPLY.*DEMAND|supply-demand/);
if (downstreamSection) {
  lines.push("### Downstream");
  lines.push("");

  const headerArrayMatch = downstreamSection.match(
    /\[\{[^}]*l:\s*"[^"]*"[^}]*w:\s*"[^"]*"[\s\S]*?\]\.map/
  );
  if (headerArrayMatch) {
    const headers = extractObjectArray(headerArrayMatch[0]);
    const headerLabels = headers.map((h) => h.l || "");
    lines.push("| " + headerLabels.join(" | ") + " |");
    lines.push("| " + headerLabels.map(() => "---").join(" | ") + " |");
  }

  const rowArrayStart = downstreamSection.indexOf("].map((row");
  if (rowArrayStart > 0) {
    let searchArea = downstreamSection.slice(0, rowArrayStart + 1);
    const lastBracket = searchArea.lastIndexOf("[");
    if (lastBracket >= 0) {
      const arrText = searchArea.slice(lastBracket);
      const rows = extractObjectArray(arrText);
      for (const row of rows) {
        const vals = Object.values(row).filter(
          (v) => v !== "true" && v !== "false" && !v.startsWith("#")
        );
        lines.push("| " + vals.join(" | ") + " |");
      }
    }
  }

  // Total row
  const totalMatch = downstreamSection.match(/Total[\s\S]*?<\/div>/);
  if (totalMatch) {
    const totalVals: string[] = ["Total"];
    const valMatches = totalMatch[0].matchAll(/fontWeight:\s*500[^>]*>\s*([^<]+)/g);
    for (const vm of valMatches) {
      const v = decode(vm[1]);
      if (v !== "Total") totalVals.push(v);
    }
    if (totalVals.length > 1) lines.push("| " + totalVals.join(" | ") + " |");
  }

  // Insight
  const insightMatch = downstreamSection.match(
    /(?:borderTop|paddingTop)[\s\S]*?fontSize:\s*1[12][^>]*>\s*([\s\S]*?)\s*<\/p>/
  );
  if (insightMatch) {
    lines.push("");
    lines.push(`**Takeaway:** ${decode(insightMatch[1])}`);
  }

  lines.push("");
}

lines.push("---");
lines.push("");

// ─── SUPPLY → DEMAND ───────────────────────────────────────────────────

lines.push("## SUPPLY → DEMAND");
lines.push("");

const sdSection = between(src, /SUPPLY\s*(?:&rarr;|→|->)\s*DEMAND|id="supply-demand"/, /SO WHAT|so-what/);

// Extract the three cards: Supply, Demand, Gap
const cardLabels = ["SUPPLY", "DEMAND", "GAP"];
for (const label of cardLabels) {
  const labelPattern = new RegExp(`>${label}<`);
  const labelMatch = labelPattern.exec(sdSection);
  if (!labelMatch) continue;

  const cardArea = sdSection.slice(labelMatch.index, labelMatch.index + 800);

  // Extract headline value
  const valueMatch = cardArea.match(/fontSize:\s*"?22px"?[^>]*>\s*([\s\S]*?)\s*<\/p>/);
  // Extract description
  const descMatch = cardArea.match(/fontSize:\s*"?11\.5px"?[^>]*>\s*\n?\s*([\s\S]*?)\s*<\/p>/);

  lines.push(`### ${label}`);
  if (valueMatch) lines.push(`- **Value:** ${decode(valueMatch[1])}`);
  if (descMatch) lines.push(`- **Analysis:** ${decode(descMatch[1])}`);
  lines.push("");
}

lines.push("---");
lines.push("");

// ─── SO WHAT ────────────────────────────────────────────────────────────

lines.push("## SO WHAT");
lines.push("");

// Parse the soWhatBlocks array — find the full array definition
const soWhatMatch = src.match(/soWhatBlocks[^=]*=\s*\[/);
let soWhatSection = "";
if (soWhatMatch) {
  const startIdx = src.indexOf(soWhatMatch[0]) + soWhatMatch[0].length - 1;
  soWhatSection = extractBalancedBrackets(src.slice(startIdx));
}
if (soWhatSection) {
  {
    const fullArr = soWhatSection;

    // Split into individual blocks by finding { id: "..." patterns
    const blockPattern = /\{\s*id:\s*"(\w+)",\s*label:\s*"((?:[^"\\]|\\.)*)",\s*question:\s*"((?:[^"\\]|\\.)*)",\s*teaser:\s*"((?:[^"\\]|\\.)*)",\s*analysis:\s*\[/g;
    let blockMatch: RegExpExecArray | null;
    const blocks: { id: string; label: string; question: string; teaser: string; pos: number }[] = [];

    while ((blockMatch = blockPattern.exec(fullArr)) !== null) {
      blocks.push({
        id: blockMatch[1],
        label: decode(blockMatch[2]),
        question: decode(blockMatch[3]),
        teaser: decode(blockMatch[4]),
        pos: blockMatch.index + blockMatch[0].length,
      });
    }

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];
      lines.push(`### ${block.label} — ${block.question}`);
      lines.push(`**Teaser:** ${block.teaser}`);
      lines.push("");
      lines.push("**Analysis:**");
      lines.push("");

      // Find analysis array for this block
      const analysisStart = block.pos;
      const analysisEnd = bi + 1 < blocks.length ? blocks[bi + 1].pos - 200 : fullArr.length;
      const analysisText = fullArr.slice(analysisStart, analysisEnd);

      // Extract analysis items
      const itemPattern =
        /\{\s*type:\s*"(\w+)"[^}]*?(?:text:\s*"((?:[^"\\]|\\.)*)"|name:\s*"((?:[^"\\]|\\.)*)"[^}]*?desc:\s*"((?:[^"\\]|\\.)*)")/g;
      let itemMatch: RegExpExecArray | null;
      while ((itemMatch = itemPattern.exec(analysisText)) !== null) {
        const type = itemMatch[1];
        const text = decode(itemMatch[2] ?? "");
        const name = decode(itemMatch[3] ?? "");
        const desc = decode(itemMatch[4] ?? "");

        switch (type) {
          case "prose":
            lines.push(text);
            lines.push("");
            break;
          case "subhead":
            lines.push(`**${text}**`);
            lines.push("");
            break;
          case "callout":
            lines.push(`> ${text}`);
            lines.push("");
            break;
          case "quote":
            lines.push(`> "${text}"`);
            lines.push("");
            break;
          case "item":
            lines.push(`**${name}**`);
            lines.push(desc);
            lines.push("");
            break;
        }
      }
    }
  }
}

lines.push("---");
lines.push("");

// ─── RISK ───────────────────────────────────────────────────────────────

lines.push("## RISK");
lines.push("");

const riskSection = between(src, />RISK</, /Idea brief modal|{\/\*.*modal/);

// Split risk into two halves
const easeSplit = riskSection.split(/WHAT COULD SOFTEN DEMAND/);
const easeText = easeSplit[0] || "";
const softenText = easeSplit[1] || "";

lines.push("### What could ease supply");
lines.push("");
const easeItems = extractObjectArray(
  findArray(easeText, /WHAT COULD EASE SUPPLY[\s\S]*?\[/) || easeText
);
for (const item of easeItems) {
  if (item.risk && item.assessment) {
    lines.push(`**${decode(item.risk)}**`);
    lines.push(decode(item.assessment));
    lines.push("");
  }
}

lines.push("### What could soften demand");
lines.push("");
const softenItems = extractObjectArray(softenText);
for (const item of softenItems) {
  if (item.risk && item.assessment) {
    lines.push(`**${decode(item.risk)}**`);
    lines.push(decode(item.assessment));
    lines.push("");
  }
}

// Bottom line
const bottomLineMatch = riskSection.match(
  /borderTop[\s\S]*?fontSize:\s*12[^>]*>\s*([\s\S]*?)\s*<\/p>/
);
if (bottomLineMatch) {
  lines.push(`**Bottom line:** ${decode(bottomLineMatch[1])}`);
  lines.push("");
}

lines.push("---");
lines.push("");

// ─── WHERE THE MONEY IS ────────────────────────────────────────────────

lines.push("## WHERE THE MONEY IS");
lines.push("");

// Extract the ideas array
const moneySection = between(src, /WHERE THE MONEY IS/, />RISK<|id="risk"/);
const ideasArrayMatch = moneySection.match(/\[\s*\n?\s*\{[^}]*(?:id|name):\s*"/);
if (ideasArrayMatch) {
  const ideasStart = moneySection.indexOf(ideasArrayMatch[0]);
  const ideasArr = extractBalancedBrackets(moneySection.slice(ideasStart));

  // Parse each idea — handle both with and without id field
  const ideaPatternWithId =
    /\{\s*id:\s*"([^"]*)",\s*name:\s*"([^"]*)",\s*ticker:\s*"((?:[^"\\]|\\.)*)",\s*category:\s*"([^"]*)",\s*line1:\s*"((?:[^"\\]|\\.)*)",\s*line2:\s*"((?:[^"\\]|\\.)*)"/g;
  const ideaPatternNoId =
    /\{\s*name:\s*"([^"]*)",\s*ticker:\s*"((?:[^"\\]|\\.)*)",\s*category:\s*"([^"]*)",\s*line1:\s*"((?:[^"\\]|\\.)*)",\s*line2:\s*"((?:[^"\\]|\\.)*)"/g;

  const hasId = /id:\s*"/.test(ideasArr);
  const ideaPattern = hasId ? ideaPatternWithId : ideaPatternNoId;
  let ideaMatch: RegExpExecArray | null;
  const ideaIds: string[] = [];

  while ((ideaMatch = ideaPattern.exec(ideasArr)) !== null) {
    let id: string, name: string, ticker: string, category: string, line1: string, line2: string;
    if (hasId) {
      id = ideaMatch[1]; name = decode(ideaMatch[2]); ticker = decode(ideaMatch[3]);
      category = decode(ideaMatch[4]); line1 = decode(ideaMatch[5]); line2 = decode(ideaMatch[6]);
    } else {
      id = ""; name = decode(ideaMatch[1]); ticker = decode(ideaMatch[2]);
      category = decode(ideaMatch[3]); line1 = decode(ideaMatch[4]); line2 = decode(ideaMatch[5]);
    }
    ideaIds.push(id);

    lines.push(`### ${name} · ${ticker} · ${category}`);
    lines.push(`**Hook:** ${line1}`);
    lines.push(`**Detail:** ${line2}`);
    lines.push("");
  }

  // Extract IDEA_BRIEFS if present
  const briefsMatch = src.match(/const IDEA_BRIEFS/);
  if (briefsMatch) {
    const briefsSection = between(src, /const IDEA_BRIEFS/, /^(?:export|const\s+(?!IDEA))/m);

    for (const id of ideaIds) {
      // Find this brief's section
      const briefPattern = new RegExp(`"${id}":\\s*\\{`);
      const briefMatch = briefPattern.exec(briefsSection);
      if (!briefMatch) continue;

      // Extract the brief object
      const briefStart = briefMatch.index + briefMatch[0].length;
      let depth = 1;
      let briefEnd = briefStart;
      for (let i = briefStart; i < briefsSection.length && depth > 0; i++) {
        if (briefsSection[i] === "{") depth++;
        if (briefsSection[i] === "}") depth--;
        briefEnd = i;
      }
      const briefText = briefsSection.slice(briefStart, briefEnd);

      // Extract name
      const nameMatch = briefText.match(/name:\s*"([^"]*)"/);
      const tickerMatch = briefText.match(/ticker:\s*"((?:[^"\\]|\\.)*)"/);

      // Extract metrics
      const metricsArr = findArray(briefText, /metrics:\s*\[/);
      if (metricsArr) {
        const metrics = extractObjectArray(metricsArr);
        if (metrics.length > 0) {
          const briefName = nameMatch ? decode(nameMatch[1]) : id;
          lines.push(`#### ${briefName} — Full Brief`);
          if (tickerMatch) lines.push(`*${decode(tickerMatch[1])}*`);
          lines.push("");
          lines.push("**Metrics:**");
          for (const m of metrics) {
            if (m.label && m.value) {
              lines.push(`- ${decode(m.label)}: ${decode(m.value)}`);
            }
          }
          lines.push("");
        }
      }

      // Extract sections
      const sectionsStart = briefText.indexOf("sections:");
      if (sectionsStart >= 0) {
        const sectionsArr = extractBalancedBrackets(briefText.slice(sectionsStart));
        // Find each section label
        const sectionPattern = /label:\s*"([^"]*)"/g;
        let secMatch: RegExpExecArray | null;
        const sectionLabels: { label: string; pos: number }[] = [];
        while ((secMatch = sectionPattern.exec(sectionsArr)) !== null) {
          sectionLabels.push({ label: decode(secMatch[1]), pos: secMatch.index });
        }

        for (let si = 0; si < sectionLabels.length; si++) {
          const sec = sectionLabels[si];
          const secEnd =
            si + 1 < sectionLabels.length ? sectionLabels[si + 1].pos : sectionsArr.length;
          const secText = sectionsArr.slice(sec.pos, secEnd);

          lines.push(`**${sec.label}:**`);

          // Extract items within this section
          const itemsArr = findArray(secText, /items:\s*\[/);
          if (itemsArr) {
            const items = extractObjectArray(itemsArr);
            for (const item of items) {
              if (item.title) {
                lines.push(`- **${decode(item.title)}:** ${decode(item.text ?? "")}`);
              } else if (item.text) {
                lines.push(`- ${decode(item.text)}`);
              }
            }
          }
          lines.push("");
        }
      }

      // Extract disclaimer
      const disclaimerMatch = briefText.match(/disclaimer:\s*"((?:[^"\\]|\\.)*)"/);
      if (disclaimerMatch) {
        lines.push(`*Disclaimer: ${decode(disclaimerMatch[1])}*`);
        lines.push("");
      }
    }
  }
}

lines.push("---");
lines.push("");

// ─── CONNECTED INPUTS ──────────────────────────────────────────────────

lines.push("## CONNECTED INPUTS");
lines.push("");

// Upstream connections
const upstreamConnMatch = src.match(/(?:Upstream|upstream)[\s\S]*?\[\s*\{[^}]*name:\s*"[^"]*"[^}]*(?:linked|href)/);
if (upstreamConnMatch) {
  const connStart = src.indexOf(upstreamConnMatch[0]);
  const connArr = extractBalancedBrackets(src.slice(connStart + upstreamConnMatch[0].indexOf("[")));
  const items = extractObjectArray(connArr);
  if (items.length > 0) {
    lines.push("### Upstream");
    for (const item of items) {
      const linked = item.linked === "true";
      lines.push(`- ${decode(item.name)}${linked ? " (linked)" : ""}`);
    }
    lines.push("");
  }
}

// Downstream connections
const downstreamConnMatch = src.match(
  /(?:Downstream|downstream)[\s\S]{0,200}?\[\s*\{[^}]*name:\s*"[^"]*"/
);
if (downstreamConnMatch) {
  const connStart = src.indexOf(downstreamConnMatch[0]);
  const arrIdx = downstreamConnMatch[0].indexOf("[");
  const connArr = extractBalancedBrackets(
    src.slice(connStart + arrIdx)
  );
  const items = extractObjectArray(connArr);
  if (items.length > 0) {
    lines.push("### Downstream");
    for (const item of items) {
      const linked = item.linked === "true";
      lines.push(`- ${decode(item.name)}${linked ? " (linked)" : ""}`);
    }
    lines.push("");
  }
}

lines.push("---");
lines.push("");

// ─── META ───────────────────────────────────────────────────────────────

lines.push("## META");
lines.push(`- **Generated:** ${new Date().toISOString()}`);
lines.push(`- **Source file:** /app/input/${inputName}/page.tsx`);
lines.push(`- **Extract script:** /scripts/extract-input-page.ts`);
lines.push("");

// ─── write output ───────────────────────────────────────────────────────

const outDir = path.resolve(__dirname, "../exports");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${inputName}-full-extract.md`);
fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
console.log(`✓ Extracted to ${outPath}`);
