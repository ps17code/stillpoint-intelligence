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

const TYPE_DISPLAY: Record<string, { label: string; color: string }> = {
  deposit:      { label: "Deposit",      color: "#B8975A" },
  miner:        { label: "Miner",        color: "#7DA06A" },
  refiner:      { label: "Refiner",      color: "#A07DAA" },
  converter:    { label: "Converter",    color: "#6A8BBF" },
  manufacturer: { label: "Manufacturer", color: "#6A8BBF" },
  assembler:    { label: "Assembler",    color: "#5A9E8F" },
  recycler:     { label: "Recycler",     color: "#5A9E8F" },
  datacenter:   { label: "Datacenter",   color: "#C8B88A" },
  telecom:      { label: "Telecom",      color: "#C8B88A" },
};

const LAYER_COLORS: Record<string, string> = {
  "raw-material": "#B8975A",
  "component":    "#6A8BBF",
  "subsystem":    "#5A9E8F",
  "end-use":      "#C8B88A",
};

const LAYER_COLOR_HEX: Record<string, number> = {
  "raw-material": 0xB8975A,
  "component":    0x6A8BBF,
  "subsystem":    0x5A9E8F,
  "end-use":      0xC8B88A,
};

const NEUTRAL_HEX = 0x8A8478;
const DOT_SIZE    = 0.008;

// ── Portal data ────────────────────────────────────────────────────────────────
type SubItem = { id: string; label: string; count: number; desc: string };
type L2Item  = { id: string; label: string; dot: string | null; count: number | null; status: "Live" | "Soon" | null; href?: string; sublayers?: SubItem[] };
type L1Item  = { id: string; label: string; count: number; children: L2Item[] };

const PORTAL_DATA: L1Item[] = [
  {
    id: "raw-material", label: "Raw material", count: 22,
    children: [
      {
        id: "germanium", label: "Germanium", dot: "#B8975A", count: 22, status: "Live", href: "/germanium",
        sublayers: [
          { id: "deposit", label: "Deposits",  count: 8, desc: "5 in China, 1 Russia (sanctioned), 1 DRC (ramping), 1 Alaska (declining). Zinc and coal ores." },
          { id: "miner",   label: "Miners",    count: 7, desc: "Never the primary target — extracted as a byproduct of zinc smelting and coal processing." },
          { id: "refiner", label: "Refiners",  count: 7, desc: "Only 2 in the west — Umicore (Belgium) and Teck Trail (Canada). >50% recycled scrap." },
        ],
      },
      { id: "gallium",     label: "Gallium",     dot: "#6A8BBF", count: null, status: "Soon" },
      { id: "lithium",     label: "Lithium",     dot: "#C4836A", count: null, status: "Soon" },
      { id: "cobalt",      label: "Cobalt",      dot: null,      count: null, status: null },
      { id: "rare-earths", label: "Rare earths", dot: null,      count: null, status: null },
      { id: "tungsten",    label: "Tungsten",    dot: null,      count: null, status: null },
    ],
  },
  {
    id: "component", label: "Component", count: 9,
    children: [
      {
        id: "gecl4", label: "GeO₂ / GeCl₄", dot: "#6A8BBF", count: 9, status: "Live", href: "/germanium",
        sublayers: [
          { id: "converter",    label: "Converters",            count: 3, desc: "Purify germanium into ultra-pure GeCl₄. In the west, virtually all flows through Umicore." },
          { id: "manufacturer", label: "Preform manufacturers", count: 6, desc: "Corning, Shin-Etsu, Sumitomo, YOFC, Prysmian. All at 100% capacity." },
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
        id: "fiber-optic", label: "Fiber optic cable", dot: "#5A9E8F", count: 8, status: "Live", href: "/germanium",
        sublayers: [
          { id: "assembler", label: "Cable manufacturers", count: 8, desc: "Corning Hickory becoming world's largest. Every plant traces back upstream through the same bottleneck." },
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
        id: "ai-datacenter", label: "AI datacenter", dot: "#C8B88A", count: 8, status: "Live", href: "/germanium",
        sublayers: [
          { id: "datacenter", label: "Hyperscaler DCs", count: 6, desc: "AWS, Azure, Google, Meta, Microsoft, Oracle. AI racks consume 36x more fiber than traditional." },
          { id: "telecom",    label: "Telecom / BEAD", count: 2, desc: "Federal broadband competing for the same fiber supply as AI infrastructure." },
        ],
      },
      { id: "defense",        label: "Defense / IR",      dot: null, count: null, status: null },
      { id: "ev",             label: "Electric vehicles", dot: null, count: null, status: null },
      { id: "5g",             label: "5G infrastructure", dot: null, count: null, status: null },
      { id: "satellite",      label: "Satellite",         dot: null, count: null, status: null },
      { id: "fiber-networks", label: "Fiber networks",    dot: null, count: null, status: null },
    ],
  },
];

const TRACKER_LAYERS = [
  { id: "raw-material", label: "Raw material" },
  { id: "component",    label: "Component" },
  { id: "subsystem",    label: "Subsystem" },
  { id: "end-use",      label: "End use" },
];

// ── Node / arc data ───────────────────────────────────────────────────────────
const NODE_COLOR_HEX: Record<string, number> = {
  deposit: 0xB8975A, miner: 0x7DA06A, refiner: 0xA07DAA,
  converter: 0x6A8BBF, manufacturer: 0x6A8BBF,
  assembler: 0x5A9E8F, recycler: 0x5A9E8F,
  datacenter: 0xC8B88A, telecom: 0xC8B88A,
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
  const mountRef          = useRef<HTMLDivElement>(null);
  const tooltipRef        = useRef<HTMLDivElement>(null);
  const filterRef         = useRef<{
    selectedLayers:   Set<string>;
    activeSubType:    string | null;
    activeSubParent:  string | null;
  }>({ selectedLayers: new Set(), activeSubType: null, activeSubParent: null });
  const isPausedRef       = useRef(false);
  const pauseTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionTimerRef= useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetLegendRef   = useRef<string | null>(null);
  const hoverTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedL2,   setSelectedL2]   = useState<Map<string, string>>(new Map());
  const [activeL3,     setActiveL3]     = useState<{ parentId: string; nodeType: string } | null>(null);
  const [lastSelected, setLastSelected] = useState<{ parentId: string; childId: string } | null>(null);
  const [legendKey,    setLegendKey]    = useState<{ parentId: string; childId: string } | null>(null);
  const [legendOpacity,setLegendOpacity]= useState(0);
  const [openPopover,  setOpenPopover]  = useState<string | null>(null);
  const [hovered,      setHovered]      = useState<string | null>(null);
  const [hoveredNode,  setHoveredNode]  = useState<{ name: string; type: string; location: string } | null>(null);
  const [hoverEnter,   setHoverEnter]   = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateFilter = (l2s: Map<string, string>, l3: typeof activeL3) => {
    const selectedLayers = new Set<string>();
    Array.from(l2s.keys()).forEach(id => selectedLayers.add(id));
    filterRef.current = {
      selectedLayers,
      activeSubType:   l3?.nodeType  ?? null,
      activeSubParent: l3?.parentId  ?? null,
    };
  };

  const openFor       = (id: string) => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); setOpenPopover(id); };
  const scheduleClose = ()           => { hoverTimerRef.current = setTimeout(() => setOpenPopover(null), 90); };

  const handleSelectL2 = (parentId: string, childId: string, status: "Live" | "Soon" | null) => {
    if (!status) return;
    const next = new Map(selectedL2);
    let newLast = lastSelected;
    let newL3   = activeL3;

    if (next.get(parentId) === childId) {
      next.delete(parentId);
      if (lastSelected?.parentId === parentId && lastSelected?.childId === childId) {
        const entries = Array.from(next.entries());
        newLast = entries.length > 0 ? { parentId: entries[entries.length - 1][0], childId: entries[entries.length - 1][1] } : null;
      }
      if (activeL3?.parentId === parentId) newL3 = null;
    } else {
      next.set(parentId, childId);
      newLast = { parentId, childId };
      if (activeL3?.parentId === parentId) newL3 = null;
    }

    setSelectedL2(next);
    setLastSelected(newLast);
    setActiveL3(newL3);
    updateFilter(next, newL3);
    setOpenPopover(null);
  };

  const handleSelectL3 = (parentId: string, nodeType: string) => {
    const next = (activeL3?.nodeType === nodeType && activeL3?.parentId === parentId) ? null : { parentId, nodeType };
    setActiveL3(next);
    updateFilter(selectedL2, next);
  };

  const hasLiveSelection = Array.from(selectedL2.entries()).some(([pid, cid]) => {
    const parent = PORTAL_DATA.find(p => p.id === pid);
    return parent?.children.find(c => c.id === cid)?.status === "Live";
  });

  const handleEnterChain = () => {
    Array.from(selectedL2.entries()).forEach(([pid, cid]) => {
      const parent = PORTAL_DATA.find(p => p.id === pid);
      const child  = parent?.children.find(c => c.id === cid);
      if (child?.status === "Live" && child.href) window.location.href = child.href;
    });
  };

  // ── Legend fade transition ────────────────────────────────────────────────
  useEffect(() => {
    const key = lastSelected ? `${lastSelected.parentId}/${lastSelected.childId}` : null;
    if (key === targetLegendRef.current) return;
    targetLegendRef.current = key;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setLegendOpacity(0);
    if (!lastSelected) {
      transitionTimerRef.current = setTimeout(() => setLegendKey(null), 300);
    } else {
      transitionTimerRef.current = setTimeout(() => { setLegendKey(lastSelected); setLegendOpacity(1); }, 220);
    }
    return () => { if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current); };
  }, [lastSelected]);

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
    scene.add(globeGroup);

    const sphereMat = new THREE.MeshPhongMaterial({ color: new THREE.Color("#B0A490"), specular: new THREE.Color("#111111"), shininess: 5 });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), sphereMat));
    new THREE.TextureLoader().load("/earth-topology.png", (tex) => { sphereMat.map = tex; sphereMat.needsUpdate = true; });

    const OUTLINE_R = R * 1.001;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json()).then((world: Topology) => {
        const borders = topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries);
        const buf: number[] = [];
        borders.coordinates.forEach(line => {
          for (let i = 0; i < line.length - 1; i++) {
            const a = toVec3(line[i][0], line[i][1], OUTLINE_R), b = toVec3(line[i + 1][0], line[i + 1][1], OUTLINE_R);
            buf.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(buf, 3));
        globeGroup.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })));
      }).catch(console.error);

    const NODE_R  = R * 1.012;
    const dotGeo  = new THREE.SphereGeometry(DOT_SIZE, 8, 8);
    const ringGeo = new THREE.RingGeometry(DOT_SIZE * 1.5, DOT_SIZE * 4.5, 32);

    type NodeObj = {
      dot: THREE.Mesh; ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial;
      normal: THREE.Vector3; pulseOffset: number;
      layer: string; nodeType: string; isKey: boolean;
      currentMult: number; currentScale: number; currentColor: THREE.Color;
    };
    const nodeObjs: NodeObj[] = [];
    let pOffset = 0;

    NODES.forEach(n => {
      const layer = layerFromType(n.type);
      const pos   = toVec3(n.lng, n.lat, NODE_R);
      const normal = pos.clone().normalize();
      const currentColor = new THREE.Color(NEUTRAL_HEX);

      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: currentColor.clone(), transparent: true, opacity: 1 }));
      dot.position.copy(pos);
      globeGroup.add(dot);

      const ringMat = new THREE.MeshBasicMaterial({ color: currentColor.clone(), transparent: true, opacity: 0, side: THREE.DoubleSide });
      const ring    = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      globeGroup.add(ring);

      pOffset += 0.8;
      nodeObjs.push({ dot, ring, ringMat, normal, pulseOffset: pOffset, layer, nodeType: n.type, isKey: n.key, currentMult: 1, currentScale: 1, currentColor });
    });

    const nodeByName = Object.fromEntries(NODES.map(n => [n.name, n]));

    type ArcObj = {
      lineMat: THREE.LineBasicMaterial; nA: THREE.Vector3; nB: THREE.Vector3;
      curve: THREE.QuadraticBezierCurve3; traveler: THREE.Mesh; travelerMat: THREE.MeshBasicMaterial;
      speed: number; tOffset: number; layerA: string; typeA: string; layerB: string; typeB: string; currentMult: number;
    };
    const arcObjs: ArcObj[] = [];
    const travelerGeo = new THREE.SphereGeometry(DOT_SIZE * 0.65, 6, 6);

    ARCS.forEach(([fn, tn], idx) => {
      const a = nodeByName[fn], b = nodeByName[tn]; if (!a || !b) return;
      const pA = toVec3(a.lng, a.lat, NODE_R), pB = toVec3(b.lng, b.lat, NODE_R);
      const midOut = pA.clone().add(pB).multiplyScalar(0.5).normalize().multiplyScalar(pA.clone().add(pB).multiplyScalar(0.5).length() + 0.55);
      const curve  = new THREE.QuadraticBezierCurve3(pA, midOut, pB);
      const color  = NODE_COLOR_HEX[a.type];
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.14 });
      globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)), lineMat));
      const travelerMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
      const traveler    = new THREE.Mesh(travelerGeo, travelerMat);
      traveler.position.copy(curve.getPoint(0));
      globeGroup.add(traveler);
      arcObjs.push({ lineMat, nA: pA.clone().normalize(), nB: pB.clone().normalize(), curve, traveler, travelerMat, speed: 0.08 + (idx % 5) * 0.012, tOffset: (idx * 0.37) % 1, layerA: layerFromType(a.type), typeA: a.type, layerB: layerFromType(b.type), typeB: b.type, currentMult: 1 });
    });

    // ── Pause/resume ────────────────────────────────────────────────────────
    const resumeRotation = () => {
      isPausedRef.current = false;
      if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    };

    // ── Input ───────────────────────────────────────────────────────────────
    const AUTO_SPEED = (2 * Math.PI) / 90;
    const mouseScreen = { x: -999, y: -999 };
    let currentHoveredIdx = -1, currentHoveredName: string | null = null;
    const tooltipPos = new THREE.Vector3(), tooltipProj = new THREE.Vector3();

    let isPointerDown = false, didDrag = false;
    let pointerDownX = 0, pointerDownY = 0, prevX = 0, prevY = 0;

    const onDown = (e: PointerEvent) => {
      isPointerDown = true; didDrag = false;
      pointerDownX = e.clientX; pointerDownY = e.clientY;
      prevX = e.clientX; prevY = e.clientY;
      mount.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      mouseScreen.x = e.clientX; mouseScreen.y = e.clientY;
      if (!isPointerDown) return;
      const dx = e.clientX - pointerDownX, dy = e.clientY - pointerDownY;
      if (Math.sqrt(dx * dx + dy * dy) > 4) didDrag = true;
      if (!didDrag) return;
      globeGroup.rotation.y += (e.clientX - prevX) * 0.005;
      globeGroup.rotation.x += (e.clientY - prevY) * 0.005;
      prevX = e.clientX; prevY = e.clientY;
    };
    const onUp = () => {
      isPointerDown = false;
      if (!didDrag) {
        if (isPausedRef.current) resumeRotation();
        else { isPausedRef.current = true; if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
      }
      didDrag = false;
    };
    const onLeave = () => {
      isPointerDown = false; didDrag = false;
      mouseScreen.x = -999; mouseScreen.y = -999;
      if (currentHoveredName !== null) { currentHoveredName = null; currentHoveredIdx = -1; setHoveredNode(null); }
    };
    mount.addEventListener("pointerdown",  onDown);
    mount.addEventListener("pointermove",  onMove);
    mount.addEventListener("pointerup",    onUp);
    mount.addEventListener("pointerleave", onLeave);

    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", onResize);

    // ── Render loop ──────────────────────────────────────────────────────────
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

      // ── Nodes ─────────────────────────────────────────────────────────────
      nodeObjs.forEach((no) => {
        let targetMult: number, targetScale: number, targetHex: number, ringEnabled: boolean;

        if (!hasSelection) {
          // State 1 — neutral
          targetMult  = 1; targetScale = 1; targetHex = NEUTRAL_HEX; ringEnabled = false;
        } else if (selectedLayers.has(no.layer)) {
          const lc = LAYER_COLOR_HEX[no.layer];
          if (activeSubParent === no.layer && activeSubType) {
            if (no.nodeType === activeSubType) {
              // State 3 — highlighted sub-layer
              targetMult = 1; targetScale = 1.625; targetHex = lc; ringEnabled = true;
            } else {
              // State 3 — same layer, other sub-layers
              targetMult = 0.3; targetScale = 1; targetHex = lc; ringEnabled = false;
            }
          } else {
            // State 2 — whole layer selected
            targetMult = 1; targetScale = 1; targetHex = lc; ringEnabled = no.isKey;
          }
        } else {
          // Not in any selected layer
          targetMult = 0.08; targetScale = 1; targetHex = NEUTRAL_HEX; ringEnabled = false;
        }

        no.currentMult  += (targetMult  - no.currentMult)  * lerpK;
        no.currentScale += (targetScale - no.currentScale) * lerpK;
        tmpColor.setHex(targetHex);
        no.currentColor.lerp(tmpColor, lerpK);

        no.dot.scale.setScalar(no.currentScale);
        (no.dot.material as THREE.MeshBasicMaterial).color.copy(no.currentColor);
        worldNormal.copy(no.normal).applyQuaternion(globeGroup.quaternion);
        const f = worldNormal.dot(camDir);
        const base = f < -0.1 ? 0 : Math.min(1, (f + 0.1) / 0.3);
        (no.dot.material as THREE.MeshBasicMaterial).opacity = base * no.currentMult;

        if (ringEnabled && f >= -0.1 && no.currentMult > 0.3) {
          const w = (Math.sin((t * 0.9 + no.pulseOffset * 0.8) * Math.PI * 2 * 0.28) + 1) / 2;
          no.ring.scale.setScalar(1 + w * 1.6);
          no.ringMat.color.copy(no.currentColor);
          no.ringMat.opacity = (1 - w) * 0.35 * base * no.currentMult;
        } else {
          no.ringMat.opacity = Math.max(0, no.ringMat.opacity - delta * 3);
        }
      });

      // ── Arcs ──────────────────────────────────────────────────────────────
      arcObjs.forEach((ao) => {
        let mA: number, mB: number;
        if (!hasSelection) {
          mA = mB = 1;
        } else {
          mA = selectedLayers.has(ao.layerA) ? 1 : 0.08;
          mB = selectedLayers.has(ao.layerB) ? 1 : 0.08;
          if (activeSubParent && activeSubType) {
            if (ao.layerA === activeSubParent && ao.typeA !== activeSubType) mA = Math.min(mA, 0.3);
            if (ao.layerB === activeSubParent && ao.typeB !== activeSubType) mB = Math.min(mB, 0.3);
          }
        }
        ao.currentMult += (Math.min(mA, mB) - ao.currentMult) * lerpK;
        const m = ao.currentMult;
        const fA = worldNormal.copy(ao.nA).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const fB = worldNormal.copy(ao.nB).applyQuaternion(globeGroup.quaternion).dot(camDir);
        ao.lineMat.opacity = Math.max(0, Math.min(fA, fB)) * 0.14 * m;
        const progress = ((t * ao.speed + ao.tOffset) % 1 + 1) % 1;
        const pos = ao.curve.getPoint(progress); ao.traveler.position.copy(pos);
        worldNormal.copy(pos).normalize().applyQuaternion(globeGroup.quaternion);
        const tf = worldNormal.dot(camDir);
        ao.travelerMat.opacity = tf < -0.1 ? 0 : Math.min(1, (tf + 0.1) / 0.3) * 0.85 * m;
      });

      // ── Hover detection ───────────────────────────────────────────────────
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
        if (closest >= 0 && tooltipRef.current) {
          tooltipRef.current.style.left = cSX + "px";
          tooltipRef.current.style.top  = (cSY - 8) + "px";
        }
        void currentHoveredIdx;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown",  onDown);
      mount.removeEventListener("pointermove",  onMove);
      mount.removeEventListener("pointerup",    onUp);
      mount.removeEventListener("pointerleave", onLeave);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── Derived display state ─────────────────────────────────────────────────
  const trackerVisible = selectedL2.size > 0;
  const legendParent   = legendKey ? PORTAL_DATA.find(p => p.id === legendKey.parentId) : null;
  const legendL2       = legendKey && legendParent ? legendParent.children.find(c => c.id === legendKey.childId) : null;
  const legendColor    = legendKey ? LAYER_COLORS[legendKey.parentId] : "#8A8478";

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

      {/* ── Top-left portal ─────────────────────────────────────────────────── */}
      <div style={{ position: "absolute", left: 36, top: 64, zIndex: 20 }}>
        {PORTAL_DATA.map((parent) => {
          const selL2Id   = selectedL2.get(parent.id) ?? null;
          const selL2     = selL2Id ? parent.children.find(c => c.id === selL2Id) : null;
          const isSelected = !!selL2;
          const isOpen    = openPopover === parent.id;
          const isHov     = hovered === `l1:${parent.id}`;
          const lc        = LAYER_COLORS[parent.id];

          return (
            <div key={parent.id} style={{ position: "relative" }}>
              <div
                onMouseEnter={() => { openFor(parent.id); setHovered(`l1:${parent.id}`); }}
                onMouseLeave={() => { scheduleClose(); setHovered(null); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}
              >
                <div style={{ width: 12, height: 0.5, background: isSelected ? lc : "rgba(255,255,255,0.08)", flexShrink: 0, transition: "background 0.25s ease" }} />
                <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11.5, fontWeight: isSelected ? 500 : 400, color: isSelected ? lc : isHov ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)", transition: "color 0.2s ease", whiteSpace: "nowrap" }}>
                  {isSelected ? selL2!.label : parent.label}
                </span>
              </div>

              {/* Popover */}
              {isOpen && (
                <div
                  onMouseEnter={() => openFor(parent.id)}
                  onMouseLeave={scheduleClose}
                  style={{ position: "absolute", left: "calc(100% + 20px)", top: "50%", transform: "translateY(-50%)", background: "rgba(20,20,18,0.92)", border: "0.5px solid rgba(255,255,255,0.06)", padding: "8px 12px", zIndex: 30, minWidth: 160 }}
                >
                  {parent.children.map((child) => {
                    const isUnavail = !child.status;
                    const isSel     = selL2Id === child.id;
                    const ck        = `pop:${parent.id}/${child.id}`;
                    const isHovCh   = hovered === ck && !isUnavail;
                    return (
                      <div key={child.id}
                        onClick={() => handleSelectL2(parent.id, child.id, child.status)}
                        onMouseEnter={() => !isUnavail && setHovered(ck)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0", cursor: isUnavail ? "default" : "pointer" }}
                      >
                        <div style={{ width: isSel ? 5 : 4, height: isSel ? 5 : 4, borderRadius: "50%", background: child.dot ?? "rgba(255,255,255,0.15)", opacity: isUnavail ? 0.3 : 1, flexShrink: 0, boxShadow: isSel && child.dot ? `0 0 6px ${child.dot}` : "none", transition: "all 0.15s ease" }} />
                        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 10.5, fontWeight: isSel ? 500 : 400, color: isSel ? "rgba(255,255,255,0.85)" : isHovCh ? "rgba(255,255,255,0.6)" : isUnavail ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)", transition: "color 0.12s ease", whiteSpace: "nowrap" }}>
                          {child.label}
                        </span>
                        {child.status && (
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 5.5, textTransform: "uppercase" as const, letterSpacing: "0.05em", padding: "1px 4px", color: child.status === "Live" ? "#7DA06A" : "rgba(255,255,255,0.12)", background: child.status === "Live" ? "rgba(125,160,106,0.1)" : "rgba(255,255,255,0.03)" }}>
                            {child.status}
                          </span>
                        )}
                        {child.count !== null && (
                          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6.5, color: "rgba(255,255,255,0.08)" }}>{child.count}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom-left context legend ───────────────────────────────────────── */}
      {legendL2 && (
        <div style={{ position: "absolute", left: 36, bottom: 44, zIndex: 20, maxWidth: 340, opacity: legendOpacity, transform: legendOpacity > 0 ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.4s ease, transform 0.4s ease", pointerEvents: legendOpacity > 0.5 ? "auto" : "none" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
            <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 13, fontWeight: 500, color: legendColor }}>{legendL2.label}</span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: legendColor, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "rgba(255,255,255,0.12)" }}>{legendParent?.label}</span>
          </div>

          {/* Sub-layer rows */}
          {legendL2.sublayers?.map((sub) => {
            const isActive = activeL3?.parentId === legendKey!.parentId && activeL3?.nodeType === sub.id;
            const isHovSub = hovered === `sub:${legendKey!.parentId}/${sub.id}`;
            return (
              <div
                key={sub.id}
                onClick={() => handleSelectL3(legendKey!.parentId, sub.id)}
                onMouseEnter={() => setHovered(`sub:${legendKey!.parentId}/${sub.id}`)}
                onMouseLeave={() => setHovered(null)}
                style={{ padding: "6px 0 6px 8px", borderBottom: "0.5px solid rgba(255,255,255,0.02)", cursor: "pointer", borderLeft: isActive ? `2px solid ${legendColor}` : "2px solid transparent", transition: "border-left-color 0.2s ease" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9.5, fontWeight: 500, color: isActive ? "rgba(255,255,255,0.7)" : isHovSub ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)", transition: "color 0.12s ease" }}>
                    {sub.label}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.1)" }}>{sub.count}</span>
                </div>
                <div style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 9.5, color: "rgba(255,255,255,0.2)", lineHeight: 1.55 }}>
                  {sub.desc}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bottom-right tracker ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 32, right: 36, zIndex: 20, opacity: trackerVisible ? 1 : 0, transform: trackerVisible ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: trackerVisible ? "auto" : "none" }}>
        <div style={{ background: "rgba(20,20,18,0.88)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "6px 8px", display: "flex", alignItems: "center" }}>
          {TRACKER_LAYERS.map((layer, idx) => {
            const cid = selectedL2.get(layer.id);
            const pd  = PORTAL_DATA.find(p => p.id === layer.id)!;
            const cd  = cid ? pd.children.find(c => c.id === cid) : null;
            return (
              <div key={layer.id} style={{ display: "flex", alignItems: "center" }}>
                {idx > 0 && <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.12)", padding: "0 2px" }}>→</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px" }}>
                  {cd ? (
                    <><div style={{ width: 5, height: 5, borderRadius: "50%", background: cd.dot ?? "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap" }}>{cd.label}</span>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 6, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{layer.label}</span>
                    </div></>
                  ) : (
                    <><div style={{ width: 5, height: 5, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 7, color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>{layer.label}</span></>
                  )}
                </div>
              </div>
            );
          })}
          {hasLiveSelection && (
            <><div style={{ width: 0.5, height: 20, background: "rgba(255,255,255,0.06)", margin: "0 2px" }} />
            <div onClick={handleEnterChain} onMouseEnter={() => setHoverEnter(true)} onMouseLeave={() => setHoverEnter(false)}
              style={{ padding: "6px 12px", cursor: "pointer" }}>
              <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 9, color: hoverEnter ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", transition: "color 0.15s ease", whiteSpace: "nowrap" }}>Enter chain →</span>
            </div></>
          )}
        </div>
      </div>

    </div>
  );
}
