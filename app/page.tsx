"use client";

import { useEffect, useRef } from "react";
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

// ── Node data ────────────────────────────────────────────────────────────────
const NODE_COLOR: Record<string, number> = {
  // Raw material
  deposit:     0xB8975A,
  miner:       0x7DA06A,
  refiner:     0xA07DAA,
  // Component
  converter:   0x6A8BBF,
  manufacturer:0x6A8BBF,
  // Subsystem
  assembler:   0x5A9E8F,
  recycler:    0x5A9E8F,
  // End use
  datacenter:  0xC8B88A,
  telecom:     0xC8B88A,
};

const NODES = [
  // ── Raw material: Deposits ─────────────────────────────────────────────────
  { name: "Red Dog",                   lat:  68.0, lng: -163.0, type: "deposit",      key: true  },
  { name: "Lincang",                   lat:  23.9, lng:  100.1, type: "deposit",      key: false },
  { name: "Wulantuga",                 lat:  44.5, lng:  116.8, type: "deposit",      key: false },
  { name: "Yimin",                     lat:  48.5, lng:  119.8, type: "deposit",      key: false },
  { name: "Huize",                     lat:  26.4, lng:  103.3, type: "deposit",      key: true  },
  { name: "Yiliang",                   lat:  24.9, lng:  104.1, type: "deposit",      key: false },
  { name: "Spetsugli",                 lat:  47.3, lng:  134.2, type: "deposit",      key: false },
  { name: "Big Hill DRC",              lat: -11.7, lng:   27.5, type: "deposit",      key: false },
  // ── Raw material: Miners ───────────────────────────────────────────────────
  { name: "Lincang Xinyuan",           lat:  24.0, lng:  100.2, type: "miner",        key: false },
  { name: "Shengli Coal",              lat:  44.0, lng:  116.5, type: "miner",        key: false },
  { name: "Yunnan Chihong",            lat:  25.5, lng:  103.8, type: "miner",        key: false },
  { name: "STL DRC",                   lat: -11.7, lng:   27.6, type: "miner",        key: true  },
  { name: "Teck Resources",            lat:  49.1, lng: -117.7, type: "miner",        key: false },
  { name: "Various State Ops",         lat:  39.9, lng:  116.4, type: "miner",        key: false },
  // ── Raw material: Refiners & Recyclers ─────────────────────────────────────
  { name: "Umicore",                   lat:  51.2, lng:    4.9, type: "refiner",      key: true  },
  { name: "5N Plus",                   lat:  37.1, lng: -113.6, type: "refiner",      key: false },
  { name: "Trail Smelter",             lat:  49.1, lng: -117.8, type: "refiner",      key: false },
  { name: "PPM Pure Metals",           lat:  50.9, lng:    6.9, type: "refiner",      key: false },
  { name: "JSC Germanium",             lat:  56.0, lng:   93.0, type: "refiner",      key: false },
  { name: "Lincang Xinyuan Refinery",  lat:  23.8, lng:  100.0, type: "refiner",      key: false },
  { name: "Yunnan Chihong Refinery",   lat:  25.6, lng:  103.9, type: "refiner",      key: false },
  { name: "Smaller Chinese Refiners",  lat:  30.6, lng:  114.3, type: "refiner",      key: false },
  // ── Component: GeCl4 / GeO2 producers & preform manufacturers ──────────────
  { name: "Umicore GeCl4",             lat:  51.2, lng:    5.0, type: "converter",    key: true  },
  { name: "Yunnan Chihong GeCl4",      lat:  25.5, lng:  104.0, type: "converter",    key: false },
  { name: "Nanjing Germanium",         lat:  31.8, lng:  118.8, type: "converter",    key: false },
  { name: "Corning Preform",           lat:  35.8, lng:  -81.3, type: "manufacturer", key: true  },
  { name: "YOFC",                      lat:  30.6, lng:  114.3, type: "manufacturer", key: false },
  { name: "Shin-Etsu Kashima",         lat:  35.9, lng:  140.7, type: "manufacturer", key: false },
  { name: "Shin-Etsu YOFC Hubei",      lat:  30.3, lng:  112.2, type: "manufacturer", key: false },
  { name: "Prysmian Preform NA",       lat:  35.2, lng:  -80.8, type: "manufacturer", key: false },
  { name: "Sumitomo Electric",         lat:  34.7, lng:  135.5, type: "manufacturer", key: false },
  // ── Subsystem: Fiber cable manufacturers & IR optics ───────────────────────
  { name: "Corning Fiber Concord",     lat:  35.4, lng:  -80.6, type: "assembler",    key: true  },
  { name: "Corning Hickory",           lat:  35.7, lng:  -81.3, type: "assembler",    key: false },
  { name: "Prysmian Milan",            lat:  45.5, lng:    9.2, type: "assembler",    key: false },
  { name: "Prysmian Eindhoven",        lat:  51.4, lng:    5.5, type: "assembler",    key: false },
  { name: "YOFC Wuhan Cable",          lat:  30.6, lng:  114.4, type: "assembler",    key: false },
  { name: "Sumitomo Cable",            lat:  34.7, lng:  135.5, type: "assembler",    key: false },
  { name: "LightPath Orlando",         lat:  28.5, lng:  -81.4, type: "assembler",    key: false },
  { name: "Novotech Chatsworth",       lat:  34.3, lng: -118.6, type: "recycler",     key: false },
  // ── End use: AI datacenters, telecom, defense ──────────────────────────────
  { name: "AWS us-east-1",             lat:  39.0, lng:  -77.5, type: "datacenter",   key: true  },
  { name: "Azure West Europe",         lat:  52.4, lng:    4.9, type: "datacenter",   key: false },
  { name: "Google us-central",         lat:  41.3, lng:  -95.9, type: "datacenter",   key: false },
  { name: "Meta Prineville",           lat:  44.3, lng: -120.8, type: "datacenter",   key: false },
  { name: "Microsoft Quincy",          lat:  47.2, lng: -119.9, type: "datacenter",   key: false },
  { name: "Oracle Austin",             lat:  30.3, lng:  -97.7, type: "datacenter",   key: false },
  { name: "Equinix Tokyo",             lat:  35.7, lng:  139.8, type: "datacenter",   key: false },
  { name: "BEAD Rural Deploy",         lat:  38.0, lng:  -97.0, type: "telecom",      key: false },
];

// Arcs: [from-name, to-name]
const ARCS: [string, string][] = [
  // Raw material flows
  ["Red Dog",               "Trail Smelter"],
  ["Trail Smelter",         "5N Plus"],
  ["STL DRC",               "Umicore"],
  ["Huize",                 "Yunnan Chihong"],
  ["Spetsugli",             "JSC Germanium"],
  ["Yunnan Chihong",        "Yunnan Chihong Refinery"],
  // Raw → Component flows
  ["Umicore GeCl4",         "Corning Preform"],
  ["Umicore GeCl4",         "Prysmian Preform NA"],
  ["Yunnan Chihong GeCl4",  "YOFC"],
  // Component → Subsystem flows
  ["Corning Preform",       "Corning Fiber Concord"],
  ["Corning Preform",       "Corning Hickory"],
  ["YOFC",                  "YOFC Wuhan Cable"],
  ["Prysmian Preform NA",   "Prysmian Milan"],
  // Subsystem → End use flows
  ["Corning Fiber Concord", "AWS us-east-1"],
  ["Corning Hickory",       "Meta Prineville"],
  ["Prysmian Milan",        "Azure West Europe"],
  ["YOFC Wuhan Cable",      "Equinix Tokyo"],
];

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(-3, 2.5, 2.5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(3, -2, 1);
    scene.add(fillLight);

    // ── Globe group ───────────────────────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── Textured sphere ───────────────────────────────────────────────────────
    const sphereMat = new THREE.MeshPhongMaterial({
      color:     new THREE.Color("#B0A490"),
      specular:  new THREE.Color("#111111"),
      shininess: 5,
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), sphereMat));
    new THREE.TextureLoader().load("/earth-topology.png", (tex) => {
      sphereMat.map = tex; sphereMat.needsUpdate = true;
    });

    // ── Country outlines ──────────────────────────────────────────────────────
    const OUTLINE_R = R * 1.001;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(res => res.json())
      .then((world: Topology) => {
        const borders = topojson.mesh(world, (world.objects as Record<string, GeometryCollection>).countries);
        const buf: number[] = [];
        borders.coordinates.forEach(line => {
          for (let i = 0; i < line.length - 1; i++) {
            const a = toVec3(line[i][0], line[i][1], OUTLINE_R);
            const b = toVec3(line[i+1][0], line[i+1][1], OUTLINE_R);
            buf.push(a.x, a.y, a.z, b.x, b.y, b.z);
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(buf, 3));
        globeGroup.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })));
      }).catch(console.error);

    // ── Supply chain nodes ────────────────────────────────────────────────────
    const NODE_R   = R * 1.012; // sit above surface
    const DOT_SIZE = 0.008;
    const dotGeo   = new THREE.SphereGeometry(DOT_SIZE, 8, 8);

    type NodeObj = {
      dot:     THREE.Mesh;
      ring:    THREE.Mesh | null;
      ringMat: THREE.MeshBasicMaterial | null;
      normal:  THREE.Vector3;
      offset:  number;
    };

    const nodeObjs: NodeObj[] = [];
    let pulseOffset = 0;

    NODES.forEach(n => {
      const color  = NODE_COLOR[n.type];
      const pos    = toVec3(n.lng, n.lat, NODE_R);
      const normal = pos.clone().normalize();

      // Dot
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }));
      dot.position.copy(pos);
      globeGroup.add(dot);

      // Pulse ring (key nodes only)
      let ring: THREE.Mesh | null = null;
      let ringMat: THREE.MeshBasicMaterial | null = null;
      if (n.key) {
        const RING_INNER = DOT_SIZE * 1.5;
        const RING_OUTER = DOT_SIZE * 4.5;
        ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide });
        ring    = new THREE.Mesh(new THREE.RingGeometry(RING_INNER, RING_OUTER, 32), ringMat);
        ring.position.copy(pos);
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        globeGroup.add(ring);
        pulseOffset += 0.8;
      }

      nodeObjs.push({ dot, ring, ringMat, normal, offset: n.key ? pulseOffset : 0 });
    });

    // ── Connection arcs ───────────────────────────────────────────────────────
    const nodeByName = Object.fromEntries(NODES.map(n => [n.name, n]));

    type ArcObj = {
      lineMat:     THREE.LineBasicMaterial;
      nA:          THREE.Vector3;
      nB:          THREE.Vector3;
      curve:       THREE.QuadraticBezierCurve3;
      traveler:    THREE.Mesh;
      travelerMat: THREE.MeshBasicMaterial;
      speed:       number;
      tOffset:     number;
    };
    const arcObjs: ArcObj[] = [];

    const travelerGeo = new THREE.SphereGeometry(DOT_SIZE * 0.65, 6, 6);

    ARCS.forEach(([fromName, toName], idx) => {
      const a = nodeByName[fromName];
      const b = nodeByName[toName];
      if (!a || !b) return;

      const pA     = toVec3(a.lng, a.lat, NODE_R);
      const pB     = toVec3(b.lng, b.lat, NODE_R);
      const mid    = pA.clone().add(pB).multiplyScalar(0.5);
      const lift   = mid.length();
      const midOut = mid.normalize().multiplyScalar(lift + 0.55);

      const curve   = new THREE.QuadraticBezierCurve3(pA, midOut, pB);
      const pts     = curve.getPoints(60);
      const geo     = new THREE.BufferGeometry().setFromPoints(pts);
      const color   = NODE_COLOR[a.type];
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.14 });
      globeGroup.add(new THREE.Line(geo, lineMat));

      // Traveling dot
      const travelerMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 });
      const traveler    = new THREE.Mesh(travelerGeo, travelerMat);
      traveler.position.copy(curve.getPoint(0));
      globeGroup.add(traveler);

      arcObjs.push({
        lineMat,
        nA: pA.clone().normalize(),
        nB: pB.clone().normalize(),
        curve,
        traveler,
        travelerMat,
        speed:   0.08 + (idx % 5) * 0.012,   // 0.08 – 0.128, varied per arc
        tOffset: (idx * 0.37) % 1,            // staggered start positions
      });
    });

    // ── Auto-rotation ─────────────────────────────────────────────────────────
    const AUTO_SPEED = (2 * Math.PI) / 90;

    // ── Drag-to-rotate ────────────────────────────────────────────────────────
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const onDown = (e: PointerEvent) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; mount.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!isDragging) return;
      globeGroup.rotation.y += (e.clientX - prevX) * 0.005;
      globeGroup.rotation.x += (e.clientY - prevY) * 0.005;
      prevX = e.clientX; prevY = e.clientY;
    };
    const onUp = () => { isDragging = false; };
    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup",   onUp);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Render loop ───────────────────────────────────────────────────────────
    let animId: number;
    const clock       = new THREE.Clock();
    const camDir      = new THREE.Vector3(0, 0, 1);
    const worldNormal = new THREE.Vector3();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const delta = isDragging ? (clock.getDelta(), 0) : clock.getDelta();
      if (!isDragging) globeGroup.rotation.y += AUTO_SPEED * delta;

      const t = clock.elapsedTime;

      // Per-node: back-face hiding + pulse rings
      nodeObjs.forEach(({ dot, ring, ringMat, normal, offset }) => {
        worldNormal.copy(normal).applyQuaternion(globeGroup.quaternion);
        const facing = worldNormal.dot(camDir);

        const dotMat = dot.material as THREE.MeshBasicMaterial;
        dotMat.opacity = facing < -0.1 ? 0 : Math.min(1, (facing + 0.1) / 0.3);

        if (ring && ringMat) {
          if (facing < -0.1) {
            ringMat.opacity = 0;
          } else {
            const wave = (Math.sin((t * 0.9 + offset * 0.8) * Math.PI * 2 * 0.28) + 1) / 2;
            ring.scale.setScalar(1.0 + wave * 1.6);
            ringMat.opacity = (1 - wave) * 0.35 * Math.min(1, (facing + 0.1) / 0.3);
          }
        }
      });

      // Arc: fade with back-face visibility + animate traveling dot
      arcObjs.forEach(({ lineMat, nA, nB, curve, traveler, travelerMat, speed, tOffset }) => {
        const fA = worldNormal.copy(nA).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const fB = worldNormal.copy(nB).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const visibility = Math.max(0, Math.min(fA, fB));
        lineMat.opacity = visibility * 0.14;

        // Advance traveler along curve
        const progress = ((t * speed + tOffset) % 1 + 1) % 1;
        const pos = curve.getPoint(progress);
        traveler.position.copy(pos);

        // Back-face hide the traveler using its current surface normal
        worldNormal.copy(pos).normalize().applyQuaternion(globeGroup.quaternion);
        const travFacing = worldNormal.dot(camDir);
        travelerMat.opacity = travFacing < -0.1
          ? 0
          : Math.min(1, (travFacing + 0.1) / 0.3) * 0.85;
      });

      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup",   onUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ background: "#0C0C0B", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, display: "flex", alignItems: "center", padding: "0 28px", zIndex: 10 }}>
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
          Stillpoint
        </span>
        <span style={{ width: 5, display: "inline-block" }} />
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
          Intelligence
        </span>
      </div>
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />
    </div>
  );
}
