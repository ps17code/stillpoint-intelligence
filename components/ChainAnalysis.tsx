"use client";
import React from "react";

const amber = "#c87a4a";
const amberBg = "rgba(200, 122, 74, 0.06)";
const warmWhite = "#ece8e1";
const dimmer = "#4a4540";
const numColor = "rgb(160, 152, 136)";
const border = "rgba(255,255,255,0.04)";
const mono = "'Geist Mono', monospace";

export default function ChainAnalysis() {
  return (
    <div style={{ border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", padding: "14px 16px" }}>
      <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 12px 0" }}>Chain Summary</p>
      <div style={{ display: "grid", gridTemplateColumns: "0.7fr 2fr 0.9fr", gap: 14 }}>

        {/* Column 1: What's the Demand */}
        <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: "0 0 12px 0", fontFamily: "'Instrument Serif', serif" }}>What&apos;s the Demand</p>

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0" }}>1 GW AI Data Center</p>
          <p style={{ fontSize: 14, color: amber, fontWeight: 600, margin: "0 0 10px 0", fontFamily: mono }}>9M KM FIBER</p>

          <div style={{ height: 1, background: border, margin: "0 0 10px 0" }} />

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 2px 0" }}>20 GW Annual Demand</p>
          <p style={{ fontSize: 14, color: warmWhite, fontWeight: 600, margin: "0 0 10px 0", fontFamily: mono }}>120M KM FIBER</p>

          <div style={{ height: 1, background: border, margin: "0 0 10px 0" }} />

          <p style={{ fontSize: 9, color: numColor, margin: "0 0 6px 0" }}>Upstream Requirements</p>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 600, margin: "0 0 2px 0", fontFamily: mono }}>50T GeCl₄</p>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 600, margin: 0, fontFamily: mono }}>50T Germanium</p>
        </div>

        {/* Column 2: Can Supply Respond */}
        <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px" }}>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>Can Supply Respond</p>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Layers", "Supply / Gap", "Constraints", "Summary"].map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "0 8px 8px 0", fontSize: 7, letterSpacing: "0.06em", color: dimmer, fontWeight: 500, fontFamily: mono, textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                  tag: "PRIMARY CHOKEPOINT",
                },
                {
                  layer: "Germanium", supply: "220 t/yr", gap: "230 t",
                  constraints: "Mostly byproduct supply; recovery expands slowly through major capex and multi-year project timelines.",
                  expandability: "Low", expandColor: numColor,
                  time: "3–7 yrs", timeColor: numColor,
                  concentration: "High", concColor: numColor,
                },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 2 ? `1px solid ${border}` : "none" }}>
                  <td style={{ padding: "10px 8px 10px 0", fontSize: 11, color: warmWhite, fontWeight: 500, verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {row.layer}
                      {(row as { tag?: string }).tag && (
                        <span style={{ fontSize: 5, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: amber, background: amberBg, border: "0.5px solid rgba(200,122,74,0.3)", padding: "1px 4px", borderRadius: 2, fontFamily: mono }}>{(row as { tag?: string }).tag}</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px 10px 0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    <p style={{ fontSize: 9, color: numColor, margin: "0 0 1px 0", fontFamily: mono }}>Supply: {row.supply}</p>
                    <p style={{ fontSize: 9, color: amber, margin: 0, fontFamily: mono, fontWeight: 500 }}>Gap: {row.gap}</p>
                  </td>
                  <td style={{ padding: "10px 8px 10px 0", verticalAlign: "top" }}>
                    <p style={{ fontSize: 9, color: numColor, lineHeight: 1.5, margin: 0 }}>{row.constraints}</p>
                  </td>
                  <td style={{ padding: "10px 0 10px 0", verticalAlign: "top", minWidth: 120 }}>
                    {[
                      { label: "Expandability", value: row.expandability, color: row.expandColor },
                      { label: "Time", value: row.time, color: row.timeColor },
                      { label: "Concentration", value: row.concentration, color: row.concColor },
                    ].map(m => (
                      <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
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

        {/* Column 3: Where's the Chokepoint */}
        <div>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 500, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>Where&apos;s the Chokepoint</p>

          <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px", marginBottom: 8 }}>
            <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 3px 0", fontFamily: mono }}>Primary Chokepoint</p>
            <p style={{ fontSize: 20, color: warmWhite, fontWeight: 400, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>GeCl₄</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Every fiber expansion path still requires GeCl₄",
                "Trusted Western supply is highly concentrated",
                "Capacity expands slower than AI demand",
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 5, alignItems: "baseline" }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: amber, flexShrink: 0, marginTop: 4 }} />
                  <p style={{ fontSize: 9, color: numColor, lineHeight: 1.4, margin: 0 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: amberBg, border: "0.5px solid rgba(200, 122, 74, 0.2)", borderRadius: 4, padding: "8px 10px" }}>
            <p style={{ fontSize: 7, letterSpacing: "0.08em", color: amber, textTransform: "uppercase", margin: "0 0 6px 0", fontFamily: mono }}>Key Players</p>
            {[
              { name: "Umicore", flag: "be", desc: "Only Western refiner producing fiber-grade GeCl₄ at commercial scale" },
            ].map((p, i) => (
              <div key={i} style={{ padding: i > 0 ? "6px 0 0 0" : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={`https://flagcdn.com/16x12/${p.flag}.png`} alt="" style={{ width: 12, height: 9, borderRadius: 1, opacity: 0.7, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: warmWhite, fontWeight: 500 }}>{p.name}</span>
                </div>
                <p style={{ fontSize: 8, color: numColor, lineHeight: 1.4, margin: "3px 0 0 18px" }}>{p.desc}</p>
              </div>
            ))}
          </div>
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
