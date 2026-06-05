"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import universalNodesJson from "@/data/universal-nodes.json";

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const accent = "#c87a4a";
const cardBg = "rgb(36, 32, 29)";
const lineColor = "rgba(255,255,255,0.18)";

type UNode = { name: string; country: string | null; descriptor_pill: string; quantity_pill: string; layer: string };
const U = universalNodesJson as unknown as Record<string, UNode>;

const COUNTRY_CODES: Record<string, string> = {
  "China": "cn", "USA": "us", "Belgium": "be", "Canada": "ca", "Russia": "ru", "DRC": "cd",
  "Japan": "jp", "Germany": "de", "France": "fr", "Italy": "it", "Netherlands": "nl",
};

type Cell = { name: string; group?: { code: string; reserves: string } };
type Layer = { label: string; stage: string; cta: string; nav: "germanium" | "fiber"; cells: Cell[] };

/* Columns map to layers of the Germanium → GeCl₄ → Fiber → AI DC chain.
   Only nodes whose output reaches the fiber market are included; vertically-integrated
   firms (Umicore, Yunnan Chihong) appear in each layer they operate in. */
const LAYERS: Layer[] = [
  {
    label: "GEOGRAPHIC SOURCE", stage: "Deposits / geologic sources", cta: "Germanium", nav: "germanium",
    cells: [
      { name: "China", group: { code: "cn", reserves: "~2,500t reserves" } },
      { name: "DRC", group: { code: "cd", reserves: "~700t reserves" } },
    ],
  },
  {
    label: "GERMANIUM", stage: "Refined germanium supply", cta: "Germanium", nav: "germanium",
    cells: [
      { name: "Umicore" }, { name: "Yunnan Chihong Refinery" }, { name: "Lincang Xinyuan Refinery" },
      { name: "Zhuzhou Smelter Group" }, { name: "Vital Materials" },
    ],
  },
  {
    label: "GeCl₄", stage: "Fiber-grade GeCl₄ suppliers", cta: "GeCl₄", nav: "germanium",
    cells: [{ name: "Umicore" }, { name: "Yunnan Chihong Refinery" }, { name: "Chinese State GeCl4 Plants" }],
  },
  {
    label: "FIBER OPTIC CABLE", stage: "Fiber / preform makers", cta: "Fiber Optic Cable", nav: "fiber",
    cells: [{ name: "Corning" }, { name: "Prysmian" }, { name: "YOFC" }, { name: "Fujikura" }, { name: "Sumitomo Electric" }, { name: "Shin-Etsu" }],
  },
  {
    label: "AI DC CONNECTIVITY", stage: "Fiber buyers (hyperscalers)", cta: "Fiber Optic Cable", nav: "fiber",
    cells: [{ name: "Meta" }, { name: "Microsoft" }, { name: "Google" }, { name: "Amazon" }],
  },
];

const cellId = (li: number, name: string) => `${li}:${name}`;

/* Directed edges between cells (fromLayer:name → toLayer:name) */
const EDGES: [string, string][] = [
  // Geographic source → germanium refiners
  ["0:China", "1:Lincang Xinyuan Refinery"], ["0:China", "1:Zhuzhou Smelter Group"], ["0:China", "1:Vital Materials"], ["0:China", "1:Yunnan Chihong Refinery"],
  ["0:DRC", "1:Umicore"],
  // Germanium → GeCl₄ (vertically-integrated firms carry through)
  ["1:Umicore", "2:Umicore"], ["1:Yunnan Chihong Refinery", "2:Yunnan Chihong Refinery"],
  ["1:Lincang Xinyuan Refinery", "2:Chinese State GeCl4 Plants"], ["1:Zhuzhou Smelter Group", "2:Chinese State GeCl4 Plants"], ["1:Vital Materials", "2:Chinese State GeCl4 Plants"],
  // GeCl₄ → fiber
  ["2:Umicore", "3:Corning"], ["2:Umicore", "3:Prysmian"], ["2:Umicore", "3:Fujikura"], ["2:Umicore", "3:Shin-Etsu"], ["2:Umicore", "3:Sumitomo Electric"],
  ["2:Yunnan Chihong Refinery", "3:Sumitomo Electric"], ["2:Yunnan Chihong Refinery", "3:Shin-Etsu"], ["2:Yunnan Chihong Refinery", "3:YOFC"],
  ["2:Chinese State GeCl4 Plants", "3:YOFC"],
  // Fiber → buyers
  ["3:Corning", "4:Meta"], ["3:Corning", "4:Microsoft"], ["3:Prysmian", "4:Microsoft"], ["3:Prysmian", "4:Google"],
  ["3:Fujikura", "4:Amazon"], ["3:Sumitomo Electric", "4:Google"], ["3:Shin-Etsu", "4:Amazon"], ["3:YOFC", "4:Meta"],
];

function computeHighlight(active: string | null): Set<string> | null {
  if (!active) return null;
  const fwd = new Map<string, string[]>();
  const rev = new Map<string, string[]>();
  for (const [a, b] of EDGES) {
    (fwd.get(a) ?? fwd.set(a, []).get(a)!).push(b);
    (rev.get(b) ?? rev.set(b, []).get(b)!).push(a);
  }
  const set = new Set<string>([active]);
  const walk = (adj: Map<string, string[]>) => {
    const stack = [active];
    while (stack.length) { const cur = stack.pop()!; (adj.get(cur) ?? []).forEach(n => { if (!set.has(n)) { set.add(n); stack.push(n); } }); }
  };
  walk(fwd); walk(rev);
  return set;
}

function NodeCard({ cell, highlighted, dimmed, active, nodeRef, onHover, onLeave, onClick }: {
  cell: Cell; highlighted: boolean; dimmed: boolean; active: boolean;
  nodeRef: React.Ref<HTMLDivElement>; onHover: () => void; onLeave: () => void; onClick: () => void;
}) {
  const lit = highlighted || active;
  const isGroup = !!cell.group;
  const n = U[cell.name];
  const country = isGroup ? cell.name : (n?.country ?? "");
  const code = isGroup ? cell.group!.code : (COUNTRY_CODES[country] ?? "");
  const output = isGroup ? cell.group!.reserves : (n?.quantity_pill || "");
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        padding: "5px 8px", borderRadius: 4, width: "100%", boxSizing: "border-box", cursor: "pointer",
        background: active ? "rgba(200, 122, 74, 0.18)" : lit ? "rgba(200, 122, 74, 0.1)" : isGroup ? "rgb(42, 38, 34)" : cardBg,
        border: active ? `1px solid ${accent}` : lit ? "1px solid rgba(200, 122, 74, 0.5)" : isGroup ? "1px solid rgb(60, 55, 48)" : "1px solid rgb(45, 41, 39)",
        opacity: dimmed ? 0.3 : 1, transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
      }}
    >
      {isGroup ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {code && <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" style={{ width: 11, height: 8, borderRadius: 1, opacity: 0.8 }} />}
            <p style={{ fontSize: 10, fontWeight: 600, color: lit ? warmWhite : "rgb(200, 192, 180)", margin: 0, lineHeight: 1.2, fontFamily: SERIF, whiteSpace: "nowrap" }}>{cell.name}</p>
          </div>
          {output && <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", margin: "2px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{output}</p>}
        </>
      ) : (
        <>
          <p style={{ fontSize: 10, fontWeight: 600, color: lit ? warmWhite : "rgb(160, 152, 136)", margin: 0, lineHeight: 1.2, fontFamily: SERIF, whiteSpace: "nowrap" }}>{cell.name}</p>
          {country && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
              {code && <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" style={{ width: 9, height: 6, borderRadius: 1, opacity: 0.7 }} />}
              <span style={{ fontSize: 7, color: "#706a60", fontFamily: MONO, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{country}</span>
            </div>
          )}
          {output && <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", margin: "2px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{output}</p>}
        </>
      )}
    </div>
  );
}

type Edge = { fromRef: React.RefObject<HTMLDivElement | null>; toRef: React.RefObject<HTMLDivElement | null>; from: string; to: string };

function EdgeLines({ edges, containerRef, highlightSet }: { edges: Edge[]; containerRef: React.RefObject<HTMLDivElement | null>; highlightSet: Set<string> | null }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; from: string; to: string }[]>([]);
  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const next: typeof lines = [];
    for (const e of edges) {
      const f = e.fromRef.current, t = e.toRef.current;
      if (!f || !t) continue;
      const fb = f.getBoundingClientRect(), tb = t.getBoundingClientRect();
      next.push({ x1: fb.right - box.left, y1: fb.top + fb.height / 2 - box.top, x2: tb.left - box.left, y2: tb.top + tb.height / 2 - box.top, from: e.from, to: e.to });
    }
    setLines(next);
  }, [edges, containerRef]);
  useEffect(() => { measure(); const t = setTimeout(measure, 120); return () => clearTimeout(t); }, [measure]);
  if (lines.length === 0) return null;
  const activeMode = highlightSet != null;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width="100%" height="100%">
      {lines.map((l, i) => {
        const midX = (l.x1 + l.x2) / 2;
        const lit = activeMode && highlightSet!.has(l.from) && highlightSet!.has(l.to);
        const stroke = activeMode ? (lit ? accent : "rgba(200,200,200,0.05)") : lineColor;
        return (
          <g key={i}>
            <circle cx={l.x1} cy={l.y1} r="1.5" fill={stroke} />
            <path d={`M ${l.x1} ${l.y1} C ${midX} ${l.y1}, ${midX} ${l.y2}, ${l.x2} ${l.y2}`} fill="none" stroke={stroke} strokeWidth={lit ? 1.6 : 0.8} strokeDasharray={lit ? undefined : "4 3"} />
          </g>
        );
      })}
    </svg>
  );
}

export default function ChainSupplyTree({ onViewLayer }: { onViewLayer?: (nav: "germanium" | "fiber") => void }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const active = hovered ?? selected;
  const highlightSet = useMemo(() => computeHighlight(active), [active]);

  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const getRef = (id: string) => {
    if (!refs.current[id]) refs.current[id] = React.createRef<HTMLDivElement>();
    return refs.current[id];
  };

  const edges: Edge[] = EDGES.map(([from, to]) => ({ fromRef: getRef(from), toRef: getRef(to), from, to }));

  return (
    <div style={{ background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", marginTop: 10, animation: "fadeSlideDown 0.3s ease-out" }}>
      <div style={{ padding: "10px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: MONO }}>Company &amp; Asset Map</p>
        <span
          onClick={() => setCollapsed(v => !v)}
          style={{ fontSize: 9, color: "#c87a4a", cursor: "pointer", transition: "color 0.15s", fontFamily: MONO, display: "flex", alignItems: "center", gap: 4 }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e09060"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#c87a4a"; }}
        >
          {collapsed ? "Expand" : "Collapse"}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M2 4L5 7L8 4" /></svg>
        </span>
      </div>
      {!collapsed && <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 15px" }} />}
      <div ref={treeRef} onClick={() => setSelected(null)} style={{ position: "relative", display: collapsed ? "none" : "flex", gap: 36, overflowX: "auto", padding: "14px 15px 16px" }}>
        <EdgeLines edges={edges} containerRef={treeRef} highlightSet={highlightSet} />
        {LAYERS.map((layer, li) => (
          <div key={layer.label} style={{ flex: "0 0 auto", width: 150, display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 2 }}>
              <p style={{ fontSize: 7, color: "#706a60", margin: 0, fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{layer.label}</p>
              <p style={{ fontSize: 7, color: "#4a4540", margin: "1px 0 0 0", fontFamily: MONO, letterSpacing: "0.02em" }}>{layer.stage}</p>
            </div>
            {layer.cells.filter(c => c.group || U[c.name]).map(c => {
              const id = cellId(li, c.name);
              const inSet = highlightSet?.has(id) ?? false;
              return (
                <NodeCard
                  key={id}
                  cell={c}
                  highlighted={highlightSet != null && inSet}
                  dimmed={highlightSet != null && !inSet}
                  active={selected === id}
                  nodeRef={getRef(id)}
                  onHover={() => setHovered(id)}
                  onLeave={() => setHovered(null)}
                  onClick={() => setSelected(prev => prev === id ? null : id)}
                />
              );
            })}
            <button
              onClick={(e) => { e.stopPropagation(); onViewLayer?.(layer.nav); }}
              style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", color: "rgb(182, 156, 140)", fontSize: 8, fontFamily: MONO, letterSpacing: "0.03em", textAlign: "left", padding: "2px 0", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.color = warmWhite; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgb(182, 156, 140)"; }}
            >
              View {layer.cta} Supply Chain →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
