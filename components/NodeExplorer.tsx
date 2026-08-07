"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { lookupNode, AVAILABLE_NODES, type LoadedNode, type EntityNode, type EntityGraph } from "@/lib/explorerRegistry";

type CollapsedDetail = {
  id: string; group_id: string; group_name: string; entity_class: string; entity_type: string;
  column: string; input_forms: string[]; output_forms: string[]; route_ids: string[];
  participation_count: number; member_count: number; role: string | null;
};

const MONO = "'Geist Mono', monospace";
const SERIF = "'EB Garamond', Georgia, serif";
const warmWhite = "#ece8e1";
const accent = "#c87a4a";
const cardBg = "rgb(36, 32, 29)";
const lineColor = "rgba(255,255,255,0.18)";

type Card = { id: string; title: string; sub?: string; clickable?: boolean; muted?: boolean; featured?: boolean };
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
  const feat = card.featured;
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      style={{
        padding: "7px 10px", borderRadius: 4, width: "100%", boxSizing: "border-box",
        cursor: card.clickable ? "pointer" : "default",
        background: feat ? "rgba(200, 122, 74, 0.14)" : highlighted ? "rgba(200, 122, 74, 0.1)" : card.muted ? "rgb(28,26,24)" : cardBg,
        border: feat ? `1px solid ${accent}` : highlighted ? "1px solid rgba(200, 122, 74, 0.5)" : "1px solid rgb(45, 41, 39)",
        opacity: dimmed ? 0.32 : 1, transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: feat || highlighted ? warmWhite : "rgb(184, 176, 164)", margin: 0, lineHeight: 1.25, fontFamily: SERIF, whiteSpace: "normal" }}>{card.title}</p>
        {card.clickable && <span style={{ fontSize: 8, color: "#666", flexShrink: 0 }}>→</span>}
      </div>
      {card.sub && <span style={{ display: "block", marginTop: 3, fontSize: 7.5, color: feat ? accent : "#807869", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>{card.sub}</span>}
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
  useEffect(() => {
    measure();
    const t = setTimeout(measure, 120);
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure, containerRef]);
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
function TreeCanvas({ columns, edges, onCardClick, selected, colWidth = 172, gap = 46, fill = false }: { columns: Column[]; edges: Edge[]; onCardClick?: (id: string) => void; selected?: string | null; colWidth?: number; gap?: number; fill?: boolean }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected ?? null;
  const highlightSet = useMemo(() => computeHighlight(active, edges), [active, edges]);
  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});
  const getRef = (id: string) => (refs.current[id] ??= React.createRef<HTMLDivElement>());
  const edgeRefs = edges.map(e => ({ ...e, fromRef: getRef(e.from), toRef: getRef(e.to) }));
  const colStyle: React.CSSProperties = fill
    ? { flex: "1 1 0", minWidth: 108, maxWidth: 210 }
    : { flex: "0 0 auto", width: colWidth };

  return (
    <div ref={treeRef} style={{ position: "relative", display: "flex", gap: fill ? Math.min(gap, 32) : gap, overflowX: "auto", padding: "8px 4px 16px", minHeight: "100%", width: fill ? "100%" : undefined }}>
      <EdgeLines edgeRefs={edgeRefs} containerRef={treeRef} highlightSet={highlightSet} />
      {columns.map(col => (
        <div key={col.label} style={{ ...colStyle, display: "flex", flexDirection: "column", gap: 9, position: "relative", zIndex: 1, justifyContent: "center" }}>
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

type View = "empty" | "class" | "supply" | "entity";

export default function NodeExplorer({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>("empty");
  const [loaded, setLoaded] = useState<LoadedNode | null>(null);
  const [selId, setSelId] = useState<string | null>(null);

  // terminal
  const [input, setInput] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [log]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setInput("");
    const found = lookupNode(v);
    if (found) {
      setLoaded(found); setView("class"); setSelId(null);
      setLog(l => [...l, `▶ search "${v}"`, `✓ found ${found.name} — loading class graph (${found.classGraph.downstream.length} downstream class nodes)`]);
    } else {
      setLog(l => [...l, `▶ search "${v}"`, `✗ node not found in registry. Available: ${AVAILABLE_NODES.join(", ")}`]);
    }
  };

  // ── class graph view ──
  const classView = useMemo(() => {
    if (!loaded) return null;
    const g = loaded.classGraph;
    const columns: Column[] = [
      { label: "Raw Material", items: [{ id: g.node.id, title: g.node.name, sub: g.node.class_type, clickable: true, featured: true }] },
      { label: "Intermediate", items: g.downstream.map(d => ({ id: d.id, title: d.name, sub: d.class_type, clickable: false })) },
    ];
    const edges: Edge[] = g.downstream.map(d => ({ from: g.node.id, to: d.id }));
    return { columns, edges, rootId: g.node.id };
  }, [loaded]);

  // ── supply chain graph view (collapsed by canonical Physical Entity Node Group) ──
  const supplyView = useMemo(() => {
    if (!loaded) return null;
    const sg = loaded.supplyGraph;

    // collapse every map node into one visual node per canonical group_id
    const detail: Record<string, CollapsedDetail> = {};
    const mapNodeToCollapse: Record<string, string> = {};
    for (const n of sg.map_nodes) {
      const id = n.group_id; // one group → one column, so group_id is a stable collapse key
      mapNodeToCollapse[n.map_node_id] = id;
      const d = (detail[id] ??= {
        id, group_id: n.group_id, group_name: n.group_name, entity_class: n.entity_class, entity_type: n.entity_type,
        column: n.column, input_forms: [], output_forms: [], route_ids: [], participation_count: 0, member_count: 0, role: null,
      });
      for (const f of n.input_forms) if (!d.input_forms.includes(f)) d.input_forms.push(f);
      for (const f of n.output_forms) if (!d.output_forms.includes(f)) d.output_forms.push(f);
      for (const r of n.route_ids) if (!d.route_ids.includes(r)) d.route_ids.push(r);
      d.participation_count += n.route_participation_ids.length;
      d.member_count += 1;
    }
    // ending-boundary (output form) nodes stay separate
    for (const n of sg.ending_boundary_nodes) mapNodeToCollapse[n.map_node_id] = n.map_node_id;

    // remap + dedupe edges onto collapsed ids
    const seen = new Set<string>();
    const edges: Edge[] = [];
    const inDeg: Record<string, number> = {}, outDeg: Record<string, number> = {};
    for (const e of sg.edges) {
      const from = mapNodeToCollapse[e.from] ?? e.from;
      const to = mapNodeToCollapse[e.to] ?? e.to;
      const key = `${from}__${to}`;
      if (from === to || seen.has(key)) continue;
      seen.add(key);
      edges.push({ from, to });
      outDeg[from] = (outDeg[from] || 0) + 1;
      inDeg[to] = (inDeg[to] || 0) + 1;
    }
    // graph role from collapsed degrees
    for (const d of Object.values(detail)) {
      if ((inDeg[d.id] || 0) > 1) d.role = "Convergence point";
      else if ((outDeg[d.id] || 0) > 1) d.role = "Branch point";
    }

    const byCol: Record<string, Card[]> = {};
    for (const d of Object.values(detail)) {
      (byCol[d.column] ??= []).push({ id: d.id, title: d.group_name, sub: d.entity_class, clickable: true });
    }
    for (const n of sg.ending_boundary_nodes) {
      (byCol[n.column] ??= []).push({ id: n.map_node_id, title: n.form, sub: "ending output form", clickable: false, muted: true });
    }
    const columns: Column[] = sg.columns.map(c => ({ label: c.label, items: byCol[c.key] ?? [] }));
    return { columns, edges, detail };
  }, [loaded]);

  const selectedDetail: CollapsedDetail | null = useMemo(() => {
    if (view !== "supply" || !supplyView || !selId) return null;
    return supplyView.detail[selId] ?? null;
  }, [view, supplyView, selId]);

  // ── entity graph view (real-world physical entities) ──
  const entityView = useMemo(() => {
    if (!loaded) return null;
    const eg = loaded.entityGraph;
    const byCol: Record<string, Card[]> = {};
    for (const e of eg.entities) {
      (byCol[e.column] ??= []).push({ id: e.id, title: e.name, sub: e.country, clickable: true, muted: e.status === "Inactive" });
    }
    const columns: Column[] = eg.columns.map(c => ({ label: c.label, items: byCol[c.key] ?? [] }));
    const edges: Edge[] = eg.connections.map(c => ({ from: c.from, to: c.to }));
    return { columns, edges };
  }, [loaded]);

  const selectedEntity: EntityNode | null = useMemo(() => {
    if (view !== "entity" || !loaded || !selId) return null;
    return loaded.entityGraph.entities.find(e => e.id === selId) ?? null;
  }, [view, loaded, selId]);

  const headerKicker = view === "empty" ? "Node Explorer" : view === "class" ? "Node Explorer · Class Graph" : view === "supply" ? "Node Explorer · Supply Chain Graph" : "Node Explorer · Entity Graph";
  const headerTitle = view === "empty" ? "Search a node" : view === "class" ? `${loaded?.name}` : view === "supply" ? `${loaded?.name} — Supply Chain` : `${loaded?.name} — Entities`;
  const backLabel = view === "entity" ? "Supply chain graph" : view === "supply" ? "Class graph" : view === "class" ? "Clear" : "Back";
  const onBackClick = () => {
    if (view === "entity") { setView("supply"); setSelId(null); }
    else if (view === "supply") { setView("class"); setSelId(null); }
    else if (view === "class") { setView("empty"); setLoaded(null); setSelId(null); }
    else onBack();
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#161414", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: "16px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBackClick}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontFamily: MONO, fontSize: 10 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = warmWhite; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            {backLabel}
          </button>
          <div>
            <p style={{ fontSize: 8, color: "#666", margin: "0 0 2px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{headerKicker}</p>
            <h2 style={{ fontSize: 18, fontWeight: 400, color: warmWhite, margin: 0 }}>{headerTitle}</h2>
          </div>
          {view === "class" && (
            <span style={{ marginLeft: 8, fontSize: 9.5, color: "#6f695f", fontFamily: MONO }}>click the {loaded?.name} node → supply chain graph</span>
          )}
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0 0" }} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <div
            onClick={view === "supply" || view === "entity" ? () => setSelId(null) : undefined}
            style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "auto", padding: "16px 24px 24px" }}
          >
            {view === "empty" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 7h4a3 3 0 0 1 3 3v4" /></svg>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: SERIF }}>Search for a node in the terminal below</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: MONO }}>available: {AVAILABLE_NODES.join(", ")}</p>
              </div>
            )}
            {view === "class" && classView && (
              <TreeCanvas columns={classView.columns} edges={classView.edges} onCardClick={(id) => { if (id === classView.rootId) { setView("supply"); setSelId(null); } }} />
            )}
            {view === "supply" && supplyView && (
              <TreeCanvas columns={supplyView.columns} edges={supplyView.edges} onCardClick={(id) => setSelId(id)} selected={selId} fill gap={30} />
            )}
            {view === "entity" && entityView && (
              <TreeCanvas columns={entityView.columns} edges={entityView.edges} onCardClick={(id) => setSelId(id)} selected={selId} fill gap={30} />
            )}
          </div>

          {/* Explore Entity Graph — bottom corner of the supply chain graph view */}
          {view === "supply" && (
            <button
              onClick={() => { setView("entity"); setSelId(null); }}
              style={{ position: "absolute", bottom: 16, right: 16, zIndex: 6, display: "flex", alignItems: "center", gap: 7, background: "rgba(200,122,74,0.14)", border: `1px solid ${accent}`, borderRadius: 7, padding: "8px 13px", cursor: "pointer", color: warmWhite, fontFamily: MONO, fontSize: 11, backdropFilter: "blur(2px)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,122,74,0.24)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,122,74,0.14)"; }}
            >
              Explore Entity Graph
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          )}
        </div>

        {/* on-demand panel: supply group detail */}
        {view === "supply" && (
          <div style={{ flexBasis: selectedDetail ? 340 : 0, flexGrow: 0, flexShrink: 0, width: selectedDetail ? 340 : 0, transition: "flex-basis 0.24s ease, width 0.24s ease", overflow: "hidden", borderLeft: selectedDetail ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgb(20,20,20)" }}>
            {selectedDetail && <SupplyPanel detail={selectedDetail} onClose={() => setSelId(null)} />}
          </div>
        )}
        {/* on-demand panel: entity detail */}
        {view === "entity" && (
          <div style={{ flexBasis: selectedEntity ? 340 : 0, flexGrow: 0, flexShrink: 0, width: selectedEntity ? 340 : 0, transition: "flex-basis 0.24s ease, width 0.24s ease", overflow: "hidden", borderLeft: selectedEntity ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgb(20,20,20)" }}>
            {selectedEntity && <EntityPanel entity={selectedEntity} graph={loaded!.entityGraph} onClose={() => setSelId(null)} />}
          </div>
        )}
      </div>

      {/* Terminal */}
      <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.09)", background: "#0e0d0d" }}>
        {log.length > 0 && (
          <div ref={logRef} style={{ maxHeight: 108, overflowY: "auto", padding: "10px 24px 2px", fontFamily: MONO, fontSize: 10.5, lineHeight: 1.75 }}>
            {log.map((l, i) => (
              <div key={i} style={{ color: l.startsWith("✓") ? "#7fae6f" : l.startsWith("✗") ? "#c86a5a" : l.startsWith("▶") ? warmWhite : "#8a8378" }}>{l}</div>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 24px 15px" }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: accent, flexShrink: 0 }}>stillpoint:nodes ❯</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="search for a node (e.g. Germanium) and press ↵"
            spellCheck={false}
            autoComplete="off"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: warmWhite, fontFamily: MONO, fontSize: 12 }}
          />
        </form>
      </div>
    </div>
  );
}

/* right panel for a selected supply-graph node (collapsed group) */
function SupplyPanel({ detail, onClose }: { detail: CollapsedDetail; onClose: () => void }) {
  return (
    <div style={{ width: 340, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
      <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{detail.entity_class} · {detail.entity_type}</p>
            <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1, padding: 0, marginTop: -2 }}>×</button>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 400, color: warmWhite, margin: "0 0 3px 0" }}>{detail.group_name}</h3>
          <p style={{ fontSize: 10, color: "#807870", margin: "0 0 12px 0", fontFamily: MONO }}>{detail.group_id}</p>

          <Row label="Class" value={detail.entity_class} />
          <Row label="Type" value={detail.entity_type} />
          {detail.role && <Row label="Graph role" value={detail.role} />}

          <Sect label="Receives">{detail.input_forms.length ? detail.input_forms.map((f, i) => <Prose key={i}>• {f}</Prose>) : <Prose>— (resource host)</Prose>}</Sect>
          <Sect label="Produces">{detail.output_forms.map((f, i) => <Prose key={i}>• {f}</Prose>)}</Sect>
          <Sect label="Routes through">
            <Prose>{detail.route_ids.join(", ")}</Prose>
            <p style={{ fontSize: 9, color: "#6f695f", fontFamily: MONO, margin: "4px 0 0 0" }}>
              {detail.member_count} route position{detail.member_count === 1 ? "" : "s"} · {detail.participation_count} participation record{detail.participation_count === 1 ? "" : "s"}
            </p>
          </Sect>
          {detail.member_count > 1 && (
            <p style={{ fontSize: 9.5, color: "#6f695f", fontStyle: "italic", margin: "10px 0 0 0", lineHeight: 1.5 }}>
              Collapsed from {detail.member_count} route-specific positions (distinct inputs/outputs) into one group for the graph view. The per-route detail is preserved in the route participation records.
            </p>
          )}
      </>
    </div>
  );
}

/* right panel for a selected real-world entity */
function EntityPanel({ entity, graph, onClose }: { entity: EntityNode; graph: EntityGraph; onClose: () => void }) {
  const nameOf = (id: string) => graph.entities.find(e => e.id === id)?.name ?? id;
  const upstream = graph.connections.filter(c => c.to === entity.id);
  const downstream = graph.connections.filter(c => c.from === entity.id);
  const statusColor = entity.status === "Producing" ? "#7fae6f" : entity.status === "Inactive" ? "#c86a5a" : "#c8a24a";
  return (
    <div style={{ width: 340, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{entity.entity_class} · {entity.entity_subtype}</p>
        <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1, padding: 0, marginTop: -2 }}>×</button>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 400, color: warmWhite, margin: "0 0 8px 0" }}>{entity.name}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#807870", fontFamily: MONO }}>{entity.country}</span>
        <span style={{ fontSize: 9, color: statusColor, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>● {entity.status}</span>
      </div>

      <Row label="Instantiates" value={entity.group_name} />
      <Row label="Group" value={entity.group_id} />
      <Row label="Confidence" value={entity.confidence} />

      <Prose>{entity.short}</Prose>

      {upstream.length > 0 && (
        <Sect label="Receives from">
          {upstream.map((c, i) => <div key={i}><span style={{ fontSize: 11, color: warmWhite }}>{nameOf(c.from)}</span><p style={{ fontSize: 8.5, color: c.status === "Verified" ? "#7fae6f" : "#8a7a5a", fontFamily: MONO, margin: "1px 0 6px 0" }}>{c.status} · {c.form}</p></div>)}
        </Sect>
      )}
      {downstream.length > 0 && (
        <Sect label="Supplies to">
          {downstream.map((c, i) => <div key={i}><span style={{ fontSize: 11, color: warmWhite }}>{nameOf(c.to)}</span><p style={{ fontSize: 8.5, color: c.status === "Verified" ? "#7fae6f" : "#8a7a5a", fontFamily: MONO, margin: "1px 0 6px 0" }}>{c.status} · {c.form}</p></div>)}
        </Sect>
      )}
    </div>
  );
}

function Sect({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontSize: 8, color: "#666", margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
      {children}
    </div>
  );
}
function Prose({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11.5, color: "rgb(172, 172, 172)", lineHeight: 1.55, margin: "2px 0 0 0" }}>{children}</p>;
}
function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
      <span style={{ fontSize: 9, color: "#706a60", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: warmWhite, textAlign: "right" }}>{value}</span>
    </div>
  );
}
