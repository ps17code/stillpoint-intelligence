"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";

const R = 1;

function toVec3(lon: number, lat: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

function layerFromType(type: string): string {
  if (["deposit", "miner", "refiner"].includes(type))  return "raw-material";
  if (["converter", "manufacturer"].includes(type))     return "component";
  if (["assembler", "recycler"].includes(type))         return "subsystem";
  return "end-use";
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Brand-aligned palette ──────────────────────────────────────────────────────
const LAYER_COLORS: Record<string, string> = {
  "raw-material": "#C4A46C",
  "component":    "#9BA8AB",
  "subsystem":    "#B87D5E",
  "end-use":      "#D4CCBA",
};

const LAYER_COLOR_HEX: Record<string, number> = {
  "raw-material": 0xC4A46C,
  "component":    0x9BA8AB,
  "subsystem":    0xB87D5E,
  "end-use":      0xD4CCBA,
};

const NEUTRAL_HEX = 0x8A8478;
const DOT_SIZE    = 0.008;

const TYPE_DISPLAY: Record<string, { label: string; color: string }> = {
  deposit:      { label: "Deposit",      color: "#C4A46C" },
  miner:        { label: "Miner",        color: "#C4A46C" },
  refiner:      { label: "Refiner",      color: "#C4A46C" },
  converter:    { label: "Converter",    color: "#9BA8AB" },
  manufacturer: { label: "Manufacturer", color: "#9BA8AB" },
  assembler:    { label: "Assembler",    color: "#B87D5E" },
  recycler:     { label: "Recycler",     color: "#B87D5E" },
  datacenter:   { label: "Datacenter",   color: "#D4CCBA" },
  telecom:      { label: "Telecom",      color: "#D4CCBA" },
};

const NODE_COLOR_HEX: Record<string, number> = {
  deposit: 0xC4A46C, miner: 0xC4A46C, refiner: 0xC4A46C,
  converter: 0x9BA8AB, manufacturer: 0x9BA8AB,
  assembler: 0xB87D5E, recycler: 0xB87D5E,
  datacenter: 0xD4CCBA, telecom: 0xD4CCBA,
};

const TRACKER_LAYERS = [
  { id: "raw-material", label: "Raw material" },
  { id: "component",    label: "Component" },
  { id: "subsystem",    label: "Subsystem" },
  { id: "end-use",      label: "End use" },
];

// ── Shape system ───────────────────────────────────────────────────────────────
// Each node type gets a distinct shape; color stays per-layer (single color per layer)
const TYPE_SHAPE: Record<string, string> = {
  deposit:      "circle",   // filled circle = source / primary production
  miner:        "diamond",  // diamond = extraction
  refiner:      "ring",     // hollow circle = refining / purification
  converter:    "circle",   // source of its layer
  manufacturer: "square",   // square = fabrication
  assembler:    "circle",   // circle = primary production
  recycler:     "circle",
  datacenter:   "triangle", // triangle = end consumption / demand
  telecom:      "diamond",  // diamond = infrastructure processing
};

// Maps sublayer node-type IDs to CSS shapes for the nav legend
const SUB_SHAPE: Record<string, string> = {
  deposit: "circle", miner: "diamond", refiner: "ring",
  converter: "circle", manufacturer: "square",
  assembler: "circle", recycler: "circle",
  datacenter: "triangle", telecom: "diamond",
};

// CSS shape icon component for nav legend
function ShapeIcon({ shape, color }: { shape: string; color: string }) {
  if (shape === "circle")   return <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />;
  if (shape === "diamond")  return <div style={{ width: 4, height: 4, background: color, transform: "rotate(45deg)", flexShrink: 0 }} />;
  if (shape === "ring")     return <div style={{ width: 4, height: 4, borderRadius: "50%", border: `1px solid ${color}`, background: "transparent", flexShrink: 0 }} />;
  if (shape === "square")   return <div style={{ width: 4, height: 4, background: color, flexShrink: 0 }} />;
  if (shape === "triangle") return <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderBottom: `5px solid ${color}`, flexShrink: 0 }} />;
  return null;
}

// ── Data ──────────────────────────────────────────────────────────────────────
type SubItem = { id: string; label: string; count: number; desc: string };
type L2Item  = { id: string; label: string; dot: string | null; count: number | null; status: "Live" | "Soon" | null; href?: string; sublayers?: SubItem[] };
type L1Item  = { id: string; label: string; count: number; children: L2Item[] };

const PORTAL_DATA: L1Item[] = [
  {
    id: "raw-material", label: "Raw material", count: 22,
    children: [
      {
        id: "germanium", label: "Germanium", dot: "#C4A46C", count: 22, status: "Live", href: "/germanium",
        sublayers: [
          { id: "deposit", label: "Deposits", count: 8, desc: "5 in China, 1 Russia (sanctioned), 1 DRC (ramping), 1 Alaska (declining). Zinc and coal ores." },
          { id: "miner",   label: "Miners",   count: 7, desc: "Never the primary target — extracted as a byproduct of zinc smelting and coal processing." },
          { id: "refiner", label: "Refiners", count: 7, desc: "Only 2 in the west — Umicore (Belgium) and Teck Trail (Canada). >50% from recycled scrap." },
        ],
      },
      { id: "gallium",     label: "Gallium",     dot: null, count: null, status: "Soon" },
      { id: "lithium",     label: "Lithium",     dot: null, count: null, status: "Soon" },
      { id: "cobalt",      label: "Cobalt",      dot: null, count: null, status: null },
      { id: "rare-earths", label: "Rare earths", dot: null, count: null, status: null },
      { id: "tungsten",    label: "Tungsten",    dot: null, count: null, status: null },
    ],
  },
  {
    id: "component", label: "Component", count: 9,
    children: [
      {
        id: "gecl4", label: "GeO₂ / GeCl₄", dot: "#9BA8AB", count: 9, status: "Live", href: "/germanium",
        sublayers: [
          { id: "converter",    label: "Converters",            count: 3, desc: "Purify germanium into ultra-pure GeCl₄. In the west, virtually all flows through Umicore in Olen, Belgium." },
          { id: "manufacturer", label: "Preform manufacturers", count: 6, desc: "Corning, Shin-Etsu, Sumitomo, YOFC, Prysmian. All running at 100% capacity. Backlogs into 2027." },
        ],
      },
      { id: "gan",  label: "GaN wafers",     dot: null, count: null, status: null },
      { id: "lioh", label: "LiOH / Cathode", dot: null, count: null, status: null },
    ],
  },
  {
    id: "subsystem", label: "Subsystem", count: 8,
    children: [
      {
        id: "fiber-optic", label: "Fiber optic cable", dot: "#B87D5E", count: 8, status: "Live", href: "/germanium",
        sublayers: [
          { id: "assembler", label: "Cable manufacturers", count: 8, desc: "Corning Hickory becoming world's largest. Prysmian 27 plants. Every one traces back upstream through the same bottleneck." },
        ],
      },
      { id: "ir-camera", label: "IR camera modules", dot: null, count: null, status: null },
      { id: "battery",   label: "Battery cells",     dot: null, count: null, status: null },
    ],
  },
  {
    id: "end-use", label: "End use", count: 8,
    children: [
      {
        id: "ai-datacenter", label: "AI datacenter", dot: "#D4CCBA", count: 8, status: "Live", href: "/germanium",
        sublayers: [
          { id: "datacenter", label: "Hyperscaler DCs", count: 6, desc: "AWS, Azure, Google, Meta, Microsoft, Oracle. AI racks consume 36x more fiber than traditional servers." },
          { id: "telecom",    label: "Telecom / BEAD", count: 2, desc: "Federal broadband competing for the same fiber supply as AI infrastructure." },
        ],
      },
      { id: "defense",        label: "Defense / IR",      dot: null, count: null, status: null },
      { id: "ev",             label: "EVs",               dot: null, count: null, status: null },
      { id: "5g",             label: "5G",                dot: null, count: null, status: null },
      { id: "satellite",      label: "Satellite",         dot: null, count: null, status: null },
      { id: "fiber-networks", label: "Fiber networks",    dot: null, count: null, status: null },
    ],
  },
];

// Globe-to-chain selection mapping
const CHILD_TO_SPINE: Record<string, string> = {
  "germanium":     "Germanium",
  "gecl4":         "GeO₂ / GeCl₄",
  "fiber-optic":   "Fiber Optics",
  "ai-datacenter": "AI Datacenter",
};

const NODES = [
  { name: "Red Dog",                  lat:  68.0, lng: -163.0, type: "deposit",      key: true,  location: "Alaska, USA" },
  { name: "Lincang",                  lat:  23.9, lng:  100.1, type: "deposit",      key: false, location: "Yunnan, China" },
  { name: "Wulantuga",                lat:  44.5, lng:  116.8, type: "deposit",      key: false, location: "Inner Mongolia, China" },
  { name: "Yimin",                    lat:  48.5, lng:  119.8, type: "deposit",      key: false, location: "Inner Mongolia, China" },
  { name: "Huize",                    lat:  26.4, lng:  103.3, type: "deposit",      key: true,  location: "Yunnan, China" },
  { name: "Yiliang",                  lat:  24.9, lng:  104.1, type: "deposit",      key: false, location: "Yunnan, China" },
  { name: "Spetsugli",                lat:  47.3, lng:  134.2, type: "deposit",      key: false, location: "Primorsky, Russia" },
  { name: "Big Hill DRC",             lat: -11.7, lng:   27.5, type: "deposit",      key: false, location: "Katanga, DRC" },
  { name: "Lincang Xinyuan",          lat:  24.0, lng:  100.2, type: "miner",        key: false, location: "Yunnan, China" },
  { name: "Shengli Coal",             lat:  44.0, lng:  116.5, type: "miner",        key: false, location: "Inner Mongolia, China" },
  { name: "Yunnan Chihong",           lat:  25.5, lng:  103.8, type: "miner",        key: false, location: "Yunnan, China" },
  { name: "STL DRC",                  lat: -11.7, lng:   27.6, type: "miner",        key: true,  location: "Katanga, DRC" },
  { name: "Teck Resources",           lat:  49.1, lng: -117.7, type: "miner",        key: false, location: "British Columbia" },
  { name: "Various State Ops",        lat:  39.9, lng:  116.4, type: "miner",        key: false, location: "Multiple, China" },
  { name: "Umicore",                  lat:  51.2, lng:    4.9, type: "refiner",      key: true,  location: "Olen, Belgium" },
  { name: "5N Plus",                  lat:  37.1, lng: -113.6, type: "refiner",      key: false, location: "Utah, USA" },
  { name: "Trail Smelter",            lat:  49.1, lng: -117.8, type: "refiner",      key: false, location: "Trail, BC" },
  { name: "PPM Pure Metals",          lat:  50.9, lng:    6.9, type: "refiner",      key: false, location: "Germany" },
  { name: "JSC Germanium",            lat:  56.0, lng:   93.0, type: "refiner",      key: false, location: "Krasnoyarsk, Russia" },
  { name: "Lincang Xinyuan Refinery", lat:  23.8, lng:  100.0, type: "refiner",      key: false, location: "Yunnan, China" },
  { name: "Yunnan Chihong Refinery",  lat:  25.6, lng:  103.9, type: "refiner",      key: false, location: "Yunnan, China" },
  { name: "Smaller Chinese Refiners", lat:  30.6, lng:  114.3, type: "refiner",      key: false, location: "Wuhan, China" },
  { name: "Umicore GeCl4",            lat:  51.2, lng:    5.0, type: "converter",    key: true,  location: "Olen, Belgium" },
  { name: "Yunnan Chihong GeCl4",     lat:  25.5, lng:  104.0, type: "converter",    key: false, location: "Yunnan, China" },
  { name: "Nanjing Germanium",        lat:  31.8, lng:  118.8, type: "converter",    key: false, location: "Nanjing, China" },
  { name: "Corning Preform",          lat:  35.8, lng:  -81.3, type: "manufacturer", key: true,  location: "Concord, NC" },
  { name: "YOFC",                     lat:  30.6, lng:  114.3, type: "manufacturer", key: false, location: "Wuhan, China" },
  { name: "Shin-Etsu Kashima",        lat:  35.9, lng:  140.7, type: "manufacturer", key: false, location: "Kashima, Japan" },
  { name: "Shin-Etsu YOFC Hubei",     lat:  30.3, lng:  112.2, type: "manufacturer", key: false, location: "Hubei, China" },
  { name: "Prysmian Preform NA",      lat:  35.2, lng:  -80.8, type: "manufacturer", key: false, location: "Claremont, NC" },
  { name: "Sumitomo Electric",        lat:  34.7, lng:  135.5, type: "manufacturer", key: false, location: "Osaka, Japan" },
  { name: "Corning Fiber Concord",    lat:  35.4, lng:  -80.6, type: "assembler",    key: true,  location: "Concord, NC" },
  { name: "Corning Hickory",          lat:  35.7, lng:  -81.3, type: "assembler",    key: false, location: "Hickory, NC" },
  { name: "Prysmian Milan",           lat:  45.5, lng:    9.2, type: "assembler",    key: false, location: "Milan, Italy" },
  { name: "Prysmian Eindhoven",       lat:  51.4, lng:    5.5, type: "assembler",    key: false, location: "Eindhoven, Netherlands" },
  { name: "YOFC Wuhan Cable",         lat:  30.6, lng:  114.4, type: "assembler",    key: false, location: "Wuhan, China" },
  { name: "Sumitomo Cable",           lat:  34.7, lng:  135.5, type: "assembler",    key: false, location: "Osaka, Japan" },
  { name: "LightPath Orlando",        lat:  28.5, lng:  -81.4, type: "assembler",    key: false, location: "Orlando, FL" },
  { name: "Novotech Chatsworth",      lat:  34.3, lng: -118.6, type: "recycler",     key: false, location: "Chatsworth, CA" },
  { name: "AWS us-east-1",            lat:  39.0, lng:  -77.5, type: "datacenter",   key: true,  location: "Ashburn, VA" },
  { name: "Azure West Europe",        lat:  52.4, lng:    4.9, type: "datacenter",   key: false, location: "Amsterdam, Netherlands" },
  { name: "Google us-central",        lat:  41.3, lng:  -95.9, type: "datacenter",   key: false, location: "Council Bluffs, IA" },
  { name: "Meta Prineville",          lat:  44.3, lng: -120.8, type: "datacenter",   key: false, location: "Prineville, OR" },
  { name: "Microsoft Quincy",         lat:  47.2, lng: -119.9, type: "datacenter",   key: false, location: "Quincy, WA" },
  { name: "Oracle Austin",            lat:  30.3, lng:  -97.7, type: "datacenter",   key: false, location: "Austin, TX" },
  { name: "Equinix Tokyo",            lat:  35.7, lng:  139.8, type: "datacenter",   key: false, location: "Tokyo, Japan" },
  { name: "BEAD Rural Deploy",        lat:  38.0, lng:  -97.0, type: "telecom",      key: false, location: "Kansas, USA" },
];

const ARCS: [string, string][] = [
  ["Red Dog", "Trail Smelter"], ["Trail Smelter", "5N Plus"], ["STL DRC", "Umicore"],
  ["Huize", "Yunnan Chihong"], ["Spetsugli", "JSC Germanium"], ["Yunnan Chihong", "Yunnan Chihong Refinery"],
  ["Umicore GeCl4", "Corning Preform"], ["Umicore GeCl4", "Prysmian Preform NA"], ["Yunnan Chihong GeCl4", "YOFC"],
  ["Corning Preform", "Corning Fiber Concord"], ["Corning Preform", "Corning Hickory"],
  ["YOFC", "YOFC Wuhan Cable"], ["Prysmian Preform NA", "Prysmian Milan"],
  ["Corning Fiber Concord", "AWS us-east-1"], ["Corning Hickory", "Meta Prineville"],
  ["Prysmian Milan", "Azure West Europe"], ["YOFC Wuhan Cable", "Equinix Tokyo"],
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const mountRef      = useRef<HTMLDivElement>(null);
  const tooltipRef    = useRef<HTMLDivElement>(null);
  const filterRef     = useRef<{ selectedLayers: Set<string>; activeSubType: string | null; activeSubParent: string | null }>({ selectedLayers: new Set(), activeSubType: null, activeSubParent: null });
  const isPausedRef   = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedL2,    setSelectedL2]    = useState<Map<string, string>>(new Map());
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null);
  const [activeL3,      setActiveL3]      = useState<{ parentId: string; nodeType: string } | null>(null);
  const [hoveredSub,    setHoveredSub]    = useState<string | null>(null);
  const [hovered,       setHovered]       = useState<string | null>(null);
  const [hoveredNode,   setHoveredNode]   = useState<{ name: string; type: string; location: string } | null>(null);
  const [hoverEnter,    setHoverEnter]    = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateFilter = (l2s: Map<string, string>, l3: typeof activeL3) => {
    const sel = new Set<string>();
    Array.from(l2s.keys()).forEach(id => sel.add(id));
    filterRef.current = { selectedLayers: sel, activeSubType: l3?.nodeType ?? null, activeSubParent: l3?.parentId ?? null };
  };

  // Three states per parent: A (collapsed), B (dropdown open), C (material selected)
  const handleParentClick = (parentId: string) => {
    if (selectedL2.has(parentId)) {
      // State C → deselect → State A
      const next = new Map(selectedL2);
      next.delete(parentId);
      const newL3 = activeL3?.parentId === parentId ? null : activeL3;
      setSelectedL2(next);
      setActiveL3(newL3);
      updateFilter(next, newL3);
      setHoveredSub(null);
    } else if (openDropdown === parentId) {
      // State B → close → State A
      setOpenDropdown(null);
    } else {
      // State A → open dropdown → State B
      setOpenDropdown(parentId);
    }
  };

  const handleSelectMaterial = (parentId: string, childId: string, status: "Live" | "Soon" | null) => {
    if (!status) return;
    const next = new Map(selectedL2);
    let newL3 = activeL3;
    if (next.get(parentId) === childId) {
      next.delete(parentId);
      if (activeL3?.parentId === parentId) newL3 = null;
    } else {
      next.set(parentId, childId);
      if (activeL3?.parentId === parentId) newL3 = null;
    }
    setSelectedL2(next);
    setActiveL3(newL3);
    updateFilter(next, newL3);
    setOpenDropdown(null);
    setHoveredSub(null);
  };

  const handleSelectL3 = (parentId: string, nodeType: string) => {
    const next = (activeL3?.nodeType === nodeType && activeL3?.parentId === parentId) ? null : { parentId, nodeType };
    setActiveL3(next);
    setHoveredSub(null);
    updateFilter(selectedL2, next);
  };

  const hasLiveSelection = Array.from(selectedL2.entries()).some(([pid, cid]) => {
    const parent = PORTAL_DATA.find(p => p.id === pid);
    return parent?.children.find(c => c.id === cid)?.status === "Live";
  });

  const handleEnterChain = () => {
    if (!hasLiveSelection) return;
    const globeSelection = {
      raw:  CHILD_TO_SPINE[selectedL2.get("raw-material")  ?? ""] ?? null,
      comp: CHILD_TO_SPINE[selectedL2.get("component")     ?? ""] ?? null,
      sub:  CHILD_TO_SPINE[selectedL2.get("subsystem")     ?? ""] ?? null,
      eu:   CHILD_TO_SPINE[selectedL2.get("end-use")       ?? ""] ?? null,
    };
    sessionStorage.setItem("globeSelection", JSON.stringify(globeSelection));
    let href = "/germanium";
    Array.from(selectedL2.entries()).forEach(([pid, cid]) => {
      const parent = PORTAL_DATA.find(p => p.id === pid);
      const child  = parent?.children.find(c => c.id === cid);
      if (child?.status === "Live" && child.href) href = child.href;
    });
    window.location.href = href;
  };

  // ── Three.js ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const kl = new THREE.DirectionalLight(0xffffff, 1.4); kl.position.set(-3, 2.5, 2.5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0xffffff, 0.3); fl.position.set(3, -2, 1);     scene.add(fl);

    const globeGroup = new THREE.Group();
    // Initial rotation: center on North America (~lon -95, central US)
    // By default, lon=-90 faces the camera; shift slightly westward
    globeGroup.rotation.y = 0.09;
    scene.add(globeGroup);

    // Dark base color avoids the amber flash before topology texture loads
    const sphereMat = new THREE.MeshPhongMaterial({ color: new THREE.Color("#0C0C0A"), specular: new THREE.Color("#111111"), shininess: 5 });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), sphereMat));
    new THREE.TextureLoader().load("/earth-topology.png", (tex) => { sphereMat.map = tex; sphereMat.needsUpdate = true; });

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json()).then((world: Topology) => {
        const borders = topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries);
        const buf: number[] = [];
        borders.coordinates.forEach(line => {
          for (let i = 0; i < line.length - 1; i++) {
            const a = toVec3(line[i][0], line[i][1], R * 1.001), b = toVec3(line[i + 1][0], line[i + 1][1], R * 1.001);
            buf.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(buf, 3));
        globeGroup.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })));
      }).catch(console.error);

    const NODE_R  = R * 1.012;
    const S       = DOT_SIZE;
    // Per-type shape geometries (shared across nodes of the same type)
    const SHAPE_GEOS: Record<string, THREE.BufferGeometry> = {
      circle:   new THREE.SphereGeometry(S, 8, 8),
      diamond:  new THREE.PlaneGeometry(S * 1.4, S * 1.4),
      ring:     new THREE.RingGeometry(S * 0.42, S * 0.72, 16),
      square:   new THREE.PlaneGeometry(S * 1.1, S * 1.1),
      triangle: new THREE.CircleGeometry(S * 0.78, 3),
    };
    const ringGeo = new THREE.RingGeometry(DOT_SIZE * 1.5, DOT_SIZE * 4.5, 32);

    type NodeObj = { dot: THREE.Mesh; ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; normal: THREE.Vector3; pulseOffset: number; layer: string; nodeType: string; isKey: boolean; currentMult: number; currentScale: number; currentColor: THREE.Color; shape: string };
    const nodeObjs: NodeObj[] = [];
    let pOffset = 0;

    NODES.forEach(n => {
      const layer  = layerFromType(n.type);
      const shape  = TYPE_SHAPE[n.type] ?? "circle";
      const pos    = toVec3(n.lng, n.lat, NODE_R);
      const normal = pos.clone().normalize();
      const currentColor = new THREE.Color(NEUTRAL_HEX);

      const dot = new THREE.Mesh(
        SHAPE_GEOS[shape],
        new THREE.MeshBasicMaterial({ color: currentColor.clone(), transparent: true, opacity: 1, side: THREE.DoubleSide }),
      );
      dot.position.copy(pos);
      // Orient flat shapes to face outward from the globe surface
      if (shape !== "circle") {
        dot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        if (shape === "diamond") dot.rotateZ(Math.PI / 4);
      }
      globeGroup.add(dot);

      const ringMat = new THREE.MeshBasicMaterial({ color: currentColor.clone(), transparent: true, opacity: 0, side: THREE.DoubleSide });
      const ring    = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      globeGroup.add(ring);

      pOffset += 0.8;
      nodeObjs.push({ dot, ring, ringMat, normal, pulseOffset: pOffset, layer, nodeType: n.type, isKey: n.key, currentMult: 1, currentScale: 1, currentColor, shape });
    });

    const nodeByName = Object.fromEntries(NODES.map(n => [n.name, n]));
    type ArcObj = { lineMat: THREE.LineBasicMaterial; nA: THREE.Vector3; nB: THREE.Vector3; curve: THREE.QuadraticBezierCurve3; traveler: THREE.Mesh; travelerMat: THREE.MeshBasicMaterial; speed: number; tOffset: number; layerA: string; typeA: string; layerB: string; typeB: string; currentMult: number };
    const arcObjs: ArcObj[] = [];
    const travelerGeo = new THREE.SphereGeometry(DOT_SIZE * 0.65, 6, 6);

    ARCS.forEach(([fn, tn], idx) => {
      const a = nodeByName[fn], b = nodeByName[tn]; if (!a || !b) return;
      const pA = toVec3(a.lng, a.lat, NODE_R), pB = toVec3(b.lng, b.lat, NODE_R);
      const midOut = pA.clone().add(pB).multiplyScalar(0.5).normalize().multiplyScalar(pA.clone().add(pB).multiplyScalar(0.5).length() + 0.55);
      const curve  = new THREE.QuadraticBezierCurve3(pA, midOut, pB);
      const lineMat    = new THREE.LineBasicMaterial({ color: NODE_COLOR_HEX[a.type], transparent: true, opacity: 0.14 });
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), lineMat));
      const travelerMat = new THREE.MeshBasicMaterial({ color: NODE_COLOR_HEX[a.type], transparent: true, opacity: 0 });
      const traveler    = new THREE.Mesh(travelerGeo, travelerMat);
      traveler.position.copy(curve.getPoint(0)); globeGroup.add(traveler);
      arcObjs.push({ lineMat, nA: pA.clone().normalize(), nB: pB.clone().normalize(), curve, traveler, travelerMat, speed: 0.08 + (idx % 5) * 0.012, tOffset: (idx * 0.37) % 1, layerA: layerFromType(a.type), typeA: a.type, layerB: layerFromType(b.type), typeB: b.type, currentMult: 1 });
    });

    const resumeRotation = () => { isPausedRef.current = false; if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; } };

    const AUTO_SPEED  = (2 * Math.PI) / 90;
    const mouseScreen = { x: -999, y: -999 };
    let currentHoveredIdx = -1, currentHoveredName: string | null = null;
    const tooltipPos = new THREE.Vector3(), tooltipProj = new THREE.Vector3();
    let isPointerDown = false, didDrag = false, pointerDownX = 0, pointerDownY = 0, prevX = 0, prevY = 0;

    const onDown = (e: PointerEvent) => { isPointerDown = true; didDrag = false; pointerDownX = e.clientX; pointerDownY = e.clientY; prevX = e.clientX; prevY = e.clientY; mount.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      mouseScreen.x = e.clientX; mouseScreen.y = e.clientY;
      if (!isPointerDown) return;
      const dx = e.clientX - pointerDownX, dy = e.clientY - pointerDownY;
      if (Math.sqrt(dx * dx + dy * dy) > 4) didDrag = true;
      if (!didDrag) return;
      globeGroup.rotation.y += (e.clientX - prevX) * 0.005; globeGroup.rotation.x += (e.clientY - prevY) * 0.005;
      prevX = e.clientX; prevY = e.clientY;
    };
    const onUp    = () => { isPointerDown = false; if (!didDrag) { if (isPausedRef.current) resumeRotation(); else { isPausedRef.current = true; if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; } } didDrag = false; };
    const onLeave = () => { isPointerDown = false; didDrag = false; mouseScreen.x = -999; mouseScreen.y = -999; if (currentHoveredName !== null) { currentHoveredName = null; currentHoveredIdx = -1; setHoveredNode(null); } };

    mount.addEventListener("pointerdown",  onDown);
    mount.addEventListener("pointermove",  onMove);
    mount.addEventListener("pointerup",    onUp);
    mount.addEventListener("pointerleave", onLeave);
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock(), camDir = new THREE.Vector3(0, 0, 1), worldNormal = new THREE.Vector3();
    const tmpColor = new THREE.Color();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      if (!isPausedRef.current && !isPointerDown) globeGroup.rotation.y += AUTO_SPEED * delta;
      const t = clock.elapsedTime;
      const lerpK = Math.min(1, delta * 4.5);
      const { selectedLayers, activeSubType, activeSubParent } = filterRef.current;
      const hasSelection = selectedLayers.size > 0;

      nodeObjs.forEach((no) => {
        let targetMult: number, targetScale: number, targetHex: number, ringEnabled: boolean;
        if (!hasSelection) {
          targetMult = 1; targetScale = 1; targetHex = NEUTRAL_HEX; ringEnabled = false;
        } else if (selectedLayers.has(no.layer)) {
          const lc = LAYER_COLOR_HEX[no.layer];
          if (activeSubParent === no.layer && activeSubType) {
            if (no.nodeType === activeSubType) { targetMult = 1; targetScale = 1.625; targetHex = lc; ringEnabled = true; }
            else                               { targetMult = 0.3; targetScale = 1; targetHex = lc; ringEnabled = false; }
          } else { targetMult = 1; targetScale = 1; targetHex = lc; ringEnabled = no.isKey; }
        } else { targetMult = 0.08; targetScale = 1; targetHex = NEUTRAL_HEX; ringEnabled = false; }

        no.currentMult  += (targetMult  - no.currentMult)  * lerpK;
        no.currentScale += (targetScale - no.currentScale) * lerpK;
        tmpColor.setHex(targetHex); no.currentColor.lerp(tmpColor, lerpK);
        no.dot.scale.setScalar(no.currentScale);
        (no.dot.material as THREE.MeshBasicMaterial).color.copy(no.currentColor);
        worldNormal.copy(no.normal).applyQuaternion(globeGroup.quaternion);
        const f    = worldNormal.dot(camDir);
        const base = f < -0.1 ? 0 : Math.min(1, (f + 0.1) / 0.3);
        (no.dot.material as THREE.MeshBasicMaterial).opacity = base * no.currentMult;
        if (ringEnabled && f >= -0.1 && no.currentMult > 0.3) {
          const w = (Math.sin((t * 0.9 + no.pulseOffset * 0.8) * Math.PI * 2 * 0.28) + 1) / 2;
          no.ring.scale.setScalar(1 + w * 1.6); no.ringMat.color.copy(no.currentColor);
          no.ringMat.opacity = (1 - w) * 0.35 * base * no.currentMult;
        } else { no.ringMat.opacity = Math.max(0, no.ringMat.opacity - delta * 3); }
      });

      arcObjs.forEach((ao) => {
        let mA: number, mB: number;
        if (!hasSelection) { mA = mB = 1; }
        else {
          mA = selectedLayers.has(ao.layerA) ? 1 : 0.08;
          mB = selectedLayers.has(ao.layerB) ? 1 : 0.08;
          if (activeSubParent && activeSubType) {
            if (ao.layerA === activeSubParent && ao.typeA !== activeSubType) mA = Math.min(mA, 0.3);
            if (ao.layerB === activeSubParent && ao.typeB !== activeSubType) mB = Math.min(mB, 0.3);
          }
        }
        ao.currentMult += (Math.min(mA, mB) - ao.currentMult) * lerpK;
        const m  = ao.currentMult;
        const fA = worldNormal.copy(ao.nA).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const fB = worldNormal.copy(ao.nB).applyQuaternion(globeGroup.quaternion).dot(camDir);
        ao.lineMat.opacity = Math.max(0, Math.min(fA, fB)) * 0.14 * m;
        const progress = ((t * ao.speed + ao.tOffset) % 1 + 1) % 1;
        const pos = ao.curve.getPoint(progress); ao.traveler.position.copy(pos);
        worldNormal.copy(pos).normalize().applyQuaternion(globeGroup.quaternion);
        const tf = worldNormal.dot(camDir);
        ao.travelerMat.opacity = tf < -0.1 ? 0 : Math.min(1, (tf + 0.1) / 0.3) * 0.85 * m;
      });

      if (mouseScreen.x > -500) {
        let closest = -1, closestDist = 14, cSX = 0, cSY = 0;
        nodeObjs.forEach((no, idx) => {
          worldNormal.copy(no.normal).applyQuaternion(globeGroup.quaternion);
          if (worldNormal.dot(camDir) < 0 || no.currentMult < 0.3) return;
          tooltipPos.copy(no.dot.position).applyQuaternion(globeGroup.quaternion);
          tooltipProj.copy(tooltipPos).project(camera);
          const sx = (tooltipProj.x * 0.5 + 0.5) * window.innerWidth;
          const sy = (-tooltipProj.y * 0.5 + 0.5) * window.innerHeight;
          const d  = Math.sqrt((sx - mouseScreen.x) ** 2 + (sy - mouseScreen.y) ** 2);
          if (d < closestDist) { closestDist = d; closest = idx; cSX = sx; cSY = sy; }
        });
        const newName = closest >= 0 ? NODES[closest].name : null;
        if (newName !== currentHoveredName) {
          currentHoveredName = newName; currentHoveredIdx = closest;
          if (closest >= 0) { const n = NODES[closest]; setHoveredNode({ name: n.name, type: n.type, location: n.location }); }
          else setHoveredNode(null);
        }
        if (closest >= 0 && tooltipRef.current) { tooltipRef.current.style.left = cSX + "px"; tooltipRef.current.style.top = (cSY - 8) + "px"; }
        void currentHoveredIdx;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId); window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onDown); mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);     mount.removeEventListener("pointerleave", onLeave);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      Object.values(SHAPE_GEOS).forEach(g => g.dispose());
      renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Description expansion: hover previews, click is sticky
  const activeSubKey = activeL3 ? `${activeL3.parentId}/${activeL3.nodeType}` : null;
  const expandedKey  = hoveredSub ?? activeSubKey;

  return (
    <div style={{ background: "#0C0C0B", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Brand header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, display: "flex", alignItems: "center", padding: "0 28px", zIndex: 10 }}>
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Stillpoint</span>
        <span style={{ width: 5, display: "inline-block" }} />
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>Intelligence</span>
      </div>

      {/* Globe */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: hoveredNode ? "crosshair" : "grab" }} />

      {/* Hover tooltip */}
      <div ref={tooltipRef} style={{ position: "absolute", pointerEvents: "none", zIndex: 30, opacity: hoveredNode ? 1 : 0, transition: "opacity 0.1s ease", transform: "translate(-50%, -100%)", left: 0, top: 0 }}>
        {hoveredNode && (
          <div style={{ background: "rgba(20,20,18,0.92)", border: "0.5px solid rgba(255,255,255,0.08)", padding: "6px 10px" }}>
            <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{hoveredNode.name}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, color: TYPE_DISPLAY[hoveredNode.type].color, marginBottom: 1 }}>{TYPE_DISPLAY[hoveredNode.type].label}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.25)" }}>{hoveredNode.location}</div>
          </div>
        )}
      </div>

      {/* ── Left navigation — dropdown column ─────────────────────────────────── */}
      <div style={{ position: "absolute", left: 36, top: "50%", transform: "translateY(-50%)", zIndex: 20 }}>
        {PORTAL_DATA.map((parent) => {
          const selChildId  = selectedL2.get(parent.id) ?? null;
          const selChild    = selChildId ? parent.children.find(c => c.id === selChildId) ?? null : null;
          const isStateC    = !!selChild;
          const isStateB    = !isStateC && openDropdown === parent.id;
          const isHovParent = hovered === `l1:${parent.id}`;
          const lc          = LAYER_COLORS[parent.id];

          // Line styling
          const lineBackground = (isStateC || isStateB) ? lc : "rgba(255,255,255,0.08)";
          const lineOpacity    = isStateB ? 0.4 : 1;

          // Name styling
          const nameText   = isStateC ? selChild!.label : parent.label;
          const nameColor  = (isStateC || isStateB) ? lc : (isHovParent ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)");
          const nameOpacity= isStateB ? 0.6 : 1;
          const nameWeight = (isStateC || isStateB) ? 500 : 400;

          return (
            <div key={parent.id}>
              {/* Parent row */}
              <div
                onClick={() => handleParentClick(parent.id)}
                onMouseEnter={() => setHovered(`l1:${parent.id}`)}
                onMouseLeave={() => setHovered(null)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", cursor: "pointer" }}
              >
                <div style={{ width: 14, height: 0.5, background: lineBackground, opacity: lineOpacity, flexShrink: 0, transition: "background 0.25s ease, opacity 0.25s ease" }} />
                <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 12, fontWeight: nameWeight, color: nameColor, opacity: nameOpacity, transition: "color 0.2s ease, opacity 0.2s ease", whiteSpace: "nowrap" }}>
                  {nameText}
                </span>
              </div>

              {/* State B — material dropdown (in-flow, pushes siblings down) */}
              {isStateB && (
                <div
                  style={{ padding: "4px 0 6px 22px", borderLeft: `0.5px solid ${hexToRgba(lc, 0.08)}`, marginLeft: 7, animation: "fadeInDown 0.25s ease" }}
                >
                  {parent.children.map((child) => {
                    const isUnavail = !child.status;
                    const isHovCh   = hovered === `l2:${parent.id}/${child.id}` && !isUnavail;
                    return (
                      <div
                        key={child.id}
                        onClick={() => handleSelectMaterial(parent.id, child.id, child.status)}
                        onMouseEnter={() => !isUnavail && setHovered(`l2:${parent.id}/${child.id}`)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", cursor: isUnavail ? "default" : "pointer" }}
                      >
                        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, color: isHovCh ? "rgba(255,255,255,0.65)" : isUnavail ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)", transition: "color 0.12s ease", whiteSpace: "nowrap" }}>
                          {child.label}
                        </span>
                        {child.status && (
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6, textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "1.5px 5px", color: child.status === "Live" ? "#7DA06A" : "rgba(255,255,255,0.15)", background: child.status === "Live" ? "rgba(125,160,106,0.1)" : "rgba(255,255,255,0.03)" }}>
                            {child.status}
                          </span>
                        )}
                        {child.count !== null && (
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.12)" }}>{child.count}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* State C — sub-layer list (replaces dropdown) */}
              {isStateC && selChild!.sublayers && (
                <div style={{ padding: "4px 0 4px 22px", borderLeft: `0.5px solid ${hexToRgba(lc, 0.08)}`, marginLeft: 7, animation: "fadeInDown 0.25s ease" }}>
                  {selChild!.sublayers.map((sub) => {
                    const subKey    = `${parent.id}/${sub.id}`;
                    const isActive  = activeL3?.parentId === parent.id && activeL3?.nodeType === sub.id;
                    const isHovSub  = hoveredSub === subKey;
                    const isExpanded= expandedKey === subKey;

                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectL3(parent.id, sub.id)}
                        onMouseEnter={() => setHoveredSub(subKey)}
                        onMouseLeave={() => setHoveredSub(null)}
                        style={{ padding: "5px 0 5px 6px", cursor: "pointer", background: isActive ? hexToRgba(lc, 0.04) : "transparent", borderRadius: 3, transition: "background 0.15s ease" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {/* Active dot indicator (replaces border-left) */}
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: isActive ? lc : "transparent", flexShrink: 0, transition: "background 0.15s ease" }} />
                          {/* Shape icon teaches the visual language */}
                          <ShapeIcon shape={SUB_SHAPE[sub.id] ?? "circle"} color={isActive || isHovSub ? lc : "rgba(255,255,255,0.2)"} />
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, fontWeight: 500, color: (isActive || isHovSub) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", transition: "color 0.12s ease", whiteSpace: "nowrap" }}>
                            {sub.label}
                          </span>
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{sub.count}</span>
                        </div>
                        {/* Description — expands on hover (preview) or click (sticky) */}
                        <div style={{ display: "grid", gridTemplateRows: isExpanded ? "1fr" : "0fr", opacity: isExpanded ? 1 : 0, transition: "grid-template-rows 0.2s ease, opacity 0.2s ease", maxWidth: 300 }}>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ margin: "4px 0 2px 0", fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                              {sub.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom-right chain tracker (pill) ────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 32, right: 36, zIndex: 20, opacity: selectedL2.size > 0 ? 1 : 0, transform: selectedL2.size > 0 ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: selectedL2.size > 0 ? "auto" : "none" }}>
        <div style={{ background: "rgba(20,20,18,0.88)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "6px 8px", display: "flex", alignItems: "center" }}>
          {TRACKER_LAYERS.map((layer, idx) => {
            const selChildId = selectedL2.get(layer.id) ?? null;
            const parentData = PORTAL_DATA.find(p => p.id === layer.id)!;
            const childData  = selChildId ? parentData.children.find(c => c.id === selChildId) ?? null : null;
            return (
              <div key={layer.id} style={{ display: "flex", alignItems: "center" }}>
                {idx > 0 && (
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.12)", padding: "0 2px" }}>→</span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px" }}>
                  {childData ? (
                    <>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: LAYER_COLORS[layer.id], flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>{childData.label}</span>
                        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{layer.label}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>{layer.label}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {hasLiveSelection && (
            <>
              <div style={{ width: 0.5, height: 20, background: "rgba(255,255,255,0.06)", margin: "0 2px" }} />
              <div
                onClick={handleEnterChain}
                onMouseEnter={() => setHoverEnter(true)}
                onMouseLeave={() => setHoverEnter(false)}
                style={{ padding: "6px 12px", cursor: "pointer" }}
              >
                <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 9, color: hoverEnter ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", transition: "color 0.15s ease", whiteSpace: "nowrap" }}>Enter chain →</span>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
