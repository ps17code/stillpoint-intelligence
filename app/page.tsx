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
  deposit: 0xB8975A,
  miner:   0x7DA06A,
  refiner: 0xA07DAA,
};

const NODES = [
  { name: "Red Dog",         lat:  68.0, lng: -163.0, type: "deposit", key: true  },
  { name: "Lincang",         lat:  23.9, lng:  100.1, type: "deposit", key: false },
  { name: "Wulantuga",       lat:  44.5, lng:  116.8, type: "deposit", key: false },
  { name: "Yimin",           lat:  48.5, lng:  119.8, type: "deposit", key: false },
  { name: "Huize",           lat:  26.4, lng:  103.3, type: "deposit", key: true  },
  { name: "Yiliang",         lat:  24.9, lng:  104.1, type: "deposit", key: false },
  { name: "Spetsugli",       lat:  47.3, lng:  134.2, type: "deposit", key: false },
  { name: "Big Hill",        lat: -11.7, lng:   27.5, type: "deposit", key: false },
  { name: "Lincang Xinyuan", lat:  24.0, lng:  100.2, type: "miner",   key: false },
  { name: "Shengli Coal",    lat:  44.0, lng:  116.5, type: "miner",   key: false },
  { name: "Yunnan Chihong",  lat:  25.5, lng:  103.8, type: "miner",   key: false },
  { name: "STL DRC",         lat: -11.7, lng:   27.6, type: "miner",   key: true  },
  { name: "Teck Resources",  lat:  49.1, lng: -117.7, type: "miner",   key: false },
  { name: "5N Plus",         lat:  37.1, lng: -113.6, type: "refiner", key: false },
  { name: "Trail",           lat:  49.1, lng: -117.8, type: "refiner", key: false },
  { name: "Umicore",         lat:  51.2, lng:    4.9, type: "refiner", key: true  },
  { name: "PPM",             lat:  50.9, lng:    6.9, type: "refiner", key: false },
  { name: "JSC Germanium",   lat:  56.0, lng:   93.0, type: "refiner", key: false },
];

// Arcs: [from-name, to-name]
const ARCS: [string, string][] = [
  ["Red Dog",       "Trail"],
  ["Trail",         "5N Plus"],
  ["STL DRC",       "Umicore"],
  ["Huize",         "Yunnan Chihong"],
  ["Spetsugli",     "JSC Germanium"],
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
    const NODE_R    = R * 1.012; // sit above surface
    const DOT_SIZE  = 0.012;
    const dotGeo    = new THREE.SphereGeometry(DOT_SIZE, 8, 8);

    type NodeObj = {
      dot:      THREE.Mesh;
      ring:     THREE.Mesh | null;
      ringMat:  THREE.MeshBasicMaterial | null;
      normal:   THREE.Vector3; // unit outward direction in local space
      offset:   number;        // pulse animation offset (seconds)
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
        // Orient ring to face outward from globe center
        ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
        globeGroup.add(ring);
        pulseOffset += 0.8;
      }

      nodeObjs.push({ dot, ring, ringMat, normal, offset: n.key ? pulseOffset : 0 });
    });

    // ── Connection arcs ───────────────────────────────────────────────────────
    const nodeByName = Object.fromEntries(NODES.map(n => [n.name, n]));

    // Arc lines stored for back-face visibility updates
    type ArcObj = { line: THREE.Line; lineMat: THREE.LineBasicMaterial; nA: THREE.Vector3; nB: THREE.Vector3 };
    const arcObjs: ArcObj[] = [];

    ARCS.forEach(([fromName, toName]) => {
      const a = nodeByName[fromName];
      const b = nodeByName[toName];
      if (!a || !b) return;

      const pA     = toVec3(a.lng, a.lat, NODE_R);
      const pB     = toVec3(b.lng, b.lat, NODE_R);
      const mid    = pA.clone().add(pB).multiplyScalar(0.5);
      const lift   = mid.length();
      const midOut = mid.normalize().multiplyScalar(lift + 0.55); // arc peak height

      const curve  = new THREE.QuadraticBezierCurve3(pA, midOut, pB);
      const pts    = curve.getPoints(60);
      const geo    = new THREE.BufferGeometry().setFromPoints(pts);
      const color  = NODE_COLOR[a.type];
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.22 });
      const line   = new THREE.Line(geo, lineMat);
      globeGroup.add(line);

      arcObjs.push({ line, lineMat, nA: pA.clone().normalize(), nB: pB.clone().normalize() });
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
    const clock  = new THREE.Clock();
    // World-space direction from globe toward camera (camera is always at +Z)
    const camDir = new THREE.Vector3(0, 0, 1);
    // Temp vector for transforming local normals to world space
    const worldNormal = new THREE.Vector3();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const delta = isDragging ? (clock.getDelta(), 0) : clock.getDelta();
      if (!isDragging) globeGroup.rotation.y += AUTO_SPEED * delta;

      const t = clock.elapsedTime;

      // Per-node: back-face hiding + pulse rings
      nodeObjs.forEach(({ dot, ring, ringMat, normal, offset }, i) => {
        // Transform local normal to world space
        worldNormal.copy(normal).applyQuaternion(globeGroup.quaternion);
        const facing = worldNormal.dot(camDir); // +1 = fully facing, -1 = fully back

        // Dot: fade near limb, hide on back
        const dotMat = dot.material as THREE.MeshBasicMaterial;
        if (facing < -0.1) {
          dotMat.opacity = 0;
        } else {
          dotMat.opacity = Math.min(1, (facing + 0.1) / 0.3);
        }

        // Ring pulse
        if (ring && ringMat) {
          if (facing < -0.1) {
            ringMat.opacity = 0;
          } else {
            const wave  = (Math.sin((t * 0.9 + offset * 0.8) * Math.PI * 2 * 0.28) + 1) / 2;
            const scale = 1.0 + wave * 1.6;
            ring.scale.setScalar(scale);
            ringMat.opacity = (1 - wave) * 0.35 * Math.min(1, (facing + 0.1) / 0.3);
          }
        }

        void i;
      });

      // Arc: fade when both endpoints face away
      arcObjs.forEach(({ lineMat, nA, nB }) => {
        const fA = worldNormal.copy(nA).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const fB = worldNormal.copy(nB).applyQuaternion(globeGroup.quaternion).dot(camDir);
        const visibility = Math.max(0, Math.min(fA, fB));
        lineMat.opacity = visibility * 0.22;
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
