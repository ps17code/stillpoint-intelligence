"use client";
import React, { useState } from "react";

/* ─── Types ─── */
interface InputCard {
  id: string;
  name: string;
  description: string;
  players: string;
  insight: string;
  mapped: boolean;
  downstream: string[];
  upstream: string[];
}

interface LayerRow {
  label: string;
  accent: string;
  cards: InputCard[];
}

/* ─── Data ─── */
const LAYERS: LayerRow[] = [
  {
    label: "RAW MATERIALS",
    accent: "#c9a84c",
    cards: [
      { id: "germanium", name: "Germanium", description: "Trace metal found in zinc ore and coal ash. Doped into glass to allow light to travel through fiber optic cable.", players: "Yunnan Chihong, Umicore, 5N Plus, Teck Resources", insight: "Fixed supply, rising AI demand. Structural deficit by 2026. Prices already 2x.", mapped: true, downstream: ["fiber-optic-cable", "connectivity", "datacenter"], upstream: [] },
      { id: "copper", name: "Copper", description: "Base metal mined from sulfide and oxide ores. Conducts power and signal across every datacenter system \u2014 bus bars, wiring harnesses, PCB traces, and heat exchangers. Each MW of capacity embeds roughly 25 tonnes.", players: "Codelco, Freeport-McMoRan, BHP, Southern Copper", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "silicon", name: "Silicon", description: "Metalloid refined from quartz sand into ultra-high-purity wafers. The semiconductor substrate for every chip in the facility \u2014 GPUs, CPUs, memory, networking ASICs, power management ICs.", players: "Shin-Etsu, SUMCO, Siltronic, SK Siltron", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "gallium", name: "Gallium", description: "Soft metal extracted as a byproduct of aluminum refining. Used to manufacture gallium arsenide and gallium nitride semiconductors that power optical transceivers and high-frequency RF components.", players: "China-dominated production, Indium Corp, AXT, Freiberger", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "aluminum", name: "Aluminum", description: "Lightweight metal smelted from bauxite ore. Used in heat sinks, server chassis, rack frames, cooling assemblies, and structural enclosures. The dominant material for thermal management at scale.", players: "Alcoa, Rio Tinto, Norsk Hydro, Hindalco", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "lithium", name: "Lithium", description: "Alkali metal extracted from brine pools and hard rock deposits. Powers lithium-ion battery backup systems (UPS) that maintain uninterrupted datacenter operation during grid failures.", players: "Albemarle, SQM, Ganfeng Lithium, Pilbara Minerals", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "tantalum", name: "Tantalum", description: "Refractory metal mined primarily from coltan ore in Central Africa. Used in high-reliability capacitors on server boards that ensure stable power delivery under high temperatures.", players: "AMG Advanced Metallurgical, Global Advanced Metals, Kemet", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "silver", name: "Silver", description: "Precious metal with the highest electrical conductivity of any element. Used in high-performance connectors, soldering materials, and signal-critical pathways where minimal resistance matters.", players: "Fresnillo, Newmont, Pan American Silver, KGHM", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "tin", name: "Tin", description: "Base metal mined from cassiterite ore. The primary material in lead-free solder that bonds components to every circuit board in the facility.", players: "Yunnan Tin, PT Timah, Minsur, Alphamin Resources", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "rare-earths", name: "Rare earths", description: "Mined from monazite and bastn\u00e4site deposits. Used to make permanent magnets found in cooling fan motors, hard drive actuators, and power converter inductors.", players: "MP Materials, Lynas, China Northern Rare Earth, Shenghe Resources", insight: "", mapped: false, downstream: [], upstream: [] },
    ],
  },
  {
    label: "COMPONENTS",
    accent: "#6a9ab8",
    cards: [
      { id: "fiber-optic-cable", name: "Fiber optic cable", description: "Glass strands doped with germanium that carry light between servers and across continents. Germanium is converted to liquid GeCl\u2084, deposited into glass preform rods, drawn into fiber, and bundled into cable.", players: "Umicore (GeCl\u2084), Corning, Prysmian, Sumitomo Electric, Fujikura, YOFC", insight: "", mapped: true, downstream: ["connectivity", "datacenter"], upstream: ["germanium"] },
      { id: "optical-transceivers", name: "Optical transceivers", description: "Modules that convert electrical signals to light and back. Built on gallium arsenide laser chips. Every fiber connection in a datacenter needs one on each end.", players: "Coherent, Lumentum, Broadcom, Intel, Cisco", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "network-switches", name: "Network switches", description: "Route data between servers and racks at high speed. Built around custom silicon ASICs designed for packet processing at terabit scale.", players: "Broadcom, Cisco, Arista, Juniper, NVIDIA (Spectrum)", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "gpu", name: "GPUs / AI accelerators", description: "Parallel processors for AI training and inference. Fabricated on silicon wafers at 3-5nm, packaged with stacked memory. The highest-value component in any AI datacenter.", players: "NVIDIA, AMD, Broadcom, Google (TPU), Intel", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "hbm", name: "HBM memory", description: "Memory chips stacked vertically and bonded directly to GPUs. Enables the data throughput AI workloads require. Without it, GPUs can\u2019t be fed fast enough.", players: "SK Hynix, Samsung, Micron", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "server-boards", name: "Server boards", description: "Circuit boards that connect GPUs, CPUs, memory, and networking into a single server. Fabricated by layering copper traces onto fiberglass substrate, then populated with components via solder.", players: "Foxconn, Quanta, Wiwynn, Supermicro", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "power-transformers", name: "Power transformers", description: "Step down utility voltage for datacenter use. Copper or aluminum wire wound around a laminated steel core. Lead times currently 2-3 years due to competing grid demand.", players: "Hitachi Energy, Siemens Energy, ABB, GE Vernova", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "ups-battery", name: "UPS / battery systems", description: "Battery packs that provide uninterrupted power during grid failures. Lithium-ion cells assembled into modules with power management electronics. Competing with EV sector for cell supply.", players: "Eaton, Vertiv, Schneider Electric, CATL, Samsung SDI", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "pdu", name: "Power distribution units", description: "Distribute power from the transformer to individual racks. Bus bars, breakers, and metering assembled into switchgear cabinets. Every rack connects through a PDU.", players: "Eaton, Schneider Electric, Vertiv, Legrand", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "generators", name: "Backup generators", description: "Diesel or natural gas engines paired with alternators that supply emergency power. Activated within seconds of a grid outage. Required for uptime SLAs.", players: "Caterpillar, Cummins, Rolls-Royce (MTU), Generac", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "liquid-cooling", name: "Liquid cooling systems", description: "Cold plates mounted on GPUs circulate liquid coolant to remove heat. Machined from copper or aluminum with precision microchannels. Essential as GPU power density exceeds what air cooling can handle.", players: "Vertiv, CoolIT, GRC, LiquidCool Solutions, Motivair", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "chillers", name: "Chillers", description: "Refrigeration units that cool the water or coolant circulating through the facility. Compressors and heat exchangers built from copper coils and steel housings.", players: "Trane (Ingersoll Rand), Carrier, Johnson Controls, Daikin", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "air-handling", name: "Air handling units", description: "Fans and coil systems that circulate and condition air through server rooms. Aluminum and copper heat exchangers with variable-speed fan motors.", players: "Schneider Electric, Vertiv, Stulz, Munters", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "rack-enclosures", name: "Rack enclosures", description: "Steel and aluminum frames that house servers, switches, and cabling. Standardized 42U or 48U form factor. Fabricated from sheet metal, powder coated.", players: "Rittal, Schneider Electric (APC), Vertiv, CPI", insight: "", mapped: false, downstream: [], upstream: [] },
    ],
  },
  {
    label: "SUBSYSTEMS",
    accent: "#5cd4c8",
    cards: [
      { id: "connectivity", name: "Connectivity", description: "The network infrastructure moving data between servers, racks, buildings, and the outside world. Assembled from fiber optic cables, optical transceivers, and network switches into a structured cabling and switching fabric.", players: "Corning, Cisco, Arista, Juniper, CommScope", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "compute", name: "Compute", description: "The processing infrastructure where AI training and inference happens. GPUs, HBM memory, and CPUs assembled onto server boards and mounted into rack-scale systems. The highest-value and most power-hungry subsystem.", players: "NVIDIA, Dell, HPE, Supermicro, Quanta, Wiwynn", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "power", name: "Power", description: "The electrical infrastructure delivering energy from grid to chip. Transformers, distribution units, battery backup, and generators integrated into a redundant power chain. A single facility can draw 100MW+ from the grid.", players: "Eaton, Schneider Electric, Vertiv, ABB, Caterpillar", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "cooling", name: "Cooling", description: "The thermal infrastructure removing heat from high-density compute. Liquid cooling loops, chillers, and air handling working together to keep GPU temperatures stable. Fastest-growing subsystem as rack density increases.", players: "Vertiv, CoolIT, Schneider Electric, Trane, Stulz", insight: "", mapped: false, downstream: [], upstream: [] },
      { id: "physical-structure", name: "Physical structure", description: "The building and mechanical infrastructure housing everything. Steel structure, rack enclosures, raised flooring, fire suppression, and physical security. The shell that contains all other subsystems.", players: "Rittal, Schneider Electric, Legrand, various general contractors", insight: "", mapped: false, downstream: [], upstream: [] },
    ],
  },
  {
    label: "END USE",
    accent: "#7acc8e",
    cards: [
      { id: "datacenter", name: "AI datacenter", description: "The facility where compute, connectivity, power, cooling, and physical structure come together to run AI workloads at scale. The primary demand driver pulling through every upstream layer.", players: "AWS, Microsoft Azure, Google Cloud, Meta, Oracle, CoreWeave", insight: "", mapped: false, downstream: [], upstream: [] },
    ],
  },
];

// Build full connection set for a card
function getConnected(cardId: string): Set<string> {
  const result = new Set<string>();
  const allCards = LAYERS.flatMap(l => l.cards);
  const card = allCards.find(c => c.id === cardId);
  if (!card) return result;
  card.downstream.forEach(id => result.add(id));
  card.upstream.forEach(id => result.add(id));
  return result;
}

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };

/* ─── Component ─── */
export default function AnatomyView() {
  const [selected, setSelected] = useState<string | null>(null);
  const connected = selected ? getConnected(selected) : null;

  const selectedCard = selected ? LAYERS.flatMap(l => l.cards).find(c => c.id === selected) : null;
  const connectedCount = connected ? connected.size : 0;

  return (
    <div style={{
      position: "absolute", inset: 0, paddingTop: 52,
      display: "flex", flexDirection: "column",
      overflow: "auto",
    }}>
      <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ padding: "32px 0 28px" }}>
          <div style={{
            ...MONO, fontSize: 9, letterSpacing: "0.12em", color: "#5a5550",
            marginBottom: 14, textTransform: "uppercase" as const,
          }}>
            AI Infrastructure · Product Class
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 42, fontWeight: 400, lineHeight: 1.12,
            letterSpacing: "-0.01em", color: "#ece8e1",
            margin: 0, marginBottom: 12,
          }}>
            What goes in a data center.
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, color: "#706a60", lineHeight: 1.55,
            margin: 0, maxWidth: 1000,
          }}>
            Every critical input from raw minerals to hyperscale datacenters. Select any input to trace its dependencies across the full stack.
          </p>
        </div>

        {/* Product overview container */}
        <div style={{
          border: "1px solid #252220", borderRadius: 12,
          padding: "24px 24px 16px", background: "#131210",
        }}>
        {LAYERS.map((layer) => (
          <div key={layer.label} style={{ marginBottom: 24 }}>
            {/* Layer label */}
            <div style={{
              ...MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.12em",
              color: layer.accent, marginBottom: 10,
            }}>
              {layer.label}
            </div>

            {/* Cards row */}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
              {layer.cards.map((card) => {
                const isSel = selected === card.id;
                const isConn = connected?.has(card.id);
                const dimmed = selected !== null && !isSel && !isConn;

                const bg = isSel
                  ? `${layer.accent}12`
                  : isConn ? "#1e1c18"
                  : "#161414";
                const border = isSel
                  ? `${layer.accent}50`
                  : isConn ? "#2e2a25"
                  : "#1e1c1a";
                const nameColor = isSel ? "#ece8e1" : "#908880";

                return (
                  <div
                    key={card.id}
                    onClick={() => setSelected(prev => prev === card.id ? null : card.id)}
                    style={{
                      width: 195, flexShrink: 0,
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      cursor: "pointer",
                      opacity: dimmed ? 0.15 : 1,
                      transition: "opacity 0.25s ease, background 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    {/* Name */}
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                      color: nameColor, marginBottom: 6,
                      display: "flex", alignItems: "center", gap: 4,
                      transition: "color 0.2s",
                    }}>
                      {card.name}
                      {card.mapped && (
                        <span style={{ color: layer.accent, opacity: 0.4, fontSize: 11 }}>\u2192</span>
                      )}
                    </div>

                    {/* Description */}
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#706a60",
                      lineHeight: 1.5, marginBottom: 8,
                    }}>
                      {card.description}
                    </div>

                    {/* Key players */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{
                        ...MONO, fontSize: 9, color: "#3a3835", letterSpacing: "0.05em", marginBottom: 2,
                      }}>
                        Key players
                      </div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#4a4540", lineHeight: 1.45,
                      }}>
                        {card.players}
                      </div>
                    </div>

                    {/* Insight (only when selected) */}
                    {isSel && card.insight && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10.5,
                        color: layer.accent, opacity: 0.7, lineHeight: 1.45,
                        borderLeft: `2px solid ${layer.accent}30`,
                        paddingLeft: 8, marginTop: 8,
                      }}>
                        {card.insight}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        </div>{/* end product overview container */}

        {/* Info bar when selected */}
        {selected && selectedCard && (
          <div style={{
            background: "#1a1816", border: "1px solid #252220", borderRadius: 8,
            padding: "12px 16px", marginTop: 8, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#908880", flex: 1,
            }}>
              Showing dependencies for <strong style={{ color: "#ece8e1", fontWeight: 500 }}>{selectedCard.name}</strong> · {connectedCount} connected nodes
            </span>
            {selectedCard.mapped && (
              <button
                onClick={(e) => { e.stopPropagation(); window.location.href = "/chains/germanium"; }}
                style={{
                  ...MONO, fontSize: 9, letterSpacing: "0.04em",
                  background: "none", border: "1px solid #2e2a25", borderRadius: 6,
                  padding: "6px 12px", color: "#908880", cursor: "pointer",
                  transition: "color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#ece8e1"; e.currentTarget.style.borderColor = "#4a4540"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#908880"; e.currentTarget.style.borderColor = "#2e2a25"; }}
              >
                View full chain \u2192
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(null); }}
              style={{
                ...MONO, fontSize: 9,
                background: "none", border: "none", padding: "6px 8px",
                color: "#555", cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
