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

// Geometry
import {
  buildRawGeometry, buildCompGeometry,
  buildSubGeometry, buildEUGeometry,
  toSVG, type TreeGeometry, type LayerGeometry,
} from "@/lib/treeGeometry";

// Types
import type { AppState, SpineSelection, NodeData, PanelContent } from "@/types";

// Cast JSON imports
const NODES   = nodesRaw  as unknown as Record<string, NodeData>;
const PANELS  = panelsRaw as any;
const CHAINS  = chainsRaw as any;

// ── ANCHOR SPINE TOP POSITION ─────────────────────────────────────
// Each anchor spine's pyramid/sphere sits at the same y as the raw cube
// when the spine is .shifted. We derive this from window.innerHeight.
function anchorTopPx(): number {
  if (typeof window === "undefined") return 0;
  // Spine shifts by translateY(calc(50vh - 10px)).
  // Full 4-node group height ≈ 4*(label25 + shape22) + 3*(margin14+line30+margin14) = 362px.
  // Cube center in default layout = H/2 - (groupHeight/2 - labelH - shapeHalf)
  //   = H/2 - (181 - 25 - 11) = H/2 - 145.
  // After shift of (H/2 - 10): cubeCY = H/2 - 145 + H/2 - 10 = H - 155.
  // anchorTop = cubeCY - (label14 + margin8 + halfShape11) = cubeCY - 33 = H - 188.
  return window.innerHeight * 0.75 - 10 - 51 - 33;
}

export default function Home() {
  // ── App state ────────────────────────────────────────────────────
  const [appState, setAppState] = useState<AppState>(0);
  const [sel, setSel] = useState<SpineSelection>({ raw: null, comp: null, sub: null, eu: null });

  // ── Geometry ─────────────────────────────────────────────────────
  const [geometry, setGeometry] = useState<TreeGeometry | null>(null);
  const [layers,   setLayers]   = useState<LayerGeometry[]>([]);

  // ── Panel ─────────────────────────────────────────────────────────
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [panelContent, setPanelContent] = useState<PanelContent | null>(null);

  // ── Tooltip ───────────────────────────────────────────────────────
  const [tipKey,  setTipKey]  = useState<string | null>(null);
  const [tipSvgX, setTipSvgX] = useState(0);
  const [tipSvgY, setTipSvgY] = useState(0);
  const overNode = useRef(false);
  const overTip  = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Anchor spine top positions ────────────────────────────────────
  const [anchorTop, setAnchorTop] = useState(0);
  useEffect(() => {
    setAnchorTop(anchorTopPx());
    const onResize = () => setAnchorTop(anchorTopPx());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  // ── Build tree geometry from anchor position ───────────────────────
  function buildGeometryFromAnchorEl(elId: string, level: AppState) {
    const el = document.getElementById(elId);
    if (!el) return;

    // Find the first .an-shape child to measure the shape center
    const shape = el.querySelector("[data-shape]") as HTMLElement | null;
    const target = shape || el;
    const rect = target.getBoundingClientRect();
    const cxPx = rect.left + rect.width  / 2;
    const cyPx = rect.top  + rect.height / 2;

    const ancX = toSVG(cxPx, window.innerWidth);
    const ancY = toSVG(cyPx, window.innerHeight);

    // Stop the output→anchor line just above the node label.
    // Layout: shape half (11px) + marginBottom (8px) + label height ~17px + padding 8px = 44px above cube center.
    const lineStopY = toSVG(cyPx - 44, window.innerHeight);

    let geo: TreeGeometry | null = null;
    let panelContent: PanelContent | null = null;

    if (level === 1 && sel.raw) {
      const chain = CHAINS.RAW_DATA[sel.raw];
      if (chain) { geo = buildRawGeometry(chain, ancX, ancY, 360, 150, lineStopY); panelContent = PANELS.rawIntro; }
    } else if (level === 2 && sel.comp) {
      const chain = CHAINS.COMP_DATA[sel.comp];
      if (chain) { geo = buildCompGeometry(chain, ancX, ancY, 370, 150, lineStopY); panelContent = PANELS.compIntro; }
    } else if (level === 3 && sel.sub) {
      const chain = CHAINS.SUB_DATA[sel.sub];
      if (chain) { geo = buildSubGeometry(chain, ancX, ancY, 380, 150, lineStopY); panelContent = PANELS.subIntro; }
    } else if (level === 4 && sel.eu) {
      const chain = CHAINS.EU_DATA[sel.eu];
      if (chain) { geo = buildEUGeometry(chain, ancX, ancY, 380, 150, lineStopY); panelContent = PANELS.euIntro; }
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
  const compSpineTop = anchorTop;
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

  return (
    <main style={{ width: "100%", height: "100%", background: "var(--bg)", overflow: "hidden", paddingTop: appState > 0 ? "120px" : "0" }}>

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
        <div style={{
          position: "fixed",
          top: 68, left: 0, right: 0,
          padding: "12px 48px",
          borderBottom: "0.5px solid rgba(192,176,128,0.15)",
          background: "#f2ede3",
          zIndex: 40,
        }}>
          <div style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: "13px",
            color: "#6b6458",
            fontStyle: "italic",
            lineHeight: 1.65,
            maxWidth: 720,
            borderLeft: "2px solid rgba(200,168,90,0.4)",
            paddingLeft: "14px",
          }}>
            {currentThesis}
          </div>
        </div>
      )}

      {/* Top breadcrumb */}
      <Breadcrumb nodes={breadcrumbNodes} visible={appState >= 2} />

      {/* Main spine (states 0 + 1) */}
      <Spine
        state={appState === 0 ? "default" : appState === 1 ? "shifted" : "gone"}
        selection={sel}
        options={spineOptions}
        onSelect={handleSelect}
        onCubeClick={goToRaw}
        onSphereClick={goToComp}
        onPyramidClick={goToSubFromSpine}
        onCylinderClick={goToEUFromSpine}
      />

      {/* Comp anchor spine */}
      {appState >= 2 && (
        <AnchorSpine
          id="comp-spine"
          topPx={compSpineTop}
          visible={appState === 2}
          nodes={compSpineNodes}
          anchorId="comp-anchor-shape"
        />
      )}

      {/* Sub anchor spine */}
      {appState >= 3 && (
        <AnchorSpine
          id="sub-spine"
          topPx={anchorTop}
          visible={appState === 3}
          nodes={subSpineNodes}
          anchorId="sub-anchor-shape"
        />
      )}

      {/* EU anchor spine */}
      {appState >= 4 && (
        <AnchorSpine
          id="eu-spine"
          topPx={anchorTop}
          visible={appState === 4}
          nodes={euSpineNodes}
          anchorId="eu-anchor-shape"
        />
      )}

      {/* SVG tree */}
      <TreeMap
        geometry={geometry}
        nodes={NODES}
        layerConfig={CHAINS.layerConfig}
        onNodeHover={handleNodeHover}
        onNodeLeave={handleNodeLeave}
        onNodeClick={handleNodeClick}
        onLayerClick={openPanel}
        layerPanels={getLayerPanels(appState)}
      />

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

    </main>
  );
}
