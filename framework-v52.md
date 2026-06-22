# Stillpoint Intelligence
# Master Framework for Building Input Pages
# v5.2 — April 2026

**Status:** Authoritative. Supersedes v5.1, v5, v4, v3.1, v3, v2.1.
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

Renders in one of two modes depending on the tree's needs:

- **Inline tree node with edges (v5.2):** when the aggregate represents a node in the supply flow that has defined upstream and downstream connections. Example: gallium's "Western Refined Supply" aggregate rolls up Dowa + 5N Plus + Indium Corp at the Refiner tier output, then flows into "Global Supply" at the next tier. These aggregates have `feeds_from` and `feeds_into` edges and render as regular tree nodes, optionally with a slightly different visual styling (larger node, distinct border) to signal their summary nature.

- **Summary box adjacent to tree:** when the aggregate is a reference view that doesn't participate in the flow. Example: a "Total Chinese capacity" aggregate box rendered alongside the tree for context but not connected to other nodes. These aggregates have no edges.

Writing agents pick the appropriate mode per aggregate based on whether the aggregate is structurally part of the chain flow or a sidebar reference.

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

### 1.4 Page scope guidance (which tiers a page covers)

Different pages cover different slices of a chain. Writing agents use judgment, but the following rough guidance applies:

- **Raw material pages** generally terminate at the **Refiner** tier. Germanium, gallium, lithium, copper, helium, rare earths — the chain goes from Source through Refining, and the page ends there. Downstream layers (Intermediate, Device, End Use) are referenced via the Connected Inputs section, which links to their own pages.

- **Intermediate material pages** may exist when a chain's Intermediate tier (Substrate Manufacturer or Chemical Converter) feeds multiple distinct downstream component chains. Compound semiconductor wafers (GaAs, InP) feed RF amplifiers, LEDs, satellite solar, and AI optical all from the same wafer producers — that justifies a dedicated wafer page. Lithium hydroxide (LiOH) feeds battery cathode production at scale — potentially its own page. Specialty chemicals like GeCl₄ that feed a single dominant chain (fiber optic preforms) typically don't need their own page and can fold into the downstream component page instead.

- **Component / device pages** terminate at the **Device Manufacturer** tier. GaN power devices, fiber optic cable, battery cells, permanent magnets. The component is the functional unit; end-use chains (AI datacenter, EV) reference it upstream.

The distinction between these page types is a judgment call, not a hard rule. When a raw material's intermediate tier is central to the investment thesis and feeds multiple distinct component chains, give it its own page. When it's captured better within the downstream component chain, don't.

What this means practically: if a writing agent is researching a raw material chain and finds themselves adding nodes at the Substrate Manufacturer or Device Manufacturer tier, that's a signal the scope has drifted. Those tiers belong on their own pages. Keep the raw material page focused on Source through Refining.

---

## Part 2: Page-level framework

Every chain page has the same 11 top-level sections in the same order. Section 2 (Supply Tree) now contains How It's Made as a subsection, with per-layer cards replacing the old process-step format. Deviations are a v5.1 failure.

**Section ordering (v5.1):**

1. Executive Summary
2. Supply Tree (contains: How It's Made layer cards → tree visualization → Key Takeaway → Nodes)
3. Dependencies
4. Supply → Demand
5. So What
6. Risk
7. Where The Money Is
8. Catalysts
9. Connected Inputs
10. Sources
11. Meta

### Section 1: EXECUTIVE SUMMARY

**Purpose:** Six-bullet overview followed by a closing thesis line that a generalist finance reader can absorb in 90 seconds and leave with the investment thesis.

**Structure:** Six bullet points plus one closing thesis paragraph. No headers within the section. The six points follow the same template across every page:

1. **What the material is and how it is produced** (byproduct status, ore types, extraction mechanism)
2. **How the material is used** — start with the physical mechanism (e.g., "gallium forms compound semiconductors grown onto wafers and used as the foundation for chips"), then name the dominant applications briefly. **Do not skip the physical mechanism in favor of jumping to applications** — a generalist reader who only knows "gallium is in AI datacenters" does not understand what gallium is. Keep this bullet to 2 sentences — it is the highest-risk bullet for bloat.
3. **Global supply** — use **refined** production as the canonical headline number for byproduct materials, not primary. Name Chinese share, non-Chinese share, and the structural overhang if it exists.
4. **Price behavior** — historical range, current level, bifurcation between Chinese domestic and western markets if applicable, and what that bifurcation tells you.
5. **Demand trajectory** — dominant growth vectors with CAGRs. Brief.
6. **Supply response** — announced projects with a collective target and timeline. Do not enumerate each project by name in the exec summary (readers find project detail in the Supply Tree and WTMI sections).

Followed by:

**Closing thesis line** — one sentence rendered in bold as the final paragraph. Names the structural investable surface on this chain without naming specific companies. Must match the page's actual scope: if the page terminates at the Refiner layer (raw material page), the thesis cannot reference substrate or device makers as investable — those live on downstream chain pages.

**Length target (v5.2):**
- Total Executive Summary: 135-230 words
- Germanium-style (single chokepoint story): 135 words is achievable
- Gallium-style (bifurcated supply + multiple projects): 200-230 words is the realistic floor
- Pages longer than 250 words indicate a bullet is bloated — usually bullet 2 (uses)

**Quality criteria:**
- Every bullet is 1-3 sentences. Four sentences is a flag. Two sentences is the target for bullet 2 specifically.
- Numbers are specific and dated where possible.
- Jargon is explained inline at first appearance (III-V, AESA, MOCVD, 800V HVDC, zone refining, Bayer process).
- The bullet order is structural, not narrative — do not reorder based on what feels most compelling. A reader who reads only bullet 1 should get the right foundational fact.
- Closing thesis line is 1 sentence, rendered in bold, names the investable surface, and stays within page scope.

**Common failure modes:**
- Leading bullet 2 with application ("AI datacenters need gallium") rather than mechanism ("gallium forms compound semiconductors"). This leaves generalist readers unable to reason about the material.
- Bullet 2 runs to 5-6 sentences with physics tangents, efficiency numbers, and full end-use lists — all of that content belongs in Block 3 (Competing demand) or Block 6 (Technology), not the exec summary.
- Enumerating every supply-response project by name in bullet 6 (each project has its tonnage target, timeline, feedstock type — that's tree data, not exec summary data).
- Using primary production as the supply headline for byproduct materials. Primary and refined are different products; refined is what reaches customers.
- Thesis line references entities that aren't actually on the page's tree (e.g., mentioning "substrate converters" when the tree terminates at Refiner and substrate manufacturers live on a downstream chain page).
- Trying to be clever with structure. Six bullets + closing line in order. Always.

### Section 2: SUPPLY TREE

**Purpose:** The Supply Tree section is the structural anchor of every chain page. It contains — in this order — four subsections that together give the reader (a) the structural thesis in a glanceable summary, (b) the visual tree itself, (c) per-layer context for what's happening at each tree tier, and (d) a pointer to the node data source for maintainers.

**Subsection structure (v5.2 order):**

```
## SUPPLY TREE

### Key Takeaways
[Horizontal card at top of section with 4 numbered takeaways. 
Sits above the tree so readers enter the tree with the thesis primed.]

[Tree visualization renders here — platform reads from chain-supply-tree.md]

### How It's Made
[Per-layer cards: one card per tree layer. Sits below the tree as 
reference material for readers who want process detail.]

### Nodes
[Pointer to chain-supply-tree.md — for writing agents and QA, not 
rendered to end users.]
```

**Reading flow this creates:** Reader scans Key Takeaways → absorbs tree → drills into layer cards if they want process detail. The takeaways are a reading guide for the tree; the cards are reference material for deeper context. This reverses the v5.1 order (cards above tree, takeaways below) because institutional readers want the thesis summary first, tree second, process detail third — not process detail first.

#### Section 2.1: Key Takeaways (horizontal card above tree)

**Purpose:** A glanceable narrative of the supply story the tree tells, written so a reader can absorb it while looking at the tree. Each takeaway is a single declarative sentence stating one fact — together they walk down the tree from top to bottom.

**Structure:**

```
### Key Takeaways

[Rendered as a horizontal card container at full section width, 
containing a numbered list of 4 takeaways stacked vertically.]

1. [Single declarative sentence stating one fact about the upstream / 
   raw material tier of the tree.]
2. [Single declarative sentence about the production / extraction tier.]
3. [Single declarative sentence about the refining / response-capacity 
   tier.]
4. [Single declarative sentence about the chokepoint / supply terminus 
   tier.]
```

**Style — dictated narrative:**

Each takeaway is one plain sentence stating a single fact. The card should read like dictation — the supply story told out loud, the way someone would explain it to a colleague who just asked "what's the deal with this chain?" Not like four bullet points of analytical prose. Not like a condensed Executive Summary.

What this looks like in practice (good):

> 1. Only 8 coal and zinc deposits in the world host germanium at high enough concentration to be commercially extracted.
> 2. 83% of that supply is in China.
> 3. Two western sources exist — Big Hill is new DRC tailings refined exclusively by Umicore, and Red Dog is a declining Alaskan zinc mine expected to expire in 2031.
> 4. Outside China, Umicore and 5N Plus are the sole western supply for germanium-reliant products.

What this should NOT look like (bad — analytical prose disguised as takeaways):

> 1. Germanium concentrates in two distinct host materials — coal seams and zinc-lead ore bodies — both pathways geographically dominated by China.
> 2. Recovery requires specialized hydrometallurgical circuits that most zinc smelters and coal operations never install.

The first version is a story being told. The second version is a thesis being summarized. Both contain similar facts; only the first is a Key Takeaway.

**Quality criteria:**

- Heading is `Key Takeaways` (plural), no framing label
- Exactly 4 numbered takeaways
- Each takeaway is **one sentence** stating **one fact** in plain language. Names of specific entities, deposits, projects, or tonnage figures are fine — they make the story concrete. Avoid analytical claims, em-dashed fact/implication splits, or two-clause sentences that try to package fact + meaning together.
- Each takeaway maps to a specific tier of the chain's tree. A reader's eye should run down the tree from top to bottom while reading the takeaways from top to bottom, with each takeaway "lighting up" the corresponding tier. If a takeaway doesn't map to a specific tier, it belongs in the Executive Summary instead.
- Total card content under 100 words. Individual takeaway length 12-35 words depending on how many specific names need to be packed in (germanium-style chains can be tighter; gallium-style chains with multiple named projects run a bit longer).
- No bolded lead phrases. No em-dashes splitting fact from implication. No "framing labels" above the list ("How to read this tree:" has been dropped as unnecessary noise).
- Does NOT reach into downstream chain specifics (those live in Connected Inputs).
- Renders inside a card container — not naked page content.

**Why 4 points not 5:** v5.1's 5-point format included a downstream-connection point. In v5.2, downstream connections live in the Connected Inputs section explicitly. The tree itself terminates at the raw material's appropriate layer (Refiner for raw material pages), so the takeaways should only thread through what the tree actually shows.

**Common failure modes:**

- Writing takeaways that read as analytical prose rather than dictated narrative (the most common failure — happens because writing-agent tone defaults to analytical when working from a research dossier)
- Em-dash fact/implication structure ("X is plentiful — not a constraint") instead of single declarative sentences
- Bolding the lead phrase of each point (creates visual weight problem with the card container)
- Writing takeaways that don't stand alone (a takeaway that only makes sense with surrounding prose is not a takeaway)
- Rendering as a naked numbered list instead of inside a card container — weakens visual hierarchy
- Takeaways that don't map to specific tree tiers (signals the content belongs in Executive Summary, not Key Takeaways)

#### Section 2.2: Tree visualization

The platform renders the supply tree from the chain's supply-tree.md file. Writers do not produce prose nodes in the input page markdown — that produces duplication with the actual data source. The node data lives in the supply-tree.md file per Part 3 (Node schema).

#### Section 2.3: How It's Made (layer cards below tree)

**Purpose:** Per-layer reference material for readers who want to understand the industrial process at each tree tier. Sits below the tree so readers encountering an unfamiliar layer in the tree can scroll down and find context.

**Card structure (v5.2 five-zone format):**

Each card has five content zones in order:

```
#### [LAYER NAME IN SMALL-CAPS]

[Opening line — one sentence describing what this layer's entity type is. 
No label above it. Plain paragraph text.]

**WHAT HAPPENS HERE**
[1 paragraph, 2-4 sentences, describing the industrial operation at 
this layer in plain language.]

**WHY IT'S HARD**
[1 paragraph, 2-4 sentences, explaining the structural bottleneck or 
tension at this layer.]

**[BIG NUMBER]** [muted descriptor]
```

The five zones are, top to bottom:
1. **Layer label** — layer name rendered in small-caps gold, matching the v5 taxonomy
2. **Opening line** — one sentence, no label, says what the entity type is at this layer
3. **WHAT HAPPENS HERE** — labeled section describing the industrial operation
4. **WHY IT'S HARD** — labeled section describing the bottleneck
5. **Bottom stat** — large bold quantity, smaller muted descriptor (e.g., "**~346M t/yr** bauxite mined globally")

**Quality criteria:**
- Card titles are layer names from the v5 taxonomy in small-caps styling ("BYPRODUCT SOURCE", "PRIMARY PRODUCER", "REFINER") — not verb phrases
- Number of cards matches the number of tree layers the chain actually displays
- Each card's content is tightly connected to the nodes that will render on that tree layer — a reader should be able to look at the tree and immediately map each node to the card that described its layer
- Bottom stats across the cards tell a quantitative story in sequence (e.g., for gallium: 346M t/yr bauxite → 600 t/yr primary gallium → 320 t/yr refined gallium — massive host volume, tiny extraction, further refining losses)
- All three cards render in a single row (3-column grid on desktop, stacked on mobile)
- WHY IT'S HARD is a hard requirement. Every layer has a structural tension worth naming. If a writing agent cannot articulate one, that's a signal the research is thin

**Common failure modes:**
- Writing generic encyclopedia-style descriptions (explaining the Bayer process in abstract detail instead of specifically how gallium flows through it)
- Titling cards as process-step verbs in caps ("01 · EXTRACTION FROM HOST ORE") instead of layer names ("PRIMARY PRODUCER"). The layer name approach ties card-to-tree navigation directly.
- Copying narrative content from Executive Summary. How It's Made cards should be *physical-process* focused, not thesis-focused.
- Too much content per card — each card should read in ~20 seconds, not ~60. If a card's WHAT HAPPENS HERE paragraph runs beyond 4 sentences, cut.
- Inconsistent bottom stats (using revenue for one layer and tonnage for another when both layers have tonnage available) — pick the most comparable metric across the three cards

#### Section 2.4: Nodes (pointer, not rendered)

The Nodes subsection is a short pointer to the chain's supply-tree.md file. It exists so that writing agents and QA know where tree data lives, and so a reader clicking through the markdown source sees the architectural note. The platform does not render the Nodes subsection — the actual tree visualization is generated from the supply-tree.md file.

### Section 3: DEPENDENCIES

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

### Section 4: SUPPLY → DEMAND

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

### Section 5: SO WHAT

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

### Section 6: RISK

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

### Section 7: WHERE THE MONEY IS

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

### Section 8: CATALYSTS

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

### Section 9: CONNECTED INPUTS

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

### Section 10: SOURCES

**Purpose:** Source list for the page's quantitative claims and central facts.

**Structure:** A list of sources with enough specificity to be verifiable (USGS Mineral Commodity Summaries 2025; SMM April 2026 benchmarks; MOFCOM announcement X date; etc.).

**Quality criteria:**
- Every quantitative claim on the page has a source or is dated
- No single trade press outlet is the sole source for a central claim
- Primary sources preferred over secondary (USGS, MOFCOM, company filings, not trade press summaries)

### Section 11: META

**Purpose:** Page metadata.

**Structure:**
```
## META
- **Vertical:** [e.g., "AI Infrastructure"]
- **Layer:** [Page-level layer, not node layer]
- **Chain position:** [description of where this page sits in the chain]
- **Status:** [e.g., "Constrained (access gap, not geological gap)"]
- **Research dossier:** [reference file]
- **Framework version:** Stillpoint Master Framework v5.2
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
  output_headline: string       // one-line tree-view quantity (superseded by pills for display; kept for fallback and popup)
  output_detail: OutputDetail   // expanded output breakdown

  // Tree node pills (v5.1) — what renders on the tree-view node badge
  descriptor_pill: string       // 2-3 word categorical phrase (e.g., "Coal deposit", "Alumina refinery", "GaN device maker")
  quantity_pill: string         // scale / output indicator, may include form (e.g., "~140 t/yr primary Ga", "50 t GeCl₄/yr", "~$95M TTM revenue")

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

**Aggregate nodes (v5.2):** Aggregates can render in one of two modes:

- *Inline tree node with edges* — when the aggregate represents a flow node in the tree (e.g., "Western Refined Supply" rolling up Dowa + 5N Plus + Indium Corp as they feed into "Global Supply"). In this case, the aggregate has `feeds_from` edges from its constituent underlying nodes and `feeds_into` edges to its downstream. Bidirectional consistency applies. The underlying nodes' `feeds_into` should point to the aggregate, not past it to the next tier, to avoid double-counting.

- *Summary box adjacent to tree* — when the aggregate is a reference view not in the flow. No edges. Underlying nodes maintain their own flow edges independently.

Writing agents pick the mode based on whether the aggregate is structurally part of the chain or a sidebar reference.

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

### 3.10 Tree node pill composition (v5.1)

Each tree node renders with two stacked pills below the node name and country color dot. Every Node has explicit `descriptor_pill` and `quantity_pill` fields. Writing agents compose both; the frontend does not derive them from other fields.

**Pill 1 — `descriptor_pill`:** a 2-3 word categorical phrase describing what the node is structurally. Answers "what kind of facility is this?" Written in noun-phrase form.

Examples by layer:
- Deposit / Byproduct Source: "Coal deposit", "Zinc ore deposit", "Bauxite-producing region"
- Mine / Host Operation: "Bauxite mine", "Zinc-lead mine", "Coal mine"
- Primary Producer: "Alumina refinery", "Zinc smelter", "Gallium extraction facility"
- Refiner: "High-purity Ga refiner", "Specialty metals refiner", "MOCVD precursor maker"
- Substrate Manufacturer: "Compound semi wafers", "GaAs substrates", "InP substrates"
- Device Manufacturer: "GaN power chips", "IR optics maker", "LED producer"
- Project nodes: "Gallium project (planned)", "Critical minerals JV"
- Aggregate summary (reference box): "Aggregate supply view"
- Aggregate inline flow node (v5.2): pill 1 is the output quantity, pill 2 is the value at regional market price — e.g., "~15-30 t/yr refined" + "~$26-52M @ $1,750/kg"

**Pill 2 — `quantity_pill`:** the scale or output indicator. May include form/product when it carries information ("50 t GeCl₄/yr" beats "50 t/yr" because the reader learns the form). For entities without a clean unit output, use market share, revenue, or capacity.

Examples:
- Deposits: ">1,000 t Ge reserves", "~700 t Ga content"
- Mines: "~14M t/yr bauxite", "~36M t/yr bauxite"
- Primary Producer: "~590 t/yr Ga primary", "100 t/yr target 2028"
- Refiner: "~10-30 t/yr high-purity Ga", "50 t GeCl₄/yr", "~$391M FY25 revenue"
- Substrate Manufacturer: "~1.5M wafers/yr", "~$95M TTM revenue"
- Device Manufacturer: "~$45.9M FY25 revenue"
- Aggregate summary box: "~320 t/yr refined · ~600 t/yr primary"
- Aggregate inline flow node (v5.2): quantity_pill is the value at market price — e.g., "~$26-52M @ $1,750/kg" (for Western Refined Supply aggregate); descriptor_pill is repurposed to hold the output quantity instead of a categorical phrase

**Composition rules:**

1. **Descriptor is categorical, not specific.** "Coal deposit" (categorical) beats "Lincang coal deposit" (specific — the name is already on the node). "Alumina refinery" beats "Chinese bauxite refineries" for the same reason.

2. **Quantity prefers absolute over relative.** "~140 t/yr primary Ga" (absolute) beats "~23% of global primary" (relative) when absolute is known. Use relative only when absolute isn't disclosed or aggregated counts aren't meaningful.

3. **Quantity includes form when it carries information.** "50 t GeCl₄/yr" is better than "50 t/yr" — the reader learns both the scale and what's coming out. "~$95M TTM revenue" is better than "$95M" — the reader learns this is a revenue number, not output tonnage.

4. **Projected / targeted numbers use "target" suffix.** "100 t/yr target 2028" clearly differentiates from current output. Don't write "100 t/yr" for a facility producing zero.

5. **Aggregates can compress.** "~590 t/yr primary · 98% Chinese" is fine for a summary aggregate — two data points on one pill separated by middle dot.

6. **Aggregate inline flow nodes use quantity + value (v5.2).** When an aggregate renders as an inline tree node with edges (see Part 1 § 1.3 cross-cutting Aggregate), the two pill fields are repurposed semantically: `descriptor_pill` holds the output quantity (e.g., "~15-30 t/yr refined"), `quantity_pill` holds the value at regional market price with the pricing basis shown (e.g., "~$26-52M @ $1,750/kg"). This makes the tree's supply-flow story legible at a glance — readers see the output and the dollar value at each aggregate node.

7. **Regional pricing for value pills.** When an aggregate carries a value pill, use the price realized in the aggregate's region. Chinese aggregates use Chinese domestic pricing ($245/kg for gallium in April 2026). Western aggregates use western retail ($1,750-2,269/kg for gallium). Global aggregates use a blended realized value, not a notional "what if it all sold at western retail" number. Show the pricing basis in the pill itself (e.g., "@ $245/kg") so readers can see which convention is being used.

8. **Pills are under 40 characters each.** Longer strings truncate or overflow on narrow screens. If you're writing a sentence, shorten it.

**Common failure modes:**

- Using `layer` as the descriptor pill ("Byproduct Source" is a platform-internal term, not user-facing)
- Stating output without form when form is informative ("~50 t/yr" for a Ge-to-GeCl₄ converter hides what's actually being produced)
- Using "FY25" / "TTM" / "H1 2025" inconsistently — pick one time frame convention per chain and apply across all company nodes
- Writing the same thing twice across pills ("Alumina refinery" + "Alumina refinery in China" is redundant; the country dot already shows the country)
- Leaving pills empty for Aggregate summary boxes — even summary boxes have pills that describe what they summarize

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
- Meta block populated including `Framework version: v5.2`

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
- Aggregate nodes either (a) render inline with `feeds_from` / `feeds_into` edges that maintain bidirectional consistency with their constituents, or (b) render as summary boxes with no edges. QA verifies the mode chosen matches the aggregate's intent on the chain's tree.

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

### 6.4 Germanium migration checklist (v5.2)

**Page-level changes (v2.1 → v5.2):**

*Executive Summary:*
- Confirm Executive Summary is 135-230 words total (germanium is a good candidate for the shorter end of this range since it's a single-chokepoint story)
- Confirm bullet 2 (uses) leads with physical mechanism before application, keeps to 1-2 sentences
- Confirm bullet 6 (supply response) does not enumerate projects by name — readers find those in the tree
- Confirm closing thesis line reflects page scope (if page terminates at Refiner layer / Chemical Converter for GeCl₄, thesis should name primary producers and refiners, not downstream fiber manufacturers)
- Thesis line renders in bold as the final paragraph

*Supply Tree section:*
- Reorder subsections to v5.2 ordering: Key Takeaways card → Tree → How It's Made cards → Nodes pointer (was: How It's Made → Tree → Key Takeaway → Nodes in v5.1)
- Rewrite Key Takeaway as 4-point Key Takeaways list (plural heading, no "How to read this tree:" framing label, no bolded lead phrases)
- Wrap Key Takeaways in horizontal card container at full section width
- Verify How It's Made cards use the v5.2 five-zone structure (layer label / opening line / WHAT HAPPENS HERE / WHY IT'S HARD / bottom stat) — germanium is the reference implementation of this format, so should already be compliant

*Other sections:*
- Dependencies table: add "material @ $X/kg" to Est. value column if not present; confirm value convention is germanium-at-market-price
- So What teasers: rewrite as declarative headlines if currently fragment-style
- Where The Money Is: remove click-through hook second lines; regroup by layer; reorder full briefs to match
- Catalysts: collapse to date + event one-liners
- Meta: update framework version to v5.2

**Node schema migration (v5.2):**
- Extract each Supply Tree node's prose into a universal Node record
- Separate universal `about` from germanium-specific `relevance`
- Add `feeds_from` and `feeds_into` edges (v2.1 tree prose did not have these; infer from the tree visual)
- **Add `descriptor_pill` and `quantity_pill` to every node (v5.1)** — pattern-match against germanium's existing tree render where possible (e.g., Lincang: "Coal deposit" / ">1,000 t Ge reserves"; Umicore: "High-purity Ge refiner + GeCl₄ converter" / "~40-50 t/yr recycled Ge")
- **Consider adding aggregate inline flow nodes (v5.2)** — germanium's "Chinese Primary Supply" aggregate could render as an inline tree node with feeds_from/feeds_into edges (constituent refiners flow into it, it flows into a Global Supply aggregate). Decision: does germanium's story benefit from the aggregate flow visualization? Gallium used it because the China/West bifurcation is central. Germanium's story is different — single western chokepoint (Umicore) with the thesis less about bifurcation and more about Umicore specifically. Writing agent judgment call; inline aggregates are optional, not required.
- Apply v5 layer taxonomy: Lincang/Wulantuga/Yimin/Huize remain `Deposit` tier; zinc smelters become `Host Operation` tier; Umicore becomes `Refiner + Chemical Converter` (the GeCl₄ conversion is the Chemical Converter tier); 5N Plus becomes `Refiner`; fiber preform makers stay on the fiber chain (germanium page should terminate at Refiner + Chemical Converter, not extend to fiber manufacturers)
- For each WTMI brief: move the brief content onto its universal Node record
- Set `show_in_wtmi: true` and `show_on_tree: true` on germanium placement for nodes with briefs
- Set `show_on_tree: false` on geographic-reference-only nodes (e.g., minor zinc smelters in the germanium tree)
- Verify IDs follow Part 3 § 3.3 conventions
- Verify bidirectional edge consistency

**Page scope confirmation (v5.2):**
- Germanium is a raw material page — terminates at Refiner + Chemical Converter (Umicore's GeCl₄ output is the terminal node)
- Fiber preform manufacturers (Corning, Prysmian), IR optics makers, SiGe wafer makers do NOT belong on the germanium tree — they live on their own downstream chain pages
- Closing thesis line should not reference fiber manufacturers, IR optics makers, or SiGe wafer makers as investable surfaces on the germanium page
- Connected Inputs section on germanium should reference downstream chains: fiber optic cable, IR defense optics, satellite solar cells, SiGe semiconductors

**Estimated effort:** 2-3 writing-agent sessions + 1 QA session + 1 Claude Code integration session.

### 6.5 Fiber migration checklist (v5.2)

Fiber is a component chain (not a raw material chain), so its page structure differs from germanium and gallium in specific ways.

**Page-level changes (v2.1 → v5.2):**

*Executive Summary:*
- Confirm Executive Summary is 135-230 words total
- Confirm bullet 2 (uses) leads with physical mechanism (e.g., fiber's refractive index gradient and total internal reflection) before application
- Confirm closing thesis line reflects that fiber is a component chain — investable surface is at the device manufacturer tier (fiber cable manufacturers)

*Supply Tree section:*
- Apply v5.2 subsection ordering: Key Takeaways card → Tree → How It's Made cards → Nodes pointer
- Rewrite Key Takeaways as 4-point list in horizontal card container
- How It's Made cards follow v5.2 five-zone format; typical fiber layers would be: Refiner/Chemical Converter (GeCl₄ input) → Preform Manufacturer → Device Manufacturer (fiber cable) → optionally Assembly (fiber network deployment)
- Fiber's tree structure differs from raw material pages: upstream connections feed IN from GeCl₄ (germanium chain), Helium (helium chain), and Silica (silica chain), shown via Connected Inputs

*Layer taxonomy specific to fiber:*
- Preform manufacturers (Corning, Shin-Etsu, Sumitomo Electric internal ops, OFS Furukawa) sit on `Substrate Manufacturer` tier
- Fiber cable manufacturers (Corning, Prysmian, Fujikura, Furukawa, YOFC, ZTT, Hengtong) sit on `Device Manufacturer` tier
- Hollow-core fiber (Lumenisity/Microsoft, Heraeus, OFS) sits on a sub-tier of Device Manufacturer or a distinct "emerging technology" tier depending on how the page frames it — writing agent decides

*Other sections:*
- Same as germanium for Dependencies, So What, Risk, WTMI, Catalysts, Connected Inputs
- Meta: update framework version to v5.2

**Node schema migration (v5.2):**
- Same general migration as germanium
- Fiber page will share several universal nodes with germanium (Corning appears on both; Umicore appears indirectly via GeCl₄ feedstock reference but not as a tree node on fiber)
- **Must retrofit germanium first** — fiber needs germanium's universal Node records (Corning, Shin-Etsu, Sumitomo Electric etc.) to exist in v5.2 format before fiber can reference them

**Page scope confirmation (v5.2):**
- Fiber is a component/device chain — terminates at Device Manufacturer (fiber cable producers)
- Upstream inputs (GeCl₄, helium, silica) are referenced via Connected Inputs, not as tree nodes on the fiber page
- End-use applications (AI datacenter networks, telecom long-haul, data center interconnect) are referenced via Connected Inputs
- Closing thesis line should name fiber cable manufacturers and preform manufacturers as the investable surface

**Estimated effort:** 2-3 writing-agent sessions + 1 QA session + 1 Claude Code integration session. Should follow germanium retrofit, not parallelize with it (shared nodes).

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

### v5.1 → v5.2

**Section 2 (Supply Tree) subsection reorder:**
Key Takeaways moves above the tree; How It's Made cards move below the tree. New order: Key Takeaways card → Tree visualization → How It's Made cards → Nodes pointer. Reverses v5.1 ordering. Matches how institutional readers navigate these pages — thesis summary first, data second, process detail third.

**Key Takeaways format change:**
- Heading changes from "Key Takeaway" (singular) to "Key Takeaways" (plural)
- Reduced from 5 points to 4 points (the downstream-connection point in v5.1 is dropped; downstream chains are referenced via Connected Inputs section instead)
- "How to read this tree:" framing label removed as unnecessary noise
- Bolded lead phrases removed
- Style refined to **dictated narrative** (post-germanium-retrofit refinement): each takeaway is one declarative sentence stating one fact in plain language, written as if the supply story were being told out loud rather than as analytical bullet points. Em-dash fact/implication splits explicitly disallowed.
- Each takeaway maps to a specific tier of the chain's tree, walking top-to-bottom
- Rendered inside a horizontal card container at full section width — not naked page content

**How It's Made cards formalized five-zone structure:**
v5.1 described cards loosely as paragraph + "Why it's hard." v5.2 codifies the germanium-style five-zone format: layer label → one-line opening (no label) → WHAT HAPPENS HERE (labeled) → WHY IT'S HARD (labeled) → bottom stat (large bold number + muted descriptor). Matches the existing germanium card component and establishes it as the universal card format across all chain pages.

**Aggregate nodes can render inline with edges (Part 1, Part 3 § 3.4, Part 5 § 5.3):**
v5.1 required aggregates to render as "summary boxes adjacent to the tree" with no edges. v5.2 allows two modes: inline tree node with feeds_from/feeds_into edges (for aggregates that participate in the supply flow, like gallium's "Western Refined Supply" → "Global Supply") OR summary box with no edges (for reference views). Writing agents pick per aggregate.

**Pill composition rules updated for aggregate flow nodes (Part 3 § 3.10):**
When an aggregate renders as an inline flow node, the two pill fields are repurposed: `descriptor_pill` holds the output quantity (e.g., "~15-30 t/yr refined"), `quantity_pill` holds the value at regional market price (e.g., "~$26-52M @ $1,750/kg"). Regional pricing convention: Chinese aggregates use Chinese domestic pricing, Western aggregates use western retail, Global aggregates use blended realized value. Pricing basis shown in the pill itself ("@ $X/kg").

**Executive Summary length guidance (Section 1):**
v5.2 adds explicit targets: 135-230 words total. Germanium-style (single chokepoint) achievable at 135 words; gallium-style (bifurcated supply + multiple projects) floors around 200-230 words. Over 250 words indicates bullet bloat (usually bullet 2, uses). Bullet 2 specifically capped at 1-2 sentences.

**Executive Summary thesis line scope rule (Section 1):**
Closing thesis line must match page scope. If page terminates at Refiner layer, thesis cannot reference substrate or device makers as investable — those live on downstream chain pages.

**Executive Summary structure change — 7 bullets to 6 bullets + thesis line:**
The v4/v5 template counted the thesis as bullet 7. v5.2 restructures as 6 bullets + a separate bolded closing paragraph. This reflects how the thesis actually renders (distinct from the bullets) and makes the bullet-length guidance cleaner to specify.

**Retrofit checklists expanded for v5.2 (§ 6.4, § 6.5):**
Germanium and fiber retrofit checklists now include Executive Summary length audit, Section 2 subsection reorder, Key Takeaways card format, v5.2 pill patterns for any aggregate flow nodes added, page scope confirmation per archetype (raw material vs component chain), and closing thesis scope verification.

### v5 → v5.1

**Tree node pill fields added to Node schema:**
- `descriptor_pill` — 2-3 word categorical phrase (e.g., "Coal deposit", "Alumina refinery", "GaN device maker")
- `quantity_pill` — scale / output indicator, may include form (e.g., "~140 t/yr primary Ga", "50 t GeCl₄/yr", "~$95M TTM revenue")

These fields are explicit on every Node rather than composed by the frontend from `output_headline` / `layer` / other fields. Writing agents compose both pills according to the rules in Part 3 § 3.10. This standardizes tree-node rendering across chains and ensures consistency with the germanium-style supply tree visual pattern.

**Page scope guidance added (§ 1.4):**
Raw material pages generally terminate at the Refiner tier. Intermediate material pages exist when the intermediate tier feeds multiple distinct downstream component chains. Component / device pages terminate at Device Manufacturer. Not a hard rule — writing agents use judgment. This addition reflects the architectural decision that gallium's substrate manufacturing layer (AXT) and device manufacturing layer (Navitas) belong on their own downstream chain pages rather than on the gallium raw material page.

**Page structure reorganized from 12 sections to 11:**
How It's Made is no longer a standalone top-level section. It becomes a subsection of Supply Tree, rendered as per-layer cards titled by layer name (not verb phrases in caps). The new Supply Tree section contains, in order: How It's Made layer cards → tree visualization → Key Takeaway → Nodes pointer.

**Key Takeaway format changed to 5-point structural walkthrough:**
The single-paragraph ~60-80 word Key Takeaway from v4 is replaced by a numbered 5-point list with a "How to read this tree" framing label. The 5 points thread through the tree layers from upstream to downstream, making synthesis more accessible to readers who scanned the tree visually.

**Section numbering updated:**
Section 1 (Executive Summary), Section 2 (Supply Tree with How It's Made as subsection), Section 3 (Dependencies), Section 4 (Supply → Demand), Section 5 (So What), Section 6 (Risk), Section 7 (Where The Money Is), Section 8 (Catalysts), Section 9 (Connected Inputs), Section 10 (Sources), Section 11 (Meta).

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

*Stillpoint Intelligence · Master Framework v5.2 · April 2026*
