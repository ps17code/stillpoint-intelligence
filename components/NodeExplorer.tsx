"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import graphJson from "@/data/node-v2/graph.json";

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const accent = "#c87a4a";
const cardBg = "rgb(36, 32, 29)";
const lineColor = "rgba(255,255,255,0.18)";

const COUNTRY_CODES: Record<string, string> = {
  "China": "cn", "USA": "us", "United States": "us", "Belgium": "be", "Canada": "ca", "Russia": "ru",
  "DRC": "cd", "Democratic Republic of Congo": "cd", "Japan": "jp", "Germany": "de", "France": "fr", "Italy": "it",
};

type AnyRec = Record<string, unknown>;
const graph = graphJson as unknown as { classes: Record<string, AnyRec>; entities: Record<string, AnyRec>; companies: Record<string, AnyRec> };
const classes = graph.classes;
const entities = graph.entities ?? {};

type Card = { id: string; title: string; sub?: string; flag?: string; output?: string; clickable?: boolean; muted?: boolean };
type Column = { label: string; items: Card[] };
type Edge = { from: string; to: string };

/* directed dependency highlight (ancestors + descendants) */
function computeHighlight(active: string | null, edges: Edge[]): Set<string> | null {
  if (!active) return null;
  const fwd = new Map<string, string[]>();
  const rev = new Map<string, string[]>();
  for (const e of edges) {
    (fwd.get(e.from) ?? fwd.set(e.from, []).get(e.from)!).push(e.to);
    (rev.get(e.to) ?? rev.set(e.to, []).get(e.to)!).push(e.from);
  }
  const set = new Set<string>([active]);
  const walk = (adj: Map<string, string[]>) => {
    const st = [active];
    while (st.length) { const c = st.pop()!; (adj.get(c) ?? []).forEach(n => { if (!set.has(n)) { set.add(n); st.push(n); } }); }
  };
  walk(fwd); walk(rev);
  return set;
}

function NodeCard({ card, highlighted, dimmed, nodeRef, onHover, onLeave, onClick }: {
  card: Card; highlighted: boolean; dimmed: boolean;
  nodeRef: React.Ref<HTMLDivElement>; onHover: () => void; onLeave: () => void; onClick?: () => void;
}) {
  const code = card.flag ? (COUNTRY_CODES[card.flag] ?? "") : "";
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      style={{
        padding: "6px 9px", borderRadius: 4, width: "100%", boxSizing: "border-box",
        cursor: card.clickable ? "pointer" : "default",
        background: highlighted ? "rgba(200, 122, 74, 0.1)" : card.muted ? "rgb(30,28,26)" : cardBg,
        border: highlighted ? "1px solid rgba(200, 122, 74, 0.5)" : "1px solid rgb(45, 41, 39)",
        opacity: dimmed ? 0.3 : 1, transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: highlighted ? warmWhite : "rgb(180, 172, 160)", margin: 0, lineHeight: 1.2, fontFamily: SERIF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.title}</p>
        {card.clickable && <span style={{ fontSize: 8, color: "#666", flexShrink: 0 }}>→</span>}
      </div>
      {(card.flag || card.sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          {code && <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" style={{ width: 9, height: 6, borderRadius: 1, opacity: 0.7 }} />}
          {card.sub && <span style={{ fontSize: 7, color: "#706a60", fontFamily: MONO, letterSpacing: "0.03em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{card.sub}</span>}
        </div>
      )}
      {card.output && <p style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", margin: "3px 0 0 0", fontFamily: MONO, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{card.output}</p>}
    </div>
  );
}

function EdgeLines({ edgeRefs, containerRef, highlightSet }: { edgeRefs: { from: string; to: string; fromRef: React.RefObject<HTMLDivElement | null>; toRef: React.RefObject<HTMLDivElement | null> }[]; containerRef: React.RefObject<HTMLDivElement | null>; highlightSet: Set<string> | null }) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; from: string; to: string }[]>([]);
  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    const next: typeof lines = [];
    for (const e of edgeRefs) {
      const f = e.fromRef.current, t = e.toRef.current;
      if (!f || !t) continue;
      const fb = f.getBoundingClientRect(), tb = t.getBoundingClientRect();
      next.push({ x1: fb.right - box.left, y1: fb.top + fb.height / 2 - box.top, x2: tb.left - box.left, y2: tb.top + tb.height / 2 - box.top, from: e.from, to: e.to });
    }
    setLines(next);
  }, [edgeRefs, containerRef]);
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

/* shared column renderer */
function TreeCanvas({ columns, edges, onCardClick }: { columns: Column[]; edges: Edge[]; onCardClick?: (id: string) => void }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered;
  const highlightSet = useMemo(() => computeHighlight(active, edges), [active, edges]);
  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const getRef = (id: string) => (refs.current[id] ??= React.createRef<HTMLDivElement>());
  const edgeRefs = edges.map(e => ({ ...e, fromRef: getRef(e.from), toRef: getRef(e.to) }));

  return (
    <div ref={treeRef} style={{ position: "relative", display: "flex", gap: 44, overflowX: "auto", padding: "8px 4px 16px" }}>
      <EdgeLines edgeRefs={edgeRefs} containerRef={treeRef} highlightSet={highlightSet} />
      {columns.map(col => (
        <div key={col.label} style={{ flex: "0 0 auto", width: 168, display: "flex", flexDirection: "column", gap: 7, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 7, color: "#706a60", margin: "0 0 3px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{col.label}</p>
          {col.items.length === 0 ? <p style={{ fontSize: 9, color: "#555", margin: 0, fontStyle: "italic" }}>—</p> : col.items.map(card => {
            const inSet = highlightSet?.has(card.id) ?? false;
            return (
              <NodeCard
                key={card.id}
                card={card}
                highlighted={highlightSet != null && inSet}
                dimmed={highlightSet != null && !inSet}
                nodeRef={getRef(card.id)}
                onHover={() => setHovered(card.id)}
                onLeave={() => setHovered(null)}
                onClick={card.clickable && onCardClick ? () => onCardClick(card.id) : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function NodeExplorer({ onBack }: { onBack: () => void }) {
  const [drillClass, setDrillClass] = useState<string | null>(null);

  // ── class graph (default) ──
  const classView = useMemo(() => {
    const LAYERS: [string, string][] = [["rawmat", "Raw Material"], ["intermediate", "Intermediate"], ["component", "Component"]];
    const columns: Column[] = LAYERS.map(([t, label]) => ({
      label,
      items: Object.values(classes).filter(c => c.class_type === t).map(c => {
        const ec = (c.entities as string[] | undefined) ?? [];
        let output = "";
        if (c.class_type === "rawmat") {
          const ap = (c.supply as AnyRec | undefined)?.["annual_production"] as AnyRec | undefined;
          if (ap?.value) output = `${ap.value} ${ap.unit ?? ""}`.trim();
        }
        return { id: c.class_id as string, title: c.name as string, sub: c.class_type as string, output, clickable: ec.length > 0 };
      }),
    }));
    const edges: Edge[] = Object.values(classes).flatMap(c => ((c.output_classes as string[] | undefined) ?? []).filter(to => classes[to]).map(to => ({ from: c.class_id as string, to })));
    return { columns, edges };
  }, []);

  // ── entity tree for a drilled class ──
  const entityView = useMemo(() => {
    if (!drillClass) return null;
    const cls = classes[drillClass];
    const ids = (cls?.entities as string[] | undefined) ?? [];
    const ents = ids.map(id => entities[id]).filter(Boolean) as AnyRec[];
    const LAYERS: [string, string][] = [["deposit", "Source / Deposit"], ["mine", "Mine"], ["refinery", "Refiner"]];
    const columns: Column[] = LAYERS.map(([t, label]) => ({
      label,
      items: ents.filter(e => e.node_type === t).map(e => {
        const prod = ((e.produces as AnyRec[] | undefined) ?? [])[0];
        const amt = prod?.amount as AnyRec | undefined;
        const output = prod ? `${prod.form}${amt?.value ? ` · ${amt.value} ${amt.unit ?? ""}` : ""}` : "";
        return { id: e.node_id as string, title: e.name as string, sub: e.status as string, flag: e.country as string, output };
      }),
    }));
    // boundary / market targets from refinery outputs that cross to a class
    const boundary: Card[] = [];
    const seen = new Set<string>();
    ents.forEach(e => ((e.outputs as AnyRec[] | undefined) ?? []).forEach(o => {
      if (o.to_type === "class" && !seen.has(o.to_node as string)) {
        seen.add(o.to_node as string);
        boundary.push({ id: o.to_node as string, title: (classes[o.to_node as string]?.name as string) ?? (o.form as string) ?? (o.to_node as string), sub: "market", muted: true });
      }
    }));
    if (boundary.length) columns.push({ label: "Output (market)", items: boundary });
    const edges: Edge[] = ents.flatMap(e => ((e.outputs as AnyRec[] | undefined) ?? []).map(o => ({ from: e.node_id as string, to: o.to_node as string })));
    return { columns, edges, name: cls?.name as string, count: ents.length };
  }, [drillClass]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#161414", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: "16px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => (drillClass ? setDrillClass(null) : onBack())}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontFamily: MONO, fontSize: 10 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = warmWhite; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            {drillClass ? "All classes" : "Back"}
          </button>
          <div>
            <p style={{ fontSize: 8, color: "#666", margin: "0 0 2px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Node Explorer{drillClass ? " · Supply Tree" : ""}</p>
            <h2 style={{ fontSize: 18, fontWeight: 400, color: warmWhite, margin: 0 }}>{drillClass ? entityView?.name : "Class Nodes"}</h2>
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0 0" }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", padding: "16px 24px 24px" }}>
        {!drillClass && (
          <TreeCanvas columns={classView.columns} edges={classView.edges} onCardClick={(id) => { if (((classes[id]?.entities as string[] | undefined) ?? []).length) setDrillClass(id); }} />
        )}
        {drillClass && entityView && (
          entityView.count === 0
            ? <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "30px 0", fontFamily: "Inter, sans-serif" }}>No entity nodes generated for this class yet — they will appear here as the engine runs.</p>
            : <TreeCanvas columns={entityView.columns} edges={entityView.edges} />
        )}
      </div>
    </div>
  );
}
