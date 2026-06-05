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

/* Each column maps to a layer of the Germanium → GeCl₄ → Fiber → AI DC chain.
   Companies are placed at their chain-critical stage (vertically-integrated refiners
   like Umicore / Yunnan Chihong sit at the GeCl₄ chokepoint). */
const LAYERS: { label: string; stage: string; nodes: string[] }[] = [
  { label: "GERMANIUM", stage: "Refined germanium supply", nodes: ["5N Plus", "PPM Pure Metals", "Lincang Xinyuan Refinery", "Zhuzhou Smelter Group", "Vital Materials"] },
  { label: "GeCl₄", stage: "Fiber-grade GeCl₄ suppliers", nodes: ["Umicore", "Yunnan Chihong Refinery", "Chinese State GeCl4 Plants"] },
  { label: "FIBER OPTIC CABLE", stage: "Fiber / preform makers", nodes: ["Corning", "Prysmian", "YOFC", "Fujikura", "Sumitomo Electric", "Shin-Etsu"] },
  { label: "AI DC CONNECTIVITY", stage: "Fiber buyers (hyperscalers)", nodes: ["Meta", "Microsoft", "Google", "Amazon"] },
];

const EDGES: [string, string][] = [
  // Germanium → GeCl₄
  ["5N Plus", "Umicore"], ["PPM Pure Metals", "Umicore"],
  ["Lincang Xinyuan Refinery", "Chinese State GeCl4 Plants"], ["Zhuzhou Smelter Group", "Chinese State GeCl4 Plants"],
  ["Vital Materials", "Chinese State GeCl4 Plants"], ["Lincang Xinyuan Refinery", "Yunnan Chihong Refinery"],
  // GeCl₄ → Fiber
  ["Umicore", "Corning"], ["Umicore", "Prysmian"], ["Umicore", "Fujikura"], ["Umicore", "Shin-Etsu"], ["Umicore", "Sumitomo Electric"],
  ["Yunnan Chihong Refinery", "Sumitomo Electric"], ["Yunnan Chihong Refinery", "Shin-Etsu"], ["Yunnan Chihong Refinery", "YOFC"],
  ["Chinese State GeCl4 Plants", "YOFC"],
  // Fiber → buyers
  ["Corning", "Meta"], ["Corning", "Microsoft"], ["Prysmian", "Microsoft"], ["Prysmian", "Google"],
  ["Fujikura", "Amazon"], ["Sumitomo Electric", "Google"], ["Shin-Etsu", "Amazon"], ["YOFC", "Meta"],
];

/* Directed dependency chain for the active node — ancestors + descendants */
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
    while (stack.length) {
      const cur = stack.pop()!;
      (adj.get(cur) ?? []).forEach(n => { if (!set.has(n)) { set.add(n); stack.push(n); } });
    }
  };
  walk(fwd); walk(rev);
  return set;
}

function NodeCard({ name, highlighted, dimmed, active, nodeRef, onHover, onLeave, onClick }: {
  name: string; highlighted: boolean; dimmed: boolean; active: boolean;
  nodeRef: React.Ref<HTMLDivElement>;
  onHover: () => void; onLeave: () => void; onClick: () => void;
}) {
  const n = U[name];
  const country = n?.country ?? "";
  const code = COUNTRY_CODES[country] ?? "";
  const output = n?.quantity_pill || "";
  const lit = highlighted || active;
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        padding: "5px 8px", borderRadius: 4, width: "100%", boxSizing: "border-box", cursor: "pointer",
        background: active ? "rgba(200, 122, 74, 0.18)" : lit ? "rgba(200, 122, 74, 0.1)" : cardBg,
        border: active ? `1px solid ${accent}` : lit ? "1px solid rgba(200, 122, 74, 0.5)" : "1px solid rgb(45, 41, 39)",
        opacity: dimmed ? 0.3 : 1,
        transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 600, color: lit ? warmWhite : "rgb(160, 152, 136)", margin: 0, lineHeight: 1.2, fontFamily: SERIF, whiteSpace: "nowrap" }}>{name}</p>
      {country && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
          {code && <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" style={{ width: 9, height: 6, borderRadius: 1, opacity: 0.7 }} />}
          <span style={{ fontSize: 7, color: "#706a60", fontFamily: MONO, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{country}</span>
        </div>
      )}
      {output && <p style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", margin: "2px 0 0 0", fontFamily: MONO, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{output}</p>}
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

export default function ChainSupplyTree() {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;
  const highlightSet = useMemo(() => computeHighlight(active), [active]);

  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const getRef = (name: string) => {
    if (!refs.current[name]) refs.current[name] = React.createRef<HTMLDivElement>();
    return refs.current[name];
  };

  const edges: Edge[] = EDGES.map(([from, to]) => ({ fromRef: getRef(from), toRef: getRef(to), from, to }));

  return (
    <div style={{ background: "rgb(27, 27, 27)", border: "0.1px solid rgb(36, 36, 36)", borderRadius: 5, overflow: "hidden", marginTop: 10, animation: "fadeSlideDown 0.3s ease-out" }}>
      <div style={{ padding: "10px 15px" }}>
        <p style={{ fontSize: 10, color: warmWhite, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, fontFamily: MONO }}>Supply Tree</p>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 15px" }} />
      <div ref={treeRef} onClick={() => setSelected(null)} style={{ position: "relative", display: "flex", gap: 36, overflowX: "auto", padding: "14px 15px 16px" }}>
        <EdgeLines edges={edges} containerRef={treeRef} highlightSet={highlightSet} />
        {LAYERS.map(layer => (
          <div key={layer.label} style={{ flex: "0 0 auto", width: 150, display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 1 }}>
            <div style={{ marginBottom: 2 }}>
              <p style={{ fontSize: 7, color: "#706a60", margin: 0, fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{layer.label}</p>
              <p style={{ fontSize: 7, color: "#4a4540", margin: "1px 0 0 0", fontFamily: MONO, letterSpacing: "0.02em" }}>{layer.stage}</p>
            </div>
            {layer.nodes.filter(name => U[name]).map(name => {
              const inSet = highlightSet?.has(name) ?? false;
              return (
                <NodeCard
                  key={name}
                  name={name}
                  highlighted={highlightSet != null && inSet}
                  dimmed={highlightSet != null && !inSet}
                  active={selected === name}
                  nodeRef={getRef(name)}
                  onHover={() => setHovered(name)}
                  onLeave={() => setHovered(null)}
                  onClick={() => setSelected(prev => prev === name ? null : name)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
