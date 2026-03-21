# Stillpoint Intelligence

Supply chain intelligence platform for frontier technology sectors.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time: follow prompts to connect GitHub)
vercel
```

## Project structure

```
/data
  nodes.json     — all node content (42 nodes, grows with each new chain)
  chains.json    — supply chain topology (layers, edges, connections)
  panels.json    — intro + layer analysis panel content

/components
  Spine.tsx      — 4-node vertical navigation spine
  TreeMap.tsx    — SVG tree renderer (generic, works for any chain)
  AnchorSpine.tsx — bottom anchor nodes (comp, sub, eu states)
  Breadcrumb.tsx — top prior-node breadcrumb
  LayerLabels.tsx — left-side clickable layer labels
  RightPanel.tsx — sliding analysis panel
  Tooltip.tsx    — floating node card
  Shapes.tsx     — cube, sphere, pyramid, cylinder SVG shapes

/lib
  treeGeometry.ts — geometry engine: converts chain data → SVG coordinates

/types
  index.ts       — TypeScript types for all data structures

/app
  page.tsx       — main page, app state management
  layout.tsx     — root layout with fonts
  globals.css    — design tokens and base styles
```

## Adding a new node

Edit `data/nodes.json` — add an entry following this pattern:

```json
"Node Name": {
  "type": "Node type description",
  "loc": "Location, Country",
  "stat": "Key stat · ticker or metric",
  "risk": "Primary risk in one sentence.",
  "stats": [
    ["Label", "Value"],
    ["Label", "Value"],
    ["Label", "Value"],
    ["Label", "Value"]
  ],
  "role": "Supply chain role paragraph.",
  "inv": "Investment angle paragraph.",
  "risks": [
    "Risk flag one.",
    "Risk flag two.",
    "Risk flag three."
  ]
}
```

## Adding a new chain (e.g. Gallium)

1. Add nodes to `data/nodes.json`
2. Add chain topology to `data/chains.json` under `RAW_DATA`, `COMP_DATA` etc.
3. Add chain to `SPINE_TREE` in `chains.json`
4. Add panel content to `data/panels.json`

No code changes needed.

## Editing analysis content

All panel text lives in `data/panels.json`. Edit any section's `content` field directly.
