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
const serif = "'EB Garamond', Georgia, serif";

const TABS = [
  "Constraint Summary", "Demand Propagation", "Supply Elasticity",
  "Concentration", "Expansion Status", "Substitution", "Key Companies",
] as const;
type TabId = typeof TABS[number];

export default function ChainAnalysis() {
  const [activeTab, setActiveTab] = useState<TabId>("Constraint Summary");

  return (
    <div style={{ background: "rgb(26, 27, 26)", borderRadius: 5, overflow: "hidden" }}>
      {/* Header + Tabs */}
      <div style={{ padding: "15px 20px 0" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, fontWeight: 400, color: warmWhite, margin: "0 0 10px 0" }}>Chain Analysis</h2>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${border}` }}>
          {TABS.map((tab, ti) => {
            const isActive = activeTab === tab;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: ti === 0 ? "8px 14px 8px 0" : "8px 14px",
                  fontSize: 9,
                  color: isActive ? warmWhite : tabInactive,
                  cursor: "pointer",
                  borderBottom: isActive ? `1.5px solid ${warmWhite}` : "1.5px solid transparent",
                  transition: "color 0.15s, border-color 0.15s",
                  marginBottom: -1,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = muted; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = tabInactive; }}
              >
                {tab}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {activeTab === "Constraint Summary" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr 1.2fr", gap: 16 }}>
            {/* Column 1: Demand Assumption */}
            <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 5, padding: 16, display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 7, letterSpacing: "0.1em", color: dimmer, textTransform: "uppercase", margin: "0 0 14px 0", fontFamily: mono }}>Demand Assumption</p>
              <p style={{ fontSize: 12, color: warmWhite, fontWeight: 400, margin: "0 0 8px 0" }}>New AI Data Center Capacity by 2027</p>
              <p style={{ fontSize: 28, color: amber, fontWeight: 500, margin: "0 0 10px 0", fontFamily: mono, lineHeight: 1 }}>+20 GW</p>
              <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: "0 0 20px 0" }}>Incremental AI buildout. Other end markets assumed stable.</p>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Fiber required", value: "12–15B km" },
                  { label: "GeCl₄ required", value: "900–1,100 t" },
                  { label: "Germanium required", value: "450–500 t" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderTop: `1px solid ${border}` }}>
                    <span style={{ fontSize: 10, color: numColor }}>{row.label}</span>
                    <span style={{ fontSize: 10, color: warmWhite, fontFamily: mono, fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Capacity Test */}
            <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 5, padding: 16 }}>
              <p style={{ fontSize: 7, letterSpacing: "0.1em", color: dimmer, textTransform: "uppercase", margin: "0 0 14px 0", fontFamily: mono }}>Capacity Test</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Layer", "Available", "Gap", "Expandability", "Scale Time", "Concentration"].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? "left" : "left", padding: "0 8px 10px 0", fontSize: 7, letterSpacing: "0.08em", color: dimmer, fontWeight: 500, fontFamily: mono, textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { layer: "Fiber", available: "7–8B km", gap: "4–7B km", expandability: "Medium", scaleTime: "1–3 yrs", concentration: "Moderate" },
                    { layer: "GeCl₄", available: "~500 t", gap: "400–600 t", expandability: "Very Low", scaleTime: "3–5 yrs", concentration: "Extreme" },
                    { layer: "Germanium", available: "~230 t", gap: "220–270 t", expandability: "Very Low", scaleTime: "5–10 yrs", concentration: "High" },
                  ].map((row, i) => {
                    const isAmber = row.expandability === "Very Low";
                    return (
                      <tr key={i}>
                        <td style={{ padding: "14px 8px 14px 0", fontSize: 11, color: warmWhite, fontWeight: 500, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.layer}</td>
                        <td style={{ padding: "14px 8px 14px 0", fontSize: 10, color: numColor, fontFamily: mono, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.available}</td>
                        <td style={{ padding: "14px 8px 14px 0", fontSize: 10, color: amber, fontFamily: mono, fontWeight: 500, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.gap}</td>
                        <td style={{ padding: "14px 8px 14px 0", fontSize: 10, color: isAmber ? amber : numColor, fontFamily: mono, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.expandability}</td>
                        <td style={{ padding: "14px 8px 14px 0", fontSize: 10, color: numColor, fontFamily: mono, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.scaleTime}</td>
                        <td style={{ padding: "14px 0 14px 0", fontSize: 10, color: isAmber ? amber : numColor, fontFamily: mono, borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>{row.concentration}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Column 3: Chain Conclusion */}
            <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 5, padding: 16, display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 7, letterSpacing: "0.1em", color: dimmer, textTransform: "uppercase", margin: "0 0 14px 0", fontFamily: mono }}>Chain Conclusion</p>

              <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0" }}>Primary Chokepoint</p>
              <p style={{ fontSize: 16, color: amber, fontWeight: 500, margin: "0 0 12px 0", fontFamily: "'Instrument Serif', serif" }}>GeCl₄ Refining</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                {[
                  "Few qualified producers",
                  "High-purity process with limited Western capacity",
                  "Depends on constrained germanium feedstock",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: amber, flexShrink: 0, marginTop: 5 }} />
                    <p style={{ fontSize: 10, color: numColor, lineHeight: 1.4, margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0" }}>Secondary Constraint</p>
              <p style={{ fontSize: 13, color: warmWhite, fontWeight: 500, margin: "0 0 14px 0" }}>Germanium supply</p>

              <div style={{ marginTop: "auto", background: amberBg, border: "0.5px solid rgba(200, 122, 74, 0.2)", borderRadius: 4, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, color: amber, lineHeight: 1, fontFamily: "Georgia, serif", flexShrink: 0 }}>&ldquo;</span>
                <p style={{ fontSize: 10, color: numColor, lineHeight: 1.5, margin: 0 }}>
                  Fiber can scale with capital. Germanium and GeCl₄ scale with geology, refining capacity, and time.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "Constraint Summary" && (
          <div style={{ padding: "40px 0", color: dimmer, fontSize: 11 }}>
            {activeTab} — coming soon
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
