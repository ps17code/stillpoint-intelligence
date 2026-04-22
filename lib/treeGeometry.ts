// Generic tree geometry engine.
// Takes any chain definition + topY anchor → returns node/edge positions.
// Tree grows DOWNWARD from topY: first layer at topY, last layer at topY + gap*(n-1).

export interface LayerGeometry {
  key: string;
  label: string;
  cy: number;       // SVG y coordinate (0-1000 scale)
  nodes: { name: string; cx: number; cy: number; opacity: number; color?: string }[];
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
}

// Spread n nodes evenly across [center-half+pad, center+half-pad]
export function evenSpread(n: number, center: number, half: number, pad = 0): number[] {
  const l = center - (half - pad);
  const r = center + (half - pad);
  if (n === 1) return [center];
  return Array.from({ length: n }, (_, i) => l + (i * (r - l)) / (n - 1));
}

// Fixed slot width: 175 SVG units per node.
// At typical viewport (1440×900), 1 SVG unit ≈ 0.86–0.9px, so 175 ≈ 150–157px per slot.
// Pills are capped at 160 SVG units wide — 175-unit slots give ~15 units breathing room.
const SLOT = 175;
const GROUP_GAP = 60; // SVG units gap between China and non-China groups

// Simple fixed-slot spread centered at centerX
export function contentAwareSpread(count: number, centerX: number): number[] {
  if (count === 1) return [centerX];
  const totalWidth = count * SLOT;
  const startX = centerX - totalWidth / 2 + SLOT / 2;
  return Array.from({ length: count }, (_, i) => startX + i * SLOT);
}

// Two-group spread with a clear gap between left (China) and right (non-China) groups
export function splitSpread(chinaCount: number, foreignCount: number, centerX: number): number[] {
  const chinaTotal    = chinaCount * SLOT;
  const totalWithGap  = chinaTotal + GROUP_GAP + foreignCount * SLOT;
  const startX        = centerX - totalWithGap / 2 + SLOT / 2;
  const leftXs  = Array.from({ length: chinaCount },   (_, i) => startX + i * SLOT);
  const rightXs = Array.from({ length: foreignCount }, (_, i) => startX + chinaTotal + GROUP_GAP + i * SLOT);
  return [...leftXs, ...rightXs];
}

// Compute the SVG viewBox width required for a raw chain so all node content fits without overlap
export function computeRawSvgWidth(chain: RawChain): number {
  const layerWidth = (total: number, split?: number): number =>
    split && split > 0 && split < total
      ? split * SLOT + GROUP_GAP + (total - split) * SLOT
      : total * SLOT;

  const widths = [
    layerWidth(chain.deposits.length, chain.groupSplit?.deposits),
    layerWidth(chain.miners.length,   chain.groupSplit?.miners),
    layerWidth(chain.refiners.length, 3), // refiners always split at primaryCount=3
  ];
  return Math.max(1000, Math.max(...widths) + 400); // 200px padding each side (labels extend ~200 units left)
}

export function computeCompSvgWidth(chain: CompChain): number {
  const widths = [chain.geCl4.length * SLOT, chain.fiberMfg.length * SLOT];
  return Math.max(1800, Math.max(...widths) + 400);
}

export function computeSubSvgWidth(chain: SubChain): number {
  const widths = [chain.assembly.length * SLOT, chain.cableType.length * SLOT];
  return Math.max(1000, Math.max(...widths) + 400);
}

export function computeEUSvgWidth(chain: EUChain): number {
  const widths = [chain.installers.length * SLOT, chain.developers.length * SLOT, chain.owners.length * SLOT];
  return Math.max(1000, Math.max(...widths) + 400);
}

// Convert pixel position to SVG 0-1000 coordinate space
export function toSVG(px: number, total: number): number {
  return (px / total) * 1000;
}

// Edge endpoints: depart below bottom pill of source node, arrive just above ring of destination
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
  deposits:   { stroke: "#c8a85a", text: "#8a6820", pip: "#c8a85a" },
  miners:     { stroke: "#a87e3a", text: "#6a4e18", pip: "#a87e3a" },
  refiners:   { stroke: "#7a5a28", text: "#4a3610", pip: "#7a5a28" },
  recyclers:  { stroke: "#5a7a9c", text: "#2a3e54", pip: "#5a7a9c" },
  supplyNodes:{ stroke: "#6a7a5a", text: "#3a4a2a", pip: "#6a7a5a" },
  supply:     { stroke: "#3e2c0e", text: "#3e2c0e", pip: "#3e2c0e" },
  // Component layer (steel blue family — main: #254252)
  geCl4:    { stroke: "#4d9ab8", text: "#1e3d52", pip: "#4d9ab8" },
  fiberMfg: { stroke: "#90aab9", text: "#2a3e4a", pip: "#90aab9" },
  compOut:  { stroke: "#162a36", text: "#162a36", pip: "#162a36" },
  // Subsystem layer (purple-slate)
  assembly: { stroke: "#5a4a6a", text: "#2e1e40", pip: "#5a4a6a" },
  cableType:{ stroke: "#2e4a5a", text: "#0e1e2e", pip: "#2e4a5a" },
  subOut:   { stroke: "#1a1e2e", text: "#1a1e2e", pip: "#1a1e2e" },
  // End use layer (amber / US-dominant)
  installers: { stroke: "#c8a85a", text: "#7a6020", pip: "#c8a85a" },
  developers: { stroke: "#b09040", text: "#6a5010", pip: "#b09040" },
  owners:     { stroke: "#c8a85a", text: "#7a6020", pip: "#c8a85a" },
  euOut:      { stroke: "#1a1a2e", text: "#1a1a2e", pip: "#1a1a2e" },
  // Gallium layer palettes (green family matching accent #7a8a6a)
  galliumSource:    { stroke: "#8a9a6a", text: "#4a5a2a", pip: "#8a9a6a" },
  galliumProducer:  { stroke: "#7a8a5a", text: "#3a4a1a", pip: "#7a8a5a" },
  galliumRefiner:   { stroke: "#5a7a6a", text: "#1a3a2a", pip: "#5a7a6a" },
  galliumSubstrate: { stroke: "#4a6a7a", text: "#1a2a3a", pip: "#4a6a7a" },
  galliumDevice:    { stroke: "#3a5a6a", text: "#0a1a2a", pip: "#3a5a6a" },
} as const;

// ── RAW TREE GEOMETRY ─────────────────────────────────────────────
import type { RawChain } from "@/types";

export function buildRawGeometry(
  chain: RawChain,
  ancX: number, topY: number,
  half = 480, gap = 180,
): TreeGeometry {
  // 5-layer layout when supplyNodes are present, else legacy 4-layer
  const hasSupplyNodes = chain.supplyNodes && chain.supplyNodes.length > 0;

  if (hasSupplyNodes) {
    const depCY     = topY;
    const minCY     = topY + gap;
    const refCY     = topY + gap * 2;
    const supNodeCY = topY + gap * 3;
    const supCY     = topY + gap * 4;

    // deposits: split China vs non-China, or centered spread if no split defined
    const depSplit = chain.groupSplit?.deposits;
    const depXs = (depSplit && depSplit > 0 && depSplit < chain.deposits.length)
      ? splitSpread(depSplit, chain.deposits.length - depSplit, ancX)
      : contentAwareSpread(chain.deposits.length, ancX);

    // miners: same split logic
    const minSplit = chain.groupSplit?.miners;
    const minXs = (minSplit && minSplit > 0 && minSplit < chain.miners.length)
      ? splitSpread(minSplit, chain.miners.length - minSplit, ancX)
      : contentAwareSpread(chain.miners.length, ancX);

    // refiners: primaries (0-2) left, western+other (3+) right — always split
    const primaryCount = 3;
    const refXs = splitSpread(primaryCount, chain.refiners.length - primaryCount, ancX);

    const supNodeCount = chain.supplyNodes!.length;
    const supNodeXs = supNodeCount === 2
      ? [ancX - 120, ancX + 120]
      : evenSpread(supNodeCount, ancX, half, 60);

    const layers: LayerGeometry[] = [
      {
        key: "deposits", label: "DEPOSITS", cy: depCY,
        color: PALETTES.deposits,
        nodes: chain.deposits.map((name, i) => ({
          name, cx: depXs[i], cy: depCY,
          opacity: chain.minor.deposits.includes(i) ? 0.4 : 1,
        })),
      },
      {
        key: "miners", label: "MINERS", cy: minCY,
        color: PALETTES.miners,
        nodes: chain.miners.map((name, i) => ({
          name, cx: minXs[i], cy: minCY,
          opacity: chain.minor.miners.includes(i) ? 0.4 : 1,
        })),
      },
      {
        key: "refiners", label: "REFINERS & RECYCLERS", cy: refCY,
        color: PALETTES.refiners,
        nodes: chain.refiners.map((name, i) => ({
          name, cx: refXs[i], cy: refCY,
          opacity: chain.minor.refiners.includes(i) ? 0.5 : 1,
        })),
      },
      {
        key: "supplyNodes", label: "SUPPLY", cy: supNodeCY,
        color: PALETTES.supplyNodes,
        nodes: chain.supplyNodes!.map((name, i) => ({
          name, cx: supNodeXs[i], cy: supNodeCY, opacity: 1,
        })),
      },
      {
        key: "supply", label: "GLOBAL SUPPLY", cy: supCY,
        color: PALETTES.supply,
        nodes: [{ name: chain.supply, cx: ancX, cy: supCY, opacity: 1 }],
      },
    ];

    const refToSupplyMapping = chain.refToSupply ?? refXs.map((_, i) => [i, 0] as [number, number]);
    const supplyToGlobalMapping = chain.supplyToGlobal ?? supNodeXs.map((_, i) => [i, 0] as [number, number]);

    const edges: EdgeGeometry[] = [
      ...buildEdges(depXs,     depCY,     minXs,     minCY,     PALETTES.deposits.stroke,    chain.depToMin,          0),
      ...buildEdges(minXs,     minCY,     refXs,     refCY,     PALETTES.miners.stroke,      chain.minToRef,          1),
      ...buildEdges(refXs,     refCY,     supNodeXs, supNodeCY, PALETTES.refiners.stroke,    refToSupplyMapping,      2),
      // supplyNodes → Global Supply: custom offsets (no-country nodes are shorter)
      ...supplyToGlobalMapping.map(([fi, _ti]) => ({
        x1: supNodeXs[fi], y1: supNodeCY + 74,
        x2: ancX,          y2: supCY      - 8,
        color: PALETTES.supplyNodes.stroke,
        fromLayer: 3,
      })),
    ];

    return {
      layers,
      edges,
      outputNode: { name: chain.supply, cx: ancX, cy: supCY },
    };
  }

  // ── Legacy 4-layer path (no supplyNodes) ──────────────────────────
  const depCY = topY;
  const minCY = topY + gap;
  const refCY = topY + gap * 2;
  const supCY = topY + gap * 3;

  const depXs = contentAwareSpread(chain.deposits.length, ancX);
  const minXs = contentAwareSpread(chain.miners.length,   ancX);
  const refXs = contentAwareSpread(chain.refiners.length, ancX);

  const layers: LayerGeometry[] = [
    {
      key: "deposits", label: "DEPOSITS", cy: depCY,
      color: PALETTES.deposits,
      nodes: chain.deposits.map((name, i) => ({
        name, cx: depXs[i], cy: depCY,
        opacity: chain.minor.deposits.includes(i) ? 0.4 : 1,
      })),
    },
    {
      key: "miners", label: "MINERS", cy: minCY,
      color: PALETTES.miners,
      nodes: chain.miners.map((name, i) => ({
        name, cx: minXs[i], cy: minCY,
        opacity: chain.minor.miners.includes(i) ? 0.4 : 1,
      })),
    },
    {
      key: "refiners", label: "REFINERS", cy: refCY,
      color: PALETTES.refiners,
      nodes: chain.refiners.map((name, i) => ({
        name, cx: refXs[i], cy: refCY,
        opacity: chain.minor.refiners.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "supply", label: "SUPPLY", cy: supCY,
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
  };
}

// ── COMP TREE GEOMETRY ────────────────────────────────────────────
import type { CompChain } from "@/types";

export function buildCompGeometry(
  chain: CompChain,
  ancX: number, topY: number,
  half = 370, gap = 170,
): TreeGeometry {
  const geCl4CY   = topY;
  const fiberCY   = topY + gap;
  const outCY     = topY + gap * 2;

  const geCl4Xs  = contentAwareSpread(chain.geCl4.length,   ancX);
  const fiberXs  = contentAwareSpread(chain.fiberMfg.length, ancX);

  const layers: LayerGeometry[] = [
    {
      key: "geCl4", label: "GeCl₄ SUPPLIERS", cy: geCl4CY,
      color: PALETTES.geCl4,
      nodes: chain.geCl4.map((name, i) => ({
        name, cx: geCl4Xs[i], cy: geCl4CY,
        opacity: chain.minor.geCl4.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "fiberMfg", label: "FIBER MANUFACTURERS", cy: fiberCY,
      color: PALETTES.fiberMfg,
      nodes: chain.fiberMfg.map((name, i) => ({
        name, cx: fiberXs[i], cy: fiberCY,
        opacity: chain.minor.fiberMfg.includes(i) ? 0.5 : 1,
      })),
    },
    {
      key: "OUTPUT", label: "OUTPUT", cy: outCY,
      color: PALETTES.compOut,
      nodes: [{ name: chain.output, cx: ancX, cy: outCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(geCl4Xs, geCl4CY, fiberXs, fiberCY, PALETTES.geCl4.stroke, chain.geCl4ToFiber, 0),
    ...buildEdges(fiberXs, fiberCY, [ancX], outCY, PALETTES.fiberMfg.stroke, chain.fiberToOutput, 1),
  ];

  return {
    layers, edges,
    outputNode: { name: chain.output, cx: ancX, cy: outCY },
  };
}

// ── SUB TREE GEOMETRY ─────────────────────────────────────────────
import type { SubChain } from "@/types";

export function buildSubGeometry(
  chain: SubChain,
  ancX: number, topY: number,
  half = 380, gap = 170,
): TreeGeometry {
  const assCY  = topY;
  const typeCY = topY + gap;
  const outCY  = topY + gap * 2;

  const assXs  = contentAwareSpread(chain.assembly.length, ancX);
  const typeXs = contentAwareSpread(chain.cableType.length, ancX);

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
  };
}

// ── EU TREE GEOMETRY ──────────────────────────────────────────────
import type { EUChain } from "@/types";

const TEAL_NODE = "#5a8c6a";

export function buildEUGeometry(
  chain: EUChain,
  ancX: number, topY: number,
  _half = 380, gap = 170,
): TreeGeometry {
  const instCY = topY;
  const devCY  = topY + gap;
  const ownCY  = topY + gap * 2;
  const outCY  = topY + gap * 3;

  const instXs = contentAwareSpread(chain.installers.length, ancX);
  const devXs  = contentAwareSpread(chain.developers.length, ancX);
  const ownXs  = contentAwareSpread(chain.owners.length,     ancX);

  const layers: LayerGeometry[] = [
    {
      key: "installers", label: "INSTALLERS", cy: instCY,
      color: PALETTES.installers,
      nodes: chain.installers.map((name, i) => ({
        name, cx: instXs[i], cy: instCY, opacity: 1,
      })),
    },
    {
      key: "developers", label: "DEVELOPERS", cy: devCY,
      color: PALETTES.developers,
      nodes: chain.developers.map((name, i) => ({
        name, cx: devXs[i], cy: devCY, opacity: 1,
      })),
    },
    {
      key: "owners", label: "OWNERS", cy: ownCY,
      color: PALETTES.owners,
      nodes: chain.owners.map((name, i) => {
        const country = chain.ownerCountries?.[i];
        const nodeColor = (country === "UAE" || country === "Saudi Arabia") ? TEAL_NODE : undefined;
        return { name, cx: ownXs[i], cy: ownCY, opacity: 1, color: nodeColor };
      }),
    },
    {
      key: "OUTPUT", label: "OUTPUT", cy: outCY,
      color: PALETTES.euOut,
      nodes: [{ name: chain.output, cx: ancX, cy: outCY, opacity: 1 }],
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(instXs, instCY, devXs, devCY, PALETTES.installers.stroke, chain.installersToDevelopers, 0),
    ...buildEdges(devXs,  devCY,  ownXs, ownCY, PALETTES.developers.stroke,  chain.developersToOwners,     1),
    ...ownXs.map(ox => ({
      x1: ox,   y1: ownCY + EDGE_Y1_OFFSET,
      x2: ancX, y2: outCY  - EDGE_Y2_OFFSET,
      color: PALETTES.owners.stroke,
      fromLayer: 2,
    })),
  ];

  return {
    layers, edges,
    outputNode: { name: chain.output, cx: ancX, cy: outCY },
  };
}

// ── GALLIUM TREE GEOMETRY ────────────────────────────────────────
import type { GalliumChain } from "@/types";

export function computeGalliumSvgWidth(chain: GalliumChain): number {
  const widths = [
    chain.byproductSource.length * SLOT,
    chain.primaryProducer.length * SLOT,
    chain.refiner.length * SLOT,
    chain.supplyAggregates.length * SLOT,
    chain.globalSupply.length * SLOT,
  ];
  return Math.max(1800, Math.max(...widths) + 400);
}

export function buildGalliumGeometry(
  chain: GalliumChain,
  ancX: number, topY: number,
  gap = 170,
): TreeGeometry {
  const srcCY = topY;
  const prodCY = topY + gap;
  const refCY = topY + gap * 2;
  const aggCY = topY + gap * 3;
  const gloCY = topY + gap * 4;

  const srcXs = contentAwareSpread(chain.byproductSource.length, ancX);
  const prodXs = contentAwareSpread(chain.primaryProducer.length, ancX);
  const refXs = contentAwareSpread(chain.refiner.length, ancX);
  const aggXs = contentAwareSpread(chain.supplyAggregates.length, ancX);
  const gloXs = contentAwareSpread(chain.globalSupply.length, ancX);

  const srcMinor = new Set(chain.minor.byproductSource);
  const prodMinor = new Set(chain.minor.primaryProducer);
  const refMinor = new Set(chain.minor.refiner);

  const layers: LayerGeometry[] = [
    {
      key: "byproductSource", label: "BYPRODUCT SOURCE", cy: srcCY,
      nodes: chain.byproductSource.map((n, i) => ({ name: n, cx: srcXs[i], cy: srcCY, opacity: srcMinor.has(i) ? 0.4 : 1 })),
      color: PALETTES.galliumSource,
    },
    {
      key: "primaryProducer", label: "PRIMARY PRODUCERS", cy: prodCY,
      nodes: chain.primaryProducer.map((n, i) => ({ name: n, cx: prodXs[i], cy: prodCY, opacity: prodMinor.has(i) ? 0.4 : 1 })),
      color: PALETTES.galliumProducer,
    },
    {
      key: "refiner", label: "REFINERS", cy: refCY,
      nodes: chain.refiner.map((n, i) => ({ name: n, cx: refXs[i], cy: refCY, opacity: refMinor.has(i) ? 0.4 : 1 })),
      color: PALETTES.galliumRefiner,
    },
    {
      key: "supplyAggregates", label: "SUPPLY", cy: aggCY,
      nodes: chain.supplyAggregates.map((n, i) => ({ name: n, cx: aggXs[i], cy: aggCY, opacity: 1 })),
      color: PALETTES.galliumRefiner,
    },
    {
      key: "globalSupply", label: "GLOBAL", cy: gloCY,
      nodes: chain.globalSupply.map((n, i) => ({ name: n, cx: gloXs[i], cy: gloCY, opacity: 1 })),
      color: PALETTES.galliumRefiner,
    },
  ];

  const edges: EdgeGeometry[] = [
    ...buildEdges(srcXs, srcCY, prodXs, prodCY, PALETTES.galliumSource.stroke, chain.sourceToProducer, 0),
    ...buildEdges(prodXs, prodCY, refXs, refCY, PALETTES.galliumProducer.stroke, chain.producerToRefiner, 1),
    ...buildEdges(refXs, refCY, aggXs, aggCY, PALETTES.galliumRefiner.stroke, chain.refinerToAggregates, 2),
    ...buildEdges(aggXs, aggCY, gloXs, gloCY, PALETTES.galliumRefiner.stroke, chain.aggregatesToGlobal, 3),
  ];

  return {
    layers,
    edges,
    outputNode: { name: chain.globalSupply[0], cx: gloXs[0], cy: gloCY },
  };
}
