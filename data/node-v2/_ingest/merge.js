const fs = require("fs");
const path = require("path");

const dir = __dirname;
const graphPath = path.join(dir, "..", "graph.json");
const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));

const files = ["china.json", "russia.json", "centralasia_europe.json", "northamerica.json", "africa_latam.json"];

function normOwner(owner) {
  if (!Array.isArray(owner)) return [];
  return owner.map((o) => {
    if (typeof o === "string") return { company_id: null, company_name: o, stake_pct: null };
    return {
      company_id: o.company_id ?? null,
      company_name: o.company_name ?? o.name ?? null,
      stake_pct: o.stake_pct ?? null,
    };
  });
}

function normOperator(op) {
  if (!op) return null;
  return {
    company_id: op.company_id ?? null,
    company_name: op.company_name ?? op.name ?? null,
  };
}

function normSource(src) {
  if (!src) return { name: null, url: "" };
  if (typeof src === "string") return { name: src, url: "" };
  return { name: src.name ?? null, url: src.url ?? "", retrieved: src.retrieved };
}

function normReserve(r) {
  if (!r) return null;
  return { ...r, source: normSource(r.source) };
}

function normEntity(e) {
  return {
    ...e,
    owner: normOwner(e.owner),
    operator: normOperator(e.operator),
    total_reserve: normReserve(e.total_reserve),
    inputs: Array.isArray(e.inputs) ? e.inputs : [],
    outputs: Array.isArray(e.outputs) ? e.outputs : [],
  };
}

const newEntityIds = [];

for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const [id, ent] of Object.entries(data.entities || {})) {
    graph.entities[id] = normEntity(ent);
    newEntityIds.push(id);
  }
  for (const [id, co] of Object.entries(data.companies || {})) {
    if (graph.companies[id]) {
      // merge entities arrays uniquely
      const merged = new Set([...(graph.companies[id].entities || []), ...(co.entities || [])]);
      graph.companies[id] = { ...co, entities: [...merged] };
    } else {
      graph.companies[id] = co;
    }
  }
}

// Add all new entity ids to the germanium class entities list (keep pilot first, unique)
const cls = graph.classes.class_rawmat_germanium;
const allEnts = new Set([...(cls.entities || []), ...newEntityIds]);
cls.entities = [...allEnts];

graph._meta.last_run = "2026-06-22";
graph._meta.note = "Full global germanium source set generated via Module 3 Step 2 enumeration + per-node web research. Non-producing sites terminate (no downstream edge).";

// Validation: entity-type output edges must resolve to an existing entity
const problems = [];
for (const [id, ent] of Object.entries(graph.entities)) {
  for (const out of ent.outputs || []) {
    if (out.to_type === "entity" && !graph.entities[out.to_node]) {
      problems.push(`${id} -> missing entity ${out.to_node}`);
    }
  }
}

fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2) + "\n");

const producing = newEntityIds.filter((id) => (graph.entities[id].outputs || []).length > 0);
const terminating = newEntityIds.filter((id) => (graph.entities[id].outputs || []).length === 0);
console.log("Entities now:", Object.keys(graph.entities).length);
console.log("Companies now:", Object.keys(graph.companies).length);
console.log("Class germanium entities:", cls.entities.length);
console.log("New entities:", newEntityIds.length, "| with downstream edge:", producing.length, "| terminating:", terminating.length);
console.log("Edge problems:", problems.length ? problems : "none");
