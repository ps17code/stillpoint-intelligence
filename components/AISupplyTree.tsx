"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
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

interface AISupplyTreeProps {
  onNodeClick?: (name: string) => void;
}

export default function AISupplyTree({ onNodeClick }: AISupplyTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ d: string; fromName: string; toName: string }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

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

  // Measure card positions and draw connection lines
  const measureAndDraw = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newLines: { d: string; fromName: string; toName: string }[] = [];

    chain.edges.forEach(edge => {
      const fromEl = cardRefs.current.get(edge.from);
      const toEl = cardRefs.current.get(edge.to);
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const fromX = fromRect.right - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;
      const midX = (fromX + toX) / 2;

      newLines.push({
        d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`,
        fromName: edge.from,
        toName: edge.to,
      });
    });

    setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
    setLines(newLines);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(measureAndDraw);
    return () => cancelAnimationFrame(raf);
  }, [measureAndDraw, expandedCategories]);

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
  function NodeCard({ name, refKey }: { name: string; refKey?: string }) {
    const isHighlighted = hoveredNode === name || (hoveredNode != null && connectedNodes.get(hoveredNode)?.has(name));
    const isDimmed = hoveredNode != null && !isHighlighted;
    const node = uNodes[name];

    return (
      <div
        ref={el => { if (el) cardRefs.current.set(refKey ?? name, el); }}
        onClick={() => onNodeClick?.(name)}
        onMouseEnter={() => setHoveredNode(name)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{
          padding: "4px 8px",
          background: isHighlighted ? "rgb(42, 38, 35)" : "rgb(36, 32, 29)",
          border: isHighlighted ? "1px solid rgb(60, 56, 52)" : "1px solid rgb(45, 41, 39)",
          borderRadius: 4,
          cursor: "pointer",
          opacity: isDimmed ? 0.15 : 1,
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

  // Category group for raw materials
  function CategoryGroup({ catKey }: { catKey: string }) {
    const cat = categories[catKey];
    if (!cat) return null;
    const isExpanded = expandedCategories.has(catKey);
    const status = getCategoryStatus(catKey);
    const statusColor = STATUS_COLORS[status] ?? "#555";

    // When collapsed, register a ref for the category itself so edges can connect
    // When expanded, individual nodes have their own refs

    return (
      <div style={{ marginBottom: 4 }}>
        <div
          ref={el => {
            if (el && !isExpanded) {
              // Register category as target for all its member nodes
              cat.nodes.forEach(n => cardRefs.current.set(n, el));
            }
          }}
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
        {isExpanded && (
          <div style={{ paddingLeft: 8, paddingTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            {cat.nodes.map(nodeName => (
              <NodeCard key={nodeName} name={nodeName} refKey={nodeName} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", gap: 20, padding: "16px 0", overflow: "auto", minWidth: 0, position: "relative" }}
    >
      {/* Raw Materials column — categories */}
      <div style={{ minWidth: 170, maxWidth: 200, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: 0, fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>RAW MATERIALS · {chain.layers[0].nodes.length}</p>
          {expandedCategories.size > 0 && (
            <button onClick={collapseAll} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 7, color: "#555", fontFamily: "'Geist Mono', monospace" }}>collapse all</button>
          )}
        </div>
        <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {Object.keys(categories).map(catKey => (
            <CategoryGroup key={catKey} catKey={catKey} />
          ))}
        </div>
      </div>

      {/* Other layers */}
      {chain.layers.slice(1).map(layer => (
        <div key={layer.key} style={{ minWidth: 150, maxWidth: 180, flexShrink: 0 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 8px 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{layer.label} · {layer.nodes.length}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
            {layer.nodes.map(nodeName => (
              <NodeCard key={nodeName} name={nodeName} refKey={nodeName} />
            ))}
          </div>
        </div>
      ))}

      {/* SVG overlay for connection lines */}
      <svg
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: svgSize.w || "100%",
          height: svgSize.h || "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {lines.map((line, i) => {
          const lineHighlighted = hoveredNode != null && (line.fromName === hoveredNode || line.toName === hoveredNode);
          const lineDimmed = hoveredNode != null && !lineHighlighted;
          return (
            <path
              key={i}
              d={line.d}
              fill="none"
              stroke={lineHighlighted ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.06)"}
              strokeWidth={lineHighlighted ? "1" : "0.5"}
              strokeDasharray="3,3"
              style={{ opacity: lineDimmed ? 0.05 : 1, transition: "opacity 0.15s, stroke 0.15s" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
