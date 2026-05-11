"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import universalNodesJson from "@/data/universal-nodes.json";
import chainDefsJson from "@/data/chain-definitions.json";

const uNodes = universalNodesJson as unknown as Record<string, {
  name: string; about?: string; quantity_pill?: string; descriptor_pill?: string;
  country?: string; ai_category?: string; ai_subgroup?: string; status?: string;
  ai_key_players?: string[];
}>;

type SubgroupDef = { name: string; description: string; nodes: string[]; parent_subsystem?: string };
type ChainDef = {
  layers: { key: string; label: string; nodes: string[] }[];
  edges: { from: string; to: string }[];
  rawMaterialCategories?: Record<string, { name: string; description: string; nodes: string[] }>;
  componentSubgroups?: Record<string, SubgroupDef>;
  intermediateSubgroups?: Record<string, SubgroupDef>;
  output: string;
};

const chain = (chainDefsJson as unknown as Record<string, ChainDef>).ai;

const STATUS_COLORS: Record<string, string> = {
  constrained: "#c87a4a", tightening: "#c8a85a", available: "#5a8a5a", Active: "#5a8a5a", tbd: "#444",
};

interface AISupplyTreeProps {
  onNodeClick?: (name: string) => void;
}

export default function AISupplyTree({ onNodeClick }: AISupplyTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [clickedNode, setClickedNode] = useState<string | null>(null);
  const activeNode = clickedNode ?? hoveredNode;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ d: string; fromName: string; toName: string }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const categories = chain.rawMaterialCategories ?? {};
  const compSubgroups = chain.componentSubgroups ?? {};
  const intSubgroups = chain.intermediateSubgroups ?? {};

  // Build adjacency + full chain traversal
  const { connectedNodes, fullChain } = useMemo(() => {
    const adj = new Map<string, Set<string>>();
    const downstream = new Map<string, Set<string>>();
    const upstream = new Map<string, Set<string>>();
    chain.edges.forEach(e => {
      if (!adj.has(e.from)) adj.set(e.from, new Set());
      if (!adj.has(e.to)) adj.set(e.to, new Set());
      adj.get(e.from)!.add(e.to);
      adj.get(e.to)!.add(e.from);
      if (!downstream.has(e.from)) downstream.set(e.from, new Set());
      downstream.get(e.from)!.add(e.to);
      if (!upstream.has(e.to)) upstream.set(e.to, new Set());
      upstream.get(e.to)!.add(e.from);
    });
    // BFS full chain
    const getFullChain = (node: string): Set<string> => {
      const visited = new Set<string>();
      const queue = [node];
      visited.add(node);
      while (queue.length > 0) {
        const curr = queue.shift()!;
        (downstream.get(curr) ?? new Set()).forEach(n => { if (!visited.has(n)) { visited.add(n); queue.push(n); } });
        (upstream.get(curr) ?? new Set()).forEach(n => { if (!visited.has(n)) { visited.add(n); queue.push(n); } });
      }
      return visited;
    };
    return { connectedNodes: adj, fullChain: getFullChain };
  }, []);

  // Measure and draw connections
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
      newLines.push({ d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`, fromName: edge.from, toName: edge.to });
    });

    setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
    setLines(newLines);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(measureAndDraw);
    return () => cancelAnimationFrame(raf);
  }, [measureAndDraw, expandedCategories]);

  // Highlight logic
  const activeChain = useMemo(() => activeNode ? fullChain(activeNode) : null, [activeNode, fullChain]);

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
      if (next.has(catKey)) next.delete(catKey); else next.add(catKey);
      return next;
    });
  };

  // Node card
  function NCard({ name }: { name: string }) {
    const node = uNodes[name];
    const isInChain = activeChain?.has(name);
    const isActive = activeNode === name;
    const isDimmed = activeNode != null && !isInChain;
    const statusColor = STATUS_COLORS[node?.status ?? "tbd"] ?? "#444";

    return (
      <div
        ref={el => { if (el) cardRefs.current.set(name, el); }}
        onClick={() => { setClickedNode(prev => prev === name ? null : name); onNodeClick?.(name); }}
        onMouseEnter={() => setHoveredNode(name)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{
          padding: "3px 6px 3px 10px",
          background: isActive ? "rgb(50, 46, 42)" : isInChain ? "rgb(42, 38, 35)" : "rgb(34, 31, 29)",
          border: isActive ? "1px solid rgb(70, 64, 58)" : "1px solid rgb(42, 39, 37)",
          borderRadius: 3,
          cursor: "pointer",
          opacity: isDimmed ? 0.1 : 1,
          transition: "opacity 0.15s, background 0.15s, border-color 0.15s",
          position: "relative" as const,
        }}
      >
        {/* Status dot */}
        <div style={{ position: "absolute", left: 3, top: "50%", transform: "translateY(-50%)", width: 4, height: 4, borderRadius: "50%", background: statusColor }} />
        <p style={{ fontSize: 8, fontWeight: 600, color: "#ece8e1", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</p>
        {node?.descriptor_pill && (
          <p style={{ fontSize: 5.5, color: "rgba(255,255,255,0.35)", margin: "1px 0 0 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>{node.descriptor_pill}</p>
        )}
      </div>
    );
  }

  // Category group
  function CategoryGroup({ catKey }: { catKey: string }) {
    const cat = categories[catKey];
    if (!cat) return null;
    const isExpanded = expandedCategories.has(catKey);
    const status = getCategoryStatus(catKey);
    const statusColor = STATUS_COLORS[status] ?? "#444";

    return (
      <div style={{ marginBottom: 3 }}>
        <div
          ref={el => { if (el && !isExpanded) cat.nodes.forEach(n => cardRefs.current.set(n, el)); }}
          onClick={() => toggleCategory(catKey)}
          style={{
            padding: "4px 7px",
            background: isExpanded ? "rgb(38, 35, 33)" : "rgb(30, 28, 27)",
            border: "1px solid rgb(42, 39, 37)",
            borderRadius: 3, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
            <span style={{ fontSize: 8, fontWeight: 600, color: "#d0c8bc" }}>{cat.name}</span>
            <span style={{ fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>· {cat.nodes.length}</span>
          </div>
          <span style={{ fontSize: 7, color: "#555", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
        </div>
        {isExpanded && (
          <div style={{ paddingLeft: 6, paddingTop: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {cat.nodes.map(n => <NCard key={n} name={n} />)}
          </div>
        )}
      </div>
    );
  }

  // Subgroup-organized column
  function SubgroupColumn({ subgroups, layerLabel, nodeCount }: { subgroups: Record<string, SubgroupDef>; layerLabel: string; nodeCount: number }) {
    // Group subgroups by parent_subsystem for alignment (components only)
    const subsystemOrder = chain.layers.find(l => l.key === "subsystems")?.nodes ?? [];

    // Sort subgroups: by parent_subsystem order (if present), then alphabetically
    const sortedKeys = Object.keys(subgroups).sort((a, b) => {
      const pa = subgroups[a].parent_subsystem;
      const pb = subgroups[b].parent_subsystem;
      if (pa && pb) {
        const ia = subsystemOrder.indexOf(pa === "compute" ? "Compute" : pa === "memory_storage" ? "Memory & Storage" : pa === "connectivity" ? "Connectivity" : pa === "cooling" ? "Cooling" : pa === "power_distribution" ? "Power Distribution" : pa === "power_generation" ? "Power Generation" : pa === "physical_structure" ? "Physical Structure" : pa);
        const ib = subsystemOrder.indexOf(pb === "compute" ? "Compute" : pb === "memory_storage" ? "Memory & Storage" : pb === "connectivity" ? "Connectivity" : pb === "cooling" ? "Cooling" : pb === "power_distribution" ? "Power Distribution" : pb === "power_generation" ? "Power Generation" : pb === "physical_structure" ? "Physical Structure" : pb);
        if (ia !== ib) return ia - ib;
      }
      return a.localeCompare(b);
    });

    let lastParent = "";

    return (
      <div style={{ minWidth: 160, maxWidth: 190, flexShrink: 0 }}>
        <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{layerLabel} · {nodeCount}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: 4 }}>
          {sortedKeys.map(sgKey => {
            const sg = subgroups[sgKey];
            if (sg.nodes.length === 0) return null;
            const showParentDivider = sg.parent_subsystem && sg.parent_subsystem !== lastParent;
            if (sg.parent_subsystem) lastParent = sg.parent_subsystem;

            return (
              <React.Fragment key={sgKey}>
                {showParentDivider && (
                  <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />
                )}
                <p style={{ fontSize: 6, color: "#4a4540", margin: "3px 0 2px 0", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{sg.name}</p>
                {sg.nodes.map(n => <NCard key={n} name={n} />)}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Simple column for subsystems and end use
  function SimpleColumn({ layer }: { layer: { key: string; label: string; nodes: string[] } }) {
    return (
      <div style={{ minWidth: 140, maxWidth: 170, flexShrink: 0 }}>
        <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{layer.label} · {layer.nodes.length}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {layer.nodes.map(n => <NCard key={n} name={n} />)}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: "flex", gap: 16, padding: "12px 0", overflow: "auto", minWidth: 0, position: "relative" }}>
      {/* Raw Materials — categories */}
      <div style={{ minWidth: 165, maxWidth: 195, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: 0, fontFamily: "'Geist Mono', monospace" }}>RAW MATERIALS · 63</p>
          {expandedCategories.size > 0 && (
            <button onClick={() => setExpandedCategories(new Set())} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>collapse all</button>
          )}
        </div>
        <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: 4 }}>
          {Object.keys(categories).map(ck => <CategoryGroup key={ck} catKey={ck} />)}
        </div>
      </div>

      {/* Intermediates — subgroups */}
      <SubgroupColumn subgroups={intSubgroups} layerLabel="INTERMEDIATES" nodeCount={56} />

      {/* Components — subgroups aligned to subsystems */}
      <SubgroupColumn subgroups={compSubgroups} layerLabel="COMPONENTS" nodeCount={58} />

      {/* Subsystems */}
      <SimpleColumn layer={chain.layers[3]} />

      {/* End Use */}
      <SimpleColumn layer={chain.layers[4]} />

      {/* SVG connection lines */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: svgSize.w || "100%", height: svgSize.h || "100%", pointerEvents: "none", overflow: "visible" }}>
        {lines.map((line, i) => {
          const inChain = activeChain ? (activeChain.has(line.fromName) && activeChain.has(line.toName)) : false;
          const lineActive = activeNode != null && (line.fromName === activeNode || line.toName === activeNode);
          const lineDimmed = activeNode != null && !inChain;
          return (
            <path
              key={i}
              d={line.d}
              fill="none"
              stroke={lineActive ? "rgba(255,255,255,0.4)" : inChain ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)"}
              strokeWidth={lineActive ? "1" : "0.4"}
              strokeDasharray="3,3"
              style={{ opacity: lineDimmed ? 0.03 : 1, transition: "opacity 0.15s, stroke 0.15s" }}
            />
          );
        })}
      </svg>
    </div>
  );
}
