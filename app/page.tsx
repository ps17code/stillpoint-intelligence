"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";

const R = 1; // globe radius

// Convert geographic coordinates (degrees) → 3D point on sphere surface
function toVec3(lon: number, lat: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

// Build a flat Float32Array of line-segment pairs from a GeoJSON ring
function addRing(ring: Position[], positions: number[], r: number) {
  for (let i = 0; i < ring.length - 1; i++) {
    const a = toVec3(ring[i][0],   ring[i][1],   r);
    const b = toVec3(ring[i+1][0], ring[i+1][1], r);
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
}

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.85);

    // ── Lights ────────────────────────────────────────────────────────────────
    // Soft ambient
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    // Main key light — upper left, front
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.72);
    keyLight.position.set(-3, 2.5, 2);
    scene.add(keyLight);

    // Rim light — behind the globe, creates edge glow against the dark bg
    const rimLight = new THREE.DirectionalLight(0x8899cc, 0.32);
    rimLight.position.set(1.5, -0.5, -4);
    scene.add(rimLight);

    // Secondary fill — very dim, bottom right
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.12);
    fillLight.position.set(3, -2, 1);
    scene.add(fillLight);

    // ── Globe group — all rotating parts go here ──────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── Solid sphere ──────────────────────────────────────────────────────────
    const sphereMat = new THREE.MeshPhongMaterial({
      color:    new THREE.Color("#1E1E1C"),
      specular: new THREE.Color("#303030"),
      shininess: 22,
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), sphereMat));

    // ── Auto-rotation ─────────────────────────────────────────────────────────
    const AUTO_SPEED = (2 * Math.PI) / 90; // 1 rev / 90 s

    // ── Drag-to-rotate ────────────────────────────────────────────────────────
    let isDragging = false;
    let prevX = 0, prevY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      mount.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      globeGroup.rotation.y += (e.clientX - prevX) * 0.005;
      globeGroup.rotation.x += (e.clientY - prevY) * 0.005;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => { isDragging = false; };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup",   onPointerUp);

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
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) globeGroup.rotation.y += AUTO_SPEED * clock.getDelta();
      else clock.getDelta(); // consume delta to avoid jump on release
      renderer.render(scene, camera);
    };
    animate();

    // ── Load continent outlines from TopoJSON ─────────────────────────────────
    const OUTLINE_R = R * 1.0015; // fractionally above sphere surface

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
      .then(r => r.json())
      .then((world: Topology) => {
        const land = topojson.feature(
          world,
          (world.objects as Record<string, GeometryCollection>).land,
        ) as unknown as FeatureCollection<MultiPolygon | Polygon>;

        const positions: number[] = [];

        land.features.forEach(feat => {
          const { type, coordinates } = feat.geometry;
          if (type === "Polygon") {
            coordinates.forEach(ring => addRing(ring, positions, OUTLINE_R));
          } else if (type === "MultiPolygon") {
            coordinates.forEach(poly =>
              poly.forEach(ring => addRing(ring, positions, OUTLINE_R))
            );
          }
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

        const mat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.10,
        });

        globeGroup.add(new THREE.LineSegments(geo, mat));
      })
      .catch(console.error);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup",   onPointerUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ background: "#0C0C0B", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Header */}
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

      {/* Globe canvas */}
      <div ref={mountRef} style={{ position: "absolute", inset: 0, cursor: "grab" }} />
    </div>
  );
}
