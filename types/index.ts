// ── Node types ───────────────────────────────────────────────────
export interface NodeData {
  type: string;
  loc: string;
  stat: string;
  risk: string;
  stats: [string, string][];
  role: string;
  inv: string;
  risks: string[];
}

export type NodesMap = Record<string, NodeData>;

// ── Panel types ───────────────────────────────────────────────────
export interface BigStat {
  val: string;
  key: string;
}

export interface PanelSection {
  label: string;
  type: "bigstats" | "prose" | "risks" | "angle";
  content?: string | string[];
  stats?: BigStat[];
}

export interface PanelContent {
  context: string;
  thesis?: string;
  title: string;
  sub: string;
  sections: PanelSection[];
}

export interface LayerPanels {
  [layerKey: string]: PanelContent;
}

export interface PanelsData {
  rawIntro: PanelContent;
  compIntro: PanelContent;
  subIntro: PanelContent;
  euIntro: PanelContent;
  euLayers: LayerPanels;
  layers: LayerPanels;
}

// ── Chain types ───────────────────────────────────────────────────
export interface RawChain {
  deposits: string[];
  miners: string[];
  refiners: string[];
  supply: string;
  depToMin: [number, number][];
  minToRef: [number, number][];
  minor: { deposits: number[]; miners: number[]; refiners: number[] };
}

export interface CompChain {
  preform: string[];
  drawing: string[];
  output: string;
  preToDrawing: [number, number][];
  minor: { preform: number[]; drawing: number[] };
}

export interface SubChain {
  assembly: string[];
  cableType: string[];
  output: string;
  assToType: [number, number][];
  minor: { assembly: number[]; cableType: number[] };
}

export interface EUChain {
  integration: string[];
  hyperscale: string[];
  output: string;
  intToHyper: [number, number][];
}

export interface ChainsData {
  SPINE_TREE: Record<string, Record<string, Record<string, string[]>>>;
  RAW_DATA: Record<string, RawChain>;
  COMP_DATA: Record<string, CompChain>;
  SUB_DATA: Record<string, SubChain>;
  EU_DATA: Record<string, EUChain>;
}

// ── Layer definition (generic, for future scaling) ────────────────
export interface LayerDef {
  key: string;
  label: string;
  color: { stroke: string; text: string; pip: string };
}

// ── App state ─────────────────────────────────────────────────────
export type AppState = 0 | 1 | 2 | 3 | 4;
// 0=spine 1=raw 2=comp 3=sub 4=eu

export interface SpineSelection {
  raw: string | null;   // e.g. "Germanium"
  comp: string | null;  // e.g. "GeO₂ / GeCl₄"
  sub: string | null;   // e.g. "Fiber Optics"
  eu: string | null;    // e.g. "AI Datacenter"
}

// ── SVG coordinate helpers ────────────────────────────────────────
export interface Point { x: number; y: number; }
export interface TreeNode { name: string; cx: number; cy: number; }
