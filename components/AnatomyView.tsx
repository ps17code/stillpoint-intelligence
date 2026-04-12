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
  status?: string;
}

const STATUS_COLOR: Record<string, string> = {
  "Constrained": "#6a4a40",
  "Tightening": "#6a6030",
  "Available": "#3a6a45",
  "Oversupplied": "#3a5a6a",
};

interface LayerRow {
  label: string;
  accent: string;
  cards: InputCard[];
}

/* ─── Data ─── */
const LAYERS: LayerRow[] = [
  {
    label: "RAW MATERIALS",
    accent: "#C4A46C",
    cards: [
      { id: "germanium", name: "Germanium", status: "Constrained", description: "Trace metal that dopes glass to carry light through fiber optic cable. Essential for all fiber-based connectivity.", players: "Yunnan Chihong, Umicore, 5N Plus, Teck Resources", insight: "Fixed supply, rising AI demand. Structural deficit by 2026. Prices already 2x.", mapped: true, downstream: ["fiber-optic-cable", "connectivity", "datacenter"], upstream: [] },
      { id: "copper", name: "Copper", status: "Tightening", description: "Conducts power and signal across every datacenter system \u2014 wiring, bus bars, PCB traces, heat exchangers, and cooling loops.", players: "Codelco, Freeport-McMoRan, BHP, Southern Copper", insight: "", mapped: false, downstream: ["fiber-optic-cable", "server-boards", "power-transformers", "pdu", "liquid-cooling", "chillers", "air-handling", "power", "cooling", "connectivity", "compute", "datacenter"], upstream: [] },
      { id: "silicon", name: "Silicon", status: "Available", description: "The semiconductor substrate for every chip in the facility \u2014 GPUs, CPUs, memory, networking ASICs, and power management.", players: "Shin-Etsu, SUMCO, Siltronic, SK Siltron", insight: "", mapped: false, downstream: ["gpu", "hbm", "network-switches", "optical-transceivers", "server-boards", "compute", "connectivity", "datacenter"], upstream: [] },
      { id: "gallium", name: "Gallium", status: "Constrained", description: "Enables the high-speed laser chips inside optical transceivers that convert electrical signals to light for fiber communication.", players: "China-dominated production, Indium Corp, AXT, Freiberger", insight: "", mapped: false, downstream: ["optical-transceivers", "connectivity", "datacenter"], upstream: [] },
      { id: "aluminum", name: "Aluminum", status: "Available", description: "Lightweight and thermally conductive. Used in heat sinks, rack frames, cooling assemblies, and structural enclosures.", players: "Alcoa, Rio Tinto, Norsk Hydro, Hindalco", insight: "", mapped: false, downstream: ["liquid-cooling", "air-handling", "rack-enclosures", "cooling", "physical-structure", "datacenter"], upstream: [] },
      { id: "lithium", name: "Lithium", status: "Oversupplied", description: "Powers the battery backup systems that keep datacenters running through grid outages.", players: "Albemarle, SQM, Ganfeng Lithium, Pilbara Minerals", insight: "", mapped: false, downstream: ["ups-battery", "power", "datacenter"], upstream: [] },
      { id: "tantalum", name: "Tantalum", status: "Available", description: "Used in high-reliability capacitors on server boards that ensure stable power delivery under high temperatures.", players: "AMG Advanced Metallurgical, Global Advanced Metals, Kemet", insight: "", mapped: false, downstream: ["server-boards", "compute", "datacenter"], upstream: [] },
      { id: "silver", name: "Silver", status: "Available", description: "Highest electrical conductivity of any metal. Used in connectors, solder, and signal-critical pathways where minimal resistance matters.", players: "Fresnillo, Newmont, Pan American Silver, KGHM", insight: "", mapped: false, downstream: ["server-boards", "compute", "datacenter"], upstream: [] },
      { id: "tin", name: "Tin", status: "Available", description: "The primary material in lead-free solder bonding components to every circuit board in the facility.", players: "Yunnan Tin, PT Timah, Minsur, Alphamin Resources", insight: "", mapped: false, downstream: ["server-boards", "compute", "datacenter"], upstream: [] },
      { id: "rare-earths", name: "Rare earths", status: "Tightening", description: "Used to make permanent magnets found in cooling fan motors, hard drive actuators, and generator alternators.", players: "MP Materials, Lynas, China Northern Rare Earth, Shenghe Resources", insight: "", mapped: false, downstream: ["air-handling", "generators", "cooling", "power", "datacenter"], upstream: [] },
    ],
  },
  {
    label: "COMPONENTS",
    accent: "#9BA8AB",
    cards: [
      { id: "fiber-optic-cable", name: "Fiber optic cable", status: "Constrained", description: "Glass strands doped with germanium that carry light signals between servers, racks, buildings, and continents. The physical backbone of all datacenter connectivity.", players: "Umicore (GeCl\u2084), Corning, Prysmian, Sumitomo Electric, Fujikura, YOFC", insight: "", mapped: true, downstream: ["connectivity", "datacenter"], upstream: ["germanium"] },
      { id: "optical-transceivers", name: "Optical transceivers", status: "Constrained", description: "Modules that convert electrical signals to light and back. Built on gallium-based laser chips. Every fiber connection in a datacenter needs one on each end.", players: "Coherent, Lumentum, Broadcom, Intel, Cisco", insight: "", mapped: false, downstream: ["connectivity", "datacenter"], upstream: [] },
      { id: "network-switches", name: "Network switches", status: "Available", description: "Route data between servers and racks at terabit scale. Built around custom silicon ASICs for high-speed packet processing.", players: "Broadcom, Cisco, Arista, Juniper, NVIDIA (Spectrum)", insight: "", mapped: false, downstream: ["connectivity", "datacenter"], upstream: [] },
      { id: "gpu", name: "GPUs / AI accelerators", status: "Constrained", description: "Parallel processors that handle AI training and inference workloads. The highest-value and most supply-constrained component in any AI datacenter.", players: "NVIDIA, AMD, Broadcom, Google (TPU), Intel", insight: "", mapped: false, downstream: ["compute", "datacenter"], upstream: [] },
      { id: "hbm", name: "HBM memory", status: "Constrained", description: "Memory stacked vertically and bonded directly to GPUs. Enables the data throughput AI workloads require \u2014 without it, GPUs can\u2019t be fed fast enough.", players: "SK Hynix, Samsung, Micron", insight: "", mapped: false, downstream: ["compute", "datacenter"], upstream: [] },
      { id: "server-boards", name: "Server boards", status: "Tightening", description: "Circuit boards that connect GPUs, CPUs, memory, and networking into a single server unit.", players: "Foxconn, Quanta, Wiwynn, Supermicro", insight: "", mapped: false, downstream: ["compute", "datacenter"], upstream: [] },
      { id: "power-transformers", name: "Power transformers", status: "Constrained", description: "Step down high-voltage utility power to usable datacenter levels. Lead times currently 2-3 years due to competing demand from grid expansion.", players: "Hitachi Energy, Siemens Energy, ABB, GE Vernova", insight: "", mapped: false, downstream: ["power", "datacenter"], upstream: [] },
      { id: "ups-battery", name: "UPS / battery systems", status: "Available", description: "Battery packs that provide uninterrupted power during grid failures. Lithium-ion cells competing with the EV sector for supply.", players: "Eaton, Vertiv, Schneider Electric, CATL, Samsung SDI", insight: "", mapped: false, downstream: ["power", "datacenter"], upstream: [] },
      { id: "pdu", name: "Power distribution units", status: "Available", description: "Distribute power from the transformer to individual racks. Bus bars, breakers, and metering in switchgear cabinets.", players: "Eaton, Schneider Electric, Vertiv, Legrand", insight: "", mapped: false, downstream: ["power", "datacenter"], upstream: [] },
      { id: "generators", name: "Backup generators", status: "Available", description: "Diesel or gas engines that supply emergency power within seconds of a grid outage. Required for uptime SLAs.", players: "Caterpillar, Cummins, Rolls-Royce (MTU), Generac", insight: "", mapped: false, downstream: ["power", "datacenter"], upstream: [] },
      { id: "liquid-cooling", name: "Liquid cooling systems", status: "Tightening", description: "Cold plates mounted on GPUs circulate liquid coolant to remove heat. Essential as GPU power density exceeds what air cooling can handle.", players: "Vertiv, CoolIT, GRC, LiquidCool Solutions, Motivair", insight: "", mapped: false, downstream: ["cooling", "datacenter"], upstream: [] },
      { id: "chillers", name: "Chillers", status: "Available", description: "Refrigeration units that cool the water or coolant circulating through the facility.", players: "Trane (Ingersoll Rand), Carrier, Johnson Controls, Daikin", insight: "", mapped: false, downstream: ["cooling", "datacenter"], upstream: [] },
      { id: "air-handling", name: "Air handling units", status: "Available", description: "Fan and coil systems that circulate and condition air through server rooms.", players: "Schneider Electric, Vertiv, Stulz, Munters", insight: "", mapped: false, downstream: ["cooling", "datacenter"], upstream: [] },
      { id: "rack-enclosures", name: "Rack enclosures", status: "Available", description: "Steel and aluminum frames that house servers, switches, and cabling in standardized form factors.", players: "Rittal, Schneider Electric (APC), Vertiv, CPI", insight: "", mapped: false, downstream: ["physical-structure", "datacenter"], upstream: [] },
    ],
  },
  {
    label: "SUBSYSTEMS",
    accent: "#B87D5E",
    cards: [
      { id: "connectivity", name: "Connectivity", status: "Constrained", description: "The network infrastructure moving data between servers, racks, buildings, and the outside world. Assembled from fiber optic cables, optical transceivers, and network switches into a structured cabling and switching fabric.", players: "Corning, Cisco, Arista, Juniper, CommScope", insight: "", mapped: false, downstream: ["datacenter"], upstream: [] },
      { id: "compute", name: "Compute", status: "Constrained", description: "The processing infrastructure where AI training and inference happens. GPUs, HBM memory, and CPUs assembled onto server boards and mounted into rack-scale systems. The highest-value and most power-hungry subsystem.", players: "NVIDIA, Dell, HPE, Supermicro, Quanta, Wiwynn", insight: "", mapped: false, downstream: ["datacenter"], upstream: [] },
      { id: "power", name: "Power", status: "Constrained", description: "The electrical infrastructure delivering energy from grid to chip. Transformers, distribution units, battery backup, and generators integrated into a redundant power chain. A single facility can draw 100MW+ from the grid.", players: "Eaton, Schneider Electric, Vertiv, ABB, Caterpillar", insight: "", mapped: false, downstream: ["datacenter"], upstream: [] },
      { id: "cooling", name: "Cooling", status: "Tightening", description: "The thermal infrastructure removing heat from high-density compute. Liquid cooling loops, chillers, and air handling working together to keep GPU temperatures stable. Fastest-growing subsystem as rack density increases.", players: "Vertiv, CoolIT, Schneider Electric, Trane, Stulz", insight: "", mapped: false, downstream: ["datacenter"], upstream: [] },
      { id: "physical-structure", name: "Physical structure", status: "Available", description: "The building and mechanical infrastructure housing everything. Steel structure, rack enclosures, raised flooring, fire suppression, and physical security. The shell that contains all other subsystems.", players: "Rittal, Schneider Electric, Legrand, various general contractors", insight: "", mapped: false, downstream: ["datacenter"], upstream: [] },
    ],
  },
  {
    label: "END USE",
    accent: "#D4CCBA",
    cards: [
      { id: "datacenter", name: "AI datacenter", status: "Constrained", description: "The facility where compute, connectivity, power, cooling, and physical structure come together to run AI workloads at scale. The primary demand driver pulling through every upstream layer.", players: "AWS, Microsoft Azure, Google Cloud, Meta, Oracle, CoreWeave", insight: "", mapped: false, downstream: [], upstream: [] },
    ],
  },
];

// Build full connection set for a card (downstream + upstream via reverse lookup)
function getConnected(cardId: string): Set<string> {
  const result = new Set<string>();
  const allCards = LAYERS.flatMap(l => l.cards);
  const card = allCards.find(c => c.id === cardId);
  if (!card) return result;
  // Downstream: cards this one feeds into
  card.downstream.forEach(id => result.add(id));
  // Upstream: cards whose downstream includes this card's id
  allCards.forEach(c => {
    if (c.id !== cardId && c.downstream.includes(cardId)) {
      result.add(c.id);
    }
  });
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
      <div style={{ padding: "0 40px", maxWidth: 1200, margin: "0 auto", width: "100%", transform: "scale(0.8)", transformOrigin: "top center" }}>

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

        {/* Featured analysis */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ ...MONO, fontSize: 10, letterSpacing: "0.12em", color: "#555", margin: "0 0 16px 0" }}>
            &#9670; FEATURED ANALYSIS
          </p>
          <a
            href="/chains/germanium"
            style={{
              display: "flex", alignItems: "center", gap: 20,
              background: "#1e1c18", border: "1px solid #2a2620", borderRadius: 10,
              padding: "20px 24px", textDecoration: "none",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#3a3630"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2620"; }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#ece8e1", margin: "0 0 4px 0" }}>
                Germanium → Fiber
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#706a60", lineHeight: 1.5, margin: 0 }}>
                Severe supply constraints from raw germanium to preform equipment. Prices at 7-year highs. Lead times past 60 weeks. Deficit can&#39;t close before 2027.
              </p>
            </div>
            <div style={{ fontSize: 11, color: "#706a60", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 5, border: "1px solid #252220", flexShrink: 0, whiteSpace: "nowrap" as const }}>
              Read analysis <span style={{ fontSize: 13 }}>→</span>
            </div>
          </a>
        </div>

        {/* Product overview container */}
        <div style={{
          border: "1px solid #1e1c18", borderRadius: 12,
          padding: "24px 24px 16px", background: "rgba(11,11,11,1)",
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
                  ? "#1e1c1a"
                  : isConn ? "#1a1816"
                  : "#161414";
                const border = isSel
                  ? "#3a3835"
                  : isConn ? "#2a2825"
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
                      opacity: dimmed ? 0.15 : (card.mapped || isSel || isConn) ? 1 : 0.6,
                      transition: "opacity 0.25s ease, background 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={e => { if (!card.mapped && !isSel && !isConn && !dimmed) e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={e => { if (!card.mapped && !isSel && !isConn && !dimmed) e.currentTarget.style.opacity = "0.6"; }}
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
                        <span style={{ fontSize: 8, color: "#555", letterSpacing: "0.06em", padding: "2px 6px", border: "1px solid #252220", borderRadius: 3, marginLeft: 6 }}>LIVE</span>
                      )}
                    </div>

                    {/* Description */}
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: "#706a60",
                      lineHeight: 1.5, marginBottom: 8,
                    }}>
                      {card.description}
                    </div>

                    {/* Insight (only when selected) */}
                    {isSel && card.insight && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 10.5,
                        color: "#a09888", opacity: 0.7, lineHeight: 1.45,
                        borderLeft: "2px solid #3a383530",
                        paddingLeft: 8, marginBottom: 8,
                      }}>
                        {card.insight}
                      </div>
                    )}

                    {/* Key players */}
                    <div>
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

                    {/* Supply status */}
                    {card.status && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[card.status] || "#4a4540", flexShrink: 0 }} />
                        <span style={{ ...MONO, fontSize: 8, color: STATUS_COLOR[card.status] || "#4a4540", letterSpacing: "0.04em" }}>{card.status}</span>
                      </div>
                    )}

                    {/* Dive deeper / Coming soon */}
                    <div style={{
                      maxHeight: isSel ? 30 : 0,
                      opacity: isSel ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.25s ease, opacity 0.2s ease",
                    }}>
                      {card.mapped ? (
                        <div
                          onClick={(e) => { e.stopPropagation(); window.location.href = `/input/${card.id}`; }}
                          style={{
                            ...MONO, fontSize: 9, color: "#ece8e1", letterSpacing: "0.03em",
                            margin: "10px 0 0 0", cursor: "pointer",
                          }}
                        >
                          Dive deeper →
                        </div>
                      ) : (
                        <div style={{
                          ...MONO, fontSize: 9, color: "#3a3835", fontStyle: "italic",
                          margin: "10px 0 0 0",
                        }}>
                          Coming soon
                        </div>
                      )}
                    </div>
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
