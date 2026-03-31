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
  fillContainer?: boolean;
}

// ── Core types ───────────────────────────────────────────────────────────────
type Pt   = { lon: number; lat: number; name: string; loc: string };
type Conn = [number, number];
type Flow = { from: number; to: number; connections: Conn[] };
type LayerKey = "raw-material" | "component" | "subsystem" | "end-use";

// ── Node panel data ──────────────────────────────────────────────────────────
interface PanelStat { value: string; label: string; }
interface NodePanelData {
  name: string;
  type: string;
  location: string;
  country: string;
  layer: LayerKey;
  stats: PanelStat[];
  description: string;
  confidence: "high" | "medium";
  ticker?: string;
  isBottleneck: boolean;
}

// ── Level config ─────────────────────────────────────────────────────────────
interface SubLayerDef { label: string; color: string; radius: number; nodes: Pt[]; }
interface LevelConfig {
  chainLevel: 1 | 2 | 3 | 4;
  layerKey: LayerKey;
  subLayers: SubLayerDef[];
  flows: Flow[];
  legendItems: { label: string; color: string }[];
}

// ── All layer / flow data ────────────────────────────────────────────────────
const LEVEL_CONFIGS: LevelConfig[] = [
  {
    chainLevel: 1, layerKey: "raw-material",
    subLayers: [
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
        { lon:99.8,  lat:24.2,  name: "Yunnan Refinery",  loc: "Yunnan, China" },
        { lon:113.5, lat:38.0,  name: "Hebei Refinery",   loc: "Hebei, China" },
        { lon:103.0, lat:25.8,  name: "Chihong Refinery", loc: "Yunnan, China" },
        { lon:132.8, lat:47.8,  name: "Jilin Refinery",   loc: "Jilin, China" },
        { lon:5.5,   lat:51.2,  name: "Umicore",          loc: "Olen, Belgium" },
        { lon:-73.6, lat:45.5,  name: "5N Plus",          loc: "Montreal, Canada" },
        { lon:-83.0, lat:42.3,  name: "Indium Corp.",     loc: "Detroit, USA" },
      ]},
    ],
    flows: [
      { from: 0, to: 1, connections: [[0,0],[1,1],[2,2],[3,3],[4,3],[5,4],[6,5],[7,6]] },
      { from: 1, to: 2, connections: [[0,0],[1,1],[2,1],[3,2],[4,3],[5,4],[6,5]] },
    ],
    legendItems: [
      { label: "Deposits",             color: "#B8975A" },
      { label: "Miners",               color: "#7DA06A" },
      { label: "Refiners & Recyclers", color: "#A07DAA" },
    ],
  },
  {
    chainLevel: 2, layerKey: "component",
    subLayers: [
      { label: "GeCl₄ Suppliers", color: "#6A8BBF", radius: 3, nodes: [
        { lon:5.5,   lat:51.2, name: "Umicore GeCl₄",    loc: "Olen, Belgium" },
        { lon:103.0, lat:25.8, name: "Chihong Supplier",  loc: "Yunnan, China" },
        { lon:113.5, lat:38.0, name: "Hebei Supplier",    loc: "Hebei, China" },
        { lon:132.8, lat:47.8, name: "Jilin Supplier",    loc: "Jilin, China" },
      ]},
      { label: "Fiber Manufacturers", color: "#6A8BBF", radius: 2.5, nodes: [
        { lon:-77.0,  lat:42.4,  name: "Corning Preform", loc: "Wilmington, NC, USA" },
        { lon:11.25,  lat:43.77, name: "Prysmian",        loc: "Florence, Italy" },
        { lon:139.7,  lat:35.7,  name: "Fujikura",        loc: "Tokyo, Japan" },
        { lon:136.9,  lat:35.2,  name: "Sumitomo",        loc: "Osaka, Japan" },
        { lon:136.0,  lat:35.0,  name: "OFS Furukawa",    loc: "Aichi, Japan" },
        { lon:117.0,  lat:30.5,  name: "YOFC",            loc: "Wuhan, China" },
      ]},
    ],
    flows: [
      { from: 0, to: 1, connections: [[0,0],[0,1],[0,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3]] },
    ],
    legendItems: [
      { label: "GeCl₄ Suppliers",    color: "#6A8BBF" },
      { label: "Fiber Manufacturers", color: "#6A8BBF" },
    ],
  },
  {
    chainLevel: 3, layerKey: "subsystem",
    subLayers: [
      { label: "Cable Assemblers", color: "#5A9E8F", radius: 3, nodes: [
        { lon:-77.0,  lat:42.4,  name: "Corning Fiber",  loc: "Concord, NC, USA" },
        { lon:11.25,  lat:43.77, name: "Prysmian Cable", loc: "Milan, Italy" },
        { lon:136.9,  lat:35.2,  name: "Sumitomo",       loc: "Osaka, Japan" },
        { lon:-80.8,  lat:35.2,  name: "CommScope",      loc: "North Carolina, USA" },
        { lon:-81.0,  lat:34.0,  name: "OFS",            loc: "South Carolina, USA" },
        { lon:2.35,   lat:48.86, name: "Nexans",         loc: "Paris, France" },
        { lon:-73.0,  lat:41.0,  name: "AFL Telecom",    loc: "Connecticut, USA" },
        { lon:139.7,  lat:35.7,  name: "Fujikura",       loc: "Tokyo, Japan" },
      ]},
      { label: "Cable Types", color: "#5A9E8F", radius: 2.5, nodes: [
        { lon:-95.0, lat:38.0, name: "Terrestrial Routes NA", loc: "North America" },
        { lon:10.0,  lat:50.0, name: "Terrestrial Routes EU", loc: "Europe" },
        { lon:-30.0, lat:30.0, name: "Subsea Routes",         loc: "Atlantic" },
      ]},
    ],
    flows: [
      { from: 0, to: 1, connections: [[0,0],[0,1],[1,0],[1,1],[2,0],[2,1],[3,0],[3,1],[4,0],[4,1],[5,2],[6,2],[7,2]] },
    ],
    legendItems: [
      { label: "Cable Assemblers", color: "#5A9E8F" },
      { label: "Cable Routes",     color: "#5A9E8F" },
    ],
  },
  {
    chainLevel: 4, layerKey: "end-use",
    subLayers: [
      { label: "Installers", color: "#C8C4BC", radius: 2.5, nodes: [
        { lon:-80.2,  lat:26.1, name: "MasTec",      loc: "Florida, USA" },
        { lon:-84.4,  lat:33.7, name: "Dycom",       loc: "Georgia, USA" },
        { lon:-111.9, lat:40.7, name: "Anixter",     loc: "Utah, USA" },
        { lon:-80.0,  lat:40.4, name: "FS Networks", loc: "Pennsylvania, USA" },
        { lon:-95.0,  lat:37.0, name: "Black Box",   loc: "Kansas, USA" },
      ]},
      { label: "Developers", color: "#C8C4BC", radius: 2.5, nodes: [
        { lon:-73.9,  lat:40.7,  name: "Equinix",        loc: "New York, USA" },
        { lon:-93.3,  lat:45.0,  name: "CyrusOne",       loc: "Minnesota, USA" },
        { lon:-122.4, lat:37.8,  name: "Digital Realty", loc: "San Francisco, USA" },
        { lon:-84.5,  lat:34.0,  name: "QTS",            loc: "Georgia, USA" },
        { lon:-95.0,  lat:38.0,  name: "Iron Mountain",  loc: "Kansas, USA" },
      ]},
      { label: "Owners", color: "#C8C4BC", radius: 3, nodes: [
        { lon:-77.5,  lat:38.9,  name: "AWS us-east-1",       loc: "Ashburn, VA, USA" },
        { lon:-122.3, lat:47.6,  name: "Microsoft",            loc: "Seattle, USA" },
        { lon:-122.0, lat:37.4,  name: "Google",              loc: "Mountain View, USA" },
        { lon:-122.2, lat:37.5,  name: "Meta",                loc: "Menlo Park, USA" },
        { lon:4.9,    lat:52.37, name: "Azure West Europe",   loc: "Amsterdam, Netherlands" },
        { lon:-74.0,  lat:40.7,  name: "Verizon",             loc: "New York, USA" },
        { lon:54.4,   lat:24.5,  name: "STC",                 loc: "Abu Dhabi, UAE" },
      ]},
    ],
    flows: [
      {
        from: 0, to: 1,
        connections: Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => [i, j] as Conn)).flat(),
      },
      {
        from: 1, to: 2,
        connections: Array.from({ length: 5 }, (_, i) => Array.from({ length: 7 }, (_, j) => [i, j] as Conn)).flat(),
      },
    ],
    legendItems: [
      { label: "Installers",  color: "#C8C4BC" },
      { label: "Developers",  color: "#C8C4BC" },
      { label: "Datacenters", color: "#C8C4BC" },
    ],
  },
];

const CHAIN_TO_INDEX: Record<1|2|3|4, number> = { 1: 0, 2: 1, 3: 2, 4: 3 };
const LAYER_DISPLAY: Record<LayerKey, string> = {
  "raw-material": "Raw Material",
  "component": "Component",
  "subsystem": "Subsystem",
  "end-use": "End Use",
};

const TYPE_COLOR: Record<string, string> = {
  "Deposits": "#B8975A", "Deposit": "#B8975A",
  "Miners": "#7DA06A",   "Miner": "#7DA06A",
  "Refiners": "#A07DAA", "Refiner": "#A07DAA",
  "GeCl₄ Suppliers": "#6A8BBF", "GeCl₄ Supplier": "#6A8BBF",
  "Fiber Manufacturers": "#6A8BBF", "Fiber Mfg": "#6A8BBF",
  "Cable Assemblers": "#5A9E8F",
  "Cable Types": "#5A9E8F",
  "Installers": "#C8C4BC",
  "Developers": "#C8C4BC",
  "Owners": "#C8C4BC",
  "converter": "#6A8BBF",
  "manufacturer": "#6A8BBF",
  "assembler": "#5A9E8F",
  "datacenter": "#C8C4BC",
};

// ── NODE_DATA ────────────────────────────────────────────────────────────────
const NODE_DATA: Record<string, NodePanelData> = {
  // Raw material — Deposits
  "Yunnan Deposit": { name: "Yunnan Deposit", type: "Deposit", location: "Yunnan, China", country: "China", layer: "raw-material", stats: [{ value: ">1,000t", label: "Ge resources" }, { value: "Lignite coal", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Lincang coal basin — one of China's largest germanium-bearing lignite deposits. Operated by Lincang Xinyuan Germanium. Subject to MOFCOM export licensing since August 2023.", confidence: "high", isBottleneck: false },
  "Inner Mongolia Deposit": { name: "Inner Mongolia Deposit", type: "Deposit", location: "Inner Mongolia, China", country: "China", layer: "raw-material", stats: [{ value: "~1,600t", label: "Ge resources" }, { value: "Lignite coal", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Wulantuga coal deposit in Inner Mongolia. Among the highest-grade germanium-bearing coal deposits globally. Production subject to Chinese export control regime.", confidence: "high", isBottleneck: false },
  "Heilongjiang Deposit": { name: "Heilongjiang Deposit", type: "Deposit", location: "Heilongjiang, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Coal/Zinc", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Secondary coal-hosted germanium deposit in northeastern China. Contributes to China's dominant share of global germanium mining output.", confidence: "medium", isBottleneck: false },
  "Guizhou Deposit": { name: "Guizhou Deposit", type: "Deposit", location: "Guizhou, China", country: "China", layer: "raw-material", stats: [{ value: "~4,000t", label: "Ge resources" }, { value: "Zinc ore", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Zinc-hosted germanium deposit. Part of a broader southwest China cluster that accounts for the majority of China's total germanium resources.", confidence: "medium", isBottleneck: false },
  "Sichuan Deposit": { name: "Sichuan Deposit", type: "Deposit", location: "Sichuan, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Zinc ore", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Zinc ore deposit in Sichuan Province with recoverable germanium trace concentrations. Secondary contributor to China's germanium production base.", confidence: "medium", isBottleneck: false },
  "Jilin Deposit": { name: "Jilin Deposit", type: "Deposit", location: "Jilin, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge resources" }, { value: "Coal/Zinc", label: "Host type" }, { value: "Export ctrl", label: "Status" }], description: "Northeast China deposit contributing to domestic germanium supply. Processed through local smelting and refining operations.", confidence: "medium", isBottleneck: false },
  "Kipushi Deposit": { name: "Kipushi Deposit", type: "Deposit", location: "Lubumbashi, DRC", country: "DRC", layer: "raw-material", stats: [{ value: "700t+", label: "Ge potential" }, { value: "Tailings", label: "Source type" }, { value: "Ramping", label: "Status" }], description: "Big Hill tailings site in Lubumbashi. Most important new western primary source in decades. Umicore-STL partnership backed by the 14-nation Minerals Security Partnership.", confidence: "medium", isBottleneck: false },
  "Red Dog Deposit": { name: "Red Dog Deposit", type: "Deposit", location: "Alaska, USA", country: "USA", layer: "raw-material", stats: [{ value: "Not published", label: "Ge reserves" }, { value: "Zinc ore", label: "Host type" }, { value: "Declining", label: "Output trend" }], description: "Sole US germanium-bearing deposit. World-class zinc mine in northwest Alaska operated by Teck Resources. Output declining with no published reserve extension.", confidence: "medium", isBottleneck: false },
  // Raw material — Miners
  "Yunnan Chihong": { name: "Yunnan Chihong", type: "Miner", location: "Qujing, China", country: "China", layer: "raw-material", stats: [{ value: "65.9t", label: "2023 Ge output" }, { value: "~30%", label: "Global share" }, { value: "60t/yr", label: "Ge capacity" }], description: "World's largest germanium producer — 30% of global supply from a single entity. Safety project at Huize mine (late 2024) reduced Q1 2025 zinc output 17,400t, directly cutting Ge supply.", confidence: "high", isBottleneck: true },
  "Inner Mongolia Miner": { name: "Inner Mongolia Miner", type: "Miner", location: "Inner Mongolia, China", country: "China", layer: "raw-material", stats: [{ value: "State-owned", label: "Ownership" }, { value: "Coal", label: "Primary output" }, { value: "Export ctrl", label: "Status" }], description: "State-linked coal operations in Inner Mongolia extracting germanium as a byproduct from Wulantuga basin lignite. Output subject to MOFCOM export licensing regime.", confidence: "medium", isBottleneck: false },
  "Hebei Miner": { name: "Hebei Miner", type: "Miner", location: "Hebei, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }], description: "Zinc mining operations in Hebei Province recovering germanium from smelter residues. Part of China's integrated zinc-germanium production base.", confidence: "medium", isBottleneck: false },
  "Guizhou Miner": { name: "Guizhou Miner", type: "Miner", location: "Guizhou, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }], description: "Zinc ore extraction in Guizhou. Germanium recovered as byproduct during smelting. Production and volumes not disclosed publicly.", confidence: "medium", isBottleneck: false },
  "Jilin Miner": { name: "Jilin Miner", type: "Miner", location: "Jilin, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge output" }, { value: "Coal/Zinc", label: "Primary output" }, { value: "Export ctrl", label: "Status" }], description: "Mining operations in Jilin Province contributing to Chinese domestic germanium supply. Secondary producer within China's concentrated germanium supply base.", confidence: "medium", isBottleneck: false },
  "Glencore Kipushi": { name: "Glencore Kipushi", type: "Miner", location: "Lubumbashi, DRC", country: "DRC", layer: "raw-material", stats: [{ value: "<5t/yr", label: "Current Ge output" }, { value: "700t+", label: "Site potential" }, { value: "Ramping", label: "Status" }], description: "Operating the Kipushi zinc mine in DRC in partnership with STL/Gécamines. First germanium concentrate shipped to Umicore in October 2024. Scaling to meaningful volumes will take 3–5 years.", confidence: "medium", isBottleneck: false },
  "Teck Resources": { name: "Teck Resources", type: "Miner", location: "British Columbia, Canada", country: "Canada", layer: "raw-material", stats: [{ value: "C$30B+", label: "Market cap" }, { value: "Undisclosed", label: "Ge volumes" }, { value: "Declining", label: "Red Dog status" }], description: "Controls Red Dog in Alaska — sole US germanium source. Germanium is financially immaterial to Teck. In discussions with US and Canadian governments about expanding recovery.", confidence: "medium", ticker: "TECK.B", isBottleneck: false },
  // Raw material — Refiners
  "Yunnan Refinery": { name: "Yunnan Refinery", type: "Refiner", location: "Yunnan, China", country: "China", layer: "raw-material", stats: [{ value: "State-linked", label: "Ownership" }, { value: "GeO₂/GeCl₄", label: "Products" }, { value: "Export ctrl", label: "Status" }], description: "Primary germanium refining operation in Yunnan Province processing output from local zinc and coal operations into GeO₂ and GeCl₄.", confidence: "high", isBottleneck: false },
  "Hebei Refinery": { name: "Hebei Refinery", type: "Refiner", location: "Hebei, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge throughput" }, { value: "GeO₂", label: "Primary product" }, { value: "Export ctrl", label: "Status" }], description: "Zinc smelter complex in Hebei with germanium recovery capability. Processes zinc concentrates from local and regional mines.", confidence: "medium", isBottleneck: false },
  "Chihong Refinery": { name: "Chihong Refinery", type: "Refiner", location: "Yunnan, China", country: "China", layer: "raw-material", stats: [{ value: "60t/yr", label: "Ge capacity" }, { value: "GeCl₄/GeO₂", label: "Products" }, { value: "Export ctrl", label: "Status" }], description: "Yunnan Chihong's dedicated germanium refinery. Produces germanium metal, GeO₂, GeCl₄ for fiber optics, and germanium substrates for solar cells.", confidence: "high", isBottleneck: true },
  "Jilin Refinery": { name: "Jilin Refinery", type: "Refiner", location: "Jilin, China", country: "China", layer: "raw-material", stats: [{ value: "Undisclosed", label: "Ge throughput" }, { value: "GeO₂", label: "Primary product" }, { value: "Export ctrl", label: "Status" }], description: "Germanium refining operations in Jilin Province. Secondary producer within China's concentrated refining base.", confidence: "medium", isBottleneck: false },
  "Umicore": { name: "Umicore", type: "Refiner", location: "Olen, Belgium", country: "Belgium", layer: "raw-material", stats: [{ value: "40–50t/yr", label: "Ge refined" }, { value: "€3.9B", label: "Market cap" }, { value: ">50%", label: "From recycling" }], description: "Sole western germanium refiner at scale. Olen facility supplies the majority of western fiber manufacturers with GeCl₄. Critical DRC feedstock partner. Appears across 3 of 5 supply chain bottlenecks.", confidence: "high", ticker: "UMI", isBottleneck: true },
  "5N Plus": { name: "5N Plus", type: "Refiner", location: "Montreal, Canada", country: "Canada", layer: "raw-material", stats: [{ value: "$391M", label: "FY25 revenue" }, { value: "+245%", label: "Earnings YoY" }, { value: "$32.5M", label: "DoD funding" }], description: "Most direct public equity exposure to the germanium thesis. Dual DoD grants under the Defense Production Act for germanium capacity expansion at St. George, Utah.", confidence: "high", ticker: "VNP", isBottleneck: false },
  "Indium Corp.": { name: "Indium Corp.", type: "Refiner", location: "Detroit, USA", country: "USA", layer: "raw-material", stats: [{ value: "Small vol.", label: "Ge throughput" }, { value: "Specialty", label: "Market focus" }, { value: "Private", label: "Ownership" }], description: "US specialty metals refiner with germanium processing capabilities. Primarily serves defense and electronics markets.", confidence: "medium", isBottleneck: false },
  // Component — GeCl₄ Suppliers
  "Umicore GeCl₄": { name: "Umicore GeCl₄", type: "converter", location: "Olen, Belgium", country: "Belgium", layer: "component", stats: [{ value: "40–50t/yr", label: "GeCl₄ output" }, { value: "Fiber grade", label: "Purity" }, { value: "Bottleneck", label: "Supply role" }], description: "Produces ultra-high-purity GeCl₄ for western optical fiber manufacturers. The only non-Chinese GeCl₄ source at meaningful scale. Feedstock increasingly from DRC and recycled sources.", confidence: "high", ticker: "UMI", isBottleneck: true },
  "Chihong Supplier": { name: "Chihong Supplier", type: "converter", location: "Yunnan, China", country: "China", layer: "component", stats: [{ value: "60t/yr", label: "GeCl₄ capacity" }, { value: "Fiber grade", label: "Purity" }, { value: "Export ctrl", label: "Status" }], description: "Yunnan Chihong's GeCl₄ production unit. Export requires MOFCOM licensing. Subject to December 2024 US export ban (suspended November 2025 until November 2026).", confidence: "high", isBottleneck: true },
  "Hebei Supplier": { name: "Hebei Supplier", type: "converter", location: "Hebei, China", country: "China", layer: "component", stats: [{ value: "Undisclosed", label: "GeCl₄ capacity" }, { value: "GeCl₄/GeO₂", label: "Products" }, { value: "Export ctrl", label: "Status" }], description: "Secondary Chinese GeCl₄ supplier in Hebei Province. Processes germanium from regional zinc smelting operations. All exports require MOFCOM licensing.", confidence: "medium", isBottleneck: false },
  "Jilin Supplier": { name: "Jilin Supplier", type: "converter", location: "Jilin, China", country: "China", layer: "component", stats: [{ value: "Undisclosed", label: "GeCl₄ capacity" }, { value: "GeCl₄", label: "Primary product" }, { value: "Export ctrl", label: "Status" }], description: "GeCl₄ production from Jilin Province germanium operations. Secondary supplier within China's concentrated GeCl₄ production base.", confidence: "medium", isBottleneck: false },
  // Component — Fiber Manufacturers
  "Corning Preform": { name: "Corning Preform", type: "manufacturer", location: "Wilmington, NC, USA", country: "USA", layer: "component", stats: [{ value: "$15B+", label: "Market cap" }, { value: "+58%", label: "Enterprise YoY" }, { value: "Sold out", label: "2026 inventory" }], description: "Largest optical fiber manufacturer globally. Enterprise segment grew 58% YoY in Q3 2025 driven by AI datacenter demand. Reported inventory sold through 2026.", confidence: "high", ticker: "GLW", isBottleneck: true },
  "Prysmian": { name: "Prysmian", type: "manufacturer", location: "Florence, Italy", country: "Italy", layer: "component", stats: [{ value: "€19B+", label: "Market cap" }, { value: "#1", label: "Cable mfg" }, { value: "OPGW", label: "Specialty cables" }], description: "World's largest cable manufacturer by revenue. Produces optical fiber and cable for telecom, energy, and industrial applications. Major consumer of GeO₂.", confidence: "high", ticker: "PRY", isBottleneck: false },
  "Fujikura": { name: "Fujikura", type: "manufacturer", location: "Tokyo, Japan", country: "Japan", layer: "component", stats: [{ value: "¥800B+", label: "Revenue" }, { value: "Fiber/Splicing", label: "Core products" }, { value: "Defense", label: "Key segment" }], description: "Japanese optical fiber and cable manufacturer. Produces standard and specialty fiber types consuming GeO₂. Also manufactures fusion splicers and connectivity products.", confidence: "high", isBottleneck: false },
  "Sumitomo": { name: "Sumitomo Electric", type: "manufacturer", location: "Osaka, Japan", country: "Japan", layer: "component", stats: [{ value: "¥3.8T", label: "Revenue" }, { value: "Optical fiber", label: "Key product" }, { value: "1970s", label: "Fiber pioneer" }], description: "Pioneer of optical fiber development. Manufactures optical fiber, preforms, and cable systems. One of the earliest adopters of GeCl₄ for fiber core doping.", confidence: "high", isBottleneck: false },
  "OFS Furukawa": { name: "OFS Furukawa", type: "manufacturer", location: "Aichi, Japan", country: "Japan", layer: "component", stats: [{ value: "Subsidiary", label: "Structure" }, { value: "Specialty fiber", label: "Focus" }, { value: "US/Japan", label: "Key markets" }], description: "Optical fiber and cable manufacturer. Produces standard SMF and specialty fibers for telecom and datacom applications.", confidence: "medium", isBottleneck: false },
  "YOFC": { name: "YOFC", type: "manufacturer", location: "Wuhan, China", country: "China", layer: "component", stats: [{ value: "Largest", label: "China fiber mfg" }, { value: "HKEx listed", label: "Exchange" }, { value: "JV origin", label: "With Corning" }], description: "Yangtze Optical Fibre and Cable. China's largest optical fiber manufacturer. Primarily serves domestic Chinese market.", confidence: "high", isBottleneck: false },
  // Subsystem nodes
  "Corning Fiber": { name: "Corning Fiber", type: "assembler", location: "Concord, NC, USA", country: "USA", layer: "subsystem", stats: [{ value: "SMF-28", label: "Key product" }, { value: "AI-grade", label: "Spec" }, { value: "Sold out", label: "2026 status" }], description: "Corning's cable assembly operations. Produces packaged fiber cable for datacenter, enterprise, and telco applications. Demand surge driven by AI infrastructure build-out.", confidence: "high", ticker: "GLW", isBottleneck: false },
  "Prysmian Cable": { name: "Prysmian Cable", type: "assembler", location: "Milan, Italy", country: "Italy", layer: "subsystem", stats: [{ value: "€19B+", label: "Market cap" }, { value: "Subsea+Land", label: "Coverage" }, { value: "Global", label: "Reach" }], description: "Global cable assembly operations serving telecom, subsea, and energy sectors. Produces both terrestrial and submarine optical cable systems.", confidence: "high", ticker: "PRY", isBottleneck: false },
  "CommScope": { name: "CommScope", type: "assembler", location: "North Carolina, USA", country: "USA", layer: "subsystem", stats: [{ value: "$7B+", label: "Revenue" }, { value: "Enterprise", label: "Primary market" }, { value: "NASDAQ: COMM", label: "Listed" }], description: "Produces structured cabling solutions and fiber connectivity for enterprise and carrier networks. Major downstream consumer of fiber cable.", confidence: "medium", ticker: "COMM", isBottleneck: false },
  "Nexans": { name: "Nexans", type: "assembler", location: "Paris, France", country: "France", layer: "subsystem", stats: [{ value: "€6B+", label: "Revenue" }, { value: "Paris-listed", label: "Exchange" }, { value: "Electrification", label: "Strategy" }], description: "French cable manufacturer operating globally. Produces optical fiber cable for telecom and energy transmission. Transitioning focus toward electrification.", confidence: "medium", ticker: "NEX", isBottleneck: false },
  "AFL Telecom": { name: "AFL Telecom", type: "assembler", location: "Connecticut, USA", country: "USA", layer: "subsystem", stats: [{ value: "Private", label: "Ownership" }, { value: "BEAD", label: "Key program" }, { value: "US-focused", label: "Market" }], description: "US fiber cable and accessories manufacturer. Well-positioned for BEAD broadband buildout demand. Manufactures ruggedized fiber cables for outside plant applications.", confidence: "medium", isBottleneck: false },
  "OFS": { name: "OFS", type: "assembler", location: "South Carolina, USA", country: "USA", layer: "subsystem", stats: [{ value: "Furukawa sub.", label: "Ownership" }, { value: "Specialty", label: "Focus" }, { value: "US-based", label: "Operations" }], description: "US-based cable assembly operations of Furukawa Electric. Produces specialty and standard optical fiber cables for US telecom and enterprise markets.", confidence: "medium", isBottleneck: false },
  "Terrestrial Routes NA": { name: "Terrestrial Routes NA", type: "assembler", location: "North America", country: "USA", layer: "subsystem", stats: [{ value: "213M mi", label: "BEAD target" }, { value: "$42.5B", label: "Federal funding" }, { value: "2026+", label: "Build window" }], description: "North American terrestrial fiber network expansion driven by BEAD broadband funding. 32 of 56 state plans approved as of late 2025. Construction ramp creates sustained Ge demand.", confidence: "high", isBottleneck: false },
  "Terrestrial Routes EU": { name: "Terrestrial Routes EU", type: "assembler", location: "Europe", country: "EU", layer: "subsystem", stats: [{ value: "€7.5B", label: "EU Gigabit fund" }, { value: "FTTH", label: "Primary tech" }, { value: "2030 target", label: "1 Gbps by" }], description: "European terrestrial fiber expansion programs driven by the EU Connectivity Strategy. FTTH rollout across member states generating ongoing demand for optical fiber.", confidence: "high", isBottleneck: false },
  "Subsea Routes": { name: "Subsea Routes", type: "assembler", location: "Atlantic", country: "International", layer: "subsystem", stats: [{ value: "400+ cables", label: "Active globally" }, { value: "50–80kg", label: "Ge per cable" }, { value: "$2B+/yr", label: "New deployments" }], description: "Submarine cable systems require germanium-doped fiber for signal transmission. A single transatlantic cable contains 50–80 kg of germanium. Hyperscaler-funded deployment accelerating.", confidence: "high", isBottleneck: false },
  // End use nodes
  "AWS us-east-1": { name: "AWS us-east-1", type: "datacenter", location: "Ashburn, VA, USA", country: "USA", layer: "end-use", stats: [{ value: "$105B+", label: "AWS 2025 capex" }, { value: "#1", label: "Cloud region" }, { value: "AI-grade", label: "Fiber spec" }], description: "Amazon's primary US cloud region. Among the world's largest concentrations of fiber-connected infrastructure. AI GPU clusters require 10–36x more fiber than traditional compute.", confidence: "high", isBottleneck: false },
  "Microsoft": { name: "Microsoft", type: "datacenter", location: "Seattle, USA", country: "USA", layer: "end-use", stats: [{ value: "$120B+", label: "2026 capex" }, { value: "Azure", label: "Cloud brand" }, { value: "+Lumenisity", label: "Hollow-core R&D" }], description: "Microsoft is the largest single investor in AI infrastructure in 2025–2026. Also owns Lumenisity (hollow-core fiber), the most credible near-term substitution for germanium in fiber.", confidence: "high", ticker: "MSFT", isBottleneck: false },
  "Google": { name: "Google", type: "datacenter", location: "Mountain View, USA", country: "USA", layer: "end-use", stats: [{ value: "$175–185B", label: "2026 capex" }, { value: "TPU v5e", label: "AI hardware" }, { value: "Subsea owner", label: "Cable strategy" }], description: "Alphabet/Google deploying $175–185B in infrastructure in 2026. Owns and operates proprietary subsea cables. TPU v5e clusters require dense fiber interconnect.", confidence: "high", ticker: "GOOGL", isBottleneck: false },
  "Meta": { name: "Meta", type: "datacenter", location: "Menlo Park, USA", country: "USA", layer: "end-use", stats: [{ value: "$115–135B", label: "2026 capex" }, { value: "Llama", label: "AI platform" }, { value: "Open-source", label: "Model strategy" }], description: "Meta deploying $115–135B in 2026 on AI infrastructure to train and serve Llama models. Building dedicated AI training clusters requiring high-density fiber interconnect.", confidence: "high", ticker: "META", isBottleneck: false },
  "Azure West Europe": { name: "Azure West Europe", type: "datacenter", location: "Amsterdam, Netherlands", country: "Netherlands", layer: "end-use", stats: [{ value: "Top 3", label: "EU cloud region" }, { value: "GDPR", label: "Compliance" }, { value: "Hybrid", label: "Deployment model" }], description: "Microsoft's primary European cloud region in Amsterdam. Serves EU enterprise customers and is scaling AI infrastructure under EU data residency requirements.", confidence: "high", ticker: "MSFT", isBottleneck: false },
  "Verizon": { name: "Verizon", type: "datacenter", location: "New York, USA", country: "USA", layer: "end-use", stats: [{ value: "$17B+", label: "Capex 2025" }, { value: "FTTH", label: "Fios expansion" }, { value: "BEAD", label: "Program participant" }], description: "US telecom operator expanding fiber-to-the-home through Fios network. Participating in BEAD broadband buildout. Major consumer of optical fiber cable.", confidence: "high", ticker: "VZ", isBottleneck: false },
  "STC": { name: "STC", type: "datacenter", location: "Abu Dhabi, UAE", country: "UAE", layer: "end-use", stats: [{ value: "Regional hub", label: "Role" }, { value: "AI infra", label: "Investment theme" }, { value: "MEA", label: "Coverage" }], description: "Stc Group operating across Middle East and Africa. Building AI datacenter capacity to serve regional enterprise and government demand. Subsea cable network owner.", confidence: "medium", isBottleneck: false },
};

function makeFallbackPanel(node: Pt, subLayer: SubLayerDef, layerKey: LayerKey): NodePanelData {
  return {
    name: node.name, type: subLayer.label, location: node.loc, country: "", layer: layerKey,
    stats: [{ value: "—", label: "Data pending" }, { value: subLayer.label, label: "Sub-layer" }, { value: "—", label: "Status" }],
    description: `${node.name} operates within the ${LAYER_DISPLAY[layerKey]} layer of the supply chain.`,
    confidence: "medium", isBottleneck: false,
  };
}

// ── Node detail panel ─────────────────────────────────────────────────────────
function NodeDetailPanel({ data, onClose }: { data: NodePanelData; onClose: () => void }) {
  const MONO: React.CSSProperties = { fontFamily: "'Geist Mono', 'Courier New', monospace" };
  const INTER: React.CSSProperties = { fontFamily: "Inter, -apple-system, sans-serif" };
  const typeColor = TYPE_COLOR[data.type] ?? "rgba(255,255,255,0.3)";

  const layerColors: Record<LayerKey, string> = {
    "raw-material": "rgba(184,151,90,0.5)",
    "component":    "rgba(106,139,191,0.5)",
    "subsystem":    "rgba(90,158,143,0.5)",
    "end-use":      "rgba(200,196,188,0.4)",
  };
  const layerBgs: Record<LayerKey, string> = {
    "raw-material": "rgba(184,151,90,0.08)",
    "component":    "rgba(106,139,191,0.08)",
    "subsystem":    "rgba(90,158,143,0.08)",
    "end-use":      "rgba(200,196,188,0.06)",
  };

  return (
    <div style={{ position: "absolute", bottom: 16, right: 16, width: 260, background: "rgba(20,20,18,0.92)", borderRadius: 6, border: "0.5px solid rgba(255,255,255,0.07)", zIndex: 15, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "10px 12px 8px", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" as const }}>
          <span style={{ ...MONO, fontSize: 6, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: typeColor }}>{data.type}</span>
          <span style={{ ...MONO, fontSize: 5.5, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: layerColors[data.layer], background: layerBgs[data.layer], padding: "1.5px 5px", borderRadius: 2 }}>{LAYER_DISPLAY[data.layer]}</span>
          {data.isBottleneck && <span style={{ ...MONO, fontSize: 5.5, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(163,45,45,0.7)", background: "rgba(163,45,45,0.1)", padding: "1.5px 5px", borderRadius: 2 }}>Bottleneck</span>}
          {data.ticker && <span style={{ ...MONO, fontSize: 6.5, color: "rgba(100,160,220,0.5)", background: "rgba(100,160,220,0.06)", padding: "1.5px 5px", borderRadius: 2 }}>{data.ticker}</span>}
          <button onClick={onClose} style={{ marginLeft: "auto", ...MONO, fontSize: 10, color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ ...INTER, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, marginBottom: 3 }}>{data.name}</div>
        <div style={{ ...MONO, fontSize: 7, color: "rgba(255,255,255,0.25)" }}>{data.location}</div>
      </div>
      {/* Stats */}
      <div style={{ display: "flex", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        {data.stats.slice(0, 3).map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "7px 10px", borderRight: i < 2 ? "0.5px solid rgba(255,255,255,0.03)" : "none" }}>
            <div style={{ ...MONO, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.2, marginBottom: 2 }}>{s.value}</div>
            <div style={{ ...MONO, fontSize: 5.5, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "rgba(255,255,255,0.18)" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Description */}
      <div style={{ padding: "8px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
        <div style={{ ...INTER, fontSize: 9.5, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{data.description}</div>
      </div>
      {/* Footer */}
      <div style={{ padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...MONO, fontSize: 7, color: "rgba(200,180,140,0.5)" }}>View full profile →</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: data.confidence === "high" ? "#7DA06A" : "#B8975A", flexShrink: 0 }} />
          <span style={{ ...MONO, fontSize: 5.5, color: "rgba(255,255,255,0.12)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{data.confidence === "high" ? "High" : "Medium"}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const MAP_W = 700;
const MAP_H = 380;

type TooltipInfo = { name: string; loc: string; type: string; color: string; x: number; y: number } | null;

export default function SupplyChainMap({ chainState, rawSelection, fillContainer }: SupplyChainMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo>(null);
  const [selectedPanel, setSelectedPanel] = useState<NodePanelData | null>(null);
  const dotMapRef = useRef<Map<string, { dot: SVGCircleElement; r: number }>>(new Map());
  const prevSelectedRef = useRef<string | null>(null);

  function deselectNode() {
    if (prevSelectedRef.current) {
      const prev = dotMapRef.current.get(prevSelectedRef.current);
      if (prev) prev.dot.setAttribute("r", String(prev.r));
      prevSelectedRef.current = null;
    }
    setSelectedPanel(null);
  }

  useEffect(() => {
    if (!svgRef.current) return;

    // Determine which levels to show
    const activeIdx = CHAIN_TO_INDEX[chainState];
    // For level 1 (raw-material), gate on rawSelection
    const showRaw = rawSelection === "Germanium";
    const levelsToShow = LEVEL_CONFIGS.slice(0, activeIdx + 1).filter(
      lc => lc.layerKey !== "raw-material" || showRaw,
    );
    if (levelsToShow.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    dotMapRef.current.clear();
    prevSelectedRef.current = null;
    setSelectedPanel(null);

    const el = svgRef.current;
    const proj = d3.geoNaturalEarth1().scale(110).translate([MAP_W / 2 - 28, MAP_H / 2 + 20]);
    const path = d3.geoPath().projection(proj);
    const pt = (lon: number, lat: number): [number, number] => proj([lon, lat]) ?? [0, 0];

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then((world: Topology) => {
        if (!svgRef.current) return;

        // Base map
        svg.append("path")
          .datum(topojson.feature(world, (world.objects as Record<string, GeometryCollection>).land))
          .attr("d", path).attr("fill", "#ddd9cf");
        svg.append("path")
          .datum(topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries, (a, b) => a !== b))
          .attr("d", path).attr("fill", "none").attr("stroke", "#d0ccc2").attr("stroke-width", 0.4);

        const arcPath = (x1: number, y1: number, x2: number, y2: number) => {
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.2;
          return `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
        };

        // Render each visible level
        levelsToShow.forEach((lc, levelRelIdx) => {
          const isActive = levelRelIdx === levelsToShow.length - 1;
          const targetOpacity = isActive ? 1.0 : 0.3;
          const nodeRadius = (base: number) => isActive ? base : Math.max(1.5, base * 0.65);

          // Create a group for this level, starting at 0 for active (fade in), final for previous
          const group = svg.append("g")
            .attr("data-layer", lc.layerKey)
            .attr("opacity", isActive ? 0 : targetOpacity);

          let animDotIdx = 0;

          // Flow arcs — only for active level
          if (isActive) {
            for (const flow of lc.flows) {
              const fromSL = lc.subLayers[flow.from];
              const toSL   = lc.subLayers[flow.to];
              for (const [fi, ti] of flow.connections) {
                const fn = fromSL.nodes[fi]; const tn = toSL.nodes[ti];
                if (!fn || !tn) continue;
                const [x1, y1] = pt(fn.lon, fn.lat);
                const [x2, y2] = pt(tn.lon, tn.lat);
                const d = arcPath(x1, y1, x2, y2);
                const dur   = 2200 + (animDotIdx % 5) * 300;
                const delay = (animDotIdx * 400) % 3000;

                group.append("path")
                  .attr("d", d).attr("fill", "none")
                  .attr("stroke", fromSL.color).attr("stroke-width", 0.7)
                  .attr("stroke-opacity", 0.18);

                const pathId = `scm-p-${chainState}-${animDotIdx}`;
                const hiddenPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                hiddenPath.setAttribute("id", pathId); hiddenPath.setAttribute("d", d);
                hiddenPath.setAttribute("fill", "none"); hiddenPath.setAttribute("stroke", "none");
                el.appendChild(hiddenPath);

                const animDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                animDot.setAttribute("r", "1.8"); animDot.setAttribute("fill", fromSL.color);
                animDot.setAttribute("fill-opacity", "0.75");
                const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
                anim.setAttribute("dur", `${dur}ms`); anim.setAttribute("begin", `${delay}ms`);
                anim.setAttribute("repeatCount", "indefinite"); anim.setAttribute("calcMode", "linear");
                const mpath = document.createElementNS("http://www.w3.org/2000/svg", "mpath");
                mpath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
                anim.appendChild(mpath); animDot.appendChild(anim); el.appendChild(animDot);
                animDotIdx++;
              }
            }
          }

          // Node dots
          for (const subLayer of lc.subLayers) {
            const baseR = subLayer.radius;
            for (let ni = 0; ni < subLayer.nodes.length; ni++) {
              const node = subLayer.nodes[ni];
              const [x, y] = pt(node.lon, node.lat);
              const r = nodeRadius(baseR);

              // Pulse halo — active layer only
              if (isActive) {
                const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                halo.setAttribute("cx", String(x)); halo.setAttribute("cy", String(y));
                halo.setAttribute("r", "0"); halo.setAttribute("fill", "none");
                halo.setAttribute("stroke", subLayer.color); halo.setAttribute("stroke-width", "0.8");
                const ar = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                ar.setAttribute("attributeName", "r"); ar.setAttribute("values", "0;12");
                ar.setAttribute("dur", `${2000 + ni * 200}ms`); ar.setAttribute("begin", `${ni * 300}ms`);
                ar.setAttribute("repeatCount", "indefinite");
                const ao = document.createElementNS("http://www.w3.org/2000/svg", "animate");
                ao.setAttribute("attributeName", "stroke-opacity"); ao.setAttribute("values", "0.4;0");
                ao.setAttribute("dur", `${2000 + ni * 200}ms`); ao.setAttribute("begin", `${ni * 300}ms`);
                ao.setAttribute("repeatCount", "indefinite");
                halo.appendChild(ar); halo.appendChild(ao);
                group.node()!.appendChild(halo);
              }

              // Solid dot
              const solidDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              solidDot.setAttribute("cx", String(x)); solidDot.setAttribute("cy", String(y));
              solidDot.setAttribute("r", String(r));
              solidDot.setAttribute("fill", subLayer.color);
              solidDot.setAttribute("fill-opacity", isActive ? "0.9" : "0.7");
              solidDot.setAttribute("style", "cursor: pointer;");
              group.node()!.appendChild(solidDot);

              dotMapRef.current.set(node.name, { dot: solidDot, r });

              // Hit area
              const hit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              hit.setAttribute("cx", String(x)); hit.setAttribute("cy", String(y));
              hit.setAttribute("r", "8"); hit.setAttribute("fill", "transparent");
              hit.setAttribute("style", "cursor: pointer;");

              hit.addEventListener("mouseenter", () => {
                const hitRect = hit.getBoundingClientRect();
                const containerRect = (el.parentElement ?? el).getBoundingClientRect();
                const cx = hitRect.left + hitRect.width  / 2 - containerRect.left;
                const cy = hitRect.top  + hitRect.height / 2 - containerRect.top;
                setTooltip({ name: node.name, loc: node.loc, type: subLayer.label, color: subLayer.color, x: cx, y: cy });
                if (prevSelectedRef.current !== node.name) solidDot.setAttribute("r", String(r * 1.5));
              });
              hit.addEventListener("mouseleave", () => {
                setTooltip(null);
                if (prevSelectedRef.current !== node.name) solidDot.setAttribute("r", String(r));
              });
              hit.addEventListener("click", () => {
                if (prevSelectedRef.current === node.name) {
                  solidDot.setAttribute("r", String(r));
                  prevSelectedRef.current = null;
                  setSelectedPanel(null);
                } else {
                  if (prevSelectedRef.current) {
                    const prev = dotMapRef.current.get(prevSelectedRef.current);
                    if (prev) prev.dot.setAttribute("r", String(prev.r));
                  }
                  solidDot.setAttribute("r", String(r * 1.8));
                  prevSelectedRef.current = node.name;
                  setSelectedPanel(NODE_DATA[node.name] ?? makeFallbackPanel(node, subLayer, lc.layerKey));
                }
              });
              group.node()!.appendChild(hit);
            }
          }

          // Fade in active layer
          if (isActive) {
            group.transition().duration(400).ease(d3.easeLinear).attr("opacity", 1);
          }
        });
      })
      .catch(console.error);

    return () => { svg.selectAll("*").remove(); };
  }, [chainState, rawSelection]);

  // ── Legend items for active level ─────────────────────────────────────────
  const activeLevelConfig = LEVEL_CONFIGS[CHAIN_TO_INDEX[chainState]];
  const legendItems = activeLevelConfig.legendItems;

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

        {/* Legend — active layer sub-layers */}
        <div style={{ position: "absolute", top: "50%", left: 60, transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none", zIndex: 5 }}>
          <div style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 6.5, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Sub-layers</div>
          {legendItems.map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: 7, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em", color: item.color, whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Hover tooltip */}
        {tooltip && (
          <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y - 10, transform: "translate(-50%, -100%)", background: "rgba(15,14,12,0.88)", borderRadius: 4, padding: "6px 10px", pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.92)", marginBottom: 2 }}>{tooltip.name}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7.5, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{tooltip.loc}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6.5, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{tooltip.type}</div>
          </div>
        )}

        {/* Node detail panel */}
        {selectedPanel && <NodeDetailPanel data={selectedPanel} onClose={deselectNode} />}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", marginTop: 16 }}>
      <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} data-map-container style={{ width: "100%", height: MAP_H, background: "rgb(99,99,95)", borderRadius: 6, display: "block" }} />
      {tooltip && (
        <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.85)", borderRadius: 4, padding: "8px 12px", pointerEvents: "none", zIndex: 10 }}>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 11, fontWeight: 600, color: "white", marginBottom: 2 }}>{tooltip.name}</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 9, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>{tooltip.loc}</div>
          <div style={{ fontFamily: "Courier New, monospace", fontSize: 8, color: tooltip.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tooltip.type}</div>
        </div>
      )}
    </div>
  );
}
