"use client";
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

const LAYER_COLOR_HEX: Record<string, number> = {
  "raw-material": 0xC4A46C,
  "component":    0x9BA8AB,
  "subsystem":    0xB87D5E,
  "end-use":      0xD4CCBA,
};

const NEUTRAL_HEX = 0x8A8478;
const DOT_SIZE    = 0.008;

const NODE_COLOR_HEX: Record<string, number> = {
  deposit: 0xC4A46C, miner: 0xC4A46C, refiner: 0xC4A46C,
  converter: 0x9BA8AB, manufacturer: 0x9BA8AB,
  assembler: 0xB87D5E, recycler: 0xB87D5E,
  datacenter: 0xD4CCBA, telecom: 0xD4CCBA,
};

const TYPE_SHAPE: Record<string, string> = {
  deposit:      "circle",
  miner:        "diamond",
  refiner:      "ring",
  converter:    "circle",
  manufacturer: "square",
  assembler:    "circle",
  recycler:     "circle",
  datacenter:   "triangle",
  telecom:      "diamond",
};

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

const NODES = [
  // ── Germanium deposits ──
  { name: "Red Dog",                  lat:  68.0, lng: -163.0, type: "deposit",      key: true,  location: "Alaska, USA" },
  { name: "Lincang",                  lat:  23.9, lng:  100.1, type: "deposit",      key: false, location: "Yunnan, China" },
  { name: "Wulantuga",                lat:  44.5, lng:  116.8, type: "deposit",      key: false, location: "Inner Mongolia, China" },
  { name: "Yimin",                    lat:  48.5, lng:  119.8, type: "deposit",      key: false, location: "Inner Mongolia, China" },
  { name: "Huize",                    lat:  26.4, lng:  103.3, type: "deposit",      key: true,  location: "Yunnan, China" },
  { name: "Yiliang + SYGT",           lat:  24.9, lng:  104.1, type: "deposit",      key: false, location: "Yunnan, China" },
  { name: "Spetsugli",                lat:  47.3, lng:  134.2, type: "deposit",      key: false, location: "Primorsky, Russia" },
  { name: "Big Hill",                 lat: -11.7, lng:   27.5, type: "deposit",      key: false, location: "Katanga, DRC" },
  // ── Germanium host operations ──
  { name: "Lincang Xinyuan",          lat:  24.0, lng:  100.2, type: "miner",        key: false, location: "Yunnan, China" },
  { name: "Shengli Coal Group",       lat:  44.0, lng:  116.5, type: "miner",        key: false, location: "Inner Mongolia, China" },
  { name: "Yunnan Chihong",           lat:  25.5, lng:  103.8, type: "miner",        key: false, location: "Yunnan, China" },
  { name: "STL / Gécamines",          lat: -11.7, lng:   27.6, type: "miner",        key: true,  location: "Katanga, DRC" },
  { name: "Teck Resources",           lat:  49.1, lng: -117.7, type: "miner",        key: false, location: "British Columbia" },
  { name: "Various State Operators",   lat:  39.9, lng:  116.4, type: "miner",        key: false, location: "Multiple, China" },
  // ── Germanium refiners ──
  { name: "Umicore",                  lat:  51.2, lng:    4.9, type: "refiner",      key: true,  location: "Olen, Belgium" },
  { name: "5N Plus",                  lat:  37.1, lng: -113.6, type: "refiner",      key: false, location: "Utah, USA" },
  { name: "PPM Pure Metals",          lat:  50.9, lng:    6.9, type: "refiner",      key: false, location: "Germany" },
  { name: "JSC Germanium",            lat:  56.0, lng:   93.0, type: "refiner",      key: false, location: "Krasnoyarsk, Russia" },
  { name: "JSC Germanium Refinery",   lat:  56.2, lng:   93.2, type: "refiner",      key: false, location: "Krasnoyarsk, Russia" },
  { name: "Lincang Xinyuan Refinery", lat:  23.8, lng:  100.0, type: "refiner",      key: false, location: "Yunnan, China" },
  { name: "Yunnan Chihong Refinery",  lat:  25.6, lng:  103.9, type: "refiner",      key: false, location: "Yunnan, China" },
  { name: "Chinese State Refiners",   lat:  30.6, lng:  114.3, type: "refiner",      key: false, location: "Wuhan, China" },
  { name: "Blue Moon Metals",         lat:  37.3, lng: -113.5, type: "refiner",      key: false, location: "Utah, USA" },
  // ── Fiber converters ──
  { name: "Umicore GeCl4",            lat:  51.2, lng:    5.0, type: "converter",    key: true,  location: "Olen, Belgium" },
  { name: "Yunnan Chihong GeCl4",     lat:  25.5, lng:  104.0, type: "converter",    key: false, location: "Yunnan, China" },
  { name: "Chinese State GeCl4 Plants", lat: 31.2, lng: 121.5, type: "converter",    key: false, location: "Shanghai, China" },
  { name: "JSC Germanium GeCl4",      lat:  55.8, lng:   37.6, type: "converter",    key: false, location: "Moscow, Russia" },
  // ── Fiber manufacturers ──
  { name: "Corning",                  lat:  35.8, lng:  -81.3, type: "manufacturer", key: true,  location: "Concord, NC" },
  { name: "YOFC",                     lat:  30.6, lng:  114.3, type: "manufacturer", key: false, location: "Wuhan, China" },
  { name: "Shin-Etsu",                lat:  35.9, lng:  140.7, type: "manufacturer", key: false, location: "Kashima, Japan" },
  { name: "Prysmian",                 lat:  45.5, lng:    9.2, type: "manufacturer", key: false, location: "Milan, Italy" },
  { name: "Sumitomo Electric",        lat:  34.7, lng:  135.5, type: "manufacturer", key: false, location: "Osaka, Japan" },
  { name: "Fujikura",                 lat:  35.7, lng:  139.7, type: "manufacturer", key: false, location: "Tokyo, Japan" },
  // ── Fiber assemblers ──
  { name: "CommScope",                lat:  35.7, lng:  -81.4, type: "assembler",    key: false, location: "Hickory, NC" },
  { name: "AFL",                      lat:  34.9, lng:  -82.1, type: "assembler",    key: false, location: "Duncan, SC" },
  // ── Datacenter / end use ──
  { name: "Amazon",                   lat:  39.0, lng:  -77.5, type: "datacenter",   key: true,  location: "Ashburn, VA" },
  { name: "Microsoft",                lat:  47.6, lng: -122.3, type: "datacenter",   key: false, location: "Redmond, WA" },
  { name: "Google",                   lat:  41.3, lng:  -95.9, type: "datacenter",   key: false, location: "Council Bluffs, IA" },
  { name: "Meta",                     lat:  44.3, lng: -120.8, type: "datacenter",   key: false, location: "Prineville, OR" },
  { name: "Oracle",                   lat:  30.3, lng:  -97.7, type: "datacenter",   key: false, location: "Austin, TX" },
  { name: "xAI",                      lat:  35.1, lng:  -90.0, type: "datacenter",   key: false, location: "Memphis, TN" },
  { name: "Equinix",                  lat:  37.5, lng: -122.2, type: "datacenter",   key: false, location: "Redwood City, CA" },
  { name: "CoreWeave",                lat:  40.7, lng:  -74.2, type: "datacenter",   key: false, location: "Livingston, NJ" },
  { name: "Digital Realty",            lat:  30.3, lng:  -97.7, type: "datacenter",   key: false, location: "Austin, TX" },
  // ── Gallium bauxite sources ──
  { name: "Guinea Bauxite",           lat:  11.0, lng:  -12.0, type: "deposit",      key: false, location: "Boke, Guinea" },
  { name: "Australian Bauxite",       lat: -23.0, lng:  134.0, type: "deposit",      key: false, location: "Weipa, Australia" },
  { name: "Chinese Domestic Bauxite", lat:  34.0, lng:  108.0, type: "deposit",      key: false, location: "Shanxi, China" },
  { name: "Brazilian Bauxite",        lat:  -2.0, lng:  -55.0, type: "deposit",      key: false, location: "Para, Brazil" },
  { name: "Indonesian Bauxite",       lat:   0.5, lng:  104.0, type: "deposit",      key: false, location: "W. Kalimantan, Indonesia" },
  // ── Gallium refineries ──
  { name: "Chinese Bauxite Refineries", lat: 36.0, lng: 114.0, type: "refiner",      key: false, location: "Shandong, China" },
  { name: "Alcoa / JAGA (Wagerup)",   lat: -33.0, lng:  116.0, type: "refiner",      key: false, location: "Wagerup, Australia" },
  { name: "Metlen Energy & Metals",   lat:  38.0, lng:   23.7, type: "refiner",      key: false, location: "Greece" },
  { name: "Rio Tinto / Indium JV",    lat:  46.8, lng:  -71.2, type: "refiner",      key: false, location: "Quebec, Canada" },
  // ── Gallium refiners ──
  { name: "Dowa Holdings",            lat:  35.7, lng:  139.7, type: "refiner",      key: true,  location: "Tokyo, Japan" },
  { name: "Indium Corporation",       lat:  43.1, lng:  -75.2, type: "refiner",      key: false, location: "Clinton, NY" },
  { name: "Vital Materials",          lat:  28.2, lng:  113.0, type: "refiner",      key: false, location: "Guangzhou, China" },
  { name: "Zhuzhou Smelter Group",    lat:  27.8, lng:  113.1, type: "refiner",      key: false, location: "Hunan, China" },
  { name: "Korea Zinc / Crucible JV", lat:  36.5, lng:  -87.4, type: "refiner",      key: false, location: "Clarksville, TN" },
  { name: "Nyrstar Tennessee",        lat:  36.5, lng:  -87.3, type: "refiner",      key: false, location: "Clarksville, TN" },
  // ── Infrastructure ──
  { name: "Vertiv",                   lat:  40.0, lng:  -83.0, type: "assembler",    key: false, location: "Columbus, OH" },
  { name: "Schneider Electric",       lat:  48.9, lng:    2.2, type: "assembler",    key: false, location: "Rueil-Malmaison, France" },
];

const ARCS: [string, string][] = [
  // Germanium chain
  ["Red Dog", "Teck Resources"], ["Teck Resources", "5N Plus"], ["STL / Gécamines", "Umicore"],
  ["Huize", "Yunnan Chihong"], ["Spetsugli", "JSC Germanium"], ["Yunnan Chihong", "Yunnan Chihong Refinery"],
  ["Lincang", "Lincang Xinyuan"], ["Lincang Xinyuan", "Lincang Xinyuan Refinery"],
  // Fiber chain
  ["Umicore GeCl4", "Corning"], ["Umicore GeCl4", "Prysmian"], ["Yunnan Chihong GeCl4", "YOFC"],
  ["Corning", "Amazon"], ["Corning", "Meta"],
  ["YOFC", "Equinix"], ["Prysmian", "Microsoft"],
  ["Shin-Etsu", "Google"], ["Sumitomo Electric", "Oracle"],
  // Gallium chain
  ["Guinea Bauxite", "Chinese Bauxite Refineries"], ["Australian Bauxite", "Alcoa / JAGA (Wagerup)"],
  ["Chinese Bauxite Refineries", "Vital Materials"], ["Alcoa / JAGA (Wagerup)", "Dowa Holdings"],
  ["Metlen Energy & Metals", "Indium Corporation"],
];

/* ── Exported layer mapping for external use ── */
export { TYPE_DISPLAY, layerFromType };

export interface GlobeFilter {
  selectedLayers: Set<string>;
  activeSubType: string | null;
  activeSubParent: string | null;
}

export interface GlobeHandle {
  updateFilter: (filter: GlobeFilter) => void;
  highlightNode: (name: string | null) => void;
}

interface GlobeProps {
  style?: React.CSSProperties;
  onHoverNode?: (node: { name: string; type: string; location: string } | null) => void;
  onClickNode?: (name: string) => void;
}

const Globe = forwardRef<GlobeHandle, GlobeProps>(function Globe({ style, onHoverNode, onClickNode }, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<GlobeFilter>({ selectedLayers: new Set(), activeSubType: null, activeSubParent: null });
  const highlightRef = useRef<string | null>(null);
  const onClickNodeRef = useRef(onClickNode);
  onClickNodeRef.current = onClickNode;
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    updateFilter: (filter: GlobeFilter) => {
      filterRef.current = filter;
    },
    highlightNode: (name: string | null) => {
      highlightRef.current = name;
    },
  }));

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const mW = mount.clientWidth;
    const mH = mount.clientHeight;
    renderer.setSize(mW, mH);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, mW / mH, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const kl = new THREE.DirectionalLight(0xffffff, 1.8); kl.position.set(-3, 2.5, 2.5); scene.add(kl);
    const fl = new THREE.DirectionalLight(0xffffff, 0.5); fl.position.set(3, -2, 1);     scene.add(fl);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = 0.09;
    globeGroup.rotation.x = 0.35;
    scene.add(globeGroup);

    const sphereMat = new THREE.MeshPhongMaterial({ color: new THREE.Color("#C8BEA8"), specular: new THREE.Color("#222222"), shininess: 8 });
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
    const SHAPE_GEOS: Record<string, THREE.BufferGeometry> = {
      circle:   new THREE.SphereGeometry(S, 8, 8),
      diamond:  new THREE.PlaneGeometry(S * 1.4, S * 1.4),
      ring:     new THREE.RingGeometry(S * 0.42, S * 0.72, 16),
      square:   new THREE.PlaneGeometry(S * 1.1, S * 1.1),
      triangle: new THREE.CircleGeometry(S * 0.78, 3),
    };
    const ringGeo = new THREE.RingGeometry(DOT_SIZE * 1.3, DOT_SIZE * 2.2, 32);

    type NodeObj = { name: string; dot: THREE.Mesh; ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; normal: THREE.Vector3; pulseOffset: number; layer: string; nodeType: string; isKey: boolean; currentMult: number; currentScale: number; currentColor: THREE.Color; shape: string };
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
      nodeObjs.push({ name: n.name, dot, ring, ringMat, normal, pulseOffset: pOffset, layer, nodeType: n.type, isKey: n.key, currentMult: 1, currentScale: 1, currentColor, shape });
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

    const mouseScreen = { x: -999, y: -999 };
    let currentHoveredName: string | null = null;
    const tooltipPos = new THREE.Vector3(), tooltipProj = new THREE.Vector3();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom    = true;
    controls.enableRotate  = true;
    controls.enablePan     = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed   = 0.4;
    controls.zoomSpeed     = 0.5;
    controls.minDistance   = R * 1.3;
    controls.maxDistance   = R * 3.0;
    controls.autoRotate    = true;
    controls.autoRotateSpeed = 0.4;

    const onMouseMove  = (e: MouseEvent) => { mouseScreen.x = e.clientX; mouseScreen.y = e.clientY; };
    const onMouseLeave = () => { mouseScreen.x = -999; mouseScreen.y = -999; if (currentHoveredName !== null) { currentHoveredName = null; onHoverNode?.(null); } };
    mount.addEventListener("mousemove",  onMouseMove);
    mount.addEventListener("mouseleave", onMouseLeave);

    let clickDownPos = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => { clickDownPos = { x: e.clientX, y: e.clientY }; };
    const onClick = (e: MouseEvent) => {
      const dx = e.clientX - clickDownPos.x, dy = e.clientY - clickDownPos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        // If hovering a node, fire click callback
        if (currentHoveredName) {
          onClickNodeRef.current?.(currentHoveredName);
          controls.autoRotate = false;
          if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = setTimeout(() => { controls.autoRotate = true; pauseTimerRef.current = null; }, 15000);
        } else if (controls.autoRotate) {
          controls.autoRotate = false;
          if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = setTimeout(() => { controls.autoRotate = true; pauseTimerRef.current = null; }, 15000);
        } else {
          controls.autoRotate = true;
          if (pauseTimerRef.current) { clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
        }
      }
    };
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("click",       onClick);
    const onResize = () => { if (!mount) return; const w = mount.clientWidth; const h = mount.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock(), camDir = new THREE.Vector3(), worldNormal = new THREE.Vector3();
    const tmpColor = new THREE.Color();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const delta = clock.getDelta();
      controls.update();
      camDir.copy(camera.position).normalize();
      const t = clock.elapsedTime;
      const lerpK = Math.min(1, delta * 4.5);
      const { selectedLayers, activeSubType, activeSubParent } = filterRef.current;
      const hasSelection = selectedLayers.size > 0;
      const highlightedName = highlightRef.current;

      nodeObjs.forEach((no) => {
        let targetMult: number, targetScale: number, targetHex: number, ringEnabled: boolean;

        // Highlighted node always bright + pulsing
        if (highlightedName && no.name === highlightedName) {
          const lc = LAYER_COLOR_HEX[no.layer] ?? 0xffffff;
          targetMult = 1; targetScale = 1.8; targetHex = lc; ringEnabled = true;
        } else if (!hasSelection) {
          targetMult = highlightedName ? 0.3 : 1; targetScale = 1; targetHex = NEUTRAL_HEX; ringEnabled = false;
        } else if (selectedLayers.has(no.layer)) {
          const lc = LAYER_COLOR_HEX[no.layer];
          if (activeSubParent === no.layer && activeSubType) {
            if (no.nodeType === activeSubType) { targetMult = highlightedName ? 0.4 : 1; targetScale = 1; targetHex = lc; ringEnabled = !highlightedName; }
            else                               { targetMult = highlightedName ? 0.15 : 0.3; targetScale = 1; targetHex = lc; ringEnabled = false; }
          } else { targetMult = highlightedName ? 0.4 : 1; targetScale = 1; targetHex = lc; ringEnabled = !highlightedName && no.isKey; }
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
          no.ring.scale.setScalar(1 + w * 0.9); no.ringMat.color.copy(no.currentColor);
          no.ringMat.opacity = (1 - w) * 0.28 * base * no.currentMult;
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

      // Hover detection
      if (mouseScreen.x > -500) {
        let closest = -1, closestDist = 14, cSX = 0, cSY = 0;
        nodeObjs.forEach((no, idx) => {
          worldNormal.copy(no.normal).applyQuaternion(globeGroup.quaternion);
          if (worldNormal.dot(camDir) < 0 || no.currentMult < 0.3) return;
          tooltipPos.copy(no.dot.position).applyQuaternion(globeGroup.quaternion);
          tooltipProj.copy(tooltipPos).project(camera);
          const cw = mount?.clientWidth ?? window.innerWidth;
          const ch = mount?.clientHeight ?? window.innerHeight;
          const mountRect = mount?.getBoundingClientRect();
          const sx = (tooltipProj.x * 0.5 + 0.5) * cw + (mountRect?.left ?? 0);
          const sy = (-tooltipProj.y * 0.5 + 0.5) * ch + (mountRect?.top ?? 0);
          const d  = Math.sqrt((sx - mouseScreen.x) ** 2 + (sy - mouseScreen.y) ** 2);
          if (d < closestDist) { closestDist = d; closest = idx; cSX = sx; cSY = sy; }
        });
        const newName = closest >= 0 ? NODES[closest].name : null;
        if (newName !== currentHoveredName) {
          currentHoveredName = newName;
          if (closest >= 0) { const n = NODES[closest]; onHoverNode?.({ name: n.name, type: n.type, location: n.location }); }
          else onHoverNode?.(null);
          // Update tooltip inner
          const inner = document.getElementById("globe-tooltip-inner");
          if (inner) {
            if (closest >= 0) {
              const n = NODES[closest];
              const td = TYPE_DISPLAY[n.type];
              inner.style.display = "block";
              inner.innerHTML = `<div style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.7);margin-bottom:2px">${n.name}</div><div style="font-size:7px;color:${td?.color ?? '#888'};font-family:'Geist Mono',monospace;margin-bottom:1px">${td?.label ?? n.type}</div><div style="font-size:7px;color:rgba(255,255,255,0.25);font-family:'Geist Mono',monospace">${n.location}</div>`;
            } else {
              inner.style.display = "none";
            }
          }
        }
        if (closest >= 0 && tooltipRef.current) { tooltipRef.current.style.left = cSX + "px"; tooltipRef.current.style.top = cSY + "px"; }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId); window.removeEventListener("resize", onResize);
      controls.dispose();
      mount.removeEventListener("mousemove",   onMouseMove);
      mount.removeEventListener("mouseleave",  onMouseLeave);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("click",       onClick);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      Object.values(SHAPE_GEOS).forEach(g => g.dispose());
      renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />
      {/* Tooltip — positioned by the render loop */}
      <div ref={tooltipRef} style={{ position: "fixed", pointerEvents: "none", zIndex: 30, transform: "translate(-50%, -100%)", padding: "0 0 8px 0" }}>
        <div id="globe-tooltip-inner" style={{ display: "none", background: "rgba(20,20,18,0.92)", border: "0.5px solid rgba(255,255,255,0.08)", padding: "6px 10px", borderRadius: 4 }} />
      </div>
    </div>
  );
});

export default Globe;
