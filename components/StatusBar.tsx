"use client";
import { useEffect, useState } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      setTime(d.toISOString().replace("T", " ").slice(0, 16) + " UTC");
    };
    fmt();
    const id = setInterval(fmt, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 28,
      background: "#111110",
      borderTop: "0.5px solid rgba(255,255,255,0.05)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px",
      zIndex: 100,
    }}>
      <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "5.5px", color: "rgba(255,255,255,0.1)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Stillpoint Intelligence · Proprietary
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        `}</style>
        <div style={{
          width: 3, height: 3, borderRadius: "50%", background: "#7DA06A",
          animation: "blink 2s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <span style={{ fontFamily: "'Geist Mono', 'Courier New', monospace", fontSize: "5.5px", color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
          System active · 28 nodes · Last sync {time}
        </span>
      </div>
    </div>
  );
}
