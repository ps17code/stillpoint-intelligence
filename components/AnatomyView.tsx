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
        description: "Trace element found in zinc ore and coal ash. Doped into glass to allow light transmission through fiber optics. Only 220 tonnes produced per year globally.",
        players: "Yunnan Chihong, Umicore, 5N Plus, Teck Resources",
        insight: "83% of supply is in China, now export-restricted. AI datacenter demand requires ~325t by 2026 against 220t supply. Structural deficit with no near-term fix.",
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
        description: "Germanium tetrachloride \u2014 a volatile liquid chemical vaporized and deposited into glass preforms. Without it, light cannot pass through fiber.",
        players: "Umicore, Yunnan Chihong, Chinese State GeCl\u2084 Plants, JSC Germanium",
        insight: "Only one non-Chinese supplier exists: Umicore, operating from a single facility in Belgium. The entire western fiber optic supply chain runs through it.",
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
        description: "Germanium-doped glass strands bundled into cables for datacenter interconnect, terrestrial networks, and subsea systems. Over 1 billion strands produced annually.",
        players: "Corning, Prysmian, Sumitomo Electric, Fujikura, CommScope, YOFC",
        insight: "A single AI GPU rack requires 16x more fiber than traditional infrastructure. Every new hyperscale datacenter campus is a step-change in fiber demand.",
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
        description: "Hyperscale and enterprise GPU clusters for AI training and inference. The primary demand driver for all upstream inputs in this chain.",
        players: "AWS, Microsoft Azure, Google Cloud, Meta, Oracle",
        insight: "$700B+ in planned datacenter capex through 2030. Each facility pulls demand through every layer of this chain.",
        mapped: true,
        downstream: [],
        upstream: ["germanium", "gecl4", "fiber-cable"],
      },
      {
        id: "broadband",
        name: "Broadband / telecom",
        description: "Terrestrial fiber networks connecting cities, homes, and enterprises. Global buildout ongoing, accelerated by government subsidy programs.",
        players: "AT&T, Verizon, Deutsche Telekom, NTT, BT",
        insight: "Competing with AI datacenters for the same constrained fiber supply.",
        mapped: false,
        downstream: [],
        upstream: ["germanium", "gecl4", "fiber-cable"],
      },
      {
        id: "subsea",
        name: "Subsea networks",
        description: "Undersea cable systems connecting continents. Each system spans 2,000\u201350,000 km with 8\u201324 fiber pairs requiring higher germanium loading per km.",
        players: "SubCom, Alcatel Submarine Networks, NEC, Google, Meta",
        insight: "New routes announced by Google and Meta are adding incremental germanium demand that wasn\u2019t in pre-2023 forecasts.",
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
      position: "absolute", inset: 0, paddingTop: 50,
      display: "flex", flexDirection: "column", justifyContent: "center",
      overflow: "auto",
    }}>
      <div style={{ padding: "0 36px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
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
