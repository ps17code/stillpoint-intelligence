"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

// Data
import nodesRaw    from "@/data/nodes.json";
import panelsRaw   from "@/data/panels.json";
import chainsRaw   from "@/data/chains.json";

// Components
import Spine        from "@/components/Spine";
import TreeMap      from "@/components/TreeMap";
import AnchorSpine  from "@/components/AnchorSpine";
import TopBarV2     from "@/components/TopBarV2";
import StatusBar    from "@/components/StatusBar";
import NodeModal    from "@/components/NodeModal";
import BriefModal   from "@/components/BriefModal";
import SupplyChainMap from "@/components/SupplyChainMap";
import Tooltip      from "@/components/Tooltip";
import SidebarPanel from "@/components/SidebarPanel";

// Geometry
import {
  buildRawGeometry, buildCompGeometry,
  buildSubGeometry, buildEUGeometry,
  computeRawSvgWidth, computeCompSvgWidth, computeSubSvgWidth, computeEUSvgWidth,
  toSVG, type TreeGeometry, type LayerGeometry,
} from "@/lib/treeGeometry";

// Types
import type { AppState, SpineSelection, NodeData } from "@/types";

const NODES   = nodesRaw  as unknown as Record<string, NodeData>;
const PANELS  = panelsRaw as any;
const CHAINS  = chainsRaw as any;

const TOP_BAR_H    = 36;
const STATUS_BAR_H = 28;
const SIDEBAR_W    = 320;

/** Viewport Y where tree graphic starts — just at the base of the map hero section */
function topAnchorPx(): number {
  if (typeof window === "undefined") return 600;
  return window.innerHeight - STATUS_BAR_H;
}

// Layer node-type colors for the floating overlay
const LAYER_COLORS: Record<string, string> = {
  "Deposits":            "#B8975A",
  "Miners":              "#7DA06A",
  "Refiners":            "#A07DAA",
  "GeCl₄ Suppliers":    "#B8975A",
  "Fiber Manufacturers": "#7DA06A",
  "Cable Assemblers":    "#7DA06A",
  "Cable Types":         "#A07DAA",
  "Integration":         "#B8975A",
  "Hyperscale":          "#7DA06A",
};

// Maps globe child IDs → SPINE_TREE keys
const CHILD_TO_SPINE: Record<string, string> = {
  "germanium":     "Germanium",
  "gecl4":         "GeO₂ / GeCl₄",
  "fiber-optic":   "Fiber Optics",
  "ai-datacenter": "AI Datacenter",
};

export default function Home() {
  // ── App state ────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>(0);
  const [sel, setSel] = useState<SpineSelection>({ raw: null, comp: null, sub: null, eu: null });

  // ── Globe selection autoload ──────────────────────────────────────
  const pendingAutoLoad = useRef<AppState | null>(null);

  // ── Geometry ─────────────────────────────────────────────────────
  const [geometry,  setGeometry]  = useState<TreeGeometry | null>(null);
  const [layers,    setLayers]    = useState<LayerGeometry[]>([]);
  const [svgWidth,  setSvgWidth]  = useState(1000);
  const [svgHeight, setSvgHeight] = useState(900);

  // ── Scroll tracking ───────────────────────────────────────────────
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Panel ─────────────────────────────────────────────────────────
  const [treeCollapsed, setTreeCollapsed] = useState(false);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [briefOpen, setBriefOpen] = useState(false);

  // ── Tooltip ───────────────────────────────────────────────────────
  const [tipKey,  setTipKey]  = useState<string | null>(null);
  const [tipSvgX, setTipSvgX] = useState(0);
  const [tipSvgY, setTipSvgY] = useState(0);
  const overNode = useRef(false);
  const overTip  = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Window height ─────────────────────────────────────────────────
  const [windowHeight, setWindowHeight] = useState(900);
  useEffect(() => {
    const update = () => setWindowHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Top anchor (where tree graphic starts in viewport) ────────────
  const [topAnchor, setTopAnchor] = useState(600);
  useEffect(() => {
    const update = () => setTopAnchor(topAnchorPx());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Re-build tree geometry on resize
  useEffect(() => {
    if (appState === 0) return;
    let t: ReturnType<typeof setTimeout>;
    const rebuild = () => { clearTimeout(t); t = setTimeout(() => buildGeometryFromAnchorEl(appState), 120); };
    window.addEventListener("resize", rebuild);
    return () => { clearTimeout(t); window.removeEventListener("resize", rebuild); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, sel.raw, sel.comp, sel.sub, sel.eu]);

  useEffect(() => { setTreeCollapsed(false); setBriefOpen(false); }, [appState]);

  // ── Globe selection autoload (mount) ─────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("globeSelection");
    if (!stored) return;
    sessionStorage.removeItem("globeSelection");
    const gs = JSON.parse(stored) as { raw: string | null; comp: string | null; sub: string | null; eu: string | null };
    const newSel: SpineSelection = {
      raw:  gs.raw  ? (CHILD_TO_SPINE[gs.raw]  ?? gs.raw)  : null,
      comp: gs.comp ? (CHILD_TO_SPINE[gs.comp] ?? gs.comp) : null,
      sub:  gs.sub  ? (CHILD_TO_SPINE[gs.sub]  ?? gs.sub)  : null,
      eu:   gs.eu   ? (CHILD_TO_SPINE[gs.eu]   ?? gs.eu)   : null,
    };
    const targetState: AppState = newSel.eu ? 4 : newSel.sub ? 3 : newSel.comp ? 2 : newSel.raw ? 1 : 0;
    if (targetState === 0) return;
    setSel(newSel);
    pendingAutoLoad.current = targetState;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Globe autoload: trigger state transition after sel updates ────
  useEffect(() => {
    if (pendingAutoLoad.current === null) return;
    const targetState = pendingAutoLoad.current;
    // Wait until the relevant sel field is populated (first render cycle has null values)
    if (targetState === 1 && !sel.raw) return;
    if (targetState === 2 && !sel.comp) return;
    if (targetState === 3 && !sel.sub) return;
    if (targetState === 4 && !sel.eu) return;
    pendingAutoLoad.current = null;
    if (targetState === 1) {
      setAppState(1);
      afterSpineTransition(() => buildGeometryFromAnchorEl(1));
    } else {
      setAppState(targetState);
      setTimeout(() => buildGeometryFromAnchorEl(targetState), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  // ── Spine dropdown options ────────────────────────────────────────
  const spineOptions = {
    raw:  Object.keys(CHAINS.SPINE_TREE),
    comp: sel.raw
      ? Object.keys(CHAINS.SPINE_TREE[sel.raw] || {})
      : Array.from(new Set(Object.values(CHAINS.SPINE_TREE).flatMap((r: any) => Object.keys(r)))),
    sub:  sel.comp
      ? Object.keys((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp] || {})
      : Array.from(new Set(Object.values(CHAINS.SPINE_TREE).flatMap((r: any) => Object.values(r)).flatMap((c: any) => Object.keys(c)))),
    eu:   sel.sub
      ? ((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp!] || {})[sel.sub] || []
      : Array.from(new Set(Object.values(CHAINS.SPINE_TREE).flatMap((r: any) => Object.values(r)).flatMap((c: any) => Object.values(c)).flat())),
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const schedHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!overNode.current && !overTip.current) setTipKey(null);
    }, 80);
  }, []);

  function handleNodeHover(key: string, svgX: number, svgY: number) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    overNode.current = true;
    setTipKey(key); setTipSvgX(svgX); setTipSvgY(svgY);
  }
  function handleNodeLeave() { overNode.current = false; schedHide(); }
  function handleTipEnter()  { overTip.current  = true;  if (hideTimer.current) clearTimeout(hideTimer.current); }
  function handleTipLeave()  { overTip.current  = false; schedHide(); }
  function handleNodeClick(key: string) { if (NODES[key]) setSelectedNode(key); }
  function handleDeepDive()  { if (!tipKey || !NODES[tipKey]) return; setTipKey(null); setSelectedNode(tipKey); }

  // ── Build tree geometry ───────────────────────────────────────────
  // Tree grows DOWNWARD from topY. For in-flow rendering we set topY to
  // a small value (top padding) so nodes start near the SVG top.
  // viewBoxH = topY + (layers-1)*gap + bottomPad — the SVG pixel height
  // is set equal to viewBoxH so 1 SVG unit = 1 px, no empty space.
  function buildGeometryFromAnchorEl(level: AppState) {
    let newSvgWidth = 1000;
    if      (level === 1 && sel.raw)  { const c = CHAINS.RAW_DATA[sel.raw];  if (c) newSvgWidth = computeRawSvgWidth(c); }
    else if (level === 2 && sel.comp) { const c = CHAINS.COMP_DATA[sel.comp]; if (c) newSvgWidth = computeCompSvgWidth(c); }
    else if (level === 3 && sel.sub)  { const c = CHAINS.SUB_DATA[sel.sub];   if (c) newSvgWidth = computeSubSvgWidth(c); }
    else if (level === 4 && sel.eu)   { const c = CHAINS.EU_DATA[sel.eu];     if (c) newSvgWidth = computeEUSvgWidth(c); }
    setSvgWidth(newSvgWidth);

    const topY      = 80;                            // SVG units of padding above first layer
    const bottomPad = 80;                            // SVG units below last layer
    const gap       = level === 1 ? 180 : 170;       // matches geometry defaults
    const layerCount = level === 1 ? 5 : level === 4 ? 4 : 3;
    const viewBoxH  = topY + (layerCount - 1) * gap + bottomPad;
    setSvgHeight(viewBoxH);

    const ancX = newSvgWidth / 2;

    let geo: TreeGeometry | null = null;
    if (level === 1 && sel.raw)  { const c = CHAINS.RAW_DATA[sel.raw];  if (c) geo = buildRawGeometry(c, ancX, topY); }
    else if (level === 2 && sel.comp) { const c = CHAINS.COMP_DATA[sel.comp]; if (c) geo = buildCompGeometry(c, ancX, topY); }
    else if (level === 3 && sel.sub)  { const c = CHAINS.SUB_DATA[sel.sub];   if (c) geo = buildSubGeometry(c, ancX, topY); }
    else if (level === 4 && sel.eu)   { const c = CHAINS.EU_DATA[sel.eu];     if (c) geo = buildEUGeometry(c, ancX, topY); }
    if (geo) { setGeometry(geo); setLayers(geo.layers); }
  }

  function afterSpineTransition(callback: () => void) {
    const el = document.getElementById("page-spine");
    if (!el) { setTimeout(callback, 1000); return; }
    let done = false;
    const finish = () => { if (done) return; done = true; el.removeEventListener("transitionend", onEnd); requestAnimationFrame(callback); };
    const onEnd = (e: Event) => { const te = e as TransitionEvent; if (te.target === el && te.propertyName === "transform") finish(); };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, 1200);
  }

  // ── State transitions ─────────────────────────────────────────────
  function goToRaw()  { if (!sel.raw)  return; setAppState(1); afterSpineTransition(() => buildGeometryFromAnchorEl(1)); }
  function goToComp() { if (!sel.comp) return; setGeometry(null); setAppState(2); setTimeout(() => buildGeometryFromAnchorEl(2), 800); }
  function goToSubFromSpine() { if (!sel.sub) return; setGeometry(null); setAppState(3); setTimeout(() => buildGeometryFromAnchorEl(3), 750); }
  function goToEUFromSpine()  { if (!sel.eu)  return; setGeometry(null); setAppState(4); setTimeout(() => buildGeometryFromAnchorEl(4), 750); }
  function goToSub() { setGeometry(null); setAppState(3); setTimeout(() => buildGeometryFromAnchorEl(3), 800); }
  function goToEU()  { setGeometry(null); setAppState(4); setTimeout(() => buildGeometryFromAnchorEl(4), 800); }

  function backToSpine() { setAppState(0); setGeometry(null); setLayers([]); setTipKey(null); }
  function backToRaw()   { setGeometry(null); setLayers([]); setAppState(1); afterSpineTransition(() => buildGeometryFromAnchorEl(1)); }
  function backToComp()  { setGeometry(null); setLayers([]); setAppState(2); setTimeout(() => buildGeometryFromAnchorEl(2), 800); }
  function backToSub()   { setGeometry(null); setLayers([]); setAppState(3); setTimeout(() => buildGeometryFromAnchorEl(3), 800); }

  function handleSelect(level: "raw" | "comp" | "sub" | "eu", value: string) {
    setSel(prev => {
      const next = { ...prev, [level]: value };
      if (level === "raw")  { next.comp = null; next.sub = null; next.eu = null; }
      if (level === "comp") { next.sub  = null; next.eu = null; }
      if (level === "sub")  { next.eu   = null; }
      return next;
    });
  }

  // ── Derived data ──────────────────────────────────────────────────
  const currentThesis =
    appState === 1 ? PANELS.rawIntro?.thesis :
    appState === 2 ? PANELS.compIntro?.thesis :
    appState === 3 ? PANELS.subIntro?.thesis :
    appState === 4 ? PANELS.euIntro?.thesis : null;

  const currentBrief =
    appState === 1 ? PANELS.rawIntro?.brief :
    appState === 2 ? PANELS.compIntro?.brief :
    appState === 3 ? PANELS.subIntro?.brief :
    appState === 4 ? PANELS.euIntro?.brief : null;

  const currentBriefStats =
    appState === 1 ? PANELS.rawIntro?.briefStats :
    appState === 2 ? PANELS.compIntro?.briefStats :
    appState === 3 ? PANELS.subIntro?.briefStats :
    appState === 4 ? PANELS.euIntro?.briefStats : null;

  const currentPageTitle =
    appState === 1 ? `${sel.raw  || "Germanium"} · Raw Material Layer` :
    appState === 2 ? `${sel.comp || "GeO₂ / GeCl₄"} · Component Layer` :
    appState === 3 ? `${sel.sub  || "Fiber Optics"} · Subsystem Layer` :
    appState === 4 ? `${sel.eu   || "AI Datacenter"} · End Use Layer` : "";

  const supplyMapLabel =
    appState === 1 ? "Germanium Tree" :
    appState === 2 ? `${sel.comp || "GeO₂ / GeCl₄"} Tree` :
    appState === 3 ? "Fiber Optics Tree" :
    appState === 4 ? "End Use Tree" : "";

  const worldMapTitle =
    appState === 1 ? "Germanium Supply Map" :
    appState === 2 ? `${sel.comp || "GeO₂ / GeCl₄"} Supply Map` :
    appState === 3 ? "Fiber Optics Supply Map" :
    appState === 4 ? "End Use Supply Map" : "";

  const chainLabel =
    appState === 1 ? (sel.raw  || "Germanium") :
    appState === 2 ? (sel.comp || "GeO₂ / GeCl₄") :
    appState === 3 ? (sel.sub  || "Fiber Optics") :
    appState === 4 ? (sel.eu   || "AI Datacenter") : "";

  function getLayerPanels(state: AppState): Record<string, unknown> {
    if (state === 4) return PANELS.euLayers || {};
    return PANELS.layers || {};
  }

  // ── Tree sizing ───────────────────────────────────────────────────
  const treeLayerCount = appState === 1 ? 5 : appState === 4 ? 4 : 3;
  const treePixelHeight = ((treeLayerCount - 1) * 180 / 1000) * windowHeight;
  const bandPadTop    = 20;
  const bandPadBottom = appState === 1 ? 120 : 60;
  const labelHeight   = 124;
  const bandTop       = topAnchor - bandPadTop - labelHeight;
  const bandHeight    = bandPadTop + labelHeight + treePixelHeight + bandPadBottom;
  const collapsedBandHeight = 84;
  const insightsTop   = treeCollapsed ? bandTop + collapsedBandHeight : bandTop + bandHeight;

  // Map hero height in pixels (for page flow)
  const mapHeroH = windowHeight - TOP_BAR_H - STATUS_BAR_H;


  // Total document height: top bar area + map hero + tree section + some overflow
  const totalPageHeight = appState > 0
    ? TOP_BAR_H + mapHeroH + (bandHeight + 300)
    : 0;

  // Layer label config for floating overlay
  const layerLabels: { name: string; color: string }[] =
    appState === 1 ? [
      { name: "Deposits",  color: "#B8975A" },
      { name: "Miners",    color: "#7DA06A" },
      { name: "Refiners",  color: "#A07DAA" },
    ] :
    appState === 2 ? [
      { name: "GeCl₄ Suppliers",    color: "#B8975A" },
      { name: "Fiber Manufacturers", color: "#7DA06A" },
    ] :
    appState === 3 ? [
      { name: "Cable Assemblers",  color: "#7DA06A" },
      { name: "Cable Types",       color: "#A07DAA" },
    ] :
    appState === 4 ? [
      { name: "Integration", color: "#B8975A" },
      { name: "Hyperscale",  color: "#7DA06A" },
    ] : [];

  return (
    <main style={{
      width: "100%",
      minHeight: "100vh",
      background: appState > 0 ? "#1A1917" : "var(--bg)",
    }}>

      {/* Grain overlay */}
      <div className="grain" />

      {/* ── HOME STATE (0) ───────────────────────────────────────── */}
      {appState === 0 && (
        <Spine
          state="default"
          selection={sel}
          options={spineOptions}
          onSelect={handleSelect}
          onCubeClick={goToRaw}
          onSphereClick={goToComp}
          onPyramidClick={goToSubFromSpine}
          onCylinderClick={goToEUFromSpine}
        />
      )}

      {/* ── ACTIVE STATES (1–4) ──────────────────────────────────── */}
      {appState > 0 && (
        <>
          {/* Nav bar — fixed at top */}
          <TopBarV2
            selection={sel}
            activeState={appState}
            options={spineOptions}
            onSelect={handleSelect}
            onNodeClick={level => {
              if (level === "raw"  && sel.raw)  goToRaw();
              if (level === "comp" && sel.comp) goToComp();
              if (level === "sub"  && sel.sub)  goToSub();
              if (level === "eu"   && sel.eu)   goToEU();
            }}
            onHome={backToSpine}
            docId={`GE-${appState === 1 ? "RAW" : appState === 2 ? "COMP" : appState === 3 ? "SUB" : "EU"}-001 · PROPRIETARY`}
          />

          {/* Page grid: left content | right sidebar — both scroll together */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `1fr ${SIDEBAR_W}px`,
            paddingTop: TOP_BAR_H,
          }}>

            {/* ── LEFT COLUMN: thesis → map → tree → status ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>

              {/* THESIS BLOCK */}
              {currentThesis && (
                <div style={{ background: appState === 2 ? "#000" : "#282828", padding: "32px 36px 36px" }}>
                  <div style={{
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: appState === 2 ? 25 : 23,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.25,
                    marginBottom: appState === 2 ? 14 : 16,
                  }}>
                    {chainLabel}
                  </div>
                  {appState === 2 ? (
                    <>
                      <p style={{
                        fontFamily: "Inter, -apple-system, sans-serif",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.8,
                        margin: 0,
                      }}>
                        Germanium doesn&apos;t go into fiber as a metal. It has to be converted into a chemical — germanium tetrachloride — at{" "}
                        <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>99.999999% purity</strong>
                        , then vaporized and deposited layer by layer into glass preforms that are drawn into fiber strand. The process{" "}
                        <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>loses two-thirds of the germanium input</strong>
                        . Fewer than six facilities on earth can produce the chemical.{" "}
                        <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Only one serves the west.</strong>
                        {" "}And over half of its input comes from recycling the waste of the same fiber manufacturers it supplies.
                      </p>
                      {/* Stats row */}
                      <div style={{ display: "inline-block", borderTop: "0.5px dashed rgba(255,255,255,0.26)", marginTop: 20, paddingTop: 16 }}>
                      <div style={{ display: "flex", alignItems: "baseline", marginBottom: 7 }}>
                        {([
                          { value: "87t",   unit: "GeO₂ / yr",    label: "GERMANIUM INPUT",    padLeft: 0,  padRight: 24 },
                          { value: "168t",  unit: "GeCl₄ / yr",   label: "CHEMICAL PRODUCED",  padLeft: 24, padRight: 24 },
                          { value: "~500M", unit: "fiber-km / yr", label: "STRAND OUTPUT",      padLeft: 24, padRight: 0  },
                        ] as const).map(({ value, unit, label, padLeft, padRight }, i) => (
                          <React.Fragment key={label}>
                            {i > 0 && (
                              <div style={{ width: "0.5px", height: 40, background: "rgba(255,255,255,0.06)", flexShrink: 0, alignSelf: "center" }} />
                            )}
                            <div style={{ paddingLeft: padLeft, paddingRight: padRight, display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>{value}</div>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 8, color: "rgba(255,255,255,0.45)", lineHeight: 1.3 }}>{unit}</span>
                                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.04em", lineHeight: 1.3 }}>{label}</span>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      </div>
                    </>
                  ) : (
                  <div style={{
                    fontFamily: "Inter, -apple-system, sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.75,
                    maxWidth: "min(1000px, 95%)",
                    marginBottom: 18,
                  }}>
                    {appState === 1 ? (
                      <>
                        Germanium is a trace metal recovered as a byproduct of zinc smelting and coal processing — <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>never mined on its own</strong>. It is the critical dopant in fiber optic cables, the lens material in infrared imaging systems, the substrate for satellite solar cells, and a key input in advanced semiconductors. There are 8 deposits globally with economically viable germanium concentrations, <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>5 of which are in China</strong>. Roughly 130–140 tonnes per year is extracted and refined as primary supply, with another 60–70 tonnes recovered through recycling — dominated by Umicore in Belgium and 5N Plus in Canada. Of the ~220 tonnes total, <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>only 65–85 tonnes is reliably accessible to western industry. Fiber optics alone requires 77–97 tonnes per year.</strong>
                      </>
                    ) : currentThesis}
                  </div>
                  )}
                  <button
                    onClick={() => { window.location.href = "/germanium/report"; }}
                    style={{
                      fontFamily: "'Geist Mono', 'Courier New', monospace",
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: "rgb(37,66,82)",
                      border: "none",
                      cursor: "pointer",
                      padding: 10,
                      borderRadius: 5,
                      transition: "opacity 0.15s",
                      display: "block",
                      color: "#fff",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    Read Full Analysis →
                  </button>
                </div>
              )}

              {/* MAP SECTION — flex:1 so it fills remaining left-column height */}
              <div style={{
                flex: 1,
                minHeight: 400,
                position: "relative",
                background: appState === 2 ? "rgba(37,66,82,0.15)" : "#3A3835",
              }}>
                <SupplyChainMap
                  chainState={appState as 1|2|3|4}
                  rawSelection={sel.raw || undefined}
                  compSelection={sel.comp || undefined}
                  subSelection={sel.sub || undefined}
                  euSelection={sel.eu || undefined}
                  fillContainer
                  mapBg={appState === 2 ? "rgba(37,66,82,0.15)" : undefined}
                />
                {/* World map title */}
                <div style={{
                  position: "absolute",
                  top: 18,
                  left: 36,
                  fontFamily: "'Geist Mono', 'Courier New', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  pointerEvents: "none",
                  zIndex: 5,
                }}>
                  {worldMapTitle}
                </div>
                <button
                  onClick={() => setTreeCollapsed(prev => !prev)}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    fontFamily: "'Geist Mono', 'Courier New', monospace",
                    fontSize: 7,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    background: "rgba(0,0,0,0.25)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    padding: "4px 10px",
                    cursor: "pointer",
                    zIndex: 10,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                >
                  {treeCollapsed ? "show tree +" : "hide tree ×"}
                </button>
              </div>

            </div>{/* end left column */}

            {/* ── RIGHT SIDEBAR — scrolls with page ── */}
            <div style={{
              background: "#F5F3EE",
              borderLeft: "0.5px solid #DDD9D2",
            }}>
              <SidebarPanel chainState={appState} />
            </div>

          </div>{/* end grid */}

          {/* ── TREE SECTION — full width below grid ── */}
          {!treeCollapsed && (
            <div style={{ paddingBottom: 40 }}>
              <div style={{
                padding: "24px 36px 16px",
                background: "#1A1917",
                borderTop: "0.5px solid rgba(255,255,255,0.06)",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}>
                <div style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.9)",
                }}>
                  {supplyMapLabel}
                </div>
                <button
                  onClick={() => setBriefOpen(true)}
                  style={{
                    fontFamily: "'Geist Mono', 'Courier New', monospace",
                    fontSize: 8,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgb(227,202,159)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.65")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Read about each layer →
                </button>
              </div>
              <TreeMap
                geometry={geometry}
                nodes={NODES}
                layerConfig={CHAINS.layerConfig}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
                onNodeHover={handleNodeHover}
                onNodeLeave={handleNodeLeave}
                onNodeClick={handleNodeClick}
                onLayerClick={() => {}}
                layerPanels={getLayerPanels(appState)}
              />
            </div>
          )}

          {/* STATUS BAR */}
          <StatusBar />
        </>
      )}

      {/* ── AnchorSpine (legacy, hidden) ────────────────────────── */}
      {false && appState >= 2 && <AnchorSpine id="comp-spine" topPx={topAnchor} visible={appState === 2} nodes={[{ label: sel.comp || "GeO₂ / GeCl₄", shape: "sphere" as const }]} anchorId="comp-anchor-shape" />}

      {/* ── Tooltip ─────────────────────────────────────────────── */}
      <Tooltip
        nodeKey={tipKey}
        nodeData={tipKey ? NODES[tipKey] : null}
        svgX={tipSvgX}
        svgY={tipSvgY}
        onDeepDive={handleDeepDive}
        onMouseEnter={handleTipEnter}
        onMouseLeave={handleTipLeave}
      />

      {/* ── Brief modal ─────────────────────────────────────────── */}
      <BriefModal
        isOpen={briefOpen}
        title={chainLabel}
        paragraphs={currentBrief ?? []}
        stats={currentBriefStats ?? []}
        onClose={() => setBriefOpen(false)}
      />

      {/* ── Node modal ──────────────────────────────────────────── */}
      <NodeModal
        nodeKey={selectedNode}
        allNodes={NODES}
        layers={layers}
        chainLabel={chainLabel}
        onClose={() => setSelectedNode(null)}
        onNavigate={key => setSelectedNode(key)}
      />

    </main>
  );
}
