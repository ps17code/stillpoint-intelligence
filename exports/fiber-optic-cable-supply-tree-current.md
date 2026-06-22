# Fiber Optic Cable Supply Tree

Exported from current codebase. Data sources: data/chains.json (COMP_DATA['GeO₂ / GeCl₄'], SUB_DATA['Fiber Optics']), data/nodes.json

---

# Section 1: Universal Node Records

### `supplier-umicore-gecl4`
- **name:** Umicore GeCl4
- **type:** GeCl₄ chemical supplier
- **ticker:** TBD
- **country:** Belgium
- **location_detail:** Olen, Belgium
- **layer:** GeCl₄ Supplier
- **output_headline:** €3.9B market cap · Sole western GeCl₄ supplier at scale
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Global materials technology and recycling group operating across four business groups: Catalysis, Recycling, Specialty Materials, and Battery Materials. Specialty Materials (€558M revenue, +4% YoY) houses the germanium business. CEO Bart Sap launched the ‘CORE’ strategy in March 2025, refocusing on cash generation from foundation businesses.
- **stats:**
  - Market cap: €3.9B
  - Revenue: €3.6B
  - Adj. EBITDA: €847M
  - GeCl₄ output/yr: ~86t
- **risk:** DRC supply ramp risk. Single-facility concentration at Olen.
- **inv:** UMI is the most direct western investment vehicle for germanium supply chain exposure. Chinese export controls structurally improve Umicore’s pricing power.
- **risks:**
  - DRC Big Hill ramp timeline uncertain
  - Recycled scrap feed shrinks if Chinese fiber output declines
  - Single facility concentration risk — Olen, Belgium
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `supplier-yunnan-chihong-gecl4`
- **name:** Yunnan Chihong GeCl4
- **type:** GeCl₄ chemical supplier
- **ticker:** TBD
- **country:** China
- **location_detail:** Kunming, Yunnan, China
- **layer:** GeCl₄ Supplier
- **output_headline:** CNY ~8B market cap · China’s largest integrated Ge producer
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** State-owned subsidiary of Chinalco (Aluminum Corporation of China). China’s largest integrated germanium producer — vertically integrated from mining through refining to downstream products. Operates the Huize mine in Yunnan with 443 tonnes of germanium reserves. Produced 65.9 tonnes of germanium products in 2023.
- **stats:**
  - Market cap: CNY ~8B
  - Ge products (2023): 65.9t
  - Dedicated GeCl₄ line: 30t/yr
  - Huize reserves: 443t
- **risk:** Subject to Chinese export controls. Full US export ban since December 2024.
- **inv:** Chinese A-share listed. Indirect proxy for Chinese germanium pricing. No direct western investment vehicle.
- **risks:**
  - Export controls prevent western market access
  - Price manipulation risk from Chinese state policy
  - Geopolitical escalation could trigger further restrictions
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `supplier-chinese-state-gecl4-plants`
- **name:** Chinese State GeCl4 Plants
- **type:** GeCl₄ chemical suppliers
- **ticker:** TBD
- **country:** China
- **location_detail:** Multiple provinces, China
- **layer:** GeCl₄ Supplier
- **output_headline:** ~50–60t Ge/yr combined · Nanjing Ge, GRINM, Lincang Xinyuan
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Multiple Chinese state-linked processors produce GeCl₄ at various scales and purity levels. Includes Nanjing Germanium, GRINM Goujing (formerly Vital Materials), and Yunnan Lincang Xinyuan Germanium Industry. Collectively serve China’s domestic fiber optic market alongside Yunnan Chihong.
- **stats:**
  - Ge equiv./yr: ~50-60t
  - Purity range: 6N-8N
  - Pricing: Domestic
  - MOFCOM: Export-controlled
- **risk:** Export controls block western access. MOFCOM licensed for any international shipments.
- **inv:** No direct western investment vehicle. Exposure only via Chinese state-owned enterprise listings.
- **risks:**
  - Export controls block all western supply
  - Aggregated opacity — actual output uncertain
  - State directive risk could redirect supply to strategic uses
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `supplier-jsc-germanium-gecl4`
- **name:** JSC Germanium GeCl4
- **type:** Germanium processor — military/defense
- **ticker:** TBD
- **country:** Russia
- **location_detail:** Moscow / Novomoskovsk, Russia
- **layer:** GeCl₄ Supplier
- **output_headline:** ~15–20t capacity · Sanctioned · Zero commercial fiber connection
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Direct subsidiary of Rostec, Russia’s state defense conglomerate that provides approximately 80% of Russia’s weapons. Processes germanium for military applications — IR optics for aircraft, combat equipment, night vision systems. Recovers germanium from Spetsugli coal deposit in Russia’s Far East.
- **stats:**
  - Ge capacity/yr: ~15-20t
  - End use: Military only
  - Status: Sanctioned
  - Fiber connection: Zero
- **risk:** Fully sanctioned. Zero western market access. Not a fiber supply chain participant.
- **inv:** No investment case. Sanctioned entity. Historically removed ~9% of western-accessible germanium supply.
- **risks:**
  - Fully sanctioned — no western access
  - Permanently removed from western supply picture
  - Cannot serve as emergency alternative
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `entity-corning`
- **name:** Corning
- **type:** Fiber optic manufacturer — vertically integrated
- **ticker:** TBD
- **country:** USA
- **location_detail:** Corning, New York, USA
- **layer:** Fiber Manufacturer + Assembly
- **output_headline:** ~$36B market cap · $1.65B optical comms Q3’25 (+33%)
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Invented low-loss optical fiber in 1970. World’s largest western fiber manufacturer operating across Optical Communications, Display, Specialty Materials, Environmental, and Life Sciences. Optical communications is the growth engine — Q3 2025 revenue hit $1.65B (+33% YoY) with enterprise sales surging 58% on AI network demand.
- **stats:**
  - Market cap: ~$36B
  - Q3’25 optical rev: $1.65B
  - Q3’25 net income: $530M
  - Fiber-km/yr: ~300-400M
- **risk:** GeO₂/GeCl₄ supply constraint limits capacity expansion.
- **inv:** GLW is the most liquid western proxy for AI infrastructure fiber demand. Multi-year datacenter backlogs give rare earnings visibility.
- **risks:**
  - GeO₂/GeCl₄ supply constraint limits capacity
  - Significant China revenue exposure (~$1B+ annually)
  - Overcapacity risk if datacenter buildout slows
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `entity-prysmian`
- **name:** Prysmian
- **type:** Fiber optic manufacturer — vertically integrated
- **ticker:** TBD
- **country:** Italy
- **location_detail:** Milan, Italy
- **layer:** Fiber Manufacturer + Assembly
- **output_headline:** ~€17B market cap · 15% global fiber share · World’s largest cable co.
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** World’s largest cable company — energy cables, telecom cables, and submarine cable systems. 15% global fiber market share, the single largest. Acquired Encore Wire to expand North American footprint. Covers full cable value chain from preform manufacturing through finished cable.
- **stats:**
  - Market cap: ~€17B
  - FY24 revenue: €16B+
  - US optical capex: $115M+
  - Cable-km/yr: >30M
- **risk:** European telecom capex cycles. 18–24 month preform expansion lag.
- **inv:** PRY offers terrestrial and subsea exposure. Subsea demand is driven by AI hyperscalers building private subsea networks.
- **risks:**
  - More exposed to European telecom capex cycles
  - Italian listing reduces liquidity for US investors
  - Currency risk (EUR-denominated)
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `manufacturer-fujikura`
- **name:** Fujikura
- **type:** Fiber optic manufacturer — vertically integrated
- **ticker:** TBD
- **country:** Japan
- **location_detail:** Tokyo, Japan
- **layer:** Fiber Manufacturer
- **output_headline:** ~¥2.5T market cap · ¥979B revenue (+22.5%) FY25 · +160% stock 2025
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Developed the world’s first optical fiber in 1959. Revenue from Information Technology (fiber, cables), Electronics (PCBs), Automotive (wiring harnesses), and Energy (power cables). Over 50% of revenue from the US. ~75% of optical fiber output exported. Stock surged 160% in 2025 on AI data center demand.
- **stats:**
  - Market cap: ~¥2.5T
  - FY25 revenue: ¥979B
  - FY26 net income (fcst): ¥132B
  - Fiber-km/yr: ~10-15M
- **risk:** Full Umicore dependency for GeCl₄ — no domestic Japanese alternative.
- **inv:** TSE-listed with meaningful western investor access. Closest pure-play on the AI fiber demand + germanium supply constraint thesis.
- **risks:**
  - Full Umicore dependency — no domestic Japanese GeCl₄ production
  - Yen depreciation impacts USD returns
  - Post-AI-surge valuation re-rating risk if growth decelerates
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `entity-sumitomo-electric`
- **name:** Sumitomo Electric
- **type:** Fiber optic manufacturer — vertically integrated
- **ticker:** TBD
- **country:** Japan
- **location_detail:** Osaka, Japan
- **layer:** Fiber Manufacturer + Assembly
- **output_headline:** ~¥2.8T market cap · ¥4.1T FY24 revenue · Top 3 global fiber
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** One of Japan’s largest diversified industrial companies. Business includes Automotive (wiring harnesses — largest segment), Infocommunications (optical fiber, cables, photonic devices), Electronics, Environment & Energy, and Industrial Materials. Optical fiber is a meaningful but minority portion of total revenue.
- **stats:**
  - Market cap: ~¥2.8T
  - FY24 revenue: ¥4.1T
  - Net income: —
  - Fiber-km/yr: ~10-15M
- **risk:** Fiber is a minority of revenue — diversified industrial reduces direct germanium exposure.
- **inv:** Unique dual exposure: AI fiber demand and EV wiring harness demand. Less pure-play than Fujikura given diversified revenue base.
- **risks:**
  - Fiber is a minority of revenue — auto wiring harness dominates valuation
  - TSE listing limits western direct access
  - Auto wiring harness slowdown could weigh on overall valuation
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `manufacturer-shin-etsu`
- **name:** Shin-Etsu
- **type:** Fiber optic preform specialist
- **ticker:** TBD
- **country:** Japan
- **location_detail:** Tokyo, Japan
- **layer:** Fiber Manufacturer
- **output_headline:** ~¥8T market cap · Japan’s largest chemical co. · Dual Si + Ge expertise
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Japan’s largest chemical company. World leader in PVC, semiconductor silicon wafers, and silicones. Optical fiber preform is part of the Electronics Materials segment. Produces preforms at Kashima (Japan), plus two China JVs — Shin-Etsu Jiangsu (with Fasten Group) and Shin-Etsu YOFC (Hubei, with YOFC).
- **stats:**
  - Market cap: ~¥8T
  - FY24 revenue: ¥2.4T
  - Net income: —
  - Fiber-km/yr (Japan): ~5-8M
- **risk:** Silicon wafer oversupply risk if AI chip demand cycles down.
- **inv:** Unique dual-exposure play: AI chip demand drives silicon wafer volumes AND AI datacenter buildout drives fiber preform volumes.
- **risks:**
  - Silicon wafer oversupply risk if AI chip demand cycles
  - Japanese listed — limited western direct access
  - Yen exposure for USD investors
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `manufacturer-yofc`
- **name:** YOFC
- **type:** Fiber optic manufacturer — vertically integrated
- **ticker:** TBD
- **country:** China
- **location_detail:** Wuhan, China
- **layer:** Fiber Manufacturer
- **output_headline:** ~HK$18B market cap · World’s largest preform capacity · 3,500t/yr
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** World’s largest optical fiber preform manufacturer by capacity. China’s dominant fiber and cable producer. Vertically integrated from preform to cable. JVs with Shin-Etsu for advanced preform technology. International plants in Mexico, Indonesia, South Africa, Brazil, and Poland. Supplies China Mobile (30% of their fiber needs).
- **stats:**
  - Market cap: ~HK$18B
  - 2025 rev (proj.): ~$5B
  - Preform capacity: 3,500t/yr
  - Export countries: 100+
- **risk:** Chinese state-backed. Geopolitically complex. Corning JV creates IP exposure.
- **inv:** HKEX-listed with more western accessibility than SSE. The Corning JV structure creates a direct link between Chinese Ge supply and western fiber manufacturing IP.
- **risks:**
  - Geopolitical risk — Chinese state ownership
  - Corning JV creates IP transfer concerns
  - Export control risk limits western sales potential
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `aggregate-optical-fiber-strand`
- **name:** Optical Fiber Strand
- **type:** Output node
- **ticker:** TBD
- **country:** Global
- **location_detail:** Global
- **layer:** Output
- **output_headline:** ~720M fiber-km/yr
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Continuous strands of germanium-doped silica glass, 125 micrometers in diameter — thinner than a human hair. Drawn from preforms at 10-20 meters per second. Each strand carries data as pulses of light through the germanium-doped core. The germanium doping raises the refractive index by ~0.35%, creating the waveguide effect that makes fiber optic communication possible.
- **stats:**
  - Output: ~720M fiber-km/yr
  - 2030 forecast: 1.3-1.4B
  - Ge per fiber-km: 0.087g
- **risk:** Supply gap cannot close before late 2027 due to 18–24 month preform expansion lag.
- **inv:** The cable itself is a commodity. Invest in manufacturers with highest datacenter/subsea mix (Corning, Prysmian) or at the hyperscale operator level.
- **risks:**
  - Supply gap cannot close before late 2027 due to 18–24 month preform lag
  - Chinese export controls directly constrain capacity expansion
  - Demand pull-forward could exhaust western GeCl₄ stocks
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `assembler-commscope`
- **name:** CommScope
- **type:** Cable assembler
- **ticker:** TBD
- **country:** USA
- **location_detail:** Hickory, North Carolina, USA
- **layer:** Assembly
- **output_headline:** CCS segment +27% YoY Q4 2024 · Propel 800G platform
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** CommScope's Connectivity & Cable Solutions segment is the fastest-growing division, driven by hyperscale and cloud datacenter GenAI buildout. Q4 2024 net sales +27% YoY with CCS leading all segments. Launched Propel modular fiber platform in 2024 enabling 400G and 800G datacenter applications, reducing installation time by 30%. Strong US manufacturing presence for BABA-compliant broadband infrastructure.
- **stats:**
  - Ticker: COMM · NASDAQ
  - 2024 revenue: $4.2B total
  - Q4 2024: CCS +27% YoY
  - Innovation: Propel 800G platform 2024
- **risk:** $9B+ debt load from 2019 ARRIS acquisition.
- **inv:** COMM is a more leveraged play on US datacenter infrastructure buildout. Higher risk than Corning but also higher upside if datacenter spending continues.
- **risks:**
  - $9B+ debt from 2019 ARRIS acquisition
  - Not vertically integrated — exposed to strand price fluctuations
  - Slower to benefit from Ge supply constraint than upstream players
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `assembler-afl`
- **name:** AFL
- **type:** Cable assembler
- **ticker:** TBD
- **country:** USA
- **location_detail:** Duncan, South Carolina, USA
- **layer:** Assembly
- **output_headline:** US domestic · utility + datacenter · BABA-compliant
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** AFL (Fujikura subsidiary) is a major US cable assembler focused on utility, datacenter, and enterprise fiber optic infrastructure. Produces specialty cables for power utilities, military, and hyperscale datacenter applications. Fully US-based manufacturing makes AFL a BABA-compliant domestic supplier for government-funded broadband and defense programs.
- **stats:**
  - Ownership: Fujikura subsidiary
  - Headquarters: Duncan, SC, USA
  - Focus: Utility + DC + defense
  - Advantage: US domestic manufacturing
- **risk:** Private company — no direct investment vehicle.
- **inv:** No direct investment — privately held Fujikura subsidiary. Indirect exposure via Fujikura (5803 TSE).
- **risks:**
  - No listed equity vehicle
  - Dependent on Fujikura parent strategy
  - US utility cable market has different demand cycle than datacenter
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `assembler-alcatel-sn`
- **name:** Alcatel SN
- **type:** Subsea cable manufacturer
- **ticker:** TBD
- **country:** France
- **location_detail:** Paris, France
- **layer:** Assembly
- **output_headline:** ~20%+ submarine wet-plant · French state-owned
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Alcatel Submarine Networks is one of three companies controlling over 60% of global submarine cable wet-plant revenue. Recently transferred to French state ownership — underscoring governments' heightened interest in controlling critical subsea infrastructure. Partners with hyperscalers (Google, Meta, Microsoft, Amazon) building private submarine cable systems. Signed partnership with leading cloud provider for next-generation submarine cable system in July 2025.
- **stats:**
  - Ownership: French state (post Nokia divestiture)
  - Market share: ~20%+ submarine wet-plant
  - Customers: Hyperscalers + telecoms
  - Strategic: French critical infrastructure asset
- **risk:** Recently transferred to French state ownership — geopolitical asset.
- **inv:** Exposure via Nokia (NOKIA HE) prior to divestiture. Now French state asset. AI hyperscalers are funding private subsea cables directly, driving unprecedented demand.
- **risks:**
  - Geopolitical risk around cable routes and landing rights
  - Subsea projects have 3-5 year lead times — lumpy revenue
  - State ownership may affect commercial flexibility
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `assembler-subcom`
- **name:** SubCom
- **type:** Subsea cable manufacturer
- **ticker:** TBD
- **country:** USA
- **location_detail:** Eatontown, New Jersey, USA
- **layer:** Assembly
- **output_headline:** #2 global · cable + installation vessels · US-preferred
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** SubCom is the leading US submarine cable system supplier, combining cable manufacturing with marine installation vessels — a critical vertical integration that limits competition. SubCom controls a major share of US government-approved submarine cable projects given national security scrutiny of Chinese competitors. Expanding marine fulfillment capabilities to meet surging demand from 40 new submarine cable systems entering service in 2026.
- **stats:**
  - Ownership: Private · Cerberus Capital
  - Vertically integrated: Cable + installation vessels
  - 2026 pipeline: 40 new systems entering service
  - US advantage: National security preferred vendor
- **risk:** Private — no direct investment vehicle.
- **inv:** No direct investment — private Cerberus portfolio company. An IPO or strategic sale would be significant given AI-driven subsea demand.
- **risks:**
  - Private — no investment access
  - Revenue concentration in large contracts
  - US government scrutiny of subsea cable routes
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `assembler-nec`
- **name:** NEC
- **type:** Subsea cable manufacturer
- **ticker:** TBD
- **country:** Japan
- **location_detail:** Tokyo, Japan
- **layer:** Assembly
- **output_headline:** 400,000+ km deployed · Asia-Pacific dominant
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** NEC Corporation has deployed over 400,000 km of undersea cables worldwide, making it one of the most experienced submarine cable installers globally. Dominant in the Asia-Pacific submarine cable market. Unveiled new submarine cable system for Asia in September 2025 to meet growing data traffic. Competes with SubCom and Alcatel Submarine Networks for hyperscaler private cable projects.
- **stats:**
  - Ticker: 6701 · TSE
  - Deployed: 400,000+ km subsea
  - Region: Asia-Pacific dominant
  - 2025: New system for Asian AI traffic
- **risk:** Subsea is a minority of NEC's total revenue.
- **inv:** NEC is a diversified Japanese IT company — subsea cable is important but not dominant. Indirect play via TSE listing.
- **risks:**
  - Subsea is minority of revenue
  - TSE listing limits western access
  - Japanese government IT services is the primary business
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `product-datacenter-cable`
- **name:** Datacenter Cable
- **type:** Cable specification
- **ticker:** TBD
- **country:** Global
- **location_detail:** Global
- **layer:** Cable Type
- **output_headline:** 96 to 6,912 fibers/cable · AI demand +500% 2025–2026
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Datacenter fiber optic cable connects GPU clusters, spine-leaf switching networks, and datacenter interconnects. AI datacenters require 36x more fiber than traditional CPU racks — a single million-GPU cluster can consume tens of thousands of fiber-km. High fiber count cables (1,728+ strands) are now standard for hyperscale AI builds. Prices surged 500%+ in 2025-2026 driven by AI demand. Meta's $6B Corning deal and Lumen's Corning agreement represent the new norm of multi-year locked supply.
- **stats:**
  - Fiber count: 96 to 6,912 per cable
  - AI multiplier: 36x more vs CPU rack
  - Price surge: +500% since Jan 2025
  - Key buyers: AWS · Google · Microsoft · Meta
- **risk:** Prices surged 500%+ in 2025–2026 on AI demand.
- **inv:** Invest in manufacturers with the highest datacenter revenue mix: Corning, CommScope.
- **risks:**
  - Commoditization risk as manufacturing scales
  - Hyperscaler in-sourcing risk
  - Demand tied entirely to datacenter capex cycles
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `product-terrestrial-long-haul`
- **name:** Terrestrial Long-Haul
- **type:** Cable specification
- **ticker:** TBD
- **country:** Global
- **location_detail:** Global
- **layer:** Cable Type
- **output_headline:** 12 to 432 fibers/cable · 213M fiber-miles needed US by 2029
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Long-haul terrestrial fiber cables carry internet backbone traffic between cities and datacenters. Standard single-mode fiber (G.652D) is the dominant cable type. US needs to add 213.3 million fiber miles by 2029 to support AI datacenter interconnect demands — more than doubling current installed base. 5G transport backhaul adds additional demand on top of existing FTTH and backbone replacement cycles.
- **stats:**
  - Fiber count: 12 to 432 per cable
  - US demand: 213M fiber-miles needed by 2029
  - Price: G.652D +150% since Jan 2025
  - Key operators: AT&T · Verizon · Deutsche Telekom
- **risk:** Telecom operator capex sensitivity.
- **inv:** More telecom-dependent than datacenter cable — slower growth but more stable recurring demand.
- **risks:**
  - Telecom operator capex cycles create demand volatility
  - 5G backhaul buildout varies by country
  - Competition from wireless backhaul alternatives
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `product-subsea-cable`
- **name:** Subsea Cable
- **type:** Cable specification
- **ticker:** TBD
- **country:** Ocean floors globally
- **location_detail:** Ocean floors globally
- **layer:** Cable Type
- **output_headline:** 8 to 24 fiber pairs · ~40 new systems entering service 2026
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** Submarine fiber optic cables carry ~99% of international internet traffic across ocean floors. Nearly 40 new submarine cable systems enter service in 2026 alone — the most active year in history, worth ~$6B in construction. Hyperscalers (Google, Meta, Microsoft, Amazon) now fund private submarine cables directly, bypassing traditional telecom carriers. SubCom, Alcatel Submarine Networks, and NEC collectively control >60% of wet-plant revenue. Each system uses Ge-doped single-mode fiber for the entire cable length.
- **stats:**
  - Fiber pairs: 8 to 24 per cable
  - 2026 pipeline: ~40 new systems · ~$6B
  - Market control: SubCom + ASN + NEC >60%
  - Hyperscaler shift: Private ownership growing fast
- **risk:** Geopolitical risk around cable routes and landing rights.
- **inv:** AI hyperscalers are funding private subsea cable projects. This structural demand shift benefits Alcatel SN and SubCom most directly.
- **risks:**
  - Geopolitical tension around cable landing rights
  - Repair costs and lead times are extremely high
  - Route concentration through a handful of landing stations
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

### `aggregate-deployed-fiber-network`
- **name:** Deployed Fiber Network
- **type:** Global fiber infrastructure
- **ticker:** TBD
- **country:** Global
- **location_detail:** Global
- **layer:** Output (Deployed)
- **output_headline:** ~720M fiber-km/yr
- **output_detail:** TBD
- **descriptor_pill:** TBD
- **quantity_pill:** TBD
- **status:** TBD
- **about:** The deployed fiber network measures route-km of installed cable infrastructure — distinct from the fiber-km strand output of the component layer. One route-km of terrestrial cable contains ~144 fiber-km of strand; one route-km of subsea cable contains ~16-24 fiber pairs. Global new cable deployment runs ~3-4M route-km/yr. AI datacenter demand requires an additional 2-3M route-km of high-density datacenter cable by 2026 — on top of existing telecom, FTTH, and backbone deployment. The gap cannot close before late 2027 due to the 18-24 month preform expansion lag at the component layer above.
- **stats:**
  - Output: ~720M fiber-km/yr
  - Routes: 3-4M route-km/yr
  - Conversion: 1 route-km = ~144 fiber-km strand
  - Supply gap: Cannot close before late 2027
- **risk:** Supply gap cannot close before late 2027 due to 18-24 month preform expansion lag.
- **inv:** The cable itself is a commodity. Invest in manufacturers with highest datacenter/subsea mix (Corning, Prysmian) or at the hyperscale operator level.
- **risks:**
  - Supply cannot triple without proportional GeCl₄ increase
  - Chinese export controls directly constrain capacity expansion
  - Demand pull-forward could exhaust western GeCl₄ stocks
- **wtmi_brief:** in page.tsx IDEA_BRIEFS (if applicable)

---

# Section 2: Chain Placements

### `supplier-umicore-gecl4` on fiber-optic-cable
- **relevance:** UMI is the most direct western investment vehicle for germanium supply chain exposure. Chinese export controls structurally improve Umicore’s pricing power.
- **chain_specific_risk:** DRC supply ramp risk. Single-facility concentration at Olen.
- **feeds_from:** []
- **feeds_into:** ["Corning", "Prysmian", "Fujikura"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `supplier-yunnan-chihong-gecl4` on fiber-optic-cable
- **relevance:** Chinese A-share listed. Indirect proxy for Chinese germanium pricing. No direct western investment vehicle.
- **chain_specific_risk:** Subject to Chinese export controls. Full US export ban since December 2024.
- **feeds_from:** []
- **feeds_into:** ["Sumitomo Electric", "Shin-Etsu", "YOFC"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `supplier-chinese-state-gecl4-plants` on fiber-optic-cable
- **relevance:** No direct western investment vehicle. Exposure only via Chinese state-owned enterprise listings.
- **chain_specific_risk:** Export controls block western access. MOFCOM licensed for any international shipments.
- **feeds_from:** []
- **feeds_into:** ["Sumitomo Electric", "Shin-Etsu", "YOFC"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `supplier-jsc-germanium-gecl4` on fiber-optic-cable
- **relevance:** No investment case. Sanctioned entity. Historically removed ~9% of western-accessible germanium supply.
- **chain_specific_risk:** Fully sanctioned. Zero western market access. Not a fiber supply chain participant.
- **feeds_from:** []
- **feeds_into:** ["Sumitomo Electric"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** true

### `entity-corning` on fiber-optic-cable
- **relevance:** GLW is the most liquid western proxy for AI infrastructure fiber demand. Multi-year datacenter backlogs give rare earnings visibility.
- **chain_specific_risk:** GeO₂/GeCl₄ supply constraint limits capacity expansion.
- **feeds_from:** ["Umicore GeCl4"]
- **feeds_into:** ["Optical Fiber Strand", "Datacenter Cable", "Terrestrial Long-Haul"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `entity-prysmian` on fiber-optic-cable
- **relevance:** PRY offers terrestrial and subsea exposure. Subsea demand is driven by AI hyperscalers building private subsea networks.
- **chain_specific_risk:** European telecom capex cycles. 18–24 month preform expansion lag.
- **feeds_from:** ["Umicore GeCl4"]
- **feeds_into:** ["Optical Fiber Strand", "Datacenter Cable", "Terrestrial Long-Haul"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `manufacturer-fujikura` on fiber-optic-cable
- **relevance:** TSE-listed with meaningful western investor access. Closest pure-play on the AI fiber demand + germanium supply constraint thesis.
- **chain_specific_risk:** Full Umicore dependency for GeCl₄ — no domestic Japanese alternative.
- **feeds_from:** ["Umicore GeCl4"]
- **feeds_into:** ["Optical Fiber Strand"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `entity-sumitomo-electric` on fiber-optic-cable
- **relevance:** Unique dual exposure: AI fiber demand and EV wiring harness demand. Less pure-play than Fujikura given diversified revenue base.
- **chain_specific_risk:** Fiber is a minority of revenue — diversified industrial reduces direct germanium exposure.
- **feeds_from:** ["Yunnan Chihong GeCl4", "Chinese State GeCl4 Plants", "JSC Germanium GeCl4"]
- **feeds_into:** ["Optical Fiber Strand", "Datacenter Cable", "Terrestrial Long-Haul"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `manufacturer-shin-etsu` on fiber-optic-cable
- **relevance:** Unique dual-exposure play: AI chip demand drives silicon wafer volumes AND AI datacenter buildout drives fiber preform volumes.
- **chain_specific_risk:** Silicon wafer oversupply risk if AI chip demand cycles down.
- **feeds_from:** ["Yunnan Chihong GeCl4", "Chinese State GeCl4 Plants"]
- **feeds_into:** ["Optical Fiber Strand"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `manufacturer-yofc` on fiber-optic-cable
- **relevance:** HKEX-listed with more western accessibility than SSE. The Corning JV structure creates a direct link between Chinese Ge supply and western fiber manufacturing IP.
- **chain_specific_risk:** Chinese state-backed. Geopolitically complex. Corning JV creates IP exposure.
- **feeds_from:** ["Yunnan Chihong GeCl4", "Chinese State GeCl4 Plants"]
- **feeds_into:** ["Optical Fiber Strand"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `aggregate-optical-fiber-strand` on fiber-optic-cable
- **relevance:** The cable itself is a commodity. Invest in manufacturers with highest datacenter/subsea mix (Corning, Prysmian) or at the hyperscale operator level.
- **chain_specific_risk:** Supply gap cannot close before late 2027 due to 18–24 month preform expansion lag.
- **feeds_from:** ["Corning", "Prysmian", "Fujikura", "Sumitomo Electric", "Shin-Etsu", "YOFC"]
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `assembler-commscope` on fiber-optic-cable
- **relevance:** COMM is a more leveraged play on US datacenter infrastructure buildout. Higher risk than Corning but also higher upside if datacenter spending continues.
- **chain_specific_risk:** $9B+ debt load from 2019 ARRIS acquisition.
- **feeds_from:** []
- **feeds_into:** ["Datacenter Cable", "Terrestrial Long-Haul"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `assembler-afl` on fiber-optic-cable
- **relevance:** No direct investment — privately held Fujikura subsidiary. Indirect exposure via Fujikura (5803 TSE).
- **chain_specific_risk:** Private company — no direct investment vehicle.
- **feeds_from:** []
- **feeds_into:** ["Datacenter Cable", "Terrestrial Long-Haul"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `assembler-alcatel-sn` on fiber-optic-cable
- **relevance:** Exposure via Nokia (NOKIA HE) prior to divestiture. Now French state asset. AI hyperscalers are funding private subsea cables directly, driving unprecedented demand.
- **chain_specific_risk:** Recently transferred to French state ownership — geopolitical asset.
- **feeds_from:** []
- **feeds_into:** ["Subsea Cable"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `assembler-subcom` on fiber-optic-cable
- **relevance:** No direct investment — private Cerberus portfolio company. An IPO or strategic sale would be significant given AI-driven subsea demand.
- **chain_specific_risk:** Private — no direct investment vehicle.
- **feeds_from:** []
- **feeds_into:** ["Subsea Cable"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `assembler-nec` on fiber-optic-cable
- **relevance:** NEC is a diversified Japanese IT company — subsea cable is important but not dominant. Indirect play via TSE listing.
- **chain_specific_risk:** Subsea is a minority of NEC's total revenue.
- **feeds_from:** []
- **feeds_into:** ["Subsea Cable"]
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `product-datacenter-cable` on fiber-optic-cable
- **relevance:** Invest in manufacturers with the highest datacenter revenue mix: Corning, CommScope.
- **chain_specific_risk:** Prices surged 500%+ in 2025–2026 on AI demand.
- **feeds_from:** ["Corning", "Prysmian", "Sumitomo Electric", "CommScope", "AFL"]
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `product-terrestrial-long-haul` on fiber-optic-cable
- **relevance:** More telecom-dependent than datacenter cable — slower growth but more stable recurring demand.
- **chain_specific_risk:** Telecom operator capex sensitivity.
- **feeds_from:** ["Corning", "Prysmian", "Sumitomo Electric", "CommScope", "AFL"]
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `product-subsea-cable` on fiber-optic-cable
- **relevance:** AI hyperscalers are funding private subsea cable projects. This structural demand shift benefits Alcatel SN and SubCom most directly.
- **chain_specific_risk:** Geopolitical risk around cable routes and landing rights.
- **feeds_from:** ["Alcatel SN", "SubCom", "NEC"]
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

### `aggregate-deployed-fiber-network` on fiber-optic-cable
- **relevance:** The cable itself is a commodity. Invest in manufacturers with highest datacenter/subsea mix (Corning, Prysmian) or at the hyperscale operator level.
- **chain_specific_risk:** Supply gap cannot close before late 2027 due to 18-24 month preform expansion lag.
- **feeds_from:** ["Datacenter Cable", "Terrestrial Long-Haul", "Subsea Cable"]
- **feeds_into:** []
- **show_on_tree:** true
- **show_in_wtmi:** TBD
- **wtmi_category_tag:** TBD
- **wtmi_display_order:** TBD
- **minor:** false

---

# Section 3: Chain Structure

## COMP chain (GeO₂ / GeCl₄)
**geCl4:** ["Umicore GeCl4", "Yunnan Chihong GeCl4", "Chinese State GeCl4 Plants", "JSC Germanium GeCl4"]
**fiberMfg:** ["Corning", "Prysmian", "Fujikura", "Sumitomo Electric", "Shin-Etsu", "YOFC"]
**output:** Optical Fiber Strand
**geCl4ToFiber:** [[0, 0], [0, 1], [0, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 3]]
**fiberToOutput:** [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]
**minor:** {"geCl4": [3], "fiberMfg": []}

## SUB chain (Fiber Optics)
**assembly:** ["Corning", "Prysmian", "Sumitomo Electric", "CommScope", "AFL", "Alcatel SN", "SubCom", "NEC"]
**cableType:** ["Datacenter Cable", "Terrestrial Long-Haul", "Subsea Cable"]
**output:** Deployed Fiber Network
**assToType:** [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [4, 1], [5, 2], [6, 2], [7, 2]]
**minor:** {"assembly": [], "cableType": []}