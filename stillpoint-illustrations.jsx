export default function SupplyChainIllustrations() {
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#111",
      fontFamily: "'DM Sans', sans-serif",
      padding: "48px 32px",
      display: "flex",
      flexDirection: "column",
      gap: "64px",
      alignItems: "center",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#4a4540", textTransform: "uppercase", margin: 0 }}>
        ILLUSTRATIONS
      </p>

      {/* Connectivity — parallel fiber strands with light pulses traveling between endpoints */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontSize: "11px", color: "#706a60", margin: 0 }}>Connectivity</p>
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
          {/* Left endpoint — server rack */}
          <rect x="20" y="100" width="40" height="120" rx="3" stroke="#3a3530" strokeWidth="0.75" />
          <line x1="28" y1="116" x2="52" y2="116" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="128" x2="52" y2="128" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="140" x2="52" y2="140" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="152" x2="52" y2="152" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="164" x2="52" y2="164" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="176" x2="52" y2="176" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="188" x2="52" y2="188" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="28" y1="200" x2="52" y2="200" stroke="#3a3530" strokeWidth="0.5" />
          {/* Status LEDs */}
          <circle cx="54" cy="116" r="1.5" fill="#a05a4a" opacity="0.6" />
          <circle cx="54" cy="128" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="54" cy="140" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="54" cy="152" r="1.5" fill="#a05a4a" opacity="0.6" />
          <circle cx="54" cy="164" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="54" cy="176" r="1.5" fill="#9a8540" opacity="0.6" />
          <circle cx="54" cy="188" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="54" cy="200" r="1.5" fill="#4a8a55" opacity="0.6" />

          {/* Right endpoint — server rack */}
          <rect x="220" y="100" width="40" height="120" rx="3" stroke="#3a3530" strokeWidth="0.75" />
          <line x1="228" y1="116" x2="252" y2="116" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="128" x2="252" y2="128" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="140" x2="252" y2="140" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="152" x2="252" y2="152" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="164" x2="252" y2="164" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="176" x2="252" y2="176" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="188" x2="252" y2="188" stroke="#3a3530" strokeWidth="0.5" />
          <line x1="228" y1="200" x2="252" y2="200" stroke="#3a3530" strokeWidth="0.5" />
          <circle cx="226" cy="116" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="226" cy="128" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="226" cy="140" r="1.5" fill="#a05a4a" opacity="0.6" />
          <circle cx="226" cy="152" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="226" cy="164" r="1.5" fill="#9a8540" opacity="0.6" />
          <circle cx="226" cy="176" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="226" cy="188" r="1.5" fill="#4a8a55" opacity="0.6" />
          <circle cx="226" cy="200" r="1.5" fill="#4a8a55" opacity="0.6" />

          {/* Fiber strands — 6 parallel paths with gentle curves */}
          <path d="M60 130 C100 130, 100 125, 140 125 C180 125, 180 130, 220 130" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M60 142 C95 142, 105 138, 140 138 C175 138, 185 142, 220 142" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M60 154 C100 154, 100 150, 140 150 C180 150, 180 154, 220 154" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M60 166 C95 166, 105 162, 140 162 C175 162, 185 166, 220 166" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M60 178 C100 178, 100 174, 140 174 C180 174, 180 178, 220 178" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M60 190 C95 190, 105 186, 140 186 C175 186, 185 190, 220 190" stroke="#4a4540" strokeWidth="0.5" />

          {/* Light pulses — small bright dots traveling along strands */}
          <circle cx="95" cy="129" r="2" fill="#c9a84c" opacity="0.4">
            <animate attributeName="cx" values="60;220" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="140" r="2" fill="#c9a84c" opacity="0.3">
            <animate attributeName="cx" values="220;60" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="110" cy="152" r="2" fill="#c9a84c" opacity="0.35">
            <animate attributeName="cx" values="60;220" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="164" r="2" fill="#c9a84c" opacity="0.3">
            <animate attributeName="cx" values="220;60" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="176" r="2" fill="#c9a84c" opacity="0.4">
            <animate attributeName="cx" values="60;220" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Transceiver modules at each end */}
          <rect x="56" y="124" width="8" height="72" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <rect x="216" y="124" width="8" height="72" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />

          {/* Cable bundle indication at center */}
          <ellipse cx="140" cy="156" rx="12" ry="24" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 3" fill="none" />
        </svg>
      </div>

      {/* Fiber optic cable — cross-section showing core, cladding, coating, buffer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontSize: "11px", color: "#706a60", margin: 0 }}>Fiber optic cable</p>
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
          {/* Outer jacket — cable cross-section */}
          <circle cx="140" cy="140" r="90" stroke="#3a3530" strokeWidth="0.75" fill="none" />
          
          {/* Strength members */}
          <circle cx="140" cy="140" r="75" stroke="#2a2520" strokeWidth="0.5" strokeDasharray="3 6" fill="none" />
          
          {/* Buffer tubes — 6 arranged in a ring */}
          <circle cx="140" cy="80" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <circle cx="192" cy="110" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <circle cx="192" cy="170" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <circle cx="140" cy="200" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <circle cx="88" cy="170" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <circle cx="88" cy="110" r="16" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />

          {/* Individual fibers inside each buffer tube — tiny dots */}
          {/* Tube 1 (top) */}
          <circle cx="134" cy="76" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="140" cy="76" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="146" cy="76" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="134" cy="82" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="140" cy="82" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="146" cy="82" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          {/* Ge-doped core highlight in one fiber */}
          <circle cx="140" cy="76" r="0.8" fill="#c9a84c" opacity="0.6" />
          <circle cx="134" cy="82" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Tube 2 (top-right) */}
          <circle cx="186" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="192" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="198" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="186" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="192" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="198" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="192" cy="106" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Tube 3 (bottom-right) */}
          <circle cx="186" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="192" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="198" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="186" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="192" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="198" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="198" cy="172" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Tube 4 (bottom) */}
          <circle cx="134" cy="196" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="140" cy="196" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="146" cy="196" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="134" cy="202" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="140" cy="202" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="146" cy="202" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="140" cy="196" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Tube 5 (bottom-left) */}
          <circle cx="82" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="88" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="94" cy="166" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="82" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="88" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="94" cy="172" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="88" cy="166" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Tube 6 (top-left) */}
          <circle cx="82" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="88" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="94" cy="106" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="82" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="88" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="94" cy="112" r="2" stroke="#555" strokeWidth="0.3" fill="none" />
          <circle cx="82" cy="112" r="0.8" fill="#c9a84c" opacity="0.6" />

          {/* Central strength member */}
          <circle cx="140" cy="140" r="8" stroke="#3a3530" strokeWidth="0.5" fill="#161412" />
          <line x1="136" y1="136" x2="144" y2="144" stroke="#3a3530" strokeWidth="0.3" />
          <line x1="144" y1="136" x2="136" y2="144" stroke="#3a3530" strokeWidth="0.3" />

          {/* Callout — zoomed single fiber below */}
          <line x1="140" y1="235" x2="140" y2="250" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {/* Zoomed fiber cross-section */}
          <circle cx="140" cy="278" r="24" stroke="#3a3530" strokeWidth="0.5" fill="none" />
          <text x="140" y="308" textAnchor="middle" style={{ fontSize: "8px", fill: "#4a4540" }}>Coating (250μm)</text>
          <circle cx="140" cy="278" r="16" stroke="#4a4540" strokeWidth="0.5" fill="none" />
          <text x="176" y="272" style={{ fontSize: "7px", fill: "#4a4540" }}>Cladding (125μm)</text>
          <line x1="156" y1="272" x2="174" y2="272" stroke="#3a3530" strokeWidth="0.3" />
          <circle cx="140" cy="278" r="4" fill="#c9a84c" opacity="0.3" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5" />
          <text x="176" y="282" style={{ fontSize: "7px", fill: "#c9a84c", opacity: 0.7 }}>Ge-doped core (9μm)</text>
          <line x1="144" y1="278" x2="174" y2="282" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
        </svg>
      </div>

      {/* Germanium — crystal lattice structure with zinc ore context */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontSize: "11px", color: "#706a60", margin: 0 }}>Germanium</p>
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
          {/* Zone refining furnace — simplified schematic */}
          {/* Outer vessel */}
          <rect x="90" y="30" width="100" height="200" rx="4" stroke="#3a3530" strokeWidth="0.75" fill="none" />
          
          {/* Inner tube / ampoule */}
          <rect x="110" y="45" width="60" height="170" rx="2" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
          
          {/* Germanium ingot inside — showing purity gradient */}
          <rect x="118" y="55" width="44" height="150" rx="1" fill="none" stroke="#555" strokeWidth="0.3" />
          
          {/* Impurity gradient — darker at top (impure), gold at bottom (pure) */}
          <rect x="118" y="55" width="44" height="30" rx="1" fill="#3a3530" opacity="0.4" />
          <rect x="118" y="85" width="44" height="30" fill="#3a3530" opacity="0.3" />
          <rect x="118" y="115" width="44" height="30" fill="#3a3530" opacity="0.2" />
          <rect x="118" y="145" width="44" height="30" fill="#c9a84c" opacity="0.08" />
          <rect x="118" y="175" width="44" height="30" rx="1" fill="#c9a84c" opacity="0.15" />
          
          {/* Heating coil — the molten zone */}
          <rect x="95" y="120" width="90" height="20" rx="2" stroke="#a05a4a" strokeWidth="0.5" fill="none" opacity="0.5" />
          <line x1="98" y1="125" x2="105" y2="125" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          <line x1="98" y1="130" x2="105" y2="130" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          <line x1="98" y1="135" x2="105" y2="135" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          <line x1="175" y1="125" x2="182" y2="125" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          <line x1="175" y1="130" x2="182" y2="130" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          <line x1="175" y1="135" x2="182" y2="135" stroke="#a05a4a" strokeWidth="0.3" opacity="0.4" />
          
          {/* Molten zone glow */}
          <rect x="118" y="122" width="44" height="16" fill="#a05a4a" opacity="0.15" />
          
          {/* Direction arrow — molten zone moves up */}
          <line x1="80" y1="140" x2="80" y2="110" stroke="#4a4540" strokeWidth="0.5" />
          <path d="M77 114 L80 108 L83 114" stroke="#4a4540" strokeWidth="0.5" fill="none" />
          <text x="72" y="150" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }} transform="rotate(-90 72 150)">Zone travel</text>

          {/* Purity labels */}
          <text x="200" y="70" style={{ fontSize: "7px", fill: "#4a4540" }}>Impure (reject)</text>
          <line x1="162" y1="68" x2="198" y2="68" stroke="#3a3530" strokeWidth="0.3" />
          <text x="200" y="190" style={{ fontSize: "7px", fill: "#c9a84c", opacity: 0.7 }}>5N+ pure Ge</text>
          <line x1="162" y1="188" x2="198" y2="188" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />

          {/* Crystal structure hint at bottom — diamond cubic */}
          <g transform="translate(115, 248)">
            {/* Unit cell — simplified diamond cubic projection */}
            <rect x="0" y="0" width="50" height="50" stroke="#3a3530" strokeWidth="0.3" fill="none" />
            <rect x="8" y="8" width="50" height="50" stroke="#3a3530" strokeWidth="0.3" fill="none" />
            {/* Corner atoms */}
            <circle cx="0" cy="0" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
            <circle cx="50" cy="0" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
            <circle cx="0" cy="50" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
            <circle cx="50" cy="50" r="3" fill="#c9a84c" opacity="0.2" stroke="#c9a84c" strokeWidth="0.3" opacity="0.4" />
            <circle cx="8" cy="8" r="3" fill="#c9a84c" opacity="0.15" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <circle cx="58" cy="8" r="3" fill="#c9a84c" opacity="0.15" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <circle cx="8" cy="58" r="3" fill="#c9a84c" opacity="0.15" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <circle cx="58" cy="58" r="3" fill="#c9a84c" opacity="0.15" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            {/* Body center atom */}
            <circle cx="25" cy="25" r="3.5" fill="#c9a84c" opacity="0.3" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5" />
            <circle cx="33" cy="33" r="3.5" fill="#c9a84c" opacity="0.25" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4" />
            {/* Bonds */}
            <line x1="0" y1="0" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <line x1="50" y1="0" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <line x1="0" y1="50" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
            <line x1="50" y1="50" x2="25" y2="25" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />
          </g>
          <text x="140" y="315" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>Diamond cubic · Ge</text>
        </svg>
      </div>

      {/* Gallium — Bayer process extraction from alumina */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontSize: "11px", color: "#706a60", margin: 0 }}>Gallium</p>
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
          {/* Electrolytic cell — simplified */}
          {/* Outer vessel */}
          <rect x="60" y="50" width="160" height="140" rx="4" stroke="#3a3530" strokeWidth="0.75" fill="none" />
          
          {/* Electrolyte — Bayer liquor */}
          <rect x="62" y="90" width="156" height="98" rx="2" fill="#252220" opacity="0.5" />
          
          {/* Anode (left) */}
          <rect x="85" y="45" width="8" height="110" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <text x="89" y="40" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>+</text>
          
          {/* Cathode (right) */}
          <rect x="187" y="45" width="8" height="110" rx="1" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          <text x="191" y="40" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>−</text>
          
          {/* Ga ions migrating — small dots moving right */}
          <circle cx="120" cy="110" r="1.5" fill="#7a8aaa" opacity="0.4">
            <animate attributeName="cx" values="95;185" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.6;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="125" r="1.5" fill="#7a8aaa" opacity="0.3">
            <animate attributeName="cx" values="95;185" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.5;0.2" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="110" cy="140" r="1.5" fill="#7a8aaa" opacity="0.35">
            <animate attributeName="cx" values="95;185" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.55;0.2" dur="3.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="160" cy="155" r="1.5" fill="#7a8aaa" opacity="0.3">
            <animate attributeName="cx" values="95;185" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.5;0.15" dur="4.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Ga deposit forming on cathode */}
          <path d="M195 110 C198 120, 199 140, 196 155" stroke="#7a8aaa" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M195 115 C197 125, 198 140, 196 150" stroke="#7a8aaa" strokeWidth="1" fill="none" opacity="0.3" />
          
          {/* Labels */}
          <text x="140" y="175" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>Bayer liquor (NaAlO₂ + Ga³⁺)</text>

          {/* Power supply */}
          <line x1="89" y1="45" x2="89" y2="30" stroke="#4a4540" strokeWidth="0.5" />
          <line x1="191" y1="45" x2="191" y2="30" stroke="#4a4540" strokeWidth="0.5" />
          <line x1="89" y1="30" x2="191" y2="30" stroke="#4a4540" strokeWidth="0.5" />
          <rect x="128" y="22" width="24" height="16" rx="2" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
          <text x="140" y="33" textAnchor="middle" style={{ fontSize: "7px", fill: "#4a4540" }}>DC</text>

          {/* Downstream — GaAs wafer below */}
          <line x1="140" y1="195" x2="140" y2="215" stroke="#3a3530" strokeWidth="0.5" strokeDasharray="2 2" />
          
          {/* GaAs wafer — thin disc */}
          <ellipse cx="140" cy="240" rx="50" ry="12" stroke="#4a4540" strokeWidth="0.5" fill="#161412" />
          <ellipse cx="140" cy="236" rx="50" ry="12" stroke="#4a4540" strokeWidth="0.5" fill="#1a1816" />
          
          {/* Wafer surface pattern — die grid */}
          <line x1="110" y1="234" x2="110" y2="238" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="120" y1="233" x2="120" y2="239" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="130" y1="232" x2="130" y2="240" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="140" y1="232" x2="140" y2="240" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="150" y1="232" x2="150" y2="240" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="160" y1="233" x2="160" y2="239" stroke="#3a3530" strokeWidth="0.2" />
          <line x1="170" y1="234" x2="170" y2="238" stroke="#3a3530" strokeWidth="0.2" />

          {/* Label */}
          <text x="140" y="265" textAnchor="middle" style={{ fontSize: "7px", fill: "#7a8aaa", opacity: 0.7 }}>GaAs wafer · 4"</text>
          
          {/* Notch on wafer */}
          <line x1="140" y1="248" x2="140" y2="252" stroke="#4a4540" strokeWidth="0.5" />

          {/* Application icons below */}
          <g transform="translate(70, 280)">
            {/* Laser diode */}
            <rect x="0" y="0" width="24" height="14" rx="2" stroke="#3a3530" strokeWidth="0.3" fill="none" />
            <line x1="24" y1="7" x2="40" y2="7" stroke="#7a8aaa" strokeWidth="0.3" opacity="0.5" />
            <line x1="24" y1="7" x2="36" y2="3" stroke="#7a8aaa" strokeWidth="0.2" opacity="0.3" />
            <line x1="24" y1="7" x2="36" y2="11" stroke="#7a8aaa" strokeWidth="0.2" opacity="0.3" />
            <text x="12" y="24" textAnchor="middle" style={{ fontSize: "6px", fill: "#4a4540" }}>Laser</text>
          </g>
          <g transform="translate(128, 280)">
            {/* LED */}
            <path d="M0 14 L8 0 L16 14 Z" stroke="#3a3530" strokeWidth="0.3" fill="none" />
            <line x1="4" y1="4" x2="12" y2="4" stroke="#7a8aaa" strokeWidth="0.2" opacity="0.4" />
            <text x="8" y="24" textAnchor="middle" style={{ fontSize: "6px", fill: "#4a4540" }}>LED</text>
          </g>
          <g transform="translate(176, 280)">
            {/* Solar cell */}
            <rect x="0" y="0" width="24" height="14" rx="1" stroke="#3a3530" strokeWidth="0.3" fill="none" />
            <line x1="4" y1="0" x2="4" y2="14" stroke="#3a3530" strokeWidth="0.2" />
            <line x1="8" y1="0" x2="8" y2="14" stroke="#3a3530" strokeWidth="0.2" />
            <line x1="12" y1="0" x2="12" y2="14" stroke="#3a3530" strokeWidth="0.2" />
            <line x1="16" y1="0" x2="16" y2="14" stroke="#3a3530" strokeWidth="0.2" />
            <line x1="20" y1="0" x2="20" y2="14" stroke="#3a3530" strokeWidth="0.2" />
            <text x="12" y="24" textAnchor="middle" style={{ fontSize: "6px", fill: "#4a4540" }}>Solar</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
