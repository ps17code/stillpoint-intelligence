"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as topojson from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Feature, MultiPolygon, Polygon, Position } from "geojson";

const R = 1;

// Lon/lat (degrees) → point on sphere surface
function toVec3(lon: number, lat: number, r = R): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  );
}

// Outline: line segments for a closed ring
function addOutlineRing(ring: Position[], buf: number[], r: number) {
  for (let i = 0; i < ring.length - 1; i++) {
    const a = toVec3(ring[i][0],   ring[i][1],   r);
    const b = toVec3(ring[i+1][0], ring[i+1][1], r);
    buf.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
}

// Fill: fan triangulation from centroid — no 2-D projection issues
function addFillRing(ring: Position[], buf: number[], r: number) {
  const pts = ring.map(([lon, lat]) => toVec3(lon, lat, r));
  const c   = new THREE.Vector3();
  pts.forEach(p => c.add(p));
  c.normalize().multiplyScalar(r);
  for (let i = 0; i < pts.length - 1; i++) {
    buf.push(c.x,        c.y,        c.z,
             pts[i].x,   pts[i].y,   pts[i].z,
             pts[i+1].x, pts[i+1].y, pts[i+1].z);
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
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.85);

    // ── Lights ────────────────────────────────────────────────────────────────
    // Ambient — pure white, enough to keep dark side readable
    scene.add(new THREE.AmbientLight(0xfffaf0, 0.45));

    // Key light — upper left, bright white
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(-3, 2.5, 2.5);
    scene.add(keyLight);

    // Soft fill from lower right — smooths the terminator
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.25);
    fillLight.position.set(3, -2, 1);
    scene.add(fillLight);

    // ── Globe group — everything rotates together ─────────────────────────────
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ── Ocean sphere ──────────────────────────────────────────────────────────
    globeGroup.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 72, 72),
      new THREE.MeshPhongMaterial({
        color:     new THREE.Color("#1A1A18"),
        specular:  new THREE.Color("#2E2E2A"),
        shininess: 18,
      }),
    ));

    // ── Land materials ────────────────────────────────────────────────────────
    const landMat = new THREE.MeshPhongMaterial({
      color:     new THREE.Color("#333330"),
      specular:  new THREE.Color("#3A3A36"),
      shininess: 8,
    });
    const outlineMat = new THREE.LineBasicMaterial({
      color:       0xffffff,
      transparent: true,
      opacity:     0.40,
    });

    // ── Auto-rotation: 1 rev / 90 s ───────────────────────────────────────────
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
      else clock.getDelta(); // consume delta so no jump on release
      renderer.render(scene, camera);
    };
    tick();

    // ── Fetch & build land geometry ───────────────────────────────────────────
    const LAND_R    = R * 1.001;   // slightly above ocean sphere
    const OUTLINE_R = R * 1.0018;  // slightly above land fill

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
      .then(res => res.json())
      .then((world: Topology) => {
        const raw = topojson.feature(
          world,
          (world.objects as Record<string, GeometryCollection>).land,
        );

        // topojson may return a Feature (single) or FeatureCollection
        const features: Feature<MultiPolygon | Polygon>[] =
          raw.type === "FeatureCollection"
            ? (raw as FeatureCollection<MultiPolygon | Polygon>).features
            : [raw as unknown as Feature<MultiPolygon | Polygon>];

        const fillBuf: number[]    = [];
        const outlineBuf: number[] = [];

        const processRings = (rings: Position[][]) => {
          rings.forEach(ring => {
            addFillRing(ring,    fillBuf,    LAND_R);
            addOutlineRing(ring, outlineBuf, OUTLINE_R);
          });
        };

        features.forEach(({ geometry: { type, coordinates } }) => {
          if      (type === "Polygon")      processRings(coordinates as Position[][]);
          else if (type === "MultiPolygon") (coordinates as Position[][][]).forEach(processRings);
        });

        // Land fill mesh
        const fillGeo = new THREE.BufferGeometry();
        fillGeo.setAttribute("position", new THREE.Float32BufferAttribute(fillBuf, 3));
        fillGeo.computeVertexNormals();
        globeGroup.add(new THREE.Mesh(fillGeo, landMat));

        // Continent outlines
        const outlineGeo = new THREE.BufferGeometry();
        outlineGeo.setAttribute("position", new THREE.Float32BufferAttribute(outlineBuf, 3));
        globeGroup.add(new THREE.LineSegments(outlineGeo, outlineMat));
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
