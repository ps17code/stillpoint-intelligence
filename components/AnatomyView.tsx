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
      {
        id: "germanium",
        name: "Germanium",
        description: "Trace metal found in zinc ore and coal ash. Doped into glass to allow light to travel through fiber optic cable.",
        players: "Yunnan Chihong, Umicore, 5N Plus, Teck Resources",
        insight: "Fixed supply, rising AI demand. Structural deficit by 2026. Prices already 2x.",
        mapped: true,
        downstream: ["gecl4", "fiber-cable", "datacenter", "subsea", "broadband"],
        upstream: [],
      },
    ],
  },
  {
    label: "COMPONENTS",
    accent: "#6a9ab8",
    cards: [
      {
        id: "gecl4",
        name: "GeO\u2082 / GeCl\u2084",
        description: "Germanium converted into a volatile liquid chemical that gets vaporized and deposited into glass. Without it, light won\u2019t pass through fiber.",
        players: "Umicore, Yunnan Chihong, Chinese State GeCl\u2084 Plants, JSC Germanium",
        insight: "Only one western supplier of GeCl\u2084. One facility in Belgium.",
        mapped: true,
        downstream: ["fiber-cable", "datacenter", "subsea", "broadband"],
        upstream: ["germanium"],
      },
    ],
  },
  {
    label: "SUBSYSTEMS",
    accent: "#5cd4c8",
    cards: [
      {
        id: "fiber-cable",
        name: "Fiber optic cable",
        description: "Germanium-doped glass strands bundled into cables connecting servers, cities, and continents. The physical backbone of the internet.",
        players: "Corning, Prysmian, Sumitomo Electric, Fujikura, CommScope, YOFC",
        insight: "A single 36MW datacenter requires ~120,000 km of fiber.",
        mapped: true,
        downstream: ["datacenter", "subsea", "broadband"],
        upstream: ["germanium", "gecl4"],
      },
    ],
  },
  {
    label: "END USE",
    accent: "#7acc8e",
    cards: [
      {
        id: "datacenter",
        name: "AI datacenter",
        description: "Hyperscale GPU clusters for AI training and inference. The primary demand driver pulling through every layer of this chain.",
        players: "AWS, Microsoft Azure, Google Cloud, Meta, Oracle",
        insight: "~35 GW of new datacenter capacity coming online by 2027.",
        mapped: true,
        downstream: [],
        upstream: ["germanium", "gecl4", "fiber-cable"],
      },
      {
        id: "broadband",
        name: "Broadband / telecom",
        description: "Terrestrial fiber networks connecting homes, cities, and enterprises. Ongoing global buildout.",
        players: "AT&T, Verizon, Deutsche Telekom, NTT, BT",
        insight: "Competing with AI datacenters for the same constrained fiber supply.",
        mapped: false,
        downstream: [],
        upstream: ["germanium", "gecl4", "fiber-cable"],
      },
      {
        id: "subsea",
        name: "Subsea networks",
        description: "Undersea cable systems connecting continents. Each system spans thousands of kilometers with higher germanium loading per km than terrestrial.",
        players: "SubCom, Alcatel Submarine Networks, NEC, Google, Meta",
        insight: "New transpacific routes from Google and Meta adding unplanned demand.",
        mapped: false,
        downstream: [],
        upstream: ["germanium", "gecl4", "fiber-cable"],
      },
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

                    {/* Insight */}
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 10.5,
                      color: layer.accent, opacity: 0.7, lineHeight: 1.45,
                      borderLeft: `2px solid ${layer.accent}30`,
                      paddingLeft: 8, marginTop: 8,
                    }}>
                      {card.insight}
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
