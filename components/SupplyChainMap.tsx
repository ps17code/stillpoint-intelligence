"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

export interface SupplyChainMapProps {
  chainState: 1 | 2 | 3 | 4;
  rawSelection?: string;
  compSelection?: string;
  subSelection?: string;
  euSelection?: string;
  /** When true, SVG fills its container (position absolute inset 0) instead of fixed 380px height */
  fillContainer?: boolean;
}

type Pt = { lon: number; lat: number; name: string; loc: string };
type Layer = { label: string; color: string; nodes: Pt[]; radius?: number };
type Conn = [number, number];
type Flow = { from: number; to: number; connections: Conn[] };

// ── Node panel data ──────────────────────────────────────────────────────────
interface PanelStat { value: string; label: string; }
interface NodePanelData {
  name: string;
  type: string;
  location: string;
  country: string;
  stats: PanelStat[];
  description: string;
  confidence: "high" | "medium";
  ticker?: string;
  isBottleneck: boolean;
}

const NODE_DATA: Record<string, NodePanelData> = {
  // ── Deposits ──────────────────────────────────────────────────────────────
  "Yunnan Deposit": {
    name: "Yunnan Deposit", type: "Deposit", location: "Yunnan, China", country: "China",
    stats: [{ value: ">1,000t", label: "Ge resources" }, { value: "Lignite coal", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Lincang coal basin — one of China's largest germanium-bearing lignite deposits. Operated by Lincang Xinyuan Germanium. Subject to MOFCOM export licensing since August 2023.",
    confidence: "high", isBottleneck: false,
  },
  "Inner Mongolia Deposit": {
    name: "Inner Mongolia Deposit", type: "Deposit", location: "Inner Mongolia, China", country: "China",
    stats: [{ value: "~1,600t", label: "Ge resources" }, { value: "Lignite coal", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Wulantuga coal deposit in Inner Mongolia. Among the highest-grade germanium-bearing coal deposits globally. Production subject to Chinese export control regime.",
    confidence: "high", isBottleneck: false,
  },
  "Heilongjiang Deposit": {
    name: "Heilongjiang Deposit", type: "Deposit", location: "Heilongjiang, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Coal/Zinc", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Secondary coal-hosted germanium deposit in northeastern China. Contributes to China's dominant share of global germanium mining output.",
    confidence: "medium", isBottleneck: false,
  },
  "Guizhou Deposit": {
    name: "Guizhou Deposit", type: "Deposit", location: "Guizhou, China", country: "China",
    stats: [{ value: "~4,000t", label: "Ge resources (Yimin)" }, { value: "Zinc ore", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Zinc-hosted germanium deposit. Part of a broader southwest China cluster that accounts for the majority of China's total germanium resources.",
    confidence: "medium", isBottleneck: false,
  },
  "Sichuan Deposit": {
    name: "Sichuan Deposit", type: "Deposit", location: "Sichuan, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Zinc ore", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Zinc ore deposit in Sichuan Province with recoverable germanium trace concentrations. Secondary contributor to China's germanium production base.",
    confidence: "medium", isBottleneck: false,
  },
  "Jilin Deposit": {
    name: "Jilin Deposit", type: "Deposit", location: "Jilin, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Coal/Zinc", label: "Host type" }, { value: "Export ctrl", label: "Status" }],
    description: "Northeast China deposit contributing to domestic germanium supply. Processed through local smelting and refining operations.",
    confidence: "medium", isBottleneck: false,
  },
  "Kipushi Deposit": {
    name: "Kipushi Deposit", type: "Deposit", location: "Lubumbashi, DRC", country: "DRC",
    stats: [{ value: "700t+", label: "Ge potential" }, { value: "Tailings", label: "Source type" }, { value: "Ramping", label: "Status" }],
    description: "Big Hill tailings site in Lubumbashi. Most important new western primary source in decades. Umicore-STL partnership backed by the 14-nation Minerals Security Partnership. First shipment October 2024.",
    confidence: "medium", isBottleneck: false,
  },
  "Red Dog Deposit": {
    name: "Red Dog Deposit", type: "Deposit", location: "Alaska, USA", country: "USA",
    stats: [{ value: "Not published", label: "Ge reserves" }, { value: "Zinc ore", label: "Host type" }, { value: "Declining", label: "Output trend" }],
    description: "Sole US germanium-bearing deposit. World-class zinc mine in northwest Alaska operated by Teck Resources. Germanium not disclosed in financial reporting. Output declining with no published reserve extension.",
    confidence: "medium", isBottleneck: false,
  },

  // ── Miners ────────────────────────────────────────────────────────────────
  "Yunnan Chihong": {
    name: "Yunnan Chihong", type: "Miner", location: "Qujing, China", country: "China",
    stats: [{ value: "65.9t", label: "2023 Ge output" }, { value: "~30%", label: "Global share" }, { value: "60t/yr", label: "Ge capacity" }],
    description: "World's largest germanium producer — 30% of global supply from a single entity. Safety project at Huize mine (late 2024) reduced Q1 2025 zinc output 17,400t, directly cutting Ge supply.",
    confidence: "high", isBottleneck: true,
  },
  "Inner Mongolia Miner": {
    name: "Inner Mongolia Miner", type: "Miner", location: "Inner Mongolia, China", country: "China",
    stats: [{ value: "State-owned", label: "Ownership" }, { value: "Coal", label: "Primary output" }, { value: "Export ctrl", label: "Status" }],
    description: "State-linked coal operations in Inner Mongolia extracting germanium as a byproduct from Wulantuga basin lignite. Output subject to MOFCOM export licensing regime.",
    confidence: "medium", isBottleneck: false,
  },
  "Hebei Miner": {
    name: "Hebei Miner", type: "Miner", location: "Hebei, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }],
    description: "Zinc mining operations in Hebei Province recovering germanium from smelter residues. Part of China's integrated zinc-germanium production base.",
    confidence: "medium", isBottleneck: false,
  },
  "Guizhou Miner": {
    name: "Guizhou Miner", type: "Miner", location: "Guizhou, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }],
    description: "Zinc ore extraction in Guizhou. Germanium recovered as byproduct during smelting. Production and volumes not disclosed publicly.",
    confidence: "medium", isBottleneck: false,
  },
  "Jilin Miner": {
    name: "Jilin Miner", type: "Miner", location: "Jilin, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Coal/Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }],
    description: "Mining operations in Jilin Province contributing to Chinese domestic germanium supply. Secondary producer within China's concentrated germanium supply base.",
    confidence: "medium", isBottleneck: false,
  },
  "Glencore Kipushi": {
    name: "Glencore Kipushi", type: "Miner", location: "Lubumbashi, DRC", country: "DRC",
    stats: [{ value: "<5t/yr", label: "Current Ge output" }, { value: "700t+", label: "Site potential" }, { value: "Ramping", label: "Status" }],
    description: "Operating the Kipushi zinc mine in DRC in partnership with STL/Gécamines. First germanium concentrate shipped to Umicore in October 2024. Scaling to meaningful volumes will take 3–5 years.",
    confidence: "medium", isBottleneck: false,
  },
  "Teck Resources": {
    name: "Teck Resources", type: "Miner", location: "British Columbia, Canada", country: "Canada",
    stats: [{ value: "C$30B+", label: "Market cap" }, { value: "Undisclosed", label: "Ge volumes" }, { value: "Declining", label: "Red Dog status" }],
    description: "Controls Red Dog in Alaska — sole US germanium source. Germanium is financially immaterial to Teck. In discussions with US and Canadian governments about expanding recovery. Recently sold Apex mine to Blue Moon Metals.",
    confidence: "medium", ticker: "TECK.B", isBottleneck: false,
  },

  // ── Refiners ──────────────────────────────────────────────────────────────
  "Yunnan Refinery": {
    name: "Yunnan Refinery", type: "Refiner", location: "Yunnan, China", country: "China",
    stats: [{ value: "State-linked", label: "Ownership" }, { value: "GeO₂/GeCl₄", label: "Products" }, { value: "Export ctrl", label: "Status" }],
    description: "Primary germanium refining operation in Yunnan Province processing output from local zinc and coal operations into GeO₂ and GeCl₄. Supply subject to MOFCOM export licensing.",
    confidence: "high", isBottleneck: false,
  },
  "Hebei Refinery": {
    name: "Hebei Refinery", type: "Refiner", location: "Hebei, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge throughput" }, { value: "GeO₂", label: "Primary product" }, { value: "Export ctrl", label: "Status" }],
    description: "Zinc smelter complex in Hebei with germanium recovery capability. Processes zinc concentrates from local and regional mines. Germanium volumes not publicly disclosed.",
    confidence: "medium", isBottleneck: false,
  },
  "Chihong Refinery": {
    name: "Chihong Refinery", type: "Refiner", location: "Yunnan, China", country: "China",
    stats: [{ value: "60t/yr", label: "Ge capacity" }, { value: "GeCl₄/GeO₂", label: "Products" }, { value: "Export ctrl", label: "Status" }],
    description: "Yunnan Chihong's dedicated germanium refinery. Produces germanium metal, GeO₂, GeCl₄ for fiber optics, and germanium substrates for solar cells. All output subject to Chinese export controls.",
    confidence: "high", isBottleneck: true,
  },
  "Jilin Refinery": {
    name: "Jilin Refinery", type: "Refiner", location: "Jilin, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge throughput" }, { value: "GeO₂", label: "Primary product" }, { value: "Export ctrl", label: "Status" }],
    description: "Germanium refining operations in Jilin Province. Secondary producer within China's concentrated refining base. Volumes not publicly disclosed.",
    confidence: "medium", isBottleneck: false,
  },
  "Umicore": {
    name: "Umicore", type: "Refiner", location: "Olen, Belgium", country: "Belgium",
    stats: [{ value: "40–50t/yr", label: "Ge refined" }, { value: "€3.9B", label: "Market cap" }, { value: ">50%", label: "From recycling" }],
    description: "Sole western germanium refiner at scale. Olen facility supplies the majority of western fiber manufacturers with GeCl₄. Critical DRC feedstock partner. Appears across 3 of 5 supply chain bottlenecks.",
    confidence: "high", ticker: "UMI", isBottleneck: true,
  },
  "5N Plus": {
    name: "5N Plus", type: "Refiner", location: "Montreal, Canada", country: "Canada",
    stats: [{ value: "$391M", label: "FY25 revenue" }, { value: "+245%", label: "Earnings YoY" }, { value: "$32.5M", label: "DoD funding" }],
    description: "Most direct public equity exposure to the germanium thesis. Dual DoD grants under the Defense Production Act for germanium capacity expansion at St. George, Utah. Located 23km from Blue Moon's Apex mine.",
    confidence: "high", ticker: "VNP", isBottleneck: false,
  },
  "Indium Corp.": {
    name: "Indium Corp.", type: "Refiner", location: "Detroit, USA", country: "USA",
    stats: [{ value: "Small vol.", label: "Ge throughput" }, { value: "Specialty", label: "Market focus" }, { value: "Private", label: "Ownership" }],
    description: "US specialty metals refiner with germanium processing capabilities. Primarily serves defense and electronics markets. Small volumes relative to Umicore and 5N Plus.",
    confidence: "medium", isBottleneck: false,
  },

  // ── State 2: Component nodes ───────────────────────────────────────────────
  "Corning": {
    name: "Corning", type: "Fiber Mfg", location: "New York, USA", country: "USA",
    stats: [{ value: "$15B+", label: "Market cap" }, { value: "+58%", label: "Enterprise YoY Q3'25" }, { value: "Sold out", label: "2026 inventory" }],
    description: "Largest optical fiber manufacturer globally. Enterprise segment grew 58% YoY in Q3 2025 driven by AI datacenter demand. Reported inventory sold through 2026. Major germanium GeCl₄ consumer.",
    confidence: "high", ticker: "GLW", isBottleneck: true,
  },
  "Prysmian": {
    name: "Prysmian", type: "Fiber Mfg", location: "Florence, Italy", country: "Italy",
    stats: [{ value: "€19B+", label: "Market cap" }, { value: "#1", label: "Cable mfg by revenue" }, { value: "OPGW", label: "Specialty cables" }],
    description: "World's largest cable manufacturer by revenue. Produces optical fiber and cable for telecom, energy, and industrial applications. Major consumer of GeO₂ for fiber preform production.",
    confidence: "high", ticker: "PRY", isBottleneck: false,
  },
  "Fujikura": {
    name: "Fujikura", type: "Fiber Mfg", location: "Tokyo, Japan", country: "Japan",
    stats: [{ value: "¥800B+", label: "Revenue" }, { value: "Fiber/Splicing", label: "Core products" }, { value: "Defense", label: "Key segment" }],
    description: "Japanese optical fiber and cable manufacturer. Produces standard and specialty fiber types consuming GeO₂. Also manufactures fusion splicers and connectivity products.",
    confidence: "high", isBottleneck: false,
  },
  "Sumitomo": {
    name: "Sumitomo Electric", type: "Fiber Mfg", location: "Osaka, Japan", country: "Japan",
    stats: [{ value: "¥3.8T", label: "Revenue" }, { value: "Optical fiber", label: "Key product" }, { value: "1970s", label: "Fiber pioneer" }],
    description: "Pioneer of optical fiber development. Manufactures optical fiber, preforms, and cable systems. One of the earliest adopters of GeCl₄ for fiber core doping.",
    confidence: "high", isBottleneck: false,
  },
  "OFS Furukawa": {
    name: "OFS Furukawa", type: "Fiber Mfg", location: "Aichi, Japan", country: "Japan",
    stats: [{ value: "Subsidiary", label: "Structure" }, { value: "Specialty fiber", label: "Focus" }, { value: "US/Japan", label: "Key markets" }],
    description: "Optical fiber and cable manufacturer. Produces standard SMF and specialty fibers for telecom and datacom applications. Subsidiary of Furukawa Electric.",
    confidence: "medium", isBottleneck: false,
  },
  "YOFC": {
    name: "YOFC", type: "Fiber Mfg", location: "Wuhan, China", country: "China",
    stats: [{ value: "Largest", label: "China fiber mfg" }, { value: "HKEx listed", label: "Exchange" }, { value: "JV origin", label: "Corning + state" }],
    description: "Yangtze Optical Fibre and Cable. China's largest optical fiber manufacturer, originally a joint venture with Corning and Dutch DSM. Primarily serves domestic Chinese market with some exports.",
    confidence: "high", isBottleneck: false,
  },
  "Chihong Supplier": {
    name: "Chihong Supplier", type: "GeCl₄ Supplier", location: "Yunnan, China", country: "China",
    stats: [{ value: "60t/yr", label: "Ge capacity" }, { value: "GeCl₄", label: "Primary product" }, { value: "Export ctrl", label: "Status" }],
    description: "Yunnan Chihong's GeCl₄ production unit supplying global fiber manufacturers. Export of GeCl₄ requires MOFCOM licensing. Subject to December 2024 US export ban (suspended Nov 2025).",
    confidence: "high", isBottleneck: true,
  },
  "Hebei Supplier": {
    name: "Hebei Supplier", type: "GeCl₄ Supplier", location: "Hebei, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge capacity" }, { value: "GeCl₄/GeO₂", label: "Products" }, { value: "Export ctrl", label: "Status" }],
    description: "Secondary Chinese GeCl₄ supplier in Hebei Province. Processes germanium from regional zinc smelting operations. All exports require MOFCOM licensing.",
    confidence: "medium", isBottleneck: false,
  },
  "Jilin Supplier": {
    name: "Jilin Supplier", type: "GeCl₄ Supplier", location: "Jilin, China", country: "China",
    stats: [{ value: "Undisclosed", label: "Ge capacity" }, { value: "GeCl₄", label: "Primary product" }, { value: "Export ctrl", label: "Status" }],
    description: "GeCl₄ production from Jilin Province germanium operations. Secondary supplier within China's concentrated GeCl₄ production base.",
    confidence: "medium", isBottleneck: false,
  },
};

function makeFallbackPanel(node: Pt, layer: Layer): NodePanelData {
  return {
    name: node.name, type: layer.label, location: node.loc, country: "",
    stats: [{ value: "—", label: "Data pending" }, { value: layer.label, label: "Layer type" }, { value: "—", label: "Status" }],
    description: `${node.name} operates within the ${layer.label} layer of the supply chain.`,
    confidence: "medium", isBottleneck: false,
  };
}

// ── State 1: Germanium Raw Material ─────────────────────────────────────────
const S1_LAYERS: Layer[] = [
  { label: "Deposits", color: "#B8975A", radius: 3, nodes: [
    { lon:100.08, lat:23.88, name: "Yunnan Deposit",         loc: "Yunnan, China" },
    { lon:116.8,  lat:44.5,  name: "Inner Mongolia Deposit", loc: "Inner Mongolia, China" },
    { lon:119.8,  lat:48.5,  name: "Heilongjiang Deposit",   loc: "Heilongjiang, China" },
    { lon:103.3,  lat:26.4,  name: "Guizhou Deposit",        loc: "Guizhou, China" },
    { lon:104.1,  lat:27.6,  name: "Sichuan Deposit",        loc: "Sichuan, China" },
    { lon:133.0,  lat:47.5,  name: "Jilin Deposit",          loc: "Jilin, China" },
    { lon:27.5,   lat:-3.5,  name: "Kipushi Deposit",        loc: "DRC" },
    { lon:-162.9, lat:68.1,  name: "Red Dog Deposit",        loc: "Alaska, USA" },
  ]},
  { label: "Miners", color: "#7DA06A", radius: 2.5, nodes: [
    { lon:100.2,  lat:23.5,  name: "Yunnan Chihong",       loc: "Yunnan, China" },
    { lon:117.0,  lat:44.8,  name: "Inner Mongolia Miner", loc: "Inner Mongolia, China" },
    { lon:115.5,  lat:40.0,  name: "Hebei Miner",          loc: "Hebei, China" },
    { lon:103.5,  lat:26.1,  name: "Guizhou Miner",        loc: "Guizhou, China" },
    { lon:132.5,  lat:47.0,  name: "Jilin Miner",          loc: "Jilin, China" },
    { lon:27.8,   lat:-3.8,  name: "Glencore Kipushi",     loc: "DRC" },
    { lon:-120.5, lat:49.3,  name: "Teck Resources",       loc: "British Columbia, Canada" },
  ]},
  { label: "Refiners", color: "#A07DAA", radius: 2.5, nodes: [
    { lon:99.8,   lat:24.2,  name: "Yunnan Refinery",  loc: "Yunnan, China" },
    { lon:113.5,  lat:38.0,  name: "Hebei Refinery",   loc: "Hebei, China" },
    { lon:103.0,  lat:25.8,  name: "Chihong Refinery", loc: "Yunnan, China" },
    { lon:132.8,  lat:47.8,  name: "Jilin Refinery",   loc: "Jilin, China" },
    { lon:5.5,    lat:51.2,  name: "Umicore",          loc: "Olen, Belgium" },
    { lon:-73.6,  lat:45.5,  name: "5N Plus",          loc: "Montreal, Canada" },
    { lon:-83.0,  lat:42.3,  name: "Indium Corp.",     loc: "Detroit, USA" },
  ]},
];
const S1_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[1,1],[2,2],[3,3],[4,3],[5,4],[6,5],[7,6]] },
  { from: 1, to: 2, connections: [[0,0],[1,1],[2,1],[3,2],[4,3],[5,4],[6,5]] },
];

// ── State 2: Component ───────────────────────────────────────────────────────
const S2_LAYERS: Layer[] = [
  { label: "GeCl₄ Suppliers", color: "#9a7b3c", radius: 3, nodes: [
    { lon:5.5,   lat:51.2, name: "Umicore",          loc: "Olen, Belgium" },
    { lon:103.0, lat:25.8, name: "Chihong Supplier", loc: "Yunnan, China" },
    { lon:113.5, lat:38.0, name: "Hebei Supplier",   loc: "Hebei, China" },
    { lon:132.8, lat:47.8, name: "Jilin Supplier",   loc: "Jilin, China" },
  ]},
  { label: "Fiber Manufacturers", color: "#5a7a9c", radius: 2.5, nodes: [
    { lon:-77.0,  lat:42.4,  name: "Corning",      loc: "New York, USA" },
    { lon:11.25,  lat:43.77, name: "Prysmian",     loc: "Florence, Italy" },
    { lon:139.7,  lat:35.7,  name: "Fujikura",     loc: "Tokyo, Japan" },
    { lon:136.9,  lat:35.2,  name: "Sumitomo",     loc: "Osaka, Japan" },
    { lon:136.0,  lat:35.0,  name: "OFS Furukawa", loc: "Aichi, Japan" },
    { lon:117.0,  lat:30.5,  name: "YOFC",         loc: "Wuhan, China" },
  ]},
];
const S2_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[0,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3]] },
];

// ── State 3: Subsystem ───────────────────────────────────────────────────────
const S3_LAYERS: Layer[] = [
  { label: "Cable Assemblers", color: "#5a7a9c", radius: 3, nodes: [
    { lon:-77.0,  lat:42.4,  name: "Corning",     loc: "New York, USA" },
    { lon:11.25,  lat:43.77, name: "Prysmian",    loc: "Florence, Italy" },
    { lon:136.9,  lat:35.2,  name: "Sumitomo",    loc: "Osaka, Japan" },
    { lon:-80.8,  lat:35.2,  name: "CommScope",   loc: "North Carolina, USA" },
    { lon:-81.0,  lat:34.0,  name: "OFS",         loc: "South Carolina, USA" },
    { lon:2.35,   lat:48.86, name: "Nexans",      loc: "Paris, France" },
    { lon:-73.0,  lat:41.0,  name: "AFL Telecom", loc: "Connecticut, USA" },
    { lon:139.7,  lat:35.7,  name: "Fujikura",    loc: "Tokyo, Japan" },
  ]},
  { label: "Cable Types", color: "#9a7b3c", radius: 2.5, nodes: [
    { lon:-95.0, lat:38.0, name: "Terrestrial Routes", loc: "North America" },
    { lon:10.0,  lat:50.0, name: "Terrestrial Routes", loc: "Europe" },
    { lon:-30.0, lat:30.0, name: "Subsea Routes",      loc: "Atlantic" },
  ]},
];
const S3_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1],[5,2],[6,2],[7,2]] },
];

// ── State 4: End Use ─────────────────────────────────────────────────────────
const S4_LAYERS: Layer[] = [
  { label: "Installers", color: "#6ECF7A", radius: 2.5, nodes: [
    { lon:-80.2,  lat:26.1, name: "MasTec",      loc: "Florida, USA" },
    { lon:-84.4,  lat:33.7, name: "Dycom",       loc: "Georgia, USA" },
    { lon:-111.9, lat:40.7, name: "Anixter",     loc: "Utah, USA" },
    { lon:-80.0,  lat:40.4, name: "FS Networks", loc: "Pennsylvania, USA" },
    { lon:-95.0,  lat:37.0, name: "Black Box",   loc: "Kansas, USA" },
  ]},
  { label: "Developers", color: "#5a7a9c", radius: 2.5, nodes: [
    { lon:-73.9,  lat:40.7,  name: "Equinix",       loc: "New York, USA" },
    { lon:-93.3,  lat:45.0,  name: "CyrusOne",      loc: "Minnesota, USA" },
    { lon:-122.4, lat:37.8,  name: "Digital Realty", loc: "San Francisco, USA" },
    { lon:-84.5,  lat:34.0,  name: "QTS",           loc: "Georgia, USA" },
    { lon:-95.0,  lat:38.0,  name: "Iron Mountain", loc: "Kansas, USA" },
  ]},
  { label: "Owners", color: "#9a7b3c", radius: 3, nodes: [
    { lon:-122.3, lat:47.6, name: "Microsoft", loc: "Seattle, USA" },
    { lon:-122.1, lat:47.7, name: "Amazon",    loc: "Seattle, USA" },
    { lon:-122.0, lat:37.4, name: "Google",    loc: "Mountain View, USA" },
    { lon:-122.2, lat:37.5, name: "Meta",      loc: "Menlo Park, USA" },
    { lon:-96.8,  lat:32.8, name: "AT&T",      loc: "Dallas, USA" },
    { lon:-74.0,  lat:40.7, name: "Verizon",   loc: "New York, USA" },
    { lon:54.4,   lat:24.5, name: "STC",       loc: "Abu Dhabi, UAE" },
    { lon:39.2,   lat:21.5, name: "Mobily",    loc: "Riyadh, Saudi Arabia" },
  ]},
];
const S4_FLOWS: Flow[] = [
  { from: 0, to: 1, connections: S4_LAYERS[0].nodes.flatMap((_, i) => S4_LAYERS[1].nodes.map((_, j): Conn => [i, j])) },
  { from: 1, to: 2, connections: S4_LAYERS[1].nodes.flatMap((_, i) => S4_LAYERS[2].nodes.map((_, j): Conn => [i, j])) },
];

function getConfig(chainState: 1|2|3|4, rawSelection?: string) {
  if (chainState === 1) {
    if (rawSelection !== "Germanium") return null;
    return { layers: S1_LAYERS, flows: S1_FLOWS };
  }
  if (chainState === 2) return { layers: S2_LAYERS, flows: S2_FLOWS };
  if (chainState === 3) return { layers: S3_LAYERS, flows: S3_FLOWS };
  return { layers: S4_LAYERS, flows: S4_FLOWS };
}

const TYPE_COLOR: Record<string, string> = {
  "Deposits": "#B8975A", "Deposit": "#B8975A",
  "Miners": "#7DA06A",   "Miner": "#7DA06A",
  "Refiners": "#A07DAA", "Refiner": "#A07DAA",
  "GeCl₄ Suppliers": "#9a7b3c", "GeCl₄ Supplier": "#9a7b3c",
  "Fiber Manufacturers": "#5a7a9c", "Fiber Mfg": "#5a7a9c",
  "Cable Assemblers": "#5a7a9c",
  "Cable Types": "#9a7b3c",
  "Installers": "#6ECF7A",
  "Developers": "#5a7a9c",
  "Owners": "#9a7b3c",
};

const MAP_W = 700;
const MAP_H = 380;

type TooltipInfo = { name: string; loc: string; type: string; color: string; x: number; y: number } | null;

// ── Node detail panel ────────────────────────────────────────────────────────
function NodeDetailPanel({ data, onClose }: { data: NodePanelData; onClose: () => void }) {
  const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
  const INTER: React.CSSProperties = { fontFamily: "Inter, -apple-system, sans-serif" };
  const typeColor = TYPE_COLOR[data.type] ?? "rgba(255,255,255,0.3)";

  return (
    <div style={{
      position: "absolute",
      bottom: 16,
      right: 16,
      width: 260,
      background: "rgba(20,20,18,0.92)",
      borderRadius: 6,
      border: "0.5px solid rgba(255,255,255,0.07)",
      zIndex: 15,
      overflow: "hidden",
    }}>
      {/* A. Header */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        {/* Top row: type + badges + close */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
          <span style={{ ...MONO, fontSize: 6, textTransform: "uppercase", letterSpacing: "0.1em", color: typeColor }}>{data.type}</span>
          {data.isBottleneck && (
            <span style={{ ...MONO, fontSize: 5.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(163,45,45,0.7)", background: "rgba(163,45,45,0.1)", padding: "1.5px 5px", borderRadius: 2 }}>Bottleneck</span>
          )}
          {data.ticker && (
            <span style={{ ...MONO, fontSize: 6.5, color: "rgba(100,160,220,0.5)", background: "rgba(100,160,220,0.06)", padding: "1.5px 5px", borderRadius: 2 }}>{data.ticker}</span>
          )}
          <button
            onClick={onClose}
            style={{ marginLeft: "auto", ...MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}
          >✕</button>
        </div>
        {/* Entity name */}
        <div style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, marginBottom: 3 }}>{data.name}</div>
        {/* Location */}
        <div style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.25)" }}>{data.location}</div>
      </div>

      {/* B. Stats row */}
      <div style={{ display: "flex", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        {data.stats.slice(0, 3).map((s, i) => (
          <div key={i} style={{
            flex: 1,
            padding: "7px 10px",
            borderRight: i < 2 ? "0.5px solid rgba(255,255,255,0.03)" : "none",
          }}>
            <div style={{ ...MONO, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.2, marginBottom: 2 }}>{s.value}</div>
            <div style={{ ...MONO, fontSize: 5.5, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.18)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* C. Description */}
      <div style={{ padding: "8px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        <div style={{ ...INTER, fontSize: 9.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{data.description}</div>
      </div>

      {/* D. Footer */}
      <div style={{ padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(200,180,140,0.5)", cursor: "default" }}>View full profile →</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: data.confidence === "high" ? "#7DA06A" : "#B8975A", flexShrink: 0 }} />
          <span style={{ ...MONO, fontSize: 5.5, color: "rgba(255,255,255,0.12)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{data.confidence === "high" ? "High" : "Medium"}</span>
        </div>
      </div>
    </div>
  );
}

export default function SupplyChainMap({ chainState, rawSelection, fillContainer }: SupplyChainMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>(null);
  const [selectedPanel, setSelectedPanel] = useState<NodePanelData | null>(null);

  // Refs for imperative dot scale updates
  const dotMapRef = useRef<Map<string, { dot: SVGCircleElement; r: number }>>(new Map());
  const prevSelectedRef = useRef<string | null>(null);

  // Exposed so the close button can also reset the dot
  function deselectNode() {
    if (prevSelectedRef.current) {
      const prev = dotMapRef.current.get(prevSelectedRef.current);
      if (prev) prev.dot.setAttribute("r", String(prev.r));
      prevSelectedRef.current = null;
    }
    setSelectedPanel(null);
  }

  useEffect(() => {
    const config = getConfig(chainState, rawSelection);
    if (!config || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    dotMapRef.current.clear();
    // Reset selection when chain changes
    prevSelectedRef.current = null;
    setSelectedPanel(null);

    const { layers, flows } = config;
    const el = svgRef.current;

    const proj = d3.geoNaturalEarth1().scale(110).translate([MAP_W / 2 - 28, MAP_H / 2 + 20]);
    const path = d3.geoPath().projection(proj);
    const pt = (lon: number, lat: number): [number, number] => proj([lon, lat]) ?? [0, 0];

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then((world: Topology) => {
        if (!svgRef.current) return;

        // Land + borders
        svg.append("path")
          .datum(topojson.feature(world, (world.objects as Record<string, GeometryCollection>).land))
          .attr("d", path)
          .attr("fill", "#ddd9cf");

        svg.append("path")
          .datum(topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries, (a, b) => a !== b))
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#d0ccc2")
          .attr("stroke-width", 0.4);

        // Flow arcs
        const arcPath = (x1: number, y1: number, x2: number, y2: number) => {
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.2;
          return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
        };

        let dotIdx = 0;
        for (const flow of flows) {
          const fromL = layers[flow.from];
          const toL   = layers[flow.to];
          for (const [fi, ti] of flow.connections) {
            const [x1, y1] = pt(fromL.nodes[fi].lon, fromL.nodes[fi].lat);
            const [x2, y2] = pt(toL.nodes[ti].lon,   toL.nodes[ti].lat);
            const d = arcPath(x1, y1, x2, y2);
            const dur   = 2200 + (dotIdx % 5) * 300;
            const delay = (dotIdx * 400) % 3000;

            svg.append("path")
              .attr("d", d).attr("fill", "none")
              .attr("stroke", fromL.color).attr("stroke-width", 0.7)
              .attr("stroke-opacity", 0.18);

            const pathId = `scm-p-${chainState}-${dotIdx}`;
            const hiddenPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            hiddenPath.setAttribute("id", pathId);
            hiddenPath.setAttribute("d", d);
            hiddenPath.setAttribute("fill", "none");
            hiddenPath.setAttribute("stroke", "none");
            el.appendChild(hiddenPath);

            const animDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            animDot.setAttribute("r", "1.8");
            animDot.setAttribute("fill", fromL.color);
            animDot.setAttribute("fill-opacity", "0.75");
            const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
            anim.setAttribute("dur", `${dur}ms`);
            anim.setAttribute("begin", `${delay}ms`);
            anim.setAttribute("repeatCount", "indefinite");
            anim.setAttribute("calcMode", "linear");
            const mpath = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
            mpath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
            anim.appendChild(mpath);
            animDot.appendChild(anim);
            el.appendChild(animDot);

            dotIdx++;
          }
        }

        // Nodes
        for (let li = 0; li < layers.length; li++) {
          const layer = layers[li];
          const r = layer.radius ?? 2.5;
          for (let ni = 0; ni < layer.nodes.length; ni++) {
            const node = layer.nodes[ni];
            const [x, y] = pt(node.lon, node.lat);
            const haloDur = `${2000 + ni * 200}ms`;
            const haloBegin = `${ni * 300}ms`;

            // Halo
            const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            halo.setAttribute("cx", String(x)); halo.setAttribute("cy", String(y));
            halo.setAttribute("r", "0");
            halo.setAttribute("fill", "none");
            halo.setAttribute("stroke", layer.color); halo.setAttribute("stroke-width", "0.8");
            const ar = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            ar.setAttribute("attributeName", "r"); ar.setAttribute("values", "0;12");
            ar.setAttribute("dur", haloDur); ar.setAttribute("begin", haloBegin);
            ar.setAttribute("repeatCount", "indefinite");
            const ao = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            ao.setAttribute("attributeName", "stroke-opacity"); ao.setAttribute("values", "0.4;0");
            ao.setAttribute("dur", haloDur); ao.setAttribute("begin", haloBegin);
            ao.setAttribute("repeatCount", "indefinite");
            halo.appendChild(ar); halo.appendChild(ao);
            el.appendChild(halo);

            // Solid dot
            const solidDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            solidDot.setAttribute("cx", String(x)); solidDot.setAttribute("cy", String(y));
            solidDot.setAttribute("r", String(r));
            solidDot.setAttribute("fill", layer.color);
            solidDot.setAttribute("fill-opacity", "0.9");
            solidDot.setAttribute("style", "cursor: pointer; transition: r 0.15s;");
            el.appendChild(solidDot);

            // Store ref for imperative scale updates
            dotMapRef.current.set(node.name, { dot: solidDot, r });

            // Invisible hit area
            const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            hit.setAttribute("cx", String(x)); hit.setAttribute("cy", String(y));
            hit.setAttribute("r", "8");
            hit.setAttribute("fill", "transparent");
            hit.setAttribute("style", "cursor: pointer;");

            // Hover
            hit.addEventListener("mouseenter", () => {
              const hitRect = hit.getBoundingClientRect();
              const containerRect = (el.parentElement ?? el).getBoundingClientRect();
              const cx = hitRect.left + hitRect.width  / 2 - containerRect.left;
              const cy = hitRect.top  + hitRect.height / 2 - containerRect.top;
              setTooltip({ name: node.name, loc: node.loc, type: layer.label, color: layer.color, x: cx, y: cy });
              if (prevSelectedRef.current !== node.name) {
                solidDot.setAttribute("r", String(r * 1.5));
              }
            });
            hit.addEventListener("mouseleave", () => {
              setTooltip(null);
              if (prevSelectedRef.current !== node.name) {
                solidDot.setAttribute("r", String(r));
              }
            });

            // Click — select / deselect
            hit.addEventListener("click", () => {
              if (prevSelectedRef.current === node.name) {
                // Deselect same node
                solidDot.setAttribute("r", String(r));
                prevSelectedRef.current = null;
                setSelectedPanel(null);
              } else {
                // Reset previous
                if (prevSelectedRef.current) {
                  const prev = dotMapRef.current.get(prevSelectedRef.current);
                  if (prev) prev.dot.setAttribute("r", String(prev.r));
                }
                // Select new
                solidDot.setAttribute("r", String(r * 1.8));
                prevSelectedRef.current = node.name;
                setSelectedPanel(NODE_DATA[node.name] ?? makeFallbackPanel(node, layer));
              }
            });

            el.appendChild(hit);
          }
        }
      })
      .catch(console.error);

    return () => { svg.selectAll("*").remove(); };
  }, [chainState, rawSelection]);

  if (fillContainer) {
    return (
      <div style={{ position: "absolute", inset: 0 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid slice"
          data-map-container
          style={{ width: "100%", height: "100%", background: "#3A3835", display: "block" }}
        />

        {/* Sub-layers legend */}
        {chainState === 1 && (
          <div style={{
            position: "absolute", top: "50%", left: 60,
            transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 8,
            pointerEvents: "none", zIndex: 5,
          }}>
            <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6.5, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Sub-layers</div>
            {([
              { label: "Deposits",             color: "#B8975A" },
              { label: "Miners",               color: "#7DA06A" },
              { label: "Refiners & Recyclers", color: "#A07DAA" },
            ] as { label: string; color: string }[]).map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 7, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em", color: item.color, whiteSpace: "nowrap" }}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hover tooltip */}
        {tooltip && (
          <div style={{
            position: "absolute",
            left: tooltip.x, top: tooltip.y - 10,
            transform: "translate(-50%, -100%)",
            background: "rgba(15,14,12,0.88)",
            borderRadius: 4, padding: "6px 10px",
            pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
          }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.92)", marginBottom: 2 }}>{tooltip.name}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{tooltip.loc}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6.5, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tooltip.type}</div>
          </div>
        )}

        {/* Node detail panel */}
        {selectedPanel && (
          <NodeDetailPanel data={selectedPanel} onClose={deselectNode} />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", marginTop: 16 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        data-map-container
        style={{ width: "100%", height: MAP_H, background: "rgb(99,99,95)", borderRadius: 6, display: "block" }}
      />
      {tooltip && (
        <div style={{
          position: "absolute", bottom: 12, right: 12,
          background: "rgba(0,0,0,0.85)", borderRadius: 4, padding: "8px 12px",
          pointerEvents: "none", zIndex: 10,
        }}>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 11, fontWeight: 600, color: "white", marginBottom: 2 }}>{tooltip.name}</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>{tooltip.loc}</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tooltip.type}</div>
        </div>
      )}
    </div>
  );
}
