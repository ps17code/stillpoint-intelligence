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

### How It's Made

*Three layers feed the supply tree below. Each layer is a distinct industrial operation with its own operators, economics, and bottlenecks.*

#### BYPRODUCT SOURCE

Bauxite-producing regions where gallium sits as a trace impurity in the ore.

**WHAT HAPPENS HERE**
Bauxite is mined and shipped to alumina refineries worldwide. Gallium is not extracted at this layer — it rides along inside the bauxite at ~50 ppm as the ore moves downstream.

**WHY IT'S HARD**
Gallium content is uniform across essentially all bauxite globally. You cannot "find better bauxite" for gallium. Output at this layer is determined by aluminum industry decisions, not gallium demand — which is why gallium supply cannot scale independently of aluminum.

**~346M t/yr** bauxite mined globally

#### PRIMARY PRODUCER

Alumina refineries that recover gallium from the bauxite processing stream.

**WHAT HAPPENS HERE**
Bauxite is processed into alumina for aluminum production. Refineries with ion-exchange circuits installed capture the dissolved gallium as a byproduct. Refineries without that equipment discard it as waste — a material called "red mud."

**WHY IT'S HARD**
Only ~20 alumina refineries globally have gallium recovery installed, almost all in China. Only 10-15% of gallium in the bauxite stream is captured even at refineries with recovery. Building new capacity takes 3-5 years and $100M-$7B, and western projects have to solve the economics that shut down Germany, Hungary, and Kazakhstan between 2013 and 2016.

**~600 t/yr** primary gallium extracted globally

#### REFINER

Specialty refiners that purify crude gallium to semiconductor grade.

**WHAT HAPPENS HERE**
Crude 99.99% gallium is purified to 99.9999%+ via zone refining, vacuum distillation, and electrolytic processes. Different end uses need different grades — LEDs need 6N, defense radar needs 7N, next-generation chips need 8N.

**WHY IT'S HARD**
Each additional "nine" of purity is exponentially harder than the last. Removing the final parts per billion of iron, copper, and zinc requires proprietary process knowledge that cannot be bought off the shelf. Western refiners (Dowa, 5N Plus) depend on Chinese primary feedstock to operate — so they are only as secure as China's willingness to export.

**~320 t/yr** high-purity refined gallium produced globally

---

### Key Takeaways

1. Raw material (bauxite) is plentiful and globally distributed — not a geological constraint.

2. Primary gallium production is overwhelmingly Chinese — the real bottleneck is recovery infrastructure at alumina refineries.

3. Four western projects are trying to rebuild primary capacity — but none operating at scale before 2028.

4. The refining layer is Japan-led (Dowa) with small Canadian/US contributions — structurally dependent on Chinese primary feedstock.

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

**What is this and why does it matter here?**

Alcoa is one of the world's largest aluminum producers. It mines bauxite ore, refines it into alumina, and smelts alumina into aluminum — the full vertical stack. Most of its revenue comes from selling aluminum to automakers, construction firms, and packaging companies. Gallium is not currently part of that business.

What puts Alcoa on this page is a project announced in October 2025: at one of its Western Australian alumina refineries, Alcoa plans to bolt on equipment to extract gallium as a byproduct of aluminum production. The target is 100 tonnes per year — roughly 10% of current global gallium demand and a 10x increase in non-Chinese supply. Four sovereign governments (US, Australia, Japan, and Alcoa's home country via the JV structure) are collectively funding the project.

**How does value flow through this entity?**

If the project gets built, Alcoa becomes the single largest non-Chinese source of primary gallium — by a wide margin. The facility would extract gallium from the liquid waste stream the refinery already produces, so the incremental cost is relatively low: some ion-exchange equipment and electrolysis cells, plus a small share of ongoing energy and reagents. The economics look good because the infrastructure is already there.

The joint venture is called JAGA (Japan Australia Gallium Associates), formed by Japanese government-backed entities (Sojitz and JOGMEC) together with Alcoa. Australia has committed AUD 200M in concessional equity. The US government signed on in October 2025. Each government gets gallium offtake in proportion to its investment — meaning they take delivery of a share of the gallium, likely into strategic reserves or to domestic refiners.

For Alcoa specifically, gallium is a rounding error financially. At 100 t/yr and $1,500/kg realized pricing, gross gallium revenue would be ~$150M annually against Alcoa's ~$12B revenue base. The stock is still fundamentally an aluminum cycle bet. The gallium project is strategic positioning — Alcoa becomes the default allocation for sovereign and institutional mandates seeking western critical minerals exposure with operational backing.

**Key numbers**
- Target gallium capacity: 100 t/yr (10% of global demand)
- Australian government commitment: AUD 200M concessional equity
- Project location: Wagerup or Pinjarra refinery, Western Australia
- Liquor stream used: ~10% of refinery flow
- FID status: "Expected by end 2025" — not confirmed as of April 2026
- Production start target: late 2026, full ramp 2028-2029

**What to watch**
- Final Investment Decision announcement — delay signals execution risk
- SPV terms (pricing mechanics, offtake ratios) once finalized
- Construction milestones — mining projects routinely slip 12-24 months

**Investment angle**

Alcoa is aluminum cycle exposure with gallium optionality attached. For investors already comfortable with aluminum, Alcoa adds the clearest near-term path to meaningful western gallium production. For pure gallium exposure, it's too diluted — Metlen is more concentrated. The thesis surfaces in the valuation only when the project delivers tangible revenue, which is 2027-2028 at the earliest.

*Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (planned). Sources: Alcoa investor communications (October 2025), JOGMEC and Sojitz announcements. Not investment advice.*

---

### Metlen Energy & Metals — Full Brief
*MYTIL · Athens Stock Exchange · MTLN · London Stock Exchange*

**Metrics:**
- Market cap: €5.03B
- Revenue: €5.68B (FY2024)
- EBITDA: ~€900M
- Stock price: ~€48
- 12-month change: +53%

**What is this and why does it matter here?**

Metlen is a large Greek industrial company that makes aluminum, generates electricity, and builds infrastructure. It was called Mytilineos until 2024. Most of its revenue comes from energy and aluminum. Gallium is a new business line.

What puts Metlen on this page is its project at Agios Nikolaos, Greece — the same site where it has been refining bauxite into alumina for decades. In January 2025 the company committed €295.5M to add gallium extraction to the existing operation, with a target of 50 tonnes per year by 2028. In January 2026, the European Investment Bank approved €90M in financing, and the first 5 kilograms were produced — proving the company's proprietary extraction process works at industrial scale. The project is designated a Strategic Project under the EU Critical Raw Materials Act.

If Metlen hits its target, Europe covers its entire gallium demand domestically for the first time since 2016.

**How does value flow through this entity?**

The project works because Metlen already owns the hard parts. Gallium is extracted from the same liquid byproduct stream that already flows through the existing alumina refinery — no new mine, no new refinery, just a bolt-on extraction circuit. That gives Metlen a structural cost advantage: its gallium can compete with Chinese pricing at scale.

Metlen also holds the demand side. European semiconductor and defense buyers need gallium that isn't export-controlled by China. They will pay premium pricing — potentially double or triple the Chinese domestic price — for supply sovereignty. Metlen's quoted €1B export market value for the full bauxite-alumina-gallium project bakes this premium in.

At 50 t/yr and realized pricing around €1,800-2,000/kg, gallium would contribute €80-100M annually. That's ~1-2% of total revenue — small, but high-margin and strategic. The real long-term value is that Metlen is also expanding into scandium and germanium at the same site. If that works, Metlen becomes Europe's default critical minerals platform, and the valuation multiple expands beyond what a mature aluminum producer would command.

**Key numbers**
- Target gallium production: 50 t/yr by 2028
- First production: 5 kg (January 2026)
- EIB financing: €90M (approved January 2026)
- Total project investment: €295.5M
- Current EU gallium coverage at full ramp: 100%
- Dividend yield: ~2.9%

**What to watch**
- Scale-up from 5 kg to 5-10t (2027 target) to 50t (2028) — quarterly reports will show trajectory
- Offtake agreements with European semiconductor manufacturers or defense primes
- Scandium and germanium expansion announcements — these multiply the thesis

**Investment angle**

Metlen is the cleanest European exposure to the gallium chain. For investors who can access Athens or London listings, it offers a mature, dividend-paying industrial with genuine critical minerals optionality backed by EU sovereign financing. The gallium segment alone is too small to re-rate the stock, but the full platform thesis (gallium + scandium + germanium) could. Main execution risk: scaling from 5 kg to 50 t/yr is a 10,000x increase.

*Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (under construction). Sources: Metlen press releases, European Commission CRMA strategic projects list. Not investment advice.*

---

### Rio Tinto — Full Brief
*RIO · NYSE · LSE · ASX*

**Metrics:**
- Market cap: ~$110B USD
- Revenue: ~$55B (FY2024)
- EBITDA: ~$22B (FY2024)
- Stock price: ~$70 USD
- 12-month change: ~+8% (large-cap diversified miner; moves with iron ore and aluminum cycles)
- Dividend yield: ~5%

**What is this and why does it matter here?**

Rio Tinto is one of the world's largest diversified miners. It mines iron ore, copper, aluminum (via bauxite and alumina), lithium, and other metals across more than 30 countries. Iron ore is by far the largest revenue driver. Aluminum is the second-largest segment.

What puts Rio Tinto on this page is a small project at its Vaudreuil alumina refinery in Saguenay, Quebec. In May 2025, Rio Tinto and Indium Corporation announced the first successful laboratory-scale extraction of gallium from the Vaudreuil refinery's byproduct stream. In March 2026, Rio Tinto committed to advance the project to a demonstration plant with Canadian federal and Quebec provincial government support. The demo plant targets up to 3.5 tonnes per year. A later commercial facility could reach 40 t/yr — 5-10% of current global production.

**How does value flow through this entity?**

Rio Tinto's gallium project works the same way Alcoa's does: bolt gallium extraction equipment onto an existing alumina refinery, capture the gallium that's already flowing through the Bayer process, sell it. The cost structure is attractive because the refinery infrastructure is already sunk.

Financially, gallium is immaterial to Rio Tinto. At 3.5 t/yr (demo) and $1,500/kg, the project generates ~$5M annually against Rio Tinto's $55B revenue base. Even at the 40 t/yr commercial target, gallium contributes ~$60M — a rounding error.

The real value is positioning. Rio Tinto is deliberately building a portfolio of critical minerals businesses (gallium, scandium, tellurium, molybdenum, lithium) that differentiate it from single-commodity miners. As sovereign and institutional capital flows toward critical minerals allocations, Rio Tinto captures that flow through its diversified exposure.

One structural detail worth noting: the extraction process IP is owned by Indium Corporation (Rio Tinto's US partner), not by Rio Tinto. This means Rio Tinto cannot independently scale the gallium project without Indium's continued participation — creating a technology dependency similar to Umicore's role in the germanium chain.

**Key numbers**
- Demo plant capacity: up to 3.5 t/yr
- Commercial-scale target: 40 t/yr
- Location: Saguenay-Lac-Saint-Jean, Quebec
- Government backing: Canadian federal + Quebec provincial
- First extraction: May 2025; demo plant timeline: unspecified

**What to watch**
- Demo plant construction commissioning milestones
- Quebec provincial financial commitments and offtake structure
- Rio Tinto's broader critical minerals announcements (scandium, tellurium) — these multiply the thesis

**Investment angle**

Rio Tinto is aluminum + iron ore exposure with gallium optionality on top. For investors comfortable with diversified mining exposure, it adds near-riskless gallium optionality to a balance-sheet-rich, dividend-paying (~5% yield) mega-cap. For concentrated gallium exposure, it's far too diversified — Metlen or Alcoa are better. The gallium segment will not move the stock in any meaningful way until commercial production is confirmed — a multi-year path.

*Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer (demo stage). Sources: Rio Tinto press releases (May 2025, March 2026), Indium Corporation communications, Government of Canada and Quebec announcements. Not investment advice.*

---

### Korea Zinc — Full Brief
*010130.KS · Korea Exchange (KOSPI)*

**Metrics:**
- Market cap: ~$15B USD
- Revenue: ~$9B USD (FY2024)
- EBITDA: Not disclosed separately for Crucible JV
- Stock price: ~₩1,000,000 KRW
- 12-month change: Volatile, driven by ownership dispute and Crucible JV

**What is this and why does it matter here?**

Korea Zinc is the world's largest non-Chinese zinc smelter, based in Seoul. Most of its revenue comes from zinc and lead refining at operations in South Korea and Australia. It also produces a range of byproduct specialty metals — indium, bismuth, tellurium, silver — at smaller volumes.

Korea Zinc matters to the gallium chain because of a deal announced in December 2025 called the Crucible JV. This is a $7.4B joint venture to build a new critical minerals smelter in Clarksville, Tennessee, on the site of the existing Nyrstar facility. The structure is unprecedented: the US Department of Defense takes a 40% equity stake, JPMorgan advises, and $4.7B comes from US government loans plus $210M in CHIPS Act subsidies. When completed in 2029, the facility will produce 540,000 tonnes per year of critical minerals — including zinc, lead, copper, antimony, germanium, and approximately 40 t/yr of gallium.

This is the single largest critical minerals processing investment in US history.

**How does value flow through this entity?**

Korea Zinc's direct economic share in the JV is modest — less than 10% of the equity. The real value is operational: Korea Zinc brings zinc smelting expertise, technology, and execution capacity. The DoD and JPMorgan bring the capital. Korea Zinc gets paid as operator and earns its share of gallium and other byproduct output.

At 40 t/yr of gallium and realized pricing around $1,500-2,000/kg, the gallium share alone is worth $60-80M annually — meaningful for a single byproduct, but small against Korea Zinc's $9B top line. The larger thesis is positioning: Korea Zinc becomes the US government's preferred operational partner for critical minerals processing, which creates multi-decade revenue visibility beyond any one facility. The unprecedented DoD equity stake signals that gallium and the other Crucible outputs are being treated as strategic defense assets rather than commodities.

**Key numbers**
- Crucible JV total investment: $7.4B
- DoD equity stake: 40%
- Korea Zinc equity stake: <10%
- Total finished product output: 540,000 t/yr
- Gallium output: ~40 t/yr
- Site preparation: 2026; Commercial operations: 2029

**What to watch**
- Construction milestones 2026-2029 — processing projects routinely slip 12-24 months
- Korea Zinc ownership dispute with Young Poong Corp./MBK Partners — could affect execution capacity
- Whether any interim gallium recovery from Nyrstar tailings proceeds before the new smelter is ready

**Investment angle**

Korea Zinc is exposure to US government-backed critical minerals infrastructure. For investors with Seoul market access and patience for a 2029 commercial start, it's a credible critical minerals allocation with rare sovereign backing. Gallium is diluted inside a broad 13-product output — for pure gallium exposure, Alcoa or Metlen are more concentrated. The main near-term risks are execution timing and Korean governance.

*Stillpoint Intelligence · Gallium Chain · Layer: Primary Producer + Refiner (planned). Sources: Korea Zinc December 2025 announcements, Crucible JV press releases, Bloomberg, Mining.com. Not investment advice.*

---

### Chinese Primary Supply (aggregate) — Full Brief
*Aggregate · Not directly investable*

**Metrics:**
- Market cap: Not listed (aggregate of ~20 mostly state-owned producers)
- Revenue: Not disclosed (aggregate)
- EBITDA: Not disclosed
- Stock price: Not listed
- 12-month change: N/A

**What is this and why does it matter here?**

This is not a single company. It is the combined output of roughly 20 Chinese alumina refineries that produce gallium as a byproduct. Some are state-owned (Chalco, Shandong Weiqiao). Some are privately held (Vital Materials, Zhuzhou Keneng). Chinese capacity grew from ~140 t/yr in 2010 to ~1,000 t/yr by 2022 and continues to expand.

This aggregate is on the page because it is the single most important variable in the entire gallium investment thesis. Every other entity here — Alcoa, Metlen, 5N Plus, Dowa, Rio Tinto, Korea Zinc — derives its investability from its position relative to what China does.

**How does value flow through this entity?**

No direct value flow to western investors. Chinese primary producers are state-owned, state-affiliated, or traded only on Chinese exchanges with limited foreign access.

The indirect flow is what matters: Chinese policy sets both the floor and the ceiling on global gallium pricing. The floor is Chinese domestic pricing at ~$245/kg — depressed because Chinese capacity of 1,000 t/yr vastly exceeds Chinese domestic demand. The ceiling is the western retail price at ~$2,269/kg — elevated because export licensing and the December 2024 ban prevent western buyers from arbitraging down to Chinese domestic levels.

The 9x spread between the two prices is the entire gallium investment opportunity. If China lifts export controls, the spread collapses and every western capacity project faces margin pressure. If China tightens controls, the spread widens and every western project becomes more valuable. If controls hold steady at the current suspension (in effect until November 2026), the spread persists and western projects ramp into a market that still needs them. The overbuilt capacity is deliberate — it gives Beijing the optionality to flood or starve the global market. This is the central variable every position in the chain must stress-test against.

**Key numbers**
- Aggregate installed capacity: ~1,000 t/yr
- Aggregate actual production: ~590 t/yr
- Utilization: ~59%
- Global share of primary supply: 98-99%
- Global share of refined supply: ~91%
- Chinese domestic price (SMM 4N, March 2026): $245/kg
- Western retail price (SMI, April 2026): $2,269/kg
- Spread: 9x
- 2023 export licensing imposed: August 1, 2023
- 2024 US-targeted ban: December 3, 2024
- Current status: Suspended November 2025 through November 2026

**What to watch**
- November 2026 suspension expiry — binary event
- MOFCOM licensing behavior — whether "general licenses" actually clear in reasonable timeframes
- Chinese domestic consumption growth (NdFeB magnets, LEDs) — affects tonnage available for export

**Investment angle**

Not directly investable, but unavoidable. Every portfolio with western gallium exposure is implicitly a bet on what China does in November 2026 and beyond. The relevant portfolio question isn't "do I own Chinese gallium?" but "which scenario — ban reimposition, ban renewal, or normalization — am I positioned for, and does my exposure survive the other two?"

*Stillpoint Intelligence · Gallium Chain · Layer: Aggregate: Primary Producer. Sources: USGS Mineral Commodity Summaries, MOFCOM notices, SMM benchmarks, Fastmarkets. Not investment advice.*

---

### Dowa Holdings — Full Brief
*5714.T · Tokyo Stock Exchange*

**Metrics:**
- Market cap: ~¥800B (~$5.5B USD)
- Revenue: ~¥850B (~$5.8B USD)
- EBITDA: Not separately disclosed for gallium segment
- Stock price: ~¥11,000
- 12-month change: Moderate positive performance

**What is this and why does it matter here?**

Dowa is a large Japanese specialty metals company, founded in 1884 as a mining operation. Today it runs four businesses: zinc and lead smelting, electronic materials, metal recycling, and metal processing. Zinc and lead make up most of the revenue. Gallium sits inside the electronic materials segment.

Dowa matters to the gallium chain because it is the western world's most important non-Chinese high-purity gallium refiner. When a Japanese or Korean semiconductor maker — or a US customer who wants to avoid Chinese supply risk — needs high-purity gallium, Dowa is the default supplier. After China's December 2024 US-targeted export ban, Dowa's role as a pass-through refiner for non-Chinese buyers became structurally more important.

**How does value flow through this entity?**

Dowa's gallium business works by buying low-purity gallium metal (historically from Chinese producers, secondarily from other regional sources) and refining it up to 99.9999%-plus purity — the grade needed for gallium arsenide wafers and LED production. That refining is a specialized skill that only a handful of companies globally can do at scale. Dowa holds the leading position outside China.

The pricing power comes from two places. First, technical capability: Dowa's purity grades meet the strictest semiconductor specifications, and few competitors can replicate this. Second, geopolitical premium: western buyers pay up for gallium that isn't routed through Chinese export controls. When the Chinese bans are active, Dowa's prices effectively float upward with the access premium.

The catch for investors: Dowa doesn't break out gallium revenue separately. Industry estimates put Dowa's gallium output at 10-30 t/yr — meaningful relative to global non-Chinese production (~15 t/yr total), but small relative to the company's multi-segment business. The gallium thesis is real, but it's diluted inside a zinc-lead conglomerate.

**Key numbers**
- Estimated gallium output: 10-30 t/yr high-purity
- Global non-Chinese refining share: leading position
- Business segments: 4 (zinc-lead dominates revenue)
- Dividend yield: ~2-3%

**What to watch**
- Japanese government critical minerals policy — direct support would strengthen Dowa's position
- Sojitz/JOGMEC/JAGA Australia alignment — if Alcoa's gallium project ships to Dowa for refining, Dowa's input feedstock expands materially
- Metlen's European production ramp — modestly reduces Dowa's strategic pricing power once operational

**Investment angle**

Dowa is a lower-volatility, higher-quality way to play the gallium chain — but it's diluted. For investors who want Japanese specialty metals exposure with real gallium optionality, Dowa fits. For pure gallium exposure, it's too diversified — gallium is a small share of a zinc-lead-dominated portfolio. The Tokyo listing also limits direct US investor access.

*Stillpoint Intelligence · Gallium Chain · Layer: Refiner. Sources: Dowa annual reports, US-Japan Critical Minerals Framework announcements. Not investment advice.*

---

### 5N Plus Inc. — Full Brief
*VNP · TSX*

**Metrics:**
- Market cap: CAD 3.13B (~USD $2.3B)
- Revenue: USD $391.1M (FY2025, +35% YoY)
- EBITDA: USD $92.4M (FY2025, +73% YoY)
- Stock price: CAD $34.77
- 12-month change: +532%

**What is this and why does it matter here?**

5N Plus is a Canadian specialty metals refiner. It takes in raw materials like gallium, germanium, indium, tellurium, and bismuth and purifies them to the levels needed by semiconductor makers, solar panel manufacturers, pharmaceutical companies, and defense suppliers. The company name comes from "5N" — 99.999% pure — the minimum purity grade it targets.

Its most valuable asset is AZUR SPACE, a German subsidiary that builds the germanium-based solar cells used on satellites. AZUR is the largest non-Chinese producer of space solar cells globally and has a 265-day backlog driven by LEO constellation buildouts (Starlink, OneWeb, military satellites).

Gallium matters to 5N Plus, but it's smaller than germanium and AZUR. The company produces maybe 2-5 tonnes of high-purity gallium per year from Montreal — strategically relevant to North American supply, but not the main earnings driver. 5N Plus is on this page because it's the highest-quality western vehicle for broad critical-minerals exposure, of which gallium is one piece.

**How does value flow through this entity?**

Revenue comes from two segments. Specialty Semiconductors (~$285M, 73% of total) includes AZUR space solar cells, compound semiconductor wafers (CdTe for First Solar), and refined specialty metals including gallium. Performance Materials covers pharmaceutical-grade bismuth and specialty chemicals at steadier but lower-margin pricing.

The business runs on multi-year take-or-pay contracts. The thin-film solar customer (widely understood to be First Solar) has committed to 33% volume growth in 2025-2026 and another 25% through 2028. AZUR's 265-day backlog, combined with multiple capacity expansions (35% in 2024, 30% in 2025, another 25% planned for 2026), creates years of visible revenue. In January 2026, the US DoE granted 5N Plus $18.1M to expand germanium recycling at a Utah facility — direct US government backing.

Financial quality is the standout. FY25 revenue grew 35%, EBITDA grew 73%, net debt/EBITDA sits at 0.5x. This is a rare combination of growth and balance sheet discipline among critical-minerals names.

**Key numbers**
- Specialty Semiconductors segment: ~$285M (73% of total revenue)
- Net debt / EBITDA: 0.5x
- AZUR space solar backlog: 265 days
- US DoE germanium grant: $18.1M (January 2026)
- Estimated gallium production: 2-5 t/yr
- Dividend: None (reinvestment policy)

**What to watch**
- Q1 2026 earnings (May 2026) — first full quarter under new CEO
- AZUR space solar 25% capacity lift for 2026 — execution milestone
- Any dedicated gallium expansion announcement — would be a catalyst given 5N Plus's existing refining capability

**Investment angle**

5N Plus is the highest-quality broad critical-minerals name on public markets. The stock has run 532% over 12 months, which reflects a genuine re-rating rather than speculation — the company is growing into its multiple with real contracted revenue. For portfolios that want critical-minerals exposure with operational discipline, 5N Plus is arguably the best-scaled North American option. The caveat: gallium is a small share of the thesis. If you want concentrated gallium exposure, Metlen or Alcoa's JAGA project are more direct.

*Stillpoint Intelligence · Gallium Chain · Layer: Refiner. Sources: 5N Plus investor communications, TSX filings. Not investment advice.*

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

