"use client";
import React, { useState } from "react";

const INTER = "Inter, -apple-system, sans-serif";
const MONO = "'Geist Mono', monospace";
const accent = "#c87a4a";

// Simple client-side access gate. Not real security — the app is a static
// export, so this only keeps casual visitors out of the demo.
const ACCESS_PASSWORD = "stillpointx1demo!";
export const ACCESS_STORAGE_KEY = "stillpoint-access";

export default function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ACCESS_PASSWORD) {
      try { sessionStorage.setItem(ACCESS_STORAGE_KEY, "1"); } catch {}
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#161414", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 14px 0" }}>Stillpoint Intelligence</p>
      <h1 style={{ fontFamily: INTER, fontSize: 22, fontWeight: 300, color: "#ece8e1", margin: "0 0 32px 0", letterSpacing: "0.01em" }}>Enter access password</h1>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 300 }}>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); if (error) setError(false); }}
          placeholder="Password"
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${error ? "rgba(200,74,74,0.6)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 8, padding: "11px 14px",
            color: "#ece8e1", fontFamily: MONO, fontSize: 13, outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={e => { if (!error) e.currentTarget.style.borderColor = "rgba(200,122,74,0.5)"; }}
          onBlur={e => { if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
        />
        <button
          type="submit"
          style={{
            width: "100%", cursor: "pointer",
            background: "rgba(200,122,74,0.08)", border: `1px solid rgba(200,122,74,0.4)`,
            borderRadius: 8, padding: "10px 14px",
            color: accent, fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,122,74,0.14)"; e.currentTarget.style.borderColor = "rgba(200,122,74,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,122,74,0.08)"; e.currentTarget.style.borderColor = "rgba(200,122,74,0.4)"; }}
        >
          Enter
        </button>
        <span style={{ height: 14, fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", color: error ? "rgba(220,120,110,0.9)" : "transparent" }}>
          Incorrect password
        </span>
      </form>
    </div>
  );
}
