"use client";
import React, { useState } from "react";

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const dimText = "rgb(160, 152, 136)";
const borderColor = "rgba(255,255,255,0.06)";
const cardBg = "rgb(30, 30, 30)";
const accent = "#c87a4a";
const groupBg = "rgb(42, 38, 34)";

type CompanyNode = {
  name: string;
  role: string;
  active?: boolean;
  clickable?: boolean;
};

type BusinessGroup = {
  name: string;
  active: boolean;
  outputs: string[];
};

const BUSINESS_GROUPS: BusinessGroup[] = [
  { name: "Specialty Metals", active: true, outputs: ["GeCl₄", "Germanium Products", "Cobalt Compounds", "Nickel Compounds", "Zinc Chemicals"] },
  { name: "Battery Materials", active: false, outputs: [] },
  { name: "Catalysis", active: false, outputs: [] },
  { name: "Recycling", active: false, outputs: [] },
];

const ALL_OUTPUTS: { name: string; role: string; group: string }[] = [
  { name: "GeCl₄", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Germanium Products", role: "Refined Material", group: "Specialty Metals" },
  { name: "Cobalt Compounds", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Nickel Compounds", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Zinc Chemicals", role: "Chemical Intermediate", group: "Specialty Metals" },
  { name: "Electroplating Chemistry", role: "Process Chemistry", group: "Specialty Metals" },
  { name: "Copper Plating Chemistry", role: "Process Chemistry", group: "Specialty Metals" },
  { name: "PVD Materials", role: "Deposition Material", group: "Specialty Metals" },
];

const OUTPUT_TO_DOWNSTREAM: Record<string, string[]> = {
  "GeCl₄": ["Fiber Optic Cable", "IR Optics"],
  "Germanium Products": ["IR Optics", "Solar Cells", "Semiconductor Materials"],
  "Cobalt Compounds": ["Battery Cells", "Pigments / Ceramics"],
  "Nickel Compounds": ["Battery Cells", "Rubber Products"],
  "Zinc Chemicals": ["Rubber Products", "Pigments / Ceramics"],
  "Electroplating Chemistry": ["Electronics Plating"],
  "Copper Plating Chemistry": ["Semiconductor Packaging"],
  "PVD Materials": ["Optical Thin Films"],
};

const ALL_DOWNSTREAM: { name: string; role: string }[] = [
  { name: "Fiber Optic Cable", role: "Component" },
  { name: "IR Optics", role: "Component" },
  { name: "Solar Cells", role: "Component" },
  { name: "Semiconductor Materials", role: "Intermediate" },
  { name: "Battery Cells", role: "Component" },
  { name: "Pigments / Ceramics", role: "End Product" },
  { name: "Rubber Products", role: "End Product" },
  { name: "Electronics Plating", role: "Process" },
  { name: "Optical Thin Films", role: "Component" },
  { name: "Semiconductor Packaging", role: "Process" },
];

const UPSTREAM: CompanyNode[] = [
  { name: "STL / Gécamines", role: "Deposit Operator", clickable: true },
  { name: "Teck Resources", role: "Zinc Smelter", clickable: true },
  { name: "Yunnan Chihong", role: "Primary Producer", clickable: true },
];

const ALL_INPUTS: { name: string; role: string }[] = [
  { name: "Germanium", role: "Raw Material" },
  { name: "Cobalt", role: "Raw Material" },
  { name: "Nickel", role: "Raw Material" },
  { name: "Zinc", role: "Raw Material" },
  { name: "Precious Metals", role: "Raw Material" },
  { name: "Copper / Deposition Feedstocks", role: "Raw Material" },
];

const OVERVIEW_TEXT = [
  "In the GeCl₄ chain, Umicore matters less as a diversified materials company and more as a specialized conversion node. Its Electro-Optic Materials business connects germanium-bearing feedstock and recycled streams to ultra-pure GeCl₄, which then feeds fiber preform production and ultimately optical fiber for AI data center connectivity.",
  "The key question is whether GeCl₄ capacity can scale with AI-driven fiber demand. Fiber manufacturers can add equipment and draw capacity, but GeCl₄ depends on constrained germanium feedstock and specialized refining capability. That places Umicore near a critical Western chokepoint in the germanium-to-fiber chain.",
];

const RELATED_SIGNALS = [
  "The GeCl₄ Chokepoint",
  "Germanium Feedstock Constraint",
  "Western Redundancy Gap",
];

function TreeNode({ name, role, highlighted, dimmed, clickable, onClick }: {
  name: string; role: string; highlighted?: boolean; dimmed?: boolean; clickable?: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      style={{
        padding: "5px 8px",
        background: highlighted ? groupBg : cardBg,
        border: highlighted ? `1px solid ${accent}40` : `1px solid rgb(45, 41, 39)`,
        borderRadius: 4,
        width: "100%",
        boxSizing: "border-box",
        cursor: clickable ? "pointer" : "default",
        transition: "border-color 0.15s, opacity 0.15s",
        opacity: dimmed ? 0.35 : 1,
      }}
      onMouseEnter={e => { if (clickable) e.currentTarget.style.borderColor = "rgb(60, 56, 52)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = highlighted ? `${accent}40` : "rgb(45, 41, 39)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 10, fontWeight: 500, color: highlighted ? warmWhite : dimText, margin: 0, lineHeight: 1.2, fontFamily: SERIF }}>{name}</p>
        {clickable && <span style={{ fontSize: 8, color: "#555" }}>→</span>}
      </div>
      <p style={{ fontSize: 7, color: "#555", margin: "1px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase" }}>{role}</p>
    </div>
  );
}

export default function CompanyViewPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedGroup, setSelectedGroup] = useState<string>("Specialty Metals");

  if (!isOpen) return null;

  const activeGroup = BUSINESS_GROUPS.find(g => g.name === selectedGroup);
  const visibleOutputs = activeGroup?.active
    ? ALL_OUTPUTS.filter(o => o.group === selectedGroup)
    : [];

  // Collect downstream names from visible outputs
  const visibleDownstreamNames = new Set<string>();
  visibleOutputs.forEach(o => {
    (OUTPUT_TO_DOWNSTREAM[o.name] ?? []).forEach(d => visibleDownstreamNames.add(d));
  });
  const visibleDownstream = ALL_DOWNSTREAM.filter(d => visibleDownstreamNames.has(d.name));

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "92%",
          maxWidth: 1100,
          maxHeight: "88vh",
          background: "#141414",
          border: "1px solid rgb(42, 42, 42)",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "fadeSlideDown 0.3s ease-out",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4, zIndex: 10, transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = warmWhite; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#555"; }}
        >
          &times;
        </button>

        {/* Header */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <p style={{ fontSize: 7, color: "#555", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Company Node</p>
          <h2 style={{ fontSize: 22, fontWeight: 400, color: warmWhite, margin: "0 0 6px 0", fontFamily: SERIF }}>Umicore</h2>
          <p style={{ fontSize: 12, color: dimText, lineHeight: 1.5, margin: "0 0 16px 0", maxWidth: 700 }}>
            Specialty materials and refining company connecting germanium-bearing feedstock to fiber-grade GeCl&#x2084; and downstream optical fiber chains.
          </p>
          <div style={{ height: 1, background: borderColor }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>

          {/* Supply Tree */}
          <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: MONO }}>Supply Chain Position</p>

          <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8 }}>

            {/* Upstream */}
            <div style={{ flex: "0 0 auto", width: 155, display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Upstream</p>
              {UPSTREAM.map(n => <TreeNode key={n.name} name={n.name} role={n.role} clickable={n.clickable} />)}
            </div>

            <Arrow />

            {/* Inputs */}
            <div style={{ flex: "0 0 auto", width: 155, display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Input</p>
              {ALL_INPUTS.map(n => <TreeNode key={n.name} name={n.name} role={n.role} clickable />)}
            </div>

            <Arrow />

            {/* Company — business groups */}
            <div style={{ flex: "0 0 auto", width: 165, display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Company</p>
              <div style={{ padding: "6px 8px", background: groupBg, border: `1px solid ${accent}40`, borderRadius: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: warmWhite, margin: "0 0 4px 0", fontFamily: SERIF }}>Umicore</p>
                <p style={{ fontSize: 7, color: "#555", margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase" }}>Business Segments</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {BUSINESS_GROUPS.map(g => (
                    <div
                      key={g.name}
                      onClick={() => { if (g.active) setSelectedGroup(g.name); }}
                      style={{
                        padding: "3px 6px",
                        borderRadius: 3,
                        background: selectedGroup === g.name ? "rgba(200,122,74,0.12)" : "rgba(255,255,255,0.02)",
                        border: selectedGroup === g.name ? `1px solid ${accent}30` : "1px solid transparent",
                        cursor: g.active ? "pointer" : "default",
                        opacity: g.active ? 1 : 0.35,
                        transition: "background 0.15s",
                      }}
                    >
                      <p style={{ fontSize: 9, color: selectedGroup === g.name ? accent : dimText, margin: 0, fontWeight: selectedGroup === g.name ? 500 : 400 }}>{g.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Arrow />

            {/* Outputs */}
            <div style={{ flex: "0 0 auto", width: 160, display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Output</p>
              {visibleOutputs.length > 0 ? visibleOutputs.map(o => (
                <TreeNode key={o.name} name={o.name} role={o.role} highlighted={o.name === "GeCl₄"} clickable />
              )) : (
                <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>Select a business segment</p>
              )}
            </div>

            <Arrow />

            {/* Downstream */}
            <div style={{ flex: "0 0 auto", width: 160, display: "flex", flexDirection: "column", gap: 5 }}>
              <p style={{ fontSize: 7, color: "#555", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>Downstream</p>
              {visibleDownstream.length > 0 ? visibleDownstream.map(d => (
                <TreeNode key={d.name} name={d.name} role={d.role} clickable />
              )) : (
                <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>—</p>
              )}
            </div>
          </div>

          <div style={{ height: 1, background: borderColor, margin: "16px 0" }} />

          {/* Stillpoint View */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <img src="/stillpoint-icon.png" alt="" style={{ width: 14, height: 14, borderRadius: 2, opacity: 0.85 }} />
            <p style={{ fontSize: 12, color: "rgb(219, 219, 218)", fontWeight: 500, margin: 0 }}>Stillpoint View</p>
          </div>
          {OVERVIEW_TEXT.map((para, i) => (
            <p key={i} style={{ fontSize: 12, color: dimText, lineHeight: 1.6, margin: i === 0 ? "0 0 8px 0" : "0", maxWidth: 800 }}>{para}</p>
          ))}

          <div style={{ height: 1, background: borderColor, margin: "16px 0" }} />

          {/* Related Signals */}
          <p style={{ fontSize: 9, color: "rgb(219, 219, 218)", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: MONO, fontWeight: 500 }}>Related Signals</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {RELATED_SIGNALS.map(sig => (
              <div key={sig} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#555", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: dimText }}>{sig}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 3px", flexShrink: 0, marginTop: 16 }}>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
        <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M7 1L11 4L7 7" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
