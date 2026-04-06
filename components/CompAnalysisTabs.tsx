"use client";

import React, { useState, useRef, useEffect } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
const SYS: React.CSSProperties = { fontFamily: "Inter, -apple-system, system-ui, sans-serif" };

/* ─── Tab identifiers ─── */
type TabId = "supply-demand" | "bottlenecks" | "geopolitical" | "catalysts" | "emerging-tech" | "investment-ideas";

const TABS: { id: TabId; label: string; gold?: boolean }[] = [
  { id: "supply-demand", label: "SUPPLY / DEMAND" },
  { id: "bottlenecks", label: "BOTTLENECKS" },
  { id: "geopolitical", label: "GEOPOLITICAL" },
  { id: "catalysts", label: "CATALYSTS" },
  { id: "emerging-tech", label: "EMERGING TECH" },
  { id: "investment-ideas", label: "INVESTMENT IDEAS", gold: true },
];

/* ─── Content types ─── */
interface Section {
  title: string;
  paragraphs: string[];
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TabContent {
  takeaway: string;
  sections: Section[];
  tables?: { afterSection: number; data: TableData }[];
  footnote?: string;
  callout?: string;
}

/* ─── Tab 1: Supply / Demand ─── */
const supplyDemand: TabContent = {
  takeaway:
    "A chemical compound most investors have never heard of sits between germanium and every fiber strand on earth",
  sections: [
    {
      title: "Overview",
      paragraphs: [
        "87 tonnes of germanium enters this layer annually. After conversion losses, purification losses, and deposition losses, roughly 23\u201334 tonnes ends up embedded in fiber \u2014 the rest is captured and recycled through a single company. The entire western supply of the chemical that enables fiber optics flows through one facility in Belgium, fewer than 20 companies can turn it into preforms, and every one of them is running at full capacity. This layer doesn\u2019t just transmit the germanium shortage downstream \u2014 it amplifies it.",
      ],
    },
    {
      title: "What GeCl\u2084 is and why it matters",
      paragraphs: [
        "About 35\u201344% of the world\u2019s refined germanium \u2014 roughly 87 tonnes per year \u2014 is allocated to fiber optic production. The rest goes to IR optics, solar cells, semiconductors, and other applications.",
        "But germanium can\u2019t go directly into fiber. Refined germanium arrives as metal ingots or germanium dioxide powder \u2014 solid materials. Fiber manufacturing works with gases. The germanium must first be converted into germanium tetrachloride (GeCl\u2084) \u2014 a volatile liquid that can be vaporized and precisely metered into glass deposition systems.",
        "GeCl\u2084 is what makes fiber optic cable work. It controls how light travels through the glass. Without it, fiber is just a strand of silica. With it, the fiber carries the internet. **There is no substitute for standard single-mode fiber** \u2014 the type that carries 99%+ of the world\u2019s data today.",
        "This component layer has two stages: the suppliers who convert germanium into ultra-pure GeCl\u2084, and the manufacturers who use that GeCl\u2084 to make fiber preforms and draw them into fiber strands.",
      ],
    },
    {
      title: "Layer 1 \u2014 GeCl\u2084 suppliers",
      paragraphs: [
        "**What they do:** These facilities take refined GeO\u2082 powder, dissolve it in acid to produce crude GeCl\u2084 liquid, then distill it repeatedly in quartz towers until it reaches 99.9999% purity (6N+). This extreme purity is non-negotiable \u2014 a single part-per-billion of the wrong impurity can ruin fiber performance.",
        "**Why so few can do it:** The purification process requires specialized quartz distillation towers, proprietary temperature control techniques, and decades of accumulated process knowledge. The hardest technical challenge is removing arsenic, which behaves chemically similar to germanium and doesn\u2019t separate easily during distillation. There\u2019s no way to buy this capability off the shelf \u2014 new entrants need years of process development even after building the physical plant.",
        "**How much is lost:** The chlorination and purification process loses approximately 35% of the germanium input. Of the ~87 tonnes of germanium allocated to fiber annually, roughly 57 tonnes worth of GeCl\u2084 emerges from this stage. The remaining ~30 tonnes is lost in chemical byproducts, waste fractions, and discarded distillation cuts \u2014 though much of this waste is recoverable through recycling.",
        "**Who does it:** Fewer than six facilities globally produce fiber-grade GeCl\u2084. **Umicore** (Olen, Belgium) is the sole western supplier at scale. Chinese producers include **Yunnan Chihong** (30t/yr dedicated GeCl\u2084 line), **Nanjing Germanium**, and **GRINM**. Russia\u2019s JSC Germanium is sanctioned. 5N Plus in Canada is expanding under DoD funding but doesn\u2019t yet produce GeCl\u2084 at meaningful volume.",
        "**Output:** Approximately 57 tonnes of germanium equivalent reaches fiber manufacturers as ultra-pure GeCl\u2084 annually (~168 tonnes in GeCl\u2084 weight terms). The GeCl\u2084 market for fiber optics is estimated at $92M\u2013$500M annually depending on the source \u2014 a wide range reflecting how opaque this market is.",
      ],
    },
    {
      title: "Layer 2 \u2014 Fiber preform manufacturers",
      paragraphs: [
        "**What they do:** These companies turn ultra-pure GeCl\u2084 into the glass rods (preforms) that become fiber strands. GeCl\u2084 arrives as a liquid. It\u2019s vaporized and fed as a gas into a hollow glass tube spinning on a lathe. A flame moves along the outside of the tube, heating it to about 2,000\u00b0C. Where the heat hits, the gas inside reacts and deposits a thin layer of germanium-doped glass on the inner wall. The flame passes back and forth dozens or hundreds of times, building up layers. Then the heat cranks up further and the hollow tube collapses into a solid glass rod \u2014 that\u2019s the preform.",
        "The preform then goes into the top of a tall vertical furnace called a draw tower. The bottom tip melts and a thin strand of glass drops downward \u2014 that strand is the fiber, about 125 micrometers wide (thinner than a human hair). As the strand pulls down at 10\u201320 meters per second, the preform slowly feeds in from the top and gets consumed. The entire preform stretches into a continuous fiber strand because the cross-section shrinks by roughly 1,000x, extending the length proportionally. All the internal structure \u2014 the germanium-doped core, the cladding around it \u2014 scales down perfectly.",
        "**Why there are more players but capacity is still tight:** About 20 companies globally make preforms, compared to fewer than 6 for GeCl\u2084. The reason is that preform manufacturing uses established equipment platforms that can be purchased. But the equipment comes from a very concentrated supplier base \u2014 **Rosendahl Nextrom** in Austria dominates with hundreds of systems in 73+ countries. When every manufacturer tries to expand at once, equipment delivery backlogs stack up. A new preform line takes 18\u201324 months minimum from order to first production.",
        "**How much is lost:** In the most common deposition process (MCVD), only 40\u201360% of the GeCl\u2084 gas actually deposits into the glass. The rest flows through and out the other end. Of the ~57 tonnes of germanium equivalent entering this stage, only 23\u201334 tonnes ends up embedded in fiber. Manufacturers capture over 95% of the waste and send it back upstream \u2014 mostly to Umicore \u2014 for recycling. About 20% of germanium at advanced facilities comes from reclaimed preform waste. **Over half of Umicore\u2019s germanium input comes from their customers\u2019 waste.**",
        "**Who does it:** The top three \u2014 **YOFC** (3,500 tonnes/year preform capacity, the world\u2019s largest), **Corning**, and **Prysmian** \u2014 control over 40% of global capacity. The preform market was valued at roughly $2.9 billion in 2024. Global fiber strand output exceeds 1 billion fiber-km per year, with China producing about 60%.",
        "**Why they can\u2019t scale faster:** Every manufacturer is running at 95\u2013100% utilization. Corning is building a $170\u2013268M expansion in Hickory, NC. Shin-Etsu is investing \u00a518B in preform expansion. But these take years. And every new preform line increases demand for GeCl\u2084, which increases demand for germanium. **Expanding at this layer tightens the layer above it.**",
      ],
    },
    {
      title: "Germanium-to-fiber conversion model",
      paragraphs: [
        "Based on USGS germanium allocation (~87 tonnes/year to fiber) and global fiber strand production (~1 billion fiber-km/year), both 2024\u20132025 data:",
      ],
    },
    {
      title: "",
      paragraphs: [
        "Each kilometer of fiber strand requires approximately 0.09 grams of germanium input \u2014 of which roughly a third ends up embedded in the glass and most of the rest is captured and recycled.",
        "**The demand projection:** If annual fiber deployment doubles to 1.3\u20131.4 billion fiber-km by 2030, germanium input for fiber alone would need ~120\u2013130 tonnes \u2014 over half of total global production, up from 35\u201344% today.",
      ],
    },
    {
      title: "Core constraints",
      paragraphs: [
        "**The facility constraint.** Fewer than six facilities on earth can produce 6N+ GeCl\u2084. Only one serves the west at scale. Building new capacity takes 3\u20135 years and requires process knowledge that can\u2019t be purchased.",
        "**The recycling monopoly.** Over 50% of germanium flowing through this layer is waste sent to Umicore for reprocessing. They are simultaneously the primary supplier and the sole recycler at scale. If their recycling capacity is constrained, the entire loop tightens. The dependency is circular with no alternative.",
        "**The yield cascade.** From germanium entering this layer to germanium embedded in fiber: roughly 25\u201340% survives. The loss rate is dictated by physics unchanged since 1974.",
        "**The input competition.** Only 35\u201344% of global germanium goes to fiber. IR optics, solar, semiconductors, and defense compete for the same 220-tonne pool.",
        "**The scaling timeline.** New GeCl\u2084 capacity: 3\u20135 years. New preform lines: 18\u201324 months. Neither can respond quickly to surges. And expanding downstream tightens supply upstream.",
      ],
    },
  ],
  tables: [
    {
      afterSection: 4,
      data: {
        headers: ["Stage", "Input", "Loss", "Output", "Per fiber-km"],
        rows: [
          ["Germanium allocated to fiber", "87t/yr", "\u2014", "87t Ge", "0.087g Ge"],
          ["Chlorination & purification", "87t Ge", "~35%", "~57t Ge as GeCl\u2084 (~168t GeCl\u2084)", "0.057g Ge"],
          ["Deposition into preform", "~57t Ge", "40\u201360%", "~23\u201334t Ge embedded", "0.023\u20130.034g Ge"],
          ["Recycling recovery", "~53\u201364t lost", ">95% captured", "~50\u201361t returned to Umicore", "\u2014"],
          ["Net permanently lost", "\u2014", "\u2014", "~3\u20135t/yr", "~0.003\u20130.005g Ge"],
        ],
      },
    },
  ],
  footnote:
    "Sources: USGS Mineral Commodity Summaries 2024\u20132025; Umicore Germanium Solutions; IEEE Xplore \u2014 Germanium Chemistry in MCVD; Grand View Research \u2014 Fiber Optic Preform Market; Amanda Van Dyke \u2014 The Germanium Chokepoint; Rosendahl Nextrom.",
};

/* ─── Tab 2: Bottlenecks ─── */
const bottlenecks: TabContent = {
  takeaway:
    "The component layer has five chokepoints \u2014 and three of them run through the same company",
  sections: [
    {
      title: "Bottleneck 01 \u2014 Umicore: sole western GeCl\u2084 producer",
      paragraphs: [
        "**Severity: 95% \u2014 Critical** | Olen, Belgium \u00b7 ~35% global GeCl\u2084 share \u00b7 >50% from recycled feed",
        "Every western fiber preform manufacturer \u2014 Corning, Prysmian, Sumitomo, Fujikura \u2014 sources ultrapure GeCl\u2084 from Umicore. Their Olen facility is the only non-Chinese, non-Russian operation producing 6N+ purity GeCl\u2084 at volumes sufficient to supply the western fiber industry. If Olen experiences any disruption, there is no western alternative at comparable scale or purity. The next-largest non-Chinese producer (5N Plus in Canada) has meaningful output not expected before 2027\u20132028.",
      ],
    },
    {
      title: "Bottleneck 02 \u2014 Rosendahl Nextrom: preform equipment near-monopoly",
      paragraphs: [
        "**Severity: 80% \u2014 High** | Austria (KNILL Gruppe) \u00b7 Hundreds of MCVD units since 1990 \u00b7 Projects in 73+ countries",
        "The OFC 12 MCVD system is described as \u201cthe most widely used MCVD system in the industry.\u201d A surge in simultaneous expansion orders (which the current demand environment is producing) creates equipment delivery backlogs that extend capacity ramps beyond the inherent process timeline. Privately held \u2014 the bottleneck is invisible until it manifests as delayed expansions at Corning or Prysmian.",
      ],
    },
    {
      title: "Bottleneck 03 \u2014 6N+ purification: arsenic removal as binding constraint",
      paragraphs: [
        "**Severity: 75% \u2014 High** | ~5\u20136 facilities globally \u00b7 Multi-stage quartz distillation \u00b7 Arsenic co-distillation problem",
        "AsCl\u2083 boils at 130\u00b0C vs. GeCl\u2084 at 83.1\u00b0C \u2014 close enough to require specialized extraction with quartz stills and repeated fractional distillation. Only ~5\u20136 facilities globally can produce 6N+ GeCl\u2084. Of these, only Umicore is accessible to western fiber manufacturers. Even if more raw germanium became available tomorrow, converting it to fiber-grade GeCl\u2084 would take years of facility construction.",
      ],
    },
    {
      title: "Bottleneck 04 \u2014 Preform manufacturing concentration: top 3 control >40%",
      paragraphs: [
        "**Severity: 70% \u2014 High** | YOFC (3,500 t/a) \u00b7 Corning \u00b7 Prysmian \u00b7 18\u201324 month expansion cycle",
        "All preform lines globally are running at 95\u2013100% utilization. The 18\u201324 month expansion timeline is irreducible \u2014 it reflects the physics of commissioning MCVD/OVD/VAD systems. Every new preform line commissioned increases GeCl\u2084 demand: the preform bottleneck and GeCl\u2084 bottleneck are coupled, creating a feedback loop where capacity relief at one layer immediately becomes demand pressure at the other.",
      ],
    },
    {
      title: "Bottleneck 05 \u2014 Military demand priority: high-purity preforms redirected",
      paragraphs: [
        "**Severity: 60% \u2014 Medium** | G.657A1 at $22/km \u00b7 G.657A2 at $35/km \u00b7 Military orders given priority allocation",
        "Fiber-guided munitions (FPV drones consuming 10\u201340 km of single-mode fiber per flight) have created a new demand category pulling from the same preform pool as commercial fiber. Russia\u2019s fiber procurement alone jumped from <1% to 10.5% of global fiber demand in 2025. Defense procurement operates outside commercial supply-demand equilibrium \u2014 it is not price-sensitive.",
      ],
    },
  ],
  callout:
    "Umicore is the sole western GeCl\u2084 producer (Bottleneck #1), AND depends on preform manufacturers\u2019 scrap for recycled feed (coupled to #4), AND supplies GeCl\u2084 to the same manufacturers whose military-priority production reduces Umicore\u2019s recycling feedstock (#5). **A single company sits at the intersection of three of the five identified bottlenecks.**",
  footnote:
    "Sources: Umicore Germanium Solutions, Rosendahl Nextrom Product Documentation, Credence Research Optical Fiber Preform Equipment Market, Grand View Research Fiber Optic Preform Market Share, Commmesh 2026 Fiber Price Analysis.",
};

/* ─── Tab 3: Geopolitical ─── */
const geopolitical: TabContent = {
  takeaway:
    "The export controls were designed for the component layer \u2014 GeO\u2082 and GeCl\u2084 were named specifically, not caught incidentally",
  sections: [
    {
      title: "The six controlled items",
      paragraphs: [
        "When MOFCOM announced export controls in July 2023, **six specific germanium products were individually enumerated** \u2014 and GeO\u2082 and GeCl\u2084 were both explicitly named. This was not an oversight. China designed the controls to target the component layer directly, recognizing that controlling chemical intermediates is more strategically effective than controlling the metal alone.",
        "The controlled items: (1) Metal germanium, (2) Zone-melted germanium ingots, (3) Phosphorus germanium zinc (GeZnP), (4) Germanium epitaxial growth substrates, (5) Germanium dioxide (GeO\u2082) \u2014 HS 2825.60, (6) Germanium tetrachloride (GeCl\u2084) \u2014 dual-use export control.",
        "GeO\u2082 and GeCl\u2084 are classified under separate HS codes from germanium metal. A company importing germanium metal and converting it to GeCl\u2084 domestically does not bypass the controls \u2014 **the finished compound is itself a controlled item requiring a separate MOFCOM license for export.**",
      ],
    },
    {
      title: "Component-level impact is more severe than raw material controls",
      paragraphs: [
        "**01 \u2014 GeCl\u2084 has fewer substitution pathways than germanium metal.** Raw germanium has multiple end uses (IR optics, solar, electronics, fiber). GeCl\u2084 is purpose-built for fiber preform manufacturing. Controlling GeCl\u2084 directly targets the fiber optic supply chain with surgical precision.",
        "**02 \u2014 Licensing approval is slower for dual-use chemicals.** GeCl\u2084 is classified as a dual-use chemical compound, requiring end-user documentation and intended-use verification from MOFCOM. Each application is reviewed independently. The licensing process introduces unpredictable 4\u20138 week delays that prevent reliable supply planning for preform manufacturers operating on 18\u201324 month production horizons.",
        "**03 \u2014 Third-country routing is harder for processed chemicals.** Chinese germanium exports to Belgium increased ~224% in 2024 relative to 2022, suggesting third-country routing of germanium metal. But GeCl\u2084 re-export is technically riskier: the compound carries specific chemical identification that can be traced to its origin, and the licensing system requires end-use documentation that creates paper trails.",
      ],
    },
    {
      title: "China\u2019s domestic GeCl\u2084 producers",
      paragraphs: [
        "**Yunnan Chihong Zinc & Germanium (600497)** \u2014 State-owned subsidiary of Chinalco. Produced 65.9t of germanium products in 2023, operates a dedicated 30t/yr GeCl\u2084 production line for optical fiber applications. This single production line represents a meaningful fraction of global ultrapure GeCl\u2084 supply.",
        "**China Germanium (Nanjing)** \u2014 Located in Nanjing Lishui Economic Development Zone. 25t/yr germanium ingot capacity, 15t/yr GeO\u2082. Produces GeCl\u2084 for fiber optic and infrared applications. Export-dependent company now subject to mandatory MOFCOM licensing.",
        "**GRINM / Vital Materials** \u2014 State-linked germanium processor serving domestic supply chain. Capacity undisclosed.",
        "Chinese fiber manufacturers (YOFC, Hengtong, FiberHome) access GeCl\u2084 from these domestic producers through a parallel supply chain that is **completely insulated from export controls.**",
      ],
    },
    {
      title: "Impact on western fiber manufacturers",
      paragraphs: [
        "**Supply disruption:** Companies using Chinese-sourced GeCl\u2084 face unpredictable licensing approval timelines. MOFCOM reviews each application independently, creating planning uncertainty incompatible with the 18\u201324 month preform production cycles that fiber manufacturers operate on.",
        "**Cost premium:** Secondary sourcing from Umicore (the only non-Chinese option at scale) adds 15\u201325% cost premiums relative to pre-control Chinese pricing. Germanium metal prices climbed 200% from January 2024 to February 2026, and GeCl\u2084 pricing followed.",
        "**Contractual lock-in:** Prysmian\u2019s 2025 renewal of its Umicore supply agreement signals that western manufacturers see no near-term alternative to single-source dependency. They are contractually codifying the bottleneck rather than diversifying away from it.",
        "**YOFC\u2019s structural advantage:** Chinese fiber manufacturers source GeCl\u2084 domestically \u2014 completely insulated from the very restrictions they impose on western competitors. This is not a temporary trade disruption \u2014 it is a permanent structural cost and availability advantage.",
      ],
    },
    {
      title: "The November 2025 suspension",
      paragraphs: [
        "Following a Trump-Xi meeting in Busan, MOFCOM suspended the full US export ban (Announcement No. 46, December 2024) effective November 9, 2025. The suspension runs until **November 27, 2026**. The global dual-use export licensing requirement (August 2023) remains in full force regardless. Military end-user restrictions remain fully in effect. MOFCOM retains discretion to grant or deny individual export licenses.",
        "The suspension provides partial relief for civilian fiber manufacturers but does not eliminate the licensing bottleneck. Every GeCl\u2084 shipment still requires MOFCOM approval with end-use documentation. **The control architecture remains intact, and China retains the ability to reimpose the full ban after November 27, 2026 with a single announcement.**",
      ],
    },
    {
      title: "Enforcement escalation",
      paragraphs: [
        "**May 2025:** China launched a coordinated interagency crackdown on transshipment and smuggling involving 10+ central ministries. Belgium and other conduit countries were explicitly targeted in enforcement messaging.",
        "**Long-arm jurisdiction:** The December 2024 ban invoked \u201clong-arm jurisdiction\u201d provisions \u2014 any organization globally violating the rules faces legal consequences. This is designed to prevent third-country processors from re-exporting Chinese-origin GeCl\u2084 to US end users.",
      ],
    },
  ],
  callout:
    "China designed the controls specifically to include GeO\u2082 and GeCl\u2084 as named items, controls them under stricter dual-use chemical licensing than raw metal, and Chinese fiber manufacturers operate in a parallel supply chain immune to the restrictions they impose on western competitors. **The November 2025 suspension is a diplomatic gesture, not a structural resolution.**",
  footnote:
    "Sources: MOFCOM Regular Press Conference July 6, 2023; IEA Policy Database \u2014 China Germanium/Gallium Export Controls; USGS Mineral Commodity Summaries 2024 and 2025; Stimson Center \u2014 China\u2019s Germanium and Gallium Export Restrictions (2025); CNBC \u2014 China Suspends Ban on Exports of Gallium, Germanium, Antimony to US (November 9, 2025); Fastmarkets Germanium Pricing Data; Winston & Strawn Global Trade Analysis; Light Reading \u2014 \u2018Perfect Storm\u2019 in Fiber Supply (2025); Cabling Installation & Maintenance \u2014 Prysmian-Umicore Partnership (2025).",
};

/* ─── Tab 4: Catalysts ─── */
const catalysts: TabContent = {
  takeaway:
    "Five tightening forces converge on GeCl\u2084 supply before any easing catalyst can reach market scale",
  sections: [
    {
      title: "Tightening catalysts",
      paragraphs: [
        "**China export ban suspension expires: Nov 27, 2026** \u2014 Binary event for GeCl\u2084 supply. MOFCOM can reimpose the full ban with a single announcement \u2014 no legislative process, no warning period. The broader global licensing requirement (August 2023) remains in force regardless. Markets will begin pricing this risk 3\u20136 months in advance. The May\u2013August 2026 window is when germanium and fiber pricing will reflect probability-weighted ban reimposition.",
        "**Hyperscaler AI capex drives GeCl\u2084 to structural limits** \u2014 36x fiber multiplier per AI datacenter rack. AI-focused datacenters require approximately 36 times more fiber than traditional CPU-based racks. Five hyperscalers will spend $660\u2013690B on infrastructure in 2026: Amazon ($200B), Google ($175\u2013185B), Microsoft (~$120B), Meta ($115\u2013135B), Oracle ($50B). Every dollar of AI infrastructure spend generates downstream fiber demand \u2192 more cable \u2192 more preforms \u2192 more GeCl\u2084 \u2192 more germanium.",
        "**BEAD program fiber deployment begins** \u2014 $42.45B federal broadband pulling from same GeCl\u2084 pool. 53 states and territories have received NTIA approval; peak construction runs 2026\u20132030. BEAD deployments drive sustained demand for standard G.652.D fiber, competing directly with AI infrastructure for limited preform capacity. The US government is simultaneously connecting rural homes and building AI infrastructure \u2014 from a supply chain already sold out through 2026.",
        "**New preform capacity commitments increase GeCl\u2084 demand** \u2014 Every new preform line is a new GeCl\u2084 consumer. Corning\u2019s Hickory, NC expansion ($170\u2013268M, announced October 2025) creates the world\u2019s largest fiber-optic cable plant. Shin-Etsu announced \u00a518B capital investment for preform expansion. Each new preform line commissioned increases demand for GeCl\u2084. Capacity expansion at the preform layer is demand expansion at the GeCl\u2084 layer.",
      ],
    },
    {
      title: "Key dates",
      paragraphs: [],
    },
    {
      title: "Easing catalysts",
      paragraphs: [
        "**Umicore EU-backed capacity expansion** \u2014 2026\u20132028, incremental, not transformative. The European Commission selected two Umicore germanium projects in February 2026: (a) process innovation to increase germanium recovery yields, and (b) new recycling technologies for complex waste streams. EU support includes streamlined permitting and dedicated finance access. These are process improvement projects, not new greenfield capacity. Incremental yield gains of 5\u201315% are meaningful but do not resolve the structural supply-demand gap.",
        "**5N Plus DoD-funded expansion** \u2014 Meaningful output 2027\u20132029, up to 20t/yr at full scale. DoD awarded 5N Plus $18.1M in DPA Title III funds (December 2025) for St. George, Utah facility expansion. Target: up to 20 metric tonnes of high-purity germanium per year from industrial residues over 48 months. Very little revenue impact in 2026; benefits beginning in 2027 but more meaningful in 2028\u20132029 due to installation and ramp timelines.",
        "**DRC germanium reaching conversion stage** \u2014 2025\u20132028, concentrates flowing to Umicore for refining. G\u00e9camines subsidiary STL began exporting germanium concentrates from Lubumbashi in October 2024 to Umicore for processing. DRC\u2019s hydrometallurgical plant should enable DRC to supply up to 30% of world\u2019s germanium demand at full scale. But conversion to GeCl\u2084 happens at Umicore in Belgium \u2014 DRC adds raw feed but does not add GeCl\u2084 conversion capacity. The DRC story eases the germanium metal bottleneck but reinforces the Umicore component-layer bottleneck.",
        "**Hollow-core fiber commercialization** \u2014 Niche deployments 2026, meaningful market share 2028\u20132030. Microsoft achieved 1,280 km deployed HCF with zero field failures (0.091 dB/km loss), targeting 15,000 km by late 2026. YOFC achieved world-record 0.040 dB/km attenuation. HCF uses air rather than germanium-doped glass, eliminating germanium from the fiber layer. But near-term impact is limited \u2014 HCF deployments in 2026\u20132027 remain niche (~20,000 km total vs. billions km global installed base).",
        "**Non-Chinese recycling and refining capacity** \u2014 2026\u20132027, combined ~55t/yr vs. 170t needed to replace China. Germany\u2019s Stade refinery plans to restart by 2027, adding 40t/yr. Kazakhstan\u2019s Padvolar refinery targets 15t/yr from H2 2026. Combined with existing western recyclers, this adds meaningful but insufficient volume to close the supply gap.",
      ],
    },
  ],
  tables: [
    {
      afterSection: 1,
      data: {
        headers: ["Date", "Event", "GeCl\u2084 impact"],
        rows: [
          ["H1 2026", "BEAD groundbreakings; Corning Hickory expansion", "Fiber demand spike; GeCl\u2084 demand increases"],
          ["Nov 27, 2026", "China ban suspension expires", "Binary risk event for GeCl\u2084 availability"],
          ["2027", "Stade restart (40t/yr); 5N Plus ramping", "Incremental non-Chinese supply (~55t combined)"],
          ["2028\u20132029", "5N Plus at scale; DRC contributing to Umicore", "More meaningful supply relief"],
        ],
      },
    },
  ],
  callout:
    "The tightening catalysts hit in 2026. The easing catalysts arrive in 2027\u20132029. **The gap between demand acceleration and supply response is 12\u201324 months \u2014 and it is during this window that GeCl\u2084 availability will determine which fiber manufacturers can produce and which cannot.**",
  footnote:
    "Sources: MOFCOM Export Ban Suspension Announcement November 2025; Fastmarkets Germanium Pricing; CNBC \u2014 China Suspends Ban (November 9, 2025); IEEE ComSoc Technology Blog \u2014 Fiber Demand 2026; MIT Technology Review \u2014 Hyperscale AI Data Centers 2026; NTIA BEAD Progress Dashboard; Corning News Release \u2014 Hickory Expansion; Umicore Newsroom \u2014 EU Project Selection February 2026; Umicore Full Year Results 2025; 5N Plus Q4 Earnings Call 2025; Semiconductor Today \u2014 5N Plus DPA Award; G\u00e9camines Press Release October 2024; Tom\u2019s Hardware \u2014 Microsoft HCF Deployment; Data Center Dynamics \u2014 Relativity-Prysmian Partnership.",
};

/* ─── Tab 5: Emerging Tech ─── */
const emergingTech: TabContent = {
  takeaway:
    "Four technology vectors could reshape the component layer, but none reaches meaningful scale before the supply crisis peaks",
  sections: [
    {
      title: "Vector 01 \u2014 Replace it: hollow-core fiber",
      paragraphs: [
        "Commercial deployments begun \u00b7 Meaningful market share 2028\u20132030 \u00b7 Ge-bear",
        "Hollow-core fiber (HCF) is the only technology that eliminates germanium from the supply chain entirely \u2014 light travels through air rather than germanium-doped glass. Microsoft deployed 1,280 km across Azure with zero field failures (0.091 dB/km loss), targeting 15,000 km by late 2026. YOFC achieved a world-record 0.040 dB/km in lab conditions and 91.2 km single preform drawing. But total HCF deployment by end 2026 will be approximately 20,000 km against billions km of global installed base. HCF is the structural bear case for germanium demand \u2014 but it arrives after the supply crisis peaks.",
      ],
    },
    {
      title: "Vector 02 \u2014 Use less: advanced deposition efficiency",
      paragraphs: [
        "PCVD technology available \u00b7 Incremental adoption underway \u00b7 Neutral",
        "MCVD (most widely deployed) achieves 40\u201360% GeCl\u2084-to-GeO\u2082 conversion efficiency. PCVD approaches 100% deposition efficiency through plasma-assisted heterogeneous deposition. Switching from MCVD to PCVD approximately doubles germanium utilization efficiency \u2014 but MCVD remains the dominant installed base globally, and equipment replacement cycles are measured in decades. Efficiency improvements slow the rate of demand growth; they do not reverse it.",
      ],
    },
    {
      title: "Vector 03 \u2014 Substitute the dopant: fluorine and phosphorus",
      paragraphs: [
        "Niche applications only \u00b7 Not viable for standard telecom fiber \u00b7 Neutral",
        "Fluorine doping creates depressed refractive index (suitable for cladding only, not core). Phosphorus serves Raman applications but is unsuitable for standard telecom core doping. The fundamental refractive index requirement for conventional fiber makes germanium extremely difficult to displace broadly. Total alternative dopant displacement: <10% of germanium consumption in telecoms by 2030.",
      ],
    },
    {
      title: "Vector 04 \u2014 Co-packaged optics: does NOT reduce fiber demand",
      paragraphs: [
        "CPO market $470M \u2192 $603M (2025\u21922026, CAGR 29.7%) \u00b7 Net effect: increases germanium demand \u00b7 Ge-bull",
        "CPO enables higher bandwidth density within datacenters but does not reduce total fiber consumption. AI datacenter buildout demands vastly exceed fiber supply regardless of transceiver technology. CPO actually accelerates fiber deployment by improving datacenter economics. Expected net germanium demand growth from CPO deployment: +8\u201312% through 2030. The technology that appears to reduce fiber-per-link increases total fiber deployed by making more datacenters economically viable.",
      ],
    },
  ],
  callout:
    "**The technologies that could save the supply chain don\u2019t arrive in time to prevent the shortage. The technologies that arrive in time don\u2019t save enough supply to matter.**",
  footnote:
    "Sources: YOFC Hollow-Core Fiber Press Releases; Microsoft Blog \u2014 Lumenisity Acquisition; Data Center Dynamics \u2014 Microsoft HCF Deployment; IEEE Xplore \u2014 Germanium Recovery from Optical Fiber Manufacturing; Grand View Research \u2014 Silicon Photonics Market.",
};

/* ─── Tab 6: Investment Ideas ─── */
const investmentIdeas: TabContent = {
  takeaway:
    "Four positions across the GeCl\u2084 supply chain \u2014 from monopoly pricing to germanium obsolescence",
  sections: [
    {
      title: "Umicore \u2014 The mispriced monopoly",
      paragraphs: [
        "**XBRU: UMI** \u00b7 \u20ac3.9B market cap \u00b7 \u20ac558M FY25 Specialty Materials Rev \u00b7 \u20ac108M FY25 SM EBITDA (+11%) \u00b7 \u20ac16\u201317 share price",
        "Umicore is the only company in the west vertically integrated from germanium refining through recycling to GeCl\u2084 production. They hold exclusive offtake on the only new western primary germanium source \u2014 the DRC Big Hill project, where STL\u2019s hydrometallurgical plant has a 30 tonne/year capacity, with potential to supply up to 30% of global germanium demand at full ramp. They supply the majority of western and Japanese fiber manufacturers with the highest-purity GeCl\u2084 in the industry (8N \u2014 99.999999%).",
        "The stock has been beaten down by the battery materials slump \u2014 from \u20ac60 in 2021 to the \u20ac16 range today. But the core foundation businesses are growing: Specialty Materials revenue hit \u20ac558M in 2025 (+4% YoY), EBITDA grew 11% to \u20ac108M. The EU Commission selected two Umicore germanium projects (GePETO and ReGAIN) as the only germanium-related projects under the Critical Raw Materials Act.",
        "The margin structure is asymmetric. Over 50% of Umicore\u2019s germanium input comes from recycled manufacturing scrap under tolling agreements. In tolling, the processing fee is largely fixed regardless of germanium spot price. So when germanium surges from $1,340/kg to $8,597/kg, Umicore\u2019s cost on recycled input barely moves while their output pricing follows the market. **Roughly 25\u201335% of input cost tracks spot while 100% of output pricing tracks spot. Every price increase widens the spread.**",
      ],
    },
    {
      title: "YOFC \u2014 Both sides of the trade",
      paragraphs: [
        "**HKEX: 6869** \u00b7 ~HK$18B market cap \u00b7 3,500t/yr preform capacity \u00b7 100+ export countries \u00b7 12% global fiber share",
        "Every other position at this layer picks a side: germanium scarcity gets worse, or germanium becomes irrelevant. YOFC doesn\u2019t have to choose. They are the world\u2019s largest preform manufacturer, sourcing GeCl\u2084 domestically from Yunnan Chihong and Chinese state plants at controlled prices completely insulated from MOFCOM export controls. When Corning pays Umicore elevated spot-linked prices for GeCl\u2084, YOFC pays domestic rates. **Chinese fiber manufacturers undercut western rivals by 15\u201320% on cable pricing \u2014 a structural cost advantage, not a cyclical one.**",
        "YOFC is also the global leader in hollow-core fiber \u2014 the technology that eliminates germanium from fiber entirely. They achieved world-record 0.040 dB/km HCF attenuation, began commercial production in late 2023, and demonstrated 1.2Tb/s single-wavelength transport over HCF with ZTE in July 2024. If HCF achieves meaningful market share by 2028\u20132030, YOFC will have developed the replacement while profiting from the incumbent technology.",
      ],
    },
    {
      title: "Corning & Prysmian \u2014 The known beneficiaries",
      paragraphs: [
        "**Corning (NYSE: GLW)** \u00b7 ~$36B market cap \u00b7 Meta signed a multiyear agreement worth up to $6 billion for Corning to supply fiber, cable, and connectivity for AI data centers. Optical communications revenue hit $1.65B in Q3 2025 (+33% YoY), enterprise sales surged 58%. Springboard plan upgraded to $11B through 2028.",
        "**Prysmian (BIT: PRY)** \u00b7 ~\u20ac17B market cap \u00b7 Formalized a long-term GeCl\u2084 supply and recycling partnership with Umicore targeting \u201c100% sustainable germanium.\u201d Acquired a North American preform facility to vertically integrate. Invested $115M+ in US optical cable capacity. Also invested in Relativity Networks \u2014 an HCF startup \u2014 hedging against germanium-doped fiber.",
        "**Why these are watching positions:** Corning\u2019s stock has nearly tripled from mid-2024 levels (~$16 to ~$47). The AI fiber thesis is increasingly consensus. The risk/reward has shifted \u2014 there is more downside exposure to an AI capex pause or germanium supply constraint than remaining upside from demand acceleration that is already expected and contracted.",
      ],
    },
    {
      title: "Hollow-core fiber \u2014 The germanium extinction thesis",
      paragraphs: [
        "Hollow-core fiber eliminates germanium from the fiber core entirely. Light propagates through air instead of germanium-doped glass \u2014 47% faster transmission, 33% lower latency, broader spectrum, fewer repeaters, lower power consumption. If HCF reaches meaningful adoption in datacenter interconnects by 2028\u20132030, the entire germanium-for-fiber thesis weakens.",
        "HCF is no longer theoretical. Microsoft deployed over 1,280 km of live HCF in Azure with zero field failures. Their team measured 0.091 dB/km \u2014 the lowest operational loss ever recorded. In September 2025, Microsoft announced industrial-scale production with Corning (North Carolina) and Heraeus (Europe/US). Microsoft\u2019s goal is 15,000 km by late 2026.",
        "**Current global HCF deployment is measured in thousands of km against billions installed and ~700M km deployed annually.** Even with Microsoft\u2019s 15,000 km target, HCF is a fraction of 1% of annual fiber deployment. The germanium supply crisis peaks in 2026\u20132028. HCF cannot relieve it in that window. This is a 3\u20135 year structural thesis, not a near-term catalyst.",
      ],
    },
    {
      title: "The binary event: November 27, 2026",
      paragraphs: [
        "Every position at this layer is affected by a single date. China\u2019s MOFCOM export ban suspension expires November 27, 2026. Markets will begin pricing the probability of reimposition 3\u20136 months in advance.",
        "**If China reimpose the ban:** Umicore becomes the sole western germanium gateway. GeCl\u2084 prices surge further. Corning and Prysmian face supply constraints. YOFC\u2019s domestic cost advantage widens. HCF urgency accelerates.",
        "**If China extends or lifts controls:** Germanium prices moderate. Umicore\u2019s recycling spread compresses. Western manufacturers regain Chinese supply access. YOFC\u2019s cost advantage narrows. HCF urgency diminishes.",
        "The structural shortage of preform capacity and AI/BEAD demand persists through 2027\u20132028 independent of what China decides. But the magnitude of the germanium premium \u2014 and therefore the magnitude of every position described above \u2014 depends heavily on this single policy decision.",
      ],
    },
  ],
  footnote:
    "This section presents objective analysis of market dynamics and company positioning. It does not constitute financial advice or a recommendation to buy, sell, or hold any security. All projections are estimates based on publicly available data and involve significant uncertainty.",
};

/* ─── Content map ─── */
const TAB_CONTENT: Record<TabId, TabContent> = {
  "supply-demand": supplyDemand,
  bottlenecks,
  geopolitical,
  catalysts,
  "emerging-tech": emergingTech,
  "investment-ideas": investmentIdeas,
};

/* ─── Render helpers ─── */

/** Parse **bold** markers in text and return React nodes */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function renderTable(table: TableData) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "12px 0 16px",
        fontSize: "11px",
      }}
    >
      <thead>
        <tr>
          {table.headers.map((h) => (
            <th
              key={h}
              style={{
                ...MONO,
                fontSize: "7px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.12)",
                textAlign: "left",
                padding: "6px 8px",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, ri) => (
          <tr
            key={ri}
            style={{
              background: ri % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent",
            }}
          >
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  ...(ci === 0 ? SYS : MONO),
                  padding: "7px 8px",
                  borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                  color:
                    ci === 3
                      ? "rgba(255,255,255,0.45)"
                      : ci === 2
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.3)",
                  fontSize: ci === 0 ? "11px" : "10px",
                  whiteSpace: ci === 0 ? undefined : "nowrap",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── Main component ─── */
export default function CompAnalysisTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("supply-demand");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to top when switching tabs
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const content = TAB_CONTENT[activeTab];
  const isGold = activeTab === "investment-ideas";

  return (
    <div style={{ width: "100%", background: "#0F0F0E" }}>
      {/* ─── Custom scrollbar styles ─── */}
      <style>{`
        .analysis-scroll::-webkit-scrollbar { width: 3px; }
        .analysis-scroll::-webkit-scrollbar-track { background: transparent; }
        .analysis-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }
        .analysis-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
      `}</style>

      {/* ─── Sticky tab bar ─── */}
      <div
        style={{
          position: "sticky",
          top: 36,
          zIndex: 10,
          background: "#0F0F0E",
          borderBottom: "0.5px solid rgba(255,255,255,0.04)",
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const g = tab.gold;
          const defaultC = g ? "rgba(196,164,108,0.15)" : "rgba(255,255,255,0.1)";
          const hoverC   = g ? "rgba(196,164,108,0.35)" : "rgba(255,255,255,0.25)";
          const activeC  = g ? "rgba(196,164,108,0.55)" : "rgba(255,255,255,0.45)";
          const indC     = g ? "rgba(196,164,108,0.3)"  : "rgba(255,255,255,0.2)";
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...MONO, fontSize: "7px", fontWeight: 500,
                letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap",
                padding: "11px 14px 9px",
                background: "none", border: "none",
                borderBottom: isActive ? `1px solid ${indC}` : "1px solid transparent",
                color: isActive ? activeC : defaultC,
                cursor: "pointer", transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: 4,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = hoverC; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = defaultC; }}
            >
              {g && (
                <svg width="6" height="6" viewBox="0 0 6 6" style={{ verticalAlign: "middle" }}>
                  <path d="M3 0L5.5 3L3 6L0.5 3Z" fill="rgba(196,164,108,0.3)"/>
                </svg>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Content area (fixed height, scrollable) ─── */}
      <div style={{ position: "relative", height: 500 }}>
        <div
          ref={scrollRef}
          className="analysis-scroll"
          style={{ height: "100%", overflowY: "auto" }}
        >
          <div style={{ padding: "24px 32px 40px", maxWidth: 640, margin: "0 auto" }}>
        {/* Takeaway */}
        <div
          style={{
            ...SYS,
            fontSize: "14px",
            fontWeight: 500,
            color: isGold ? "rgba(196,164,108,0.7)" : "rgba(255,255,255,0.7)",
            lineHeight: 1.55,
            textAlign: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "0.5px dashed rgba(255,255,255,0.05)",
          }}
        >
          {content.takeaway}
        </div>

        {/* Sections + interleaved tables */}
        {content.sections.map((section, si) => {
          const tableAfter = content.tables?.find((t) => t.afterSection === si);
          return (
            <React.Fragment key={si}>
              {section.title && (
                <div
                  style={{
                    ...MONO,
                    fontSize: "7px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.12)",
                    letterSpacing: "0.05em",
                    marginTop: 24,
                    marginBottom: 12,
                    paddingBottom: 6,
                    borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {section.title}
                </div>
              )}
              {section.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  style={{
                    ...SYS,
                    fontSize: "11.5px",
                    color: "rgba(255,255,255,0.28)",
                    lineHeight: 1.85,
                    margin: 0,
                    marginBottom: 14,
                  }}
                >
                  {renderBold(p)}
                </p>
              ))}
              {tableAfter && renderTable(tableAfter.data)}
            </React.Fragment>
          );
        })}

        {/* Callout */}
        {content.callout && (
          <div
            style={{
              marginTop: 20,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 4,
              border: "0.5px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                ...SYS,
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {renderBold(content.callout)}
            </p>
          </div>
        )}

        {/* Footnote */}
        {content.footnote && (
          <div
            style={{
              ...SYS,
              fontSize: "7.5px",
              color: "rgba(255,255,255,0.1)",
              fontStyle: "italic",
              lineHeight: 1.5,
              marginTop: 20,
              paddingTop: 12,
              borderTop: "0.5px solid rgba(255,255,255,0.04)",
            }}
          >
            {content.footnote}
          </div>
        )}
          </div>{/* end inner content */}
        </div>{/* end scrollable */}

        {/* Fade overlay at bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 40,
          background: "linear-gradient(transparent, #0F0F0E)",
          pointerEvents: "none",
        }} />
      </div>{/* end fixed-height container */}
    </div>
  );
}
