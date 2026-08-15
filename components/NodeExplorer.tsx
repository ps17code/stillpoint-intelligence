"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { lookupNode, AVAILABLE_NODES, ALL_NODES, getFullRecord, getCompanyRecord, getCompanyRecordV2, AVAILABLE_COMPANIES, computeStages, computeStageCountries, type LoadedNode, type EntityNode, type EntityGraph, type FullEntityRecord, type FEOperation, type CompanyRecord, type CompanyRecordV2, type NodeOverview, type StageInfo, type StageCountry, type StageEntity } from "@/lib/explorerRegistry";

/* ── Company Subgraph projection over a canonical Company Record (v2.0) ── */
type CNode = { key: string; kind: string; label: string; edge?: string; metas: string[]; canonicalId?: string; children: CNode[] };
function compileCompanySubgraph(rec: CompanyRecordV2): CNode {
  const anchorId = rec.common.organizational_entity_id;
  const classify = (t: string, vid: string): string => {
    const s = (t || "").toLowerCase();
    if (vid === anchorId || s.includes("segment") || s.includes("directly active") || s.includes("anchor")) return "Directly Active";
    if (s.includes("subsidiar")) return "Subsidiary";
    if (s.includes("joint venture") || s.includes(" jv")) return "Joint Venture";
    if (s.includes("equity") || s.includes("investment")) return "Equity Investment";
    return "Subsidiary";
  };
  const mkMarket = (m: CompanyRecordV2["economic_activities"][0]["corporate_vehicles"][0]["product_service_groups"][0]["physical_entities"][0]["commercial_outputs"][0]["markets"][0]): CNode => ({
    key: m.market_participation_id, kind: "Market", label: m.market_name, edge: "supplied into",
    metas: [m.buyer_customer_category, m.geographic_scope, m.volume_revenue_exposure].filter(Boolean) as string[], children: [],
  });
  const mkOutput = (o: CompanyRecordV2["economic_activities"][0]["corporate_vehicles"][0]["product_service_groups"][0]["physical_entities"][0]["commercial_outputs"][0]): CNode => ({
    key: o.commercial_output_id, kind: "Commercial Output", label: o.output_name, edge: "produces / provides",
    metas: [o.volume_quantity && o.volume_quantity !== "Not disclosed" ? `${o.volume_quantity} ${o.quantity_unit || ""}`.trim() : "", o.output_type].filter(Boolean) as string[],
    children: (o.markets || []).map(mkMarket),
  });
  const mkPE = (p: CompanyRecordV2["economic_activities"][0]["corporate_vehicles"][0]["product_service_groups"][0]["physical_entities"][0]): CNode => ({
    key: p.physical_entity_id, kind: "Physical Entity", label: p.physical_entity_name, edge: "realized by", canonicalId: p.physical_entity_id,
    metas: [p.physical_entity_class, p.relationship_to_corporate_vehicle, `status: ${p.resolution_status}`].filter(Boolean) as string[],
    children: (p.commercial_outputs || []).map(mkOutput),
  });
  const mkPSG = (g: CompanyRecordV2["economic_activities"][0]["corporate_vehicles"][0]["product_service_groups"][0], extra: string[] = []): CNode => ({
    key: g.product_service_group_id, kind: "Product / Service Group", label: g.group_name, edge: "responsible for",
    metas: [...extra, g.description].filter(Boolean) as string[], children: (g.physical_entities || []).map(mkPE),
  });
  const mkActivity = (a: CompanyRecordV2["economic_activities"][0]): CNode => {
    const children: CNode[] = [];
    for (const cv of a.corporate_vehicles || []) {
      const rel = classify(cv.vehicle_type, cv.vehicle_company_id);
      const psgs = (cv.product_service_groups || []);
      if (rel === "Directly Active") {
        for (const g of psgs) children.push(mkPSG(g, [`directly active — ${rec.identity.company_name}`]));
      } else {
        children.push({
          key: cv.corporate_vehicle_id, kind: "Corporate Vehicle", label: cv.vehicle_company_name, edge: "through", canonicalId: cv.vehicle_company_id,
          metas: [rel, cv.ownership_percentage != null ? `${cv.ownership_percentage}% owned` : "", cv.control_status].filter(Boolean) as string[],
          children: psgs.map((g) => mkPSG(g)),
        });
      }
    }
    return { key: a.economic_activity_id, kind: "Economic Activity", label: a.activity_name, edge: "participates in",
      metas: [a.activity_category, a.activity_status, (a.geographic_scope || []).join(", ")].filter(Boolean) as string[], children };
  };
  const rev = rec.financial.total_revenue;
  return {
    key: anchorId, kind: "Company", label: rec.identity.company_name, canonicalId: anchorId,
    metas: [rec.identity.company_type, rec.identity.headquarters, rev.amount != null ? `Revenue ${(rev.amount / 1e6).toFixed(0)}M ${rev.currency} (${rev.reporting_period})` : ""].filter(Boolean) as string[],
    children: (rec.economic_activities || []).map(mkActivity),
  };
}

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

const COUNTRY_CODES: Record<string, string> = {
  "China": "cn", "United States": "us", "USA": "us", "Canada": "ca", "DR Congo": "cd", "DRC": "cd",
  "Namibia": "na", "Peru": "pe", "Russia": "ru", "Kazakhstan": "kz", "Japan": "jp", "Belgium": "be",
  "Germany": "de", "France": "fr", "Australia": "au", "South Korea": "kr", "Guinea": "gn", "Greece": "gr",
  "Mexico": "mx", "Ukraine": "ua",
};

type Card = { id: string; title: string; sub?: string; physical?: string; country?: string; flag?: string; clickable?: boolean; muted?: boolean; featured?: boolean };
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
      {card.physical && <p style={{ margin: "3px 0 0 0", fontSize: 9.5, color: "rgb(150,143,132)", lineHeight: 1.3, fontFamily: SERIF }}>{card.physical}</p>}
      {card.country && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
          {card.flag ? <img src={`https://flagcdn.com/16x12/${card.flag}.png`} alt="" width={14} height={11} style={{ borderRadius: 1, flexShrink: 0 }} /> : null}
          <span style={{ fontSize: 8, color: "#807869", fontFamily: MONO, letterSpacing: "0.04em" }}>{card.country}</span>
        </div>
      )}
      {!card.physical && !card.country && card.sub && <span style={{ display: "block", marginTop: 3, fontSize: 7.5, color: feat ? accent : "#807869", fontFamily: MONO, letterSpacing: "0.06em", textTransform: "uppercase" }}>{card.sub}</span>}
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

type View = "empty" | "universe" | "overview" | "stage" | "class" | "supply" | "entity" | "company";

export default function NodeExplorer({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>("empty");
  const [loaded, setLoaded] = useState<LoadedNode | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [stageKey, setStageKey] = useState<string | null>(null);
  const [companyRec, setCompanyRec] = useState<CompanyRecordV2 | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleNode = (k: string) => setExpanded(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const companyView = useMemo(() => (companyRec ? compileCompanySubgraph(companyRec) : null), [companyRec]);

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
    if (["universe", "node universe", "class universe", "map", "all"].includes(v.toLowerCase())) {
      setView("universe"); setSelId(null);
      setLog(l => [...l, `▶ search "${v}"`, `✓ class node universe — ${ALL_NODES.length} class nodes`]);
      return;
    }
    const found = lookupNode(v);
    const co = found ? null : getCompanyRecordV2(v);
    if (found) {
      setLoaded(found); setView("overview"); setSelId(null);
      setLog(l => [...l, `▶ search "${v}"`, `✓ found ${found.name} — node object overview (${found.classGraph.downstream.length} downstream class nodes)`]);
    } else if (co) {
      setCompanyRec(co); setView("company"); setExpanded(new Set([co.common.organizational_entity_id]));
      setLog(l => [...l, `▶ search "${v}"`, `✓ found company ${co.identity.company_name} — projecting company subgraph (${co.economic_activities.length} economic activities)`]);
    } else {
      setLog(l => [...l, `▶ search "${v}"`, `✗ not found. Nodes: ${AVAILABLE_NODES.join(", ")} · companies: ${AVAILABLE_COMPANIES.join(", ")}`]);
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

  // ── class node universe view: every root class node + its child class nodes ──
  const universeView = useMemo(() => {
    const roots: Card[] = ALL_NODES.map(n => ({ id: n.classGraph.node.id, title: n.classGraph.node.name, sub: n.classGraph.node.class_type, clickable: true, featured: true }));
    const childCards: Card[] = [];
    const seen = new Set<string>();
    const edges: Edge[] = [];
    for (const n of ALL_NODES) {
      for (const d of n.classGraph.downstream) {
        if (!seen.has(d.id)) { seen.add(d.id); childCards.push({ id: d.id, title: d.name, sub: d.class_type, clickable: false }); }
        edges.push({ from: n.classGraph.node.id, to: d.id });
      }
    }
    const columns: Column[] = [
      { label: `Class Nodes (${roots.length})`, items: roots },
      { label: `Downstream Class Nodes (${childCards.length})`, items: childCards },
    ];
    return { columns, edges };
  }, []);

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
      const card: Card = e.organizational_entity
        ? { id: e.id, title: e.organizational_entity, physical: e.physical_entity ?? e.name, country: e.country, flag: e.flag ?? COUNTRY_CODES[e.country] ?? "", clickable: true, muted: e.status === "Inactive" }
        : { id: e.id, title: e.name, sub: e.country, clickable: true, muted: e.status === "Inactive" };
      (byCol[e.column] ??= []).push(card);
    }
    const columns: Column[] = eg.columns.map(c => ({ label: c.label, items: byCol[c.key] ?? [] }));
    const edges: Edge[] = eg.connections.map(c => ({ from: c.from, to: c.to }));
    return { columns, edges };
  }, [loaded]);

  const selectedEntity: EntityNode | null = useMemo(() => {
    if (view !== "entity" || !loaded || !selId) return null;
    return loaded.entityGraph.entities.find(e => e.id === selId) ?? null;
  }, [view, loaded, selId]);

  const overview = loaded?.overview ?? null;
  const stages = useMemo(() => (loaded ? computeStages(loaded) : []), [loaded]);

  const stageLabel = stages.find(s => s.key === stageKey)?.label ?? "";
  const headerKicker = view === "empty" ? "Node Explorer" : view === "universe" ? "Node Explorer · Class Node Universe" : view === "overview" ? "Node Explorer · Node Object" : view === "stage" ? "Node Explorer · Supply Chain Stage" : view === "company" ? "Node Explorer · Company Subgraph" : view === "class" ? "Node Explorer · Class Graph" : view === "supply" ? "Node Explorer · Supply Chain Graph" : "Node Explorer · Entity Graph";
  const headerTitle = view === "empty" ? "Search a node" : view === "universe" ? "Class Node Universe" : view === "overview" ? `${loaded?.name}` : view === "stage" ? `${loaded?.name} — ${stageLabel}` : view === "company" ? `${companyRec?.identity.company_name}` : view === "class" ? `${loaded?.name}` : view === "supply" ? `${loaded?.name} — Supply Chain` : `${loaded?.name} — Entities`;
  const backLabel = view === "entity" ? "Supply chain graph" : view === "supply" ? "Node overview" : view === "stage" ? "Node overview" : (view === "universe" || view === "overview" || view === "class" || view === "company") ? "Clear" : "Back";
  const onBackClick = () => {
    if (view === "entity") { setView("supply"); setSelId(null); }
    else if (view === "supply") { setView("overview"); setSelId(null); }
    else if (view === "stage") { setView("overview"); setSelId(null); }
    else if (view === "overview" || view === "class") { setView("empty"); setLoaded(null); setSelId(null); }
    else if (view === "universe") { setView("empty"); setSelId(null); }
    else if (view === "company") { setView("empty"); setCompanyRec(null); }
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
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: SERIF }}>Search for a node or company in the terminal below</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: MONO }}>nodes: {AVAILABLE_NODES.join(", ")} · companies: {AVAILABLE_COMPANIES.join(", ")}</p>
                <button
                  onClick={() => { setView("universe"); setSelId(null); }}
                  style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, background: "rgba(200,122,74,0.12)", border: `1px solid rgba(200,122,74,0.45)`, borderRadius: 6, padding: "5px 11px", cursor: "pointer", color: warmWhite, fontFamily: MONO, fontSize: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,122,74,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,122,74,0.12)"; }}
                >
                  View class node universe
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            )}
            {view === "company" && companyView && (
              <CompanyGraph root={companyView} expanded={expanded} onToggle={toggleNode} />
            )}
            {view === "universe" && (
              <TreeCanvas columns={universeView.columns} edges={universeView.edges} fill gap={30} onCardClick={(id) => { const n = ALL_NODES.find(x => x.classGraph.node.id === id); if (n) { setLoaded(n); setView("overview"); setSelId(null); } }} />
            )}
            {view === "overview" && loaded && (
              <AerialGraph loaded={loaded} stages={stages} onStageExpand={(key) => { setStageKey(key); setSelId(null); setView("stage"); }} onOpenSupply={() => { setView("supply"); setSelId(null); }} />
            )}
            {view === "stage" && loaded && (
              <StageView loaded={loaded} stages={stages} selectedKey={stageKey ?? stages[0]?.key ?? ""} onSelectStage={(key) => setStageKey(key)} />
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
          <div style={{ flexBasis: selectedEntity ? 400 : 0, flexGrow: 0, flexShrink: 0, width: selectedEntity ? 400 : 0, transition: "flex-basis 0.24s ease, width 0.24s ease", overflow: "hidden", borderLeft: selectedEntity ? "1px solid rgba(255,255,255,0.06)" : "none", background: "rgb(20,20,20)" }}>
            {selectedEntity && <EntityPanel entity={selectedEntity} graph={loaded!.entityGraph} record={getFullRecord(selectedEntity.id)} company={selectedEntity.organizational_entity ? getCompanyRecord(selectedEntity.organizational_entity) : null} onClose={() => setSelId(null)} />}
          </div>
        )}
        {/* company record panel — full record data alongside the company graph */}
        {view === "company" && companyRec && (
          <div style={{ flexBasis: 430, flexGrow: 0, flexShrink: 0, width: 430, overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgb(20,20,20)" }}>
            <CompanyRecordPanel rec={companyRec} />
          </div>
        )}
        {/* node object overview panel */}
        {view === "overview" && loaded && overview && (
          <div style={{ flexBasis: 400, flexGrow: 0, flexShrink: 0, width: 400, overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgb(20,20,20)" }}>
            <OverviewPanel loaded={loaded} overview={overview} />
          </div>
        )}
        {/* supply-chain stage analysis panel (blank — to be filled later) */}
        {view === "stage" && loaded && (
          <div style={{ flexBasis: 400, flexGrow: 0, flexShrink: 0, width: 400, overflow: "hidden", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgb(20,20,20)" }}>
            <div style={{ width: 400, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
              <p style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Stage Analysis</p>
              <h2 style={{ fontSize: 16, color: warmWhite, fontFamily: SERIF, margin: "4px 0 0 0" }}>{stageLabel}</h2>
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.2)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>
                <p style={{ fontSize: 10.5, fontFamily: SERIF, margin: 0 }}>Stage analysis — coming soon</p>
              </div>
            </div>
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

/* Company Subgraph — progressive-disclosure tree projection of a Company Record */
const CG_KIND_COLOR: Record<string, string> = {
  "Company": accent, "Economic Activity": "#7fae6f", "Corporate Vehicle": "#c8a24a",
  "Product / Service Group": "#8ab0c0", "Physical Entity": "#b08fce", "Commercial Output": "#cf9b7f", "Market": "#9a938a",
};

/* one node card in the top-down company graph */
function CompanyNodeCard({ node, isOpen, onToggle, nodeRef }: { node: CNode; isOpen: boolean; onToggle: () => void; nodeRef: (el: HTMLDivElement | null) => void }) {
  const hasKids = node.children.length > 0;
  const kc = CG_KIND_COLOR[node.kind] ?? "#888";
  const isCompany = node.kind === "Company";
  const stage = node.edge || node.kind;
  return (
    <div
      ref={nodeRef}
      onClick={hasKids ? onToggle : undefined}
      style={{
        width: 172, boxSizing: "border-box", padding: "9px 12px 8px", borderRadius: 7,
        background: isCompany ? "rgba(200,122,74,0.13)" : cardBg,
        border: `1px solid ${isCompany ? accent : "rgb(48,43,40)"}`, borderTop: `2px solid ${kc}`,
        cursor: hasKids ? "pointer" : "default", position: "relative", transition: "border-color 120ms, background 120ms",
        boxShadow: isCompany ? "0 0 0 3px rgba(200,122,74,0.06)" : "none",
      }}
    >
      <p style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.07em", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stage}</p>
      <p style={{ fontSize: 12.5, color: warmWhite, fontFamily: SERIF, margin: "3px 0 0 0", lineHeight: 1.2 }}>{node.label}</p>
      {hasKids && (
        <span style={{ position: "absolute", bottom: 5, right: 8, fontSize: 8, color: "#7d766b", fontFamily: MONO }}>
          {isOpen ? "▾" : "▸"} {node.children.length}
        </span>
      )}
    </div>
  );
}

/* Company Subgraph — top-down node graph that fans out and expands downward */
function CompanyGraph({ root, expanded, onToggle }: { root: CNode; expanded: Set<string>; onToggle: (k: string) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  const { rows, edges } = useMemo(() => {
    const rows: CNode[][] = [];
    const edges: { from: string; to: string; color: string }[] = [];
    const walk = (n: CNode, d: number) => {
      (rows[d] ??= []).push(n);
      if (expanded.has(n.key)) for (const c of n.children) { edges.push({ from: n.key, to: c.key, color: CG_KIND_COLOR[c.kind] ?? "#888" }); walk(c, d + 1); }
    };
    walk(root, 0);
    return { rows, edges };
  }, [root, expanded]);

  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const next: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    for (const e of edges) {
      const f = nodeEls.current[e.from], t = nodeEls.current[e.to];
      if (!f || !t) continue;
      const fb = f.getBoundingClientRect(), tb = t.getBoundingClientRect();
      next.push({ x1: fb.left + fb.width / 2 - box.left, y1: fb.bottom - box.top, x2: tb.left + tb.width / 2 - box.left, y2: tb.top - box.top, color: e.color });
    }
    setLines(next);
  }, [edges]);

  useEffect(() => {
    const r = requestAnimationFrame(measure);
    const t = setTimeout(measure, 90);
    const ro = new ResizeObserver(() => measure());
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure, expanded]);

  return (
    <div ref={boxRef} style={{ position: "relative", minWidth: "100%", padding: "10px 8px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 0 }}>
        {lines.map((l, i) => {
          const my = (l.y1 + l.y2) / 2;
          return (
            <g key={i}>
              <path d={`M ${l.x1} ${l.y1} C ${l.x1} ${my}, ${l.x2} ${my}, ${l.x2} ${l.y2}`} fill="none" stroke={l.color} strokeOpacity={0.5} strokeWidth={1.3} />
              <circle cx={l.x2} cy={l.y2} r={2.2} fill={l.color} fillOpacity={0.7} />
            </g>
          );
        })}
      </svg>
      {rows.map((row, d) => (
        <div key={d} style={{ display: "flex", gap: 22, justifyContent: "center", alignItems: "flex-start", position: "relative", zIndex: 1, flexWrap: "nowrap" }}>
          {row.map(n => (
            <CompanyNodeCard key={n.key} node={n} isOpen={expanded.has(n.key)} onToggle={() => onToggle(n.key)} nodeRef={el => { nodeEls.current[n.key] = el; }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Node Object Overview view ── */
function Flag({ country, size = 14 }: { country: string; size?: number }) {
  const code = COUNTRY_CODES[country];
  const h = Math.round(size * 0.78);
  if (!code) return <span style={{ width: size, height: h, display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 1, flexShrink: 0 }} />;
  return <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" width={size} height={h} style={{ borderRadius: 1, flexShrink: 0 }} />;
}

const STAGE_COLORS = ["#7fae6f", "#c8a24a", "#8ab0c0", "#b08fce", "#cf9b7f", "#9a938a"];

function StageConnector({ top }: { top?: number }) {
  return (
    <div style={{ width: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b655c", alignSelf: top != null ? "flex-start" : undefined, marginTop: top }}>
      <svg width="24" height="9" viewBox="0 0 24 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="4.5" x2="18" y2="4.5" /><polyline points="14,1 20,4.5 14,8" /></svg>
    </div>
  );
}

function StageCard({ stage, color, onExpand }: { stage: StageInfo; color: string; onExpand: () => void }) {
  return (
    <div style={{ height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", padding: "10px 11px", borderRadius: 7, background: "rgb(30,28,26)", border: "1px solid rgb(48,43,40)", borderTop: `2px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 11, color: warmWhite, fontFamily: SERIF }}>{stage.label}</span>
      </div>
      {stage.quantity_metric && <p style={{ fontSize: 8.5, color, fontFamily: MONO, margin: "3px 0 0 0", lineHeight: 1.4 }}>{stage.quantity_metric}</p>}
      {stage.description && <p style={{ fontSize: 9, color: "#8f877b", margin: "4px 0 0 0", lineHeight: 1.4 }}>{stage.description}</p>}
      {stage.top_countries.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
          {stage.top_countries.map(c => (
            <div key={c.name}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Flag country={c.name} size={13} />
                <span style={{ fontSize: 9.5, color: warmWhite }}>{c.name}</span>
              </div>
              {c.companies.length > 0 && (
                <p style={{ fontSize: 7.5, color: "#807869", fontFamily: MONO, margin: "1px 0 0 19px", lineHeight: 1.4 }}>{c.companies.map(x => x.length > 18 ? x.slice(0, 17) + "…" : x).join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: "auto", paddingTop: 9 }}>
        <p style={{ fontSize: 8, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 6px 0" }}>{stage.count_label}</p>
        <button
          onClick={onExpand}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(200,122,74,0.12)", border: `1px solid rgba(200,122,74,0.5)`, borderRadius: 5, padding: "4px 8px", cursor: "pointer", color: warmWhite, fontFamily: MONO, fontSize: 8.5 }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,122,74,0.24)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,122,74,0.12)"; }}
        >
          Expand
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>
    </div>
  );
}

/* aerial graph: parents · node-object-container(with stage cards) · child nodes */
function AerialGraph({ loaded, stages, onStageExpand, onOpenSupply }: { loaded: LoadedNode; stages: StageInfo[]; onStageExpand: (key: string) => void; onOpenSupply: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const children = loaded.classGraph.downstream;

  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    const n = nodeRef.current?.getBoundingClientRect();
    if (!box || !n) return;
    const next: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const c of children) {
      const el = childRefs.current[c.id];
      if (!el) continue;
      const cb = el.getBoundingClientRect();
      next.push({ x1: n.right - box.left, y1: n.top + n.height / 2 - box.top, x2: cb.left - box.left, y2: cb.top + cb.height / 2 - box.top });
    }
    setLines(next);
  }, [children]);

  useEffect(() => {
    const r = requestAnimationFrame(measure);
    const t = setTimeout(measure, 90);
    const ro = new ResizeObserver(() => measure());
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure, collapsed]);

  return (
    <div ref={boxRef} style={{ position: "relative", minHeight: "100%", display: "flex", padding: "16px 10px" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 0 }}>
        {lines.map((l, i) => {
          const mx = (l.x1 + l.x2) / 2;
          return <path key={i} d={`M ${l.x1} ${l.y1} C ${mx} ${l.y1}, ${mx} ${l.y2}, ${l.x2} ${l.y2}`} fill="none" stroke={lineColor} strokeWidth={1.2} />;
        })}
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 32, margin: "0 auto" }}>

      {/* node object — collapsible: expanded shows the supply-chain stage cards; collapsed is a plain class-graph node */}
      {collapsed ? (
        <div
          ref={nodeRef}
          onClick={onOpenSupply}
          title="Open supply chain graph"
          style={{ zIndex: 1, flexShrink: 0, width: 210, cursor: "pointer", background: "rgba(200,122,74,0.08)", border: `1px solid ${accent}`, borderRadius: 10, padding: "12px 13px", boxShadow: "0 0 0 4px rgba(200,122,74,0.04)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 16, color: warmWhite, fontFamily: SERIF }}>{loaded.name}</span>
            <button
              onClick={e => { e.stopPropagation(); setCollapsed(false); }}
              title="Show supply-chain stages"
              style={{ display: "flex", alignItems: "center", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 4, padding: "2px 4px", cursor: "pointer", color: "#8a8378" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 4 16 12 8 20" /></svg>
            </button>
          </div>
          <span style={{ display: "inline-block", fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid rgba(200,122,74,0.4)", borderRadius: 3, padding: "1px 6px", marginTop: 6 }}>{loaded.classGraph.node.class_type}</span>
          <p style={{ fontSize: 8.5, color: "#807869", fontFamily: MONO, margin: "8px 0 0 0" }}>Click to open supply chain →</p>
        </div>
      ) : (
        <div ref={nodeRef} style={{ zIndex: 1, flexShrink: 0, width: "max-content", background: "rgba(200,122,74,0.05)", border: `1px solid ${accent}`, borderRadius: 12, padding: "12px 13px 14px", boxShadow: "0 0 0 4px rgba(200,122,74,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontSize: 16, color: warmWhite, fontFamily: SERIF }}>{loaded.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", border: "1px solid rgba(200,122,74,0.4)", borderRadius: 3, padding: "1px 6px" }}>{loaded.classGraph.node.class_type}</span>
              <button
                onClick={() => setCollapsed(true)}
                title="Collapse to node"
                style={{ display: "flex", alignItems: "center", background: "transparent", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 4, padding: "2px 4px", cursor: "pointer", color: "#8a8378" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /></svg>
              </button>
            </div>
          </div>
          <p style={{ fontSize: 7.5, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", margin: "8px 0 0 0" }}>Supply-chain stages</p>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch", flexWrap: "nowrap", marginTop: 7 }}>
            {stages.map((s, i) => (
              <React.Fragment key={s.key}>
                {i > 0 && <StageConnector />}
                <div style={{ width: 142, flexShrink: 0, display: "flex" }}>
                  <StageCard stage={s} color={STAGE_COLORS[i % STAGE_COLORS.length]} onExpand={() => onStageExpand(s.key)} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* child nodes */}
      {children.length > 0 && (
        <div style={{ zIndex: 1, flexShrink: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          <p style={{ fontSize: 7.5, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Child nodes ({children.length})</p>
          {children.map(c => (
            <div key={c.id} ref={el => { childRefs.current[c.id] = el; }} style={{ width: 150, padding: "7px 10px", borderRadius: 7, background: cardBg, border: "1px solid rgb(48,43,40)" }}>
              <p style={{ fontSize: 10, color: warmWhite, fontFamily: SERIF, margin: 0, lineHeight: 1.2 }}>{c.name}</p>
              <p style={{ fontSize: 7, color: "#8ab0c0", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em", margin: "2px 0 0 0" }}>{c.class_type}</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

/* right panel for the node object overview */
function OverviewPanel({ loaded, overview }: { loaded: LoadedNode; overview: NodeOverview }) {
  const m = overview.metrics;
  return (
    <div style={{ width: 400, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
      <p style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Node Object · {loaded.classGraph.node.class_type}</p>
      <h2 style={{ fontSize: 18, color: warmWhite, fontFamily: SERIF, margin: "4px 0 0 0" }}>{loaded.name}</h2>

      <Sect label="What it is"><Prose>{overview.description.what}</Prose></Sect>
      <Sect label="Why it matters"><Prose>{overview.description.why}</Prose></Sect>
      <Sect label="How it's used"><Prose>{overview.description.how}</Prose></Sect>

      <Sect label="Key Metrics">
        <Sub2 label="Global production" value={m.global_production} />
        <Sub2 label="Market price" value={m.market_price} />
        <MicroHead>Top producing countries</MicroHead>
        {m.top_countries.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <Flag country={c.name} size={15} />
            <span style={{ fontSize: 11, color: warmWhite }}>{c.name}</span>
            {c.share && <span style={{ fontSize: 9, color: "#807869", fontFamily: MONO, marginLeft: "auto", textAlign: "right" }}>{c.share}</span>}
          </div>
        ))}
        <div style={{ marginTop: 6 }} />
        <MicroHead>Major companies</MicroHead>
        {m.top_companies.map((c, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {c.country && <Flag country={c.country} size={13} />}
              <span style={{ fontSize: 11, color: warmWhite }}>{c.name}</span>
            </div>
            {c.note && <p style={{ fontSize: 9, color: "#807869", margin: "2px 0 0 0", lineHeight: 1.45 }}>{c.note}</p>}
          </div>
        ))}
      </Sect>

      <Sect label="Stillpoint View"><Prose>{overview.stillpoint_view}</Prose></Sect>
    </div>
  );
}

/* ── Supply Chain Stage view — a graph of nodes (stage → country → entity), no container boxes ── */
function StageNode({ stage, color, selected, onClick, nodeRef }: { stage: StageInfo; color: string; selected: boolean; onClick: () => void; nodeRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={nodeRef} onClick={onClick} style={{ width: 150, boxSizing: "border-box", padding: "9px 11px", borderRadius: 8, cursor: "pointer", background: selected ? "rgba(200,122,74,0.1)" : cardBg, border: `1px solid ${selected ? accent : "rgb(48,43,40)"}`, borderTop: `2px solid ${color}`, boxShadow: selected ? "0 0 0 3px rgba(200,122,74,0.06)" : "none" }}>
      <p style={{ fontSize: 11, color: warmWhite, fontFamily: SERIF, margin: 0 }}>{stage.label}</p>
      {stage.quantity_metric && <p style={{ fontSize: 8, color, fontFamily: MONO, margin: "3px 0 0 0", lineHeight: 1.35 }}>{stage.quantity_metric}</p>}
      <p style={{ fontSize: 8, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em", margin: "4px 0 0 0" }}>{stage.count_label}</p>
    </div>
  );
}

function CountryNode({ country, open, onClick, nodeRef }: { country: StageCountry; open: boolean; onClick: () => void; nodeRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={nodeRef} onClick={onClick} style={{ width: 190, boxSizing: "border-box", padding: "8px 11px", borderRadius: 8, cursor: "pointer", background: open ? "rgba(138,176,192,0.08)" : cardBg, border: `1px solid ${open ? "#8ab0c0" : "rgb(48,43,40)"}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Flag country={country.name} size={15} />
        <span style={{ fontSize: 11.5, color: warmWhite, fontFamily: SERIF }}>{country.name}</span>
        <span style={{ fontSize: 7.5, color: "#6f695f", fontFamily: MONO, marginLeft: "auto" }}>{country.entity_count}</span>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#8a8378" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}><polyline points="9 6 15 12 9 18" /></svg>
      </div>
      {country.companies.length > 0 && (
        <div style={{ margin: "5px 0 0 22px", display: "flex", flexDirection: "column", gap: 2 }}>
          {country.companies.map((co, i) => <span key={i} style={{ fontSize: 8.5, color: "#807869", lineHeight: 1.35 }}>{co.length > 26 ? co.slice(0, 25) + "…" : co}</span>)}
        </div>
      )}
    </div>
  );
}

function StageEntityNode({ e, nodeRef }: { e: StageEntity; nodeRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={nodeRef} style={{ width: 180, boxSizing: "border-box", padding: "8px 10px", borderRadius: 7, background: "rgb(30,28,26)", border: "1px solid rgb(45,41,39)", borderLeft: "2px solid #8ab0c0" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 10.5, color: warmWhite, fontFamily: SERIF }}>{e.company}</span>
        <span style={{ fontSize: 8.5, color: accent, fontFamily: MONO, flexShrink: 0 }}>{e.quantity}</span>
      </div>
      <p style={{ fontSize: 9, color: "rgb(172,172,172)", margin: "3px 0 0 0", lineHeight: 1.4 }}>{e.physical_entity_name}</p>
      {e.group_name && <p style={{ fontSize: 7.5, color: "#8ab0c0", fontFamily: MONO, margin: "2px 0 0 0" }}>{e.group_name}</p>}
    </div>
  );
}

/* the node object zoomed in: stage nodes across the top, the selected stage fanning into country → entity nodes */
function StageView({ loaded, stages, selectedKey, onSelectStage }: { loaded: LoadedNode; stages: StageInfo[]; selectedKey: string; onSelectStage: (key: string) => void }) {
  const [openCountry, setOpenCountry] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => { setOpenCountry(null); }, [selectedKey]);
  useEffect(() => { const t = setTimeout(() => setShown(true), 20); return () => clearTimeout(t); }, []);
  const countries = useMemo(() => computeStageCountries(loaded, selectedKey), [loaded, selectedKey]);
  const openEntities = useMemo(() => openCountry ? (countries.find(c => c.name === openCountry)?.entities ?? []) : [], [openCountry, countries]);

  const boxRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const countryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const entityRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string; dir: "v" | "h" }[]>([]);

  const measure = useCallback(() => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const next: { x1: number; y1: number; x2: number; y2: number; color: string; dir: "v" | "h" }[] = [];
    const sel = stageRefs.current[selectedKey];
    if (sel) {
      const sb = sel.getBoundingClientRect();
      for (const c of countries) {
        const el = countryRefs.current[c.name]; if (!el) continue;
        const cb = el.getBoundingClientRect();
        next.push({ x1: sb.left + sb.width / 2 - box.left, y1: sb.bottom - box.top, x2: cb.left - box.left, y2: cb.top + cb.height / 2 - box.top, color: accent, dir: "v" });
      }
    }
    if (openCountry) {
      const cn = countryRefs.current[openCountry];
      if (cn) {
        const cb = cn.getBoundingClientRect();
        for (const e of openEntities) {
          const el = entityRefs.current[e.entity_id]; if (!el) continue;
          const eb = el.getBoundingClientRect();
          next.push({ x1: cb.right - box.left, y1: cb.top + cb.height / 2 - box.top, x2: eb.left - box.left, y2: eb.top + eb.height / 2 - box.top, color: "#8ab0c0", dir: "h" });
        }
      }
    }
    setLines(next);
  }, [countries, selectedKey, openCountry, openEntities]);

  useEffect(() => {
    const r = requestAnimationFrame(measure);
    const t = setTimeout(measure, 90);
    const ro = new ResizeObserver(() => measure());
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(r); clearTimeout(t); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [measure]);

  return (
    <div ref={boxRef} style={{ position: "relative", minHeight: "100%", padding: "22px 16px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 50, opacity: shown ? 1 : 0, transition: "opacity 0.3s ease" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 0 }}>
        {lines.map((l, i) => {
          const d = l.dir === "h"
            ? `M ${l.x1} ${l.y1} C ${(l.x1 + l.x2) / 2} ${l.y1}, ${(l.x1 + l.x2) / 2} ${l.y2}, ${l.x2} ${l.y2}`
            : `M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2}, ${l.x2} ${(l.y1 + l.y2) / 2}, ${l.x2} ${l.y2}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={l.color} strokeOpacity={0.5} strokeWidth={1.3} />
              <circle cx={l.x2} cy={l.y2} r={2.2} fill={l.color} fillOpacity={0.7} />
            </g>
          );
        })}
      </svg>

      {/* stage nodes — the node object, zoomed in */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", zIndex: 1 }}>
        {stages.map((s, i) => (
          <React.Fragment key={s.key}>
            {i > 0 && <StageConnector />}
            <StageNode stage={s} color={STAGE_COLORS[i % STAGE_COLORS.length]} selected={s.key === selectedKey} onClick={() => onSelectStage(s.key)} nodeRef={el => { stageRefs.current[s.key] = el; }} />
          </React.Fragment>
        ))}
      </div>

      {/* country column (each listing its companies) + entity column to the right */}
      {countries.length > 0 && (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 78, zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {countries.map(c => (
              <CountryNode key={c.name} country={c} open={openCountry === c.name} onClick={() => setOpenCountry(p => p === c.name ? null : c.name)} nodeRef={el => { countryRefs.current[c.name] = el; }} />
            ))}
          </div>
          {openCountry && openEntities.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {openEntities.map(e => (
                <StageEntityNode key={e.entity_id} e={e} nodeRef={el => { entityRefs.current[e.entity_id] = el; }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* full Company Record data panel — renders the entire CompanyRecordV2 alongside the company graph */
function CompanyRecordPanel({ rec }: { rec: CompanyRecordV2 }) {
  const id = rec.identity;
  const fin = rec.financial?.total_revenue;
  const finAny = fin as unknown as { reporting_scope?: string; revenue_basis?: string } | undefined;
  const rev = fin && fin.amount != null
    ? `${fin.amount.toLocaleString()} ${fin.currency || ""}${fin.reporting_period ? ` (${fin.reporting_period})` : ""}`.trim()
    : "Not disclosed";
  const indent = (color: string): React.CSSProperties => ({ marginTop: 7, marginLeft: 5, paddingLeft: 9, borderLeft: `2px solid ${color}` });
  return (
    <div style={{ width: 430, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
      <p style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Company Record · {rec.common?.entity_subtype || "Company"}</p>
      <h2 style={{ fontSize: 17, color: warmWhite, fontFamily: SERIF, margin: "4px 0 0 0", lineHeight: 1.2 }}>{id?.company_name}</h2>
      <p style={{ fontSize: 8.5, color: "#8ab0c0", fontFamily: MONO, margin: "3px 0 0 0" }}>{rec.common?.organizational_entity_id}</p>

      <Sect label="Identity">
        <Row label="Legal name" value={id?.legal_name || ""} />
        <Row label="Type" value={id?.company_type || ""} />
        <Row label="Status" value={id?.company_status || ""} />
        <Row label="Incorporated" value={id?.country_of_incorporation || ""} />
        <Row label="HQ" value={id?.headquarters || ""} />
        {id?.short_description && <Prose>{id.short_description}</Prose>}
      </Sect>

      <Sect label="Financial">
        <Row label="Revenue" value={rev} />
        {finAny?.reporting_scope && <Row label="Scope" value={finAny.reporting_scope} />}
        {finAny?.revenue_basis && <Prose>{finAny.revenue_basis}</Prose>}
      </Sect>

      <Sect label={`Economic Activities (${rec.economic_activities?.length || 0})`}>
        {(rec.economic_activities || []).map((a, i) => (
          <div key={i} style={{ marginTop: i ? 12 : 2, padding: "9px 10px", borderRadius: 6, background: cardBg, border: "1px solid rgb(45,41,39)" }}>
            <p style={{ fontSize: 12.5, color: warmWhite, fontFamily: SERIF, margin: 0 }}>{a.activity_name}</p>
            <p style={{ fontSize: 7.5, color: accent, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.05em", margin: "2px 0 0 0" }}>{[a.activity_category, (a.geographic_scope || []).join(", "), a.activity_status].filter(Boolean).join(" · ")}</p>
            {a.description && <Prose>{a.description}</Prose>}
            {(a.corporate_vehicles || []).map((cv, j) => (
              <div key={j} style={indent("#c8a24a")}>
                <MicroHead>through · corporate vehicle</MicroHead>
                <p style={{ fontSize: 11.5, color: warmWhite, margin: 0 }}>{cv.vehicle_company_name}</p>
                {cv.vehicle_company_id && <p style={{ fontSize: 8, color: "#8ab0c0", fontFamily: MONO, margin: "1px 0 0 0" }}>{cv.vehicle_company_id}</p>}
                <Sub2 label="relationship" value={[cv.vehicle_type, cv.ownership_percentage != null ? `${cv.ownership_percentage}%` : "", cv.control_status].filter(Boolean).join(" · ")} />
                {cv.relationship_description && <Prose>{cv.relationship_description}</Prose>}
                {(cv.product_service_groups || []).map((g, k) => (
                  <div key={k} style={indent("#8ab0c0")}>
                    <MicroHead>responsible for · product / service group</MicroHead>
                    <p style={{ fontSize: 11, color: warmWhite, margin: 0 }}>{g.group_name}</p>
                    {g.description && <Prose>{g.description}</Prose>}
                    {(g.physical_entities || []).map((pe, m) => (
                      <div key={m} style={indent("#b08fce")}>
                        <MicroHead>realized by · physical entity</MicroHead>
                        <p style={{ fontSize: 11, color: warmWhite, margin: 0 }}>{pe.physical_entity_name}</p>
                        <p style={{ fontSize: 8, color: "#8ab0c0", fontFamily: MONO, margin: "1px 0 0 0" }}>{[pe.physical_entity_id, pe.physical_entity_class, pe.resolution_status].filter(Boolean).join(" · ")}</p>
                        {(pe.commercial_outputs || []).map((o, n) => (
                          <div key={n} style={indent("#cf9b7f")}>
                            <MicroHead>produces · commercial output</MicroHead>
                            <p style={{ fontSize: 10.5, color: warmWhite, margin: 0 }}>{o.output_name}</p>
                            <Sub2 label="volume / revenue" value={[o.volume_quantity && o.volume_quantity !== "Not disclosed" ? `${o.volume_quantity} ${o.quantity_unit || ""}`.trim() : "", o.revenue].filter(Boolean).join(" · ") || "Not disclosed"} />
                            {(o.markets || []).map((mk, p) => (
                              <div key={p} style={indent("#9a938a")}>
                                <MicroHead>supplied into · market</MicroHead>
                                <p style={{ fontSize: 10, color: "rgb(172,172,172)", margin: 0 }}>{mk.market_name}</p>
                                <Sub2 label="exposure" value={[mk.buyer_customer_category, mk.geographic_scope, mk.volume_revenue_exposure].filter(Boolean).join(" · ")} />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Sect>
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
function EntityPanel({ entity, graph, record, company, onClose }: { entity: EntityNode; graph: EntityGraph; record: FullEntityRecord | null; company: CompanyRecord | null; onClose: () => void }) {
  const nameOf = (id: string) => graph.entities.find(e => e.id === id)?.name ?? id;
  const upstream = graph.connections.filter(c => c.to === entity.id);
  const downstream = graph.connections.filter(c => c.from === entity.id);
  const statusColor = entity.status === "Producing" ? "#7fae6f" : entity.status === "Inactive" ? "#c86a5a" : "#c8a24a";
  return (
    <div style={{ width: 400, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{entity.entity_class} · {entity.entity_subtype}</p>
        <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1, padding: 0, marginTop: -2 }}>×</button>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 400, color: warmWhite, margin: "0 0 8px 0" }}>{entity.name}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: "#807870", fontFamily: MONO }}>{entity.country}</span>
        <span style={{ fontSize: 9, color: statusColor, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>● {entity.status}</span>
      </div>

      {entity.organizational_entity ? <Row label="Organization" value={entity.organizational_entity} /> : null}
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

      {record && <FullRecordView record={record} />}
      {company && <CompanyRecordView company={company} />}
    </div>
  );
}

/* full schema-conformant Company (Organizational Entity) record */
function CompanyRecordView({ company }: { company: CompanyRecord }) {
  const id = company.identity, cs = company.corporate_structure, rev = company.financial.total_revenue;
  const revText = rev.amount != null ? `${rev.amount} ${rev.currency}` : (rev.currency || "Not disclosed");
  return (
    <>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(200,122,74,0.35)" }}>
        <p style={{ fontSize: 8, color: accent, margin: "0 0 2px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Organization record · Company schema v1.0</p>
        <p style={{ fontSize: 12.5, color: warmWhite, margin: "2px 0 0 0", fontFamily: SERIF }}>{id.company_name}</p>
        <p style={{ fontSize: 9, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{company.common.organizational_entity_id} · {company.common.entity_subtype}</p>
      </div>

      <Sect label="Identity">
        <Row label="Legal name" value={id.legal_name} />
        <Row label="Type" value={id.company_type} />
        <Row label="HQ" value={id.headquarters} />
        <Sub2 label="Status" value={id.company_status} />
        <Sub2 label="About" value={id.short_description} />
      </Sect>

      <Sect label="Corporate structure">
        <Row label="Role" value={cs.corporate_role} />
        <Sub2 label="Parent" value={cs.parent_company} />
        {cs.subsidiaries?.length ? <Sub2 label="Subsidiaries" value={cs.subsidiaries.join(" · ")} /> : null}
        {cs.joint_ventures?.length ? <Sub2 label="Joint ventures" value={cs.joint_ventures.join(" · ")} /> : null}
      </Sect>

      <Sect label="Financial">
        <Row label="Revenue" value={revText} />
        <Row label="Period" value={rev.reporting_period} />
        <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "2px 0 0 0" }}>{rev.revenue_basis}</p>
      </Sect>

      <Sect label={`Economic activities (${company.economic_activities.length})`}>
        {company.economic_activities.map((a, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: warmWhite }}>{a.activity_name}</span>
            <Prose>{a.description}</Prose>
          </div>
        ))}
      </Sect>

      {company.product_service_groups.map((g, gi) => (
        <div key={gi} style={{ marginTop: 12, padding: "10px 11px", borderRadius: 5, background: "rgb(28,26,24)", border: "1px solid rgb(45,41,39)" }}>
          <p style={{ fontSize: 11.5, color: warmWhite, margin: 0, fontFamily: SERIF }}>{g.group_name}</p>
          <p style={{ fontSize: 8, color: accent, margin: "1px 0 4px 0", fontFamily: MONO, textTransform: "uppercase" }}>product / service group · {g.commercial_outputs.length} outputs</p>
          {g.commercial_outputs.map((o, oi) => (
            <div key={oi} style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#c9c1b4" }}>{o.output_name}</span>
              <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{o.volume_quantity && o.volume_quantity !== "Not disclosed" ? `${o.volume_quantity} ${o.quantity_unit ?? ""}` : "qty not disclosed"}{o.end_markets?.length ? ` · ${o.end_markets.slice(0, 3).join(", ")}` : ""}</p>
            </div>
          ))}
        </div>
      ))}

      <Sect label={`Physical realization (${company.physical_realization.length})`}>
        {company.physical_realization.map((r, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 10.5, color: "#c9c1b4" }}>{r.realization_type}</span>
            <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{r.relationship_type}{r.physical_entity_ids?.filter(p => p.startsWith("pe_")).length ? ` → ${r.physical_entity_ids.filter(p => p.startsWith("pe_")).join(", ")}` : ""}</p>
          </div>
        ))}
      </Sect>
    </>
  );
}

/* full schema-conformant Physical Entity Node record */
function FullRecordView({ record }: { record: FullEntityRecord }) {
  const c = record.common, id = record.identity, loc = record.location, ops = record.operations;
  const coord = loc.coordinates.latitude != null ? `${loc.coordinates.latitude}, ${loc.coordinates.longitude}` : "Unknown";
  return (
    <>
      <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid rgba(200,122,74,0.35)" }}>
        <p style={{ fontSize: 8, color: accent, margin: "0 0 2px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Full entity record · Operating Facility schema v1.0</p>
        <p style={{ fontSize: 9, color: "#6f695f", fontFamily: MONO, margin: 0 }}>{c.physical_entity_id} · record {ops.facility_record_metadata.record_status} · confidence {ops.facility_record_metadata.overall_confidence}</p>
      </div>

      <Sect label="Identity">
        <Row label="Type" value={id.facility_type} />
        <Row label="Status" value={id.facility_level_operational_status} />
        <Row label="Commissioned" value={id.commissioning_or_operating_start_date} />
        {id.alternative_names?.length ? <Sub2 label="Also known as" value={id.alternative_names.join(", ")} /> : null}
      </Sect>

      <Sect label="Location">
        <Prose>{loc.site_address}</Prose>
        <Row label="Coordinates" value={coord} />
      </Sect>

      <Sect label="Group memberships">
        {c.physical_entity_node_group_memberships.map((g, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: warmWhite }}>{g.group_name}</span>
            <span style={{ fontSize: 8.5, color: g.qualification_status === "qualified" ? "#7fae6f" : "#c8a24a", fontFamily: MONO, marginLeft: 6 }}>{g.qualification_status}</span>
            <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{g.group_id}</p>
          </div>
        ))}
      </Sect>

      <Sect label="Ownership & operation">
        {c.owners.map((o, i) => <Row key={"o" + i} label="Owner" value={`${o.organization_name}${o.ownership_percentage != null ? ` (${o.ownership_percentage}%)` : ""}`} />)}
        {c.operators.map((o, i) => <Row key={"op" + i} label="Operator" value={`${o.organization_name}${o.operator_relationship_type ? ` · ${o.operator_relationship_type}` : ""}`} />)}
      </Sect>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Operations ({ops.operations.length})</p>
        <Prose>{ops.operating_configuration}</Prose>
      </div>
      {ops.operations.map((op, i) => <OperationBlock key={i} op={op} />)}

      <Sect label="Record metadata">
        <Row label="Record" value={ops.facility_record_metadata.record_status} />
        <Row label="Confidence" value={ops.facility_record_metadata.overall_confidence} />
        <Row label="Updated" value={ops.facility_record_metadata.last_updated_date} />
      </Sect>
    </>
  );
}

function OperationBlock({ op }: { op: FEOperation }) {
  return (
    <div style={{ marginTop: 12, padding: "10px 11px", borderRadius: 5, background: "rgb(28,26,24)", border: "1px solid rgb(45,41,39)" }}>
      <p style={{ fontSize: 11.5, color: warmWhite, margin: 0, fontFamily: SERIF }}>{op.operation_name}</p>
      <p style={{ fontSize: 8, color: accent, margin: "1px 0 0 0", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>{op.operation_category} · {op.physical_entity_node_group_id} · {op.operational_status}</p>
      <p style={{ fontSize: 10.5, color: "rgb(172,172,172)", margin: "6px 0 0 0", lineHeight: 1.5 }}>{op.main_physical_function}</p>

      <MicroHead>Inputs</MicroHead>
      {op.inputs.map((x, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#c9c1b4" }}>{x.input_name}</span>
          <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{x.input_role} · {x.actual_input_quantity !== "Not disclosed" ? `${x.actual_input_quantity}` : "qty not disclosed"}{x.source_physical_entity_ids?.filter(s => s !== "Unknown").length ? ` ← ${x.source_physical_entity_ids.filter(s => s !== "Unknown").join(", ")}` : ""}</p>
        </div>
      ))}

      <MicroHead>Processes</MicroHead>
      {op.major_industrial_processes.map((p, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#c9c1b4" }}>{p.process_or_stage_name}</span>
          <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{p.actual_process_or_technology_used} → {p.output_form}</p>
        </div>
      ))}

      <MicroHead>Outputs</MicroHead>
      {op.outputs_produced.map((o, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: "#c9c1b4" }}>{o.output_name}</span>
          <span style={{ fontSize: 8, color: "#807869", fontFamily: MONO, marginLeft: 5 }}>{o.output_classification}</span>
          <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "1px 0 0 0" }}>{o.actual_output_quantity !== "Not disclosed" ? o.actual_output_quantity : "qty not disclosed"}</p>
        </div>
      ))}

      {op.operation_metrics.actual_throughput !== "Not disclosed" && (
        <p style={{ fontSize: 8.5, color: "#807869", fontFamily: MONO, margin: "6px 0 0 0" }}>metrics: {op.operation_metrics.actual_throughput} / {op.operation_metrics.total_throughput_capacity} {op.operation_metrics.quantity_unit} · util {op.operation_metrics.capacity_utilization}</p>
      )}
    </div>
  );
}

function MicroHead({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 7.5, color: "#6f695f", margin: "8px 0 3px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</p>;
}
function Sub2({ label, value }: { label: string; value: string }) {
  return <div style={{ marginTop: 4 }}><span style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span><p style={{ fontSize: 10.5, color: "rgb(172,172,172)", margin: "1px 0 0 0", lineHeight: 1.5 }}>{value}</p></div>;
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
