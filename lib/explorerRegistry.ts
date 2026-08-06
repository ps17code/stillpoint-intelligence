// Registry of stored node objects the Node Explorer can load from the terminal.
// For now only Germanium exists (class graph + Module-3 supply-chain graph).
import germaniumClass from "@/data/node-v2/germanium-class-graph.json";
import germaniumRoutes from "@/data/node-v2/germanium-routes.json";
import germaniumGraph from "@/data/node-v2/germanium-supply-graph.json";

export type ClassNodeRef = { id: string; name: string; class_type: string };
export type ClassGraph = { node: ClassNodeRef; downstream: ClassNodeRef[] };

export type MapNode = {
  map_node_id: string; group_id: string; group_name: string;
  entity_class: string; entity_type: string; column: string;
  input_forms: string[]; output_forms: string[];
  route_participation_ids: string[]; route_ids: string[];
};
export type EndingNode = { map_node_id: string; form: string; column: string };
export type MapEdge = { edge_id: string; from: string; to: string; handoff_form: string; route_ids: string[] };
export type SupplyGraph = {
  graph_id: string; node_object: string;
  columns: { key: string; label: string }[];
  map_nodes: MapNode[];
  ending_boundary_nodes: EndingNode[];
  edges: MapEdge[];
  starting_boundaries: unknown[];
  ending_boundaries: unknown[];
  convergence_points: string[];
  branch_points: string[];
};

export type LoadedNode = {
  name: string;
  classGraph: ClassGraph;
  supplyGraph: SupplyGraph;
  groups: Record<string, unknown>;
  routes: unknown[];
};

const GERMANIUM: LoadedNode = {
  name: "Germanium",
  classGraph: germaniumClass as ClassGraph,
  supplyGraph: germaniumGraph as unknown as SupplyGraph,
  groups: (germaniumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (germaniumRoutes as { routes: unknown[] }).routes,
};

const BY_KEY: Record<string, LoadedNode> = {};
for (const a of ["germanium", "ge", "elemental germanium", "germanium metal"]) BY_KEY[a] = GERMANIUM;

export function lookupNode(input: string): LoadedNode | null {
  return BY_KEY[input.toLowerCase().trim()] ?? null;
}

export const AVAILABLE_NODES = ["Germanium"];
