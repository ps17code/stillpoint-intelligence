"use client";
import React, { useState } from "react";

const amber = "#c87a4a";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const muted = "#706a60";
const dimmer = "#4a4540";
const numColor = "rgb(160, 152, 136)";
const border = "rgba(255,255,255,0.04)";
const tabInactive = "#555";
const mono = "'Geist Mono', monospace";

export default function ChainAnalysis() {
  const [activeTab, setActiveTab] = useState<"supply-demand" | "key-players">("supply-demand");

  return (
    <div style={{ background: "rgb(26, 27, 26)", borderRadius: 5, overflow: "hidden" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}`, padding: "0 20px" }}>
        {([
          { id: "supply-demand" as const, label: "Supply Demand Analysis" },
          { id: "key-players" as const, label: "Key Players" },
        ]).map((tab, ti) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: ti === 0 ? "10px 14px 10px 0" : "10px 14px",
                fontSize: 9,
                color: isActive ? warmWhite : tabInactive,
                cursor: "pointer",
                borderBottom: isActive ? `1.5px solid ${warmWhite}` : "1.5px solid transparent",
                transition: "color 0.15s, border-color 0.15s",
                marginBottom: -1,
                letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = muted; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = tabInactive; }}
            >
              {tab.label}
            </div>
          );
        })}
      </div>

      <div style={{ padding: 20 }}>
        {activeTab === "supply-demand" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: 16 }}>
            {/* Column 1: How much fiber do AI data centers need */}
            <div>
              <p style={{ fontSize: 12, color: warmWhite, fontWeight: 400, margin: "0 0 14px 0", fontFamily: "'Instrument Serif', serif" }}>How much fiber do AI data centers need</p>

              {/* Big stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, marginBottom: 20 }}>
                {[
                  { value: "20 GW", sub: "new 2027 AI DC capacity" },
                  { value: "9M KM", sub: "fiber per 1 GW" },
                  { value: "120M KM", sub: "for 20 GW" },
                ].map((s, i, arr) => (
                  <div key={i} style={{ padding: "10px 12px", borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                    <p style={{ fontSize: 14, color: warmWhite, fontWeight: 600, margin: "0 0 3px 0", fontFamily: mono }}>{s.value}</p>
                    <p style={{ fontSize: 7, color: dimmer, margin: 0, fontFamily: mono, letterSpacing: "0.02em" }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Supply table */}
              <p style={{ fontSize: 12, color: warmWhite, fontWeight: 400, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>Supply table</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Layer", "2027 demand", "Current supply", "Gap"].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? "left" : i === 3 ? "right" : "left", padding: "0 6px 8px 0", fontSize: 7, letterSpacing: "0.06em", color: dimmer, fontWeight: 500, fontFamily: mono, textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { layer: "Germanium", demand: "450–500 t/yr", supply: "220 t/yr", gap: "–230 t/yr" },
                    { layer: "GeCl₄", demand: "900–1,100 t/yr", supply: "500 t/yr", gap: "–500 t/yr" },
                    { layer: "Fiber", demand: "12–15B km/yr", supply: "7B km/yr", gap: "–6B km/yr" },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding: "10px 6px 10px 0", fontSize: 10, color: warmWhite, fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.layer}</td>
                      <td style={{ padding: "10px 6px 10px 0", fontSize: 10, color: numColor, fontFamily: mono, borderBottom: `1px solid ${border}` }}>{row.demand}</td>
                      <td style={{ padding: "10px 6px 10px 0", fontSize: 10, color: numColor, fontFamily: mono, borderBottom: `1px solid ${border}` }}>{row.supply}</td>
                      <td style={{ padding: "10px 0 10px 6px", fontSize: 10, color: amber, fontFamily: mono, fontWeight: 500, textAlign: "right", borderBottom: `1px solid ${border}` }}>{row.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: 8, color: dimmer, margin: "8px 0 0 0", lineHeight: 1.4 }}>Note: Estimates reflect global supply–demand balance for commercial fiber.</p>
            </div>

            {/* Column 2: Can each layer scale? */}
            <div>
              <p style={{ fontSize: 12, color: warmWhite, fontWeight: 400, margin: "0 0 14px 0", fontFamily: "'Instrument Serif', serif" }}>Can each layer scale?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    layer: "Germanium", tag: null,
                    desc: "Only 8 deposits globally where germanium concentration is high enough to extract as a byproduct. Increasing recovery requires major capex and multi-year project timelines.",
                    expandability: "Low", expandColor: numColor,
                    time: "3–7 yrs", timeColor: numColor,
                    concentration: "High", concColor: numColor,
                  },
                  {
                    layer: "GeCl₄", tag: "PRIMARY CHOKEPOINT",
                    desc: "Limited by germanium feedstock and fewer than 5 suppliers globally who can achieve the required ultra-purity. Only one Western supplier at commercial scale.",
                    expandability: "Very Low", expandColor: amber,
                    time: "2–5 yrs", timeColor: amber,
                    concentration: "Very High", concColor: amber,
                  },
                  {
                    layer: "Fiber Manufacturing", tag: null,
                    desc: "Capacity is tight but can expand with capex, equipment orders, and new production lines.",
                    expandability: "Medium", expandColor: numColor,
                    time: "12–24 mo", timeColor: numColor,
                    concentration: "Medium", concColor: numColor,
                  },
                ].map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 0, background: "rgb(30, 30, 30)", border: row.tag ? `1px solid rgba(200, 122, 74, 0.25)` : `1px solid ${border}`, borderRadius: 4, overflow: "hidden" }}>
                    {/* Left: description */}
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: 0 }}>{row.layer}</p>
                        {row.tag && (
                          <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: "0.5px solid rgba(200,122,74,0.3)", padding: "2px 6px", borderRadius: 2, fontFamily: mono }}>{row.tag}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: 0 }}>{row.desc}</p>
                    </div>
                    {/* Right: metrics sidebar */}
                    <div style={{ borderLeft: `1px solid ${border}`, padding: "10px 14px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 150 }}>
                      {[
                        { label: "Expandability", value: row.expandability, color: row.expandColor },
                        { label: "Time", value: row.time, color: row.timeColor },
                        { label: "Concentration", value: row.concentration, color: row.concColor },
                      ].map(m => (
                        <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                          <span style={{ fontSize: 9, color: dimmer }}>{m.label}</span>
                          <span style={{ fontSize: 10, color: m.color, fontFamily: mono, fontWeight: 500 }}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Key Takeaway */}
            <div>
              <p style={{ fontSize: 12, color: warmWhite, fontWeight: 400, margin: "0 0 14px 0", fontFamily: "'Instrument Serif', serif" }}>Key Takeaway</p>

              {/* Primary Chokepoint */}
              <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "12px 14px", marginBottom: 10 }}>
                <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 4px 0", fontFamily: mono }}>Primary Chokepoint</p>
                <p style={{ fontSize: 18, color: warmWhite, fontWeight: 400, margin: "0 0 6px 0", fontFamily: "'Instrument Serif', serif" }}>GeCl₄</p>
                <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: 0 }}>Key Western supplier: Umicore<br />capacity not publicly disclosed</p>
              </div>

              {/* Secondary Chokepoint */}
              <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "12px 14px", marginBottom: 10 }}>
                <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 4px 0", fontFamily: mono }}>Secondary Chokepoint</p>
                <p style={{ fontSize: 14, color: warmWhite, fontWeight: 400, margin: "0 0 6px 0", fontFamily: "'Instrument Serif', serif" }}>Germanium</p>
                <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: 0 }}>Key companies: Umicore · Gécamines / STL · Chinese refiners</p>
              </div>

              {/* Thesis */}
              <div style={{ background: amberBg, border: "0.5px solid rgba(200, 122, 74, 0.2)", borderRadius: 4, padding: "12px 14px" }}>
                <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 6px 0", fontFamily: mono }}>Thesis</p>
                <p style={{ fontSize: 10, color: numColor, lineHeight: 1.6, margin: 0 }}>
                  Supply will expand much slower than demand, turning GeCl₄ into the major chokepoint in the chain. Umicore is positioned as the only major Western supply source for the commercial fiber market.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "key-players" && (
          <div style={{ padding: "40px 0", color: dimmer, fontSize: 11 }}>
            Key Players — coming soon
          </div>
        )}
      </div>
    </div>
  );
}

export const CHAIN_TAKEAWAYS = [
  "The chokepoint is GeCl₄ refining, not germanium ore. Umicore's Belgian facility is the only commercial-scale Western supplier — a single point of failure between mineral supply and AI fiber demand.",
  "Capital cannot close the gap on AI's timeline. Recovery, refining, and preform manufacturing all have multi-year expansion cycles, and demand is growing faster than capacity can be added.",
  "China holds asymmetric escalation leverage. Controls 60%+ of both germanium and GeCl₄ supply and has weaponized that position through targeted export controls.",
];

export const CHAIN_KEY_PLAYERS = ["Umicore", "5N Plus", "Corning", "Yunnan Chihong"];
