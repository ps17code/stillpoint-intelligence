// Deterministically builds the Germanium Module-3 artifacts (full re-run with the
// corrected Step 2.1 comprehensive host-source enumeration: 5 host sources).
//   germanium-routes.json         — Physical Entity Node Group registry + Route Records (with Route Participation Records)
//   germanium-supply-graph.json   — the compiled/stitched supply-chain graph (map nodes + edges + boundaries)
// Run: node data/node-v2/_ingest/build_germanium_map.js
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..");

const NODE_OBJECT = { id: "class_node_000001", name: "Germanium", class_type: "raw material" };

// ── Physical Entity Node Group registry ──
const GROUPS = {
  // Resource Sites (5 host sources — enumerated across occurrence/recovery modes)
  "PEG-RS-ZNSULF": { group_id: "PEG-RS-ZNSULF", name: "Sphalerite Zinc Deposit", entity_class: "Resource Site", entity_type: "Mineral deposit",
    definition: "A zinc sulfide ore body where germanium substitutes into the sphalerite lattice as a trace byproduct element.", main_function: "Hosts germanium-bearing sphalerite zinc ore.", occurrence_mode: "byproduct/companion-hosted deposit", typical_inputs: [], typical_outputs: ["Ge-bearing sphalerite ore"] },
  "PEG-RS-GECOAL": { group_id: "PEG-RS-GECOAL", name: "Germanium Coal Deposit", entity_class: "Resource Site", entity_type: "Coal / lignite deposit",
    definition: "A coal (especially lignite) deposit in which germanium is organically bound above a recoverable cutoff grade.", main_function: "Hosts germanium-bearing lignite.", occurrence_mode: "byproduct/companion-hosted deposit", typical_inputs: [], typical_outputs: ["Ge-bearing lignite"] },
  "PEG-RS-SLAG": { group_id: "PEG-RS-SLAG", name: "Metallurgical Slag / Tailings Accumulation", entity_class: "Resource Site", entity_type: "Secondary residue accumulation",
    definition: "A man-made accumulation of germanium-bearing metallurgical slag, tailings or smelter residue held as an original starting source for secondary germanium recovery.", main_function: "Accumulates germanium-bearing metallurgical slag / tailings.", occurrence_mode: "secondary man-made accumulation", typical_inputs: [], typical_outputs: ["germanium-bearing metallurgical slag / tailings"] },
  "PEG-RS-GE-OXIDE": { group_id: "PEG-RS-GE-OXIDE", name: "Oxide Germanium-Gallium Deposit", entity_class: "Resource Site", entity_type: "Mineral deposit",
    definition: "An oxide-hosted deposit mined directly for germanium and gallium as principal products (rather than as a zinc/coal byproduct).", main_function: "Hosts germanium-gallium oxide ore mined primarily for Ge/Ga.", occurrence_mode: "primary deposit", typical_inputs: [], typical_outputs: ["germanium-gallium oxide ore"] },
  "PEG-RS-GESCRAP": { group_id: "PEG-RS-GESCRAP", name: "End-of-Life Germanium Accumulation", entity_class: "Resource Site", entity_type: "Secondary / scrap accumulation",
    definition: "An accumulation of end-of-life germanium products and production scrap holding recoverable germanium.", main_function: "Accumulates germanium-bearing end-of-life materials and scrap.", occurrence_mode: "end-of-life / recycled accumulation", typical_inputs: [], typical_outputs: ["Ge-bearing end-of-life products & scrap"] },

  // Operating Facilities
  "PEG-OF-ZNMINE": { group_id: "PEG-OF-ZNMINE", name: "Zinc Mine / Concentrator", entity_class: "Operating Facility", entity_type: "Mine-concentrator",
    definition: "An operating facility that mines and concentrates zinc sulfide ore, carrying trace germanium forward in the zinc concentrate.", main_function: "Mines and concentrates Ge-bearing zinc ore.", typical_inputs: ["Ge-bearing sphalerite ore"], typical_outputs: ["Ge-bearing zinc concentrate"] },
  "PEG-OF-ZNSMELT": { group_id: "PEG-OF-ZNSMELT", name: "Zinc Smelter–Refinery", entity_class: "Operating Facility", entity_type: "Smelter-refinery",
    definition: "An operating facility that smelts and refines zinc concentrate, generating germanium-bearing residues and flue dusts as byproducts.", main_function: "Refines zinc and concentrates germanium into residues/dusts.", typical_inputs: ["Ge-bearing zinc concentrate"], typical_outputs: ["Ge-bearing residue / flue dust"] },
  "PEG-OF-COALMINE": { group_id: "PEG-OF-COALMINE", name: "Germaniferous Coal Mine", entity_class: "Operating Facility", entity_type: "Mine",
    definition: "An operating facility that mines germanium-bearing lignite.", main_function: "Mines Ge-rich lignite.", typical_inputs: ["Ge-bearing coal deposit"], typical_outputs: ["Ge-bearing lignite"] },
  "PEG-OF-GEGAMINE": { group_id: "PEG-OF-GEGAMINE", name: "Germanium-Gallium Mine", entity_class: "Operating Facility", entity_type: "Mine-concentrator",
    definition: "An operating facility that mines and concentrates oxide germanium-gallium ore directly into a germanium-gallium concentrate.", main_function: "Mines and concentrates oxide Ge-Ga ore into Ge-Ga concentrate.", typical_inputs: ["germanium-gallium oxide ore"], typical_outputs: ["germanium-gallium concentrate"] },
  "PEG-OF-SCRAP": { group_id: "PEG-OF-SCRAP", name: "Germanium Scrap Pre-Processor", entity_class: "Operating Facility", entity_type: "Recycling pre-processor",
    definition: "An operating facility that collects, sorts and dismantles end-of-life germanium materials into a recyclable feed.", main_function: "Collects and pre-processes Ge scrap.", typical_inputs: ["Ge-bearing end-of-life products & scrap"], typical_outputs: ["Ge-bearing recyclable feed"] },
  "PEG-OF-GEREC": { group_id: "PEG-OF-GEREC", name: "Germanium Recovery Operator", entity_class: "Operating Facility", entity_type: "Hydrometallurgical recovery plant",
    definition: "An operating facility that leaches and concentrates germanium from residues, fly ash, slag, or recyclable feed into a crude germanium concentrate.", main_function: "Recovers and concentrates germanium into a crude concentrate.", typical_inputs: ["Ge-bearing residue / flue dust", "Ge-enriched fly ash", "germanium-bearing metallurgical slag / tailings", "Ge-bearing recyclable feed"], typical_outputs: ["crude germanium concentrate"] },
  "PEG-OF-GEREF": { group_id: "PEG-OF-GEREF", name: "Germanium Refinery", entity_class: "Operating Facility", entity_type: "Chemical refinery",
    definition: "An operating facility that refines crude germanium concentrate (or Ge-Ga concentrate) via chlorination, distillation, hydrolysis, reduction and zone-refining into marketable germanium output forms.", main_function: "Refines germanium concentrate into GeCl₄, GeO₂ and germanium metal.", typical_inputs: ["crude germanium concentrate", "germanium-gallium concentrate"], typical_outputs: ["high-purity germanium metal", "germanium dioxide (GeO₂)", "germanium tetrachloride (GeCl₄)"] },

  // Infrastructure Asset
  "PEG-IA-POWER": { group_id: "PEG-IA-POWER", name: "Coal-Fired Power Plant", entity_class: "Infrastructure Asset", entity_type: "Power plant",
    definition: "A power-generation asset that combusts germanium-rich lignite, concentrating germanium into the resulting fly ash.", main_function: "Combusts Ge-lignite for power and concentrates Ge into fly ash.", typical_inputs: ["Ge-bearing lignite"], typical_outputs: ["Ge-enriched fly ash"] },
};

// ── per-source ordered group chains (resource → … → refinery). Refinery output form is parameterized per route. ──
const CHAINS = {
  ZN: [
    { group: "PEG-RS-ZNSULF", input: null, stage: "Resource hosting", steps: [], output: "Ge-bearing sphalerite ore" },
    { group: "PEG-OF-ZNMINE", input: "Ge-bearing sphalerite ore", stage: "Mining & concentration", steps: ["mine", "crush", "grind", "flotation"], output: "Ge-bearing zinc concentrate" },
    { group: "PEG-OF-ZNSMELT", input: "Ge-bearing zinc concentrate", stage: "Zinc smelting & residue generation", steps: ["roast", "leach", "electrowin", "residue/dust collection"], output: "Ge-bearing residue / flue dust" },
    { group: "PEG-OF-GEREC", input: "Ge-bearing residue / flue dust", stage: "Germanium recovery", steps: ["leach", "solvent-extraction / precipitation", "concentrate"], output: "crude germanium concentrate" },
    { group: "PEG-OF-GEREF", input: "crude germanium concentrate", stage: "Germanium refining", steps: ["chlorination", "fractional distillation", "hydrolysis", "hydrogen reduction", "zone refining"] },
  ],
  CO: [
    { group: "PEG-RS-GECOAL", input: null, stage: "Resource hosting", steps: [], output: "Ge-bearing lignite" },
    { group: "PEG-OF-COALMINE", input: "Ge-bearing coal deposit", stage: "Coal mining", steps: ["mine", "handle"], output: "Ge-bearing lignite" },
    { group: "PEG-IA-POWER", input: "Ge-bearing lignite", stage: "Combustion & fly-ash generation", steps: ["combust for power", "ESP fly-ash collection"], output: "Ge-enriched fly ash" },
    { group: "PEG-OF-GEREC", input: "Ge-enriched fly ash", stage: "Germanium recovery", steps: ["leach", "solvent-extraction / precipitation", "concentrate"], output: "crude germanium concentrate" },
    { group: "PEG-OF-GEREF", input: "crude germanium concentrate", stage: "Germanium refining", steps: ["chlorination", "fractional distillation", "hydrolysis", "hydrogen reduction", "zone refining"] },
  ],
  SL: [
    { group: "PEG-RS-SLAG", input: null, stage: "Resource hosting", steps: [], output: "germanium-bearing metallurgical slag / tailings" },
    { group: "PEG-OF-GEREC", input: "germanium-bearing metallurgical slag / tailings", stage: "Germanium recovery (slag hydrometallurgy)", steps: ["mill/agitate", "acid leach", "solvent-extraction / precipitation", "concentrate"], output: "crude germanium concentrate" },
    { group: "PEG-OF-GEREF", input: "crude germanium concentrate", stage: "Germanium refining", steps: ["chlorination", "fractional distillation", "hydrolysis", "hydrogen reduction", "zone refining"] },
  ],
  OX: [
    { group: "PEG-RS-GE-OXIDE", input: null, stage: "Resource hosting", steps: [], output: "germanium-gallium oxide ore" },
    { group: "PEG-OF-GEGAMINE", input: "germanium-gallium oxide ore", stage: "Ge-Ga mining & concentration", steps: ["mine", "crush", "leach / concentrate Ge-Ga"], output: "germanium-gallium concentrate" },
    { group: "PEG-OF-GEREF", input: "germanium-gallium concentrate", stage: "Germanium refining", steps: ["chlorination", "fractional distillation", "hydrolysis", "hydrogen reduction", "zone refining"] },
  ],
  RC: [
    { group: "PEG-RS-GESCRAP", input: null, stage: "Resource hosting", steps: [], output: "Ge-bearing end-of-life products & scrap" },
    { group: "PEG-OF-SCRAP", input: "Ge-bearing end-of-life products & scrap", stage: "Collection & pre-processing", steps: ["collect", "sort", "dismantle", "size-reduce"], output: "Ge-bearing recyclable feed" },
    { group: "PEG-OF-GEREC", input: "Ge-bearing recyclable feed", stage: "Germanium recovery", steps: ["dissolve / leach", "solvent-extraction / precipitation", "concentrate"], output: "crude germanium concentrate" },
    { group: "PEG-OF-GEREF", input: "crude germanium concentrate", stage: "Germanium refining", steps: ["chlorination", "fractional distillation", "hydrolysis", "hydrogen reduction", "zone refining"] },
  ],
};

const OUTPUTS = { MET: "high-purity germanium metal", GEO2: "germanium dioxide (GeO₂)", GECL4: "germanium tetrachloride (GeCl₄)" };

// ── build routes + participations ──
const routes = [];
for (const [src, chain] of Object.entries(CHAINS)) {
  for (const [okey, oform] of Object.entries(OUTPUTS)) {
    const routeId = `RT-${src}-${okey}`;
    const participations = chain.map((step, i) => ({
      rp_id: `RP-${src}-${okey}-${i + 1}`,
      route_id: routeId,
      seq: i + 1,
      group_id: step.group,
      input_form: step.input ?? null,
      functional_stage: step.stage,
      literal_steps: step.steps,
      output_form: i === chain.length - 1 ? oform : step.output,
      prev_rp: i === 0 ? null : `RP-${src}-${okey}-${i}`,
      next_rp: i === chain.length - 1 ? null : `RP-${src}-${okey}-${i + 2}`,
    }));
    routes.push({
      route_id: routeId, node_object: NODE_OBJECT.id, status: "structured",
      starting_boundary: { group_id: chain[0].group, starting_form: chain[0].output },
      ending_output_form: oform,
      route_participation_ids: participations.map((p) => p.rp_id),
      participations,
    });
  }
}

// ── compile / stitch the graph ──
const COLUMN = {
  "PEG-RS-ZNSULF": "resource", "PEG-RS-GECOAL": "resource", "PEG-RS-SLAG": "resource", "PEG-RS-GE-OXIDE": "resource", "PEG-RS-GESCRAP": "resource",
  "PEG-OF-ZNMINE": "extraction", "PEG-OF-COALMINE": "extraction", "PEG-OF-GEGAMINE": "extraction", "PEG-OF-SCRAP": "extraction",
  "PEG-OF-ZNSMELT": "primary", "PEG-IA-POWER": "primary",
  "PEG-OF-GEREC": "recovery", "PEG-OF-GEREF": "refining",
};
// map-node id: recovery split by source (distinct input); refinery split by output form; rest per group+source
const resId = { "PEG-RS-ZNSULF": "MN-RS-ZN", "PEG-RS-GECOAL": "MN-RS-CO", "PEG-RS-SLAG": "MN-RS-SL", "PEG-RS-GE-OXIDE": "MN-RS-OX", "PEG-RS-GESCRAP": "MN-RS-RC",
  "PEG-OF-ZNMINE": "MN-ZNMINE", "PEG-OF-ZNSMELT": "MN-ZNSMELT", "PEG-OF-COALMINE": "MN-COALMINE", "PEG-IA-POWER": "MN-POWER", "PEG-OF-GEGAMINE": "MN-GEGAMINE", "PEG-OF-SCRAP": "MN-SCRAP" };
function nodeId(src, okey, p) {
  if (p.group_id === "PEG-OF-GEREC") return `MN-GEREC-${src}`;
  if (p.group_id === "PEG-OF-GEREF") return `MN-GEREF-${okey}`;
  return resId[p.group_id];
}

const mapNodes = {};
function ensureNode(id, group_id, input_form, output_form) {
  if (!mapNodes[id]) {
    const g = GROUPS[group_id];
    mapNodes[id] = { map_node_id: id, group_id, group_name: g.name, entity_class: g.entity_class, entity_type: g.entity_type,
      column: COLUMN[group_id], input_forms: [], output_forms: [], route_participation_ids: [], route_ids: [] };
  }
  const n = mapNodes[id];
  if (input_form && !n.input_forms.includes(input_form)) n.input_forms.push(input_form);
  if (output_form && !n.output_forms.includes(output_form)) n.output_forms.push(output_form);
  return n;
}

const edgeSet = {};
for (const r of routes) {
  const [, src, okey] = r.route_id.split("-");
  const ids = r.participations.map((p) => nodeId(src, okey, p));
  r.participations.forEach((p, i) => {
    const n = ensureNode(ids[i], p.group_id, p.input_form, p.output_form);
    if (!n.route_participation_ids.includes(p.rp_id)) n.route_participation_ids.push(p.rp_id);
    if (!n.route_ids.includes(r.route_id)) n.route_ids.push(r.route_id);
  });
  for (let i = 0; i < ids.length - 1; i++) {
    const key = `${ids[i]}__${ids[i + 1]}`;
    if (!edgeSet[key]) edgeSet[key] = { edge_id: `E-${Object.keys(edgeSet).length + 1}`, from: ids[i], to: ids[i + 1], handoff_form: r.participations[i].output_form, route_ids: [] };
    if (!edgeSet[key].route_ids.includes(r.route_id)) edgeSet[key].route_ids.push(r.route_id);
  }
}

const endingBoundaries = [
  { boundary_id: "OUT-MET", form: OUTPUTS.MET, final_map_node: "MN-GEREF-MET" },
  { boundary_id: "OUT-GEO2", form: OUTPUTS.GEO2, final_map_node: "MN-GEREF-GEO2" },
  { boundary_id: "OUT-GECL4", form: OUTPUTS.GECL4, final_map_node: "MN-GEREF-GECL4" },
];
for (const b of endingBoundaries) {
  edgeSet[`${b.final_map_node}__${b.boundary_id}`] = { edge_id: `E-${Object.keys(edgeSet).length + 1}`, from: b.final_map_node, to: b.boundary_id, handoff_form: b.form, route_ids: routes.filter(r => r.ending_output_form === b.form).map(r => r.route_id) };
}

const edges = Object.values(edgeSet);
const inCount = {}, outCount = {};
for (const e of edges) { outCount[e.from] = (outCount[e.from] || 0) + 1; inCount[e.to] = (inCount[e.to] || 0) + 1; }
const convergence_points = Object.keys(inCount).filter((k) => inCount[k] > 1 && mapNodes[k]);
const branch_points = Object.keys(outCount).filter((k) => outCount[k] > 1 && mapNodes[k]);

const startingBoundaries = Object.entries(CHAINS).map(([src, chain]) => ({
  boundary_id: `SB-${src}`, group_id: chain[0].group, starting_form: chain[0].output,
  first_map_node: resId[chain[0].group], route_ids: routes.filter(r => r.route_id.startsWith(`RT-${src}-`)).map(r => r.route_id),
}));

const routesFile = { node_object: NODE_OBJECT, groups: GROUPS, routes };
const graphFile = {
  graph_id: "graph_ge_v2", node_object: NODE_OBJECT.id, graph_version: 2,
  source_route_ids: routes.map((r) => r.route_id),
  columns: [
    { key: "resource", label: "Resource Site" },
    { key: "extraction", label: "Extraction / Collection" },
    { key: "primary", label: "Primary Processing" },
    { key: "recovery", label: "Germanium Recovery" },
    { key: "refining", label: "Germanium Refining" },
    { key: "output", label: "Output Form" },
  ],
  map_nodes: Object.values(mapNodes),
  ending_boundary_nodes: endingBoundaries.map((b) => ({ map_node_id: b.boundary_id, form: b.form, column: "output" })),
  edges, starting_boundaries: startingBoundaries, ending_boundaries: endingBoundaries,
  convergence_points, branch_points, compilation_status: "validated",
};

fs.writeFileSync(path.join(OUT, "germanium-routes.json"), JSON.stringify(routesFile, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "germanium-supply-graph.json"), JSON.stringify(graphFile, null, 2) + "\n");
console.log("host sources:", Object.values(GROUPS).filter(g => g.entity_class === "Resource Site").length, "| groups:", Object.keys(GROUPS).length, "| routes:", routes.length, "| map_nodes:", Object.values(mapNodes).length, "| edges:", edges.length);
console.log("convergence:", convergence_points.join(", "));
console.log("branch:", branch_points.join(", "));
