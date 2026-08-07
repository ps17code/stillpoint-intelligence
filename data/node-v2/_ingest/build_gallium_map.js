// Builds the Gallium Module-3 artifacts (supply-chain map). 4 host sources.
//   gallium-routes.json         — Physical Entity Node Group registry + Route Records
//   gallium-supply-graph.json   — compiled/stitched supply-chain graph
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "..");

const NODE_OBJECT = { id: "class_node_000005", name: "Gallium", class_type: "raw material" };

const GROUPS = {
  "PEG-RS-BAUXITE": { group_id: "PEG-RS-BAUXITE", name: "Bauxite Deposit", entity_class: "Resource Site", entity_type: "Mineral deposit",
    definition: "A bauxite ore deposit in which gallium occurs as a trace byproduct, recovered downstream from the Bayer alumina process.", main_function: "Hosts gallium-bearing bauxite ore.", occurrence_mode: "byproduct/companion-hosted deposit", typical_outputs: ["Ga-bearing bauxite ore"] },
  "PEG-RS-ZNSULF": { group_id: "PEG-RS-ZNSULF", name: "Sphalerite Zinc Deposit", entity_class: "Resource Site", entity_type: "Mineral deposit",
    definition: "A zinc sulfide ore body where gallium substitutes into sphalerite as a trace byproduct.", main_function: "Hosts gallium-bearing sphalerite zinc ore.", occurrence_mode: "byproduct/companion-hosted deposit", typical_outputs: ["Ga-bearing sphalerite ore"] },
  "PEG-RS-REDMUD": { group_id: "PEG-RS-REDMUD", name: "Red Mud / Bauxite Residue Accumulation", entity_class: "Resource Site", entity_type: "Secondary residue accumulation",
    definition: "A man-made accumulation of bauxite residue (red mud) holding recoverable gallium, worked as a secondary source.", main_function: "Accumulates gallium-bearing red mud / bauxite residue.", occurrence_mode: "secondary man-made accumulation", typical_outputs: ["gallium-bearing red mud"] },
  "PEG-RS-GASCRAP": { group_id: "PEG-RS-GASCRAP", name: "End-of-Life & New-Scrap Gallium Accumulation", entity_class: "Resource Site", entity_type: "Secondary / scrap accumulation",
    definition: "An accumulation of GaAs/GaN wafer & LED manufacturing new-scrap, sludges and end-of-life electronics holding recoverable gallium.", main_function: "Accumulates gallium-bearing new scrap and end-of-life material.", occurrence_mode: "end-of-life / recycled accumulation", typical_outputs: ["Ga-bearing scrap / feed"] },

  "PEG-OF-BAUXMINE": { group_id: "PEG-OF-BAUXMINE", name: "Bauxite Mine", entity_class: "Operating Facility", entity_type: "Mine",
    definition: "An operating facility that mines bauxite ore, carrying trace gallium forward to alumina refining.", main_function: "Mines Ga-bearing bauxite.", typical_inputs: ["Ga-bearing bauxite ore"], typical_outputs: ["bauxite"] },
  "PEG-OF-ALUMINA": { group_id: "PEG-OF-ALUMINA", name: "Alumina Refinery (Bayer)", entity_class: "Operating Facility", entity_type: "Alumina refinery",
    definition: "A Bayer-process alumina refinery whose sodium-aluminate (Bayer) liquor concentrates gallium — the principal primary gallium feedstock.", main_function: "Refines bauxite to alumina; gallium concentrates in the Bayer liquor.", typical_inputs: ["bauxite"], typical_outputs: ["alumina", "Ga-bearing Bayer liquor"] },
  "PEG-OF-ZNMINE": { group_id: "PEG-OF-ZNMINE", name: "Zinc Mine / Concentrator", entity_class: "Operating Facility", entity_type: "Mine-concentrator",
    definition: "An operating facility that mines and concentrates zinc sulfide ore, carrying trace gallium in the zinc concentrate.", main_function: "Mines and concentrates Ga-bearing zinc ore.", typical_inputs: ["Ga-bearing sphalerite ore"], typical_outputs: ["Ga-bearing zinc concentrate"] },
  "PEG-OF-ZNSMELT": { group_id: "PEG-OF-ZNSMELT", name: "Zinc Smelter–Refinery", entity_class: "Operating Facility", entity_type: "Smelter-refinery",
    definition: "An electrolytic zinc smelter whose refining residues concentrate gallium as a byproduct.", main_function: "Refines zinc; gallium reports to residues.", typical_inputs: ["Ga-bearing zinc concentrate"], typical_outputs: ["Ga-bearing zinc residue"] },
  "PEG-OF-GASCRAPPROC": { group_id: "PEG-OF-GASCRAPPROC", name: "Gallium Scrap Pre-Processor", entity_class: "Operating Facility", entity_type: "Recycling pre-processor",
    definition: "An operating facility that collects and pre-processes GaAs/GaN/LED scrap into a gallium-bearing recyclable feed.", main_function: "Collects and pre-processes gallium scrap.", typical_inputs: ["Ga-bearing scrap / feed"], typical_outputs: ["Ga-bearing recyclable feed"] },
  "PEG-OF-GAREC": { group_id: "PEG-OF-GAREC", name: "Gallium Recovery Operator", entity_class: "Operating Facility", entity_type: "Hydrometallurgical recovery plant",
    definition: "An operating facility that recovers gallium from Bayer liquor, zinc residues, red mud, or recyclable feed into crude gallium metal.", main_function: "Recovers gallium into crude metal.", typical_inputs: ["Ga-bearing Bayer liquor", "Ga-bearing zinc residue", "gallium-bearing red mud", "Ga-bearing recyclable feed"], typical_outputs: ["crude gallium metal"] },
  "PEG-OF-GAREF": { group_id: "PEG-OF-GAREF", name: "Gallium Refinery", entity_class: "Operating Facility", entity_type: "Chemical refinery",
    definition: "An operating facility that purifies crude gallium into high-purity gallium metal (4N–7N) by fractional crystallization / zone refining / electrolysis.", main_function: "Refines crude gallium to high-purity metal.", typical_inputs: ["crude gallium metal"], typical_outputs: ["high-purity gallium metal"] },
};

const CHAINS = {
  BX: [
    { group: "PEG-RS-BAUXITE", input: null, stage: "Resource hosting", steps: [], output: "Ga-bearing bauxite ore" },
    { group: "PEG-OF-BAUXMINE", input: "Ga-bearing bauxite ore", stage: "Bauxite mining", steps: ["mine", "crush", "ship"], output: "bauxite" },
    { group: "PEG-OF-ALUMINA", input: "bauxite", stage: "Bayer alumina refining", steps: ["digestion", "clarification", "precipitation", "calcination"], output: "Ga-bearing Bayer liquor" },
    { group: "PEG-OF-GAREC", input: "Ga-bearing Bayer liquor", stage: "Gallium recovery (Bayer liquor)", steps: ["ion-exchange / extraction", "electrolysis"], output: "crude gallium metal" },
    { group: "PEG-OF-GAREF", input: "crude gallium metal", stage: "Gallium refining", steps: ["fractional crystallization", "zone refining", "electrolytic purification"] },
  ],
  ZN: [
    { group: "PEG-RS-ZNSULF", input: null, stage: "Resource hosting", steps: [], output: "Ga-bearing sphalerite ore" },
    { group: "PEG-OF-ZNMINE", input: "Ga-bearing sphalerite ore", stage: "Mining & concentration", steps: ["mine", "grind", "flotation"], output: "Ga-bearing zinc concentrate" },
    { group: "PEG-OF-ZNSMELT", input: "Ga-bearing zinc concentrate", stage: "Zinc smelting & residue generation", steps: ["roast", "leach", "electrowin", "residue collection"], output: "Ga-bearing zinc residue" },
    { group: "PEG-OF-GAREC", input: "Ga-bearing zinc residue", stage: "Gallium recovery (zinc residue)", steps: ["acid leach", "solvent extraction"], output: "crude gallium metal" },
    { group: "PEG-OF-GAREF", input: "crude gallium metal", stage: "Gallium refining", steps: ["fractional crystallization", "zone refining"] },
  ],
  RM: [
    { group: "PEG-RS-REDMUD", input: null, stage: "Resource hosting", steps: [], output: "gallium-bearing red mud" },
    { group: "PEG-OF-GAREC", input: "gallium-bearing red mud", stage: "Gallium recovery (red mud)", steps: ["leach", "extraction", "electrolysis"], output: "crude gallium metal" },
    { group: "PEG-OF-GAREF", input: "crude gallium metal", stage: "Gallium refining", steps: ["fractional crystallization", "zone refining"] },
  ],
  RC: [
    { group: "PEG-RS-GASCRAP", input: null, stage: "Resource hosting", steps: [], output: "Ga-bearing scrap / feed" },
    { group: "PEG-OF-GASCRAPPROC", input: "Ga-bearing scrap / feed", stage: "Collection & pre-processing", steps: ["collect", "sort", "size-reduce"], output: "Ga-bearing recyclable feed" },
    { group: "PEG-OF-GAREC", input: "Ga-bearing recyclable feed", stage: "Gallium recovery (recycling)", steps: ["leach", "solvent extraction"], output: "crude gallium metal" },
    { group: "PEG-OF-GAREF", input: "crude gallium metal", stage: "Gallium refining", steps: ["fractional crystallization", "zone refining"] },
  ],
};

const OUTPUTS = { GA: "high-purity gallium metal" };

const routes = [];
for (const [src, chain] of Object.entries(CHAINS)) {
  for (const [okey, oform] of Object.entries(OUTPUTS)) {
    const routeId = `RT-${src}-${okey}`;
    const participations = chain.map((step, i) => ({
      rp_id: `RP-${src}-${okey}-${i + 1}`, route_id: routeId, seq: i + 1, group_id: step.group,
      input_form: step.input ?? null, functional_stage: step.stage, literal_steps: step.steps,
      output_form: i === chain.length - 1 ? oform : step.output,
      prev_rp: i === 0 ? null : `RP-${src}-${okey}-${i}`, next_rp: i === chain.length - 1 ? null : `RP-${src}-${okey}-${i + 2}`,
    }));
    routes.push({ route_id: routeId, node_object: NODE_OBJECT.id, status: "structured",
      starting_boundary: { group_id: chain[0].group, starting_form: chain[0].output }, ending_output_form: oform,
      route_participation_ids: participations.map((p) => p.rp_id), participations });
  }
}

const COLUMN = {
  "PEG-RS-BAUXITE": "resource", "PEG-RS-ZNSULF": "resource", "PEG-RS-REDMUD": "resource", "PEG-RS-GASCRAP": "resource",
  "PEG-OF-BAUXMINE": "extraction", "PEG-OF-ZNMINE": "extraction", "PEG-OF-GASCRAPPROC": "extraction",
  "PEG-OF-ALUMINA": "primary", "PEG-OF-ZNSMELT": "primary",
  "PEG-OF-GAREC": "recovery", "PEG-OF-GAREF": "refining",
};
const resId = { "PEG-RS-BAUXITE": "MN-RS-BX", "PEG-RS-ZNSULF": "MN-RS-ZN", "PEG-RS-REDMUD": "MN-RS-RM", "PEG-RS-GASCRAP": "MN-RS-RC",
  "PEG-OF-BAUXMINE": "MN-BAUXMINE", "PEG-OF-ZNMINE": "MN-ZNMINE", "PEG-OF-GASCRAPPROC": "MN-SCRAPPROC",
  "PEG-OF-ALUMINA": "MN-ALUMINA", "PEG-OF-ZNSMELT": "MN-ZNSMELT" };
function nodeId(src, okey, p) {
  if (p.group_id === "PEG-OF-GAREC") return `MN-GAREC-${src}`;
  if (p.group_id === "PEG-OF-GAREF") return `MN-GAREF-${okey}`;
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

const endingBoundaries = [{ boundary_id: "OUT-GA", form: OUTPUTS.GA, final_map_node: "MN-GAREF-GA" }];
for (const b of endingBoundaries) {
  edgeSet[`${b.final_map_node}__${b.boundary_id}`] = { edge_id: `E-${Object.keys(edgeSet).length + 1}`, from: b.final_map_node, to: b.boundary_id, handoff_form: b.form, route_ids: routes.map(r => r.route_id) };
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

fs.writeFileSync(path.join(OUT, "gallium-routes.json"), JSON.stringify({ node_object: NODE_OBJECT, groups: GROUPS, routes }, null, 2) + "\n");
fs.writeFileSync(path.join(OUT, "gallium-supply-graph.json"), JSON.stringify({
  graph_id: "graph_ga_v1", node_object: NODE_OBJECT.id, graph_version: 1, source_route_ids: routes.map((r) => r.route_id),
  columns: [{ key: "resource", label: "Resource Site" }, { key: "extraction", label: "Extraction / Collection" }, { key: "primary", label: "Primary Processing" }, { key: "recovery", label: "Gallium Recovery" }, { key: "refining", label: "Gallium Refining" }, { key: "output", label: "Output Form" }],
  map_nodes: Object.values(mapNodes), ending_boundary_nodes: endingBoundaries.map((b) => ({ map_node_id: b.boundary_id, form: b.form, column: "output" })),
  edges, starting_boundaries: startingBoundaries, ending_boundaries: endingBoundaries, convergence_points, branch_points, compilation_status: "validated",
}, null, 2) + "\n");
console.log("host sources:", Object.values(GROUPS).filter(g => g.entity_class === "Resource Site").length, "| groups:", Object.keys(GROUPS).length, "| routes:", routes.length, "| map_nodes:", Object.values(mapNodes).length, "| edges:", edges.length);
console.log("convergence:", convergence_points.join(", "), "| branch:", branch_points.join(", "));
