# Emerging Tech — Cable Assembly Subsystem Layer

## Teaser
Space-division multiplexing, open cable systems, and 1.6T coherent optics are rewriting submarine cable economics — but hollow-core fiber could eliminate the germanium dependency entirely

## Title
Five technology shifts are reshaping the subsystem layer: SDM multi-core fiber, open cable architectures, 800G-to-1.6T coherent optics, distributed acoustic sensing, and next-generation cable laying vessel designs

## Category
Emerging tech

---

## Overview

The subsystem layer sits at the intersection of materials science, optical physics, and marine engineering. Technology shifts in any one of these domains can reshape the competitive landscape. Five emerging technologies are approaching commercial deployment between 2026 and 2030, each with the potential to alter cable system economics, shift market share between manufacturers, or fundamentally change how submarine and terrestrial networks are built and operated.

## Technology 01 — Space-division multiplexing (SDM) and multi-core fiber

Space-division multiplexing represents the most significant architectural change in submarine cable design since EDFA repeaters were introduced in the 1990s. SDM uses multiple cores within a single fiber — or multiple fibers in a single cable — to multiply transmission capacity without proportional increases in cable diameter or power consumption.

Google's Dunant cable (US–France, operational 2020) was the first submarine system to use SDM architecture, achieving 250 Tbps capacity across 12 fiber pairs. The technology has since progressed: NEC and partners demonstrated 20-core multi-core fiber transmission at 319 Tb/s per fiber in laboratory conditions. Commercial multi-core submarine cable systems using 4-core fiber are expected by 2028–2029.

SDM's impact on the subsystem layer is twofold. First, it increases the capacity per cable system, potentially reducing the total number of cable systems required to meet bandwidth targets — though historical experience suggests that capacity increases stimulate proportionally greater demand (Jevons paradox applied to bandwidth). Second, SDM requires new repeater designs that amplify multiple spatial modes simultaneously, creating an engineering advantage for manufacturers (SubCom, NEC) that have invested in SDM repeater development.

The germanium supply chain implication: SDM multi-core fiber requires germanium-doped preforms with more complex geometry than conventional single-mode fiber. Each core requires its own doped region, potentially increasing germanium consumption per kilometer of cable. However, if SDM reduces the total number of cable systems deployed, the net effect on germanium demand is ambiguous.

## Technology 02 — Open cable systems

Traditionally, submarine cable systems are procured as turnkey solutions from a single manufacturer — the same vendor supplies cable, repeaters, and terminal equipment. Open cable systems decouple the wet-plant (cable and repeaters) from the terminal equipment, allowing cable owners to select best-in-class components from different vendors and upgrade terminal equipment without replacing the submarine plant.

The Open Cable System (OCS) specification, championed by Meta (Facebook), Google, and Microsoft through the Telecom Infra Project (TIP), defines standard interfaces between wet-plant and terminal equipment. This architecture enables cable owners to upgrade line terminal equipment as coherent optical technology advances (from 400G to 800G to 1.6T wavelengths) without touching the subsea components.

For the subsystem layer, open cable systems shift value from integrated system suppliers toward component specialists. Wet-plant manufacturers (SubCom, ASN, NEC) lose the terminal equipment revenue bundle but gain from simplified repeater specifications. Coherent optics vendors (Ciena, Infinera/Nokia, Acacia/Cisco) gain direct access to submarine terminal equipment sales previously controlled by the cable manufacturer.

The open cable architecture also enables "spectrum sharing" — multiple users sharing capacity on the same cable system with independent terminal equipment, similar to how colocation works in datacenters. This model, pioneered on the MAREA cable (Microsoft-Meta-Telxius), is becoming standard for new hyperscaler-funded systems.

## Technology 03 — 800G and 1.6T coherent optics

Coherent optical transceiver technology — which encodes data on the amplitude, phase, and polarization of light — is the primary driver of submarine cable capacity growth. The industry is in the midst of a transition from 400G to 800G wavelengths, with 1.6T transceivers entering commercial availability in late 2025 and ramping through 2026.

For submarine applications, 800G coherent transponders (using 130nm baud rate technology) are now standard for new cable systems. Next-generation 1.6T transponders for submarine use require advances in digital signal processing, forward error correction, and nonlinear compensation that are expected to reach commercial maturity by 2027–2028.

The capacity impact is significant: upgrading terminal equipment from 400G to 800G wavelengths doubles the throughput of an existing cable system without any changes to the subsea plant. This "capacity unlock" through terminal upgrades is a key economic advantage of open cable architectures — and reduces the urgency to build entirely new cable systems for routes where existing cables can be upgraded.

For terrestrial networks, 800G and 1.6T coherent optics are driving demand for higher-quality single-mode fiber with tighter specifications — which means higher germanium content in preforms and more stringent manufacturing processes.

## Technology 04 — Distributed Acoustic Sensing (DAS)

DAS uses standard optical fiber as a continuous acoustic sensor, detecting vibrations and disturbances along the entire cable length. By injecting laser pulses into a fiber and analyzing the backscattered signal, DAS systems can detect anchor strikes, trawling activity, seismic events, and potential sabotage attempts in real time with spatial resolution of approximately 1 meter.

Following the Baltic Sea cable incidents, DAS monitoring has moved from experimental to mandatory for new cable systems in sensitive corridors. NATO has promoted DAS deployment on submarine cables in the North Atlantic and Baltic as part of its critical infrastructure protection strategy.

DAS monitoring requires dedicated fiber pairs within the cable — fibers that carry no commercial traffic but serve exclusively as sensing elements. This increases the fiber count per cable system and adds to manufacturing complexity. For existing cables, DAS can be implemented on dark (unused) fiber pairs, but new systems increasingly include purpose-designed sensing fibers.

The technology creates a new revenue stream for cable operators (selling monitoring data to governments and naval forces) and a new demand vector for fiber manufacturing. DAS-specific fiber with optimized backscatter properties is an emerging specialty product that commands premium pricing.

## Technology 05 — Next-generation cable laying vessel designs

CLV design is evolving to meet the requirements of modern cable systems. Key innovations include:

**Larger cable tanks:** The Leonardo da Vinci's 10,000-tonne capacity versus 5,000–7,000 tonnes for older vessels reduces the number of cable loading stops per project, compressing installation timelines.

**Dual-lay capability:** Modern CLVs can lay two cables simultaneously (telecom and power, or two telecom cables on parallel routes), effectively doubling vessel productivity per mobilization.

**DP3 dynamic positioning:** Triple-redundant positioning systems allow operations in sea states that would ground older vessels, extending weather windows by 30–40 operational days per year.

**Modular mission equipment:** Configurable deck layouts that switch between telecom cable laying, power cable laying, and cable repair missions without drydock modification.

These vessel innovations do not change the fundamental physics of cable installation (weather, water depth, seabed conditions), but they reduce the logistical overhead per project and expand the annual operating window — incrementally relieving the vessel scheduling bottleneck.

## Takeaway

The subsystem layer's technology trajectory is characterized by a tension between capacity multiplication (SDM, 1.6T optics) and physical infrastructure constraints (vessel availability, manufacturing throughput). Technologies that increase capacity per cable system (SDM, coherent optics upgrades) partially offset demand for new cable systems. But technologies that add new fiber requirements (DAS sensing, multi-core preforms) increase manufacturing load. The net effect through 2030 is likely capacity growth that exceeds manufacturing expansion — sustaining the seller's market for subsystem-layer providers. Hollow-core fiber, if it reaches submarine cable qualification, would fundamentally disrupt this dynamic by eliminating the germanium dependency at the preform stage.

---

*Sources: Google Dunant Cable Technical Specifications; NEC — Multi-Core Fiber Demonstration; Telecom Infra Project — Open Cable System Specification; Ciena — 800G Coherent Optics for Submarine; OFC 2026 — 1.6T Coherent Transceiver Demonstrations; NATO — DAS for Submarine Cable Protection; Prysmian Leonardo da Vinci CLV Technical Documentation; TeleGeography — Submarine Cable Technology Trends; Light Reading — Open Cable Architecture Analysis.*
