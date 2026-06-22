# Gallium — Input Page
Type: Raw material
Vertical: AI Infrastructure
Layer: Raw Materials
Status: Constrained
Generated: 2026-04-21

---

## EXECUTIVE SUMMARY

- Trace element recovered as a byproduct of alumina refining from bauxite, and to a lesser extent from zinc smelter residues. Cannot be mined directly. Global resources are abundant — the constraint is refining infrastructure, not geology.

- Forms compound semiconductors (GaAs and GaN) that are grown onto wafers and used as the foundation for chips. Found in AI datacenter power conversion, 5G amplifiers, LEDs, EV chargers, satellite solar cells, and AESA defense radar.

- Global refined production is ~320 t/yr. Roughly 290 t is Chinese; ~15-30 t is non-Chinese, almost entirely Japan via Dowa Holdings. China holds ~1,000 t/yr of installed capacity running at ~59% utilization — a deliberate overhang Beijing can tighten or release.

- Price has risen from $298/kg to $2,269/kg since 2020 on western retail benchmarks, with a 9x spread between Chinese domestic ($245/kg) and western markets. The spread persists because export licensing prevents arbitrage.

- Demand accelerating from GaN power electronics (42% CAGR), defense radar modernization, and AI datacenter 800V power conversion architecture. Every major western demand vector is stable or growing.

- Four concurrent western primary production projects collectively target ~230 t/yr by 2029, a ~10x increase from current non-Chinese supply. None resolves the structural dependency before 2028.

**The investable surface of the gallium supply chain is the rebuild itself — emerging primary producers backed by sovereign capital, and refiners with pricing power in the non-Chinese supply gap.**

---

## SUPPLY TREE

### Key Takeaways

1. Bauxite is mined globally across five regions — Guinea, Australia, China, Brazil, and Indonesia — with ~346M tonnes produced per year.

2. Gallium isn't extracted at the mine — it's recovered downstream at alumina refineries that have ion-exchange recovery circuits installed, and ~98% of those refineries are in China.

3. Four western projects are trying to rebuild primary capacity — Alcoa/JAGA in Australia, Metlen in Greece, Rio Tinto in Quebec, Korea Zinc/Crucible in Tennessee — but none operate at scale before 2028.

4. Outside China, Dowa in Japan does the bulk of high-purity refining, with smaller capacity at 5N Plus in Canada and Indium Corporation in the US — but all of them depend on Chinese primary feedstock to operate.

---

[Tree visualization renders here from gallium-supply-tree.md]

---

### How It's Made

*Three layers feed the supply tree above. Each is a distinct industrial operation with its own operators, economics, and bottlenecks.*

#### BYPRODUCT SOURCE

Bauxite-producing regions where gallium sits as a trace impurity in the ore.

**WHAT HAPPENS HERE**
Bauxite is mined and shipped to alumina refineries worldwide. Gallium is not extracted at this layer — it rides along inside the bauxite at ~50 ppm as the ore moves downstream.

**WHY IT'S HARD**
Gallium content is uniform across essentially all bauxite globally. You cannot "find better bauxite" for gallium. Output is determined by aluminum industry decisions, not gallium demand — which is why gallium supply cannot scale independently of aluminum.

**~346M t/yr** bauxite mined globally

#### PRIMARY PRODUCER

Alumina refineries that recover gallium from the bauxite processing stream.

**WHAT HAPPENS HERE**
Bauxite is processed into alumina for aluminum production. Refineries with ion-exchange circuits installed capture the dissolved gallium as a byproduct. Refineries without that equipment discard it as waste.

**WHY IT'S HARD**
Only ~20 alumina refineries globally have gallium recovery installed, almost all in China. Recovery captures only 10-15% of gallium in the bauxite stream. Western projects must solve the economics that shut down Germany, Hungary, and Kazakhstan between 2013 and 2016.

**~600 t/yr** primary gallium extracted globally

#### REFINER

Specialty refiners that purify crude gallium to semiconductor grade.

**WHAT HAPPENS HERE**
Crude 99.99% gallium is purified to 99.9999%+ via zone refining, vacuum distillation, and electrolytic processes. Different end uses need different grades — LEDs need 6N, defense radar needs 7N, next-generation chips need 8N.

**WHY IT'S HARD**
Each additional "nine" of purity is exponentially harder than the last. Removing the final parts per billion of iron, copper, and zinc requires proprietary process knowledge. Western refiners (Dowa, 5N Plus) depend on Chinese primary feedstock to operate.

**~320 t/yr** high-purity refined gallium produced globally

---

### Nodes

*The full set of supply tree nodes — including universal records for every entity, per-chain placement data, and feeds_from/feeds_into edges — lives in `gallium-supply-tree.md`. The platform reads that file to render the interactive tree visualization above. The gallium tree covers the Bauxite Source, Primary Producer, and Refiner layers; downstream compound semiconductor wafer manufacturers (AXT, Sumitomo Electric, Freiberger, IQE) and GaN device manufacturers (Navitas, Infineon, Innoscience, EPC) live on their own input pages — see Connected Inputs below.*


## DEPENDENCIES

### Downstream

| Product | Usage | Est. value (gallium @ $1,750/kg) | Share | End uses | Growth |
| --- | --- | --- | --- | --- | --- |
| GaAs substrates & devices | ~140t/yr | ~$245M | 31% | 5G RF handsets, LEDs, satellite solar cells, laser diodes | Growing (+8%) |
| GaN devices (power + RF) | ~110t/yr | ~$193M | 24% | AI datacenter 800V, EV onboard chargers, 5G base stations, defense radar | Surging (+42%) |
| NdFeB magnets (dopant) | ~80t/yr | ~$140M | 18% | EV traction motors, wind turbines, consumer electronics | Growing (+15%) |
| LED lighting (general + display) | ~75t/yr | ~$131M | 17% | General lighting, automotive, display backlighting | Stable (+2%) |
| Defense radar & EW (GaN specific) | ~25t/yr | ~$44M | 5% | AN/SPY-6, LTAMDS, Patriot, F-35 APG-81, G/ATOR | Surging (+35%) |
| Satellite solar cells | ~12t/yr | ~$21M | 3% | LEO constellations, deep space | Surging (+57%) |
| Other (thermometers, alloys, R&D) | ~8t/yr | ~$14M | 2% | Specialty applications | Stable |
| Total | ~450t/yr | ~$788M | 100% | ~800t by 2028 (+78%) |

*Est. value column reflects the value of gallium metal itself consumed in each end use, priced at ~$1,750/kg (western retail blended average, April 2026). This understates the strategic importance of gallium — the downstream semiconductor products built on it represent billions of dollars of enabled value — but reflects the actual market for the raw material.*

**Takeaway:** GaN power and defense applications are the two demand vectors with no substitutes and inelastic pricing. Together they represent ~29% of current demand and effectively all of the demand growth through 2028. The LED and NdFeB segments are large but mature; GaAs is growing incrementally on 5G handset replacement cycles.

---

## SUPPLY → DEMAND

### SUPPLY
- **Value:** 320 t/yr
- **Context:** Refined supply is ~320t/yr — 290t Chinese, 15-30t non-Chinese. Primary supply cannot scale independently of aluminum production, and refining capacity outside China would take 3-5 years to build meaningfully.

### DEMAND
- **Value:** 800 t/yr (projected 2028)
- **Context:** Up from ~450t in 2024. Majority of growth comes from GaN power electronics (+42% CAGR) and defense radar. See Dependencies table for the full demand breakdown.

### GAP
- **Value:** 480 t/yr shortfall by 2028
- **Context:** The constraint is refining infrastructure and policy, not geological scarcity — global gallium resources exceed 600,000 tonnes. The four announced western projects add ~230 t/yr by 2029, meaningfully narrowing but not closing the western-demand gap if Chinese supply remains export-controlled.

---

## SO WHAT

### Block 1 — Market signals
*What is the price telling us?*

**Teaser:** Western retail price has risen 7.6x in five years because supply is structurally constrained, not because the market is speculative.

Gallium is one of the most opaque commodity markets in existence. There is no futures contract, no exchange listing, no standardized benchmark. All transactions are OTC, negotiated bilaterally between producers and consumers, with reference prices published by Fastmarkets, Asian Metal, and Shanghai Metal Market (SMM) based on trade reports rather than binding market prices.

The western retail price for 99.99% gallium has moved from approximately $298/kg at the start of 2020 to $2,269/kg as of April 17, 2026 — an increase of 661%. Most of that move occurred after August 2023, when China implemented export licensing, with a further acceleration after the December 2024 US-targeted ban. Price gained 83% in 2025 alone and a further 32% year-to-date through April 2026. The Strategic Metals Invest retail benchmark of $2,269/kg and the Fastmarkets in-warehouse Rotterdam benchmark of ~$1,750/kg bracket the range at which non-Chinese commercial buyers are actually transacting.

The Chinese domestic 4N spot price, by contrast, sits at ~$245/kg on the SMM benchmark as of March 2026 — below the 2022 peak of $510/kg. This anomaly reveals the structural bifurcation: Chinese domestic capacity (~1,000 t/yr) vastly exceeds Chinese domestic consumption, producing chronic oversupply that suppresses domestic pricing. The 9x spread between Chinese domestic and western retail persists because export controls prevent arbitrage. Western buyers pay a "security premium" that reflects not material scarcity but access scarcity.

The opacity creates three dynamics relevant to the investment thesis. First, price discovery is asymmetric and slow — major supply disruptions or policy changes take weeks to fully reflect in transaction prices. Second, no hedging mechanism exists. Buyers accept spot exposure, negotiate long-term contracts, or stockpile inventory. Third, the lack of futures trading removes a standard channel for expressing a view on gallium pricing through liquid instruments — exposure must be intermediated through equities.

### Block 2 — Supply constraints
*Why can't supply respond?*

**Teaser:** New western production sites won't be online until 2029 and all meaningful refining infrastructure is currently in China.

Gallium production faces four compounding constraints that prevent rapid supply response even under strong price signals.

First, byproduct dependency: gallium exists at ~50 ppm in bauxite and at trace concentrations in zinc ores. It cannot be mined directly; it must be recovered from the liquor streams of alumina refineries or from zinc smelter residues. This fundamentally ties gallium output to aluminum and zinc production rates, which are driven by their own economics.

Second, low recovery yields: at typical bauxite feed concentrations, only ~10-15% of contained gallium is actually captured during the Bayer process. The rest reports to red mud and aluminum hydroxide waste streams. Improving recovery requires capital investment at refineries that treat gallium as an incidental byproduct, not a core revenue line. Coal-ash extraction yields are even lower at 2-4%.

Third, refining capacity concentration: global high-purity gallium refining capacity sits at ~340 t/yr, of which ~290 t/yr is Chinese. Non-Chinese refining is ~15-30 t/yr, dominated by Dowa Holdings in Japan, with smaller contributions from 5N Plus (Canada), Indium Corporation (USA), and PPM Pure Metals (Germany). Adding a new refinery requires ~3-5 years and specialized process IP that cannot be purchased off the shelf.

Fourth, primary production infrastructure lag: the four announced western primary production projects collectively target ~230 t/yr by 2029. Even if all four succeed on schedule — which requires the Alcoa FID, Metlen 10,000x scale-up, Rio Tinto commercial conversion, and Korea Zinc construction to all execute — the first meaningful tonnage does not hit the market until 2027-2028 for Metlen and Alcoa, with Korea Zinc's 2029 commercial operations representing the capstone.

None of these constraints resolves before the November 2026 Chinese ban suspension expiry.

### Block 3 — Competing demand
*Who else needs this?*

**Teaser:** Every major demand vector is growing or stable, and the largest — GaN power electronics — is accelerating at 42% annually.

Gallium demand comes from five distinct end uses. Each one is structurally different — a recession in one would not meaningfully drag down the others.

**AI datacenters.** When NVIDIA builds an AI factory, the racks of GPUs need electricity converted from the building's power supply down to the low voltages the chips actually run at. Traditional silicon-based power converters waste too much of that electricity as heat. GaN power chips — tiny switches built on gallium nitride — do the same job with roughly 30% less energy lost and in a fraction of the physical space. NVIDIA is standardizing on a new 800V power architecture across its next generation of AI factories, and GaN chips are the default choice for the voltage conversion. Every gigawatt of AI datacenter capacity needs thousands of these chips — and AI capacity is being built out at a pace unprecedented in datacenter history. This demand vector barely existed two years ago.

**Defense radar and electronic warfare.** Modern military radars — the ones on US Navy destroyers (AN/SPY-6), Army missile defense (LTAMDS), Patriot batteries, Marine Corps G/ATOR, and F-35 fighter jets — all use GaN chips to generate and receive the radio waves. The job requires pushing a lot of electrical power into very high-frequency signals, then handling the heat that generates. GaN is the only semiconductor that can do this reliably in the size-weight-power envelope a radar needs. The USGS states explicitly: no substitute exists. Defense procurement is funded by government budgets, not commercial pricing, which makes this segment completely insensitive to gallium price moves. If the Pentagon needs gallium for a radar program, it pays whatever the price is.

**EV onboard chargers.** Every electric vehicle has an onboard charger — the component that converts AC power from the wall into DC power for the battery. GaN chips in the charger mean faster charging, less weight, and better range (less weight means less battery drain). This segment is growing at ~73% CAGR as automakers migrate from 400V to 800V vehicle architectures, where GaN's efficiency advantages over silicon become decisive.

**NdFeB permanent magnets.** This is gallium's largest consumption channel inside China but is barely a line item outside it. Gallium is added at 0.1-0.2% to the magnet alloy used in EV motors and wind turbines. The gallium improves the magnet's ability to hold its strength at high temperatures — critical when the magnet sits inside a motor running at 150°C. Chinese NdFeB output is growing ~15% annually, absorbing gallium that would otherwise be available for export.

**LEDs.** The original and still-largest volume use for gallium — the blue LED that won its inventors the 2014 Nobel Prize in Physics is made from gallium nitride. Every white LED in lighting, every screen backlight, every automotive headlight, uses a GaN-based chip. The segment is mature and grows at only ~2% annually, but it provides a stable demand floor.

The overall picture: four of the five major end uses are growing structurally. The fifth (LEDs) is stable. There is no scenario where gallium demand softens materially unless AI infrastructure, defense spending, EV adoption, and wind/EV motor production all reverse simultaneously.

### Block 4 — Geopolitical risk
*How could it get worse?*

**Teaser:** China controls 99% of primary supply and has already demonstrated willingness to weaponize it — the November 2026 export ban expiry is a binary event.

Gallium sits at the intersection of US-China technology competition and critical minerals policy. The timeline of policy actions defines the investment picture more than any market fundamental.

On July 3, 2023, China's Ministry of Commerce announced export controls on gallium and germanium, effective August 1. The controls required exporters to submit end-use documentation and obtain licenses. Chinese gallium exports dropped 63.5% year-over-year in the remainder of 2023.

On December 3, 2024 (MOFCOM Notice 2024 No. 46), China escalated to a targeted ban on exports of gallium, germanium, antimony, and superhard materials to the United States — framed as response to the December 2 US Bureau of Industry and Security addition of 140 entities to the Entity List. Chinese customs data confirmed zero direct gallium or germanium shipments to the US throughout 2024.

On October 9, 2025, China announced a sweeping expansion of export controls covering rare earths and rare earth technologies (Announcements 55-58, 61, 62), including extraterritorial licensing of Chinese-origin material. This expansion triggered a US-China trade truce following the November 1, 2025 Trump-Xi meeting.

On November 7-9, 2025, MOFCOM formally suspended the December 2024 licensing/review restrictions on gallium, germanium, antimony, and graphite until November 2026. General licenses are now available for exports to US end users. The military end-use ban remains in force.

The November 2026 expiry is the single most important dated event in this market. Reimposition of the ban would return the western supply picture to December 2024 conditions, widening the price spread and re-strengthening every western supply thesis. Extension of the suspension or full normalization would compress the spread and pressure the economics of emerging western capacity projects. Every investment position in the gallium chain should be stress-tested against both outcomes.

### Block 5 — Supply response
*What's being done?*

**Teaser:** Four western production projects are underway and collectively target 230t/yr by 2029, but none resolves the gap before 2028.

The western supply response is unprecedented in scale but tightly concentrated in 2027-2029 delivery windows. Four sovereign-backed projects together target ~230 t/yr of non-Chinese capacity — a 10x increase from current ~15 t/yr non-Chinese output.

Alcoa of Australia, in joint venture with Japan Australia Gallium Associates (Sojitz + JOGMEC), targets 100 t/yr at a Western Australian alumina refinery. The US, Australian, and Japanese governments are joining the special purpose vehicle. Australia committed AUD 200M in concessional equity finance. Final Investment Decision was "expected by end 2025" but has not been publicly confirmed as of April 2026. Production start is targeted for late 2026 with ramp to 100 t/yr by 2028-2029.

Metlen Energy & Metals took Final Investment Decision in January 2025 on a €295.5M project at Agios Nikolaos, Greece. First production of 5 kg was achieved in January 2026, proving the patented extraction technology at industrial scale. Ramp targets 50 t/yr by 2028 — sufficient to fully cover EU demand. The European Investment Bank approved €90M in financing in January 2026.

Rio Tinto Aluminium and Indium Corporation successfully extracted gallium at laboratory scale from the Vaudreuil refinery in Saguenay, Quebec, in May 2025. A demonstration plant targeting up to 3.5 t/yr is planned with Quebec government support. Commercial-scale conversion targets 40 t/yr, representing 5-10% of current world production. Timeline post-2028.

Korea Zinc's Crucible JV, announced December 2025, represents a $7.4B investment with the US Department of Defense holding a 40% equity stake, JPMorgan Chase advising, and $4.7B in US government loans. The facility will replace the existing Nyrstar Clarksville smelter and produce 540,000 tonnes annually of critical minerals including gallium (~40 t/yr). Site preparation begins 2026; commercial operations begin 2029. The DoD equity stake is unprecedented for a processing facility and signals that gallium is being treated as a strategic defense asset.

If all four projects execute on schedule, western primary capacity approaches 230 t/yr by 2029 — meaningful in terms of access independence but still less than one-third of projected 2028 global demand. Chinese capacity remains dominant.

### Block 6 — Technology
*What could change the game?*

**Teaser:** No commercial substitute exists for GaN in defense or high-performance power electronics, and the closest alternatives are at least a decade away from displacement scale.

Three technology paths could alter the supply-demand balance on a 3-5 year horizon, but none resolves the near-term constraint.

Silicon-based CMOS power amplifiers compete with GaAs in low-end 3G and 4G cellular handsets but cannot replace GaAs in 5G/6G premium handsets where power density and frequency requirements are higher. Indium phosphide (InP) substitutes for GaAs in specific infrared laser diode applications and is growing rapidly in AI datacenter silicon photonics — AXT's InP revenue grew more than 250% sequentially in Q3 2025 — but does not substitute for GaN in RF or power applications. Silicon carbide (SiC) is complementary to GaN across the power electronics stack rather than a substitute: SiC dominates >1200V applications and GaN dominates <650V applications, with GaN-on-SiC wafers actually consuming both materials.

For defense radar and electronic warfare applications, no substitute exists. GaN's combination of power density, frequency capability, and thermal performance is structurally superior to alternatives. The Department of Defense has funded GaN-on-SiC manufacturing through DARPA programs since 2002, and every current US military active-array radar (AESA) deployment uses GaN modules.

Efficiency improvements in gallium recovery are technically available but not transformative. Ion-exchange resin technology could lift bauxite-liquor capture rates from 10-15% to 20-25%, raising theoretical supply meaningfully — but requires capital at refineries that treat gallium as an ancillary revenue stream, and even at doubled yields the incremental tonnage takes years to reach the market.

Recycling is structurally limited by the geography of consumption. Substantial quantities of new scrap from GaAs device manufacturing are recycled at Indium Corporation's New York facility and at similar operations in Canada, Japan, and Slovakia. Old-scrap recycling from end-of-life consumer devices is effectively zero because gallium concentrations in devices are too low to recover economically. Improved recycling rates could provide 10-20% additional supply on a 5-10 year horizon if device manufacturing geography shifts — but not before the current constraint window closes.

The substitution and efficiency technologies all arrive after the investable window. The near-term picture is determined by policy (the November 2026 suspension) and by primary supply execution (Alcoa FID, Metlen scale-up).

---

## RISK

### What could ease supply

**China extends the suspension or lifts controls entirely.** Would collapse the 9x western premium rapidly. The November 1, 2025 trade truce demonstrated that Beijing can unwind controls when strategic calculus shifts. Base case is suspension renewal; risk of full normalization remains real.

**Alcoa Wagerup reaches production on schedule.** 100 t/yr non-Chinese supply hitting the market in late 2026 would materially improve western access. FID not yet publicly confirmed; any slippage pushes this out to 2027 or beyond.

**Metlen scales from 5 kg to 50 t/yr without execution slippage.** The 10,000x scale-up is technically aggressive. If delivered on schedule, fully covers EU demand and reduces European pricing premium.

**Recovery rates at alumina refineries improve industry-wide.** Ion-exchange technology could push bauxite-liquor yields from 10-15% to 20-25%. Requires capital investment at refineries that don't prioritize gallium. Timeline 3-5 years if industry adoption accelerates.

### What could soften demand

**AI infrastructure spending decelerates.** The GaN power demand story is heavily weighted to AI datacenter 800V HVDC build-out. A correction in AI capex would slow the 42% CAGR and reduce near-term pressure on gallium supply. Defense demand persists independently.

**EV penetration growth slows.** EV onboard chargers are projected to grow at 73% CAGR. A durable deceleration in global EV sales would slow GaN power device demand and, separately, the NdFeB magnet dopant channel that consumes Chinese domestic gallium.

**GaN-on-Si migration reduces gallium intensity per device.** The industry shift from 6-inch GaN-on-SiC to 8-inch GaN-on-Si improves wafer economics and could reduce gallium usage per device. This slows demand growth but does not reverse it.

**Broader semiconductor cycle correction.** GaAs handset RF demand tracks global smartphone sales. A multi-year smartphone downturn would reduce GaAs substrate demand and new-scrap recycling feedstock simultaneously.

**Bottom line:** The central risk resolves in November 2026 when the Chinese ban suspension expires. Until then, western supply remains structurally short and western pricing holds. After November 2026, the market bifurcates based on policy outcome — a path-dependent variable that no investor can independently forecast but that every linked position must be stress-tested against.

---

## WHERE THE MONEY IS

### Idea list

*Grouped by supply tree layer, from primary production through device manufacturing and direct commodity exposure.*

---

#### Primary Producer layer

##### Alcoa Corporation · AA · NYSE · `Capacity builder`
Operator of the announced 100 t/yr Wagerup gallium project — the single largest non-Chinese primary production facility in development.

##### Metlen Energy & Metals · MYTIL · Athens Stock Exchange · `Capacity builder`
Europe's first industrial gallium producer — 50 t/yr by 2028 fully covers EU demand.

##### Rio Tinto · RIO · NYSE / LSE / ASX · `Feedstock supplier`
Global aluminum producer with a demonstration gallium plant at Vaudreuil, Quebec — optionality on North American primary supply.

##### Korea Zinc · 010130.KS · Seoul · `Market maker`
Anchor of the $7.4B Crucible JV with the US Department of Defense holding a 40% equity stake.

##### Chinese Primary Supply · Aggregate · `Market maker`
98% of global primary production; the entity whose MOFCOM export licensing determines whether the western scarcity premium holds.

---

#### Refiner layer

##### Dowa Holdings · 5714.T · Tokyo · `Chokepoint holder`
Leading non-Chinese high-purity gallium refiner — the de facto western pipeline for GaAs wafer supply.

##### 5N Plus · VNP · TSX · `Pure-play`
Canadian specialty semiconductor refiner with multi-metal exposure — the most direct western investment vehicle for critical minerals refining.

---

#### Direct exposure

##### Gallium metal · Physical commodity · `Direct exposure`
No futures contract, no ETF, no exchange pricing. Western retail price up 7.6x since 2020 on bifurcated market structure.

---

### Alcoa Corporation — Full Brief
*AA · NYSE · AAI · ASX*

**Metrics:**
- Market cap: ~$10B
- Revenue: ~$12B (TTM)
- EBITDA: ~$1.5B
- Stock price: ~$40
- 12-month change: +15-20%

**What is this and why does it matter here?:**

Alcoa is one of the world's largest aluminum producers, vertically integrated across the full upstream stack — bauxite mining, alumina refining, and aluminum smelting. The company operates major bauxite mines in Australia, Brazil, and Guinea; alumina refineries across multiple continents; and aluminum smelters in North America, Europe, and Australia. The bulk of revenue comes from primary aluminum sales to automakers, construction firms, packaging companies, and industrial buyers. Gallium has historically not been part of the business.

What puts Alcoa on this page is a project announced in October 2025 that materially repositions the company in the western critical minerals supply story: Alcoa committed to building a gallium recovery facility at one of its Western Australian alumina refineries, targeting 100 tonnes per year of primary gallium output. That single facility, if executed, would produce approximately 10% of current global gallium demand and represent a roughly 10x increase in total non-Chinese primary gallium supply. The project is structured as a four-government joint venture — Japanese government-backed entities, the Australian government, the US government, and Alcoa as the operator — with each government party receiving gallium offtake in proportion to its investment.

The strategic significance is twofold. First, it inserts Alcoa into the gallium chain as the largest single non-Chinese capacity-builder before any of the other three western projects (Metlen, Rio Tinto/Indium Corp, Korea Zinc/Crucible) reach FID. Second, it establishes a model — sovereign-backed offtake of byproduct critical minerals from existing alumina refineries — that other Alcoa refineries could replicate if the first facility succeeds.

**How does value flow through this entity?:**

Alcoa's gallium business, if the project gets built, captures value through several mechanisms beyond simple commodity production:

**Low incremental capital and operating cost.** The bauxite, alumina refinery infrastructure, and Bayer process liquor stream already exist. Adding gallium recovery means installing ion-exchange resin columns and an electrolysis circuit on a side stream of the refinery's existing process flow. The marginal capex is modest relative to greenfield mining projects, and the incremental opex is small — energy, reagents, and labor on top of operations that already run. The economics look attractive because Alcoa is monetizing a stream the refinery currently discards.

**Sovereign offtake and de-risked demand.** The four-government structure (US DoD/DoE, Australian government, Japan via JOGMEC and Sojitz, Alcoa) means a meaningful share of output is pre-committed at known terms before the facility is operational. JAGA (Japan Australia Gallium Associates) is the joint venture vehicle. Australia has committed AUD 200M in concessional equity. The US signed on in October 2025. Sovereign offtake doesn't necessarily mean above-market pricing — it does mean revenue visibility and reduced commercial risk during ramp-up.

**Strategic positioning value.** For Alcoa specifically, gallium is small relative to its aluminum P&L. At 100 t/yr and ~$1,500/kg realized western pricing, gross gallium revenue would be roughly $150M annually — about 1.3% of Alcoa's ~$12B revenue base. The valuation impact is not the gallium revenue itself; it's that Alcoa becomes the default allocation for sovereign and institutional mandates seeking western critical minerals exposure with operational backing. ESG mandates, defense industrial base funds, and critical minerals ETFs all need western primary-production exposure, and Alcoa is positioning to capture that flow.

**Replicability across Alcoa's refinery network.** If the first Western Australian facility succeeds, Alcoa has at least three to four other alumina refineries globally where similar bolt-on recovery could be deployed. That optionality isn't priced in today, but it's the long-tail upside on the gallium thesis for Alcoa specifically.

**What to watch:**
- **FID announcement.** "Expected by end 2025" was the stated target as of October 2025; as of April 2026 the FID has not been publicly announced. Any further delay signals execution risk and weakens the western supply response thesis. A confirmed FID with construction commencement is the single most important near-term catalyst for the entire western gallium project basket — Alcoa being first to FID would set the benchmark for the others.
- **JAGA SPV terms.** Pricing mechanics, offtake ratios, and government-share economics for the joint venture have not been fully disclosed publicly. The terms will determine whether Alcoa captures upside in tight-market scenarios or whether sovereign offtake locks in pricing at fixed levels. Watch for SEC and ASX disclosures around the JV structure.
- **Construction milestones.** Mining and refinery expansion projects routinely slip 12-24 months from initial targets, particularly in remote Western Australian locations with permitting and labor constraints. First production by late 2026 looks ambitious; 2027-2028 is more plausible. Track quarterly construction updates.
- **Bauxite and alumina cycle.** Alcoa's stock is dominated by aluminum prices and alumina market dynamics. The aluminum macro is the larger driver for the equity in the near term; gallium contributes optionality but doesn't move the stock until 2027-2028.
- **Replication signals.** If the Western Australian facility ramps successfully, watch for announcements about Alcoa's Brazilian (Juruti, Alumar) or other refineries adopting similar bolt-on recovery. That's where the multi-facility option becomes valuable.

**Investment angle:**

The thesis on Alcoa is aluminum-cycle exposure with gallium optionality attached, where the gallium optionality is currently undervalued because the project is pre-FID. For investors already comfortable with the aluminum cycle, Alcoa offers the clearest near-term path to meaningful western gallium production at the lowest incremental cost basis. The 100 t/yr target alone represents the largest single non-Chinese gallium capacity addition planned, and the sovereign-backed structure de-risks demand.

The variant perception that would make Alcoa undervalued: the market is treating the JAGA project as a small line item in an aluminum cyclical, but the strategic optionality across Alcoa's broader refinery network — and the precedent JAGA sets for future sovereign critical minerals partnerships — could compound over multiple projects. If Alcoa announces a second refinery facility within 18 months of first production at Wagerup/Pinjarra, the market re-rates the company from "aluminum cyclical" to "western critical minerals platform."

The bear case is execution risk plus aluminum exposure. Mining projects slip; the JAGA timeline is already tight. If first production slips to 2028, the gallium contribution won't materialize before the 2026-2027 western supply tightness window — by which time other projects (Metlen, Rio Tinto, Korea Zinc) may have caught up. And in the near term, an aluminum cycle downturn would compress Alcoa's valuation regardless of gallium progress.

For investors already positioned, the monitoring question is whether the JAGA FID happens in 2026 and whether the joint venture announces a second-facility intent within 18 months of that. If both happen, the gallium thesis on Alcoa transitions from optionality to material contributor.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (planned). Sources: Alcoa investor communications (October 2025), JOGMEC and Sojitz announcements, Australian government project commitments (2024). Not investment advice.*

---

### Metlen Energy & Metals — Full Brief
*MYTIL · Athens Stock Exchange · MTLN · London Stock Exchange*

**Metrics:**
- Market cap: €5.03B
- Revenue: €5.68B (FY2024)
- EBITDA: ~€900M
- Stock price: ~€48
- 12-month change: +53%

**What is this and why does it matter here?:**

Metlen Energy & Metals is a large Greek industrial conglomerate operating across three primary segments: power generation and electricity trading (the largest by EBITDA), metals (aluminum and bauxite-alumina production), and infrastructure construction. The company was renamed from Mytilineos in 2024 to reflect its expanded European footprint and a planned dual listing in London. It runs Greece's largest power plant fleet, operates an integrated bauxite-alumina-aluminum complex at Agios Nikolaos, and increasingly positions itself as a European industrial platform with critical minerals optionality.

What puts Metlen on this page is the gallium recovery project at Agios Nikolaos — the same site where the company has been refining bauxite into alumina for decades. In January 2025, Metlen committed €295.5M to add gallium extraction to the existing operation, targeting 50 tonnes per year of primary gallium output by 2028. In January 2026, the project crossed two important thresholds: the European Investment Bank approved €90M in financing, and the facility produced its first 5 kilograms of gallium — proving Metlen's proprietary extraction process works at industrial scale. The project is designated a Strategic Project under the EU Critical Raw Materials Act, which provides regulatory fast-tracking and access to EU strategic financing.

The strategic significance is that if Metlen reaches its 50 t/yr target, Europe covers its entire current gallium demand domestically for the first time since 2016, when the last European primary gallium producer (Hungary) closed. That makes Metlen the European version of what JAGA represents for the Pacific — sovereign-backed primary production rebuilding domestic critical minerals capacity.

**How does value flow through this entity?:**

Metlen captures value through several distinct channels:

**Existing infrastructure base.** The hard part of gallium production is the upstream — bauxite mining, alumina refining, the Bayer process liquor flow. Metlen already owns and operates that infrastructure at Agios Nikolaos. Adding gallium recovery means installing ion-exchange columns and electrolysis cells on a side stream the refinery already produces. The marginal capex is €295.5M; the existing alumina refinery represents billions in prior capex that Metlen doesn't need to repeat. Cost-per-kilogram of recovered gallium is competitive with Chinese pricing at scale.

**EU regulatory and financing tailwinds.** The Critical Raw Materials Act Strategic Project designation provides regulatory streamlining, expedited permitting, and prioritized access to EU strategic financing facilities. EIB's €90M January 2026 commitment is part of this. Sovereign-aligned demand (European semiconductor manufacturers, defense primes, EU strategic reserves) is willing to pay a sovereignty premium — potentially 2-3x Chinese domestic pricing — for non-Chinese supply. Metlen's quoted €1B export market value for the full bauxite-alumina-gallium project bakes this premium into the project's NPV.

**Multi-metal platform optionality.** Metlen has signaled that scandium and germanium recovery from the same Agios Nikolaos waste streams are under evaluation. Scandium has aerospace-alloy applications; germanium ties Metlen into the same chain Umicore dominates. If both materialize as commercial-scale operations, Metlen transitions from "Greek aluminum producer with a gallium project" to "European critical minerals platform with multi-metal byproduct revenue." That re-rating is the long-tail upside that gallium alone doesn't deliver.

**Direct gallium revenue.** At 50 t/yr and realized pricing around €1,800-2,000/kg in European markets, gallium would contribute €80-100M annually. That's roughly 1-2% of current Metlen revenue but high-margin and structurally repeatable. More important than the absolute number is that gallium revenue scales without aluminum-cycle correlation, providing earnings diversification.

**What to watch:**
- **Scale-up trajectory.** First production was 5 kg in January 2026; the target is 50 t/yr by 2028 — a 10,000x increase. Quarterly production updates will reveal whether Metlen is tracking, slipping, or exceeding the ramp curve. The 2027 interim target of 5-10 t/yr is the most important checkpoint — hitting it validates the proprietary process at meaningful scale; missing it materially extends the timeline.
- **Offtake agreements.** Watch for announcements of multi-year supply contracts with European semiconductor manufacturers (STMicroelectronics, Infineon, NXP), European defense primes (Thales, Leonardo, Rheinmetall, BAE), or US defense buyers seeking non-Chinese supply. The terms of these agreements — pricing structure, volume commitments, duration — will determine whether Metlen captures the sovereignty premium or whether sovereign-backed buyers extract concessions.
- **Scandium and germanium expansion.** Either of these moving from "under evaluation" to "FID announced" would be a material re-rating event. Scandium specifically has aerospace alloy applications with significant unmet demand; germanium ties into the same chain as Umicore, which is the largest single critical-minerals investable in Europe.
- **EU strategic reserves and sovereign offtake.** The EU and member-state governments may direct strategic reserve purchases to Metlen as the only EU primary gallium producer. Watch for European Commission strategic stockpiling announcements and EU member state critical minerals procurement.
- **Aluminum and energy market exposure.** Metlen's earnings are still dominated by power generation and aluminum, both of which are cyclical. A European energy market correction or aluminum cycle downturn would compress group earnings regardless of gallium progress.

**Investment angle:**

Metlen is the cleanest European listed exposure to the gallium chain rebuild, and structurally the most concentrated of the four western primary production projects. For investors who can access Athens or London listings, Metlen offers a mature dividend-paying industrial business with genuine critical minerals optionality backed by EU sovereign financing — at a valuation that reflects energy and aluminum cyclicality more than the strategic optionality.

The variant perception that would make Metlen undervalued: the market is pricing Metlen as a Greek industrial conglomerate, but the platform value of being the only EU primary gallium producer with EU strategic financing — and the optionality on scandium and germanium expansion — could compound into a multi-metal critical minerals re-rating. If by 2028 Metlen has 50 t/yr gallium operating plus scandium FID plus EU strategic offtake contracts in place, the equity transitions to a different category of business than today.

The bear case is execution risk plus aluminum-cycle exposure plus liquidity. Scaling from 5 kg to 50 t/yr is genuinely difficult — proprietary processes that work at lab and pilot scale routinely struggle at full commercial output. If Metlen slips to 2029 or beyond, the gallium contribution misses the 2026-2028 western tightness window, weakening the strategic premium thesis. The Athens listing has limited US institutional liquidity; the London dual listing helps but Metlen is not yet a default name in critical-minerals-themed mandates.

For investors already positioned, the monitoring questions are: does the 2027 production target hit ~5-10 t/yr; do offtake agreements emerge with named European or US buyers; and does Metlen announce scandium or germanium FID within 24 months of gallium ramp? Two of three would re-rate the equity meaningfully.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (under construction). Sources: Metlen press releases, European Commission CRMA strategic projects list, EIB project disclosures (January 2026). Not investment advice.*

---

### Rio Tinto — Full Brief
*RIO · NYSE · LSE · ASX*

**Metrics:**
- Market cap: ~$110B USD
- Revenue: ~$55B (FY2024)
- EBITDA: ~$22B (FY2024)
- Stock price: ~$70 USD
- 12-month change: ~+8% (large-cap diversified miner; moves with iron ore and aluminum cycles)

**What is this and why does it matter here?:**

Rio Tinto is one of the world's largest diversified mining companies, with operations spanning iron ore, copper, aluminum (via bauxite mining and alumina refining), lithium, titanium, borates, diamonds, and increasingly a portfolio of critical minerals byproduct projects. The company operates major mines and refineries across more than 30 countries, with revenue dominated by iron ore (Pilbara operations in Western Australia, Iron Ore Company of Canada) and aluminum (the legacy Alcan business acquired in 2007, including operations in Quebec, BC, Iceland, and Australia). Rio Tinto is one of the world's most balance-sheet-rich miners, with a longstanding dividend policy (~5% yield) and consistent free cash flow generation across the iron ore cycle.

What puts Rio Tinto on this page is a small but strategically positioned project at its Vaudreuil alumina refinery in Saguenay, Quebec. In May 2025, Rio Tinto and Indium Corporation announced the first successful laboratory-scale extraction of gallium from the Vaudreuil refinery's Bayer process byproduct stream — a proof-of-concept that the gallium recovery economics work in a Canadian operating context. In March 2026, Rio Tinto formally committed to advance the project to a demonstration plant phase with Canadian federal and Quebec provincial government support. The demo plant targets up to 3.5 tonnes per year of primary gallium output. A subsequent commercial-scale facility, if approved, could reach 40 t/yr — representing approximately 5-10% of current global gallium production from a single Canadian site.

The strategic significance is twofold. First, the project would be the only North American primary gallium producer of meaningful scale, addressing US Defense Production Act objectives around domestic critical minerals capacity. Second, Rio Tinto is using the Vaudreuil project as part of a broader portfolio play, building exposure to multiple byproduct critical minerals (gallium, scandium, tellurium, molybdenum) from existing operations to differentiate its equity story from pure iron ore exposure.

**How does value flow through this entity?:**

Rio Tinto's gallium economics follow the same template as Alcoa and Metlen — bolt gallium recovery onto an existing alumina refinery, capture the gallium that already flows through the Bayer process, sell it at premium western pricing. But the value flow specifics for Rio Tinto differ in important ways:

**Existing Vaudreuil infrastructure base.** The Vaudreuil refinery has operated for decades as part of Rio Tinto's Quebec aluminum operations. The capital base is fully amortized, the Bayer process flow is already characterized, and Rio Tinto already employs and operates the Saguenay site. Adding gallium recovery is a bolt-on capex commitment in the tens of millions of CAD scale rather than a greenfield development. The marginal economics on gallium recovery are favorable.

**Indium Corporation IP partnership and dependency.** The proprietary gallium extraction process at Vaudreuil belongs to Indium Corporation, Rio Tinto's US-based technology partner. Rio Tinto operates the refinery and provides the feedstock; Indium provides the process IP and likely the downstream gallium refining. This creates a structural dependency: Rio Tinto cannot independently scale the gallium project without Indium's continued participation, similar to how Umicore's role on the germanium chain creates a technology dependency. The IP licensing terms determine value capture between the two parties.

**Sovereign-backed demand and Canadian critical minerals positioning.** Canadian federal and Quebec provincial governments are providing financial support and are likely sources of strategic offtake demand. The project aligns with Canadian critical minerals strategy, US-Canada DPA Title III flow-through eligibility (under existing US-Canada critical minerals frameworks), and EU CRMA strategic partnership status. Sovereign-aligned demand provides revenue visibility but also caps upside if government offtake is structured at fixed pricing.

**Portfolio re-rating optionality.** Gallium revenue is immaterial to Rio Tinto's overall financials. At 3.5 t/yr demo scale and $1,500/kg, the demo plant generates ~$5M annually against $55B group revenue — a rounding error. Even at 40 t/yr commercial scale, gallium contributes ~$60M, less than 0.2% of group revenue. The value isn't direct gallium revenue; it's that Rio Tinto is deliberately building a portfolio of critical minerals byproduct businesses (gallium at Vaudreuil, scandium and tellurium evaluation at other sites, lithium at Rincon and Jadar) to differentiate its equity from pure iron-ore-cycle exposure. This portfolio approach captures sovereign and institutional capital flowing to critical minerals allocations.

**What to watch:**
- **Demo plant construction commissioning.** Rio Tinto has committed to building the demo plant; construction milestones, commissioning timeline, and first commercial production from the demo facility are the near-term execution gates. Any slippage signals broader execution risk on the gallium thesis.
- **Quebec provincial financial commitments and offtake structure.** Specific government financial terms have not been fully disclosed. The ratio between Quebec equity, federal financing, and Indium IP terms determines who captures upside in tight-market scenarios. Watch for Province of Quebec budget announcements and Government of Canada critical minerals strategy updates.
- **Commercial-scale FID timeline.** The 40 t/yr commercial-scale facility is contingent on demo plant success and a separate commercial Final Investment Decision. The commercial FID timing is the most material catalyst for material gallium revenue contribution.
- **Rio Tinto's broader critical minerals portfolio announcements.** Scandium and tellurium evaluation projects at other Rio Tinto sites, lithium projects at Rincon (Argentina) and Jadar (Serbia), and any new byproduct critical minerals announcements all multiply the portfolio re-rating thesis. The investment case for Rio Tinto on critical minerals is the platform, not any single project.
- **Iron ore and aluminum cycle.** The dominant near-term equity drivers are iron ore (Pilbara operations) and aluminum prices. A China iron ore demand correction or aluminum cycle downturn would compress Rio Tinto valuation regardless of critical minerals progress.

**Investment angle:**

Rio Tinto offers iron ore and aluminum cycle exposure with gallium optionality attached as a small piece of a broader critical minerals portfolio re-rating thesis. For investors who want diversified mining exposure with sovereign-backed critical minerals optionality at the lowest single-project risk, Rio Tinto is the most balance-sheet-secure of the four western primary production projects.

The variant perception that would make Rio Tinto undervalued: the market is pricing it as "iron ore mega-cap with mining diversification," but the cumulative critical minerals portfolio (gallium at Vaudreuil + scandium evaluation + tellurium + lithium at Jadar/Rincon) could re-rate Rio Tinto as a diversified critical minerals platform if multiple projects reach commercial scale in 2028-2030. That re-rating wouldn't show in any single project's economics; it would show in the multiple investors apply to the company.

The bear case is that gallium is too small to matter and the broader critical minerals portfolio takes too long. At 40 t/yr × $1,500/kg, gallium is 0.1-0.2% of revenue. Even with scandium, tellurium, and lithium added, critical minerals as a portfolio category may not exceed 5% of group revenue before 2030. Iron ore remains the dominant driver, and an iron ore demand correction would compress the equity regardless of critical minerals progress. The Indium IP dependency also caps Rio Tinto's ability to scale gallium independently — partnership risk is real.

For investors already positioned, the monitoring questions are: does the Vaudreuil demo plant complete commissioning on time; does a commercial-scale FID get announced; and how does the broader critical minerals portfolio (scandium, tellurium, lithium) progress in parallel? Rio Tinto's gallium contribution becomes material only if the portfolio thesis aggregates across multiple projects.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (demo stage). Sources: Rio Tinto press releases (May 2025, March 2026), Indium Corporation communications, Government of Canada and Quebec announcements, Rio Tinto annual reports. Not investment advice.*

---

### Korea Zinc — Full Brief
*010130.KS · Korea Exchange (KOSPI)*

**Metrics:**
- Market cap: ~$15B USD
- Revenue: ~$9B USD (FY2024)
- EBITDA: Not disclosed separately for Crucible JV
- Stock price: ~₩1,000,000 KRW
- 12-month change: Volatile, driven by ownership dispute and Crucible JV

**What is this and why does it matter here?:**

Korea Zinc is the world's largest non-Chinese zinc smelter, headquartered in Seoul with operations in South Korea and Australia. The company's core business is the refining of zinc and lead from imported concentrates, but its capability extends across a broad range of byproduct specialty metals — indium, bismuth, tellurium, silver, antimony — produced at smaller volumes through integrated metallurgical processing. Group revenue runs ~$9B against a $15B market cap, with margins driven by zinc treatment charges, byproduct credits, and metals-trading exposure. The company is in the middle of a high-profile ownership dispute with Young Poong Corporation and MBK Partners that has been the dominant share-price driver throughout 2024-2025.

What puts Korea Zinc on this page is the Crucible JV announced in December 2025: a $7.4B joint venture to build a new integrated critical minerals smelter in Clarksville, Tennessee, on the site of the existing Nyrstar facility. The structure is unprecedented in scale and form. The US Department of Defense takes a 40% equity stake — the largest direct DoD equity investment in critical minerals processing in modern history. JPMorgan acts as financial adviser and lead arranger. Approximately $4.7B comes from US government loans (DoD-anchored), and $210M in CHIPS Act subsidies cover specific equipment categories. Korea Zinc holds an operating role with a less-than-10% equity stake. When completed in 2029, the facility will produce 540,000 tonnes per year of critical minerals output — including zinc, lead, copper, antimony, germanium, indium, tellurium, and approximately 40 t/yr of primary gallium recovered from the zinc concentrate stream.

The strategic significance is that Crucible represents a categorical shift in how the US treats critical minerals processing: DoD equity rather than offtake contracts, integrated multi-metal output rather than single-commodity capacity, and an existing US site (Nyrstar Clarksville) rather than greenfield development. For the gallium chain specifically, Crucible would be one of two North American primary gallium sources alongside Rio Tinto's Vaudreuil project — and at 40 t/yr, the largest single source.

**How does value flow through this entity?:**

Korea Zinc's value capture from Crucible is structurally different from a typical operator role:

**Operational role with capped equity upside.** Korea Zinc's direct economic share in the JV is modest — less than 10% equity. The DoD's 40% stake is the dominant equity position, and JPMorgan-syndicated debt funds most of the construction. Korea Zinc gets paid as the operator (management fees, technical service fees) and earns its proportional share of byproduct revenue. The company is not the primary economic beneficiary of the gallium pricing premium that the facility could realize; the DoD is.

**Strategic positioning value far exceeds direct revenue.** At 40 t/yr × $1,500-2,000/kg, gallium revenue from Crucible at the operator level would be $6-8M/yr against Korea Zinc's $9B group revenue — too small to move the equity. The larger value is positioning: Korea Zinc becomes the US government's preferred operational partner for critical minerals processing at a moment when DPA Title III, CHIPS Act, and DoD strategic minerals programs collectively command tens of billions in available capital. Multi-decade revenue visibility from a series of US government-backed facilities is the platform thesis.

**Multi-product output diversification at Crucible.** Crucible's 540,000 t/yr output across 13 products means Korea Zinc captures upside from any tightening across the multi-metal critical minerals basket — germanium, antimony, tellurium, indium all face their own bifurcated supply pictures with western shortage premiums. Gallium is one of the smaller line items by tonnage but high in unit value; antimony has its own supply crisis; germanium ties into the same chain Umicore dominates. The integrated nature of the smelter creates revenue optionality across multiple chains simultaneously.

**Korean operational risk and ownership overhang.** The unresolved ownership dispute with Young Poong and MBK Partners has been the dominant share-price driver through 2024-2025, and it creates execution risk for a 2029 commercial start. Strategic decisions on Crucible require management bandwidth that the ownership dispute consumes. Korean governance reforms could either resolve the dispute and unlock value, or extend it and impair Korea Zinc's ability to execute. The DoD equity provides a stabilizing force but also creates US political sensitivity around any change in operating partner.

**Key Crucible JV terms ground the analysis:** $7.4B total investment; DoD 40% equity; Korea Zinc <10% equity; $4.7B in US government loans plus $210M CHIPS Act subsidies; 540,000 t/yr finished product output across 13 products including ~40 t/yr gallium; site preparation in 2026, commercial operations targeted 2029. The gallium share of the project is meaningful for the chain (largest North American source) but small for Korea Zinc.

**What to watch:**
- **Crucible JV construction milestones.** Site preparation is scheduled for 2026 with commercial operations in 2029. Mining and processing projects routinely slip 12-24 months from initial targets, and the Crucible facility is unprecedented in integration scale. Quarterly construction updates from Korea Zinc and DoD disclosures are the primary tracking signal. A confirmed first-pour or first-production milestone would be a material catalyst.
- **Korea Zinc ownership dispute resolution.** The Young Poong/MBK Partners dispute remains the dominant share-price driver and a key execution risk. Resolution — whether through regulatory action, Korean court rulings, or negotiated settlement — would clear management bandwidth for Crucible. Watch for Financial Services Commission rulings, KCFTC announcements, and any Korean government intervention.
- **Interim gallium recovery from Nyrstar tailings.** Some reports indicate Korea Zinc may pursue interim gallium recovery from the existing Nyrstar Clarksville tailings before the new smelter comes online. Any announcement of interim production would shift the timeline materially — bringing first US Korea Zinc gallium output to 2026-2027 rather than 2029.
- **DoD strategic offtake and pricing structure.** The terms of DoD offtake from Crucible — fixed pricing, market-linked pricing, strategic reserve purchases — will determine whether Korea Zinc captures the western gallium premium or whether the facility is structured as cost-plus production for government purposes. Watch for DoD critical minerals strategy disclosures and JPMorgan project finance details.
- **Multi-product market dynamics.** Crucible's 540 kt output spans products with different market dynamics. Gallium and germanium tightness benefits the JV. Zinc and lead market dynamics affect base economics. The integrated nature means cross-product price effects compound. Track antimony, indium, and tellurium markets in parallel — any of them tightening lifts Crucible's overall economics.

**Investment angle:**

Korea Zinc offers exposure to US government-backed critical minerals infrastructure through a unique JV structure with limited direct equity capture but significant strategic positioning value. For investors with Seoul market access and patience for a 2029 commercial start, Korea Zinc is one of the most credible critical minerals allocations available — backed by the largest direct DoD equity stake in critical minerals processing in modern history.

The variant perception that would make Korea Zinc undervalued: the market is pricing it as a Korean zinc smelter with governance overhang, but the platform value of being the DoD's preferred operational partner for US critical minerals processing — combined with multi-product Crucible output across germanium, antimony, gallium, indium, and tellurium — could re-rate Korea Zinc as a strategic infrastructure operator rather than a cyclical metals refiner. If Crucible commissions on time and a second US DoD-backed facility is announced before 2030, the equity transitions from cyclical to platform.

The bear case is execution timing plus governance plus diluted gallium exposure. Crucible doesn't commission until 2029, by which time the western tightness window for gallium (2026-2028) will largely have passed. The Korea Zinc ownership dispute remains unresolved and could materially impair execution. And gallium itself is a small line in a 13-product facility — for pure gallium exposure, Alcoa or Metlen are more concentrated. The structural risks that warrant the strategic premium also create real downside if any single one materializes.

For investors already positioned, the monitoring questions are: does the Korea Zinc ownership dispute resolve cleanly; do Crucible construction milestones hit on time; and does Korea Zinc announce a second US DoD-backed JV within 24 months of first Crucible production? Any combination of two of three would re-rate the equity meaningfully.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer + Refiner (planned). Sources: Korea Zinc December 2025 announcements, Crucible JV press releases, US Department of Defense critical minerals disclosures, JPMorgan project finance materials, Bloomberg, Mining.com. Not investment advice.*

---

### Chinese Primary Supply (aggregate) — Full Brief
*Aggregate · Not directly investable*

**Metrics:**
- Market cap: Aggregate (collection of ~20 mostly state-owned producers)
- Revenue: Not disclosed (aggregate, individual operators do not report gallium revenue separately)
- EBITDA: Not disclosed
- Stock price: Not listed (no aggregate equity vehicle)
- 12-month change: N/A

**What is this and why does it matter here?:**

Chinese Primary Supply is not a single company. It is the aggregate output of approximately 20 Chinese alumina refineries that recover gallium as a byproduct of aluminum production from bauxite, plus a small number of secondary recovery operations. The mix includes state-owned operators (Chinalco / Aluminum Corporation of China, Shandong Weiqiao Pioneering Group, China Hongqiao Group, China Power Investment), privately held specialty processors (Vital Materials, Zhuzhou Keneng Materials, Beijing Jiya Semiconductor Material), and integrated zinc-aluminum smelting operations that have added gallium recovery circuits over the past two decades. The aggregate is geographically concentrated in Shandong, Henan, Yunnan, and Inner Mongolia provinces, where alumina refining infrastructure clusters around bauxite supply chains.

Chinese capacity grew from approximately 140 t/yr in 2010 to roughly 1,000 t/yr installed capacity by 2022, and continues to expand. Actual production runs at approximately 590 t/yr — meaning utilization is around 59%, with substantial idle capacity that can be brought online or held back as policy dictates. The deliberate overhang is the structural fact: China holds enough capacity to flood the global market or to constrain it, and Beijing's policy choices determine which scenario plays out at any given moment.

This aggregate sits on the gallium chain page despite not being directly investable because it is the single most important variable in the entire gallium investment thesis. Every other entity covered on this page — Alcoa, Metlen, Rio Tinto, Korea Zinc, Dowa, 5N Plus — derives its investability from its position relative to what China does with the 1,000 t/yr capacity it controls. A portfolio manager forming a view on western gallium projects without modeling Chinese supply scenarios is missing the central variable. The aggregate is here as a tracking artifact, not as an investment vehicle.

**How does value flow through this entity?:**

There is no direct value flow to western investors. Chinese primary gallium producers are state-owned, state-affiliated, or traded only on Chinese A-share or Hong Kong exchanges with limited foreign institutional access. Chalco trades in Hong Kong and Shanghai with limited US access; Hongqiao trades in Hong Kong; Weiqiao operates partially through Hong Kong listings but gallium is buried inside aluminum-dominated revenue. None of the named entities offer a clean Chinese gallium pure-play available to non-Chinese institutional investors.

The indirect value flow — and the entire reason the aggregate matters — is that **Chinese policy sets both the floor and the ceiling on global gallium pricing**, and every western position must be modeled against a Chinese supply scenario:

**Chinese capacity overhang creates structural pricing optionality for Beijing.** With 1,000 t/yr installed and ~590 t/yr produced, China has roughly 400 t/yr of idle capacity that can be brought online or held back. That overhang gives Beijing the ability to flood the global market (which would compress western retail pricing dramatically) or to constrain global supply (which sustains the western premium). The overhang is deliberate. Industrial planning over the past 15 years has consistently overbuilt capacity, and idle capacity isn't accidentally idle — it's strategic reserve.

**Bifurcated pricing is policy-driven, not market-driven.** Chinese domestic gallium trades around $245/kg (SMM 4N benchmark, April 2026), pressured by domestic supply that vastly exceeds domestic demand. Western retail trades around $2,269/kg (SMI benchmark, April 2026), elevated by export licensing that prevents arbitrage. The roughly 9x spread between Chinese domestic and western retail is the entire gallium investment opportunity — and it persists only as long as Chinese export controls remain in place.

**The November 2026 binary catalyst.** China imposed export licensing on August 1, 2023, and added a US-targeted full ban on December 3, 2024. The US-targeted ban was suspended in November 2025 through November 27, 2026. What happens in November 2026 is the central binary catalyst for the entire western gallium investment universe. Three scenarios materially affect every position on this page:

- *Ban reimposed or expanded.* Western retail premium widens further; western capacity projects (Alcoa/JAGA, Metlen, Rio Tinto/Vaudreuil, Korea Zinc/Crucible) gain pricing power; Dowa and 5N Plus benefit from feedstock scarcity dynamics.
- *Ban renewed at current suspension.* The spread persists. Western projects ramp into a still-bifurcated market. Most stable scenario for the western chain rebuild thesis.
- *Ban lifted or controls relaxed.* Western retail pricing compresses toward Chinese domestic levels. Western capacity projects face margin pressure that some may not survive at lower realized pricing. Dowa retains technical capability premium but loses geopolitical premium.

**Demand-side dynamics inside China matter too.** Chinese domestic gallium consumption is dominated by NdFeB permanent magnet production, LED manufacturing, and a growing GaN power electronics base. As Chinese domestic AI datacenter buildout accelerates and Chinese GaN device manufacturers scale (Innoscience, Hua Hong, others), domestic Chinese demand grows — reducing tonnage available for export even if licensing policy relaxes. The structural setup is shifting in favor of tighter exportable supply over time, regardless of policy direction.

**Aggregate metrics that ground the analysis:** ~1,000 t/yr installed Chinese capacity; ~590 t/yr actual production; ~59% utilization; 98-99% of global primary gallium production; ~91% of global refined gallium output; 2023 export licensing imposed August 1, 2023; 2024 US-targeted ban December 3, 2024; current suspension November 2025 through November 27, 2026.

**What to watch:**
- **November 27, 2026 suspension expiry — binary event.** The single most important date on the gallium calendar. Reimposition expands the western premium and lifts every western capacity project. Renewal of suspension preserves the current spread structure. Lifting of controls compresses the premium. Watch MOFCOM announcements throughout October-November 2026 and any US-China bilateral trade discussions in advance of the expiry.
- **MOFCOM general license behavior.** Even with licensing in place, China grants "general licenses" to specific buyers and product categories. Whether these clear in reasonable timeframes — and which buyers receive them — is a continuous tracking variable. Tight license enforcement keeps the western premium high; loose enforcement compresses it.
- **Chinese domestic consumption growth.** NdFeB magnet production, LED capacity expansion, and GaN power electronics manufacturing growth all consume domestic Chinese gallium. As domestic consumption grows, exportable Chinese tonnage compresses regardless of licensing policy. Track Chinese permanent magnet production statistics, LED industry capex, and GaN device manufacturer capacity announcements.
- **Chinese capacity expansion announcements.** Beijing periodically announces new gallium recovery capacity at additional alumina refineries. Each new announcement increases the structural overhang, giving China more pricing optionality. Watch state media announcements and provincial industrial planning disclosures from Shandong, Henan, Yunnan, and Inner Mongolia.
- **Trade enforcement and circumvention dynamics.** Even under formal licensing, Chinese gallium reaches western buyers via third-country re-exports (Vietnam, Thailand, Mexico, occasionally Japan or Korea as transit jurisdictions). Western governments increasingly track these flows. Tighter enforcement reduces effective western supply and lifts the premium; looser enforcement compresses it.
- **Strategic stockpiling by major buyers.** US DoD, Japanese JOGMEC, EU strategic reserves, and Korean strategic stockpiles all buy gallium for defense and emergency-supply purposes. Stockpiling activity removes tonnage from the market and supports prices. Track DPA Title III procurement, JOGMEC stockpile disclosures, and EU Critical Raw Materials reserve activity.

**Investment angle:**

Chinese Primary Supply is not directly investable for western institutional capital, but it is unavoidable. Every portfolio with western gallium exposure is implicitly a bet on what China does in November 2026 and beyond. The relevant portfolio question isn't "do I own Chinese gallium?" — that's not really available — but "which scenario am I positioned for, and does my exposure survive the other two?"

The variant perception worth holding: most investor framing treats Chinese supply as a binary "ban yes/ban no" question, but the more accurate framing is structural. The Chinese capacity overhang of ~400 t/yr idle production is permanent strategic optionality for Beijing regardless of any specific policy decision. Even if controls relax in November 2026, Beijing retains the ability to reimpose them at any time, which means the western premium has a structural floor below the Chinese domestic price but above what a fully liberalized global market would clear at. Investors who treat the November 2026 expiry as the single binary event miss the longer-running structural asymmetry.

The "bear case" for western positions in the chain is that China relaxes controls more aggressively than expected, possibly as part of a broader US-China trade deal or as a strategic concession. In this scenario, western retail pricing compresses, Western capacity projects face margin pressure, and several may delay FID or scale back. Dowa retains technical capability but loses the geopolitical premium. 5N Plus retains its diversified platform but the gallium contribution shrinks. The chain rebuild thesis weakens but doesn't disappear.

For investors already positioned across the western gallium chain, the monitoring question is: how does my portfolio perform in each of the three Chinese supply scenarios? Reimposition is bullish for everyone; renewal is bullish for capacity builders and refiners; relaxation is bearish for capacity builders but neutral-to-modestly-bearish for refiners. A portfolio that survives all three scenarios is properly hedged; a portfolio that requires reimposition to work is implicitly a directional China-policy trade.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Aggregate: Primary Producer. Sources: USGS Mineral Commodity Summaries, MOFCOM notices and trade enforcement announcements, SMM benchmarks, SMI benchmarks, Fastmarkets, Chinese provincial industrial planning disclosures. Not investment advice.*

---

### Dowa Holdings — Full Brief
*5714.T · Tokyo Stock Exchange*

**Metrics:**
- Market cap: ~¥800B (~$5.5B USD)
- Revenue: ~¥850B (~$5.8B USD)
- EBITDA: Not separately disclosed for gallium segment
- Stock price: ~¥11,000
- 12-month change: Moderate positive performance

**What is this and why does it matter here?:**

Dowa Holdings is a large Japanese specialty metals company, founded in 1884 as a mining operation and today operating across four primary business segments: zinc and lead smelting (the legacy and largest revenue contributor), electronic materials (where gallium and other specialty refined metals reside), metal recycling, and metal processing. The company runs major zinc smelters in Japan, electronic materials operations in multiple Japanese sites and Southeast Asia, and a network of metal recycling facilities that have positioned Dowa as one of the world's leading recyclers of specialty metals from electronic waste. Group revenue runs ~¥850B (~$5.8B USD) against a ~$5.5B market cap, with margins driven by zinc treatment charges, electronic materials pricing premiums, and recycling spreads.

What puts Dowa on this page — and at the top of the gallium WTMI ordering — is its role as the structural western chokepoint in high-purity gallium refining. Outside China, only a handful of companies can produce 6N (99.9999%) and higher purity gallium at the volumes and quality grades that semiconductor and defense customers require. Dowa is the leading supplier in this category. When a Japanese, Korean, Taiwanese, or US semiconductor maker needs gallium that isn't routed through Chinese export licensing, Dowa is the default supplier. After China's December 2024 US-targeted export ban specifically, Dowa's role as a pass-through refiner for non-Chinese buyers became structurally more important — and remains so as long as Chinese export controls are in place.

The strategic significance is that Dowa is the western refining chokepoint that the four primary-production projects (Alcoa, Metlen, Rio Tinto/Indium, Korea Zinc/Crucible) ultimately depend on for downstream purification. Even as new western primary capacity comes online, the high-purity refining step remains concentrated in Dowa and a small number of secondary refiners (5N Plus in Canada, Indium Corporation in the US, PPM Pure Metals in Germany). The chain rebuild thesis assumes Dowa continues to operate at scale; if it does, Dowa captures a structural premium throughout the rebuild.

**How does value flow through this entity?:**

Dowa's gallium economics flow through several distinct mechanisms:

**Technical capability barrier as pricing power.** Dowa's gallium refining produces purity grades that meet the strictest semiconductor specifications — primarily 6N and 7N grades for GaAs wafer manufacturers (AXT, Sumitomo Electric, Freiberger), GaN device makers, and defense applications. Producing 7N+ gallium consistently at commercial volumes requires proprietary process knowledge, capital equipment (zone refining, vacuum distillation, electrolytic purification cells), and decades of operational refinement. Few competitors globally can replicate this at scale, and Dowa has built the leading non-Chinese position over multiple decades. The result is structural pricing power on the highest-purity grades that compounds during periods of supply tightness.

**Geopolitical premium and bifurcated market positioning.** The bifurcated gallium market — with Chinese domestic pricing at ~$245/kg and western retail at ~$1,750-2,269/kg as of April 2026 — directly benefits Dowa as the largest non-Chinese producer of refined gallium. Western buyers pay the sovereignty premium because export licensing makes arbitrage impossible. As long as Chinese export controls persist, Dowa captures the spread between Chinese feedstock pricing (or domestically sourced low-purity gallium) and western retail pricing on its refined output. The December 2024 US-targeted ban widened this spread further; Dowa's pricing power increased commensurately.

**Feedstock dependency creates structural risk.** Dowa's gallium business runs on imported low-purity gallium metal — historically from Chinese producers, secondarily from other regional sources, and increasingly from emerging western primary producers (Sojitz/JAGA Australia is the most likely future feedstock source, given Sojitz's Japanese state-aligned position). Dowa cannot operate independently of upstream gallium supply; if Chinese export controls tighten further, Dowa's feedstock costs rise even as its pricing power on output increases. Net margin behavior depends on whether downstream price increases keep pace with upstream cost increases — a dynamic that has favored Dowa in 2024-2026 but isn't structurally guaranteed.

**Multi-segment dilution caps direct gallium re-rating.** Dowa doesn't break out gallium revenue or margin separately. Industry estimates put Dowa's gallium output at 10-30 t/yr high-purity — meaningful relative to global non-Chinese refining (~15-30 t/yr total) but small relative to Dowa's multi-segment ~¥850B group revenue. At realized pricing of ¥250,000-350,000/kg ($1,700-2,400/kg) for high-purity gallium, the gallium business contributes roughly ¥3-10B annually — less than 1% of group revenue. Even in a sharp tightening scenario, gallium remains diluted inside the broader Dowa corporate structure. The thesis is real but the equity exposure is structural rather than concentrated.

**Recycling optionality and downstream exposure.** Dowa is one of the world's leading specialty metals recyclers, and gallium recycling from end-of-life GaAs wafers, defective LED chips, and semiconductor manufacturing scrap is a growing source of feedstock independent of primary supply. As gallium scrap volumes accumulate from decades of LED and semiconductor production, recycling could become a meaningful supplemental supply source. Dowa is positioned to capture this trend.

**Dowa group financials and balance sheet:** ~¥850B revenue, ~$5.5B market cap, ~¥11,000 share price, 2-3% dividend yield. The Tokyo Stock Exchange listing limits direct US institutional investor access; ADR exposure exists but is limited. The company is investment-grade and consistently profitable across the zinc cycle, with electronic materials providing earnings stability against zinc price volatility.

**What to watch:**
- **Japanese government critical minerals policy and sovereign offtake.** The US-Japan Critical Minerals Framework, JOGMEC strategic stockpiling activity, and any direct Japanese government support for Dowa's gallium refining capacity would strengthen Dowa's structural position. Watch for METI announcements, JOGMEC equity participation in Dowa expansion, and Japan-US bilateral critical minerals procurement.
- **JAGA Australia feedstock alignment.** Alcoa's JAGA project includes Sojitz and JOGMEC as Japanese government-aligned partners. If JAGA's gallium output ships to Dowa for downstream refining (rather than to Indium Corporation in the US or another western refiner), Dowa's feedstock supply expands materially through 2028-2029. The offtake terms between JAGA and downstream refiners will determine where the JAGA gallium flows.
- **Metlen and Korea Zinc/Crucible coming online.** Both Metlen (Greece) and Korea Zinc/Crucible (Tennessee) plan to do their own primary production AND likely some downstream refining. Each represents a competitive challenge to Dowa's structural position — Metlen by 2028, Crucible by 2029. Dowa's pricing power compresses modestly when alternative western refining capacity comes online.
- **Chinese export ban dynamics.** The November 27, 2026 US-targeted ban suspension expiry is the binary catalyst that determines Dowa's near-term feedstock and pricing dynamics. If China reimposes or expands controls, Dowa's spread expands further. If China relaxes controls, Dowa's geopolitical premium compresses. Watch for MOFCOM announcements and any Chinese commerce ministry statements throughout 2026.
- **Recycling and scrap volume trends.** As accumulated LED and semiconductor manufacturing scrap volumes grow, gallium recycling becomes a more material supplemental feedstock source. Watch for Dowa announcements about recycling capacity expansion or recycling-source feedstock contracts with major LED and semiconductor customers.

**Investment angle:**

Dowa is the structural western chokepoint in high-purity gallium refining and the lowest-volatility, highest-quality way to play the gallium chain rebuild. For investors who want Japanese specialty metals exposure with genuine gallium optionality embedded inside an investment-grade balance sheet, Dowa is the cleanest equity vehicle outside the four capacity builders. The dividend yield (~2-3%) provides income while the chain rebuild plays out over 2026-2029.

The variant perception that would make Dowa undervalued: the market is pricing it as a Japanese zinc-lead conglomerate with electronic materials optionality, but Dowa's position as the only at-scale non-Chinese gallium refiner — combined with its recycling scale and Japanese government strategic alignment — could re-rate Dowa as the structural western critical minerals refiner of choice. If JAGA gallium ships to Dowa for downstream refining and Japanese government procurement formalizes Dowa's strategic role, the equity transitions from cyclical zinc producer to platform refiner.

The bear case is that Dowa's gallium contribution is too small inside a zinc-dominated business to drive equity re-rating, even in tight markets. Gallium revenue at full premium pricing is less than 1% of group revenue. Zinc cycle dominates near-term earnings; Tokyo listing limits institutional flow; and competing western refiners (5N Plus, Indium Corporation, PPM Pure Metals) plus new primary producers entering refining could compress Dowa's pricing power over 2028-2030. The structural premium is real but bounded.

For investors already positioned, the monitoring questions are: does JAGA gallium ship to Dowa rather than alternative refiners; does Japanese government policy formalize Dowa's strategic role; and does Dowa expand high-purity refining capacity in the next 24 months? Two of three would meaningfully change the equity story.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Refiner. Sources: Dowa annual reports, US-Japan Critical Minerals Framework announcements, METI and JOGMEC disclosures. Not investment advice.*

---

### 5N Plus Inc. — Full Brief
*VNP · TSX*

**Metrics:**
- Market cap: CAD 3.13B (~USD $2.3B)
- Revenue: USD $391.1M (FY2025, +35% YoY)
- EBITDA: USD $92.4M (FY2025, +73% YoY)
- Stock price: CAD $34.77
- 12-month change: +532%

**What is this and why does it matter here?:**

5N Plus is a Canadian specialty metals refiner headquartered in Montreal, with operations spanning North America and Europe. The business model is to take in raw materials — gallium, germanium, indium, tellurium, bismuth, antimony — and purify them to the high-purity grades semiconductor manufacturers, photovoltaic producers, pharmaceutical companies, and defense suppliers require. The company name comes from "5N" — 99.999% pure — the minimum purity grade it targets, with several products reaching 7N or higher. The business operates across two segments: Specialty Semiconductors (the larger and higher-margin segment) and Performance Materials (steadier industrial and pharmaceutical specialty chemicals).

The company's most valuable asset is AZUR SPACE, a German subsidiary that produces germanium-based multi-junction solar cells for satellites. AZUR is the largest non-Chinese producer of space-grade photovoltaics globally, with a 265-day order backlog driven by LEO constellation buildouts (Starlink, Kuiper, OneWeb, military satellite programs). The space solar business is structurally separate from terrestrial photovoltaics and commands premium pricing because the qualification cycle for satellite components takes years and there are few qualified suppliers globally.

What puts 5N Plus on the gallium chain page is its position as one of three meaningful western high-purity gallium refiners — alongside Dowa in Japan and Indium Corporation in the US. 5N Plus produces an estimated 2-5 tonnes per year of high-purity gallium from its Montreal facility, which is small relative to global non-Chinese gallium output (~15-30 t/yr) but strategically important as the only Canadian source of refined gallium and a qualified supplier to North American defense and semiconductor customers. More importantly, 5N Plus is positioned as the highest-quality western critical minerals platform — gallium is one piece of a portfolio that includes germanium, tellurium, and indium, all of which face their own bifurcated supply pictures with western shortage premiums.

**How does value flow through this entity?:**

5N Plus captures value through several distinct channels:

**Multi-metal refining platform with revenue diversification.** Revenue runs about $391M for FY25, with Specialty Semiconductors contributing roughly $285M (73% of total) and Performance Materials making up the balance. The Specialty Semiconductors segment encompasses AZUR space solar cells, compound semiconductor wafers (CdTe wafers supplied to First Solar for terrestrial photovoltaics), and refined specialty metals including gallium, germanium, indium, and tellurium. The diversification across metals and end markets creates revenue stability — a tightening in any single metal lifts the segment, but no single metal can derail the business.

**Multi-year take-or-pay contracts and revenue visibility.** The First Solar relationship (the implied thin-film solar customer for CdTe wafers) committed to 33% volume growth across 2025-2026 and another 25% through 2028 — that's contracted revenue visibility extending well into the next decade. AZUR's 265-day order backlog combined with a sequence of capacity expansions (35% in 2024, 30% in 2025, another 25% planned for 2026) creates compounding revenue trajectory. The business is structurally less cyclical than commodity-exposed peers because the contracts lock in price and volume.

**Sovereign and government-backed positioning.** In January 2026, the US Department of Energy granted 5N Plus $18.1M to expand germanium recycling at a Utah facility — direct US government backing for North American critical minerals capacity. The company is a beneficiary of US-Canada bilateral critical minerals frameworks and is well-positioned for additional DoD, DoE, and Canadian federal funding as critical minerals strategic capital deploys through 2026-2030. Sovereign-aligned demand provides revenue visibility that pure commercial customers don't.

**Financial quality is unusually high for a critical minerals name.** FY25 revenue grew 35%; FY25 EBITDA grew 73% to $92.4M; net debt to EBITDA sits at 0.5x — a combination of growth and balance sheet discipline that is rare among critical minerals equities, where most peers are pre-revenue projects, leveraged miners, or commodity-cyclical operators. The stock has run +532% over the trailing 12 months, but the multiple expansion is anchored to genuine contracted revenue growth rather than speculative sentiment. The CAD 3.13B market cap reflects a real re-rating from "specialty refiner with optionality" to "western critical minerals platform with sovereign backing."

**Gallium as a small piece of a larger thesis.** Gallium production at 2-5 t/yr × ~$1,500-2,000/kg generates roughly $3-10M in direct gallium revenue, less than 3% of group revenue. The gallium contribution is too small to drive the equity in the near term. The structural value is that 5N Plus is the qualified North American refiner positioned to absorb additional gallium volumes if Alcoa/JAGA, Rio Tinto/Vaudreuil, or Korea Zinc/Crucible ship feedstock north for downstream refining. Capacity expansion in gallium-specific refining would be a meaningful catalyst.

**What to watch:**
- **Q1 2026 earnings (May 6, 2026).** First full quarter under new CEO. Critical for tracking AZUR space solar production trajectory, gallium and germanium segment trends, and capital allocation guidance under new leadership. Any guidance changes — particularly on capacity expansion or M&A appetite — would materially affect the equity thesis.
- **AZUR space solar 25% capacity lift for 2026.** The space solar business is the dominant value driver for 5N Plus; execution on the planned 25% capacity expansion at AZUR's Heilbronn, Germany facility is the most important operational milestone. Watch for AZUR-specific capacity announcements, hiring trends, and order backlog disclosures.
- **Gallium-specific refining expansion announcements.** If 5N Plus announces dedicated gallium refining capacity expansion in response to JAGA or other primary production projects coming online, that would be a meaningful catalyst — both for the gallium segment specifically and for 5N Plus's positioning as the western refiner of choice. Watch for partnership announcements with Alcoa, Sojitz, JOGMEC, or DoE/DoD.
- **Germanium recycling Utah facility ramp.** The $18.1M DoE-backed germanium recycling expansion is a smaller but visible execution milestone. Successful ramp validates 5N Plus's ability to execute on government-backed critical minerals projects and creates a template for additional government-supported capacity.
- **Multi-year contract renewals and new contracts.** Watch for First Solar contract extension or expansion, new defense customer announcements, and any LEO constellation operator long-term agreements. Each new multi-year contract extends revenue visibility and supports the platform thesis.
- **Cross-chain critical minerals exposure.** 5N Plus touches gallium, germanium, indium, tellurium, and bismuth simultaneously. Any tightening in any of these metals lifts the segment. Track the cross-chain supply picture, not just gallium.

**Investment angle:**

5N Plus is the highest-quality western critical minerals name on public markets, and gallium is a small but strategic piece of the thesis. For portfolios that want broad critical minerals exposure with operational discipline, multi-year contracted revenue, sovereign backing, and a credible balance sheet, 5N Plus is arguably the best-scaled North American option in the category. The +532% trailing 12-month run reflects a genuine re-rating from specialty refiner to platform, not speculative excess.

The variant perception that would make 5N Plus undervalued: the market is pricing it primarily on AZUR space solar and the First Solar CdTe relationship — both of which are genuine value drivers — but the optionality on gallium-specific refining capacity expansion (driven by JAGA or other primary production coming online) and the broader cross-chain critical minerals platform value are likely underpriced. If 5N Plus announces dedicated gallium capacity expansion with sovereign backing or signs additional multi-year contracts, the platform multiple expands further.

The bear case is valuation and execution. The +532% run has compressed forward multiples; any miss on AZUR ramp, First Solar volume, or government-backed project execution would compress the equity sharply. Gallium itself is too small to support the multiple if AZUR space solar disappoints. New CEO transition adds execution risk through 2026. And the Tokyo-listed Dowa is structurally a more concentrated chokepoint play in gallium specifically — for pure gallium exposure, 5N Plus is too diversified.

For investors already positioned, the monitoring questions are: does AZUR hit the 25% capacity lift on schedule; does 5N Plus announce gallium-specific capacity expansion within 12 months; and does the Utah germanium recycling project ramp successfully? Two of three would sustain the platform thesis through 2026-2027.

*Disclaimer: Stillpoint Intelligence · Gallium Chain · Layer: Refiner. Sources: 5N Plus investor communications, TSX filings, US Department of Energy critical minerals announcements. Not investment advice.*

---

## CATALYSTS

### Near-term (next 6 months)

- **May 6, 2026** — 5N Plus Q1 2026 earnings release
- **Q2 2026** — Alcoa / JAGA Final Investment Decision confirmation
- **Q2-Q3 2026** — Metlen production milestones toward 5-10t target

### Medium-term (6-12 months)

- **H2 2026** — Alcoa / JAGA construction progress toward initial production
- **November 27, 2026** — Chinese export ban suspension expires (binary catalyst)

### Long-term (12+ months)

- **2027-2028** — Metlen ramp to 50 t/yr
- **2027-2028** — Alcoa Wagerup ramp to 100 t/yr
- **2029** — Korea Zinc / Crucible JV commercial operations begin
- **2029+** — Rio Tinto / Indium Quebec commercial-scale conversion
- **Ongoing** — US-China trade policy cycles

---

## CONNECTED INPUTS

### Upstream
None — gallium is a raw material page; upstream is the bauxite and zinc ore feedstock represented on the supply tree itself.

### Downstream
Refined gallium flows into multiple downstream chains, each of which is its own input page on the platform:

- **Compound semiconductor wafers (GaAs, InP)** — AXT is the dominant western-listed substrate manufacturer. Other major producers include Sumitomo Electric (Japan), Freiberger Compound Materials (Germany), and IQE (UK). Gallium arsenide and indium phosphide wafers feed 5G RF amplifiers, LEDs, satellite solar cells, laser diodes, and AI datacenter optical transceivers.

- **GaN power semiconductors** — Navitas, Infineon/GaN Systems, Innoscience, EPC, and Transphorm are the major device manufacturers. Powers AI datacenter 800V architectures, EV onboard chargers, 5G base stations, and consumer fast-charging.

- **GaN RF and defense radar** — Wolfspeed, Qorvo, MACOM, and NXP produce GaN-on-SiC RF devices used in AN/SPY-6, LTAMDS, Patriot, F-35 APG-81, and G/ATOR radar systems.

- **LED lighting** — Nichia, Samsung LED, Seoul Semiconductor, and OSRAM consume the largest volume of gallium globally via GaN-based blue LEDs.

- **NdFeB permanent magnets** — Chinese magnet producers (Ningbo Yunsheng, Zhongke Sanhuan, JL MAG Rare-Earth) dope magnet alloys with ~0.1-0.2% gallium for high-temperature magnetic stability in EV motors and wind turbines.

- **Satellite solar cells** — 5N Plus AZUR Space (Germany), Spectrolab (US), and CESI (Italy) use gallium-based wafers for high-efficiency multi-junction solar cells.

## SOURCES

### Government and industry bodies
- USGS Mineral Commodity Summaries 2023, 2024, 2025 (Brian W. Jaskula, Laura Dair)
- USGS SIR 2025-5021 "World minerals outlook — Cobalt, gallium, helium, lithium, magnesium, palladium, platinum, and titanium through 2029" (Alonso et al. 2025)
- MOFCOM Notices: July 2023, 2024 No. 46 (December 2024), 2024 No. 51, October 2025 announcements 55-58, 61, 62, November 7-9, 2025 suspension announcement
- US BIS Entity List expansions and Section 232 critical minerals investigation filings
- EU Critical Raw Materials Act (CRMA) strategic projects list (March 2025)

### Pricing and trade reporters
- Fastmarkets (Rotterdam warehouse benchmark, Chinese export coverage)
- Shanghai Metal Market / SMM (Chinese domestic 4N benchmark)
- Asian Metal (gallium price index, customs trade data)
- Strategic Metals Invest (western retail pricing)
- galliumprice.com (producer directory, project pipeline)
- The Oregon Group (November 2025 suspension coverage)

### Company disclosures
- AXT, Inc. — 10-K, 10-Q, S-3, 424B5 SEC filings; Q2-Q4 2025 earnings releases
- 5N Plus — Q4 2025 earnings release, January 2026 DoE grant announcement, February 2026 AZUR expansion
- Navitas Semiconductor — Q1-Q4 2025 8-K filings, NVIDIA partnership announcements, GlobalFoundries strategic partnership
- Alcoa Corporation — October 2025 JAGA announcement, August 2025 JDA announcement, Gallium Project Factsheet
- Metlen Energy & Metals — January 2025 FID announcement, January 2026 EIB financing and first production milestone
- Rio Tinto — May 2025 Indium Corp partnership, March 2026 Canada R&D advancement
- Korea Zinc — December 2025 Crucible JV announcement
- Sojitz / JOGMEC — August 2025 JAGA formation announcement

### Academic and research
- Gao et al. 2024 — "Tracking two decades of global gallium stocks and flows"
- Sverdrup et al. 2025 — "Gallium: Assessing the Long-Term Future Extraction, Supply, Recycling, and Price"
- Frontiers in Energy Research 2022 — "Evolution of the Anthropogenic Gallium Cycle in China from 2005 to 2020"
- Yole Group — "Power GaN 2025" market report (October 2025)
- CSIS, ORF America, Stimson Center — critical minerals policy analyses
- Center for Security and Emerging Technology (Georgetown) — MOFCOM Notice 2024 No. 46 analysis

### Defense industry sources
- Military & Aerospace Electronics (AN/SPY-6, LTAMDS, G/ATOR GaN integration)
- Aviation Week (fighter radar GaN transition)
- RFGlobalnet, MilitaryEmbedded (GaN in radar/EW)

---

## META

- **Vertical:** AI Infrastructure
- **Layer:** Raw Materials
- **Chain position:** Upstream of compound semiconductor wafer production
- **Status:** Constrained (access gap, not geological gap)
- **Research dossier:** gallium-research-dossier.md (April 2026)
- **Framework version:** Stillpoint Master Framework v3
- **Writing agent:** Claude / Stillpoint Intelligence
- **Page generated:** 2026-04-21
- **Last updated:** 2026-04-21
- **Review status:** Draft — pending human review and QA agent evaluation

