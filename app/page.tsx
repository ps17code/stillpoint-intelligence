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
import Breadcrumb        from "@/components/Breadcrumb";
import HorizontalSpine   from "@/components/HorizontalSpine";
import NodeModal         from "@/components/NodeModal";
import BriefModal        from "@/components/BriefModal";
import SupplyChainMap    from "@/components/SupplyChainMap";
import Tooltip      from "@/components/Tooltip";
import InsightsSection  from "@/components/InsightsSection";
import InsightsColumn   from "@/components/InsightsColumn";

// Geometry
import {
  buildRawGeometry, buildCompGeometry,
  buildSubGeometry, buildEUGeometry,
  computeRawSvgWidth,
  toSVG, type TreeGeometry, type LayerGeometry,
} from "@/lib/treeGeometry";

// Types
import type { AppState, SpineSelection, NodeData } from "@/types";

// Cast JSON imports
const NODES   = nodesRaw  as unknown as Record<string, NodeData>;
const PANELS  = panelsRaw as any;
const CHAINS  = chainsRaw as any;

// ── TOP ANCHOR: document Y where tree top should appear ───────────
// = thesis box bottom + 144px (exact height of supply map header section above tree)
function topAnchorPx(thesisEl: HTMLElement | null): number {
  if (typeof window === "undefined") return 600;
  const thesisBottom = thesisEl ? thesisEl.getBoundingClientRect().bottom : 500;
  return thesisBottom + 144;
}

export default function Home() {
  // ── App state ────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>(0);
  const [sel, setSel] = useState<SpineSelection>({ raw: null, comp: null, sub: null, eu: null });

  // ── Geometry ─────────────────────────────────────────────────────
  const [geometry,  setGeometry]  = useState<TreeGeometry | null>(null);
  const [layers,    setLayers]    = useState<LayerGeometry[]>([]);
  const [svgWidth,  setSvgWidth]  = useState(1000);

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

  // ── Thesis ref (for anchor measurement) ──────────────────────────
  const thesisRef = useRef<HTMLDivElement>(null);

  // ── Column refs for height matching ──────────────────────────────
  const leftColRef  = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftColRef.current || !rightColRef.current) return;
    const measure = () => {
      const mapEl = leftColRef.current!.querySelector('[data-map-container]') as HTMLElement;
      if (!mapEl) return;

      // Reset map height so we measure thesis content alone
      mapEl.style.height = "0px";

      const rightH      = rightColRef.current!.getBoundingClientRect().height;
      const leftContentH = leftColRef.current!.getBoundingClientRect().height;

      // Map absorbs remaining space to match right column height
      const mapHeight = Math.max(rightH - leftContentH, 200);
      mapEl.style.height   = mapHeight + "px";
      mapEl.style.overflow = "hidden";
    };
    const timer = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(timer); window.removeEventListener("resize", measure); };
  }, [appState, sel.raw, sel.comp, sel.sub, sel.eu]);

  // ── Top anchor: viewport Y of tree top ───────────────────────────
  const [topAnchor, setTopAnchor] = useState(420);
  const [windowHeight, setWindowHeight] = useState(900);
  useEffect(() => {
    const update = () => {
      setTopAnchor(topAnchorPx(thesisRef.current));
      setWindowHeight(window.innerHeight);
    };
    const timer = setTimeout(update, 150);
    window.addEventListener("resize", update);
    return () => { clearTimeout(timer); window.removeEventListener("resize", update); };
  }, [appState]);

  useEffect(() => { setTreeCollapsed(false); setBriefOpen(false); }, [appState]);

  // ── Spine dropdown options ────────────────────────────────────────
  // Always provide options at every level so all nodes are independently selectable.
  // When an upstream selection exists, use its narrowed options; otherwise flatten all.
  const spineOptions = {
    raw:  Object.keys(CHAINS.SPINE_TREE),
    comp: sel.raw
      ? Object.keys(CHAINS.SPINE_TREE[sel.raw] || {})
      : Array.from(new Set(
          Object.values(CHAINS.SPINE_TREE).flatMap((r: any) => Object.keys(r))
        )),
    sub:  sel.comp
      ? Object.keys((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp] || {})
      : Array.from(new Set(
          Object.values(CHAINS.SPINE_TREE)
            .flatMap((r: any) => Object.values(r))
            .flatMap((c: any) => Object.keys(c))
        )),
    eu:   sel.sub
      ? ((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp!] || {})[sel.sub] || []
      : Array.from(new Set(
          Object.values(CHAINS.SPINE_TREE)
            .flatMap((r: any) => Object.values(r))
            .flatMap((c: any) => Object.values(c))
            .flat()
        )),
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
    setTipKey(key);
    setTipSvgX(svgX);
    setTipSvgY(svgY);
  }
  function handleNodeLeave() { overNode.current = false; schedHide(); }
  function handleTipEnter()  { overTip.current  = true;  if (hideTimer.current) clearTimeout(hideTimer.current); }
  function handleTipLeave()  { overTip.current  = false; schedHide(); }

  function handleNodeClick(key: string) {
    if (!NODES[key]) return;
    setSelectedNode(key);
  }

  function handleDeepDive() {
    if (!tipKey) return;
    if (!NODES[tipKey]) return;
    setTipKey(null);
    setSelectedNode(tipKey);
  }

  // ── Build tree geometry (top-down from topAnchor) ──────────────────
  function buildGeometryFromAnchorEl(_elId: string, level: AppState) {
    // Compute SVG viewBox width for wide chains
    const rawChain = level === 1 && sel.raw ? CHAINS.RAW_DATA[sel.raw] : null;
    const newSvgWidth = rawChain ? computeRawSvgWidth(rawChain) : 1000;
    setSvgWidth(newSvgWidth);

    // Read topAnchor fresh from DOM to avoid stale closure — state may not have updated yet
    const freshTopAnchor = topAnchorPx(thesisRef.current);
    setTopAnchor(freshTopAnchor);

    const ancX = newSvgWidth / 2;
    const topY = toSVG(freshTopAnchor, window.innerHeight);

    let geo: TreeGeometry | null = null;

    if (level === 1 && sel.raw) {
      const chain = CHAINS.RAW_DATA[sel.raw];
      if (chain) { geo = buildRawGeometry(chain, ancX, topY); }
    } else if (level === 2 && sel.comp) {
      const chain = CHAINS.COMP_DATA[sel.comp];
      if (chain) { geo = buildCompGeometry(chain, ancX, topY); }
    } else if (level === 3 && sel.sub) {
      const chain = CHAINS.SUB_DATA[sel.sub];
      if (chain) { geo = buildSubGeometry(chain, ancX, topY); }
    } else if (level === 4 && sel.eu) {
      const chain = CHAINS.EU_DATA[sel.eu];
      if (chain) { geo = buildEUGeometry(chain, ancX, topY); }
    }

    if (geo) {
      setGeometry(geo);
      setLayers(geo.layers);
    }
  }

  // ── Wait for #page-spine transform transition to finish, then run callback ──
  function afterSpineTransition(callback: () => void) {
    const el = document.getElementById("page-spine");
    if (!el) { setTimeout(callback, 1000); return; }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", onEnd);
      requestAnimationFrame(callback);
    };
    const onEnd = (e: Event) => {
      const te = e as TransitionEvent;
      if (te.target === el && te.propertyName === "transform") finish();
    };
    el.addEventListener("transitionend", onEnd);
    setTimeout(finish, 1200); // fallback in case transitionend never fires
  }

  // ── State transitions ─────────────────────────────────────────────
  function goToRaw() {
    if (!sel.raw) return;
    setAppState(1);
    afterSpineTransition(() => buildGeometryFromAnchorEl("raw-anchor-shape", 1));
  }

  function goToComp() {
    if (!sel.comp) return;
    setGeometry(null);
    setAppState(2);
    setTimeout(() => buildGeometryFromAnchorEl("comp-anchor-shape", 2), 800);
  }

  function goToSubFromSpine() {
    if (!sel.sub) return;
    setGeometry(null);
    setAppState(3);
    setTimeout(() => buildGeometryFromAnchorEl("sub-anchor-shape", 3), 750);
  }

  function goToEUFromSpine() {
    if (!sel.eu) return;
    setGeometry(null);
    setAppState(4);
    setTimeout(() => buildGeometryFromAnchorEl("eu-anchor-shape", 4), 750);
  }

  function goToSub() {
    setGeometry(null);
    setAppState(3);
    setTimeout(() => buildGeometryFromAnchorEl("sub-anchor-shape", 3), 800);
  }

  function goToEU() {
    setGeometry(null);
    setAppState(4);
    setTimeout(() => buildGeometryFromAnchorEl("eu-anchor-shape", 4), 800);
  }

  function backToSpine() {
    setAppState(0);
    setGeometry(null); setLayers([]);
    setTipKey(null);
  }

  function backToRaw() {
    setGeometry(null); setLayers([]);
    setAppState(1);
    afterSpineTransition(() => buildGeometryFromAnchorEl("raw-anchor-shape", 1));
  }

  function backToComp() {
    setGeometry(null); setLayers([]);
    setAppState(2);
    setTimeout(() => buildGeometryFromAnchorEl("comp-anchor-shape", 2), 800);
  }

  function backToSub() {
    setGeometry(null); setLayers([]);
    setAppState(3);
    setTimeout(() => buildGeometryFromAnchorEl("sub-anchor-shape", 3), 800);
  }

  // ── Spine selection ───────────────────────────────────────────────
  function handleSelect(level: "raw" | "comp" | "sub" | "eu", value: string) {
    setSel(prev => {
      const next = { ...prev, [level]: value };
      // Clear downstream selections
      if (level === "raw")  { next.comp = null; next.sub = null; next.eu = null; }
      if (level === "comp") { next.sub  = null; next.eu = null; }
      if (level === "sub")  { next.eu   = null; }
      return next;
    });
  }

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
    appState === 1 ? `${sel.raw  || "Germanium"}     · Raw Material Layer` :
    appState === 2 ? `${sel.comp || "GeO₂ / GeCl₄"} · Component Layer` :
    appState === 3 ? `${sel.sub  || "Fiber Optics"}  · Subsystem Layer` :
    appState === 4 ? `${sel.eu   || "AI Datacenter"} · End Use Layer` : "";

  const supplyMapLabel =
    appState === 1 ? `${sel.raw  || "Germanium"} supply map` :
    appState === 2 ? `${sel.comp || "GeO₂ / GeCl₄"} supply map` :
    appState === 3 ? "Fiber optics supply map" :
    appState === 4 ? "End use supply map" : "";

  // ── Layer panel lookup ────────────────────────────────────────────
  function getLayerPanels(state: AppState): Record<string, unknown> {
    if (state === 1) return PANELS.layers || {};
    if (state === 2) return PANELS.layers || {};
    if (state === 3) return PANELS.layers || {};
    if (state === 4) return PANELS.euLayers || {};
    return {};
  }

  // ── Chain label for modal breadcrumb ─────────────────────────────
  const chainLabel =
    appState === 1 ? (sel.raw  || "Germanium") :
    appState === 2 ? (sel.comp || "GeO₂ / GeCl₄") :
    appState === 3 ? (sel.sub  || "Fiber Optics") :
    appState === 4 ? (sel.eu   || "AI Datacenter") : "";

  // ── Breadcrumb config per state ───────────────────────────────────
  const breadcrumbNodes = (() => {
    if (appState === 2) return [{ label: sel.raw || "Germanium", shape: "cube" as const, onClick: backToRaw }];
    if (appState === 3) return [
      { label: sel.raw  || "Germanium", shape: "cube"   as const, onClick: backToSpine },
      { label: sel.comp || "GeO₂/GeCl₄", shape: "sphere" as const, onClick: backToComp },
    ];
    if (appState === 4) return [
      { label: sel.sub || "Fiber Optics", shape: "pyramid"  as const, onClick: backToSub },
      { label: sel.eu  || "AI Datacenter", shape: "cylinder" as const, onClick: backToSub },
    ];
    return [];
  })();

  // ── Anchor spine configs ──────────────────────────────────────────
  // comp-spine: visible in states 2+
  const compSpineTop = topAnchor;
  const compSpineNodes = [
    { label: sel.comp || "GeO₂ / GeCl₄", shape: "sphere" as const,
      onClick: appState === 2 ? undefined : backToComp },
    { label: sel.sub  || "Subsystem",     shape: "pyramid" as const,
      onClick: goToSub },
  ];

  // sub-spine: visible in states 3+
  const subSpineNodes = [
    { label: sel.sub || "Fiber Optics", shape: "pyramid" as const,
      onClick: appState === 3 ? undefined : backToSub },
    { label: sel.eu  || "End Use",      shape: "cylinder" as const, dormant: appState < 4,
      onClick: appState === 3 ? goToEU : undefined },
  ];

  // eu-spine: visible in state 4, no next node
  const euSpineNodes = [
    { label: sel.eu || "AI Datacenter", shape: "cylinder" as const },
  ];

  // Layer counts: raw=5 layers (4 gaps), eu=4 layers (3 gaps), comp/sub=3 layers (2 gaps)
  const treeLayerCount = appState === 1 ? 5 : appState === 4 ? 4 : 3;
  const treePixelHeight = ((treeLayerCount - 1) * 180 / 1000) * windowHeight;
  const bandPadTop = 20;
  // Raw tree uses gap=180 exactly (no overestimate buffer) and output node text extends ~55px
  // below the circle — needs extra bottom padding vs other layers which use gap=170
  const bandPadBottom = appState === 1 ? 120 : 60;
  const labelHeight = 124;
  const bandTop = topAnchor - bandPadTop - labelHeight;
  const bandHeight = bandPadTop + labelHeight + treePixelHeight + bandPadBottom;
  const collapsedBandHeight = 84;
  const insightsTop = treeCollapsed
    ? bandTop + collapsedBandHeight
    : bandTop + bandHeight;

  // Total page height: insights top + approximate insights content height
  const totalPageHeight = appState > 0 ? insightsTop + 1400 : 0;

  return (
    <main style={{
      width: "100%",
      minHeight: appState > 0 ? totalPageHeight + "px" : "100vh",
      background: "var(--bg)",
      position: "relative",
    }}>

      {/* Grain */}
      <div className="grain" />

      {/* Horizontal spine — visible on tree pages */}
      {appState > 0 && (
        <HorizontalSpine
          selection={sel}
          activeState={appState}
          options={spineOptions}
          onSelect={handleSelect}
          onNodeClick={(level) => {
            if (level === "raw"  && sel.raw)  goToRaw();
            if (level === "comp" && sel.comp) goToComp();
            if (level === "sub"  && sel.sub)  goToSub();
            if (level === "eu"   && sel.eu)   goToEU();
          }}
          onHome={backToSpine}
        />
      )}

      {/* Thesis section — scrolls with page, sits just below fixed horizontal spine */}
      {appState > 0 && currentThesis && (
        <div ref={thesisRef} style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          padding: "16px 48px",
          borderBottom: "0.5px solid rgba(80,80,70,0.2)",
          background: "white",
          zIndex: 40,
        }}>
          {/* Two-column grid: left = thesis + map, right = stat cards placeholder */}
          <div style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr minmax(0, 340px)",
            gap: 20,
            alignItems: "start",
          }}>
            {/* Left column — thesis content + supply chain map */}
            <div ref={leftColRef} style={{
              background: "white",
              border: "0.2px solid rgba(80,80,70,0.2)",
              borderRadius: 8,
              padding: "16px 28px",
            }}>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 15, fontWeight: 600,
                letterSpacing: "0.18em", textTransform: "uppercase" as const,
                color: "#888880", marginBottom: 15,
              }}>
                {currentPageTitle}
              </div>
              <div style={{
                fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontSize: 13, color: "#374151",
                fontWeight: 400, lineHeight: 1.65,
              }}>
                {currentThesis}
              </div>

              {/* Layer summaries + brief trigger */}
              {currentBrief && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid rgba(80,80,70,0.1)" }}>
                  {/* Sub-layers header */}
                  <div style={{
                    fontFamily: "Courier New, monospace",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "#1a1a14", marginBottom: 8,
                  }}>
                    Sub-layers
                  </div>
                  {currentBrief.map((p: { layer: string; summary?: string }, i: number) => (
                    <div key={i} style={{
                      display: "flex", gap: 8, alignItems: "baseline",
                      marginBottom: i < currentBrief.length - 1 ? 6 : 0,
                    }}>
                      <span style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "#8a6820", whiteSpace: "nowrap" as const, flexShrink: 0,
                      }}>{p.layer}</span>
                      <span style={{ width: 1, height: 9, background: "rgba(80,80,70,0.2)", flexShrink: 0, alignSelf: "center" }} />
                      <span style={{
                        fontFamily: "'EB Garamond', Georgia, serif",
                        fontSize: 13, color: "#3a3a32", lineHeight: 1.5,
                      }}>{p.summary}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <button
                      onClick={() => setBriefOpen(true)}
                      style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: 10, letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "#6B7280", background: "none", border: "none",
                        cursor: "pointer", padding: 0,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#1C1E21")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
                    >
                      read layer brief →
                    </button>
                  </div>
                </div>
              )}

              {/* Supply chain map — shown for all active states */}
              <SupplyChainMap
                chainState={appState as 1|2|3|4}
                rawSelection={sel.raw || undefined}
                compSelection={sel.comp || undefined}
                subSelection={sel.sub || undefined}
                euSelection={sel.eu || undefined}
              />
            </div>

            {/* Right column — stat cards + insights */}
            <div ref={rightColRef} style={{ maxWidth: 340 }}>
              <InsightsColumn />
            </div>
          </div>
        </div>
      )}

      {/* Top breadcrumb — hidden */}

      {/* Main spine (states 0 + 1) */}
      <Spine
        state={appState === 0 ? "default" : "gone"}
        selection={sel}
        options={spineOptions}
        onSelect={handleSelect}
        onCubeClick={goToRaw}
        onSphereClick={goToComp}
        onPyramidClick={goToSubFromSpine}
        onCylinderClick={goToEUFromSpine}
      />

      {/* Comp anchor spine — hidden (tree is top-down, no anchor needed) */}
      {false && appState >= 2 && (
        <AnchorSpine
          id="comp-spine"
          topPx={compSpineTop}
          visible={appState === 2}
          nodes={compSpineNodes}
          anchorId="comp-anchor-shape"
        />
      )}

      {/* Sub anchor spine — hidden */}
      {false && appState >= 3 && (
        <AnchorSpine
          id="sub-spine"
          topPx={topAnchor}
          visible={appState === 3}
          nodes={subSpineNodes}
          anchorId="sub-anchor-shape"
        />
      )}

      {/* EU anchor spine — hidden */}
      {false && appState >= 4 && (
        <AnchorSpine
          id="eu-spine"
          topPx={topAnchor}
          visible={appState === 4}
          nodes={euSpineNodes}
          anchorId="eu-anchor-shape"
        />
      )}


      {/* Supply map band — scrolls with page */}
      {appState > 0 && (
        <div style={{
          position: "absolute",
          top: bandTop,
          left: 0,
          right: 0,
          zIndex: 6,
          background: "#EDEDEA",
          borderTop: "0.5px solid rgba(80,80,70,0.2)",
        }}>
          <div
            onClick={() => setTreeCollapsed(prev => !prev)}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#E0E0DC"}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "#EDEDEA"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "26px 48px",
              cursor: "pointer",
              background: "#EDEDEA",
              position: "relative",
              gap: "8px",
              transition: "background 0.15s ease",
              userSelect: "none" as const,
            }}
          >
            <div style={{
              position: "absolute",
              right: "48px",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-mono, 'Courier New', monospace)",
              fontSize: "13px",
              color: "rgba(80,80,70,0.6)",
            }}>
              {treeCollapsed ? "+" : "×"}
            </div>
            <div style={{
              fontFamily: "var(--font-mono, 'Courier New', monospace)",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "#1a1a14",
              textAlign: "center",
            }}>
              {supplyMapLabel}
            </div>
            <div style={{ display: "flex", gap: "14px", alignItems: "center", justifyContent: "center" }}>
              {([
                appState === 1 ? "~220 t/yr" : appState === 2 ? "~88 t Ge to fiber" : appState === 3 ? "~3–4M route-km/yr" : "~130-140 new hyperscale DCs/yr",
                appState === 1 ? "$320M market" : appState === 2 ? "~500M fiber-km/yr" : appState === 3 ? ">30M cable-km/yr" : "~230M fiber-km/yr",
                appState === 1 ? "83% China primary" : appState === 2 ? "36× AI fiber demand" : appState === 3 ? "71% hyperscaler owned" : "~115t Ge/yr",
                appState === 1 ? "8 deposits · 7 miners · 7 refiners" : appState === 2 ? "6 fiber manufacturers" : appState === 3 ? "9 cable assemblers" : "$600B+ capex 2026",
              ] as string[]).map((stat, i, arr) => (
                <React.Fragment key={i}>
                  <span style={{
                    fontFamily: "var(--font-mono, 'Courier New', monospace)",
                    fontSize: "8.5px",
                    color: "#888880",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap" as const,
                  }}>{stat}</span>
                  {i < arr.length - 1 && (
                    <div style={{ width: "1px", height: "9px", background: "rgba(80,80,70,0.3)", flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {!treeCollapsed && (
        <TreeMap
          geometry={geometry}
          nodes={NODES}
          layerConfig={CHAINS.layerConfig}
          svgWidth={svgWidth}
          scrollY={scrollY}
          onNodeHover={handleNodeHover}
          onNodeLeave={handleNodeLeave}
          onNodeClick={handleNodeClick}
          onLayerClick={() => {}}
          layerPanels={getLayerPanels(appState)}
        />
      )}


      {/* Tooltip */}
      <Tooltip
        nodeKey={tipKey}
        nodeData={tipKey ? NODES[tipKey] : null}
        svgX={tipSvgX}
        svgY={tipSvgY}
        onDeepDive={handleDeepDive}
        onMouseEnter={handleTipEnter}
        onMouseLeave={handleTipLeave}
      />

      {/* Brief modal */}
      <BriefModal
        isOpen={briefOpen}
        title={chainLabel}
        paragraphs={currentBrief ?? []}
        stats={currentBriefStats ?? []}
        onClose={() => setBriefOpen(false)}
      />

      {/* Node modal */}
      <NodeModal
        nodeKey={selectedNode}
        allNodes={NODES}
        layers={layers}
        chainLabel={chainLabel}
        onClose={() => setSelectedNode(null)}
        onNavigate={(key) => setSelectedNode(key)}
      />

      {/* Insights section — all tree layers */}
      {appState > 0 && <InsightsSection top={insightsTop} chainState={appState} />}

    </main>
  );
}
