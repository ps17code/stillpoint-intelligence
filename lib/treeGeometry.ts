// Generic tree geometry engine.
// Takes any chain definition + anchor position → returns node/edge positions.
// This replaces the four hardcoded buildRawTree / buildCompTree / etc. functions.

export interface LayerGeometry {
  key: string;
  label: string;
  cy: number;       // SVG y coordinate (0-1000 scale)
  nodes: { name: string; cx: number; cy: number; opacity: number }[];
  color: { stroke: string; text: string; pip: string };
}

export interface EdgeGeometry {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  fromLayer: number;  // index into layers[] — which layer this edge departs from
}

export interface TreeGeometry {
  layers: LayerGeometry[];
  edges: EdgeGeometry[];
  outputNode: { name: string; cx: number; cy: number };
  outputToAnchorLine: EdgeGeometry;
  ancY: number;
}

// Spread n nodes evenly across [center-half+pad, center+half-pad]
export function evenSpread(n: number, center: number, half: number, pad = 0): number[] {
  const l = center - (half - pad);
  const r = center + (half - pad);
  if (n === 1) return [center];
  return Array.from({ length: n }, (_, i) => l + (i * (r - l)) / (n - 1));
}

// Convert pixel position to SVG 0-1000 coordinate space
export function toSVG(px: number, total: number): number {
  return (px / total) * 1000;
}

// Edge endpoints: depart below bottom pill (cy+79), arrive above destination ring (cy-7)
const EDGE_Y1_OFFSET =  79; // below lowest pill
const EDGE_Y2_OFFSET =   7; // above ring top

function buildEdges(
  fromXs: number[], fromCY: number,
  toXs: number[], toCY: number,
  color: string,
  mapping: [number, number][],
  fromLayerIdx: number,
): EdgeGeometry[] {
  return mapping.map(([fi, ti]) => ({
    x1: fromXs[fi], y1: fromCY + EDGE_Y1_OFFSET,
    x2: toXs[ti],   y2: toCY   - EDGE_Y2_OFFSET,
    color,
    fromLayer: fromLayerIdx,
  }));
}

// ── LAYER COLOR PALETTES ──────────────────────────────────────────
export const PALETTES = {
  // Raw material layer (warm gold family)
  deposits: { stroke: "#c8a85a", text: "#8a6820", pip: "#c8a85a" },
  miners:   { stroke: "#a87e3a", text: "#6a4e18", pip: "#a87e3a" },
  refiners: { stroke: "#7a5a28", text: "#4a3610", pip: "#7a5a28" },
  supply:   { stroke: "#3e2c0e", text: "#3e2c0e", pip: "#3e2c0e" },
  // Component layer (teal/slate)
  preform:  { stroke: "#3a6b6b", text: "#1e4040", pip: "#3a6b6b" },
  drawing:  { stroke: "#3a5070", text: "#1e2e48", pip: "#3a5070" },
  compOut:  { stroke: "#1a2e4a", text: "#1a2e4a", pip: "#1a2e4a" },
  // Subsystem layer (purple-slate)
  assembly: { stroke: "#5a4a6a", text: "#2e1e40", pip: "#5a4a6a" },
  cableType:{ stroke: "#2e4a5a", text: "#0e1e2e", pip: "#2e4a5a" },
  subOut:   { stroke: "#1a1e2e", text: "#1a1e2e", pip: "#1a1e2e" },
  // End use layer (forest green → navy)
  integration:{ stroke: "#4a3070", text: "#2c1a4a", pip: "#4a3070" },
  hyperscale: { stroke: "#2a4a2a", text: "#1a2e1a", pip: "#2a4a2a" },
  euOut:      { stroke: "#1a1a3a", text: "#1a1a3a", pip: "#1a1a3a" },
} as const;

// ── RAW TREE GEOMETRY ─────────────────────────────────────────────
import type { RawChain } from "@/types";

export function buildRawGeometry(
  chain: RawChain,
  ancX: number, ancY: number,
  half = 360, gap = 150
): TreeGeometry {
  const supCY = ancY - gap;
  const refCY = ancY - gap * 2;
  const minCY = ancY - gap * 3;
  const depCY = ancY - gap * 4;

  const depXs = evenSpread(chain.deposits.length, ancX, half);
  const minXs = evenSpread(chain.miners.length, ancX, half, 20);
  const refXs = evenSpread(chain.refiners.length, ancX, half, 60);

  const layers: LayerGeometry[] = [
    {
      key: "DEPOSITS", label: "DEPOSITS", cy: depCY,
      color: PALETTES.deposits,
      nodes: chain.deposits.map((name, i) => ({
        name, cx: depXs[i], cy: depCY,
        opacity: chain.minor.deposits.includes(i) ? 0.4 : 1,
      })),
    },
    {
      key: "MINERS", label: "MINERS", cy: minCY,
      color: PALETTES.miners,
      nodes: chain.miners.map((name, i) => ({
        name, cx: minXs[i], cy: minCY,
        opacity: chain.minor.miners.includes(i) ? 0.4 : 1,
      })),
    },
    {
      key: "REFINERS", label: "REFINERS", cy: refCY,
      color: PALETTES.refiners,
      nodes: chain.refiners.map((name, i) => ({
        name, cx: refXs[i], cy: refCY,
        opacity: chain.minor.refiners.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "SUPPLY", label: "SUPPLY", cy: supCY,
      color: PALETTES.supply,
      nodes: [{ name: chain.supply, cx: ancX, cy: supCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(depXs, depCY, minXs, minCY, PALETTES.deposits.stroke, chain.depToMin, 0),
    ...buildEdges(minXs, minCY, refXs, refCY, PALETTES.miners.stroke, chain.minToRef, 1),
    ...refXs.map(rx => ({
      x1: rx,   y1: refCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: supCY - EDGE_Y2_OFFSET,
      color: PALETTES.refiners.stroke,
      fromLayer: 2,
    })),
  ];

  return {
    layers,
    edges,
    outputNode: { name: chain.supply, cx: ancX, cy: supCY },
    outputToAnchorLine: {
      x1: ancX, y1: supCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: ancY  - EDGE_Y2_OFFSET,
      color: PALETTES.supply.stroke,
      fromLayer: -1,
    },
    ancY,
  };
}

// ── COMP TREE GEOMETRY ────────────────────────────────────────────
import type { CompChain } from "@/types";

export function buildCompGeometry(
  chain: CompChain,
  ancX: number, ancY: number,
  half = 370, gap = 150
): TreeGeometry {
  const outCY  = ancY - gap;
  const drawCY = ancY - gap * 2;
  const preCY  = ancY - gap * 3;

  const preXs  = evenSpread(chain.preform.length,  ancX, half);
  const drawXs = evenSpread(chain.drawing.length,  ancX, half, 10);

  const layers: LayerGeometry[] = [
    {
      key: "PREFORM", label: "PREFORM", cy: preCY,
      color: PALETTES.preform,
      nodes: chain.preform.map((name, i) => ({
        name, cx: preXs[i], cy: preCY,
        opacity: chain.minor.preform.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "DRAWING", label: "DRAWING", cy: drawCY,
      color: PALETTES.drawing,
      nodes: chain.drawing.map((name, i) => ({
        name, cx: drawXs[i], cy: drawCY,
        opacity: chain.minor.drawing.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "OUTPUT", label: "OUTPUT", cy: outCY,
      color: PALETTES.compOut,
      nodes: [{ name: chain.output, cx: ancX, cy: outCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(preXs, preCY, drawXs, drawCY, PALETTES.preform.stroke, chain.preToDrawing, 0),
    ...drawXs.map(dx => ({
      x1: dx,   y1: drawCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: outCY  - EDGE_Y2_OFFSET,
      color: PALETTES.drawing.stroke,
      fromLayer: 1,
    })),
  ];

  return {
    layers, edges,
    outputNode: { name: chain.output, cx: ancX, cy: outCY },
    outputToAnchorLine: {
      x1: ancX, y1: outCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: ancY  - EDGE_Y2_OFFSET,
      color: PALETTES.compOut.stroke,
      fromLayer: -1,
    },
    ancY,
  };
}

// ── SUB TREE GEOMETRY ─────────────────────────────────────────────
import type { SubChain } from "@/types";

export function buildSubGeometry(
  chain: SubChain,
  ancX: number, ancY: number,
  half = 380, gap = 150
): TreeGeometry {
  const outCY  = ancY - gap;
  const typeCY = ancY - gap * 2;
  const assCY  = ancY - gap * 3;

  const assXs  = evenSpread(chain.assembly.length,  ancX, half);
  const typeXs = evenSpread(3, ancX, half, 80);

  const layers: LayerGeometry[] = [
    {
      key: "ASSEMBLY", label: "ASSEMBLY", cy: assCY,
      color: PALETTES.assembly,
      nodes: chain.assembly.map((name, i) => ({
        name, cx: assXs[i], cy: assCY, opacity: 1,
      })),
    },
    {
      key: "CABLE TYPE", label: "CABLE TYPE", cy: typeCY,
      color: PALETTES.cableType,
      nodes: chain.cableType.map((name, i) => ({
        name, cx: typeXs[i], cy: typeCY, opacity: 1,
      })),
    },
    {
      key: "OUTPUT", label: "OUTPUT", cy: outCY,
      color: PALETTES.subOut,
      nodes: [{ name: chain.output, cx: ancX, cy: outCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(assXs, assCY, typeXs, typeCY, PALETTES.assembly.stroke, chain.assToType, 0),
    ...typeXs.map(tx => ({
      x1: tx,   y1: typeCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: outCY  - EDGE_Y2_OFFSET,
      color: PALETTES.cableType.stroke,
      fromLayer: 1,
    })),
  ];

  return {
    layers, edges,
    outputNode: { name: chain.output, cx: ancX, cy: outCY },
    outputToAnchorLine: {
      x1: ancX, y1: outCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: ancY  - EDGE_Y2_OFFSET,
      color: PALETTES.subOut.stroke,
      fromLayer: -1,
    },
    ancY,
  };
}

// ── EU TREE GEOMETRY ──────────────────────────────────────────────
import type { EUChain } from "@/types";

export function buildEUGeometry(
  chain: EUChain,
  ancX: number, ancY: number,
  half = 380, gap = 150
): TreeGeometry {
  const outCY = ancY - gap;
  const hypCY = ancY - gap * 2;
  const intCY = ancY - gap * 3;

  const intXs = evenSpread(chain.integration.length, ancX, half);
  const hypXs = evenSpread(chain.hyperscale.length,  ancX, half, 20);

  const layers: LayerGeometry[] = [
    {
      key: "INTEGRATION", label: "INTEGRATION", cy: intCY,
      color: PALETTES.integration,
      nodes: chain.integration.map((name, i) => ({
        name, cx: intXs[i], cy: intCY, opacity: 1,
      })),
    },
    {
      key: "HYPERSCALE", label: "HYPERSCALE", cy: hypCY,
      color: PALETTES.hyperscale,
      nodes: chain.hyperscale.map((name, i) => ({
        name, cx: hypXs[i], cy: hypCY, opacity: 1,
      })),
    },
    {
      key: "OUTPUT", label: "OUTPUT", cy: outCY,
      color: PALETTES.euOut,
      nodes: [{ name: chain.output, cx: ancX, cy: outCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(intXs, intCY, hypXs, hypCY, PALETTES.integration.stroke, chain.intToHyper, 0),
    ...hypXs.map(hx => ({
      x1: hx,   y1: hypCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: outCY  - EDGE_Y2_OFFSET,
      color: PALETTES.hyperscale.stroke,
      fromLayer: 1,
    })),
  ];

  return {
    layers, edges,
    outputNode: { name: chain.output, cx: ancX, cy: outCY },
    outputToAnchorLine: {
      x1: ancX, y1: outCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: ancY  - EDGE_Y2_OFFSET,
      color: PALETTES.euOut.stroke,
      fromLayer: -1,
    },
    ancY,
  };
}
