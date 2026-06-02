"use client";
import React from "react";

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const dimText = "rgb(160, 152, 136)";
const borderColor = "rgba(255,255,255,0.06)";
const cardBg = "rgb(30, 30, 30)";
const accent = "#c87a4a";

type SupplyNode = {
  name: string;
  role: string;
  sub?: string;
  highlight?: boolean;
  clickable?: boolean;
  onClick?: () => void;
};

type SupplyLayer = {
  label: string;
  nodes: SupplyNode[];
};

const UMICORE_LAYERS: SupplyLayer[] = [
  {
    label: "UPSTREAM",
    nodes: [
      { name: "STL / Gécamines", role: "Deposit Operator", clickable: true },
      { name: "Teck Resources", role: "Zinc Smelter", clickable: true },
      { name: "Yunnan Chihong", role: "Primary Producer", clickable: true },
    ],
  },
  {
    label: "INPUT",
    nodes: [
      { name: "Germanium", role: "Raw Material", clickable: true },
      { name: "Recycled Ge", role: "Secondary Feedstock" },
    ],
  },
  {
    label: "COMPANY",
    nodes: [
      { name: "Umicore", role: "Refiner & Converter", sub: "Electro-Optic Materials", highlight: true },
    ],
  },
  {
    label: "OUTPUT",
    nodes: [
      { name: "GeCl₄", role: "Chemical Intermediate", highlight: true, clickable: true },
      { name: "Refined Ge", role: "Intermediate Material", clickable: true },
    ],
  },
  {
    label: "DOWNSTREAM",
    nodes: [
      { name: "Corning", role: "Fiber Manufacturer", clickable: true },
      { name: "Prysmian", role: "Fiber Manufacturer", clickable: true },
      { name: "YOFC", role: "Fiber Manufacturer", clickable: true },
    ],
  },
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

function NodeCard({ node }: { node: SupplyNode }) {
  const isClickable = node.clickable && !node.highlight;
  return (
    <div
      onClick={isClickable ? node.onClick : undefined}
      style={{
        padding: "6px 8px",
        background: node.highlight ? "rgb(42, 38, 34)" : cardBg,
        border: node.highlight ? `1px solid ${accent}40` : `1px solid rgb(45, 41, 39)`,
        borderRadius: 4,
        width: "100%",
        boxSizing: "border-box",
        cursor: isClickable ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => { if (isClickable) e.currentTarget.style.borderColor = "rgb(60, 56, 52)"; }}
      onMouseLeave={e => { if (isClickable) e.currentTarget.style.borderColor = node.highlight ? `${accent}40` : "rgb(45, 41, 39)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: node.highlight ? warmWhite : dimText, margin: 0, lineHeight: 1.2, fontFamily: SERIF }}>{node.name}</p>
        {isClickable && <span style={{ fontSize: 8, color: "#555" }}>→</span>}
      </div>
      <p style={{ fontSize: 7, color: "#555", margin: "2px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", textTransform: "uppercase" }}>{node.role}</p>
      {node.sub && (
        <p style={{ fontSize: 9, color: accent, margin: "3px 0 0 0", fontWeight: 500 }}>{node.sub}</p>
      )}
    </div>
  );
}

export default function CompanyViewPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "90%",
          maxWidth: 1000,
          maxHeight: "85vh",
          background: "#141414",
          border: "1px solid rgb(42, 42, 42)",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "fadeSlideDown 0.3s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "transparent",
            border: "none",
            color: "#555",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
            zIndex: 10,
            transition: "color 0.15s",
          }}
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

        {/* Content — scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>

          {/* Supply Tree */}
          <p style={{ fontSize: 10, color: warmWhite, margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: MONO }}>Supply Chain Position</p>

          <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
            {UMICORE_LAYERS.map((layer, li) => (
              <React.Fragment key={layer.label}>
                <div style={{ flex: "0 0 auto", width: 160, display: "flex", flexDirection: "column", gap: 6 }}>
                  <p style={{ fontSize: 7, color: "#555", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>{layer.label}</p>
                  {layer.nodes.map(node => (
                    <NodeCard key={node.name} node={node} />
                  ))}
                </div>
                {li < UMICORE_LAYERS.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 4px", flexShrink: 0, marginTop: 16 }}>
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                      <line x1="0" y1="4" x2="10" y2="4" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <path d="M9 1L13 4L9 7" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ height: 1, background: borderColor, margin: "16px 0" }} />

          {/* Stillpoint View */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <img src="/stillpoint-icon.png" alt="" style={{ width: 14, height: 14, borderRadius: 2, opacity: 0.85 }} />
            <p style={{ fontSize: 12, color: "rgb(219, 219, 218)", fontWeight: 500, margin: 0 }}>Stillpoint View</p>
          </div>
          {OVERVIEW_TEXT.map((para, i) => (
            <p key={i} style={{ fontSize: 12, color: dimText, lineHeight: 1.6, margin: i === 0 ? "0 0 8px 0" : "0 0 0 0", maxWidth: 800 }}>{para}</p>
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
