// Registry of stored node objects the Node Explorer can load from the terminal.
// For now only Germanium exists (class graph + Module-3 supply-chain graph).
import germaniumClass from "@/data/node-v2/germanium-class-graph.json";
import germaniumRoutes from "@/data/node-v2/germanium-routes.json";
import germaniumGraph from "@/data/node-v2/germanium-supply-graph.json";
import germaniumEntities from "@/data/node-v2/germanium-entity-graph.json";
import galliumClass from "@/data/node-v2/gallium-class-graph.json";
import galliumRoutes from "@/data/node-v2/gallium-routes.json";
import galliumGraph from "@/data/node-v2/gallium-supply-graph.json";
import galliumEntities from "@/data/node-v2/gallium-entity-graph.json";
import trailRecord from "@/data/node-v2/entities/pe_trail_smelter.json";
import teckOrgRecord from "@/data/node-v2/entities/org_teck_resources.json";

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

export type EntityNode = {
  id: string; name: string; entity_class: string; entity_subtype: string;
  country: string; status: string; group_id: string; group_name: string;
  column: string; confidence: string; short: string;
  organizational_entity?: string; physical_entity?: string; flag?: string;
};
export type EntityEdge = { from: string; to: string; status: string; form: string };
export type EntityGraph = {
  graph_id: string; node_object: string;
  columns: { key: string; label: string }[];
  entities: EntityNode[];
  connections: EntityEdge[];
};

export type LoadedNode = {
  name: string;
  classGraph: ClassGraph;
  supplyGraph: SupplyGraph;
  entityGraph: EntityGraph;
  groups: Record<string, unknown>;
  routes: unknown[];
};

const GERMANIUM: LoadedNode = {
  name: "Germanium",
  classGraph: germaniumClass as ClassGraph,
  supplyGraph: germaniumGraph as unknown as SupplyGraph,
  entityGraph: germaniumEntities as unknown as EntityGraph,
  groups: (germaniumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (germaniumRoutes as { routes: unknown[] }).routes,
};

const GALLIUM: LoadedNode = {
  name: "Gallium",
  classGraph: galliumClass as ClassGraph,
  supplyGraph: galliumGraph as unknown as SupplyGraph,
  entityGraph: galliumEntities as unknown as EntityGraph,
  groups: (galliumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (galliumRoutes as { routes: unknown[] }).routes,
};

const BY_KEY: Record<string, LoadedNode> = {};
for (const a of ["germanium", "ge", "elemental germanium", "germanium metal"]) BY_KEY[a] = GERMANIUM;
for (const a of ["gallium", "ga", "elemental gallium", "gallium metal"]) BY_KEY[a] = GALLIUM;

export function lookupNode(input: string): LoadedNode | null {
  return BY_KEY[input.toLowerCase().trim()] ?? null;
}

export const AVAILABLE_NODES = ["Germanium", "Gallium"];

/* ── full schema-conformant Physical Entity Node records (Operating Facility schema) ── */
export type FEGroupMembership = { group_id: string; group_name: string; qualification_status: string; qualification_evidence: string };
export type FEOwner = { organization_name: string; ownership_percentage: number | null; ownership_type?: string; effective_date?: string; source_or_evidence?: string };
export type FEOperator = { organization_name: string; operator_relationship_type?: string; source_or_evidence?: string };
export type FEInput = { input_name: string; input_form: string; input_role: string; nameplate_input_or_throughput_capacity: string; actual_input_quantity: string; quantity_unit: string; reporting_period: string; source_physical_entity_ids: string[]; reported_or_estimated: string };
export type FEProcess = { process_or_stage_name: string; transformation_function: string; actual_process_or_technology_used: string; major_process_steps: string[]; output_form: string; process_status: string };
export type FEOutput = { output_name: string; output_form: string; output_classification: string; nameplate_output_capacity: string; actual_output_quantity: string; quantity_unit: string; reporting_period: string; reported_or_estimated: string };
export type FEMetrics = { total_throughput_capacity: string; actual_throughput: string; capacity_utilization: string; quantity_unit: string; quantity_basis: string };
export type FEOperation = { operation_id: string; operation_name: string; operation_category: string; physical_entity_node_group_id: string; operational_status: string; main_physical_function: string; inputs: FEInput[]; major_industrial_processes: FEProcess[]; outputs_produced: FEOutput[]; operation_metrics: FEMetrics; confidence: string; reported_or_estimated: string; estimation_method: string };
export type FullEntityRecord = {
  common: { physical_entity_id: string; entity_type: string; entity_subtype: string; physical_entity_node_group_memberships: FEGroupMembership[]; owners: FEOwner[]; operators: FEOperator[] };
  identity: { facility_name: string; alternative_names: string[]; facility_type: string; short_description: string; commissioning_or_operating_start_date: string; facility_level_operational_status: string };
  location: { country: string; region: string; city: string; site_address: string; coordinates: { latitude: number | null; longitude: number | null } };
  operations: { operating_configuration: string; operations: FEOperation[]; facility_record_metadata: { record_status: string; overall_confidence: string; created_date: string; last_updated_date: string } };
};

const FULL_RECORDS: Record<string, FullEntityRecord> = {
  pe_trail_smelter: trailRecord as unknown as FullEntityRecord,
};

export function getFullRecord(id: string): FullEntityRecord | null {
  return FULL_RECORDS[id] ?? null;
}

/* ── canonical Organizational Entity (Company) records (Company Entity Schema) ── */
export type CoRevenue = { amount: number | null; currency: string; reporting_period: string; revenue_basis: string; reporting_scope: string; reported_or_estimated: string; evidence: string };
export type CoOutput = { output_id: string; output_name: string; output_type: string; description: string; volume_quantity: string; quantity_unit: string; reporting_period: string; revenue: string; geographic_markets: string[]; end_markets: string[]; reported_or_estimated: string; evidence: string };
export type CoPSG = { group_id: string; group_name: string; description: string; economic_activity_ids: string[]; group_revenue: CoRevenue; commercial_outputs: CoOutput[] };
export type CoActivity = { activity_id: string; activity_name: string; description: string; sector_market_served: string; activity_scope: string; performed_through_company_ids: string[]; product_service_group_ids: string[] };
export type CoRealization = { realization_id: string; realization_type: string; relationship_type: string; physical_entity_ids: string[]; geographic_scope: string; description: string; resolution_status: string; commercial_output_ids: string[] };
export type CompanyRecord = {
  common: { organizational_entity_id: string; entity_type: string; entity_subtype: string };
  identity: { company_name: string; legal_name: string; alternative_names: string[]; company_type: string; company_status: string; headquarters: string; short_description: string };
  corporate_structure: { corporate_role: string; parent_company: string; subsidiaries: string[]; joint_ventures: string[]; equity_investments: string[]; other_affiliates: string[] };
  financial: { total_revenue: CoRevenue };
  economic_activities: CoActivity[];
  product_service_groups: CoPSG[];
  physical_realization: CoRealization[];
  record_metadata: { resolution_status: string; overall_confidence: string; created_date: string; last_updated_date: string };
};

const ORG_RECORDS: Record<string, CompanyRecord> = {};
function regOrg(rec: CompanyRecord, keys: string[]) { for (const k of keys) ORG_RECORDS[k.toLowerCase().trim()] = rec; }
regOrg(teckOrgRecord as unknown as CompanyRecord, ["teck resources", "teck resources limited", "teck", "org_teck_resources"]);

export function getCompanyRecord(nameOrId: string): CompanyRecord | null {
  return ORG_RECORDS[nameOrId.toLowerCase().trim()] ?? null;
}
