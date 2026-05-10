"use client";
import React, { useState, useMemo } from "react";
import universalNodesJson from "@/data/universal-nodes.json";
import chainDefsJson from "@/data/chain-definitions.json";

const uNodes = universalNodesJson as unknown as Record<string, { name: string; about?: string; quantity_pill?: string; descriptor_pill?: string; country?: string; ai_category?: string; status?: string }>;

type ChainDef = {
  layers: { key: string; label: string; nodes: string[] }[];
  edges: { from: string; to: string }[];
  rawMaterialCategories?: Record<string, { name: string; description: string; nodes: string[] }>;
  output: string;
};

const chain = (chainDefsJson as unknown as Record<string, ChainDef>).ai;

const STATUS_COLORS: Record<string, string> = {
  constrained: "#c85a5a",
  tightening: "#c8a85a",
  available: "#5a8a5a",
  Active: "#5a8a5a",
  tbd: "#555",
};

const LAYER_ACCENT: Record<string, string> = {
  rawMaterials: "#c8a85a",
  intermediates: "#9BA8AB",
  components: "#B87D5E",
  subsystems: "#7a9abc",
  endUse: "#D4CCBA",
};

interface AISupplyTreeProps {
  onNodeClick?: (name: string) => void;
}

export default function AISupplyTree({ onNodeClick }: AISupplyTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const categories = chain.rawMaterialCategories ?? {};

  // Build adjacency for hover highlighting
  const connectedNodes = useMemo(() => {
    const map = new Map<string, Set<string>>();
    chain.edges.forEach(e => {
      if (!map.has(e.from)) map.set(e.from, new Set());
      if (!map.has(e.to)) map.set(e.to, new Set());
      map.get(e.from)!.add(e.to);
      map.get(e.to)!.add(e.from);
    });
    return map;
  }, []);

  // Get worst status in a category
  function getCategoryStatus(catKey: string): string {
    const cat = categories[catKey];
    if (!cat) return "tbd";
    const statuses = cat.nodes.map(n => uNodes[n]?.status ?? "tbd");
    if (statuses.includes("constrained")) return "constrained";
    if (statuses.includes("tightening")) return "tightening";
    if (statuses.includes("available") || statuses.includes("Active")) return "available";
    return "tbd";
  }

  // Check if category has edge to a downstream node
  function categoryHasEdgeTo(catKey: string, targetNode: string): boolean {
    const cat = categories[catKey];
    if (!cat) return false;
    return cat.nodes.some(n => chain.edges.some(e => e.from === n && e.to === targetNode));
  }

  const toggleCategory = (catKey: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catKey)) next.delete(catKey);
      else next.add(catKey);
      return next;
    });
  };

  const collapseAll = () => setExpandedCategories(new Set());

  // Render a single node card
  function NodeCard({ name, accent }: { name: string; accent: string }) {
    const node = uNodes[name];
    const isHighlighted = hoveredNode === name || (hoveredNode != null && connectedNodes.get(hoveredNode)?.has(name));
    const isDimmed = hoveredNode != null && !isHighlighted;

    return (
      <div
        onClick={() => onNodeClick?.(name)}
        onMouseEnter={() => setHoveredNode(name)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{
          padding: "4px 8px",
          background: isHighlighted ? "rgb(42, 38, 35)" : "rgb(36, 32, 29)",
          border: isHighlighted ? "1px solid rgb(60, 56, 52)" : "1px solid rgb(45, 41, 39)",
          borderRadius: 4,
          cursor: "pointer",
          opacity: isDimmed ? 0.25 : 1,
          transition: "opacity 0.15s, background 0.15s, border-color 0.15s",
        }}
      >
        <p style={{ fontSize: 9, fontWeight: 600, color: "#ece8e1", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</p>
        {node?.descriptor_pill && (
          <p style={{ fontSize: 6, color: "rgba(255,255,255,0.45)", margin: "2px 0 0 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{node.descriptor_pill}</p>
        )}
      </div>
    );
  }

  // Render category group (collapsed or expanded)
  function CategoryGroup({ catKey }: { catKey: string }) {
    const cat = categories[catKey];
    if (!cat) return null;
    const isExpanded = expandedCategories.has(catKey);
    const status = getCategoryStatus(catKey);
    const statusColor = STATUS_COLORS[status] ?? "#555";

    return (
      <div style={{ marginBottom: 4 }}>
        {/* Category header */}
        <div
          onClick={() => toggleCategory(catKey)}
          style={{
            padding: "5px 8px",
            background: isExpanded ? "rgb(42, 38, 35)" : "rgb(32, 30, 28)",
            border: "1px solid rgb(45, 41, 39)",
            borderRadius: 4,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            transition: "background 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: "#ece8e1" }}>{cat.name}</span>
            <span style={{ fontSize: 7, color: "#555", fontFamily: "'Geist Mono', monospace" }}>· {cat.nodes.length}</span>
          </div>
          <span style={{ fontSize: 8, color: "#555", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
        </div>
        {/* Expanded: show individual nodes */}
        {isExpanded && (
          <div style={{ paddingLeft: 8, paddingTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            {cat.nodes.map(nodeName => (
              <NodeCard key={nodeName} name={nodeName} accent={LAYER_ACCENT.rawMaterials} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 20, padding: "16px 0", overflow: "auto", minWidth: 0 }}>
      {/* Raw Materials column — categories */}
      <div style={{ minWidth: 170, maxWidth: 200, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: 0, fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>RAW MATERIALS · {chain.layers[0].nodes.length}</p>
          {expandedCategories.size > 0 && (
            <button onClick={collapseAll} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 7, color: "#555", fontFamily: "'Geist Mono', monospace" }}>collapse all</button>
          )}
        </div>
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          {Object.keys(categories).map(catKey => (
            <CategoryGroup key={catKey} catKey={catKey} />
          ))}
        </div>
      </div>

      {/* Other layers — simple card columns */}
      {chain.layers.slice(1).map((layer, li) => (
        <div key={layer.key} style={{ minWidth: 150, maxWidth: 180, flexShrink: 0 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 8px 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{layer.label} · {layer.nodes.length}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 500, overflowY: "auto" }}>
            {layer.nodes.map(nodeName => (
              <NodeCard key={nodeName} name={nodeName} accent={LAYER_ACCENT[layer.key] ?? "#706a60"} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
