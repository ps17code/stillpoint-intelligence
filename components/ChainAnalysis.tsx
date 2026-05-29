"use client";
import React from "react";

const amber = "#c87a4a";
const warmWhite = "#ece8e1";
const dimmer = "#4a4540";
const numColor = "rgb(160, 152, 136)";
const border = "rgba(255,255,255,0.04)";
const mono = "'Geist Mono', monospace";
const cardBg = "rgb(30, 30, 30)";
const headerBg = "rgb(38, 38, 38)";
const titleStyle = { fontSize: 12, color: warmWhite, fontWeight: 500 as const, margin: "0 0 15px 0" as const, fontFamily: "'Instrument Serif', serif" };

export default function ChainAnalysis({ collapsed, onShowOpportunities, onExpand }: { collapsed?: boolean; onShowOpportunities?: () => void; onExpand?: () => void } = {}) {
  if (collapsed) {
    return (
      <div style={{ background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", padding: "14px 16px", transition: "all 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: mono }}>Chain Summary</p>
          <span
            onClick={onExpand}
            style={{ fontSize: 9, color: "#c87a4a", cursor: "pointer", transition: "color 0.15s", fontFamily: mono, display: "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => { e.currentTarget.style.color = "#e09060"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#c87a4a"; }}
          >
            Expand
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4L5 7L8 4" /></svg>
          </span>
        </div>
        <span style={{ fontSize: 11, color: numColor }}>Primary Chokepoint: <span style={{ color: amber, fontWeight: 500 }}>GeCl₄</span></span>
      </div>
    );
  }

  return (
    <div style={{ background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", padding: "14px 16px" }}>
      <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 14px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: mono }}>Chain Summary</p>

      <div style={{ display: "grid", gridTemplateColumns: "0.6fr 2fr 0.85fr", gap: 0 }}>

        {/* Card 1: What's the Demand */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 0, padding: "12px 14px", display: "flex", flexDirection: "column" }}>
          <p style={titleStyle}>What&apos;s the Demand</p>

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0", fontFamily: mono }}>1 GW AI Data Center</p>
          <p style={{ fontSize: 12, color: amber, fontWeight: 500, margin: "0 0 12px 0", fontFamily: mono }}>9M KM FIBER</p>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 12px 0" }} />

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0", fontFamily: mono }}>20 GW Annual Demand</p>
          <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 12px 0", fontFamily: mono }}>120M KM FIBER</p>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 12px 0" }} />

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 6px 0", fontFamily: mono }}>Upstream Requirements</p>
          <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: "0 0 3px 0", fontFamily: mono }}>50T GeCl₄</p>
          <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: 0, fontFamily: mono }}>50T Germanium</p>
        </div>

        {/* Card 2: Can Supply Respond */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 0, overflow: "hidden", display: "flex", flexDirection: "column", padding: 10 }}>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: headerBg }}>
                {["Layers", "Supply / Gap", "Constraints", "Summary"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "8px 10px", fontSize: 7, letterSpacing: "0.08em", color: "rgb(159, 146, 132)", fontWeight: 500, fontFamily: mono, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "rgba(23, 22, 22, 1)" }}>
              {[
                {
                  layer: "Fiber", supply: "7B km/yr", gap: "6B km",
                  constraints: "Capacity is tight, but expands through capex, equipment orders, and new production lines.",
                  expandability: "Medium", expandColor: numColor,
                  time: "12–24 mo", timeColor: numColor,
                  concentration: "Medium", concColor: numColor,
                },
                {
                  layer: "GeCl₄", supply: "500 t/yr", gap: "500 t",
                  constraints: "Qualified purification bottleneck; few suppliers can meet ultra-purity, with limited Western commercial capacity.",
                  expandability: "Very Low", expandColor: amber,
                  time: "2–5 yrs", timeColor: amber,
                  concentration: "Very High", concColor: amber,
                },
                {
                  layer: "Germanium", supply: "220 t/yr", gap: "230 t",
                  constraints: "Mostly byproduct supply; recovery expands slowly through major capex and multi-year project timelines.",
                  expandability: "Low", expandColor: numColor,
                  time: "3–7 yrs", timeColor: numColor,
                  concentration: "High", concColor: numColor,
                },
              ].map((row, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${border}` }}>
                  <td style={{ padding: "10px 10px", fontSize: 12, color: warmWhite, fontWeight: 500, verticalAlign: "middle", whiteSpace: "nowrap" }}>{row.layer}</td>
                  <td style={{ padding: "10px 10px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0", fontFamily: mono }}>Supply: {row.supply}</p>
                    <p style={{ fontSize: 9, color: amber, margin: 0, fontFamily: mono, fontWeight: 500 }}>Gap: {row.gap}</p>
                  </td>
                  <td style={{ padding: "10px 10px", verticalAlign: "middle" }}>
                    <p style={{ fontSize: 9, color: numColor, lineHeight: 1.5, margin: 0 }}>{row.constraints}</p>
                  </td>
                  <td style={{ padding: "10px 10px", verticalAlign: "middle", minWidth: 130 }}>
                    {[
                      { label: "Expandability", value: row.expandability, color: row.expandColor },
                      { label: "Time", value: row.time, color: row.timeColor },
                      { label: "Concentration", value: row.concentration, color: row.concColor },
                    ].map(m => (
                      <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 1 }}>
                        <span style={{ fontSize: 8, color: dimmer }}>{m.label}</span>
                        <span style={{ fontSize: 9, color: m.color, fontFamily: mono, fontWeight: 500 }}>{m.value}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 3: Where's the Chokepoint */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 0, padding: "12px 14px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 4px 0", fontFamily: mono }}>Primary Chokepoint</p>
          <p style={{ fontSize: 22, color: warmWhite, fontWeight: 400, margin: "0 0 12px 0", fontFamily: "'Instrument Serif', serif" }}>GeCl₄</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
            {[
              "Every fiber expansion path still requires GeCl₄",
              "Trusted Western supply is highly concentrated",
              "Capacity expands slower than AI demand",
            ].map((b, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: amber, flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: numColor, lineHeight: 1.4, margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onShowOpportunities}
            style={{
              width: "100%",
              fontSize: 11, fontFamily: mono,
              color: "#fff", background: "rgba(200, 122, 74, 0.2)",
              border: `1px solid ${amber}`, borderRadius: 4,
              padding: "8px 14px", cursor: "pointer",
              transition: "background 0.15s",
              fontWeight: 500,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(200, 122, 74, 0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(200, 122, 74, 0.2)"; }}
          >
            Show Chain Opportunities
          </button>
        </div>
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
