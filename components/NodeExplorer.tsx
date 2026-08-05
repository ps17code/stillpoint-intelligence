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

function formatTonnes(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)} Mt`;
  return `${v.toLocaleString()} t`;
}
const graph = graphJson as unknown as { classes: Record<string, AnyRec>; entities: Record<string, AnyRec>; companies: Record<string, AnyRec> };
const classes = graph.classes;
const entities = graph.entities ?? {};

type Card = { id: string; title: string; sub?: string; flag?: string; output?: string; clickable?: boolean; muted?: boolean; featured?: boolean };
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
  const feat = card.featured;
  return (
    <div
      ref={nodeRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      style={{
        padding: "6px 9px", borderRadius: 4, width: "100%", boxSizing: "border-box",
        cursor: card.clickable ? "pointer" : "default",
        background: feat ? "rgba(200, 122, 74, 0.14)" : highlighted ? "rgba(200, 122, 74, 0.1)" : card.muted ? "rgb(30,28,26)" : cardBg,
        border: feat ? `1px solid ${accent}` : highlighted ? "1px solid rgba(200, 122, 74, 0.5)" : "1px solid rgb(45, 41, 39)",
        opacity: dimmed ? 0.3 : 1, transition: "border-color 0.15s, opacity 0.15s, background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: feat || highlighted ? warmWhite : "rgb(180, 172, 160)", margin: 0, lineHeight: 1.2, fontFamily: SERIF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.title}</p>
        {card.clickable && <span style={{ fontSize: 8, color: "#666", flexShrink: 0 }}>→</span>}
      </div>
      {(card.flag || card.sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          {code && <img src={`https://flagcdn.com/16x12/${code}.png`} alt="" style={{ width: 9, height: 6, borderRadius: 1, opacity: 0.7 }} />}
          {card.sub && <span style={{ fontSize: 7, color: feat ? accent : "#706a60", fontFamily: MONO, letterSpacing: "0.03em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{card.sub}</span>}
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
function TreeCanvas({ columns, edges, onCardClick, selected }: { columns: Column[]; edges: Edge[]; onCardClick?: (id: string) => void; selected?: string | null }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered ?? selected ?? null;
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

/* ── engine result types ── */
type EngineResult = {
  input?: string;
  initialization?: AnyRec;
  class_node?: AnyRec;
  source_categories?: AnyRec[];
  upstream_nodes?: AnyRec[];
  downstream_nodes?: AnyRec[];
  error?: string;
};

export default function NodeExplorer({ onBack }: { onBack: () => void }) {
  const [drillClass, setDrillClass] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const selectedNode = selectedNodeId ? (entities[selectedNodeId] ?? classes[selectedNodeId] ?? null) : null;

  // ── terminal / engine state ──
  const [terminalInput, setTerminalInput] = useState("");
  const [running, setRunning] = useState(false);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [runResult, setRunResult] = useState<EngineResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [selKey, setSelKey] = useState<string>("created");
  const [tick, setTick] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!running) return; const id = setInterval(() => setTick(t => t + 1), 400); return () => clearInterval(id); }, [running]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [runLog, running]);
  const dots = ".".repeat((tick % 3) + 1);

  const clearResult = () => { setRunResult(null); setRunError(null); setRunLog([]); };

  async function runEngine(obj: string) {
    setRunError(null); setRunResult(null); setSelKey("created");
    setRunLog([`▶ node engine ← "${obj}"`, "  · initialization: source = de-novo · gate 1 appropriateness · gate 2 dedup", "  · self-discovery: identity · properties · functions · downstream · connected nodes"]);
    setRunning(true);
    try {
      const res = await fetch("/api/node-engine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classObject: obj }) });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || `request failed (${res.status})`);
      const result = data as EngineResult;
      const init = (result.initialization ?? {}) as AnyRec;
      if (init.rejected) {
        const g1 = (init.gate_1 as AnyRec | undefined)?.reasoning as string | undefined;
        setRunLog(l => [...l, `✗ rejected at gate 1 — ${g1 ?? "not an appropriate class node"}`]);
        setRunResult(result);
      } else {
        const cn = (result.class_node ?? {}) as AnyRec;
        const ct = (cn.class_type as string) ?? (init.proposed_class_type as string) ?? "?";
        const nd = (result.downstream_nodes ?? []).length;
        const nu = (result.source_categories ?? []).length + (result.upstream_nodes ?? []).length;
        setRunResult(result);
        setRunLog(l => [...l, `✓ created class node: ${(cn.node_name as string) ?? obj} · ${ct}`, `  ${nu} upstream/source · ${nd} downstream child node${nd === 1 ? "" : "s"}`]);
      }
    } catch (e) {
      setRunError((e as Error).message);
      setRunLog(l => [...l, `✗ ${(e as Error).message}`]);
    } finally {
      setRunning(false);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = terminalInput.trim();
    if (!v || running) return;
    setTerminalInput("");
    runEngine(v);
  };

  // ── class graph (default) ──
  const classView = useMemo(() => {
    const LAYERS: [string, string][] = [["rawmat", "Raw Material"], ["intermediate", "Intermediate"], ["component", "Component"]];
    const columns: Column[] = LAYERS.map(([t, label]) => ({
      label,
      items: Object.values(classes).filter(c => c.class_type === t).map(c => {
        let output = "";
        if (c.class_type === "rawmat") {
          const ap = (c.supply as AnyRec | undefined)?.["annual_production"] as AnyRec | undefined;
          if (ap?.value) output = `${ap.value} ${ap.unit ?? ""}`.trim();
        }
        return { id: c.class_id as string, title: c.name as string, sub: c.class_type as string, output, clickable: true };
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
    const LAYERS: [string, string[], string][] = [
      ["Source / Deposit", ["deposit"], "deposit"],
      ["Mine", ["mine"], "mine"],
      ["Smelter / Recovery", ["smelter", "recovery_plant"], "smelter"],
      ["Refiner", ["refinery"], "refinery"],
    ];
    const cardFor = (e: AnyRec): Card => {
      const ao = e.annual_output as AnyRec | undefined;
      const res = e.total_reserve as AnyRec | undefined;
      let output = "";
      if (ao?.value && Number(ao.value) > 0) output = `${ao.value} ${ao.unit ?? ""} out`.trim();
      else if (res?.value && Number(res.value) > 0) output = `${formatTonnes(Number(res.value))} reserve`;
      else if ((e.produces as AnyRec[] | undefined)?.length) output = (e.produces as AnyRec[])[0].form as string;
      const terminates = ((e.outputs as AnyRec[] | undefined) ?? []).length === 0;
      return { id: e.node_id as string, title: e.name as string, sub: e.status as string, flag: e.country as string, output, clickable: true, muted: terminates };
    };
    const columns: Column[] = LAYERS.map(([label, types]) => ({
      label,
      items: ents.filter(e => types.includes(e.node_type as string)).map(cardFor),
    }));
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

  // ── result graph (from a terminal run) ──
  const resultView = useMemo(() => {
    if (!runResult || (runResult.initialization as AnyRec | undefined)?.rejected) return null;
    const cn = (runResult.class_node ?? {}) as AnyRec;
    const src = (runResult.source_categories ?? []) as AnyRec[];
    const up = (runResult.upstream_nodes ?? []) as AnyRec[];
    const dn = (runResult.downstream_nodes ?? []) as AnyRec[];
    const upItems: Card[] = [
      ...src.map((s, i) => ({ id: `up:s${i}`, title: (s.name as string) ?? "source", sub: "source category", clickable: true })),
      ...up.map((u, i) => ({ id: `up:n${i}`, title: (u.name as string) ?? "upstream", sub: (u.class_type as string) ?? "upstream", clickable: true })),
    ];
    const created: Card = { id: "created", title: (cn.node_name as string) ?? (runResult.input as string) ?? "node", sub: (cn.class_type as string) ?? "class node", clickable: true, featured: true };
    const dnItems: Card[] = dn.map((d, i) => ({ id: `dn:${i}`, title: (d.name as string) ?? "child", sub: (d.class_type as string) ?? "child", clickable: true }));
    const columns: Column[] = [];
    if (upItems.length) columns.push({ label: src.length ? "Source Categories" : "Upstream", items: upItems });
    columns.push({ label: "Class Node (created)", items: [created] });
    if (dnItems.length) columns.push({ label: "Downstream Children", items: dnItems });
    const edges: Edge[] = [
      ...upItems.map(u => ({ from: u.id, to: "created" })),
      ...dnItems.map(d => ({ from: "created", to: d.id })),
    ];
    return { columns, edges };
  }, [runResult]);

  const rejected = Boolean((runResult?.initialization as AnyRec | undefined)?.rejected);
  const inResult = Boolean(runResult);

  const headerTitle = inResult
    ? ((runResult!.class_node as AnyRec | undefined)?.node_name as string) ?? (runResult!.input as string) ?? "Result"
    : drillClass ? entityView?.name : "Class Nodes";
  const headerKicker = inResult ? "Node Engine · Generated" : `Node Explorer${drillClass ? " · Supply Tree" : ""}`;
  const backLabel = inResult ? "Clear result" : drillClass ? "All classes" : "Back";
  const onBackClick = () => (inResult ? clearResult() : drillClass ? setDrillClass(null) : onBack());

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
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0 0" }} />
      </div>

      {/* Body: tree (left) + panel (right) */}
      <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div style={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "auto", padding: "16px 24px 24px" }}>
          {inResult ? (
            rejected ? (
              <div style={{ maxWidth: 560, padding: "24px 0" }}>
                <p style={{ fontSize: 8, color: accent, margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Rejected at Gate 1</p>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: warmWhite, margin: "0 0 8px 0" }}>&ldquo;{runResult!.input as string}&rdquo; is not an appropriate class node</h3>
                <p style={{ fontSize: 12.5, color: "rgb(172,172,172)", lineHeight: 1.6, margin: 0 }}>{((runResult!.initialization as AnyRec).gate_1 as AnyRec | undefined)?.reasoning as string ?? "The input does not fit the class-node definition (a reusable industrial object category)."}</p>
              </div>
            ) : resultView ? (
              <TreeCanvas columns={resultView.columns} edges={resultView.edges} onCardClick={(id) => setSelKey(id)} selected={selKey} />
            ) : null
          ) : !drillClass ? (
            <TreeCanvas columns={classView.columns} edges={classView.edges} onCardClick={(id) => { setSelectedNodeId(id); if (((classes[id]?.entities as string[] | undefined) ?? []).length) setDrillClass(id); }} />
          ) : entityView ? (
            entityView.count === 0
              ? <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", padding: "30px 0", fontFamily: "Inter, sans-serif" }}>No entity nodes generated for this class yet — they will appear here as the engine runs.</p>
              : <TreeCanvas columns={entityView.columns} edges={entityView.edges} onCardClick={(id) => setSelectedNodeId(id)} />
          ) : null}
        </div>

        {inResult
          ? <ClassResultPanel result={runResult!} selKey={selKey} />
          : <ResearchPanel node={selectedNode} />}
      </div>

      {/* Terminal bar */}
      <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.09)", background: "#0e0d0d" }}>
        {(runLog.length > 0 || running) && (
          <div ref={logRef} style={{ maxHeight: 118, overflowY: "auto", padding: "10px 24px 2px", fontFamily: MONO, fontSize: 10.5, lineHeight: 1.75 }}>
            {runLog.map((l, i) => (
              <div key={i} style={{ color: l.startsWith("✓") ? "#7fae6f" : l.startsWith("✗") ? "#c86a5a" : l.startsWith("▶") ? warmWhite : "#8a8378", whiteSpace: "pre-wrap" }}>{l}</div>
            ))}
            {running && <div style={{ color: accent }}>… running node initialization + self-discovery{dots}</div>}
          </div>
        )}
        <form onSubmit={onSubmit} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 24px 15px" }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: accent, flexShrink: 0 }}>stillpoint:node-engine ❯</span>
          <input
            value={terminalInput}
            onChange={e => setTerminalInput(e.target.value)}
            disabled={running}
            placeholder="enter a class object (e.g. Gallium) and press ↵ to run node init + self-discovery"
            spellCheck={false}
            autoComplete="off"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: warmWhite, fontFamily: MONO, fontSize: 12, opacity: running ? 0.5 : 1 }}
          />
          {inResult && !running && (
            <button type="button" onClick={clearResult} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 5, padding: "3px 9px", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontFamily: MONO, fontSize: 9.5 }}>clear</button>
          )}
        </form>
      </div>
    </div>
  );
}

/* ── panel for a generated class-node result ── */
function ClassResultPanel({ result, selKey }: { result: EngineResult; selKey: string }) {
  const cn = (result.class_node ?? {}) as AnyRec;
  const init = (result.initialization ?? {}) as AnyRec;

  // upstream/source detail
  if (selKey.startsWith("up:")) {
    const isSrc = selKey[3] === "s";
    const idx = Number(selKey.slice(4));
    const item = ((isSrc ? result.source_categories : result.upstream_nodes) ?? [])[idx] as AnyRec | undefined;
    if (!item) return <PanelShell />;
    return (
      <PanelShell>
        <Kicker>{isSrc ? "Source category" : "Upstream node"}</Kicker>
        <Title>{item.name as string}</Title>
        {isSrc ? (
          <>
            <Prose>{item.description as string}</Prose>
            <Sect label="Materials hosted"><Prose>{item.materials_hosted as string}</Prose></Sect>
            <Sect label="Source form"><Prose>{item.source_form as string}</Prose></Sect>
            <Sect label="Regions"><Prose>{item.regions as string}</Prose></Sect>
          </>
        ) : (
          <>
            <Row label="Class type" value={String(item.class_type ?? "")} />
            <Sect label="Relationship"><Prose>{item.relationship as string}</Prose></Sect>
          </>
        )}
      </PanelShell>
    );
  }

  // downstream child detail
  if (selKey.startsWith("dn:")) {
    const idx = Number(selKey.slice(3));
    const d = (result.downstream_nodes ?? [])[idx] as AnyRec | undefined;
    if (!d) return <PanelShell />;
    return (
      <PanelShell>
        <Kicker>Downstream child node</Kicker>
        <Title>{d.name as string}</Title>
        <Row label="Class type" value={String(d.class_type ?? "")} />
        <Sect label="Why it qualifies"><Prose>{d.why_it_qualifies as string}</Prose></Sect>
        <Sect label="Input form from parent"><Prose>{d.input_form_from_parent as string}</Prose></Sect>
        <Sect label="Grandchild candidate"><Prose>{d.grandchild_candidate as string}</Prose></Sect>
      </PanelShell>
    );
  }

  // default: the created class node — full self-discovery record
  const bi = (cn.basic_identity ?? {}) as AnyRec;
  const pi = (cn.physical_identity ?? {}) as AnyRec;
  const props = (cn.core_properties ?? []) as AnyRec[];
  const fns = (cn.functions ?? []) as AnyRec[];
  const deps = (cn.downstream_end_products ?? []) as AnyRec[];
  const scope = (cn.scope_boundary ?? {}) as AnyRec;
  const unc = (cn.uncertainties ?? []) as string[];
  const g1 = (init.gate_1 ?? {}) as AnyRec;
  const g2 = (init.gate_2 ?? {}) as AnyRec;
  const outForms = (pi.output_forms ?? []) as string[];
  const list = (v?: string[] | string) => Array.isArray(v) ? v.filter(Boolean).join(", ") : (v ?? "");

  return (
    <PanelShell>
      <Kicker>Class node · Self-discovery record</Kicker>
      <Title>{(cn.node_name as string) ?? (result.input as string)}</Title>
      <Row label="Class type" value={String(cn.class_type ?? init.proposed_class_type ?? "")} />

      <Sect label="Initialization">
        <Row label="Source" value={String(init.initialization_type ?? "de-novo")} />
        <Row label="Gate 1" value={String(g1.result ?? "pass")} />
        {g1.reasoning ? <Prose small>{g1.reasoning as string}</Prose> : null}
        <Row label="Gate 2" value={String(g2.outcome ?? g2.result ?? "pass")} />
      </Sect>

      <Sect label="Basic identity">
        {bi.alternate_names ? <Row label="Also called" value={list(bi.alternate_names as string[])} /> : null}
        {bi.abbreviations ? <Row label="Abbrev." value={list(bi.abbreviations as string[])} /> : null}
        {bi.technical_names ? <Row label="Technical" value={list(bi.technical_names as string[])} /> : null}
        {bi.chemical_formula ? <Row label="Formula" value={String(bi.chemical_formula)} /> : null}
      </Sect>

      <Sect label="Physical identity">
        <Prose>{pi.physical_form_and_appearance as string}</Prose>
        {pi.source_form ? <Sub label="Source form"><Prose small>{pi.source_form as string}</Prose></Sub> : null}
        {outForms.length ? <Sub label="Output forms"><Prose small>{list(outForms)}</Prose></Sub> : null}
        {pi.source_to_sold_process ? <Sub label="Source → sold"><Prose small>{pi.source_to_sold_process as string}</Prose></Sub> : null}
      </Sect>

      {props.length > 0 && (
        <Sect label="Core properties">
          {props.map((p, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <span style={{ fontSize: 11, color: warmWhite }}>{p.property as string}</span>
              <Prose small>{p.description as string}</Prose>
            </div>
          ))}
        </Sect>
      )}

      {fns.length > 0 && (
        <Sect label="Functions">
          {fns.map((f, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <span style={{ fontSize: 11, color: warmWhite }}>{f.function as string}</span>
              <Prose small>{f.why_it_matters as string}</Prose>
              {f.properties_used ? <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "2px 0 0 0" }}>← {list(f.properties_used as string)}</p> : null}
            </div>
          ))}
        </Sect>
      )}

      {deps.length > 0 && (
        <Sect label="Downstream end-products">
          {deps.map((d, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 11, color: warmWhite }}>{d.function_realization_object as string}</span>
                <span style={{ fontSize: 8, color: accent, fontFamily: MONO, textTransform: "uppercase" }}>{d.class_type as string}</span>
              </div>
              <Prose small>{d.specific_role as string}</Prose>
              <p style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, margin: "2px 0 0 0" }}>
                {[d.node_derived_form, d.host_system, d.vertical].filter(Boolean).join(" · ") as string}
              </p>
            </div>
          ))}
        </Sect>
      )}

      {Boolean(scope.starting || scope.ending) && (
        <Sect label="Scope boundary">
          {scope.starting ? <Sub label="Start"><Prose small>{scope.starting as string}</Prose></Sub> : null}
          {scope.ending ? <Sub label="End"><Prose small>{scope.ending as string}</Prose></Sub> : null}
        </Sect>
      )}

      {unc.length > 0 && (
        <Sect label="Uncertainties">
          {unc.map((u, i) => <Prose key={i} small>• {u}</Prose>)}
        </Sect>
      )}
    </PanelShell>
  );
}

/* small panel primitives */
function PanelShell({ children }: { children?: React.ReactNode }) {
  return <div style={{ flex: "0 0 380px", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgb(20,20,20)", overflowY: "auto", padding: "18px 20px" }}>{children ?? <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Select a node.</p>}</div>;
}
function Kicker({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</p>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 17, fontWeight: 400, color: warmWhite, margin: "0 0 10px 0" }}>{children}</h3>;
}
function Prose({ children, small }: { children: React.ReactNode; small?: boolean }) {
  if (!children) return null;
  return <p style={{ fontSize: small ? 11 : 12.5, color: "rgb(172, 172, 172)", lineHeight: 1.6, margin: "2px 0 0 0", whiteSpace: "pre-wrap" }}>{children}</p>;
}
function Sect({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontSize: 8, color: "#666", margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
      {children}
    </div>
  );
}
function Sub({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 6 }}>
      <span style={{ fontSize: 8.5, color: "#6f695f", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      {children}
    </div>
  );
}

function ResearchPanel({ node }: { node: AnyRec | null }) {
  const summary = node ? ((node.deposit_short_description as string) ?? (node.description as string) ?? "") : "";
  const isEntity = node?.kind === "entity";
  const owner = (node?.owner as AnyRec[] | undefined)?.map(o => o.company_name).join(", ");
  const operator = (node?.operator as AnyRec | undefined)?.company_name as string | undefined;
  const reserve = node?.total_reserve as AnyRec | undefined;
  const output = node?.annual_output as AnyRec | undefined;
  const produces = (node?.produces as AnyRec[] | undefined) ?? [];
  const hasReserve = reserve?.value != null && Number(reserve.value) > 0;
  const hasOutput = output?.value != null && Number(output.value) > 0;
  const terminates = isEntity && ((node?.outputs as AnyRec[] | undefined) ?? []).length === 0;
  const sources: { name: string; url?: string }[] = [];
  const pushSrc = (s: AnyRec | undefined) => { if (s?.name && !sources.some(x => x.name === s.name)) sources.push({ name: s.name as string, url: s.url as string }); };
  pushSrc(reserve?.source as AnyRec | undefined);
  ((output?.sources as AnyRec[] | undefined) ?? []).forEach(pushSrc);
  produces.forEach(p => pushSrc(p.source as AnyRec | undefined));

  return (
    <div style={{ flex: "0 0 360px", borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgb(20,20,20)", overflowY: "auto", padding: "18px 20px" }}>
      {!node ? (
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif", lineHeight: 1.5, margin: 0 }}>Select a node to read the research-stage summary — or run the node engine from the terminal below.</p>
      ) : (
        <>
          <p style={{ fontSize: 8, color: "#666", margin: "0 0 4px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>{(node.node_type as string) ?? (node.class_type as string) ?? node.kind} · Research summary</p>
          <h3 style={{ fontSize: 17, fontWeight: 400, color: warmWhite, margin: "0 0 4px 0" }}>{node.name as string}</h3>
          {(node.location || node.country) && <p style={{ fontSize: 11, color: "#807870", margin: "0 0 12px 0" }}>{[node.location, node.country].filter(Boolean).join(" · ") as string}</p>}

          {isEntity && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {node.status ? <Row label="Status" value={String(node.status)} /> : null}
              <Row label="Feeds chain" value={terminates ? "Terminates (no Ge output)" : "Yes → germanium market"} />
              {owner ? <Row label="Owner" value={owner as string} /> : null}
              {operator && operator !== owner ? <Row label="Operator" value={operator} /> : null}
              {hasReserve ? <Row label="Reserve" value={`${formatTonnes(Number(reserve!.value))} (${reserve!.basis})`} /> : <Row label="Reserve" value="not quantified" />}
              {hasOutput
                ? <Row label="Annual output" value={`${output!.value} ${output!.unit ?? ""}${output!.year ? ` (${output!.year})` : ""}`} />
                : <Row label="Annual output" value={String(output?.basis ?? "not quantified").replace(/_/g, " ")} />}
            </div>
          )}

          <p style={{ fontSize: 12.5, color: "rgb(172, 172, 172)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{summary || "No research summary recorded for this node."}</p>

          {sources.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 8, color: "#666", margin: "0 0 6px 0", fontFamily: MONO, letterSpacing: "0.08em", textTransform: "uppercase" }}>Sources</p>
              {sources.map((s, i) => (
                <p key={i} style={{ fontSize: 10, color: "#807870", margin: "0 0 5px 0", lineHeight: 1.4 }}>
                  {s.url ? <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "#8ab0c0", textDecoration: "none" }}>{s.name}</a> : s.name}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
      <span style={{ fontSize: 9, color: "#706a60", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, color: warmWhite, textAlign: "right" }}>{value}</span>
    </div>
  );
}
