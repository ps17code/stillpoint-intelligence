"use client";
import React, { useState } from "react";
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
  onGroupClick?: (groupKey: string, groupName: string, overview: string, activity: string) => void;
}

export default function AISupplyTree({ onNodeClick, onGroupClick }: AISupplyTreeProps) {
  // Each column tracks which group is expanded (null = show all groups collapsed)
  const [expandedRawCat, setExpandedRawCat] = useState<string | null>(null);
  const [expandedIntGroup, setExpandedIntGroup] = useState<string | null>(null);
  const [expandedCompGroup, setExpandedCompGroup] = useState<string | null>(null);

  const categories = chain.rawMaterialCategories ?? {};
  const compSubgroups = chain.componentSubgroups ?? {};
  const intSubgroups = chain.intermediateSubgroups ?? {};

  function getGroupStatus(nodes: string[]): string {
    const statuses = nodes.map(n => uNodes[n]?.status ?? "tbd");
    if (statuses.includes("constrained")) return "constrained";
    if (statuses.includes("tightening")) return "tightening";
    if (statuses.includes("available") || statuses.includes("Active")) return "available";
    return "tbd";
  }

  // Node card
  function NCard({ name, bright }: { name: string; bright?: boolean }) {
    const node = uNodes[name];
    const statusColor = STATUS_COLORS[node?.status ?? "tbd"] ?? "#444";
    const bg = bright ? "rgb(40, 37, 34)" : "rgb(34, 31, 29)";
    const border = bright ? "rgb(50, 46, 42)" : "rgb(42, 39, 37)";

    return (
      <div
        onClick={() => onNodeClick?.(name)}
        style={{
          padding: "4px 6px 4px 12px",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 3,
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
          position: "relative" as const,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgb(48, 44, 40)"; e.currentTarget.style.borderColor = "rgb(60, 56, 52)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; }}
      >
        <div style={{ position: "absolute", left: 3, top: "50%", transform: "translateY(-50%)", width: 4, height: 4, borderRadius: "50%", background: statusColor }} />
        <p style={{ fontSize: 10, fontWeight: 600, color: bright ? "#f0ece4" : "#ece8e1", margin: 0, lineHeight: 1.2, whiteSpace: "nowrap", fontFamily: "'EB Garamond', Georgia, serif" }}>{name}</p>
      </div>
    );
  }

  // Collapsible group header
  function GroupHeader({ name, count, status, isExpanded, onClick }: { name: string; count: number; status: string; isExpanded: boolean; onClick: () => void }) {
    const statusColor = STATUS_COLORS[status] ?? "#444";
    return (
      <div
        onClick={onClick}
        style={{
          padding: "5px 8px",
          background: isExpanded ? "rgb(38, 35, 33)" : "rgb(30, 28, 27)",
          border: isExpanded ? "1px solid rgb(55, 50, 46)" : "1px solid rgb(42, 39, 37)",
          borderRadius: 3, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "background 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
          <span style={{ fontSize: 8, fontWeight: 600, color: "#d0c8bc" }}>{name}</span>
          <span style={{ fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>· {count}</span>
        </div>
        <span style={{ fontSize: 7, color: "#555", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
      </div>
    );
  }

  // Generic grouped column — when a group is clicked, only that group's nodes show
  function GroupedColumn({
    label,
    totalCount,
    groups,
    expandedGroup,
    setExpandedGroup,
  }: {
    label: string;
    totalCount: number;
    groups: Record<string, { name: string; description?: string; overview?: string; activity?: string; nodes: string[]; parent_subsystem?: string }>;
    expandedGroup: string | null;
    setExpandedGroup: (g: string | null) => void;
  }) {
    const subsystemOrder = ["compute", "memory_storage", "connectivity", "cooling", "power_distribution", "power_generation", "physical_structure"];

    // Sort groups by parent_subsystem order if present, then alphabetically
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const pa = groups[a].parent_subsystem;
      const pb = groups[b].parent_subsystem;
      if (pa && pb) {
        const ia = subsystemOrder.indexOf(pa);
        const ib = subsystemOrder.indexOf(pb);
        if (ia !== ib) return ia - ib;
      }
      if (pa && !pb) return -1;
      if (!pa && pb) return 1;
      return a.localeCompare(b);
    });

    return (
      <div style={{ minWidth: 165, maxWidth: 200, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 6, letterSpacing: "0.1em", color: "rgb(158, 156, 153)", textTransform: "uppercase" as const, margin: 0, fontFamily: "'Geist Mono', monospace" }}>
            {label} · {expandedGroup ? groups[expandedGroup]?.nodes.length ?? 0 : totalCount}
          </p>
          {expandedGroup && (
            <button onClick={() => setExpandedGroup(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 6, color: "#555", fontFamily: "'Geist Mono', monospace" }}>← back</button>
          )}
        </div>
        <div style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {expandedGroup ? (
            // Expanded: show only this group's nodes
            <>
              <p style={{ fontSize: 7, color: "#706a60", margin: "0 0 4px 0", fontWeight: 500 }}>{groups[expandedGroup]?.name}</p>
              {groups[expandedGroup]?.nodes.map(n => <NCard key={n} name={n} bright />)}
            </>
          ) : (
            // Collapsed: show all groups as headers
            sortedKeys.map(gk => {
              const g = groups[gk];
              if (!g || g.nodes.length === 0) return null;
              return (
                <GroupHeader
                  key={gk}
                  name={g.name}
                  count={g.nodes.length}
                  status={getGroupStatus(g.nodes)}
                  isExpanded={false}
                  onClick={() => { setExpandedGroup(gk); onGroupClick?.(gk, g.name, g.overview ?? "", g.activity ?? ""); }}
                />
              );
            })
          )}
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
    <div style={{ display: "flex", gap: 16, padding: "12px 0", overflow: "auto", minWidth: 0 }}>
      {/* Raw Materials — categories */}
      <GroupedColumn
        label="RAW MATERIALS"
        totalCount={63}
        groups={categories}
        expandedGroup={expandedRawCat}
        setExpandedGroup={setExpandedRawCat}
      />

      {/* Intermediates — subgroups */}
      <GroupedColumn
        label="INTERMEDIATES"
        totalCount={56}
        groups={intSubgroups}
        expandedGroup={expandedIntGroup}
        setExpandedGroup={setExpandedIntGroup}
      />

      {/* Components — subgroups */}
      <GroupedColumn
        label="COMPONENTS"
        totalCount={58}
        groups={compSubgroups}
        expandedGroup={expandedCompGroup}
        setExpandedGroup={setExpandedCompGroup}
      />

      {/* Subsystems */}
      <SimpleColumn layer={chain.layers[3]} />

      {/* End Use */}
      <SimpleColumn layer={chain.layers[4]} />
    </div>
  );
}
