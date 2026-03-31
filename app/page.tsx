"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Feature, MultiPolygon, Polygon, Position } from "geojson";

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

// Fan-triangulate a ring from its sphere-surface centroid
function addFillRing(ring: Position[], buf: number[], r: number) {
  const pts = ring.map(([lon, lat]) => toVec3(lon, lat, r));
  const c   = new THREE.Vector3();
  pts.forEach(p => c.add(p));
  c.normalize().multiplyScalar(r);
  for (let i = 0; i < pts.length - 1; i++) {
    buf.push(c.x, c.y, c.z, pts[i].x, pts[i].y, pts[i].z, pts[i+1].x, pts[i+1].y, pts[i+1].z);
  }
}

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
    // Ambient keeps dark side visible without washing out the lit side
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    // Key — upper left, creates the main directional shading on the ocean sphere
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-3, 2.5, 2.5);
    scene.add(keyLight);
    // Fill — softens the terminator from the opposite side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(3, -2, 1);
    scene.add(fillLight);

    // ── Globe group ───────────────────────────────────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── Ocean sphere — MeshPhongMaterial, reacts to lights for dimensionality ─
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 72, 72),
      new THREE.MeshPhongMaterial({
        color:     new THREE.Color("#141413"),
        specular:  new THREE.Color("#2A2A28"),
        shininess: 18,
      }),
    ));

    // ── Land fills — MeshBasicMaterial: unlit, always bright regardless of
    //    light angle, giving hard contrast against the shaded ocean sphere ──────
    const landMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#4A4438") });

    // ── Auto-rotation ─────────────────────────────────────────────────────────
    const AUTO_SPEED = (2 * Math.PI) / 90;

    // ── Drag-to-rotate ────────────────────────────────────────────────────────
    let isDragging = false;
    let prevX = 0, prevY = 0;
    const onDown = (e: PointerEvent) => {
      isDragging = true; prevX = e.clientX; prevY = e.clientY;
      mount.setPointerCapture(e.pointerId);
    };
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
    const clock = new THREE.Clock();
    const tick = () => {
      animId = requestAnimationFrame(tick);
      if (!isDragging) globeGroup.rotation.y += AUTO_SPEED * clock.getDelta();
      else clock.getDelta();
      renderer.render(scene, camera);
    };
    tick();

    // ── Fetch GeoJSON → sharp-edged continent fills ───────────────────────────
    const LAND_R = R * 1.001;

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
      .then(res => res.json())
      .then((world: Topology) => {
        const raw = topojson.feature(
          world,
          (world.objects as Record<string, GeometryCollection>).land,
        );
        const features: Feature<MultiPolygon | Polygon>[] =
          raw.type === "FeatureCollection"
            ? (raw as FeatureCollection<MultiPolygon | Polygon>).features
            : [raw as unknown as Feature<MultiPolygon | Polygon>];

        const fillBuf: number[] = [];
        features.forEach(({ geometry: { type, coordinates } }) => {
          if (type === "Polygon") {
            (coordinates as Position[][]).forEach(ring => addFillRing(ring, fillBuf, LAND_R));
          } else if (type === "MultiPolygon") {
            (coordinates as Position[][][]).forEach(poly =>
              poly.forEach(ring => addFillRing(ring, fillBuf, LAND_R))
            );
          }
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(fillBuf, 3));
        globeGroup.add(new THREE.Mesh(geo, landMat));
      })
      .catch(console.error);

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
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 40, display: "flex", alignItems: "center",
        padding: "0 28px", zIndex: 10,
      }}>
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
