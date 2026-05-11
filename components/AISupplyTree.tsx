"use client";
import React, { useState, useMemo } from "react";
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
  // Track which group was just expanded (for animation) — only animate on first expand
  const [animatingGroup, setAnimatingGroup] = useState<string | null>(null);

  const categories = chain.rawMaterialCategories ?? {};
  const compSubgroups = chain.componentSubgroups ?? {};
  const intSubgroups = chain.intermediateSubgroups ?? {};

  // The currently expanded group key (across all columns)
  const activeGroupKey = expandedRawCat ?? expandedIntGroup ?? expandedCompGroup ?? null;

  // Build group-to-group links
  const groupLinks = useMemo(() => buildGroupLinks(categories, intSubgroups, compSubgroups, chain.edges), [categories, intSubgroups, compSubgroups]);

  // Set of highlighted group keys (groups linked to the active expanded group)
  const highlightedGroups = useMemo(() => {
    if (!activeGroupKey) return new Set<string>();
    return groupLinks.get(activeGroupKey) ?? new Set<string>();
  }, [activeGroupKey, groupLinks]);

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
    const bg = isSelected ? "rgb(88, 86, 84)" : bright ? "rgb(40, 37, 34)" : "rgb(34, 31, 29)";
    const border = isSelected ? "rgb(100, 98, 96)" : bright ? "rgb(50, 46, 42)" : "rgb(42, 39, 37)";

    return (
      <div
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
        <p style={{ fontSize: 10, fontWeight: 600, color: isSelected ? "#fff" : bright ? "#f0ece4" : "#ece8e1", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</p>
      </div>
    );
  }

  // Group header
  function GroupHeader({ groupKey, name, count, status, highlighted, onClick }: { groupKey: string; name: string; count: number; status: string; highlighted: boolean; onClick: () => void }) {
    const statusColor = STATUS_COLORS[status] ?? "#444";
    return (
      <div
        onClick={onClick}
        style={{
          padding: "5px 8px",
          background: highlighted ? "rgb(42, 38, 35)" : "rgb(30, 28, 27)",
          border: highlighted ? "1px solid rgb(60, 56, 52)" : "1px solid rgb(42, 39, 37)",
          borderRadius: 3, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "background 0.2s, border-color 0.2s, opacity 0.2s",
          opacity: activeGroupKey && !highlighted && activeGroupKey !== groupKey ? 0.4 : 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: highlighted ? "#ece8e1" : "#d0c8bc" }}>{name}</span>
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
    const sortedKeys = columnGroupKeys.sort((a, b) => {
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
              <p style={{ fontSize: 7, color: "#706a60", margin: "0 0 4px 0", fontWeight: 500 }}>{groups[expandedGroup]?.name}</p>
              {groups[expandedGroup]?.nodes.map((n, i) => (
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

  // Simple column
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
    <div style={{ position: "relative", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 16, padding: "12px 0", overflow: "auto", minWidth: 0 }}>
        <GroupedColumn label="RAW MATERIALS" totalCount={63} groups={categories} expandedGroup={expandedRawCat} setExpandedGroup={setExpandedRawCat} columnGroupKeys={Object.keys(categories)} />
        <GroupedColumn label="INTERMEDIATES" totalCount={56} groups={intSubgroups} expandedGroup={expandedIntGroup} setExpandedGroup={setExpandedIntGroup} columnGroupKeys={Object.keys(intSubgroups)} />
        <GroupedColumn label="COMPONENTS" totalCount={58} groups={compSubgroups} expandedGroup={expandedCompGroup} setExpandedGroup={setExpandedCompGroup} columnGroupKeys={Object.keys(compSubgroups)} />
        <SimpleColumn layer={chain.layers[3]} />
        <SimpleColumn layer={chain.layers[4]} />
      </div>

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
