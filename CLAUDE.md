# Stillpoint Intelligence — Project Guide

Supply chain intelligence visualization platform for frontier technology sectors. Maps multi-tier supply chains (Raw Material → Component → Subsystem → End Use) with interactive, geometry-driven SVG visualizations. No external charting libraries — all rendering is custom React/SVG.

---

## Project Structure

```
/app/
  page.tsx          — Main page: all app state, transitions, geometry orchestration
  layout.tsx        — Root layout with EB Garamond + Geist Mono font imports
  globals.css       — Design tokens (CSS vars), base styles, animation classes

/components/
  Spine.tsx         — 4-node vertical navigation spine (default state)
  TreeMap.tsx       — SVG tree renderer (layers, edges, output node, anchor line)
  AnchorSpine.tsx   — Floating bottom nodes for states 2+ (comp, sub, eu)
  Breadcrumb.tsx    — Top nav showing prior-level selections
  LayerLabels.tsx   — Left-side clickable layer labels
  RightPanel.tsx    — Sliding analysis panel (340px)
  Tooltip.tsx       — Floating node card on hover
  Shapes.tsx        — SVG geometric shapes: CubeShape, SphereShape, PyramidShape, CylinderShape

/lib/
  treeGeometry.ts   — Geometry engine: chain data → SVG coordinates

/types/
  index.ts          — All TypeScript interfaces

/data/
  nodes.json        — 42 supply chain nodes with intelligence content
  chains.json       — Chain topology (layers, edge mappings, SPINE_TREE hierarchy)
  panels.json       — Panel content for each layer and intro screens
```

---

## App State

`AppState = 0 | 1 | 2 | 3 | 4`

| State | View | Spine state | Anchor |
|-------|------|-------------|--------|
| 0 | Home spine | default (centered) | — |
| 1 | Raw material tree | shifted (bottom) | cube in Spine (`id="raw-anchor-shape"`) |
| 2 | Component tree | gone (off-screen) | sphere in AnchorSpine (`id="comp-anchor-shape"`) |
| 3 | Subsystem tree | gone | pyramid in AnchorSpine (`id="sub-anchor-shape"`) |
| 4 | End use tree | gone | cylinder in AnchorSpine (`id="eu-anchor-shape"`) |

`SpineSelection` tracks what is chosen at each level: `{ raw, comp, sub, eu }`.

---

## Component Purposes

### `Spine.tsx`
Main vertical spine with 4 nodes (cube → sphere → pyramid → cylinder). Has three states controlled by a CSS `transform` via the `transition` prop:
- `"default"` — `transform: none` (centered on screen)
- `"shifted"` — `translateY(calc(50vh - 10px))` (slides to lower half)
- `"gone"` — `translateY(-200vh)` (off screen upward)

Sub/EU nodes become `hidden` (opacity 0, still in layout) when shifted. Nodes expose dropdown menus on hover showing available selections for that tier. The `"raw"` node's shape div has `id="raw-anchor-shape"` so the geometry engine can measure its exact screen position after the animation settles.

### `TreeMap.tsx`
Renders the supply chain tree into the fullscreen SVG overlay (`position: fixed, inset: 0, viewBox="0 0 1000 1000"`). Builds node groups (label + ring circle + hit area) and dashed edge lines from `TreeGeometry`. Groups appear with staggered fade-in (110ms apart). Hover and click events are attached per-node.

### `AnchorSpine.tsx`
Replaces the main Spine for states 2+. Shows the current level's node and the next (dormant) node below it. Positioned at `topPx` (derived from `anchorTop`). Accepts optional `anchorId` prop which is applied to the first node's shape wrapper so geometry can be measured. The first node is the anchor point — the tree's output line connects to it.

### `Breadcrumb.tsx`
Fixed top-left row showing 1–2 prior selections (e.g., "Germanium → GeO₂/GeCl₄"). Click navigates back up the hierarchy.

### `LayerLabels.tsx`
Left-side monospace labels for each layer in the current tree. Y positions derived from SVG `cy` values converted back to viewport pixels. Clicking opens a layer analysis panel via `onLayerClick`.

### `RightPanel.tsx`
340px sliding panel anchored to the right edge. Renders `PanelContent` with four section types:
- `bigstats` — 3-column key figure grid
- `prose` — paragraph text
- `risks` — warning-styled list items
- `angle` — investment angle with special styling

Exports `buildNodePanelContent(key, nodeData)` helper that converts raw `NodeData` into `PanelContent` format.

### `Tooltip.tsx`
Floating 224×230px card on node hover. Shows node type, name, location, key stat, and risk. Has "Deep dive →" button to open the right panel. Positioned via SVG coordinates converted to viewport pixels, with edge clamping.

### `Shapes.tsx`
Pure SVG components: `CubeShape`, `SphereShape`, `PyramidShape`, `CylinderShape`. Each uses linear/radial gradients for depth. Accept optional `size` prop. No external dependencies.

---

## Geometry Engine (`treeGeometry.ts`)

The geometry engine is the core of the visualization. It takes a chain definition and an anchor position (in SVG 0–1000 coordinate space) and returns all node/edge coordinates.

**Key functions:**
- `toSVG(px, total)` — converts pixel position to SVG space: `(px / total) * 1000`
- `evenSpread(n, center, half, pad)` — distributes n nodes evenly across a horizontal range
- `buildRawGeometry(chain, ancX, ancY)` — 4 layers: DEPOSITS → MINERS → REFINERS → SUPPLY
- `buildCompGeometry(chain, ancX, ancY)` — 3 layers: PREFORM → DRAWING → OUTPUT
- `buildSubGeometry(chain, ancX, ancY)` — 3 layers: ASSEMBLY → CABLE TYPE → OUTPUT
- `buildEUGeometry(chain, ancX, ancY)` — 3 layers: INTEGRATION → HYPERSCALE → OUTPUT

All build functions compute layer Y positions as `ancY - gap * n` (tree grows upward from anchor). Returns `TreeGeometry` with:
- `layers` — `LayerGeometry[]` (nodes with cx/cy/opacity + color palette)
- `edges` — `EdgeGeometry[]` (dashed connection lines between layers)
- `outputNode` — the bottom-most tree node (supply/output)
- `outputToAnchorLine` — vertical line from output node down to the spine shape

**Color palettes** (`PALETTES`):
- Raw: gold → brown family
- Comp: teal family
- Sub: purple-slate family
- EU: purple → forest green family

---

## Anchor Positioning — Critical Design

The tree must visually connect to the spine shape at the bottom of the screen. The anchor position (`ancX`, `ancY`) is measured from the actual DOM element at runtime using `getBoundingClientRect()`.

**How it works (`buildGeometryFromAnchorEl`):**
1. `getElementById(elId)` finds the shape div
2. `getBoundingClientRect()` gets its actual screen position (includes CSS transforms)
3. `toSVG(cyPx, window.innerHeight)` converts to SVG Y
4. Tree geometry is built upward from this anchor

**Why `transitionend` instead of `setTimeout`:**
For state 1, the Spine animates via CSS `transform` transition (750ms). We must measure *after* the animation completes. A fixed timeout is unreliable because React's commit time varies. The `afterSpineTransition()` helper listens for `transitionend` on `#page-spine` filtered to `propertyName === "transform"`, with a 1200ms fallback. For states 2+ (AnchorSpine, no animation), a plain setTimeout is used.

**Anchor IDs:**
- State 1: `id="raw-anchor-shape"` on the cube shape div in `Spine.tsx`
- State 2: `anchorId="comp-anchor-shape"` → applied to first node wrapper in `AnchorSpine`
- State 3: `anchorId="sub-anchor-shape"`
- State 4: `anchorId="eu-anchor-shape"`

---

## Data Model

### `NodeData` (nodes.json)
```ts
{
  type: string          // "Deposit", "Miner", "Refiner", etc.
  loc: string           // Geographic location
  stat: string          // Key headline metric
  risk: string          // One-line primary risk
  stats: [string, string][]  // [label, value] pairs for tooltip/panel
  role: string          // Paragraph: supply chain role
  inv: string           // Paragraph: investment angle
  risks: string[]       // 3 risk flags
}
```

### Chain Types (chains.json)
```ts
RawChain:  { deposits, miners, refiners, supply, depToMin, minToRef, minor }
CompChain: { preform, drawing, output, preToDrawing, minor }
SubChain:  { assembly, cableType, output, assToType, minor }
EUChain:   { integration, hyperscale, output, intToHyper }
```

Edge mappings (`depToMin`, etc.) are `[number, number][]` index pairs (from-layer-idx → to-layer-idx). `minor` lists node indices that should render at reduced opacity (secondary suppliers).

### `SPINE_TREE` (chains.json)
```json
{
  "Germanium": {
    "GeO₂ / GeCl₄": {
      "Fiber Optics": ["AI Datacenter"]
    }
  }
}
```
Drives dropdown options at each spine level. Depth-first: raw → comp → sub → eu.

### `PanelContent` (panels.json)
```ts
{
  context: string       // Small header label
  title: string         // Main heading
  sub: string           // Subtitle / key stats line
  sections: PanelSection[]
}
PanelSection: { label, type: "bigstats"|"prose"|"risks"|"angle", content?, stats? }
```

---

## Design Decisions

**No charting library.** All SVG is hand-generated. This gives complete control over the tree layout, animation timing, and visual style. `d3` or similar would add layout weight and fight against the custom geometry engine.

**SVG coordinate space 0–1000.** The SVG `viewBox="0 0 1000 1000"` with `preserveAspectRatio="xMidYMid meet"` means: on landscape viewports, the SVG scales to viewport height, centered horizontally. Y coordinates map directly: `pixel_y = svgY * innerHeight / 1000`. X coordinates have a horizontal offset `(W - H) / 2`. All position math uses `toSVG(px, dimension)` consistently.

**Tree grows upward from anchor.** The anchor is the spine shape (cube/sphere/etc.) at the bottom. All layer Y positions are `ancY - gap * n`. This means the tree always terminates at the spine shape regardless of viewport size — it's anchored to a real DOM element, not a formula.

**Warm beige palette.** CSS variables on `:root` define the full color system. The `--bg: #f2ede3` background with `--ink` (dark brown) text creates a deliberate "intelligence document" aesthetic distinct from typical dashboards.

**Grain overlay.** An SVG `feTurbulence` filter applied as a fixed overlay div adds texture without image assets.

**State machine over router.** `AppState = 0|1|2|3|4` is simple integer state — no URL routing, no complex state management. Navigation is purely in-memory React state transitions with CSS animations.

**Fonts via Next.js layout.** EB Garamond (serif, body/labels) and Geist Mono (monospace, labels/UI) are loaded via `next/font/google` in `layout.tsx`, injected as CSS variables `--font-garamond` and `--font-mono`.

**TypeScript strict mode.** `strict: true` in tsconfig. JSON imports are cast through `unknown` first when the inferred type is wider than the declared type (e.g., `string[][]` vs `[string, string][]`).

---

## Key Files to Edit for Common Tasks

| Task | File |
|------|------|
| Add a new supply chain | `data/chains.json` (SPINE_TREE + RAW_DATA/COMP_DATA/etc.) |
| Add node intelligence | `data/nodes.json` |
| Edit analysis panel content | `data/panels.json` |
| Change tree layer colors | `lib/treeGeometry.ts` → `PALETTES` |
| Change tree layer spacing | `lib/treeGeometry.ts` → `gap` param in build functions |
| Change panel sections/layout | `components/RightPanel.tsx` |
| Change tooltip content | `components/Tooltip.tsx` |
| Change spine animation timing | `components/Spine.tsx` → `transition` style |
| Change design tokens | `app/globals.css` → `:root` |
| Add a new AppState tier | `types/index.ts`, `app/page.tsx`, `lib/treeGeometry.ts` |

---

## Tech Stack

- **Next.js 16.2.1** — App Router, static export
- **React 19** — Client components (`"use client"`)
- **TypeScript 5** — Strict mode
- **Tailwind CSS 3.4** — Utility classes (light usage; most styling is inline or CSS vars)
- **No charting/animation libraries** — All SVG and transitions are native

Deployed on **Vercel** with auto-deploy from the `main` branch. The `preview` branch deploys to a separate preview URL for testing.
