# Gallium Supply Tree — Structured Node Data (v5)

**Purpose:** This file replaces the existing "SUPPLY TREE" section of `gallium-input-page.md`. Node records follow the Stillpoint Node Schema defined in `stillpoint-master-framework-v5.md` Part 3.

**For Claude Code:** Use this as the authoritative source for the gallium supply tree render in `/app/input/gallium/page.tsx`. Each node has Universal data (shared across all chains) and Gallium Placement data (specific to the gallium page — `relevance`, `chain_specific_risk`, `feeds_from`, `feeds_into`, `show_on_tree`, `show_in_wtmi`, `wtmi_category_tag`). The full Where The Money Is briefs already live in `gallium-input-page.md` for nodes with `show_in_wtmi: true` — do not duplicate them here.

**v5 update (April 2026):**
- Layer taxonomy restructured to tier-based universal model (see v5 framework Part 1)
- `Bauxite Source` renamed to `Byproduct Source` (generalized to other byproduct chains)
- `show_on_tree: boolean` added to all placements — individual bauxite mines are present as Host Operation nodes for globe rendering but `show_on_tree: false` on gallium chain (regional Byproduct Source aggregates are the chain-relevant grain)
- `constituent_entities` field added to Byproduct Source aggregates listing their underlying Host Operation mines
- 26 individual bauxite mine nodes added across Guinea, Australia, Brazil, China, Indonesia, Jamaica, India
- Tier mapping documented: Source (Tier 1) → Extraction (Tier 2) → Primary Processing (Tier 3) → Refining (Tier 4) → Intermediate (Tier 5) → Device (Tier 6)

---

## Key Takeaway

**The western supply picture is defined not by a single chokepoint like Umicore in the germanium chain, but by the absence of meaningful western primary production.** Four concurrent projects — Alcoa/JAGA (Australia), Metlen (Greece), Rio Tinto/Indium (Quebec), and Korea Zinc/Nyrstar (Tennessee) — are rebuilding the western supply chain from scratch, collectively targeting ~230t/yr of non-Chinese capacity by 2029 against ~800t of projected 2028 global demand.

Unlike germanium, gallium does not concentrate in specific geological deposits — it exists at ~50 ppm uniformly across virtually all bauxite globally. The structural bottleneck is therefore not ore bodies but **recovery infrastructure**: which alumina refineries have gallium extraction circuits bolted onto their Bayer-process liquor streams. Most Chinese refineries do; most western refineries historically have not. The four western projects listed above are all about adding recovery capacity to refineries that already exist.

---

## Tree Layer Ordering

Render layers vertically, top to bottom (v5 tier-based taxonomy):

1. **Tier 1 — Source:** `Byproduct Source` — bauxite-producing regions (5 aggregate nodes render on tree)
2. **Tier 2 — Extraction:** `Host Operation` — individual bauxite mines (26 nodes in database for globe view; `show_on_tree: false` on gallium chain — they do not clutter the tree)
3. **Tier 3 — Primary Processing:** `Primary Producer` — alumina refineries with gallium recovery (active + planned)
4. **Tier 4 — Refining:** `Refiner` — high-purity gallium refiners
5. **Tier 5 — Intermediate:** `Substrate Manufacturer` — compound semiconductor wafer producers
6. **Tier 6 — Device Manufacturer:** GaN / GaAs device makers

Aggregate nodes (`aggregate-*`) render as summary boxes separate from the tree.

**v5 rendering note:** Individual Host Operation mines exist in the node database but do not render on the gallium supply tree (`show_on_tree: false`). They surface on the globe view and participate in `related_chains` computation for future chains (e.g., an aluminum chain would render these as tree nodes with `show_on_tree: true`).

---

# Section 1: Universal Node Records

## Byproduct Source Layer

### `bauxite-guinea`
- **name:** Guinea Bauxite (CBG + SMB-Winning)
- **type:** Aggregate
- **ticker:** null
- **country:** GN
- **location_detail:** Boké region, Guinea
- **layer:** Byproduct Source
- **output_headline:** ~97M t/yr bauxite · ~4,850t gallium content
- **output_detail:** 97,000,000 t/yr bauxite ore; ~50 ppm Ga content uniform
- **value_note:** Gallium not separately priced at mine
- **status:** Active
- **about:** Guinea hosts the world's largest bauxite reserves (~7.4 billion tonnes) and is the largest bauxite exporter globally. CBG (51% Halco / 49% Guinea government) operates Sangarédi. SMB-Winning (Chinese-led consortium) operates Boké. Most Guinean bauxite is exported unrefined — primarily to China — because Guinea has minimal domestic alumina capacity.
- **constituent_entities:** [mine-cbg-sangaredi-guinea, mine-smb-winning-boke-guinea, mine-gac-boffa-guinea, mine-cobad-guinea, mine-alufer-bel-air-guinea]
- **key_timeline:** null
- **wtmi_brief:** null

### `bauxite-australia`
- **name:** Australian Bauxite (Weipa + Huntly + Boddington)
- **type:** Aggregate
- **ticker:** null
- **country:** AU
- **location_detail:** Weipa (QLD), Huntly/Willowdale (WA), Boddington/Wagerup (WA)
- **layer:** Byproduct Source
- **output_headline:** ~100M t/yr bauxite · ~5,000t gallium content
- **output_detail:** 100,000,000 t/yr bauxite; ~50 ppm Ga content uniform
- **value_note:** Gallium not separately priced at mine
- **status:** Active
- **about:** Australia is the world's largest bauxite producer at ~100M t/yr. Unlike Guinea, most Australian bauxite is refined domestically through integrated operations. Rio Tinto's Weipa feeds Yarwun and Queensland Alumina. Alcoa's Huntly and Willowdale feed Kwinana, Pinjarra, and Wagerup — the last being the planned JAGA gallium project site.
- **constituent_entities:** [mine-weipa-australia, mine-huntly-australia, mine-willowdale-australia, mine-boddington-australia, mine-gove-australia, mine-worsley-feeder-australia]
- **key_timeline:** null
- **wtmi_brief:** null

### `bauxite-china`
- **name:** Chinese Domestic Bauxite (Shanxi + Guangxi + Henan + Guizhou)
- **type:** Aggregate
- **ticker:** null
- **country:** CN
- **location_detail:** Shanxi, Guangxi, Henan, Guizhou, Yunnan
- **layer:** Byproduct Source
- **output_headline:** ~90M t/yr domestic + ~130M t/yr imports · ~11,000t gallium content in total feedstock
- **output_detail:** 90,000,000 t/yr domestic bauxite; supplemented by ~130M t/yr imports mostly from Guinea
- **value_note:** Domestic Chinese bauxite is generally lower-grade than Guinean imports
- **status:** Active
- **about:** China produces ~90M t/yr of bauxite domestically and imports an additional ~130M t/yr, primarily from Guinea. The combined feedstock pool feeds ~20 Chinese alumina refineries, most of which have installed gallium recovery circuits. This is where ~83% of global primary gallium is produced.
- **constituent_entities:** [mine-chalco-shanxi-china, mine-weiqiao-shandong-china, mine-henan-cluster-china, mine-guizhou-cluster-china, mine-guangxi-cluster-china]
- **key_timeline:** null
- **wtmi_brief:** null

### `bauxite-brazil`
- **name:** Brazilian Bauxite (Trombetas + Juruti)
- **type:** Aggregate
- **ticker:** null
- **country:** BR
- **location_detail:** Trombetas (MRN) and Juruti (Alcoa), Pará state
- **layer:** Byproduct Source
- **output_headline:** ~33M t/yr bauxite · ~1,650t gallium content
- **output_detail:** 33,000,000 t/yr bauxite ore
- **value_note:** Gallium not separately priced at mine
- **status:** Active
- **about:** Brazil is the world's fourth-largest bauxite producer. MRN Trombetas (Vale, BHP, Rio Tinto, Alcoa, Norsk Hydro, CBA consortium) produces ~12M t/yr. Alcoa's Juruti adds ~6M t/yr. Combined output primarily feeds Alunorte (Norsk Hydro) — the world's largest alumina refinery — which does not currently produce gallium. This represents a significant latent supply source.
- **constituent_entities:** [mine-mrn-trombetas-brazil, mine-juruti-brazil, mine-paragominas-brazil]
- **key_timeline:** null
- **wtmi_brief:** null

### `bauxite-indonesia`
- **name:** Indonesian Bauxite (West Kalimantan + Bintan)
- **type:** Aggregate
- **ticker:** null
- **country:** ID
- **location_detail:** West Kalimantan and Bintan Island
- **layer:** Byproduct Source
- **output_headline:** ~26M t/yr bauxite · ~1,300t gallium content
- **output_detail:** 26,000,000 t/yr bauxite ore
- **value_note:** Gallium not separately priced at mine; 2023 unrefined-export ban reshaping flows
- **status:** Active
- **about:** Indonesia banned unprocessed bauxite exports in June 2023, pushing domestic refining investment. Most output currently still reaches Chinese refineries via various workarounds. Strategic relevance is optionality — large reserves could support future gallium-producing refineries if domestic alumina capacity scales.
- **constituent_entities:** [mine-antam-indonesia, mine-harita-indonesia, mine-cita-mineral-indonesia]
- **key_timeline:** null
- **wtmi_brief:** null

---


---

## Host Operation Layer — Individual Bauxite Mines (v5 addition)

These nodes represent specific bauxite mining operations. They are listed here for universal node storage and globe-view rendering. On the gallium chain tree, `show_on_tree: false` because the regional Byproduct Source aggregates already tell the gallium investment story — individual mines are geographic reference, not chain-specific investment grain.

### Guinea

### `mine-cbg-sangaredi-guinea`
- **name:** CBG Sangarédi
- **type:** Aggregate (joint venture: Halco Mining 51% + Guinea government 49%)
- **ticker:** null
- **country:** GN
- **location_detail:** Sangarédi complex, Boké region, Guinea
- **layer:** Host Operation
- **output_headline:** ~14M t/yr bauxite
- **output_detail:** 14,000,000 t/yr bauxite; ~700t gallium content
- **value_note:** Gallium not separately priced
- **status:** Active
- **about:** CBG (Compagnie des Bauxites de Guinée) is a joint venture between Halco Mining (Alcoa 45%, Rio Tinto 45%, Dadco 10%) and the Guinea government. Operates the Sangarédi bauxite complex, one of the world's highest-grade bauxite deposits. Almost all output is exported for refining in North America, Europe, and Asia.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-smb-winning-boke-guinea`
- **name:** SMB-Winning Boké
- **type:** Aggregate (Chinese-led consortium: Winning International, UMS, Shandong Weiqiao, Guinea government)
- **ticker:** null
- **country:** GN
- **location_detail:** Boké region, Guinea — multiple adjacent mining concessions
- **layer:** Host Operation
- **output_headline:** ~50M+ t/yr bauxite across operations
- **output_detail:** 50,000,000+ t/yr bauxite; ~2,500t gallium content
- **value_note:** Gallium not separately priced; largest Chinese-origin bauxite flow globally
- **status:** Active
- **about:** Société Minière de Boké (SMB) and Winning Consortium form the dominant Chinese-backed bauxite operation in Guinea. Combined output exceeds CBG's, making SMB-Winning the single largest source of bauxite flowing to Chinese alumina refineries. Shandong Weiqiao's 25% stake directly integrates the mine with Chinese downstream refining.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-gac-boffa-guinea`
- **name:** GAC Boffa (Emirates Global Aluminium)
- **type:** Private (Emirates Global Aluminium subsidiary)
- **ticker:** null
- **country:** GN
- **location_detail:** Boffa region, Guinea
- **layer:** Host Operation
- **output_headline:** ~12M t/yr bauxite
- **output_detail:** 12,000,000 t/yr bauxite; ~600t gallium content
- **value_note:** Gallium not separately priced
- **status:** Active
- **about:** Guinea Alumina Corporation (GAC) is a subsidiary of Emirates Global Aluminium (EGA), the UAE's integrated aluminum producer. Mines bauxite at Boffa and exports to EGA's Al Taweelah refinery in Abu Dhabi — one of the few alumina refineries outside China with gallium recovery potential.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-cobad-guinea`
- **name:** COBAD (Compagnie des Bauxites de Dian-Dian)
- **type:** Private (Rusal subsidiary)
- **ticker:** null
- **country:** GN
- **location_detail:** Dian-Dian, Boké region, Guinea
- **layer:** Host Operation
- **output_headline:** ~3M t/yr bauxite
- **output_detail:** 3,000,000 t/yr bauxite; ~150t gallium content
- **value_note:** Gallium not separately priced
- **status:** Active
- **about:** COBAD is the Dian-Dian bauxite project operated by Rusal (Russian aluminum major). Output primarily feeds Rusal's Nikolaev alumina refinery in Ukraine (disrupted by the war) and alternative Russian refineries. Subject to Western sanctions complications.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-alufer-bel-air-guinea`
- **name:** Alufer Bel Air
- **type:** Private (Alufer Mining Ltd)
- **ticker:** null
- **country:** GN
- **location_detail:** Bel Air, Boké region, Guinea
- **layer:** Host Operation
- **output_headline:** ~5M t/yr bauxite
- **output_detail:** 5,000,000 t/yr bauxite; ~250t gallium content
- **value_note:** Gallium not separately priced
- **status:** Active
- **about:** Alufer Mining operates the Bel Air mine in Boké, one of the newer Guinean bauxite operations. Output is primarily exported to Chinese and Indian refineries. Private UK-registered parent.
- **key_timeline:** null
- **wtmi_brief:** null

---

### Australia

### `mine-weipa-australia`
- **name:** Weipa
- **type:** Public (Rio Tinto operation)
- **ticker:** RIO (Rio Tinto parent)
- **country:** AU
- **location_detail:** Weipa, Cape York Peninsula, Queensland, Australia
- **layer:** Host Operation
- **output_headline:** ~36M t/yr bauxite
- **output_detail:** 36,000,000 t/yr bauxite; ~1,800t gallium content
- **value_note:** Feeds Rio Tinto's Yarwun and Queensland Alumina refineries (no current gallium recovery)
- **status:** Active
- **about:** Rio Tinto's flagship Australian bauxite mine, operating since 1963. Feeds Yarwun and Queensland Alumina refineries plus exports to Asian refiners. Neither Yarwun nor Queensland Alumina currently produces gallium, representing significant latent supply that could be activated with recovery-circuit investment.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-huntly-australia`
- **name:** Huntly
- **type:** Public (Alcoa operation)
- **ticker:** AA (Alcoa parent)
- **country:** AU
- **location_detail:** Huntly, Western Australia (near Pinjarra)
- **layer:** Host Operation
- **output_headline:** ~25M t/yr bauxite
- **output_detail:** 25,000,000 t/yr bauxite; ~1,250t gallium content
- **value_note:** Feeds Alcoa's Pinjarra alumina refinery
- **status:** Active
- **about:** World's largest bauxite mine by output, operated by Alcoa. Feeds Pinjarra alumina refinery directly. Part of Alcoa's integrated WA operations.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-willowdale-australia`
- **name:** Willowdale
- **type:** Public (Alcoa operation)
- **ticker:** AA (Alcoa parent)
- **country:** AU
- **location_detail:** Willowdale, Western Australia
- **layer:** Host Operation
- **output_headline:** ~10M t/yr bauxite
- **output_detail:** 10,000,000 t/yr bauxite; ~500t gallium content
- **value_note:** Feeds Alcoa's Wagerup alumina refinery — the JAGA gallium project site
- **status:** Active
- **about:** Alcoa bauxite mine in Western Australia feeding the Wagerup alumina refinery. Wagerup is the planned site for the JAGA gallium extraction project. Willowdale is therefore the specific bauxite source that will feed the single largest non-Chinese gallium production facility in development.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-boddington-australia`
- **name:** Boddington Bauxite
- **type:** Public (South32 operation)
- **ticker:** S32 (South32 parent, ASX / LSE / JSE)
- **country:** AU
- **location_detail:** Boddington, Western Australia
- **layer:** Host Operation
- **output_headline:** ~16M t/yr bauxite
- **output_detail:** 16,000,000 t/yr bauxite; ~800t gallium content
- **value_note:** Feeds South32's Worsley alumina refinery
- **status:** Active
- **about:** Boddington Bauxite mine operated by South32, feeding the Worsley alumina refinery. Worsley does not currently produce gallium. Part of South32's integrated Australian aluminum operations.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-gove-australia`
- **name:** Gove
- **type:** Public (Rio Tinto operation)
- **ticker:** RIO (Rio Tinto parent)
- **country:** AU
- **location_detail:** Gove Peninsula, Northern Territory, Australia
- **layer:** Host Operation
- **output_headline:** ~7M t/yr bauxite
- **output_detail:** 7,000,000 t/yr bauxite; ~350t gallium content
- **value_note:** Export-focused; feeds Asian refiners after Gove refinery closure
- **status:** Active
- **about:** Rio Tinto bauxite operation in Arnhem Land. The adjacent Gove alumina refinery was placed on care and maintenance in 2014; bauxite is now exported primarily to Asian refiners.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-worsley-feeder-australia`
- **name:** Worsley Feeder Operations
- **type:** Public (South32 operation — feeder to Worsley refinery)
- **ticker:** S32
- **country:** AU
- **location_detail:** Mount Saddleback, Western Australia (Worsley's dedicated mine)
- **layer:** Host Operation
- **output_headline:** Integrated with Boddington for Worsley feedstock
- **output_detail:** Output bundled with Boddington in South32 reporting
- **value_note:** Sometimes reported as part of Boddington; listed here for completeness
- **status:** Active
- **about:** Dedicated bauxite feeder operations for South32's Worsley alumina refinery. Output is typically reported combined with Boddington Bauxite.
- **key_timeline:** null
- **wtmi_brief:** null

---

### Brazil

### `mine-mrn-trombetas-brazil`
- **name:** MRN Trombetas
- **type:** Private (consortium: Vale, BHP, Rio Tinto, Alcoa, Norsk Hydro, CBA)
- **ticker:** null
- **country:** BR
- **location_detail:** Trombetas River, Pará state, Brazil
- **layer:** Host Operation
- **output_headline:** ~12M t/yr bauxite
- **output_detail:** 12,000,000 t/yr bauxite; ~600t gallium content
- **value_note:** Feeds Alunorte alumina refinery (Norsk Hydro) — no current gallium recovery
- **status:** Active
- **about:** Mineração Rio do Norte (MRN) is Brazil's largest bauxite operation, owned by a consortium of the world's major aluminum producers. Output primarily feeds Alunorte — the world's largest alumina refinery by capacity — which does not currently extract gallium. Represents large latent supply potential.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-juruti-brazil`
- **name:** Juruti
- **type:** Public (Alcoa operation)
- **ticker:** AA
- **country:** BR
- **location_detail:** Juruti, Pará state, Brazil
- **layer:** Host Operation
- **output_headline:** ~6M t/yr bauxite
- **output_detail:** 6,000,000 t/yr bauxite; ~300t gallium content
- **value_note:** Feeds Alcoa's Alumar alumina refinery in São Luís
- **status:** Active
- **about:** Alcoa bauxite mine in the Amazon, operating since 2009. Feeds the Alumar alumina refinery in São Luís (jointly owned with South32). Neither Juruti nor Alumar currently produces gallium.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-paragominas-brazil`
- **name:** Paragominas
- **type:** Public (Norsk Hydro operation)
- **ticker:** NHY (Norsk Hydro parent, Oslo)
- **country:** BR
- **location_detail:** Paragominas, Pará state, Brazil
- **layer:** Host Operation
- **output_headline:** ~9M t/yr bauxite
- **output_detail:** 9,000,000 t/yr bauxite; ~450t gallium content
- **value_note:** Feeds Alunorte alumina refinery
- **status:** Active
- **about:** Norsk Hydro's principal Brazilian bauxite mine, connected to Alunorte refinery by a 244 km slurry pipeline. Alunorte is the world's largest alumina refinery but does not currently recover gallium from its Bayer liquor stream.
- **key_timeline:** null
- **wtmi_brief:** null

---

### China

### `mine-chalco-shanxi-china`
- **name:** Chalco Shanxi Bauxite Operations
- **type:** State-owned (Chalco / Aluminum Corporation of China)
- **ticker:** 601600.SS (Chalco parent)
- **country:** CN
- **location_detail:** Shanxi Province, China — multiple operations
- **layer:** Host Operation
- **output_headline:** ~20M t/yr bauxite (aggregate estimate)
- **output_detail:** ~20,000,000 t/yr bauxite; ~1,000t gallium content
- **value_note:** Feeds Chalco alumina refineries with gallium recovery circuits
- **status:** Active
- **about:** Aggregated view of Aluminum Corporation of China (Chalco) bauxite operations in Shanxi. Chalco is China's largest state-owned aluminum producer and the largest individual operator of gallium-producing alumina refineries globally.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-weiqiao-shandong-china`
- **name:** Shandong Weiqiao Bauxite Operations
- **type:** Private (Shandong Weiqiao — parent of China Hongqiao)
- **ticker:** 1378.HK (China Hongqiao)
- **country:** CN
- **location_detail:** Shandong Province, China (plus Guinea SMB-Winning stake)
- **layer:** Host Operation
- **output_headline:** Large domestic footprint + SMB-Winning stake
- **output_detail:** Aggregated Chinese domestic bauxite plus significant Guinean import flow via SMB-Winning ownership
- **value_note:** Largest private aluminum producer globally
- **status:** Active
- **about:** Shandong Weiqiao / China Hongqiao is the world's largest aluminum producer by volume, vertically integrated from bauxite through alumina to primary aluminum. Operates Chinese domestic bauxite mines plus owns significant stake in Guinea's SMB-Winning consortium for imported feedstock. A key operator of gallium-producing Chinese alumina refineries.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-henan-cluster-china`
- **name:** Henan Bauxite Cluster
- **type:** Aggregate (multiple state-affiliated and private operators)
- **ticker:** null
- **country:** CN
- **location_detail:** Henan Province, China
- **layer:** Host Operation
- **output_headline:** ~15M t/yr bauxite (aggregate)
- **output_detail:** 15,000,000 t/yr bauxite; ~750t gallium content
- **value_note:** Feeds Henan-based alumina refineries
- **status:** Active
- **about:** Aggregated view of bauxite operations in Henan Province. Historically a major Chinese bauxite-producing region; Henan bauxite is generally lower-grade than imported Guinean material. Feeds multiple regional alumina refineries.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-guizhou-cluster-china`
- **name:** Guizhou Bauxite Cluster
- **type:** Aggregate (multiple state-affiliated operators)
- **ticker:** null
- **country:** CN
- **location_detail:** Guizhou Province, China
- **layer:** Host Operation
- **output_headline:** ~10M t/yr bauxite (aggregate)
- **output_detail:** 10,000,000 t/yr bauxite; ~500t gallium content
- **value_note:** Feeds Guizhou-based alumina refineries
- **status:** Active
- **about:** Aggregated view of Guizhou Province bauxite operations. Emerging region as some Henan and Shanxi deposits decline. Feeds regional Chinese alumina refineries.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-guangxi-cluster-china`
- **name:** Guangxi Bauxite Cluster
- **type:** Aggregate (state-affiliated and private operators including Chalco Guangxi)
- **ticker:** null
- **country:** CN
- **location_detail:** Guangxi Zhuang Autonomous Region, China
- **layer:** Host Operation
- **output_headline:** ~15M t/yr bauxite (aggregate)
- **output_detail:** 15,000,000 t/yr bauxite; ~750t gallium content
- **value_note:** Feeds Guangxi regional alumina refineries plus coastal processing plants receiving Guinean imports
- **status:** Active
- **about:** Aggregated view of Guangxi Province bauxite operations. Strategic coastal location makes it a major processing hub for both domestic production and imported Guinean bauxite. Chalco operates significant Guangxi bauxite and alumina capacity.
- **key_timeline:** null
- **wtmi_brief:** null

---

### Indonesia

### `mine-antam-indonesia`
- **name:** Antam Bauxite Operations
- **type:** State-owned (PT Aneka Tambang)
- **ticker:** ANTM.JK
- **country:** ID
- **location_detail:** West Kalimantan, Indonesia
- **layer:** Host Operation
- **output_headline:** ~5M t/yr bauxite
- **output_detail:** 5,000,000 t/yr bauxite; ~250t gallium content
- **value_note:** State-owned; Indonesian strategic mineral
- **status:** Active
- **about:** PT Aneka Tambang (Antam) is Indonesia's state-owned mining company with significant bauxite operations in West Kalimantan. Output supports the growing Indonesian domestic alumina refining sector following the 2023 unrefined-export ban.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-harita-indonesia`
- **name:** Harita Group Bauxite Operations
- **type:** Private (Harita Group)
- **ticker:** null
- **country:** ID
- **location_detail:** West Kalimantan and Bintan, Indonesia
- **layer:** Host Operation
- **output_headline:** ~8M t/yr bauxite
- **output_detail:** 8,000,000 t/yr bauxite; ~400t gallium content
- **value_note:** Private; Indonesian-owned
- **status:** Active
- **about:** Harita Group is one of Indonesia's largest private mining conglomerates with significant bauxite operations. Integrating downstream into alumina refining as part of Indonesia's domestic processing push.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-cita-mineral-indonesia`
- **name:** Cita Mineral Investindo
- **type:** Public (Indonesian market)
- **ticker:** CITA.JK
- **country:** ID
- **location_detail:** West Kalimantan, Indonesia
- **layer:** Host Operation
- **output_headline:** ~4M t/yr bauxite
- **output_detail:** 4,000,000 t/yr bauxite; ~200t gallium content
- **value_note:** Listed on Indonesia Stock Exchange
- **status:** Active
- **about:** Cita Mineral Investindo is a publicly listed Indonesian bauxite producer with operations in West Kalimantan. One of the few listed pure-play bauxite companies globally.
- **key_timeline:** null
- **wtmi_brief:** null

---

### Jamaica

### `mine-noranda-jamaica`
- **name:** Noranda Bauxite Jamaica
- **type:** Private
- **ticker:** null
- **country:** JM
- **location_detail:** Discovery Bay, St. Ann Parish, Jamaica
- **layer:** Host Operation
- **output_headline:** ~4M t/yr bauxite
- **output_detail:** 4,000,000 t/yr bauxite; ~200t gallium content
- **value_note:** Historical major producer; recovery post-2010 declines
- **status:** Active
- **about:** Noranda Bauxite operates Jamaican mining assets. Jamaica was historically a top-5 global bauxite producer; output has declined from peaks but remains significant. Feeds export markets rather than integrated domestic refining.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-jamalco-jamaica`
- **name:** Jamalco
- **type:** Private (Noble Group stake + Government of Jamaica)
- **ticker:** null
- **country:** JM
- **location_detail:** Clarendon Parish, Jamaica
- **layer:** Host Operation
- **output_headline:** ~3M t/yr bauxite
- **output_detail:** 3,000,000 t/yr bauxite; ~150t gallium content
- **value_note:** Integrated bauxite-alumina operation
- **status:** Active
- **about:** Jamalco operates both bauxite mining and an adjacent alumina refinery in Jamaica. The refinery does not currently produce gallium. Partially owned by the Government of Jamaica.
- **key_timeline:** null
- **wtmi_brief:** null

---

### India

### `mine-nalco-panchpatmali-india`
- **name:** NALCO Panchpatmali
- **type:** State-owned (National Aluminium Company)
- **ticker:** NATIONALUM.NS
- **country:** IN
- **location_detail:** Panchpatmali, Odisha, India
- **layer:** Host Operation
- **output_headline:** ~7M t/yr bauxite
- **output_detail:** 7,000,000 t/yr bauxite; ~350t gallium content
- **value_note:** Feeds NALCO's Damanjodi alumina refinery (integrated)
- **status:** Active
- **about:** NALCO is India's state-owned aluminum company. Panchpatmali is its flagship bauxite mine, feeding the adjacent Damanjodi alumina refinery. India's domestic refining capacity is significant but gallium recovery circuits are not installed at scale.
- **key_timeline:** null
- **wtmi_brief:** null

### `mine-vedanta-lanjigarh-india`
- **name:** Vedanta Lanjigarh Feeder Mines
- **type:** Public (Vedanta Resources)
- **ticker:** VEDL.NS
- **country:** IN
- **location_detail:** Odisha and neighboring states, India
- **layer:** Host Operation
- **output_headline:** ~4M t/yr bauxite
- **output_detail:** 4,000,000 t/yr bauxite; ~200t gallium content
- **value_note:** Feeds Vedanta's Lanjigarh alumina refinery
- **status:** Active
- **about:** Aggregated bauxite operations feeding Vedanta's Lanjigarh alumina refinery in Odisha. Vedanta is India's largest private mining company and a major integrated aluminum producer.
- **key_timeline:** null
- **wtmi_brief:** null

---


## Primary Producer Layer

### `aggregate-chinese-bauxite-refineries`
- **name:** Chinese Bauxite Refineries
- **type:** Aggregate
- **ticker:** null
- **country:** CN
- **location_detail:** Shandong, Guangxi, Henan, Shanxi, Yunnan — ~20 alumina refineries with gallium recovery
- **layer:** Primary Producer
- **output_headline:** ~1,000 t/yr capacity · ~590 t/yr actual
- **output_detail:** 590 t/yr crude gallium metal (99.99%); ~59% capacity utilization
- **value_note:** Chinese domestic pricing ~$245/kg (SMM Mar 2026)
- **status:** Partial
- **about:** ~20 Chinese alumina refineries produce gallium as a byproduct of the Bayer process. Operators include state-owned Chalco and Shandong Weiqiao plus private Vital Materials and Zhuzhou Keneng. Chinese capacity grew from ~140 t/yr in 2010 to ~1,000 t/yr by 2022. The ~59% utilization represents deliberate overhang Beijing can release or withhold depending on policy cycle.
- **key_timeline:**
  - Aug 1, 2023 — Export licensing regime imposed
  - Dec 3, 2024 — US-targeted ban
  - Nov 2025 — Ban suspended
  - Nov 27, 2026 — Suspension expiry
- **wtmi_brief:** See `aggregate-chinese-primary-supply-gallium` record (separate aggregate for WTMI)

### `project-alcoa-jaga-wagerup`
- **name:** Alcoa / JAGA (Wagerup)
- **type:** Project (Alcoa parent: Public · NYSE)
- **ticker:** AA (Alcoa parent)
- **country:** AU
- **location_detail:** Wagerup alumina refinery, Western Australia
- **layer:** Primary Producer (planned)
- **output_headline:** 100 t/yr target 2028 · 0 t/yr current · FID pending
- **output_detail:** 0 t/yr current; 100 t/yr target 2028
- **value_note:** $175M/yr at target ($1,750/kg realized)
- **status:** Pre-FID
- **about:** Japan-Australia Gallium (JAGA) project announced October 2025 to extract gallium from Alcoa's existing Wagerup alumina refinery liquor stream. Backed by four sovereign governments (US, Australia, Japan) with AUD 200M concessional Australian equity. Uses ion-exchange resin circuit bolted onto existing infrastructure, so incremental cost is relatively low.
- **key_timeline:**
  - Oct 2025 — JAGA project announced
  - End 2025 — FID expected (delayed; pending as of April 2026)
  - H2 2026 — Initial production target (contingent on FID)
  - 2028 — Full 100 t/yr ramp target
- **wtmi_brief:** See `company-alcoa` record

### `company-alcoa`
- **name:** Alcoa Corporation
- **type:** Public
- **ticker:** AA (NYSE) · AAI (ASX)
- **country:** [US, AU]
- **location_detail:** Pittsburgh PA (HQ); operations in Australia, North America, Brazil, Europe
- **layer:** Primary Producer (planned — via JAGA project)
- **output_headline:** ~$11B market cap · Wagerup gallium project targeting 100 t/yr
- **output_detail:** Diversified integrated aluminum producer; gallium is a new product line pending FID
- **value_note:** FY24 revenue $11.9B; gallium project represents <2% of total enterprise value at target
- **status:** Active (parent) · Pre-FID (gallium project)
- **about:** Alcoa is one of the world's largest integrated aluminum producers, with bauxite mining, alumina refining, and aluminum smelting operations across Australia, North America, Brazil, and Europe. Gallium is a new product line that would leverage existing Wagerup refinery infrastructure.
- **key_timeline:** See `project-alcoa-jaga-wagerup`
- **wtmi_brief:** See Alcoa Corporation — Full Brief in gallium-input-page.md

### `company-metlen`
- **name:** Metlen Energy & Metals
- **type:** Public
- **ticker:** MYTIL (Athens) · MTLN (London)
- **country:** GR
- **location_detail:** Maroussi (HQ); Agios Nikolaos alumina refinery and gallium facility
- **layer:** Primary Producer (demo stage)
- **output_headline:** 50 t/yr target 2028 · ~5 kg first production Jan 2026
- **output_detail:** ~0.005 t currently; 50 t/yr full ramp target
- **value_note:** $87.5M/yr at target ramp
- **status:** Demo stage
- **about:** Diversified Greek industrial group with metals, energy, and infrastructure operations. Operates one of Europe's largest alumina refineries at Agios Nikolaos. Announced first 5 kg gallium production January 2026. Designated EU Critical Raw Materials Act Strategic Project with €90M EIB financing approved.
- **key_timeline:**
  - Jan 2026 — First 5 kg gallium produced
  - 2027 — 5-10 t/yr interim target
  - 2028 — 50 t/yr full ramp target
- **wtmi_brief:** See Metlen Energy & Metals — Full Brief in gallium-input-page.md

### `company-rio-tinto`
- **name:** Rio Tinto
- **type:** Public
- **ticker:** RIO (NYSE · LSE · ASX)
- **country:** [AU, UK, CA]
- **location_detail:** London / Melbourne HQ · Vaudreuil (Quebec) gallium demo plant at alumina refinery
- **layer:** Primary Producer (demo stage)
- **output_headline:** ~3.5 t/yr demo · 40 t/yr commercial target
- **output_detail:** 3.5 t/yr current demo; 40 t/yr commercial target 2028+
- **value_note:** $6M/yr at demo; $70M/yr at commercial target
- **status:** Demo stage
- **about:** World's second-largest mining company with significant bauxite and alumina operations. Vaudreuil gallium project is a partnership with Indium Corporation (which owns the extraction process IP). Demo plant began operating 2024. Commercial-scale conversion targeted 2028+ at ~5-10% of global primary production.
- **key_timeline:**
  - 2024 — Demo plant operational at Vaudreuil
  - 2028+ — Commercial conversion decision
  - 2029+ — Target 40 t/yr production
- **wtmi_brief:** See Rio Tinto — Full Brief in gallium-input-page.md

### `project-korea-zinc-crucible`
- **name:** Korea Zinc / Crucible JV
- **type:** Project (Korea Zinc parent: Public · Seoul)
- **ticker:** 010130.KS (Korea Zinc parent)
- **country:** US
- **location_detail:** Clarksville, Tennessee — $7.4B critical minerals facility on former Nyrstar site
- **layer:** Primary Producer + Refiner (planned)
- **output_headline:** 40 t/yr gallium target 2029 · $7.4B JV · DoD 40% equity
- **output_detail:** 0 t/yr current; 40 t/yr gallium target (among 13 critical mineral outputs totaling 540,000 t/yr)
- **value_note:** $70M/yr gallium-specific at target; total JV output value much higher
- **status:** Planned
- **about:** $7.4B joint venture announced December 2025. Korea Zinc (<10% equity, operator role), US DoD (40% equity), JPMorgan (advisor). Largest critical minerals processing investment in US history with $4.7B US government loans and $210M CHIPS Act subsidies. Being built on the Nyrstar Tennessee site after demolition.
- **key_timeline:**
  - Dec 2025 — JV announced
  - 2026 — Nyrstar demolition begins
  - 2026-2029 — Construction
  - 2029 — Commercial operations
- **wtmi_brief:** See Korea Zinc — Full Brief in gallium-input-page.md

### `project-nyrstar-tennessee`
- **name:** Nyrstar Tennessee (pre-Crucible)
- **type:** Private (Trafigura subsidiary)
- **ticker:** null
- **country:** US
- **location_detail:** Clarksville, Tennessee
- **layer:** Primary Producer + Refiner (transitional)
- **output_headline:** 126-145 t/yr gallium content in mine feed · facility in demolition
- **output_detail:** Theoretical 126-145 t/yr gallium in zinc concentrate feed; recovery never commercialized
- **value_note:** No realized gallium value; feed has content, process doesn't exist
- **status:** Demolition
- **about:** Trafigura-owned zinc smelter operating since the 1970s. Zinc concentrate feed contains significant gallium but recovery was never commercially implemented. Being demolished to make way for Korea Zinc / Crucible JV.
- **key_timeline:**
  - Dec 2025 — Site designated for Crucible redevelopment
  - 2026 — Demolition begins
- **wtmi_brief:** null

---

## Refiner Layer

### `company-dowa-holdings`
- **name:** Dowa Holdings
- **type:** Public
- **ticker:** 5714.T (Tokyo)
- **country:** JP
- **location_detail:** Tokyo (HQ); Kosaka, Akita (high-purity metal refining)
- **layer:** Refiner
- **output_headline:** ~10-30 t/yr high-purity gallium metal · 6N+ purity
- **output_detail:** 10-30 t/yr refined gallium (99.9999%+)
- **value_note:** ~$17-50M/yr gallium-specific; diversified portfolio
- **status:** Active
- **about:** Diversified Japanese specialty materials group — non-ferrous metals, electronic materials, environmental management. Japan's primary high-purity refining capacity at 6N+ (99.9999%+) — the grade compound semiconductor wafer production requires. Dependent on imported feedstock (Chinese primary plus Japanese recycled).
- **key_timeline:**
  - Mar 2024 — Japanese government designated gallium critical mineral
  - Oct 2025 — US-Japan Critical Minerals Framework signed
- **wtmi_brief:** See Dowa Holdings — Full Brief in gallium-input-page.md

### `company-5n-plus`
- **name:** 5N Plus Inc.
- **type:** Public
- **ticker:** VNP (TSX)
- **country:** CA
- **location_detail:** Montreal (HQ and refining); Salt Lake City, Utah (germanium recycling)
- **layer:** Refiner + Recycler
- **output_headline:** ~2-5 t/yr gallium · multi-metal refiner
- **output_detail:** 2-5 t/yr refined gallium; also Ge, Te, In, Bi
- **value_note:** ~$3.5-9M/yr gallium-specific; FY25 total revenue $391M
- **status:** Active
- **about:** Canadian specialty semiconductor materials company refining high-purity Ge, Ga, Te, In, Bi. Two main segments: Specialty Semiconductors (73% of revenue — AZUR space solar, compound semi wafers) and Performance Materials. FY25 revenue +35%, EBITDA +73%, net debt/EBITDA 0.5x.
- **key_timeline:**
  - Jan 2026 — US DoE $18.1M grant for Utah Ge recycling
  - 2026 — New CEO transition
- **wtmi_brief:** See 5N Plus Inc. — Full Brief in gallium-input-page.md

### `company-indium-corporation`
- **name:** Indium Corporation
- **type:** Private
- **ticker:** null
- **country:** US
- **location_detail:** Clinton, New York (HQ)
- **layer:** Refiner
- **output_headline:** Process IP owner · limited direct production
- **output_detail:** Gallium extraction process licensing (Rio Tinto partner); small-volume recycling at New York
- **value_note:** Private; limited financial disclosure
- **status:** Active
- **about:** Privately-held specialty materials company known for solder, indium, and specialty metals refining. Owns the gallium extraction process IP used in Rio Tinto's Vaudreuil demo plant. Operates GaAs manufacturing scrap recycling in New York.
- **key_timeline:** null
- **wtmi_brief:** null

### `company-vital-materials`
- **name:** Vital Materials
- **type:** Private
- **ticker:** null
- **country:** CN
- **location_detail:** Guangzhou, Guangdong
- **layer:** Refiner
- **output_headline:** Leading Chinese high-purity refiner · MOCVD precursors
- **output_detail:** Aggregated within Chinese refined production; also produces trimethylgallium (MOCVD precursor)
- **value_note:** Private; aggregated figures
- **status:** Active
- **about:** One of China's largest integrated specialty metals producers. Refines Ga, In, Ge, Te, rare earths. High-purity refining capacity serves Chinese domestic semiconductor industry. Produces MOCVD precursor chemicals (the gallium-containing liquids used to grow thin GaN layers during chip manufacturing). Together with Zhuzhou Smelter Group and Zhuzhou Keneng, anchors Chinese control over downstream high-purity gallium supply.
- **key_timeline:** null
- **wtmi_brief:** null

### `company-zhuzhou-smelter-group`
- **name:** Zhuzhou Smelter Group + Zhuzhou Keneng
- **type:** Aggregate (Zhuzhou Smelter: State-owned; Keneng: Private)
- **ticker:** null
- **country:** CN
- **location_detail:** Hunan Province, China
- **layer:** Refiner
- **output_headline:** Chinese high-purity refining capacity · aggregated figures
- **output_detail:** Aggregated within Chinese refined output (~290 t/yr refined)
- **value_note:** null
- **status:** Active
- **about:** Two Hunan-based Chinese operators of high-purity gallium refining capacity. Zhuzhou Smelter Group is state-affiliated; Zhuzhou Keneng is private. Together with Vital Materials, comprise the core of Chinese downstream high-purity gallium production serving the Chinese semiconductor industry.
- **key_timeline:** null
- **wtmi_brief:** null

---

## Substrate Manufacturer Layer

### `company-axt-inc`
- **name:** AXT, Inc.
- **type:** Public
- **ticker:** AXTI (Nasdaq)
- **country:** [US, CN]
- **location_detail:** Fremont CA (HQ); Beijing (Tongmei manufacturing subsidiary)
- **layer:** Substrate Manufacturer
- **output_headline:** World's largest compound semiconductor wafer facility · GaAs + InP + Ge substrates
- **output_detail:** ~1.5M wafers/yr estimate across GaAs, InP, Ge substrates
- **value_note:** ~$95M TTM revenue; gallium-specific is fraction
- **status:** Active
- **about:** Designs and manufactures compound semiconductor wafer substrates — gallium arsenide (GaAs), indium phosphide (InP), germanium (Ge). Tongmei in Beijing is management's belief to be world's largest facility for compound semiconductor wafer production. Downstream chokepoint for converting refined gallium into semiconductor substrates. Q3 2025 InP revenue +250% sequential on AI datacenter silicon photonics.
- **key_timeline:** null
- **wtmi_brief:** See AXT, Inc. — Full Brief in gallium-input-page.md

---

## Device Manufacturer Layer

### `company-navitas`
- **name:** Navitas Semiconductor
- **type:** Public
- **ticker:** NVTS (Nasdaq)
- **country:** US
- **location_detail:** Torrance CA (HQ); GlobalFoundries fab partnership
- **layer:** Device Manufacturer
- **output_headline:** Pure-play GaN power semiconductor manufacturer · NVIDIA 800V partnership
- **output_detail:** GaN power ICs + SiC power devices; device volumes not separately disclosed
- **value_note:** FY25 revenue $45.9M (down from $83.3M during mobile-to-datacenter pivot)
- **status:** Active
- **about:** Pure-play wide-bandgap semiconductor company focused on GaN power ICs and SiC power devices. Customer base includes hyperscalers and EV OEMs. NVIDIA 800V partnership announced 2024 for AI datacenter power conversion. Mid-pivot from mobile/consumer to high-power markets. High-power exceeded 50% of Q4 2025 revenue for the first time.
- **key_timeline:**
  - 2024 — NVIDIA 800V partnership
  - Q4 2025 — High-power >50% of revenue
  - H2 2026 — GlobalFoundries US GaN manufacturing available
- **wtmi_brief:** See Navitas Semiconductor — Full Brief in gallium-input-page.md

---

## Aggregate Summary Nodes

These render as summary boxes separate from the tree itself.

### `aggregate-chinese-primary-supply-gallium`
- **name:** Chinese Primary Supply
- **type:** Aggregate
- **ticker:** null
- **country:** CN
- **location_detail:** Aggregate of Chinese alumina refineries and downstream high-purity refiners
- **layer:** Aggregate
- **output_headline:** 98-99% of global primary · 91% of global refined
- **output_detail:** ~590 t/yr primary; ~290 t/yr refined
- **value_note:** Chinese domestic ~$245/kg; western retail ~$2,269/kg; 9x spread
- **status:** Active
- **about:** Aggregate view of China's dominance across primary (~590 t/yr) and refined (~290 t/yr) gallium. Combined output of ~20 alumina refineries plus downstream refiners (Vital Materials, Zhuzhou Smelter Group, Zhuzhou Keneng). Chinese capacity of ~1,000 t/yr vastly exceeds Chinese domestic demand, creating structural overhang.
- **key_timeline:**
  - Aug 1, 2023 — Export licensing regime imposed
  - Dec 3, 2024 — US-targeted export ban
  - Nov 2025 — Ban suspended
  - Nov 27, 2026 — Suspension expiry
- **wtmi_brief:** See Chinese Primary Supply (aggregate) — Full Brief in gallium-input-page.md

### `aggregate-western-refined-supply-gallium`
- **name:** Western Refined Supply
- **type:** Aggregate
- **ticker:** null
- **country:** [JP, CA, US]
- **location_detail:** Aggregate of non-Chinese high-purity refiners
- **layer:** Aggregate
- **output_headline:** ~15-30 t/yr · ~9% of global refined supply
- **output_detail:** 15-30 t/yr combined: Dowa Japan (~10-30), 5N Plus Canada (~2-5), Indium Corp US (small)
- **value_note:** At $1,750/kg western retail, ~$26-52M/yr aggregate value
- **status:** Active
- **about:** Combined non-Chinese, non-Russian high-purity refined gallium output. Dominated by Dowa Holdings in Japan. 5N Plus in Canada and Indium Corporation in the US provide small additional volumes. Roughly 9% of global refined supply — the structural gap the four western primary producer projects aim to close.
- **key_timeline:** null
- **wtmi_brief:** null

### `aggregate-global-supply`
- **name:** Global Supply
- **type:** Aggregate
- **ticker:** null
- **country:** null
- **location_detail:** Global
- **layer:** Aggregate (top-level summary)
- **output_headline:** ~320 t/yr refined · ~600 t/yr primary
- **output_detail:** 320 t/yr refined (high-purity reaching customers); 600 t/yr primary (crude metal)
- **value_note:** ~$560M/yr refined market at western retail; ~$78M at Chinese domestic
- **status:** Active
- **about:** Total worldwide gallium production. The ~280t gap between primary (600t) and refined (320t) reflects losses in conversion to semiconductor-grade purity plus some primary metal that never gets refined. Refined is the number that matters for actual end markets.
- **key_timeline:** null
- **wtmi_brief:** null

---

# Section 2: Gallium Chain Placement Records

One record per node that appears on the gallium tree. Defines gallium-specific relevance, feeds_from/into edges, WTMI placement.

---

## Byproduct Source Placements

### `bauxite-guinea` on gallium
- **relevance:** Guinea is the world's largest bauxite exporter but refines almost none of its own output. Roughly 80% of Guinean bauxite flows to Chinese refineries, meaning Guinea structurally underwrites Chinese gallium dominance. Gallium content in the ~97M t/yr export flow is ~4,850 tonnes annually — an order of magnitude more than current global refined production.
- **chain_specific_risk:** Political stability in Guinea; Chinese strategic lock-in via SMB-Winning consortium ownership
- **feeds_from:** [mine-cbg-sangaredi-guinea, mine-smb-winning-boke-guinea, mine-gac-boffa-guinea, mine-cobad-guinea, mine-alufer-bel-air-guinea]
- **feeds_into:** [aggregate-chinese-bauxite-refineries]
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `bauxite-australia` on gallium
- **relevance:** Australia is the only major bauxite-producing region with domestic alumina refining at scale AND a western-aligned political posture. The Wagerup refinery operated by Alcoa — the planned JAGA gallium site — processes Australian-origin bauxite. Australian bauxite is thus the structural feedstock basis for the single most important western primary production project.
- **chain_specific_risk:** Project-level execution risk at JAGA; FID delays
- **feeds_from:** [mine-weipa-australia, mine-huntly-australia, mine-willowdale-australia, mine-boddington-australia, mine-gove-australia, mine-worsley-feeder-australia]
- **feeds_into:** [project-alcoa-jaga-wagerup, company-alcoa]
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `bauxite-china` on gallium
- **relevance:** China's combined domestic bauxite production (~90M t/yr) and imports (primarily Guinean, ~130M t/yr) feed the ~20 Chinese alumina refineries that produce ~83% of global primary gallium. Domestic bauxite supply is strategically important to China independent of Guinea flows — it provides baseline feedstock resilience even if geopolitical pressure constrains imports.
- **chain_specific_risk:** None chain-specific; Chinese integrated control is a feature, not a risk, from Chinese policy perspective
- **feeds_from:** [mine-chalco-shanxi-china, mine-weiqiao-shandong-china, mine-henan-cluster-china, mine-guizhou-cluster-china, mine-guangxi-cluster-china]
- **feeds_into:** [aggregate-chinese-bauxite-refineries]
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `bauxite-brazil` on gallium
- **relevance:** Brazil's bauxite feeds Alunorte (Norsk Hydro), the world's largest alumina refinery, which currently does not produce gallium. Combined with Alcoa's Juruti output, Brazilian bauxite represents ~1,650 tonnes of gallium content flowing through alumina infrastructure that does not recover it. A latent supply source — if any operator decides to retrofit recovery circuits.
- **chain_specific_risk:** No active project; latent supply may never materialize without specific catalyst
- **feeds_from:** [mine-mrn-trombetas-brazil, mine-juruti-brazil, mine-paragominas-brazil]
- **feeds_into:** []  # No gallium-producing refineries in the current gallium tree receive Brazilian feedstock
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `bauxite-indonesia` on gallium
- **relevance:** Indonesia's 2023 unrefined-export ban is reshaping bauxite flows globally. Limited current relevance to gallium production — most Indonesian bauxite still reaches Chinese refineries via workarounds. Strategic optionality if domestic Indonesian alumina capacity scales.
- **chain_specific_risk:** Export ban enforcement variability; no direct gallium investment vehicle
- **feeds_from:** [mine-antam-indonesia, mine-harita-indonesia, mine-cita-mineral-indonesia]
- **feeds_into:** [aggregate-chinese-bauxite-refineries]
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

---


---

## Host Operation Placements (v5 addition)

Individual bauxite mine placements on the gallium chain. All have `show_on_tree: false` — geographic/database-only presence, not chain tree rendering. Regional Byproduct Source aggregates handle tree-level rendering.

Each mine's `feeds_into` points to its regional Byproduct Source aggregate. All share a similar chain-specific risk profile (no direct gallium-specific risk at the mine level; risks emerge at the refinery level where recovery decisions are made).

### `mine-cbg-sangaredi-guinea` on gallium
- **relevance:** High-grade bauxite source contributing ~14M t/yr to global feedstock flow. Operated by joint venture between Alcoa, Rio Tinto, Dadco (Halco), and the Guinea government — one of the more geopolitically stable Guinean operations given western shareholder presence.
- **chain_specific_risk:** Guinea political stability; export logistics
- **feeds_from:** []
- **feeds_into:** [bauxite-guinea]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-smb-winning-boke-guinea` on gallium
- **relevance:** Single largest Chinese-origin bauxite flow globally. SMB-Winning's 50M+ t/yr of Boké output is the structural foundation underneath Chinese gallium dominance — this bauxite flows to Chinese refineries that have installed gallium recovery circuits.
- **chain_specific_risk:** Chinese strategic lock-in via Shandong Weiqiao ownership; Guinea political stability
- **feeds_from:** []
- **feeds_into:** [bauxite-guinea]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-gac-boffa-guinea` on gallium
- **relevance:** UAE-owned Guinean bauxite feeding EGA's Al Taweelah refinery in Abu Dhabi. Al Taweelah is one of the few non-Chinese alumina refineries with gallium recovery potential, making GAC a latent alternative western-aligned supply chain.
- **chain_specific_risk:** UAE offtake concentration
- **feeds_from:** []
- **feeds_into:** [bauxite-guinea]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-cobad-guinea` on gallium
- **relevance:** Rusal-operated Guinean bauxite. Russian aluminum industry sanctions post-2022 disrupted output flows; Rusal's Nikolaev refinery in Ukraine was lost to the war. Output now largely redirected to alternative refiners with reduced western market access.
- **chain_specific_risk:** Russian sanctions; Ukraine war disruption
- **feeds_from:** []
- **feeds_into:** [bauxite-guinea]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-alufer-bel-air-guinea` on gallium
- **relevance:** One of newer Guinean bauxite operations. Output primarily exported to Chinese and Indian refineries.
- **chain_specific_risk:** Small operator; Guinea political stability
- **feeds_from:** []
- **feeds_into:** [bauxite-guinea]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-weipa-australia` on gallium
- **relevance:** Rio Tinto's flagship Australian bauxite mine. Feeds Yarwun and Queensland Alumina — both currently without gallium recovery. Represents the largest latent gallium supply opportunity in a western-aligned jurisdiction outside the specifically announced Wagerup JAGA project.
- **chain_specific_risk:** No gallium recovery installed; depends on Rio Tinto capital allocation decision separate from the Quebec demo project
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-huntly-australia` on gallium
- **relevance:** World's largest bauxite mine by output, feeding Alcoa's Pinjarra refinery. Pinjarra is a candidate for future gallium recovery expansion once JAGA Wagerup establishes process precedent.
- **chain_specific_risk:** Alcoa capital allocation prioritizes Wagerup first
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-willowdale-australia` on gallium
- **relevance:** Direct feedstock source for the Wagerup alumina refinery — the JAGA gallium project site. Willowdale's bauxite literally becomes the input to the single largest non-Chinese gallium production facility in development.
- **chain_specific_risk:** Project timeline depends on JAGA FID and construction progress
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-boddington-australia` on gallium
- **relevance:** South32's major bauxite asset feeding Worsley refinery. Worsley does not currently recover gallium; Boddington is a latent supply source pending operator decisions on recovery-circuit investment.
- **chain_specific_risk:** South32 has not announced gallium plans
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-gove-australia` on gallium
- **relevance:** Rio Tinto's Arnhem Land bauxite operation. Adjacent Gove alumina refinery is on care and maintenance since 2014, making this mine an export-only operation — bauxite flows to Asian refiners including Chinese.
- **chain_specific_risk:** Refinery is offline; reviving would require significant capex
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-worsley-feeder-australia` on gallium
- **relevance:** Dedicated bauxite supply for Worsley refinery. Output typically reported combined with Boddington.
- **chain_specific_risk:** Bundled with Boddington; see Boddington placement
- **feeds_from:** []
- **feeds_into:** [bauxite-australia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-mrn-trombetas-brazil` on gallium
- **relevance:** Brazil's largest bauxite operation, owned by a consortium of global aluminum majors. Feeds Alunorte — the world's largest alumina refinery — which currently does not recover gallium. Represents one of the largest single latent gallium supply sources globally if Norsk Hydro decides to install recovery.
- **chain_specific_risk:** Norsk Hydro has not announced gallium plans; Alunorte remains a pure alumina play
- **feeds_from:** []
- **feeds_into:** [bauxite-brazil]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-juruti-brazil` on gallium
- **relevance:** Alcoa's Brazilian bauxite operation feeding Alumar refinery. Alumar does not currently recover gallium. Alcoa's gallium strategic focus is on Australian Wagerup rather than Brazilian operations.
- **chain_specific_risk:** Not in Alcoa's announced gallium roadmap
- **feeds_from:** []
- **feeds_into:** [bauxite-brazil]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-paragominas-brazil` on gallium
- **relevance:** Norsk Hydro's principal Brazilian bauxite mine, connected to Alunorte by slurry pipeline. Core feedstock to the world's largest alumina refinery.
- **chain_specific_risk:** Alunorte gallium recovery remains hypothetical
- **feeds_from:** []
- **feeds_into:** [bauxite-brazil]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-chalco-shanxi-china` on gallium
- **relevance:** Aggregated Chalco bauxite operations in Shanxi feeding state-owned gallium-producing alumina refineries. Chalco is the largest single operator of gallium-producing refineries globally; its bauxite operations directly underwrite that position.
- **chain_specific_risk:** State ownership means output tied to Chinese industrial policy
- **feeds_from:** []
- **feeds_into:** [bauxite-china]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-weiqiao-shandong-china` on gallium
- **relevance:** Shandong Weiqiao / China Hongqiao is the world's largest aluminum producer. Vertically integrates from bauxite through alumina to primary aluminum, including gallium recovery at its refineries. Owns stake in Guinea SMB-Winning for supplementary imported feedstock.
- **chain_specific_risk:** Private but subject to Chinese export licensing regime on gallium output
- **feeds_from:** []
- **feeds_into:** [bauxite-china]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-henan-cluster-china` on gallium
- **relevance:** Aggregated Henan bauxite operations. Historically a core Chinese bauxite region; lower-grade ore increasingly supplemented by imports. Feeds regional alumina refineries including some with gallium recovery.
- **chain_specific_risk:** Grade decline; import substitution dynamics
- **feeds_from:** []
- **feeds_into:** [bauxite-china]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-guizhou-cluster-china` on gallium
- **relevance:** Emerging Chinese bauxite region as older provinces decline. Feeds regional alumina refineries.
- **chain_specific_risk:** No specific gallium concentration story
- **feeds_from:** []
- **feeds_into:** [bauxite-china]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-guangxi-cluster-china` on gallium
- **relevance:** Coastal Chinese bauxite hub processing both domestic production and imported Guinean material. Chalco operates significant capacity. Feeds coastal alumina refineries with gallium recovery.
- **chain_specific_risk:** Subject to Chinese export licensing
- **feeds_from:** []
- **feeds_into:** [bauxite-china]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-antam-indonesia` on gallium
- **relevance:** Indonesia's state-owned bauxite operator. Strategic significance rises as Indonesia scales domestic alumina refining capacity post-2023 export ban.
- **chain_specific_risk:** State-owned; domestic processing priorities
- **feeds_from:** []
- **feeds_into:** [bauxite-indonesia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-harita-indonesia` on gallium
- **relevance:** Large private Indonesian bauxite producer integrating downstream. If Indonesian alumina refining scales, Harita-affiliated operations could host gallium recovery.
- **chain_specific_risk:** Private Indonesian group; limited transparency
- **feeds_from:** []
- **feeds_into:** [bauxite-indonesia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-cita-mineral-indonesia` on gallium
- **relevance:** One of the few listed pure-play bauxite companies globally. Provides public-equity exposure to Indonesian bauxite sector for investors.
- **chain_specific_risk:** Small listed company; Indonesian market governance
- **feeds_from:** []
- **feeds_into:** [bauxite-indonesia]
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-noranda-jamaica` on gallium
- **relevance:** Historical major bauxite producer. Output declined from peak but remains material. Feeds export markets rather than integrated domestic refining with gallium recovery.
- **chain_specific_risk:** Aging infrastructure; no gallium-producing refineries in Jamaica
- **feeds_from:** []
- **feeds_into:** []
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-jamalco-jamaica` on gallium
- **relevance:** Integrated Jamaican bauxite-alumina operation. Refinery does not currently produce gallium. Government ownership stake limits private-capital optionality.
- **chain_specific_risk:** Integrated refinery without gallium recovery; state ownership
- **feeds_from:** []
- **feeds_into:** []
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-nalco-panchpatmali-india` on gallium
- **relevance:** India's state-owned flagship bauxite mine feeding Damanjodi refinery. India has significant latent alumina refining capacity that could support future gallium recovery if strategic decisions align.
- **chain_specific_risk:** Indian state-owned operator; no announced gallium plans
- **feeds_from:** []
- **feeds_into:** []
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `mine-vedanta-lanjigarh-india` on gallium
- **relevance:** Vedanta is India's largest private mining company. Lanjigarh refinery is a major Indian alumina facility without current gallium recovery. Private-sector Indian gallium potential if recovery circuits are installed.
- **chain_specific_risk:** No announced gallium strategy; Indian regulatory environment
- **feeds_from:** []
- **feeds_into:** []
- **show_on_tree:** false
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

---


## Primary Producer Placements

### `aggregate-chinese-bauxite-refineries` on gallium
- **relevance:** The structural core of global gallium supply. ~590 t/yr actual production across ~20 refineries at ~59% utilization represents China's ability to scale output up or down by hundreds of tonnes per year based on policy direction. The Aug 2023 licensing regime, Dec 2024 US ban, and Nov 2025 suspension are all expressions of this capacity used as policy instrument.
- **chain_specific_risk:** Export licensing policy cycles; utilization decisions at Beijing's discretion
- **feeds_from:** [bauxite-guinea, bauxite-china, bauxite-indonesia]
- **feeds_into:** [company-vital-materials, company-zhuzhou-smelter-group, company-dowa-holdings, company-5n-plus, company-axt-inc]
- **show_on_tree:** true
- **show_in_wtmi:** false  # The investable aggregate view uses `aggregate-chinese-primary-supply-gallium`
- **wtmi_category_tag:** null

### `project-alcoa-jaga-wagerup` on gallium
- **relevance:** The single largest non-Chinese primary production facility in development. 100 t/yr at full ramp would be roughly 30% of current global refined supply. Located at an existing Alcoa alumina refinery, so incremental capital cost and execution risk are lower than greenfield. FID is the binary catalyst — delayed from end-2025 and pending April 2026.
- **chain_specific_risk:** FID delay; sovereign backing concentration creates political dependency
- **feeds_from:** [bauxite-australia]
- **feeds_into:** []  # Output form (crude metal) would feed high-purity refiners, likely including Dowa and 5N Plus, but offtake arrangements are undisclosed
- **show_on_tree:** true
- **show_in_wtmi:** false  # WTMI placement is on parent `company-alcoa`
- **wtmi_category_tag:** null

### `company-alcoa` on gallium
- **relevance:** The corporate vehicle for gallium exposure via the JAGA project. Alcoa's aluminum business is the dominant driver of the stock — gallium is an incremental upside at ~$175M/yr revenue at full ramp vs ~$12B company revenue. But given small investor interest in pure-play gallium and the sovereign backing at JAGA, Alcoa is the most liquid western vehicle for primary production exposure.
- **chain_specific_risk:** Gallium thesis is small relative to aluminum; aluminum price volatility drives share price more than JAGA milestones
- **feeds_from:** [bauxite-australia]  # Via JAGA project
- **feeds_into:** []  # Offtake structure undisclosed
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Capacity builder

### `company-metlen` on gallium
- **relevance:** Europe's first industrial gallium producer. 50 t/yr by 2028 would fully cover current EU gallium demand. Already in production at demo scale (5 kg Jan 2026). EU Critical Raw Materials Act Strategic Project status provides regulatory tailwind. Scale-up execution risk is real — going from 5 kg to 50 tonnes is a 10,000x ramp.
- **chain_specific_risk:** Scale-up execution; Greek sovereign risk (minimal); European demand capture vs export
- **feeds_from:** []  # Metlen sources bauxite from own mining operations in Greece and imports; not explicitly modeled as a bauxite-source node
- **feeds_into:** []  # Offtake to European compound semiconductor manufacturers; not currently modeled
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Capacity builder

### `company-rio-tinto` on gallium
- **relevance:** Demonstration-stage North American producer with 40 t/yr commercial target post-2028. The Indium Corporation partnership owns the process IP, making Rio Tinto more of an operational shell than an IP-owning producer. Less binary than Alcoa (demo already running) but further from commercial scale. Gallium is a tiny fraction of Rio Tinto's diversified mining business.
- **chain_specific_risk:** Commercial-scale FID not yet made; gallium thesis diluted by mega-cap scale
- **feeds_from:** []  # Sources from Rio Tinto's Canadian alumina feedstock
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Feedstock supplier

### `project-korea-zinc-crucible` on gallium
- **relevance:** 40 t/yr gallium from a zinc-copper-antimony-germanium-etc. multi-output smelter scheduled 2029. The structural significance is not the gallium tonnage but the US DoD 40% equity stake — the first direct US government ownership of a critical minerals facility. Signals strategic-asset treatment of gallium alongside other outputs.
- **chain_specific_risk:** Construction timing (2026-2029); ownership dispute (Korea Zinc vs Young Poong) affects execution
- **feeds_from:** []  # Feed is zinc concentrates from mines (Alaska Red Dog, Tennessee mines), not bauxite
- **feeds_into:** []  # Offtake to US strategic reserves and US device manufacturers; not currently modeled
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Market maker

### `project-nyrstar-tennessee` on gallium
- **relevance:** Historic zinc smelter with significant untapped gallium content in feed (126-145 t/yr theoretical). Never commercialized gallium recovery. Being demolished to make way for the Crucible JV. On the tree to illustrate the "lost" western recovery opportunity that the Crucible rebuild is meant to finally capture.
- **chain_specific_risk:** Demolition execution timing affects Crucible construction schedule
- **feeds_from:** []
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

---

## Refiner Placements

### `company-dowa-holdings` on gallium
- **relevance:** The de facto western pipeline for GaAs wafer supply. Japan's primary high-purity gallium refiner at the 6N+ purity grade required for compound semiconductor wafer production. Dependent on imported feedstock — primarily Chinese primary metal plus recycled material. Gallium is a small line item within Dowa's diversified specialty metals business.
- **chain_specific_risk:** Feedstock dependence on Chinese primary supply; diversified portfolio dilutes gallium thesis
- **feeds_from:** [aggregate-chinese-bauxite-refineries]
- **feeds_into:** [company-axt-inc]  # Primary customer for GaAs substrate production
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Chokepoint holder

### `company-5n-plus` on gallium
- **relevance:** Most direct western investment vehicle for critical minerals refining broadly. Gallium is a smaller exposure than germanium or AZUR space solar within 5N Plus's portfolio. 2-5 t/yr production from Montreal. US DoE grant in Jan 2026 is for germanium expansion — no equivalent gallium-specific government funding announced.
- **chain_specific_risk:** Gallium is a small fraction of 5N Plus revenue; gallium thesis exposure is diluted
- **feeds_from:** [aggregate-chinese-bauxite-refineries]  # Current; will shift if Alcoa/JAGA or Metlen offtake materializes
- **feeds_into:** []  # Customer base is specialty device manufacturers (space solar, compound semi wafers); not currently modeled per-customer
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Pure-play

### `company-indium-corporation` on gallium
- **relevance:** Owns the process IP used in Rio Tinto's Vaudreuil demo plant. Also operates GaAs manufacturing scrap recycling at its New York facility. More of an IP-licensing and recycling play than a volume producer. Private, so no direct investment vehicle.
- **chain_specific_risk:** Private; limited visibility; IP value crystallizes only if Rio Tinto commercial conversion goes ahead
- **feeds_from:** []  # GaAs manufacturing scrap (recycling source)
- **feeds_into:** [company-axt-inc]  # Recycled GaAs material back to substrate manufacturers
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `company-vital-materials` on gallium
- **relevance:** Core Chinese high-purity gallium refiner alongside Zhuzhou Smelter Group and Zhuzhou Keneng. Produces MOCVD precursor chemicals (trimethylgallium) — the specific chemical form gallium takes in GaN chip manufacturing. Anchor of Chinese control over downstream high-purity supply.
- **chain_specific_risk:** Private Chinese company; subject to same export licensing regime
- **feeds_from:** [aggregate-chinese-bauxite-refineries]
- **feeds_into:** []  # Chinese domestic device manufacturers; not currently modeled
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `company-zhuzhou-smelter-group` on gallium
- **relevance:** Hunan-based Chinese high-purity refining capacity. Aggregated view of Zhuzhou Smelter Group (state-affiliated) and Zhuzhou Keneng (private). Together with Vital Materials, comprise core Chinese downstream high-purity gallium production.
- **chain_specific_risk:** Subject to Chinese export licensing regime
- **feeds_from:** [aggregate-chinese-bauxite-refineries]
- **feeds_into:** []  # Chinese domestic device manufacturers
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

---

## Substrate Manufacturer Placement

### `company-axt-inc` on gallium
- **relevance:** Downstream chokepoint for converting refined gallium into semiconductor substrates. World's largest compound semiconductor wafer producer via Tongmei in Beijing. Q3 2025 InP revenue +250% sequentially signaled AI datacenter optical build-out pulling compound semi demand at scale. The closest thing to a gallium chokepoint since western primary production is absent.
- **chain_specific_risk:** Chinese manufacturing location exposes AXT to export permit variability
- **feeds_from:** [company-dowa-holdings, aggregate-chinese-bauxite-refineries, company-indium-corporation]
- **feeds_into:** [company-navitas]  # Plus many other GaN / GaAs device makers
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Manufacturing / integration

---

## Device Manufacturer Placement

### `company-navitas` on gallium
- **relevance:** Pure-play GaN power semiconductor manufacturer — the clearest downstream demand proxy for AI datacenter 800V power conversion. NVIDIA partnership (2024) positions Navitas as the default GaN supplier for NVIDIA's 800V architecture roll-out. Mid-pivot from mobile to high-power has compressed near-term revenue but aligns the business with the structural growth vector.
- **chain_specific_risk:** Revenue compression during pivot; execution of NVIDIA relationship; competition from Infineon, Efficient Power Conversion
- **feeds_from:** [company-axt-inc]  # GaAs substrates; GaN devices are built on SiC substrates sourced from Wolfspeed/ROHM
- **feeds_into:** []  # AI datacenter operators, EV OEMs; end-use customers, not currently modeled
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Technology

---

## Aggregate Placements (summary boxes, render separately from tree)

### `aggregate-chinese-primary-supply-gallium` on gallium
- **relevance:** The investable aggregate view of Chinese gallium dominance. Not a single entity and not directly investable. Central stress-test variable — every other investable position on the page derives its thesis from what China does. This aggregate is a **summary view** of `aggregate-chinese-bauxite-refineries` plus downstream Chinese high-purity refiners (Vital Materials, Zhuzhou Smelter Group); it renders as a summary box, not as a distinct tree node with edges.
- **chain_specific_risk:** Binary dependence on Chinese export policy
- **feeds_from:** []  # Rendered as summary box; edges live on the underlying refinery and bauxite-source nodes
- **feeds_into:** []  # Same
- **show_on_tree:** true
- **show_in_wtmi:** true
- **wtmi_category_tag:** Market maker

### `aggregate-western-refined-supply-gallium` on gallium
- **relevance:** Summary view of non-Chinese refined gallium supply. ~15-30 t/yr combined from Dowa, 5N Plus, and Indium Corporation. The structural gap the four western primary producer projects (Alcoa, Metlen, Rio Tinto, Korea Zinc) aim to close over 2026-2029. Renders as summary box, not as a distinct tree node.
- **chain_specific_risk:** Scale gap vs Chinese supply; timing of western production ramps
- **feeds_from:** []  # Rendered as summary; Dowa, 5N Plus, Indium Corp have their own tree edges
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

### `aggregate-global-supply` on gallium
- **relevance:** Top-level summary. 320 t/yr refined at the headline. Primary-refined gap (600t primary → 320t refined) reflects conversion losses and primary metal never refined. Refined is the figure that matters for end markets. Renders as summary box at top of page, not as tree node.
- **chain_specific_risk:** n/a
- **feeds_from:** []  # Summary; no tree edges
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** false
- **wtmi_category_tag:** null

---

# Section 3: Render Ordering for Where The Money Is

Nodes with `show_in_wtmi: true` grouped by `layer`, ordered as below. Tag shown as small badge on card.

## Primary Producer
1. `company-alcoa` — Capacity builder
2. `company-metlen` — Capacity builder
3. `company-rio-tinto` — Feedstock supplier
4. `project-korea-zinc-crucible` — Market maker
5. `aggregate-chinese-primary-supply-gallium` — Market maker

## Refiner
6. `company-dowa-holdings` — Chokepoint holder
7. `company-5n-plus` — Pure-play

## Substrate Manufacturer
8. `company-axt-inc` — Manufacturing / integration

## Device Manufacturer
9. `company-navitas` — Technology

## Direct exposure
10. `commodity-gallium-metal` — Direct exposure (commodity card — does not appear on tree)

---

*Stillpoint Intelligence · Gallium Supply Tree · Framework v5 · April 2026*
