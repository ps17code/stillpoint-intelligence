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
    <div style={{ background: "rgb(26, 27, 26)", borderRadius: 5, overflow: "hidden", padding: "14px 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", gap: 14 }}>
        {/* Column 1: How much fiber do AI data centers need */}
        <div>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 400, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>How much fiber do AI data centers need</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, marginBottom: 14 }}>
            {[
              { value: "20 GW", sub: "new 2027 AI DC capacity" },
              { value: "9M KM", sub: "fiber per 1 GW" },
              { value: "120M KM", sub: "for 20 GW" },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: "8px 10px", borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                <p style={{ fontSize: 13, color: warmWhite, fontWeight: 600, margin: "0 0 2px 0", fontFamily: mono }}>{s.value}</p>
                <p style={{ fontSize: 6, color: dimmer, margin: 0, fontFamily: mono, letterSpacing: "0.02em" }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 400, margin: "0 0 8px 0", fontFamily: "'Instrument Serif', serif" }}>Supply table</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Layer", "2027 demand", "Current supply", "Gap"].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 3 ? "right" : "left", padding: "0 4px 6px 0", fontSize: 6, letterSpacing: "0.06em", color: dimmer, fontWeight: 500, fontFamily: mono, textTransform: "uppercase", borderBottom: `1px solid ${border}` }}>{h}</th>
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
                  <td style={{ padding: "7px 4px 7px 0", fontSize: 9, color: warmWhite, fontWeight: 500, borderBottom: `1px solid ${border}` }}>{row.layer}</td>
                  <td style={{ padding: "7px 4px 7px 0", fontSize: 9, color: numColor, fontFamily: mono, borderBottom: `1px solid ${border}` }}>{row.demand}</td>
                  <td style={{ padding: "7px 4px 7px 0", fontSize: 9, color: numColor, fontFamily: mono, borderBottom: `1px solid ${border}` }}>{row.supply}</td>
                  <td style={{ padding: "7px 0 7px 4px", fontSize: 9, color: amber, fontFamily: mono, fontWeight: 500, textAlign: "right", borderBottom: `1px solid ${border}` }}>{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 7, color: dimmer, margin: "6px 0 0 0", lineHeight: 1.3 }}>Note: Estimates reflect global supply–demand balance for commercial fiber.</p>
        </div>

        {/* Column 2: Can each layer scale? */}
        <div>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 400, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>Can each layer scale?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: 0 }}>{row.layer}</p>
                    {row.tag && (
                      <span style={{ fontSize: 6, letterSpacing: "0.06em", textTransform: "uppercase", color: amber, background: amberBg, border: "0.5px solid rgba(200,122,74,0.3)", padding: "1px 5px", borderRadius: 2, fontFamily: mono }}>{row.tag}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 9, color: numColor, lineHeight: 1.5, margin: 0 }}>{row.desc}</p>
                </div>
                <div style={{ borderLeft: `1px solid ${border}`, padding: "8px 12px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, minWidth: 140 }}>
                  {[
                    { label: "Expandability", value: row.expandability, color: row.expandColor },
                    { label: "Time", value: row.time, color: row.timeColor },
                    { label: "Concentration", value: row.concentration, color: row.concColor },
                  ].map(m => (
                    <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 8, color: dimmer }}>{m.label}</span>
                      <span style={{ fontSize: 9, color: m.color, fontFamily: mono, fontWeight: 500 }}>{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Key Takeaway */}
        <div>
          <p style={{ fontSize: 11, color: warmWhite, fontWeight: 400, margin: "0 0 10px 0", fontFamily: "'Instrument Serif', serif" }}>Key Takeaway</p>

          <div style={{ background: "rgb(30, 30, 30)", border: `1px solid ${border}`, borderRadius: 4, padding: "10px 12px", marginBottom: 8 }}>
            <p style={{ fontSize: 7, letterSpacing: "0.1em", color: amber, textTransform: "uppercase", margin: "0 0 3px 0", fontFamily: mono }}>Primary Chokepoint</p>
            <p style={{ fontSize: 16, color: warmWhite, fontWeight: 400, margin: "0 0 8px 0", fontFamily: "'Instrument Serif', serif" }}>GeCl₄</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

          <div style={{ background: amberBg, border: "0.5px solid rgba(200, 122, 74, 0.2)", borderRadius: 4, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 7, letterSpacing: "0.08em", color: amber, textTransform: "uppercase", margin: 0, fontFamily: mono, flexShrink: 0 }}>Key Player</p>
            <p style={{ fontSize: 12, color: warmWhite, fontWeight: 500, margin: 0 }}>Umicore</p>
            <p style={{ fontSize: 8, color: numColor, margin: 0 }}>Sole Western GeCl₄ refiner at scale</p>
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
