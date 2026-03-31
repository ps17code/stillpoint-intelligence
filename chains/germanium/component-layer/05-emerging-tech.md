# Emerging Tech — GeO₂ / GeCl₄ Component Layer

## Teaser
Hollow-core fiber eliminates germanium entirely — but it won't carry more than 10% of datacenter traffic before 2028

## Title
Four technology vectors could reshape the component layer, but none reaches meaningful scale before the supply crisis peaks

## Category
Emerging tech

---

## Overview

The germanium-doped fiber supply chain faces a structural shortage that will peak in 2026–2027. Multiple technologies promise to either increase GeCl₄ production efficiency, reduce germanium consumption in fiber manufacturing, or eliminate germanium dependency entirely. **The critical question is not whether these technologies work — it is whether they reach commercial scale before the shortage window closes.**

## Vector 01 — Replace it: hollow-core fiber

**Status: Commercial deployments begun · Meaningful market share 2028–2030**

Hollow-core fiber (HCF) is the only technology that eliminates germanium from the fiber optic supply chain entirely. Light travels through air rather than germanium-doped glass, delivering 30%+ latency reduction and removing the GeCl₄ dependency from the manufacturing process.

**YOFC (China):** Achieved world-record attenuation of 0.040 dB/km in laboratory conditions and sub-0.1 dB/km in commercial production. Single preform drawing length of 91.2 km achieved. Over 10 commercial and pilot projects globally, including a 110 km corridor between Dongguan and Hong Kong datacenters (world's longest commercial HCF deployment). Launched the "INFINITE-2030 Plan" targeting 50+ global commercial deployments and international standardization.

**Microsoft/Lumenisity:** Acquired Lumenisity in December 2022 (40,000 sq ft dedicated HCF manufacturing facility in Romsey, UK — world's first). Achieved 1,280 km deployed across Azure with zero field failures. Transmission loss of 0.091 dB/km. Target: 15,000 km across Azure by late 2026, representing over 75% of projected global HCF installations. Manufacturing partnerships with Corning (North Carolina) and Heraeus (Europe/US).

**Relativity Networks (private, Series A):** Raised $10.7M total ($4.6M pre-seed February 2025, $6.1M seed August 2025). Partnership with Prysmian for mass production at Eindhoven facility announced March 2025. University of Central Florida technology partnership.

**China Mobile:** Deployed first commercial HCF line in July 2025. Average loss 0.085 dB/km. Demonstrated 114.9 Tbit/s single-wavelength throughput. Sub-1ms round-trip latency between Shenzhen and Hong Kong stock exchanges.

**Germanium displacement assessment:** HCF eliminates germanium entirely from deployed fiber. But total HCF deployment by end 2026 will be approximately 20,000 km against billions km of global installed base. The market projects 20–30% annual HCF growth over the next decade, but meaningful market share (>10% of new datacenter interconnect fiber) is achievable only by 2028–2030. **HCF is the structural bear case for germanium demand — but it arrives after the supply crisis peaks.**

## Vector 02 — Use less: advanced deposition efficiency

**Status: PCVD technology available · Incremental adoption underway**

Different preform fabrication techniques show dramatically different germanium utilization:

**MCVD (Modified Chemical Vapor Deposition):** The most widely deployed method (Nextrom OFC 12 system). Achieves 40–60% GeCl₄-to-GeO₂ conversion efficiency under equilibrium conditions. Unreacted germanium must be captured from exhaust and recycled.

**PCVD (Plasma Chemical Vapor Deposition):** Approaches 100% deposition efficiency through plasma-assisted heterogeneous deposition at lower operating temperatures. Enables very accurate refractive index profile control via layered deposition. Significantly reduces germanium waste per preform.

**OVD/VAD (Outside/Vapor Phase Axial Deposition):** Efficiency approaches 100% in optimized conditions. Corning uses OVD; Japanese manufacturers favor VAD.

**Waste recovery systems:** Leading manufacturers recover >95% of unreacted germanium through gas scrubbers, recirculation systems, precipitation reactions, and filtration. Approximately 20% of germanium dopant at advanced facilities comes from reclaimed preforms. One manufacturer's EcoCore initiative recycles 95% of production waste, reducing raw material use by 30%.

**Net impact:** Switching from MCVD to PCVD approximately doubles germanium utilization efficiency. But MCVD remains the dominant installed base globally, and the equipment replacement cycle is measured in decades. Incremental efficiency gains of 5–10% in germanium consumption are achievable through waste recovery optimization, but this does not fundamentally change the supply-demand equation. **Efficiency improvements slow the rate of demand growth; they do not reverse it.**

## Vector 03 — Substitute the dopant: fluorine and phosphorus

**Status: Niche applications only · Not viable for standard telecom fiber**

**Fluorine doping:** Creates depressed refractive index (opposite of germanium's elevated index), making it suitable for fiber cladding but not core doping in standard telecom fiber. Primary advantage is substantially reduced radiation-induced attenuation (RIA), critical for nuclear, aerospace, and space applications where germanium-doped fibers show severe performance degradation. Manufacturing challenges include fluorine migration into core region, 40–50% fluorine loss during consolidation, and SiF₄ volatilization.

**Phosphorus doping:** Offers 3x higher Raman shift compared to germanium-doped fibers and lower viscosity at typical process temperatures. Demonstrated flat supercontinuum spanning 850–2,150 nm (300 nm broader than Ge-doped equivalent). Primary choice for Raman lasers, amplifiers, and supercontinuum applications — but unsuitable for standard telecommunication core doping.

**Germanium displacement assessment:** Alternative dopants address specific performance gaps (radiation hardness, Raman efficiency) rather than replacing germanium in standard G.652.D telecom fiber. The fundamental refractive index requirement for conventional fiber-optic core doping makes germanium extremely difficult to displace broadly. **Total alternative dopant displacement: <10% of germanium consumption in the telecommunications fiber sector by 2030.** Fluorine-doped fibers estimated at <2% of total germanium consumption addressable market.

## Vector 04 — Reduce fiber demand: silicon photonics and co-packaged optics

**Status: Scaling rapidly · But net effect increases germanium demand**

**Co-packaged optics (CPO) market:** Expanded from $470M in 2025 to $603M projected in 2026 (CAGR 29.7%). North America CPO market alone expected to grow from $45M in 2026 to $385M by 2034. NVIDIA Spectrum-X (H2 2026) delivers 3.2T silicon photonics co-packaged optics with 3.5x power efficiency gain relative to traditional transceivers.

**Silicon photonics market:** Valued at $2.65B in 2025, projected to reach $9.65B by 2030 (CAGR ~30%). Major players include GlobalFoundries (acquired Advanced Micro Foundry November 2025), TSMC, Intel, Cisco, Marvell, and Coherent.

**Critical finding — CPO does NOT reduce fiber demand:**

CPO enables higher bandwidth density within datacenters by integrating optical and electronic components into single packages. But it does not reduce total fiber consumption. Instead, CPO supports 1.6T–3.2T switching, requiring MORE fiber lanes for aggregation. AI datacenter buildout demands vastly exceed fiber supply regardless of transceiver technology. CPO actually accelerates fiber deployment by improving datacenter economics, making more projects viable.

**Net effect on germanium:** CPO drives market expansion, not contraction. Expected net germanium demand growth from CPO deployment: +8–12% through 2030. **The technology that appears to reduce fiber-per-link actually increases total fiber deployed by making more datacenters economically viable.**

## The chlorine-free alternative

A research-stage chlorine-free protocol replaces the oxidizing capacity of chlorine with molecular oxygen (O₂) and replaces GeCl₄ with air/moisture-stable Ge(IV)-catecholate compounds. This approach offers lower energy intensity, reduced chlorine waste streams, and potentially higher yields. But it remains in research/pilot phase with no commercial production timeline established. **Current industrial GeCl₄ production still relies entirely on traditional chlorination despite its ≤70% yield limitations.**

## Takeaway

Four technology vectors address the component layer's constraints, but they operate on fundamentally different timescales:

**Near-term (2026–2027):** No technology reaches scale sufficient to meaningfully ease GeCl₄ demand. Efficiency improvements are incremental. Alternative dopants are niche. Silicon photonics increases net demand.

**Medium-term (2028–2030):** Hollow-core fiber begins capturing meaningful market share in datacenter interconnects. PCVD adoption continues reducing waste. But total fiber demand growth outpaces these offsets.

**Long-term (2030+):** If HCF achieves cost parity with standard single-mode fiber, it is the structural bear case for the entire upstream germanium supply chain — removing the largest single demand source over a 5–10 year horizon.

**The technologies that could save the supply chain don't arrive in time to prevent the shortage. The technologies that arrive in time don't save enough supply to matter.**

---

*Sources: YOFC — Hollow-Core Fiber Press Releases and OFC 2025/2026 Presentations; Microsoft Blog — Lumenisity Acquisition December 2022; Data Center Dynamics — Microsoft HCF Deployment and Relativity-Prysmian Partnership; Tom's Hardware — Microsoft HCF Commercialization; China Mobile Commercial HCF Deployment July 2025; IEEE Xplore — Germanium Recovery from Optical Fiber Manufacturing; ScienceDirect — Germanium Recovery from Waste Optical Fibers; Science Advances — Chlorine-Free Protocol for Processing Germanium; RP Photonics — Fiber Preforms Encyclopedia; Co-Packaged Optics Market Report 2026–2036; Imec — Silicon Photonics Technology Brief; Grand View Research — Silicon Photonics Market.*
