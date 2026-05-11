"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import universalNodesJson from "@/data/universal-nodes.json";
import chainDefsJson from "@/data/chain-definitions.json";

const uNodes = universalNodesJson as unknown as Record<string, {
  name: string; about?: string; quantity_pill?: string; descriptor_pill?: string;
  country?: string; ai_category?: string; ai_subgroup?: string; status?: string;
  ai_key_players?: string[];
}>;

type SubgroupDef = { name: string; description?: string; overview?: string; activity?: string; nodes: string[]; parent_subsystem?: string };
type ChainDef = {
  layers: { key: string; label: string; nodes: string[] }[];
  edges: { from: string; to: string }[];
  rawMaterialCategories?: Record<string, { name: string; description?: string; overview?: string; activity?: string; nodes: string[] }>;
  componentSubgroups?: Record<string, SubgroupDef>;
  intermediateSubgroups?: Record<string, SubgroupDef>;
  output: string;
};

const chain = (chainDefsJson as unknown as Record<string, ChainDef>).ai;

const STATUS_COLORS: Record<string, string> = {
  constrained: "#c87a4a", tightening: "#c8a85a", available: "#5a8a5a", Active: "#5a8a5a", tbd: "#444",
};

const INPUT_NODES = new Set(["Germanium", "Gallium", "Fiber Optic Cable"]);

interface AISupplyTreeProps {
  onNodeClick?: (name: string) => void;
  onGroupClick?: (groupKey: string, groupName: string, overview: string, activity: string) => void;
  onNavigateToInput?: (name: string) => void;
}

// Build a map: group key → set of group keys in other columns that have linked sub-nodes
function buildGroupLinks(
  categories: Record<string, { nodes: string[] }>,
  intSubgroups: Record<string, { nodes: string[] }>,
  compSubgroups: Record<string, { nodes: string[] }>,
  edges: { from: string; to: string }[],
) {
  // node → group key
  const nodeToGroup = new Map<string, string>();
  Object.entries(categories).forEach(([k, g]) => g.nodes.forEach(n => nodeToGroup.set(n, k)));
  Object.entries(intSubgroups).forEach(([k, g]) => g.nodes.forEach(n => nodeToGroup.set(n, k)));
  Object.entries(compSubgroups).forEach(([k, g]) => g.nodes.forEach(n => nodeToGroup.set(n, k)));

  // group → set of connected groups
  const links = new Map<string, Set<string>>();
  edges.forEach(e => {
    const gFrom = nodeToGroup.get(e.from);
    const gTo = nodeToGroup.get(e.to);
    if (gFrom && gTo && gFrom !== gTo) {
      if (!links.has(gFrom)) links.set(gFrom, new Set());
      if (!links.has(gTo)) links.set(gTo, new Set());
      links.get(gFrom)!.add(gTo);
      links.get(gTo)!.add(gFrom);
    }
  });
  return links;
}

export default function AISupplyTree({ onNodeClick, onGroupClick, onNavigateToInput }: AISupplyTreeProps) {
  const [expandedRawCat, setExpandedRawCat] = useState<string | null>(null);
  const [expandedIntGroup, setExpandedIntGroup] = useState<string | null>(null);
  const [expandedCompGroup, setExpandedCompGroup] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animatingGroup, setAnimatingGroup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [lines, setLines] = useState<{ d: string; fromName: string; toName: string }[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  const categories = chain.rawMaterialCategories ?? {};
  const compSubgroups = chain.componentSubgroups ?? {};
  const intSubgroups = chain.intermediateSubgroups ?? {};

  // The currently expanded group key (across all columns)
  const activeGroupKey = expandedRawCat ?? expandedIntGroup ?? expandedCompGroup ?? null;

  // Node → group key mapping
  const nodeToGroup = useMemo(() => {
    const m = new Map<string, string>();
    Object.entries(categories).forEach(([k, g]) => g.nodes.forEach(n => m.set(n, k)));
    Object.entries(intSubgroups).forEach(([k, g]) => g.nodes.forEach(n => m.set(n, k)));
    Object.entries(compSubgroups).forEach(([k, g]) => g.nodes.forEach(n => m.set(n, k)));
    return m;
  }, [categories, intSubgroups, compSubgroups]);

  // Downstream and upstream maps for BFS
  const { downstreamMap, upstreamMap } = useMemo(() => {
    const down = new Map<string, Set<string>>();
    const up = new Map<string, Set<string>>();
    chain.edges.forEach(e => {
      if (!down.has(e.from)) down.set(e.from, new Set());
      down.get(e.from)!.add(e.to);
      if (!up.has(e.to)) up.set(e.to, new Set());
      up.get(e.to)!.add(e.from);
    });
    return { downstreamMap: down, upstreamMap: up };
  }, []);

  // Only compute visible edges when a sub-node is selected
  const visibleEdges = useMemo(() => {
    if (!selectedNode) return [];

    // BFS both directions from selected node to get full chain
    const chainNodes = new Set<string>();
    const queue = [selectedNode];
    chainNodes.add(selectedNode);
    // Downstream
    const dq = [selectedNode];
    while (dq.length > 0) {
      const curr = dq.shift()!;
      (downstreamMap.get(curr) ?? new Set()).forEach(n => { if (!chainNodes.has(n)) { chainNodes.add(n); dq.push(n); } });
    }
    // Upstream
    const uq = [selectedNode];
    while (uq.length > 0) {
      const curr = uq.shift()!;
      (upstreamMap.get(curr) ?? new Set()).forEach(n => { if (!chainNodes.has(n)) { chainNodes.add(n); uq.push(n); } });
    }

    // Filter edges to only those between chain nodes, then resolve to groups/nodes
    const expandedGroups = new Set<string>();
    if (expandedRawCat) expandedGroups.add(expandedRawCat);
    if (expandedIntGroup) expandedGroups.add(expandedIntGroup);
    if (expandedCompGroup) expandedGroups.add(expandedCompGroup);

    // Build set of visible group keys per column — when a column has an expanded group,
    // only that group and its members are visible; all other groups are hidden
    const catKeys = new Set(Object.keys(categories));
    const intKeys = new Set(Object.keys(intSubgroups));
    const compKeys = new Set(Object.keys(compSubgroups));

    const visibleGroupKeys = new Set<string>();
    // Raw materials column
    if (expandedRawCat) { visibleGroupKeys.add(expandedRawCat); }
    else { catKeys.forEach(k => visibleGroupKeys.add(k)); }
    // Intermediates column
    if (expandedIntGroup) { visibleGroupKeys.add(expandedIntGroup); }
    else { intKeys.forEach(k => visibleGroupKeys.add(k)); }
    // Components column
    if (expandedCompGroup) { visibleGroupKeys.add(expandedCompGroup); }
    else { compKeys.forEach(k => visibleGroupKeys.add(k)); }

    const edgeSet = new Set<string>();
    const result: { from: string; to: string }[] = [];

    chain.edges.forEach(e => {
      if (!chainNodes.has(e.from) || !chainNodes.has(e.to)) return;

      const gFrom = nodeToGroup.get(e.from);
      const gTo = nodeToGroup.get(e.to);

      // Resolve to group or node depending on expansion
      const resolvedFrom = (gFrom && expandedGroups.has(gFrom)) ? e.from : (gFrom ?? e.from);
      const resolvedTo = (gTo && expandedGroups.has(gTo)) ? e.to : (gTo ?? e.to);

      // Skip if resolved target is a group that's not currently visible
      if (gFrom && !expandedGroups.has(gFrom) && !visibleGroupKeys.has(gFrom)) return;
      if (gTo && !expandedGroups.has(gTo) && !visibleGroupKeys.has(gTo)) return;

      const key = `${resolvedFrom}→${resolvedTo}`;
      if (!edgeSet.has(key) && resolvedFrom !== resolvedTo) {
        edgeSet.add(key);
        result.push({ from: resolvedFrom, to: resolvedTo });
      }
    });

    return result;
  }, [selectedNode, nodeToGroup, expandedRawCat, expandedIntGroup, expandedCompGroup, downstreamMap, upstreamMap]);

  // Measure card positions and draw bezier connections
  const measureAndDraw = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newLines: { d: string; fromName: string; toName: string }[] = [];

    visibleEdges.forEach(edge => {
      const fromEl = cardRefs.current.get(edge.from);
      const toEl = cardRefs.current.get(edge.to);
      if (!fromEl || !toEl) return;
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();
      // Only draw left-to-right connections
      if (toRect.left <= fromRect.right) return;
      const fromX = fromRect.right - containerRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
      const toX = toRect.left - containerRect.left;
      const toY = toRect.top + toRect.height / 2 - containerRect.top;
      const midX = (fromX + toX) / 2;
      newLines.push({ d: `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`, fromName: edge.from, toName: edge.to });
    });

    setSvgSize({ w: container.scrollWidth, h: container.scrollHeight });
    setLines(newLines);
  }, [visibleEdges]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      // Small delay to let DOM settle after expand/collapse
      setTimeout(measureAndDraw, 50);
    });
    return () => cancelAnimationFrame(raf);
  }, [measureAndDraw, expandedRawCat, expandedIntGroup, expandedCompGroup, selectedNode]);

  // (downstreamMap and upstreamMap moved above visibleEdges)

  // All reachable nodes from selection (sub-node or group) via BFS
  const reachableNodes = useMemo(() => {
    let startNodes: string[] = [];
    if (selectedNode) {
      startNodes = [selectedNode];
    } else if (activeGroupKey) {
      const allGroups = { ...categories, ...intSubgroups, ...compSubgroups };
      startNodes = allGroups[activeGroupKey]?.nodes ?? [];
    }
    if (startNodes.length === 0) return new Set<string>();

    // Traverse both downstream and upstream from start nodes
    const visited = new Set<string>();
    startNodes.forEach(n => visited.add(n));
    // Downstream
    const dq = [...startNodes];
    while (dq.length > 0) {
      const curr = dq.shift()!;
      (downstreamMap.get(curr) ?? new Set()).forEach(n => { if (!visited.has(n)) { visited.add(n); dq.push(n); } });
    }
    // Upstream
    const uq = [...startNodes];
    while (uq.length > 0) {
      const curr = uq.shift()!;
      (upstreamMap.get(curr) ?? new Set()).forEach(n => { if (!visited.has(n)) { visited.add(n); uq.push(n); } });
    }
    return visited;
  }, [selectedNode, activeGroupKey, downstreamMap, upstreamMap, categories, intSubgroups, compSubgroups]);

  // Highlighted groups: groups containing any reachable node
  const highlightedGroups = useMemo(() => {
    if (reachableNodes.size === 0) return new Set<string>();
    const groups = new Set<string>();
    reachableNodes.forEach(n => {
      const g = nodeToGroup.get(n);
      if (g) groups.add(g);
    });
    // Remove the active group itself so it doesn't highlight itself
    if (activeGroupKey) groups.delete(activeGroupKey);
    return groups;
  }, [reachableNodes, nodeToGroup, activeGroupKey]);

  // Connected sub-nodes: reachable nodes that are in expanded groups
  const connectedSubNodes = useMemo(() => {
    return reachableNodes;
  }, [reachableNodes]);

  function getGroupStatus(nodes: string[]): string {
    const statuses = nodes.map(n => uNodes[n]?.status ?? "tbd");
    if (statuses.includes("constrained")) return "constrained";
    if (statuses.includes("tightening")) return "tightening";
    if (statuses.includes("available") || statuses.includes("Active")) return "available";
    return "tbd";
  }

  // Node card
  function NCard({ name, bright, animate, animIndex }: { name: string; bright?: boolean; animate?: boolean; animIndex?: number }) {
    const node = uNodes[name];
    const statusColor = STATUS_COLORS[node?.status ?? "tbd"] ?? "#444";
    const isSelected = selectedNode === name;
    const isConnected = selectedNode != null && connectedSubNodes.has(name);
    const bg = isSelected ? "rgb(88, 86, 84)" : isConnected ? "rgb(55, 52, 48)" : bright ? "rgb(40, 37, 34)" : "rgb(34, 31, 29)";
    const border = isSelected ? "rgb(100, 98, 96)" : isConnected ? "rgb(75, 70, 65)" : bright ? "rgb(50, 46, 42)" : "rgb(42, 39, 37)";

    return (
      <div
        ref={el => { if (el) cardRefs.current.set(name, el); }}
        onClick={() => { setSelectedNode(prev => prev === name ? null : name); onNodeClick?.(name); }}
        style={{
          padding: "4px 6px 4px 12px",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 3,
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
          position: "relative" as const,
          ...(animate ? { animation: `subNodeFadeUp 400ms ease-out ${(animIndex ?? 0) * 40}ms both` } : {}),
        }}
        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "rgb(48, 44, 40)"; e.currentTarget.style.borderColor = "rgb(60, 56, 52)"; } }}
        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}
      >
        <div style={{ position: "absolute", left: 3, top: "50%", transform: "translateY(-50%)", width: 4, height: 4, borderRadius: "50%", background: statusColor }} />
        <p style={{ fontSize: 10, fontWeight: 600, color: isSelected ? "#fff" : isConnected ? "#f0ece4" : bright ? "#f0ece4" : "#ece8e1", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</p>
      </div>
    );
  }

  // Group header
  function GroupHeader({ groupKey, name, count, status, highlighted, onClick }: { groupKey: string; name: string; count: number; status: string; highlighted: boolean; onClick: () => void }) {
    const statusColor = STATUS_COLORS[status] ?? "#444";
    return (
      <div
        ref={el => { if (el) cardRefs.current.set(groupKey, el); }}
        onClick={onClick}
        style={{
          padding: "5px 8px",
          background: highlighted ? "rgb(42, 38, 35)" : "rgb(30, 28, 27)",
          border: highlighted ? "1px solid rgb(60, 56, 52)" : "1px solid rgb(42, 39, 37)",
          borderRadius: 3, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "background 0.2s, border-color 0.2s, opacity 0.2s",
          opacity: (activeGroupKey && !highlighted && activeGroupKey !== groupKey) || (selectedNode && !highlighted) ? 0.35 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: highlighted ? "#ece8e1" : "#d0c8bc", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</span>
          <span style={{ fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>· {count}</span>
        </div>
        <span style={{ fontSize: 7, color: "#555" }}>›</span>
      </div>
    );
  }

  // Grouped column
  function GroupedColumn({
    label, totalCount, groups, expandedGroup, setExpandedGroup, columnGroupKeys,
  }: {
    label: string; totalCount: number;
    groups: Record<string, { name: string; description?: string; overview?: string; activity?: string; nodes: string[]; parent_subsystem?: string }>;
    expandedGroup: string | null; setExpandedGroup: (g: string | null) => void;
    columnGroupKeys: string[];
  }) {
    const subsystemOrder = ["compute", "memory_storage", "connectivity", "cooling", "power_distribution", "power_generation", "physical_structure"];
    const sortedKeys = [...columnGroupKeys].sort((a, b) => {
      // Highlighted groups first when a node is selected
      const ha = highlightedGroups.has(a) ? 0 : 1;
      const hb = highlightedGroups.has(b) ? 0 : 1;
      if (ha !== hb) return ha - hb;
      const pa = groups[a]?.parent_subsystem;
      const pb = groups[b]?.parent_subsystem;
      if (pa && pb) { const ia = subsystemOrder.indexOf(pa); const ib = subsystemOrder.indexOf(pb); if (ia !== ib) return ia - ib; }
      if (pa && !pb) return -1;
      if (!pa && pb) return 1;
      return a.localeCompare(b);
    });

    const handleGroupClick = (gk: string) => {
      if (expandedGroup === gk) {
        setExpandedGroup(null);
        setAnimatingGroup(null);
      } else {
        setExpandedGroup(gk);
        setAnimatingGroup(gk);
        const g = groups[gk];
        if (g) onGroupClick?.(gk, g.name, g.overview ?? "", g.activity ?? "");
      }
    };

    return (
      <div style={{ minWidth: 165, maxWidth: 200, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: 0, fontFamily: "'Geist Mono', monospace" }}>
            {label} · {expandedGroup ? groups[expandedGroup]?.nodes.length ?? 0 : totalCount}
          </p>
          {expandedGroup && (
            <button onClick={() => { setExpandedGroup(null); setAnimatingGroup(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>← back</button>
          )}
        </div>
        <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {expandedGroup ? (
            <>
              <p style={{ fontSize: 8, color: "#706a60", margin: "0 0 4px 0", fontWeight: 500, fontFamily: "'EB Garamond', Georgia, serif" }}>{groups[expandedGroup]?.name}</p>
              {[...(groups[expandedGroup]?.nodes ?? [])].sort((a, b) => {
                const ca = connectedSubNodes.has(a) ? 0 : 1;
                const cb = connectedSubNodes.has(b) ? 0 : 1;
                return ca - cb;
              }).map((n, i) => (
                <NCard key={n} name={n} bright animate={animatingGroup === expandedGroup} animIndex={i} />
              ))}
            </>
          ) : (
            sortedKeys.map(gk => {
              const g = groups[gk];
              if (!g || g.nodes.length === 0) return null;
              return (
                <GroupHeader
                  key={gk}
                  groupKey={gk}
                  name={g.name}
                  count={g.nodes.length}
                  status={getGroupStatus(g.nodes)}
                  highlighted={highlightedGroups.has(gk)}
                  onClick={() => handleGroupClick(gk)}
                />
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Simple column — connected nodes sorted to top
  function SimpleColumn({ layer }: { layer: { key: string; label: string; nodes: string[] } }) {
    const sorted = [...layer.nodes].sort((a, b) => {
      const ca = reachableNodes.has(a) ? 0 : 1;
      const cb = reachableNodes.has(b) ? 0 : 1;
      return ca - cb;
    });
    return (
      <div style={{ minWidth: 140, maxWidth: 170, flexShrink: 0 }}>
        <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: "0 0 6px 0", fontFamily: "'Geist Mono', monospace", whiteSpace: "nowrap" }}>{layer.label} · {layer.nodes.length}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sorted.map(n => <NCard key={n} name={n} />)}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 30, padding: "12px 0", overflow: "auto", minWidth: 0 }}>
        <GroupedColumn label="RAW MATERIALS" totalCount={63} groups={categories} expandedGroup={expandedRawCat} setExpandedGroup={setExpandedRawCat} columnGroupKeys={Object.keys(categories)} />
        <GroupedColumn label="INTERMEDIATES" totalCount={56} groups={intSubgroups} expandedGroup={expandedIntGroup} setExpandedGroup={setExpandedIntGroup} columnGroupKeys={Object.keys(intSubgroups)} />
        <GroupedColumn label="COMPONENTS" totalCount={58} groups={compSubgroups} expandedGroup={expandedCompGroup} setExpandedGroup={setExpandedCompGroup} columnGroupKeys={Object.keys(compSubgroups)} />
        <SimpleColumn layer={chain.layers[3]} />
        <SimpleColumn layer={chain.layers[4]} />
      </div>

      {/* SVG connection lines — only shown when a sub-node is selected */}
      {lines.length > 0 && (
        <svg style={{ position: "absolute", top: 0, left: 0, width: svgSize.w || "100%", height: svgSize.h || "100%", pointerEvents: "none", overflow: "visible" }}>
          {lines.map((line, i) => {
            const isDirectEdge = line.fromName === selectedNode || line.toName === selectedNode;
            return (
              <path
                key={i}
                d={line.d}
                fill="none"
                stroke={isDirectEdge ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isDirectEdge ? "1" : "0.6"}
                strokeDasharray="3,3"
              />
            );
          })}
        </svg>
      )}

      {/* Navigate button — bottom right when an input node is selected */}
      {selectedNode && INPUT_NODES.has(selectedNode) && (
        <div style={{ position: "absolute", bottom: 8, right: 8, zIndex: 10 }}>
          <button
            onClick={() => onNavigateToInput?.(selectedNode)}
            style={{
              background: "rgb(60, 58, 56)", border: "1px solid rgb(80, 78, 76)",
              borderRadius: 6, padding: "8px 16px", cursor: "pointer",
              fontSize: 10, color: "#ece8e1", fontFamily: "'Geist Mono', monospace",
              display: "flex", alignItems: "center", gap: 6,
              transition: "background 0.15s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgb(75, 73, 71)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgb(60, 58, 56)"; }}
          >
            View {selectedNode} supply tree <span style={{ color: "#a09888" }}>&rarr;</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes subNodeFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
