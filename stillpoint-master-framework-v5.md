# Stillpoint Intelligence
# Master Framework for Building Input Pages
# v5 — April 2026

**Status:** Authoritative. Supersedes v4, v3.1, v3, v2.1.
**Scope:** All supply chain input pages across all verticals on the Stillpoint Intelligence platform.
**Audience:** Research agents, writing agents, QA agents, human editors, platform engineers.

---

## Part 0: Navigation guide

This framework is long because it is comprehensive. It is not meant to be read front to back. Find the section relevant to your role and jump there.

- **If you are producing research on a new input**, start with Part 4 (Pipeline workflow) § Research agent role, then Part 1 (Core concepts) for the data model you're researching against.
- **If you are writing a chain page from a research dossier**, start with Part 4 § Writing agent role, then Part 2 (Page-level framework) for section-by-section requirements. Consult Part 3 (Node schema) when writing Supply Tree and Where The Money Is content.
- **If you are running QA**, start with Part 5 (QA protocol). Reference Parts 2 and 3 for what you're checking against.
- **If you are integrating content into the platform**, start with Part 3 (Node schema) in detail. Part 4 § Platform integration covers handoff artifacts.
- **If you are retrofitting an existing page** (germanium, fiber, or v4 gallium) to v5, start with Part 6 (Retrofit guidance).
- **If you are human and trying to understand a specific decision**, Appendix B (Change log) explains what moved and why across v3.1 → v4 → v5.
- **If you want to see the framework applied end-to-end**, Appendix A (Worked example: gallium) walks through one complete page.

---

## Part 1: Core concepts

### 1.1 Three artifact types

v4 introduces a separation of concerns that v3.1 lacked. Pages are no longer self-contained documents. Instead, the platform composes three kinds of records:

**Universal node records.** One record per entity in the world — each company, project, deposit, or aggregate. Written once, shared across every chain where the entity appears. Contains universal facts (what the entity does, its ticker, its location, its canonical output) plus an optional Where The Money Is brief if the entity is investable.

**Per-chain placement records.** One record per `(chain, node)` pair. Captures what's specific about this node *on this chain*: why it's relevant here, what it feeds from and into *in this chain's tree*, whether it surfaces in this chain's Where The Money Is section, what category tag applies on this chain.

**Chain page records.** The page itself — Executive Summary, How It's Made, Dependencies, Supply → Demand, So What, Risk, Catalysts, Connected Inputs, Sources, Meta. These sections are page-scoped and do not move between chains.

### 1.2 Why the separation matters

Under v3.1, every chain page restated the same node information in prose. If Umicore appeared on both the germanium and fiber pages, the Umicore content was written twice. If facts about Umicore changed (a new quarterly earnings report, a revised production target), both pages had to be updated independently.

Under v4, Umicore has one universal node record. The germanium page's Umicore placement describes why Umicore matters on the germanium chain specifically. The fiber page's Umicore placement describes the fiber-specific relevance. Universal facts change in one place. Cross-chain discovery ("this node also appears on fiber") is automatically computed by the platform.

### 1.3 Layer taxonomy

Every node sits on exactly one canonical layer. Layers render vertically in the supply tree visualization, top to bottom. v5 organizes layers into **tiers** that represent universal stages of a supply chain — Source → Extraction → Primary Processing → Refining → Intermediate → Device → Assembly. Any given chain uses a **subset** of these layers, never all of them. The tier structure is universal; the instantiation per chain is material-specific.

**Tier 1 — Source** (where the material physically exists before any human extraction)

Two sub-types depending on whether the material concentrates geologically:

- **Deposit** — concentrated geological resource in specific ore bodies with reserves, grade, and recovery stats. Use for materials that concentrate (germanium in coal seams at Lincang; tellurium in copper porphyry; lithium in specific brine aquifers; rare earths in specific mineralizations). The node represents a named ore body.

- **Byproduct Source** — geographic regions producing a host material that contains the target as a trace impurity. Use for byproduct materials whose content is uniform across host-material flows globally (gallium at ~50 ppm across essentially all bauxite; helium ~0.3% in specific natural gas fields; indium ~50-100 ppm in zinc concentrate). The node represents a feedstock flow (e.g., "Guinea Bauxite, ~97M t/yr"), and the target-material content is expressed as an implied tonnage rather than a reserve-and-grade.

*Decision rule:* use **Deposit** when specific ore bodies have elevated concentration worth naming individually. Use **Byproduct Source** when the target is uniform across the host material and individual source distinctions don't affect target-material economics.

**Tier 2 — Extraction** (the physical operation that moves material out of the ground)

- **Mine** — direct extraction site for materials mined as a primary product. The operator's primary commercial output is the target material.

- **Host Operation** — for byproduct materials, the extraction operation whose primary output is the host material (coal mine extracting coal with germanium as an incidental stream; bauxite mine feeding alumina refinery; natural gas well producing helium incidentally). The target material flows through as a byproduct that the operator may or may not recover.

**Tier 3 — Primary Processing** (the first industrial step that isolates or concentrates the target material)

- **Primary Producer** — for primary materials, this often coincides with Mine (the mine does its own concentration). For byproduct materials, Primary Producer is architecturally separate — it's the step where the host-material facility recovers the byproduct (an alumina refinery with a gallium ion-exchange circuit; a zinc smelter with germanium flue-dust recovery; a cryogenic extraction unit at a helium-bearing gas plant).

**Tier 4 — Refining** (purification to end-use grade)

Some chains have one refining step; others have multiple sequential refining operations at different purity grades.

- **Refiner** — general-purpose purification layer. The primary refining step for most chains.

- **Specialty Refiner** *(optional)* — when a chain has multiple sequential refining operations at different purity or process grades, subsequent refining goes here. Use for silicon (metallurgical-grade → electronic-grade polysilicon), rare earths (concentration → element separation), uranium (conversion → enrichment), and any chain where one refining operator does not produce the final end-use material purity.

**Tier 5 — Intermediate** (first physical form before finished device)

Two sub-types depending on the material's form at this stage:

- **Substrate Manufacturer** — converter of refined material into wafers, crystals, ingots, or other solid substrate forms used by downstream chip or device manufacturers (AXT for GaAs wafers; Shin-Etsu for silicon wafers; Umicore for Ge blanks).

- **Chemical Converter** — when the intermediate product is a chemical compound rather than a solid substrate (Umicore converts Ge metal to GeCl₄ for fiber preform manufacture; lithium carbonate → LiOH at Albemarle; uranium conversion UF₆ at ConverDyn).

**Tier 6 — Device Manufacturer** (finished component, chip, cell, magnet, etc.)

Producer of the finished semiconductor device, battery cell, magnet, or equivalent end-product unit (Navitas for GaN power ICs; CATL for battery cells; Shin-Etsu for NdFeB magnets; TSMC for silicon chips).

**Tier 7 — Assembly / End Use** (rarely modeled on input pages)

The final application layer — AI datacenter, EV vehicle, fiber network, solar farm. Input pages typically stop at Tier 6 and reference Tier 7 via the Connected Inputs section. End-use chain pages (if/when they exist) render Tier 7.

**Cross-cutting — Recycler**

Can operate at Tier 3 (primary recovery from scrap), Tier 4 (re-refining of recycled material), or elsewhere depending on operator. Own layer that slots between tiers based on the specific recycling operation.

**Cross-cutting — Aggregate**

Renders as summary box adjacent to the tree at any tier. Use for nodes that represent sums of other nodes ("Chinese Primary Supply" = ~20 Chinese alumina refineries combined).

**Layer field conventions:**

Combinations are permitted using `+`: `Primary Producer + Refiner` (integrated operators who do both primary processing and purification), `Refiner + Recycler`. Status qualifiers in parentheses are permitted: `Primary Producer (planned)`, `Refiner (demo stage)`, `Primary Producer (transitional)`.

**Not every chain uses every tier.** A chain uses the tiers its material actually flows through. Examples:

| Chain | Tiers used | Notes |
|---|---|---|
| Copper | Source(Deposit) → Mine → Primary Producer + Refiner → Substrate Manufacturer → Device Manufacturer | Single refining step; smelter and refiner often integrated |
| Gallium | Source(Byproduct) → Host Operation → Primary Producer → Refiner → Substrate Manufacturer → Device Manufacturer | Full byproduct pattern |
| Germanium | Source(Deposit) → Host Operation → Primary Producer → Refiner → Chemical Converter → [Device] | Chemical Converter for GeCl₄ step; Device Manufacturer is the fiber chain |
| Silicon (semiconductors) | Source(Deposit) → Mine → Primary Producer → Refiner → Specialty Refiner → Substrate Manufacturer → Device Manufacturer | Full spectrum with Specialty Refiner for electronic-grade polysilicon |
| Helium | Source(Byproduct) → Host Operation → Primary Producer → Refiner → [no substrate layer] → Device Manufacturer | Gas phase skips substrate; goes directly from refined helium to end-use equipment |
| Rare earths (Nd) | Source(Deposit) → Mine → Primary Producer → Refiner → Specialty Refiner → Chemical Converter → Device Manufacturer | Multi-stage refining plus chemical conversion to metal alloy |
| Lithium | Source(Deposit) → Mine → Primary Producer → Refiner → Chemical Converter → Device Manufacturer | LiOH conversion is the Chemical Converter tier |
| Uranium | Source(Deposit) → Mine → Primary Producer → Refiner → Specialty Refiner → Specialty Refiner → Device Manufacturer | Conversion + enrichment + fuel fabrication all use Specialty Refiner |

The table above is illustrative, not prescriptive. Real chains vary and writing agents use judgment on where specific operators sit.

**Why this structure matters:** It scales. A framework that works for gallium (a byproduct with uniform distribution) and germanium (a byproduct with concentrated deposits) and silicon (a primary material needing two refining stages) and helium (a byproduct with no substrate stage) is doing real work. If new chains introduced new one-off layer concepts each time, the platform's tree renderer would never stabilize.

---

## Part 2: Page-level framework

Every chain page has the same 12 sections in the same order. Deviations are a v4 failure.

### Section 1: EXECUTIVE SUMMARY

**Purpose:** Seven-bullet overview that a generalist finance reader can absorb in 90 seconds and leave with the investment thesis.

**Structure:** Seven bullet points, each 2-4 sentences. No headers within the section. The seven points follow the same template across every page:

1. **What the material is and how it is produced** (byproduct status, ore types, extraction mechanism)
2. **How the material is used** — start with the physical mechanism (e.g., "gallium is combined with other elements to form compound semiconductors, grown as crystals or thin films, then cut or deposited onto wafers that chips are built on"), then name the dominant application(s), then list other uses. **Do not skip the physical mechanism in favor of jumping to applications** — a generalist reader who only knows "gallium is in AI datacenters" does not understand what gallium is.
3. **Global supply** — use **refined** production as the canonical headline number for byproduct materials, not primary. Name Chinese share, non-Chinese share, and the structural overhang if it exists.
4. **Price behavior** — historical range, current level, bifurcation between Chinese domestic and western markets if applicable, and what that bifurcation tells you.
5. **Demand trajectory** — dominant growth vectors with CAGRs, dominant Chinese domestic consumption if relevant.
6. **Supply response** — announced projects with targets, timelines, and a honest assessment of whether they close the gap before it widens.
7. **Investment thesis** — one sentence naming the structural investable surface without naming specific companies.

**Quality criteria:**
- Every bullet is 2-4 sentences. Five sentences is a flag. Three sentences is ideal.
- Numbers are specific and dated where possible.
- Jargon is explained inline at first appearance (III-V, AESA, MOCVD, 800V HVDC, zone refining, Bayer process).
- The bullet order is structural, not narrative — do not reorder based on what feels most compelling. A reader who reads only bullet 1 should get the right foundational fact.

**Common failure modes:**
- Leading bullet 2 with application ("AI datacenters need gallium") rather than mechanism ("gallium forms compound semiconductors"). This leaves generalist readers unable to reason about the material.
- Using primary production as the supply headline for byproduct materials. Primary and refined are different products; refined is what reaches customers.
- Trying to be clever with structure. Seven bullets in order. Always.

### Section 2: HOW IT'S MADE

**Purpose:** Three-step narrative of how the material gets from its natural state to its dominant end use, in plain language a generalist can follow.

**Structure:** Three steps, each with the same sub-fields:

```
### Step 01: [VERB PHRASE IN CAPS] (maps to Supply Tree layer: [layer name])
- **Description:** Plain-language explanation of what happens in this step. 3-5 sentences.
- **Why it's hard:** What makes this step a bottleneck, if anything. 2-4 sentences.
- **Who can do it:** Rough count of global operators and geographic concentration. 1-3 sentences.
- **Output:** Annual quantity and form.
```

**Layer mapping rule (v4):** Every step header must declare its corresponding Supply Tree layer parenthetically. This is a hard requirement — the frontend uses this mapping and readers use it to navigate.

**Quality criteria:**
- Step headers are verb phrases in caps: "RECOVERED FROM ALUMINA REFINERIES," not "Alumina refinery extraction."
- All three steps map to layers that exist in the Supply Tree. If a Supply Tree has 5 layers and How It's Made has 3 steps, that is fine — the steps compress layers — but the compression must be explicit.
- Jargon is explained at first appearance. Do not assume the reader knows what the Bayer process is.

**Common failure modes:**
- Step descriptions that read like encyclopedia entries (explaining the history of the Bayer process). Stay focused on what happens in this specific chain.
- Skipping the layer mapping declaration. Always declare which Supply Tree layer each step maps to.
- Using different terminology between the step description and the Supply Tree. If the step says "ion-exchange extraction," the Supply Tree layer should use consistent vocabulary.

### Section 3: SUPPLY TREE

**Purpose:** Visual rendering of the full supply chain from upstream deposits/sources to downstream device manufacturers, with node popups for each entity.

**v4 change:** The Supply Tree section on the page now contains *only* the Key Takeaway. The node data lives in universal node records + per-chain placement records (see Part 3). The frontend reads node data from those records and renders the tree. **Writers do not write tree node prose into the page markdown.** Writers produce node records and placements.

**Key Takeaway structure:**
- One paragraph, ~60-80 words, capped at 80 words hard
- Opens with a single bolded insight sentence stating the structural takeaway of the chain
- Two supporting sentences after the bolded lead
- Does not enumerate supply figures (those go in Supply → Demand)
- Does not list companies (those live in nodes and Where The Money Is)

**Quality criteria:**
- Key Takeaway under 80 words
- Bolded first sentence
- No numbers in Key Takeaway except where structural (e.g., "230t/yr target by 2029")
- Writers have produced a complete set of universal node records + placements per Part 3

### Section 4: DEPENDENCIES

**Purpose:** Quantitative breakdown of what consumes the material and in what proportions.

**Structure:** A table with columns:

```
| Product | Usage | Est. value (material @ $X/kg) | Share | End uses | Growth |
```

**v4 convention:** The "Est. value" column represents the value of the **raw material itself** consumed (tonnes × current market price), not the value of the downstream products enabled. This understates strategic importance — the downstream AI datacenters or chips built on the material represent much larger dollar values — but reflects the actual market for the material. A clarifying note below the table explains this convention.

**Example:**
```
| GaAs substrates & devices | ~140t/yr | ~$245M (@ $1,750/kg) | 31% | 5G RF handsets, LEDs, satellite solar cells | Growing (+8%) |
```

**Quality criteria:**
- Usage tonnages sum to the total annual consumption (verified against Supply → Demand)
- Est. value uses a consistent price across all rows (cited in the column header or table footnote)
- End uses are specific applications, not categories ("5G RF handsets" not "telecom")
- Growth is a CAGR or qualitative label (Stable / Growing / Surging) matching the language used in Block 3 of So What

### Section 5: SUPPLY → DEMAND

**Purpose:** Three-card summary — Supply, Demand, Gap (or Surplus, or Balance).

**Structure:**
```
### SUPPLY
- **Value:** Numerical quantity (e.g., "320 t/yr")
- **Context:** 2-3 sentence maximum

### DEMAND
- **Value:** Numerical quantity
- **Context:** 2-3 sentence maximum

### GAP | SURPLUS | BALANCE
- **Value:** Numerical quantity (e.g., "480 t/yr shortfall by 2028")
- **Context:** 2-3 sentence maximum
```

**v4 conventions:**
- **Supply value uses refined production** for byproduct materials. The primary-refined gap may be noted in the Context sentence but is not the headline number.
- **Gap value is numerical.** Qualitative framings ("access gap, not geological gap") belong in the Context sentence, not the Value field.
- **Third card is labeled honestly.** Lithium's current picture is Surplus, not Gap. Do not default to "Gap" narrative when the market is actually oversupplied.

**Quality criteria:**
- Each Value is a parseable quantity
- Each Context is 2-3 sentences maximum (hard cap)
- Supply total cross-validated against sum of producer nodes in the tree (within 10%)
- Balance direction consistent with price behavior (rising price + labeled surplus is a red flag)

### Section 6: SO WHAT

**Purpose:** The analytical section that explains *why* the supply-demand-gap arithmetic matters. Six blocks, always in the same order.

**Block structure (same for all six):**
```
### Block N — [Block theme]
*[Block question in italics]*

**Teaser:** [One-sentence declarative headline that answers the block's question directly.]

[Analysis prose — 4-8 paragraphs of structural analysis. No bullet points inside these paragraphs except in Block 3.]
```

**The six blocks:**
- **Block 1 — Market signals.** What is the price telling us?
- **Block 2 — Supply constraints.** Why can't supply respond?
- **Block 3 — Competing demand.** Who else needs this?
- **Block 4 — Geopolitical risk.** How could it get worse?
- **Block 5 — Supply response.** What's being done?
- **Block 6 — Technology.** What could replace the material?

**v4 convention on teasers:** Teasers are **declarative one-sentence headlines that answer the block's underlying question**, not fragment-style multi-phrase teases. Example:
- v3.1 fragment teaser: "Four projects. 230t/yr by 2029. 10x increase. All downstream of 2028."
- v4 headline teaser: "Four western production projects are underway and collectively target 230t/yr by 2029, but none resolves the gap before 2028."

The headline form is immediately informative to readers who don't expand the block. The fragment form preserves mystery but leaves skim-readers uninformed. Headlines win.

**Block 3 special structure:** Block 3 (Competing demand) must use bolded demand-source paragraphs, each explaining what the material specifically does in that use case, in plain language. Not a catalog of programs and CAGRs.

```
**[Demand source name].** Paragraph explaining what the material physically does in this use case, why demand is growing or stable, and quantitative intensity or market share. 4-6 sentences.

**[Next demand source].** Similar structure.

[Closing summary sentence about the overall demand picture.]
```

**Quality criteria:**
- Teaser is a single declarative sentence, not fragments
- Teaser answers the block's question directly (a reader who reads only the teaser should know the answer)
- Block 3 has bolded demand-source paragraphs, one per major end use
- No bullet points inside blocks except Block 3's bolded paragraph structure
- Each block is 400-800 words of analysis prose (not counting teaser)

### Section 7: RISK

**Purpose:** Two-sided risk view — what could ease supply, what could soften demand.

**Structure:**
```
### What could ease supply
- **[Risk name]:** Brief description of the risk.
- **[Next risk]:** Description.
[4-8 items]

### What could soften demand
- **[Risk name]:** Description.
[4-8 items]
```

**Quality criteria:**
- Each bullet is a supply-side OR demand-side risk, not both
- Each item has a bolded risk name and a 1-3 sentence description
- Supply-side items are complementary to Block 5 (Supply response), not duplicative
- Demand-side items are complementary to Block 3 (Competing demand), not duplicative

### Section 8: WHERE THE MONEY IS

**Purpose:** Investment ideas and full briefs for investable entities on the chain.

**v4 structure:** Idea list grouped by Supply Tree layer, each card one line. Full briefs below in the same layer-grouped order.

**Idea list format:**
```
*Grouped by supply tree layer, from primary production through device manufacturing and direct commodity exposure.*

---

#### [Layer name] layer

##### [Entity name] · [Ticker] · [Exchange] · `[Category tag]`
One-line structural takeaway.

##### [Next entity]
One-line structural takeaway.

---

#### [Next layer]
[...]
```

**v4 changes from v3.1:**
- Cards are one line only. The v3.1 "Click-through hook" second line is removed.
- Cards are grouped under layer headers (Primary Producer, Refiner, Substrate Manufacturer, Device Manufacturer, Direct exposure).
- Category tag is per-chain (same entity can be Chokepoint on one chain, Feedstock supplier on another).

**Category tags:**
- `Chokepoint holder`
- `Capacity builder`
- `Technology`
- `Feedstock supplier`
- `Market maker`
- `Direct exposure`
- `Manufacturing / integration`
- `Pure-play`

**Full brief structure** (unchanged from v3.1):

```
### [Entity name] — Full Brief
*[Ticker] · [Exchange]*

**Metrics:**
- Market cap: [value or "Aggregate" / "Not listed"]
- Revenue: [TTM value or "Not disclosed"]
- EBITDA: [TTM value]
- Stock price: [value]
- 12-month change: [percentage]

**What is this and why does it matter here?**
[Paragraph — first sentence plain-language what-the-entity-is]

**How does value flow through this entity?**
[Paragraph or bolded sub-paragraphs for multi-channel value structures]

**Key numbers:**
- [4-8 operational data points]

**What to watch:**
- [3-5 dated catalysts]

**Investment angle:**
[One short paragraph]

*Stillpoint Intelligence · [Chain] Chain · Layer: [layer]. Sources: [source list]. Not investment advice.*
```

**Brief length target:** 450-550 words (±10% of 500). Hard ceiling 600.

**Quality criteria:**
- Every card is one line (structural takeaway)
- Idea list grouped by layer
- Category tag is per-chain (lives on the placement record, not the universal node)
- Full briefs in same layer-grouped order as idea list
- Every brief has all 5 mandatory Metrics fields (use "Aggregate" / "Not listed" labels for non-listed entities)
- Every brief is 450-550 words
- Every brief ends with disclaimer line

### Section 9: CATALYSTS

**Purpose:** Dated events that will reprice the chain.

**v4 structure:** Date + event one-liners grouped by horizon. No descriptions, no cards.

```
### Near-term (next 6 months)
- **[Date]** — [Event name]
- **[Date]** — [Event name]

### Medium-term (6-12 months)
- **[Date]** — [Event name]

### Long-term (12+ months)
- **[Date]** — [Event name]
```

**v4 change from v3.1:** v3.1 used card-with-description format for each catalyst. v4 collapses to date + event only. Description repeats content already in Block 4 (Geopolitical risk), Block 5 (Supply response), or the relevant full brief — redundancy without value.

**Quality criteria:**
- Every item has a specific date or date range (not "soon" or "eventually")
- Event names are self-explanatory (no descriptions needed)
- Items grouped by horizon (near-term / medium-term / long-term)
- Binary catalysts (ban expiry dates, FID decisions) clearly identified in the event name

### Section 10: CONNECTED INPUTS

**Purpose:** Lists of other chains this chain connects to — upstream feedstocks and downstream consuming chains.

**Structure:**
```
### Upstream
[List of input chains that feed this chain, or "None — raw material page"]

### Downstream
- **[Chain name]:** Brief description of the connection.
```

**Quality criteria:**
- Upstream is empty for raw material pages (correct), populated for downstream pages
- Downstream lists chains that consume this material
- Bidirectionality: if chain A lists chain B as downstream, chain B should list chain A as upstream

### Section 11: SOURCES

**Purpose:** Source list for the page's quantitative claims and central facts.

**Structure:** A list of sources with enough specificity to be verifiable (USGS Mineral Commodity Summaries 2025; SMM April 2026 benchmarks; MOFCOM announcement X date; etc.).

**Quality criteria:**
- Every quantitative claim on the page has a source or is dated
- No single trade press outlet is the sole source for a central claim
- Primary sources preferred over secondary (USGS, MOFCOM, company filings, not trade press summaries)

### Section 12: META

**Purpose:** Page metadata.

**Structure:**
```
## META
- **Vertical:** [e.g., "AI Infrastructure"]
- **Layer:** [Page-level layer, not node layer]
- **Chain position:** [description of where this page sits in the chain]
- **Status:** [e.g., "Constrained (access gap, not geological gap)"]
- **Research dossier:** [reference file]
- **Framework version:** Stillpoint Master Framework v5
- **Writing agent:** [agent name]
- **Page generated:** [date]
- **Last updated:** [date]
```

---

## Part 3: Node schema

The complete data model for nodes, per-chain placements, and Where The Money Is briefs.

### 3.1 Universal node record

One record per entity. Shared across every chain where the entity appears. Writers produce these as structured blocks in a supply tree markdown file (see Appendix A for format).

```typescript
type Node = {
  // Identification
  id: string                    // globally unique, stable slug
  name: string                  // display name
  type: NodeType                // see enum below
  ticker: string | null         // exchange-prefixed ticker, or null for non-listed

  // Location
  country: string | string[]    // ISO-3166 alpha-2 code(s) — drives country color dot
  location_detail: string       // city, region, country, facility name

  // Supply chain position
  layer: NodeLayer              // see enum below

  // Output
  output_headline: string       // one-line tree-view quantity
  output_detail: OutputDetail   // expanded output breakdown

  // State
  status: NodeStatus            // see enum below

  // Description
  about: string                 // 2-3 sentence universal description — same wherever node appears
  key_timeline: TimelineItem[] | null  // 1-3 dated universal milestones (optional)

  // Constituent entities (v5) — for Aggregate or Byproduct Source nodes that roll up multiple underlying operators
  constituent_entities: string[] | null  // e.g., ["CBG (Halco JV)", "SMB-Winning Consortium", "GAC Boffa"]

  // Where The Money Is brief (optional — only for investable nodes)
  wtmi_brief: WtmiBrief | null

  // Computed by platform
  related_chains: string[]      // derived from cross-chain placements; do not hand-edit
}

type NodeType =
  | "Public"          // publicly listed company
  | "Private"         // privately held company
  | "State-owned"     // state-owned enterprise
  | "Aggregate"       // rollup of multiple entities
  | "Deposit"         // geological resource
  | "Project"         // announced or pre-commercial facility
  | "Commodity"       // physical material itself (for direct-exposure cards)

type NodeLayer =
  | "Deposit"                   // Tier 1 — concentrated geological resource
  | "Byproduct Source"          // Tier 1 — uniform-distribution host-material region (v5 generalization of v4's "Bauxite Source")
  | "Mine"                      // Tier 2 — primary-product extraction
  | "Host Operation"            // Tier 2 — byproduct host-material extraction
  | "Primary Producer"          // Tier 3 — first industrial isolation of target material
  | "Refiner"                   // Tier 4 — purification
  | "Specialty Refiner"         // Tier 4 — secondary/multi-stage refining
  | "Substrate Manufacturer"    // Tier 5 — physical substrate form
  | "Chemical Converter"        // Tier 5 — chemical intermediate form
  | "Device Manufacturer"       // Tier 6
  | "Recycler"                  // Cross-cutting
  | "Aggregate"                 // Cross-cutting summary
  // Combinations with "+" permitted (e.g., "Primary Producer + Refiner")
  // Status qualifiers in parentheses permitted (e.g., "Primary Producer (planned)")

type NodeStatus =
  | "Active"
  | "Pre-FID"
  | "Under construction"
  | "Demo stage"
  | "Planned"
  | "Sanctioned"
  | "Demolition"
  | "Partial"             // producing but well below capacity
  | "Inactive"

type OutputDetail = {
  amount: string              // "~10-30" or "0 (target 100)"
  unit: string                // "t/yr" or "wafers/yr"
  form: string                // "metal" | "powder" | "wafer" | "compound crystal" | "chemical precursor" | "device"
  value_usd: string | null    // "$60-80M/yr" if commodity priced, null otherwise
  value_note: string | null   // "at western retail" or "company revenue estimate"
}

type TimelineItem = {
  date: string                // "Nov 2026" or "Jan 2025"
  event: string               // "FID expected" or "First 5 kg produced"
}

type WtmiBrief = {
  metrics: {
    market_cap: string        // "$4.59B" or "Private" or "Not listed"
    revenue_ttm: string
    ebitda_ttm: string
    stock_price: string
    change_12mo: string
  }
  what_is_this: string        // paragraph
  how_value_flows: string     // paragraph
  key_numbers: string[]       // 4-8 operational data points
  what_to_watch: string[]     // 3-5 dated catalysts
  investment_angle: string    // short paragraph
  sources: string             // one-line source attribution
}
```

### 3.2 Per-chain placement record

One record per `(chain, node)` pair. Captures chain-specific context.

```typescript
type ChainPlacement = {
  chain_id: string            // e.g., "gallium"
  node_id: string             // references universal Node

  // Chain-specific context
  relevance: string           // 2-3 sentences — why this node matters on THIS chain
  chain_specific_risk: string // one-line risk framed from this chain's angle

  // Tree edges (per-chain because the same node can have different edges on different chains)
  feeds_from: string[]        // upstream node IDs in THIS chain's tree
  feeds_into: string[]        // downstream node IDs in THIS chain's tree

  // Rendering controls (v5)
  show_on_tree: boolean       // whether this node renders on this chain's supply tree visualization
                              // Default: true. Set false for geographic-reference-only nodes that should appear on the globe view but not clutter this chain's tree (e.g., individual bauxite mines on the gallium tree, where a regional aggregate tells the chain's investment story better)

  // Where The Money Is
  show_in_wtmi: boolean
  wtmi_category_tag: WtmiCategoryTag | null  // required if show_in_wtmi = true
  wtmi_display_order: number | null
}

type WtmiCategoryTag =
  | "Chokepoint holder"
  | "Capacity builder"
  | "Technology"
  | "Feedstock supplier"
  | "Market maker"
  | "Direct exposure"
  | "Manufacturing / integration"
  | "Pure-play"
```

### 3.3 ID conventions

IDs must be globally unique and stable. Renaming breaks cross-chain references and the computed `related_chains` lookup.

Format: `<category>-<slug>` where category is one of:

- `company-*` — public or private companies: `company-axt-inc`, `company-dowa-holdings`
- `deposit-*` — geological deposits: `deposit-lincang`, `deposit-wulantuga`
- `bauxite-*` — bauxite source regions: `bauxite-guinea`, `bauxite-australia`
- `mine-*` — operational mining sites: `mine-red-dog-alaska`
- `project-*` — announced or pre-commercial projects: `project-alcoa-jaga-wagerup`, `project-crucible-tennessee`
- `aggregate-*` — rollup nodes: `aggregate-chinese-primary-supply-gallium`
- `commodity-*` — direct-exposure commodity cards: `commodity-gallium-metal`

Slugs are lowercase, hyphenated, stripped of punctuation. Avoid chain-specific suffixes unless the node is genuinely chain-scoped (aggregates typically are; companies are not).

### 3.4 feeds_from / feeds_into rules

**Bidirectional consistency:** If node A's `feeds_into` contains B, then B's `feeds_from` must contain A. The platform or QA should verify this.

**Aggregate nodes render as summary boxes, not tree nodes.** Do not give aggregates feeds_from / feeds_into edges; those edges live on the underlying constituent nodes.

**Vertically integrated entities may have empty feeds_from.** Metlen and Rio Tinto source from their own internal bauxite operations on the gallium chain. Leaving feeds_from empty is correct and does not indicate missing data.

**Chain boundary rule:** feeds_from / feeds_into only reference nodes within *this chain's tree*. A node that also appears on another chain (discovered via `related_chains`) may have different upstream/downstream connections on that other chain.

### 3.5 about vs relevance — register and scope

The most common failure mode when producing node records is conflating universal `about` with chain-specific `relevance`.

**`about`** — universal facts about the entity. What it does broadly. Same text wherever the node appears across chains. Should not name the specific chain the reader is on. 2-3 sentences.

*Good `about` for Umicore:* "Diversified Belgian materials technology group specializing in catalysis, recycling, and specialty materials. Operates facilities across Europe, North America, and Asia producing platinum-group metals catalysts, battery materials, and high-purity specialty metals including germanium and cobalt."

*Bad `about`:* "The western chokepoint for fiber-grade germanium tetrachloride. Operates the only commercial-scale GeCl₄ facility outside China and Russia, shipping to every major fiber manufacturer." — This is chain-specific relevance, not universal `about`.

**`relevance`** — why this node matters *on this specific chain*. Written fresh for every chain placement. Names the specific chain's context. 2-3 sentences.

*Good `relevance` for Umicore on germanium:* "The western chokepoint for fiber-grade germanium tetrachloride. Operates the only commercial-scale GeCl₄ facility outside China and Russia, shipping to every major fiber manufacturer. The December 2024 export ban made Umicore's position structural rather than discretionary."

*Good `relevance` for Umicore on cobalt (hypothetical):* "Major western cobalt refiner with extensive DRC supply chain. Battery Materials Solutions division has been problematic, but the cobalt refining business is profitable and strategically positioned as EV automakers diversify away from Chinese refiners."

**The test:** If the `about` text would be identical on two different chain pages, you are writing `about` correctly. If the `about` text makes sense only on one chain, you have written `relevance` in the `about` field by mistake.

### 3.6 Popup rendering behavior

When a user clicks a node in the supply tree:

1. **Header:** `name` + `type` badge + `country` color dot
2. **Prominently:** `output_headline`
3. **Layer badge:** canonical layer label
4. **Universal section:** `about` (2-3 sentences)
5. **Chain-specific section:** `relevance` (2-3 sentences)
6. **Location:** `location_detail`
7. **Status badge:** current operational status
8. **Upstream connections:** `feeds_from` — linked list of upstream nodes
9. **Downstream connections:** `feeds_into` — linked list of downstream nodes
10. **Chain-specific risk:** `chain_specific_risk` one-liner
11. **For nodes with `wtmi_brief` AND `show_in_wtmi = true`:** "See full brief in Where The Money Is ↓" link that anchors to the brief below the fold
12. **If `related_chains` has entries:** "This node also appears on: [chain links]"

### 3.7 Where The Money Is section rendering

The chain page's Where The Money Is section queries:
```
SELECT placements.*, nodes.*
FROM chain_placements JOIN nodes ON placements.node_id = nodes.id
WHERE placements.chain_id = <current chain> AND placements.show_in_wtmi = true
ORDER BY nodes.layer, placements.wtmi_display_order
```

Then renders:
- Layer header (Primary Producer / Refiner / etc.)
- For each node in the layer: idea card with `name · ticker · country · wtmi_category_tag` and one-line structural takeaway
- Below all idea cards: full briefs in the same layer-grouped order

Category tag comes from the placement record, not the node — the same entity can have different tags on different chains.

### 3.8 Related chains computation

`related_chains` on a universal Node is computed at render time by querying all placements for the node, returning the distinct chain_id set minus the current chain.

This means adding a node to a new chain automatically makes that chain discoverable from every other popup of the same node across existing chains, with zero hand-maintenance.

### 3.9 Tree vs. globe rendering (v5)

The platform has two visualization modes that surface node data:

- **Supply tree view** — the vertical structural tree on a chain page. Shows nodes by tier with feeds_from / feeds_into edges. Scoped to one chain.
- **Globe view** — the geographic visualization across all chains. Plots every node with a country code as a pin, regardless of which chain the user arrived from.

**Not every node belongs on every chain's tree.** Individual bauxite mines are structurally irrelevant to the gallium investment story (all bauxite has ~50 ppm gallium; the refinery's recovery circuit determines extraction, not the mine), but they are geographically important for "where does this material come from in the world" queries. They should exist in the platform's node database and render on the globe view without cluttering the gallium supply tree.

**The `show_on_tree` boolean on each ChainPlacement controls this.** Defaults to `true`. Set to `false` when:

- The node is geographically reference-only for this chain
- An aggregate or summary node on the same chain already captures the investment-relevant content this node would provide
- The individual node's relevance on this chain is "one of many; aggregated above"

Nodes with `show_on_tree: false` on a chain still appear in the chain's node database — they populate the globe, they participate in `related_chains` computation, they can be queried by the platform. They just don't render as tree nodes on that chain's supply tree visualization.

**Decision rule for the writing agent:** If the individual node tells a chain-specific investment story, `show_on_tree: true`. If the node's only chain-specific meaning is geographic ("this is where some of the bauxite that eventually feeds this chain comes from"), `show_on_tree: false` and rely on the regional aggregate to render on the tree.

**Constituent entities complement this pattern.** A Byproduct Source aggregate node (e.g., "Guinea Bauxite") can list its constituent individual mines in its `constituent_entities` field — those entities appear in the aggregate's popup as a reference list, even if each individual mine also has its own Node record elsewhere. This gives readers a single-click view of who operates under the regional aggregate without promoting individual operators to tree nodes.

---

## Part 4: Pipeline workflow

v4 codifies a four-stage pipeline for producing a new input page. Each stage has a specific role, a specific output artifact, and a handoff protocol to the next stage.

### 4.1 Stage 1: Research agent

**Input:** Chain name, vertical, general framing ("Research germanium for the Stillpoint Intelligence AI Infrastructure vertical").

**Role:** Produce a comprehensive research dossier covering everything the writing agent will need. This is the longest and most open-ended stage. The research agent makes no design decisions about the page itself — only collects raw material.

**Output artifact:** `[chain]-research-dossier.md`

**Dossier sections:**
1. Executive facts (the numbers every other section will rely on)
2. Production geography (who mines what where; reserves; grades)
3. Supply chain entities (every company, project, deposit — tickers, output, location, status)
4. Feedstock flows (who supplies whom)
5. Demand breakdown (end uses, tonnage, growth)
6. Historical supply and demand (last 10 years)
7. Price history and price mechanism (spot markets, benchmarks, regional bifurcations)
8. Geopolitical and policy context (export controls, sanctions, strategic designations)
9. Technology and substitution landscape
10. Major catalysts and dated events
11. Sources with specificity

**Quality criteria:**
- Every quantitative claim has a source
- Numbers from multiple sources cross-checked where possible
- Conflicting sources flagged rather than resolved (leave resolution to writing agent + human editor)
- Dossier is written for Claude, not for human readers — density over polish

**Handoff:** Writing agent receives dossier as a single markdown file. Writing agent does not re-do research.

### 4.2 Stage 2: Writing agent

**Input:** Research dossier.

**Role:** Produce three artifacts from the dossier.

**Output artifacts:**
1. `[chain]-input-page.md` — chain page-level content (Sections 1-2, 4-12 per Part 2; Section 3 contains only Key Takeaway)
2. `[chain]-supply-tree.md` — universal node records + per-chain placement records per Part 3
3. `[chain]-change-notes.md` — running notes on any editorial decisions, framework gaps encountered, or data conflicts resolved during writing

**Order of operations:**
1. Read dossier
2. Write Section 1 (Executive Summary) — establishes the thesis that every subsequent section must serve
3. Write Sections 2, 4, 5 (How It's Made, Dependencies, Supply → Demand) — the quantitative skeleton
4. Write supply tree file — identify all nodes, write universal data, write gallium-specific placements, wire feeds_from/into edges
5. Write Section 3 Key Takeaway — references tree structure
6. Write Section 8 Where The Money Is full briefs — moves brief content onto universal nodes
7. Write Sections 6, 7, 9 (So What, Risk, Catalysts) — the analytical layer
8. Write Sections 10-12 (Connected Inputs, Sources, Meta)
9. Self-QA against Part 5 before handing off

**Quality criteria:**
- All 12 page sections present and in order
- Node schema compliant
- Plain language compliant throughout
- Every brief 450-550 words
- Every teaser is a declarative headline
- Every table sourced
- Change notes capture anything the QA agent should know

**Handoff:** QA agent receives the three artifacts plus the original dossier.

### 4.3 Stage 3: QA agent

**Input:** Research dossier, input page, supply tree file, writing agent's change notes.

**Role:** Run Part 5 QA protocol. Produce a QA report with findings.

**Output artifact:** `[chain]-qa-report.md`

**QA report structure:**
- Overall status: PASS / FLAG / FAIL
- Count of PASSes, FLAGs, FAILs
- Top 3 priority fixes
- Check-by-check findings
- Framework questions (if any new ones surfaced)
- Recommended fixes prioritized

**Quality criteria:**
- Every Part 5 check run
- Findings are specific (location, text, proposed fix) — not general ("Exec summary could be tighter")
- Framework ambiguities separated from executional issues

**Handoff:** Writing agent receives QA report, applies fixes, produces v2 of all three artifacts, loops back to QA if needed. After ≤2 iteration loops, hand off to platform integration.

### 4.4 Stage 4: Platform integration

**Input:** QA-approved input page markdown, supply tree file, node schema spec (this document, Part 3).

**Role:** Integrate content into the Stillpoint Intelligence platform codebase.

**Executor:** Claude Code in the repo, with a handoff prompt.

**Output artifact:** Deployed `/app/input/[chain]/page.tsx` plus any new `nodes.ts` / `placements.ts` data files.

**Handoff prompt template:** See Appendix C for the canonical Claude Code handoff prompt (reconcile existing page, implement node data model, build supply tree rendering, verify).

**Quality criteria:**
- Page renders cleanly in dev server
- All 12 sections display
- Supply tree renders with edges drawn correctly
- Node popups show universal + chain-specific content
- Where The Money Is grouped by layer with correct category tags
- Catalysts shows date + event one-liners

**Handoff back to human:** After Claude Code finishes, human reviews the deployed page before publishing.

### 4.5 Parallel deployment pattern

For batch production (Phase 5 — 5+ chains simultaneously), the pipeline parallelizes:

- Research agents run in parallel on different chains (no dependencies between them)
- Writing agents run in parallel once dossiers complete
- QA agents run in parallel
- Platform integration typically serializes (single Claude Code session per chain avoids merge conflicts)

**Coordinator role (human):** The human orchestrator monitors:
- Which chains are in which stage
- Which writing agents are producing output that diverges from framework conventions (catch drift early)
- When the same entity appears in multiple chain research dossiers simultaneously — the first writing agent to reach that entity produces the universal node record; subsequent writing agents should reference it rather than duplicate

**Universal node deduplication:** If two writing agents are producing pages that both reference Umicore (germanium and, hypothetically, cobalt), the universal Umicore node record should be produced once. The second writing agent produces only the Umicore cobalt placement, referencing the already-existing universal record. A shared node registry (flat file or simple database) prevents duplication.

---

## Part 5: QA protocol

The QA agent runs these checks. Each check produces PASS, FLAG, or FAIL. Overall page status is the worst of any individual check (one FAIL = page FAILs).

### 5.1 Pre-flight completeness
- All 12 page sections present, in order
- Page word count 12,000-25,000 (excluding Supply Tree, which now lives in separate file)
- Supply tree file present with universal nodes + placements
- Meta block populated including `Framework version: v4`

### 5.2 Numerical consistency
- Every numerical claim on the page can be traced to a sourced figure
- Supply total matches sum of producer node outputs (within 10%)
- Demand total in Supply → Demand matches sum of Dependencies table Usage column (within 10%)
- Gap = Demand − Supply (arithmetic correct)
- Refined production used as headline supply for byproduct materials
- Dependencies "Est. value" uses consistent per-kg price across rows

### 5.3 Layer mapping
- Every How It's Made step declares its Supply Tree layer parenthetically
- Every node's layer field uses an approved label from Part 1 § 1.3
- Every non-aggregate node has bidirectional feeds_from / feeds_into consistency with its neighbors
- Aggregate nodes have no tree edges (aggregates render as summary boxes)

### 5.4 Schema compliance (v5)
- Every node record has all universal fields populated (including `constituent_entities` where relevant for aggregates)
- Every placement record has all placement fields populated (relevance, chain_specific_risk, feeds_from, feeds_into, show_on_tree, show_in_wtmi, wtmi_category_tag, wtmi_display_order)
- Node IDs follow Part 3 § 3.3 conventions
- `about` vs `relevance` distinction respected (see Part 3 § 3.5)
- For nodes with `show_in_wtmi = true`: `wtmi_category_tag` is populated and `wtmi_brief` is present on the universal node record
- `show_on_tree = false` nodes have either a regional aggregate covering them on the tree OR explicit justification in the writing agent's change notes
- Layer labels use v5 taxonomy (Deposit / Byproduct Source / Mine / Host Operation / Primary Producer / Refiner / Specialty Refiner / Substrate Manufacturer / Chemical Converter / Device Manufacturer / Recycler / Aggregate); no legacy "Bauxite Source" references outside of retrofit work

### 5.5 Voice and format
- Teasers (So What) are declarative one-sentence headlines, not fragments
- Where The Money Is cards are one line only (no click-through hook second line)
- Where The Money Is grouped by layer
- Catalysts format is date + event, no descriptions
- Exec Summary bullet 2 leads with mechanism before application
- No emojis, no promotional language, no buy/sell recommendations

### 5.6 Plain language
- Every technical term explained inline at first appearance, or replaced with plain-language equivalent
- Generalist finance reader (Senior Associate at deep tech VC fund) can follow the full page without a glossary

### 5.7 Brief completeness
- Every investable entity has a full brief
- Every brief has all 5 mandatory Metrics fields
- Every brief is 450-550 words (hard ceiling 600)
- Every brief has all 5 structural sub-sections in order
- Every brief ends with disclaimer line

### 5.8 Source integrity
- Every quantitative claim sourced or dated
- No single trade press outlet sole source for central claim
- Primary sources preferred over secondary

### 5.9 Cross-section thesis consistency
- Executive Summary thesis (point 7) is coherent with Supply Tree Key Takeaway
- Block 5 (Supply response) is complementary to Risk § What could ease supply (not duplicative)
- Where The Money Is ordering follows structural logic (chokepoint / capacity builders / demand proxies / variables)

### 5.10 Failure escalation
The QA agent escalates to human when:
- A check FAILs after a second iteration of fixes
- Research dossier has contradictory claims the writing agent could not resolve
- Framework ambiguity surfaces that affects the page's structure
- A node's chain-specific `relevance` cannot be written honestly (suggests node does not belong on this chain)

---

## Part 6: Retrofit guidance

v5 is mandatory for new pages and strongly recommended as a retrofit target for existing pages.

### 6.1 Current state

- **Germanium page** — v2.1 conventions, deployed. Pre-v3 brief lengths, prose-based supply tree, click-through-hook idea cards, card-with-description Catalysts. Needs full v5 retrofit.
- **Fiber optic cable page** — v2.1 conventions, deployed. Similar structural gaps to germanium. Needs full v5 retrofit.
- **Gallium page** — first v5-native page. Page content is v4-compliant with v5 taxonomy updates in the supply tree. Uses `Byproduct Source` layer (not legacy "Bauxite Source") and includes individual bauxite mine nodes with `show_on_tree: false`.

### 6.2 Retrofit priority

1. **Gallium** — update existing v4 gallium artifacts to v5 (minor: rename "Bauxite Source" layer label to confirm it matches v5 taxonomy; add `show_on_tree` and `constituent_entities` fields; add individual bauxite mine nodes with `show_on_tree: false`)
2. **Germanium** — reference page for germanium→fiber chain. Retrofit to v5 makes the most important AI infrastructure chain consistent.
3. **Fiber optic cable** — paired with germanium; retrofit together for chain coherence.

### 6.3 Gallium v4 → v5 upgrade checklist

**Schema additions (lightweight):**
- Add `show_on_tree: true` to all existing gallium placements (default value, no behavior change for existing nodes)
- Add `constituent_entities` to the 5 Byproduct Source aggregate nodes listing their major operators
- Confirm "Bauxite Source" layer label matches v5 taxonomy (it does — v5 made this the standard label; v4 introduced it provisionally)

**Data additions:**
- Add ~20-30 individual bauxite mine nodes with `show_on_tree: false` on gallium placement (see `gallium-supply-tree.md` update)
- Each individual mine node participates in future `related_chains` computation (e.g., if an "aluminum" chain is built later, these mines auto-surface as related)

### 6.4 Germanium migration checklist

**Page-level changes (v2.1 → v5):**
- Executive Summary bullet 2: check mechanism-before-application ordering
- Dependencies table: add "material @ $X/kg" to Est. value column; confirm value convention is germanium-at-market-price
- So What teasers: rewrite as declarative headlines if currently fragment-style
- Where The Money Is: remove click-through hook second lines; regroup by layer; reorder full briefs to match
- Catalysts: collapse to date + event one-liners
- Meta: update framework version to v5

**Node schema migration:**
- Extract each Supply Tree node's prose into a universal Node record
- Separate universal `about` from germanium-specific `relevance`
- Add `feeds_from` and `feeds_into` edges (v2.1 tree prose did not have these; infer from the tree visual)
- Apply v5 layer taxonomy: Lincang/Wulantuga/Yimin/Huize remain `Deposit` tier; zinc smelters become `Host Operation` tier; Umicore becomes `Refiner + Chemical Converter` (the GeCl₄ conversion is the Chemical Converter tier); 5N Plus becomes `Refiner`; fiber preform makers become `Substrate Manufacturer` or stay on the fiber chain depending on page scope
- For each WTMI brief: move the brief content onto its universal Node record
- Set `show_in_wtmi: true` and `show_on_tree: true` on germanium placement for nodes with briefs
- Set `show_on_tree: false` on geographic-reference-only nodes (e.g., minor zinc smelters in the germanium tree)
- Verify IDs follow Part 3 § 3.3 conventions
- Verify bidirectional edge consistency

**Estimated effort:** 1-2 writing-agent sessions + 1 QA session.

### 6.5 Fiber migration checklist

Same as germanium but additionally:
- Apply v5 layer taxonomy: fiber manufacturers (Corning, Prysmian, Fujikura, etc.) go on `Substrate Manufacturer` tier if fiber is treated as a substrate, or a new `Assembly` layer if the page treats fiber cable as the finished product. Writing agent decides based on chain scope.
- Verify feedstock flow from GeCl₄, Helium, Silica inputs is correctly represented as upstream connections via Connected Inputs section (these live in their own chains)

### 6.6 Order of operations

1. Upgrade gallium v4 → v5 first (lightweight schema additions + individual mine nodes)
2. Retrofit germanium to v5 (biggest work item)
3. Retrofit fiber to v5 (depends on germanium node records being v5-compliant since Umicore, 5N Plus, etc. are shared)
4. Only after all three reference pages are v5-compliant, deploy Phase 5 parallel agents (lithium, copper, silicon, rare earths, helium)

### 6.7 Backward compatibility

The platform should not require all pages to be v5-compliant simultaneously. A germanium page still on v2.1 is fine to keep deployed while a v5 retrofit is in progress. The node schema is additive — adding v5 fields doesn't break earlier pages that don't reference them.

Cross-chain discovery (`related_chains`) will only work between v5-compliant pages (and by extension, v4-compliant pages that use compatible IDs). Until germanium is retrofit, a gallium reader clicking 5N Plus will not see "5N Plus also appears on germanium" because germanium has no v4/v5 5N Plus node record yet.

---

## Appendix A: Worked example (gallium)

The gallium chain is the first v4-native page. Artifacts:

- `gallium-research-dossier.md` — Research agent output
- `gallium-input-page.md` — Writing agent page-level output (Sections 1-2, 4-12)
- `gallium-supply-tree.md` — Writing agent node + placement output (22 universal nodes + 22 placements)
- `gallium-qa-report.md` — QA agent output
- Platform integration pending as of v4 publication

Use these files as the canonical reference for what v4-compliant output looks like.

---

## Appendix B: Change log

### v4 → v5

**Layer taxonomy — restructured as universal tiers:**
- Layers now organized into 7 universal tiers (Source / Extraction / Primary Processing / Refining / Intermediate / Device / Assembly) with optional sub-types at each tier
- `Bauxite Source` (v4) renamed to `Byproduct Source` — generalizes to any byproduct material with uniform host-material distribution (helium in natural gas, indium in zinc concentrate, etc.), not just gallium in bauxite
- `Host Operation` added as Tier 2 sub-type for byproduct extraction (the host-material mining or wellhead operation that produces the target as byproduct)
- `Specialty Refiner` added as optional Tier 4 layer for chains with multi-stage refining (silicon metallurgical → electronic grade; rare earth element separation; uranium conversion + enrichment)
- `Chemical Converter` added as Tier 5 sub-type for chains where the intermediate product is a chemical compound (GeCl₄, LiOH, UF₆) rather than a solid substrate

**Schema additions:**
- `show_on_tree: boolean` added to ChainPlacement — enables geographic-reference-only nodes that appear on the globe view without cluttering chain-specific supply trees
- `constituent_entities: string[] | null` added to Node — lets aggregate nodes list their underlying operators (e.g., Guinea Bauxite aggregate listing CBG, SMB-Winning, GAC Boffa) without promoting those operators to tree nodes

**Rendering distinctions:**
- Supply tree view vs. globe view distinction formalized in Part 3 § 3.9
- Individual byproduct-source operators (individual bauxite mines for gallium) can exist in the node database for globe rendering while being excluded from the supply tree view via `show_on_tree: false`

**QA protocol additions:**
- Schema compliance check (5.4) updated for v5 fields
- Layer label consistency with v5 taxonomy

**Retrofit guidance:**
- Gallium upgrade path from v4 → v5 documented (lightweight schema additions)
- Germanium / fiber retrofit updated to apply v5 taxonomy

### v3.1 → v4

**Architecture:**
- Node-centric data model formalized (three artifact types: universal nodes, per-chain placements, chain pages)
- Supply Tree section moves to separate file (supply-tree.md) with structured node records, replacing prose-in-page approach
- Where The Money Is full briefs move from page section to universal node records (`wtmi_brief` field)
- `related_chains` introduced as platform-computed cross-chain discovery

**Layer taxonomy:**
- `Bauxite Source` layer added for byproduct materials with uniform host-material distribution (renamed to `Byproduct Source` in v5)
- Existing `Deposit` layer remains for materials with concentrated geological ore bodies

**Page-level conventions:**
- So What teasers are declarative one-sentence headlines (v3.1 allowed fragment-style)
- Where The Money Is cards are one line (v3.1 had two lines: structural takeaway + click-through hook)
- Where The Money Is grouped by Supply Tree layer (v3.1 was ungrouped)
- WTMI category tag is per-chain (v3.1 implicitly universal)
- Catalysts format is date + event only (v3.1 had card-with-description)
- Dependencies "Est. value" convention is material-at-market-price (v3.1 was ambiguous; some pages used downstream product value)
- Executive Summary bullet 2 (uses) leads with physical mechanism before application (v3.1 allowed application-first)

**Schema additions:**
- Full Node schema formalized
- Full ChainPlacement schema formalized
- ID conventions with category prefixes (`company-`, `deposit-`, `bauxite-`, `project-`, `aggregate-`, `commodity-`)
- Bidirectional feeds_from / feeds_into consistency rule
- about vs relevance register distinction codified

**Pipeline workflow:**
- Four-stage pipeline codified (research / writing / QA / integration)
- Handoff artifacts specified per stage
- Parallel deployment pattern documented
- Universal node deduplication rule for parallel writing agents

**QA protocol:**
- Schema compliance checks added (5.4)
- Edge consistency check added to layer mapping (5.3)
- Voice and format checks updated for new conventions (one-line cards, declarative teasers, date + event Catalysts)

**Retrofit guidance:**
- Germanium and fiber retrofit checklists added
- Retrofit priority established
- Backward compatibility rules documented

---

## Appendix C: Claude Code handoff prompt template

For platform integration of a new chain page. Customize the bracketed fields.

```
# [CHAIN] Input Page — Update and Supply Tree Build

I'm updating the [chain] input page on the Stillpoint Intelligence platform.
Three things need to happen:

1. Reconcile the existing /app/input/[chain]/page.tsx content to a new markdown source
2. Implement (or extend) the node-centric data model for the supply tree
3. Build (or extend) the supply tree rendering component

## Files attached

- [chain]-input-page.md — full updated page content (source of truth for all sections except Supply Tree node data)
- [chain]-supply-tree.md — structured node and placement data for Supply Tree and Where The Money Is
- stillpoint-master-framework-v4.md — authoritative framework including node schema spec (Part 3)

## Step 1: Content reconciliation

Read existing /app/input/[chain]/page.tsx. Compare against [chain]-input-page.md.
Reconcile to match the new markdown, preserving existing JSX structure, imports,
shared components, and styling. Only change content that has changed.

[List specific content changes this update introduces.]

## Step 2: Supply tree data model

Read stillpoint-master-framework-v4.md Part 3 (node schema). The three-layer model is:
universal nodes, per-chain placements, chain page framing.

Then read [chain]-supply-tree.md which contains:
- Universal node records (Section 1)
- Chain placement records (Section 2)
- WTMI render ordering (Section 3)

Translate markdown into TypeScript data structures. Use existing codebase conventions.

[If first v4 page: specify location for new Node / ChainPlacement types.]
[If additional v4 page: reference existing types.]

## Step 3: Supply tree rendering

Render tree with layers stacked vertically per Part 3 § 3.6 popup behavior and
§ 3.7 WTMI rendering. Reference germanium/fiber tree components if they exist.

[List any chain-specific layer considerations.]

## Step 4: Where The Money Is wiring

Query placements where chain_id = "[chain]" AND show_in_wtmi = true. Group by
layer. Render idea cards with one-line takeaway. Render full briefs below in
layer order.

## Step 5: Verification

Run npm run build. Visit /app/input/[chain]. Verify all 12 sections, tree
renders with edges, node popups work, WTMI grouped by layer, Catalysts shows
date + event.
```

---

*Stillpoint Intelligence · Master Framework v5 · April 2026*
