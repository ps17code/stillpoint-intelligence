"use client";
import React, { useState } from "react";

const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };

const STATUS_COLOR: Record<string, string> = {
  "Constrained": "#8a6a5a",
  "Tightening": "#7a7050",
  "Available": "#5a7a65",
  "Oversupplied": "#5a6a7a",
};

const LAYERS = [
  { name: "Raw materials", count: 42 },
  { name: "Components", count: 38 },
  { name: "Subsystems", count: 24 },
  { name: "End use", count: 15 },
];

const LAYER_CONTENT: Record<string, { name: string; nodes: number; status: string; verticals: string[] }[]> = {
  "Raw materials": [
    { name: "Germanium", nodes: 7, status: "Constrained", verticals: ["AI Infrastructure", "Space"] },
    { name: "Gallium", nodes: 5, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Copper", nodes: 12, status: "Tightening", verticals: ["AI Infrastructure", "Energy transition", "Robotics"] },
    { name: "Silicon", nodes: 8, status: "Available", verticals: ["AI Infrastructure", "Space", "Robotics"] },
    { name: "Helium", nodes: 4, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Lithium", nodes: 9, status: "Oversupplied", verticals: ["AI Infrastructure", "Energy transition", "UAVs"] },
    { name: "Rare earths", nodes: 6, status: "Tightening", verticals: ["Energy transition", "Robotics", "UAVs"] },
    { name: "Cobalt", nodes: 7, status: "Tightening", verticals: ["AI Infrastructure", "Energy transition"] },
    { name: "GOES steel", nodes: 4, status: "Constrained", verticals: ["Energy transition"] },
    { name: "Neon", nodes: 3, status: "Constrained", verticals: ["AI Infrastructure"] },
  ],
  "Components": [
    { name: "Fiber optic cable", nodes: 8, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Optical transceivers", nodes: 6, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Network switches", nodes: 5, status: "Available", verticals: ["AI Infrastructure"] },
    { name: "GPUs / AI accelerators", nodes: 4, status: "Constrained", verticals: ["AI Infrastructure", "Robotics"] },
    { name: "HBM memory", nodes: 3, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Servers / racks", nodes: 5, status: "Tightening", verticals: ["AI Infrastructure"] },
    { name: "Power transformers", nodes: 4, status: "Constrained", verticals: ["AI Infrastructure", "Energy transition"] },
  ],
  "Subsystems": [
    { name: "Connectivity", nodes: 6, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Compute", nodes: 5, status: "Constrained", verticals: ["AI Infrastructure", "Robotics"] },
    { name: "Power", nodes: 5, status: "Constrained", verticals: ["AI Infrastructure", "Energy transition"] },
    { name: "Cooling", nodes: 4, status: "Tightening", verticals: ["AI Infrastructure"] },
    { name: "Physical structure", nodes: 4, status: "Available", verticals: ["AI Infrastructure"] },
  ],
  "End use": [
    { name: "AI datacenters", nodes: 6, status: "Constrained", verticals: ["AI Infrastructure"] },
    { name: "Terrestrial telecom", nodes: 4, status: "Tightening", verticals: ["AI Infrastructure"] },
    { name: "Subsea networks", nodes: 3, status: "Tightening", verticals: ["AI Infrastructure"] },
    { name: "Defense / UAV", nodes: 2, status: "Constrained", verticals: ["UAVs"] },
  ],
};

const VERTICALS = [
  { name: "AI Infrastructure", count: 17, color: "#8a7a5a" },
  { name: "Robotics", count: 4, color: "#5a6a7a" },
  { name: "Energy transition", count: 6, color: "#5a7a65" },
  { name: "UAVs", count: 3, color: "#7a7050" },
  { name: "Space", count: 2, color: "#7a5a5a" },
];

export default function GlobePanel() {
  const [activeLayer, setActiveLayer] = useState("Raw materials");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeVertical, setActiveVertical] = useState<string | null>(null);

  const allItems = LAYER_CONTENT[activeLayer] || [];
  const items = activeVertical
    ? allItems.filter(item => item.verticals.includes(activeVertical))
    : allItems;

  const sectionLabel = activeVertical
    ? `${activeLayer.toUpperCase()} \u00b7 ${activeVertical.toUpperCase()}`
    : activeLayer.toUpperCase();

  return (
    <div style={{
      width: 260, height: "100%",
      background: "#161514", borderRight: "1px solid #252220",
      padding: "20px 16px 16px", flexShrink: 0,
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
    }}>


      {/* Section 1: Layers */}
      <div style={{ flexShrink: 0 }}>
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
            onMouseEnter={e => { if (activeLayer !== layer.name) e.currentTarget.style.background = "#1e1c18"; }}
            onMouseLeave={e => { if (activeLayer !== layer.name) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 12, color: activeLayer === layer.name ? "#ece8e1" : "#a09888" }}>{layer.name}</span>
            <span style={{ fontSize: 10, color: "#4a4540" }}>{layer.count}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#252220", margin: "16px 0", flexShrink: 0 }} />

      {/* Section 2: Dynamic content (scrollable) */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <p style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#4a4540", margin: "0 0 10px 0", flexShrink: 0 }}>{sectionLabel}</p>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.map((item) => {
            const isActive = activeItem === item.name;
            return (
              <div
                key={item.name}
                onClick={() => setActiveItem(isActive ? null : item.name)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 8px 6px 8px", borderRadius: 5, cursor: "pointer",
                  background: isActive ? "#1e1c18" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#1e1c18"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: STATUS_COLOR[item.status] || "#4a4540", opacity: 0.7 }} />
                  <span style={{ fontSize: 11.5, color: isActive ? "#ece8e1" : "#a09888" }}>{item.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: "#4a4540" }}>{item.nodes}</span>
                  <span style={{ ...MONO, fontSize: 9, fontWeight: 400, color: STATUS_COLOR[item.status] || "#4a4540", opacity: 0.8 }}>{item.status}</span>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <p style={{ fontSize: 10, color: "#4a4540", padding: "8px 8px", fontStyle: "italic" }}>No items in this vertical</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#252220", margin: "16px 0", flexShrink: 0 }} />

      {/* Section 3: Verticals */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: "#4a4540", margin: "0 0 10px 0" }}>VERTICALS</p>
        {VERTICALS.map((v) => {
          const isActive = activeVertical === v.name;
          return (
            <div
              key={v.name}
              onClick={() => { setActiveVertical(isActive ? null : v.name); setActiveItem(null); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 8px", borderRadius: 5, cursor: "pointer",
                background: isActive ? "#1e1c18" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#1e1c18"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: v.color, marginRight: 8, opacity: 0.7 }} />
                <span style={{ fontSize: 11.5, color: isActive ? "#ece8e1" : "#a09888" }}>{v.name}</span>
              </div>
              <span style={{ fontSize: 10, color: "#4a4540" }}>{v.count} chains</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
