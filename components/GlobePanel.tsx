"use client";
import React, { useState } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };

const STATUS_COLOR: Record<string, string> = {
  "Constrained": "#a05a4a",
  "Tightening": "#9a8540",
  "Available": "#4a8a55",
  "Oversupplied": "#5a7a8a",
};

const LAYERS = [
  { name: "Raw materials", count: 42 },
  { name: "Components", count: 38 },
  { name: "Subsystems", count: 24 },
  { name: "End use", count: 15 },
];

const LAYER_CONTENT: Record<string, { name: string; nodes: number; status: string }[]> = {
  "Raw materials": [
    { name: "Germanium", nodes: 7, status: "Constrained" },
    { name: "Gallium", nodes: 5, status: "Constrained" },
    { name: "Copper", nodes: 12, status: "Tightening" },
    { name: "Silicon", nodes: 8, status: "Available" },
    { name: "Helium", nodes: 4, status: "Constrained" },
    { name: "Lithium", nodes: 9, status: "Oversupplied" },
    { name: "Rare earths", nodes: 6, status: "Tightening" },
    { name: "Cobalt", nodes: 7, status: "Tightening" },
    { name: "GOES steel", nodes: 4, status: "Constrained" },
    { name: "Neon", nodes: 3, status: "Constrained" },
  ],
  "Components": [
    { name: "Fiber optic cable", nodes: 8, status: "Constrained" },
    { name: "Optical transceivers", nodes: 6, status: "Constrained" },
    { name: "Network switches", nodes: 5, status: "Available" },
    { name: "GPUs / AI accelerators", nodes: 4, status: "Constrained" },
    { name: "HBM memory", nodes: 3, status: "Constrained" },
    { name: "Servers / racks", nodes: 5, status: "Tightening" },
    { name: "Power transformers", nodes: 4, status: "Constrained" },
  ],
  "Subsystems": [
    { name: "Connectivity", nodes: 6, status: "Constrained" },
    { name: "Compute", nodes: 5, status: "Constrained" },
    { name: "Power", nodes: 5, status: "Constrained" },
    { name: "Cooling", nodes: 4, status: "Tightening" },
    { name: "Physical structure", nodes: 4, status: "Available" },
  ],
  "End use": [
    { name: "AI datacenters", nodes: 6, status: "Constrained" },
    { name: "Terrestrial telecom", nodes: 4, status: "Tightening" },
    { name: "Subsea networks", nodes: 3, status: "Tightening" },
    { name: "Defense / UAV", nodes: 2, status: "Constrained" },
  ],
};

const VERTICALS = [
  { name: "AI Infrastructure", count: 17, color: "#c9a84c" },
  { name: "Robotics", count: 4, color: "#6a9ab8" },
  { name: "Energy transition", count: 6, color: "#4a8a55" },
  { name: "UAVs", count: 3, color: "#9a8540" },
  { name: "Space", count: 2, color: "#a05a4a" },
];

export default function GlobePanel() {
  const [activeLayer, setActiveLayer] = useState("Raw materials");
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const items = LAYER_CONTENT[activeLayer] || [];

  return (
    <div style={{
      width: 260, height: "100%",
      background: "#161514", borderRight: "1px solid #252220",
      padding: "20px 16px", overflowY: "auto", flexShrink: 0,
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)" }}>Stillpoint</span>
        <span style={{ display: "inline-block", width: 5 }} />
        <span style={{ fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.22)" }}>Intelligence</span>
      </div>

      {/* Section 1: Layers */}
      <p style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#4a4540", margin: "0 0 10px 0" }}>LAYERS</p>
      {LAYERS.map((layer) => (
        <div
          key={layer.name}
          onClick={() => { setActiveLayer(layer.name); setActiveItem(null); }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 8px", borderRadius: 5, cursor: "pointer",
            background: activeLayer === layer.name ? "#1e1c18" : "transparent",
            transition: "background 0.15s",
          }}
        >
          <span style={{ fontSize: 12, color: activeLayer === layer.name ? "#ece8e1" : "#a09888" }}>{layer.name}</span>
          <span style={{ fontSize: 10, color: "#4a4540" }}>{layer.count}</span>
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: 1, background: "#252220", margin: "16px 0" }} />

      {/* Section 2: Dynamic content */}
      <p style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#4a4540", margin: "0 0 10px 0" }}>{activeLayer.toUpperCase()}</p>
      <div style={{ flex: 1 }}>
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveItem(activeItem === item.name ? null : item.name)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "6px 8px 6px 12px", borderRadius: 5, cursor: "pointer",
              background: activeItem === item.name ? "#1e1c18" : "transparent",
              transition: "background 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[item.status] || "#4a4540" }} />
              <span style={{ fontSize: 11.5, color: activeItem === item.name ? "#ece8e1" : "#a09888" }}>{item.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "#4a4540" }}>{item.nodes}</span>
              <span style={{ ...MONO, fontSize: 9, fontWeight: 500, color: STATUS_COLOR[item.status] || "#4a4540" }}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#252220", margin: "16px 0" }} />

      {/* Section 3: Verticals */}
      <p style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#4a4540", margin: "0 0 10px 0" }}>VERTICALS</p>
      {VERTICALS.map((v) => (
        <div
          key={v.name}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "7px 8px", borderRadius: 5, cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1e1c18"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: v.color, marginRight: 8 }} />
            <span style={{ fontSize: 11.5, color: "#a09888" }}>{v.name}</span>
          </div>
          <span style={{ fontSize: 10, color: "#4a4540" }}>{v.count} chains</span>
        </div>
      ))}
    </div>
  );
}
