"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const R = 1;

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
    // FOV 46 + z=3.2 makes the globe slightly smaller than before
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    // ── Lights (only affect the ocean sphere — land uses MeshBasicMaterial) ───
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

    // ── Textured globe sphere ─────────────────────────────────────────────────
    const sphereMat = new THREE.MeshPhongMaterial({
      color:     new THREE.Color("#888885"), // multiplies with texture — ~half brightness
      specular:  new THREE.Color("#111111"),
      shininess: 5,
    });
    globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), sphereMat));

    new THREE.TextureLoader().load(
      "/earth-texture.jpg",
      (tex) => {
        console.log("Earth texture loaded:", tex.image.width, "×", tex.image.height);
        sphereMat.map = tex;
        sphereMat.needsUpdate = true;
      },
      undefined,
      (err) => console.error("Texture load error:", err),
    );


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
      else clock.getDelta();
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
