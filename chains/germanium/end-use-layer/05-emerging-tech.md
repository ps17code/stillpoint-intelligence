# Emerging Tech — AI Datacenter End-Use Layer

## Teaser
Co-packaged optics eliminates transceivers, Microsoft's MOSAIC MicroLED replaces copper at the board level, nuclear SMRs promise dedicated datacenter power, and liquid cooling is the new baseline — five technologies rewriting datacenter architecture from the photon to the watt

## Title
Co-packaged optics (CPO), 1.6T/3.2T transceivers, liquid-to-immersion cooling evolution, Microsoft MOSAIC MicroLED interconnects, and nuclear small modular reactors represent five technology shifts that will reshape end-use layer infrastructure by 2030

## Category
Emerging tech

---

## Overview

The end-use layer is undergoing a technology transformation more profound than any since the shift from mainframe to distributed computing. AI workloads have exposed the limits of conventional datacenter architecture — air cooling, pluggable transceivers, grid-dependent power, and copper interconnects within racks. Five emerging technologies are replacing these foundations, each with different maturity timelines and different implications for the germanium supply chain.

## Technology 01 — Co-packaged optics (CPO)

Co-packaged optics integrates optical engines directly onto the switch ASIC package, eliminating the pluggable transceiver as a separate component. Instead of light traveling from the switch chip through electrical traces to a front-panel transceiver module and then into fiber, CPO places the optical-to-electrical conversion at the chip boundary itself.

NVIDIA's Spectrum-X platform targets 3.2T switch capacity using co-packaged optics, with production targeting H2 2026. Broadcom's Tomahawk 5 and Balanox platforms include CPO options for next-generation datacenter switches. Intel's integrated photonics program, developed over two decades, provides the silicon photonics technology underlying multiple CPO implementations.

CPO's impact on the germanium supply chain is complex. On one hand, CPO reduces the number of discrete transceiver modules (a market that uses germanium photodetectors). On the other hand, CPO increases the total optical interconnect bandwidth per switch — each CPO-enabled switch drives more fiber connections at higher speeds, increasing fiber consumption per rack. The net effect on germanium demand is likely positive: more fiber deployed per unit of compute, even as the form factor of the optical interface changes.

CPO also enables higher-radix switch architectures that reduce the number of network tiers in a datacenter fabric. A datacenter that requires 3 tiers of switches with pluggable optics might need only 2 tiers with CPO — but the bandwidth per link increases proportionally. The result is fewer, fatter optical links consuming more high-quality single-mode fiber per link.

## Technology 02 — 1.6T and 3.2T optical transceivers

For datacenters that deploy pluggable optics (the majority through 2028), the transceiver speed roadmap drives fiber quality requirements and germanium consumption:

**1.6T (current generation ramp):** Using 200G-per-lane PAM4 modulation across 8 lanes. Commercial sampling began late 2025; volume ramp through 2026. Demonstrated at OFC 2026 by Coherent, Broadcom, Marvell, and Intel. Requires single-mode fiber with low attenuation and tight bend-loss specifications — higher-quality fiber that demands more precise germanium doping in preforms.

**3.2T (next generation, 2028–2029):** Expected to use either 400G-per-lane PAM4 or transition to coherent-lite modulation for datacenter interconnects. Laboratory demonstrations exist but commercial deployment is 2–3 years away. 3.2T will require even tighter fiber specifications, potentially driving demand for specialty fiber grades with premium germanium content.

The transceiver supercycle has a direct and measurable impact on germanium demand. Each generation increase in transceiver speed requires fiber with tighter specifications, which requires more precise germanium doping profiles in preforms, which requires higher-purity GeCl₄ input. The fiber-to-germanium linkage strengthens with each speed generation.

## Technology 03 — Liquid cooling evolution: direct-to-chip, rear-door, immersion

The cooling technology stack for AI datacenters is evolving through three phases, each with different infrastructure requirements:

**Phase 1 — Direct-to-chip liquid cooling (current standard for new AI deployments):** Cold plates attached to GPU packages remove heat at the source. Coolant (typically propylene glycol or engineered fluids) circulates through a closed loop to facility-level heat rejection. NVIDIA's reference design for GB200 NVL72 specifies direct-to-chip liquid cooling. Vertiv, CoolIT, and Asetek are the primary vendors.

**Phase 2 — Immersion cooling (emerging for highest-density deployments):** Entire servers are submerged in dielectric fluid (engineered fluorocarbon or hydrocarbon-based coolants). Immersion cooling supports rack densities exceeding 100 kW — beyond what direct-to-chip systems can efficiently manage. GRC, LiquidCool Solutions, and Submer are the leading vendors. Microsoft, Google, and Meta have all piloted immersion cooling at production scale.

**Phase 3 — Two-phase immersion (research/early commercial):** Uses phase-change fluids that boil on contact with hot components, carrying heat away as vapor and condensing in overhead heat exchangers. Two-phase immersion offers the highest cooling efficiency but requires specialized fluids (3M Novec, now discontinued — creating a supply issue) and sealed enclosures.

The liquid cooling market is projected to grow from $6.65 billion (2025) to $29.46 billion by 2033 (CAGR approximately 20%). This growth creates demand for supporting infrastructure — facility-level cooling distribution units, outdoor heat rejection equipment, and precision plumbing — that adds to datacenter construction complexity and timeline.

## Technology 04 — Microsoft MOSAIC MicroLED optical interconnects

Microsoft's MOSAIC (Micro-Optical Semiconductor Architecture for Interconnect Computing) program uses MicroLED arrays to create optical interconnects that operate at the board and chip-to-chip level — replacing copper traces with light for the shortest interconnect distances.

MOSAIC targets production readiness by late 2027. If successful, it would extend optical interconnects from the current minimum distance of approximately 3 meters (where pluggable transceivers become cost-effective) down to centimeters — replacing copper at the board level inside servers.

The germanium supply chain implication: MOSAIC uses III-V semiconductor materials (gallium arsenide, indium phosphide) rather than germanium for its MicroLED emitters. However, the receivers in MOSAIC and similar chip-level optical interconnect systems may use germanium photodetectors — the same technology that drives germanium demand in silicon photonics. If chip-level optical interconnects scale to millions of units per datacenter, the germanium demand from photodetectors could become significant.

More broadly, MOSAIC represents the extension of optical connectivity deeper into the compute stack. Every level where optics replaces copper requires fiber or waveguides — and at the datacenter facility level, the aggregate fiber consumption increases as optical interconnects penetrate from inter-building to intra-rack to intra-server distances.

## Technology 05 — Nuclear power for datacenters (SMRs and plant restarts)

Nuclear power has emerged as the preferred long-term solution for datacenter baseload power, driven by its high capacity factor (90%+), zero direct carbon emissions, and ability to provide dedicated behind-the-meter supply that bypasses grid interconnection queues.

**Three Mile Island Unit 1 restart (Microsoft-Constellation Energy):** Constellation Energy agreed to restart TMI Unit 1 (820 MW, shut down 2019) by 2027, with output contracted to Microsoft under a 20-year power purchase agreement. The restart requires NRC regulatory approval and approximately $1.6 billion in refurbishment.

**Amazon-Talen Energy (Susquehanna):** Amazon acquired a Talen Energy datacenter campus adjacent to the 2.5 GW Susquehanna nuclear plant for $650 million, with direct power connection to the plant's output.

**Google-Kairos Power (SMR):** Google signed a PPA with Kairos Power for small modular reactor capacity, with first reactor targeted for 2030. Kairos uses a molten-salt-cooled design with TRISO fuel. The Google agreement was the first corporate PPA for SMR power.

**NuScale Power:** The leading US SMR developer (77 MW per module, scalable to 462 MW in 6-module configuration) received NRC design certification in 2023 but faces commercial deployment challenges following the cancellation of the Carbon Free Power Project in Utah.

**Oklo and other advanced reactor companies:** Sam Altman-backed Oklo (15 MW Aurora microreactor), TerraPower (Bill Gates-backed Natrium reactor), and X-energy (Xe-100 pebble-bed HTGR) are developing advanced reactor designs targeting datacenter applications in the 2029–2032 timeframe.

Nuclear power for datacenters creates a dedicated power source that eliminates the grid interconnection bottleneck — the most binding constraint on datacenter deployment. If nuclear SMRs achieve commercial deployment at scale (2030+), they would unlock datacenter capacity in locations currently constrained by grid availability, fundamentally changing the geography of hyperscale deployment.

## Takeaway

The end-use layer's technology evolution is accelerating across all dimensions simultaneously. CPO and 1.6T/3.2T transceivers increase fiber demand per unit of compute. Liquid cooling enables higher rack densities that concentrate fiber connections. MOSAIC extends optical connectivity to shorter distances. Nuclear SMRs promise to relieve the power bottleneck that currently constrains deployment. For the germanium supply chain, the net vector is clear: every technology trend at the end-use layer increases the fiber intensity of AI infrastructure. More compute requires more bandwidth, which requires more fiber, which requires more germanium-doped preforms.

---

*Sources: NVIDIA Spectrum-X / CPO Product Announcements; Broadcom Tomahawk 5 Technical Specifications; OFC 2026 — 1.6T/3.2T Transceiver Technology Demonstrations; Vertiv Investor Presentations and Product Portfolio; CoolIT Systems and GRC Product Documentation; Microsoft MOSAIC Research Publications; Constellation Energy — Three Mile Island Unit 1 Restart Agreement; Amazon-Talen Energy Acquisition; Google-Kairos Power PPA Announcement; NuScale NRC Design Certification; Oklo Aurora Reactor Program; IEA — Nuclear Power for Datacenters Analysis.*
