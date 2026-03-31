"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HomePage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    // ── Lights ────────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.28);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.52);
    dirLight.position.set(-3, 2, 2);
    scene.add(dirLight);

    // ── Globe radius (fills ~65% of viewport height) ──────────────────────────
    const R = 1;

    // ── Solid sphere ──────────────────────────────────────────────────────────
    const sphereGeo = new THREE.SphereGeometry(R, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#161614"),
      specular: new THREE.Color("#2a2a26"),
      shininess: 18,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // ── Lat/lon grid lines at very low opacity ────────────────────────────────
    const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.045 });

    // Latitude lines
    const LAT_STEPS = 18; // every 10°
    for (let i = 1; i < LAT_STEPS; i++) {
      const lat = (i / LAT_STEPS) * Math.PI - Math.PI / 2;
      const latR = Math.cos(lat) * R;
      const y = Math.sin(lat) * R;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const theta = (j / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * latR, y, Math.sin(theta) * latR));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
    }

    // Longitude lines
    const LON_STEPS = 24; // every 15°
    for (let i = 0; i < LON_STEPS; i++) {
      const lon = (i / LON_STEPS) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 128; j++) {
        const phi = (j / 128) * Math.PI - Math.PI / 2;
        points.push(new THREE.Vector3(
          Math.cos(phi) * Math.cos(lon) * R,
          Math.sin(phi) * R,
          Math.cos(phi) * Math.sin(lon) * R,
        ));
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
    }

    // ── Auto-rotation (1 full rotation / 90s) ────────────────────────────────
    const AUTO_SPEED = (2 * Math.PI) / 90;

    // ── Drag-to-rotate ────────────────────────────────────────────────────────
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      velX = 0;
      velY = 0;
      mount.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velX = dx * 0.005;
      velY = dy * 0.005;
      sphere.rotation.y += velX;
      sphere.rotation.x += velY;
      // Keep grid lines in sync
      scene.children.forEach(c => {
        if (c instanceof THREE.Line) {
          c.rotation.y = sphere.rotation.y;
          c.rotation.x = sphere.rotation.x;
        }
      });
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerUp = () => { isDragging = false; };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);

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
      const delta = clock.getDelta();

      if (!isDragging) {
        const autoRot = AUTO_SPEED * delta;
        sphere.rotation.y += autoRot;
        scene.children.forEach(c => {
          if (c instanceof THREE.Line) c.rotation.y = sphere.rotation.y;
        });
        // Dampen drag velocity
        velX *= 0.92;
        velY *= 0.92;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ background: "#0C0C0B", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* Header */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 40,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        zIndex: 10,
      }}>
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
          Stillpoint
        </span>
        <span style={{ width: 5, display: "inline-block" }} />
        <span style={{ fontFamily: "Inter, -apple-system, sans-serif", fontSize: 11, fontWeight: 200, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
          Intelligence
        </span>
      </div>

      {/* Globe canvas mount */}
      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0, cursor: "grab" }}
      />
    </div>
  );
}
