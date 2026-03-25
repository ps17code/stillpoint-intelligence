"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
import RightPanel        from "@/components/RightPanel";
import { buildNodePanelContent } from "@/components/RightPanel";
import Tooltip      from "@/components/Tooltip";
import InsightsSection from "@/components/InsightsSection";

// Geometry
import {
  buildRawGeometry, buildCompGeometry,
  buildSubGeometry, buildEUGeometry,
  computeRawSvgWidth,
  toSVG, type TreeGeometry, type LayerGeometry,
} from "@/lib/treeGeometry";

// Types
import type { AppState, SpineSelection, NodeData, PanelContent } from "@/types";

// Cast JSON imports
const NODES   = nodesRaw  as unknown as Record<string, NodeData>;
const PANELS  = panelsRaw as any;
const CHAINS  = chainsRaw as any;

// ── TOP ANCHOR: document Y where tree top should appear ───────────
// = thesis block bottom + 40px breathing room (viewport-relative at scroll=0)
function topAnchorPx(thesisEl: HTMLElement | null): number {
  if (typeof window === "undefined") return 220;
  const thesisBottom = thesisEl ? thesisEl.getBoundingClientRect().bottom : 188;
  return thesisBottom + 180;
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
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [panelContent, setPanelContent] = useState<PanelContent | null>(null);

  // ── Tooltip ───────────────────────────────────────────────────────
  const [tipKey,  setTipKey]  = useState<string | null>(null);
  const [tipSvgX, setTipSvgX] = useState(0);
  const [tipSvgY, setTipSvgY] = useState(0);
  const overNode = useRef(false);
  const overTip  = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Thesis ref (for anchor measurement) ──────────────────────────
  const thesisRef = useRef<HTMLDivElement>(null);

  // ── Top anchor: viewport Y of tree top ───────────────────────────
  const [topAnchor, setTopAnchor] = useState(220);
  const [windowHeight, setWindowHeight] = useState(900);
  useEffect(() => {
    const update = () => {
      setTopAnchor(topAnchorPx(thesisRef.current));
      setWindowHeight(window.innerHeight);
    };
    const timer = setTimeout(update, 100);
    window.addEventListener("resize", update);
    return () => { clearTimeout(timer); window.removeEventListener("resize", update); };
  }, [appState]);

  useEffect(() => { setTreeCollapsed(false); }, [appState]);

  // ── Spine dropdown options ────────────────────────────────────────
  const spineOptions = {
    raw:  Object.keys(CHAINS.SPINE_TREE),
    comp: sel.raw  ? Object.keys(CHAINS.SPINE_TREE[sel.raw] || {}) : [],
    sub:  sel.comp ? Object.keys((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp] || {}) : [],
    eu:   sel.sub  ? ((CHAINS.SPINE_TREE[sel.raw!] || {})[sel.comp!] || {})[sel.sub] || [] : [],
  };

  // ── Helpers ───────────────────────────────────────────────────────
  function openPanel(content: PanelContent) {
    setPanelContent(content);
    setPanelOpen(true);
  }

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
    const node = NODES[key];
    if (!node) return;
    openPanel(buildNodePanelContent(key, node));
  }

  function handleDeepDive() {
    if (!tipKey) return;
    const node = NODES[tipKey];
    if (!node) return;
    setTipKey(null);
    openPanel(buildNodePanelContent(tipKey, node));
  }

  // ── Build tree geometry (top-down from topAnchor) ──────────────────
  function buildGeometryFromAnchorEl(_elId: string, level: AppState) {
    // Compute SVG viewBox width for wide chains
    const rawChain = level === 1 && sel.raw ? CHAINS.RAW_DATA[sel.raw] : null;
    const newSvgWidth = rawChain ? computeRawSvgWidth(rawChain) : 1000;
    setSvgWidth(newSvgWidth);

    // ancX = center of viewBox; topY = SVG Y of tree top (just below thesis block)
    const ancX = newSvgWidth / 2;
    const topY = toSVG(topAnchor, window.innerHeight);

    let geo: TreeGeometry | null = null;
    let panelContent: PanelContent | null = null;

    if (level === 1 && sel.raw) {
      const chain = CHAINS.RAW_DATA[sel.raw];
      if (chain) { geo = buildRawGeometry(chain, ancX, topY); panelContent = PANELS.rawIntro; }
    } else if (level === 2 && sel.comp) {
      const chain = CHAINS.COMP_DATA[sel.comp];
      if (chain) { geo = buildCompGeometry(chain, ancX, topY); panelContent = PANELS.compIntro; }
    } else if (level === 3 && sel.sub) {
      const chain = CHAINS.SUB_DATA[sel.sub];
      if (chain) { geo = buildSubGeometry(chain, ancX, topY); panelContent = PANELS.subIntro; }
    } else if (level === 4 && sel.eu) {
      const chain = CHAINS.EU_DATA[sel.eu];
      if (chain) { geo = buildEUGeometry(chain, ancX, topY); panelContent = PANELS.euIntro; }
    }

    if (geo) {
      setGeometry(geo);
      setLayers(geo.layers);
      if (panelContent) {
        setTimeout(() => openPanel(panelContent!), geo!.layers.length * 110 + 300);
      }
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
    setPanelOpen(false); setTipKey(null);
  }

  function backToRaw() {
    setGeometry(null); setLayers([]);
    setAppState(1);
    setPanelOpen(false);
    afterSpineTransition(() => buildGeometryFromAnchorEl("raw-anchor-shape", 1));
  }

  function backToComp() {
    setGeometry(null); setLayers([]);
    setAppState(2);
    setPanelOpen(false);
    setTimeout(() => buildGeometryFromAnchorEl("comp-anchor-shape", 2), 800);
  }

  function backToSub() {
    setGeometry(null); setLayers([]);
    setAppState(3);
    setPanelOpen(false);
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
  function getLayerPanels(state: AppState): Record<string, PanelContent> {
    if (state === 1) return PANELS.layers || {};
    if (state === 2) return PANELS.layers || {};
    if (state === 3) return PANELS.layers || {};
    if (state === 4) return PANELS.euLayers || {};
    return {};
  }

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

  // Global Supply node (layer 4) sits at SVG Y = topY + 4*180.
  // Layer counts: raw=5 layers (4 gaps), comp=3 layers (2 gaps)
  const treeLayerCount = appState === 1 ? 5 : 3;
  const treePixelHeight = ((treeLayerCount - 1) * 180 / 1000) * windowHeight;
  const bandPadTop = 20;
  const bandPadBottom = 40;
  const labelHeight = 110;
  const bandTop = topAnchor - bandPadTop - labelHeight;
  const bandHeight = bandPadTop + labelHeight + treePixelHeight + bandPadBottom;
  const collapsedBandHeight = 56;
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

      {/* Thesis bar — sits just below horizontal spine */}
      {appState > 0 && currentThesis && (
        <div ref={thesisRef} style={{
          position: "fixed",
          top: 76,
          left: 0,
          right: 0,
          padding: "16px 48px",
          borderBottom: "0.5px solid rgba(192,176,128,0.2)",
          background: "#f2ede3",
          zIndex: 40,
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{
            background: "white",
            border: "0.5px solid rgba(192,176,128,0.3)",
            borderRadius: "8px",
            padding: "16px 28px",
            maxWidth: "780px",
            width: "100%",
          }}>
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#9c8c74",
              marginBottom: "8px",
              textAlign: "center",
            }}>
              {currentPageTitle}
            </div>
            <div style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: "14px",
              color: "#6b6458",
              fontStyle: "italic",
              lineHeight: 1.7,
              textAlign: "center",
            }}>
              {currentThesis}
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


      {/* Tree band background — scrolls with page */}
      {appState > 0 && (
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandTop,
          height: treeCollapsed ? collapsedBandHeight : bandHeight,
          background: "rgba(0, 0, 0, 0.018)",
          width: "100%",
        }} />
      )}

      {/* Supply map header — scrolls with page */}
      {appState > 0 && (
        <div style={{
          position: "absolute",
          top: bandTop,
          left: 0,
          right: 0,
          zIndex: 6,
          background: "transparent",
        }}>
          <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 48px" }}>
            <div
              onClick={() => setTreeCollapsed(prev => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                padding: "20px 0",
                borderTop: "0.5px solid rgba(192,176,128,0.3)",
                userSelect: "none" as const,
              }}
            >
              <div style={{ width: 20 }} />
              <div style={{
                flex: 1,
                fontFamily: "Courier New, monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: "#9c8c74",
                textAlign: "center",
              }}>
                {supplyMapLabel}
              </div>
              <div style={{
                width: 20,
                fontFamily: "Courier New, monospace",
                fontSize: 10,
                color: "#c8bc9a",
                textAlign: "right",
              }}>
                {treeCollapsed ? "+" : "−"}
              </div>
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
          onLayerClick={openPanel}
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

      {/* Right panel */}
      <RightPanel
        isOpen={panelOpen}
        content={panelContent}
        onClose={() => setPanelOpen(o => !o)}
      />

      {/* Insights section — raw, component, and subsystem layers */}
      {(appState === 1 || appState === 2 || appState === 3) && <InsightsSection top={insightsTop} chainState={appState} />}

    </main>
  );
}
