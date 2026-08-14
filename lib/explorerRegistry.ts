// Registry of stored node objects the Node Explorer can load from the terminal.
// For now only Germanium exists (class graph + Module-3 supply-chain graph).
import germaniumClass from "@/data/node-v2/germanium-class-graph.json";
import germaniumRoutes from "@/data/node-v2/germanium-routes.json";
import germaniumGraph from "@/data/node-v2/germanium-supply-graph.json";
import germaniumEntities from "@/data/node-v2/germanium-entity-graph.json";
import germaniumOverview from "@/data/node-v2/germanium-overview.json";
import galliumClass from "@/data/node-v2/gallium-class-graph.json";
import galliumRoutes from "@/data/node-v2/gallium-routes.json";
import galliumGraph from "@/data/node-v2/gallium-supply-graph.json";
import galliumEntities from "@/data/node-v2/gallium-entity-graph.json";
import lithiumClass from "@/data/node-v2/lithium-class-graph.json";
import lithiumRoutes from "@/data/node-v2/lithium-routes.json";
import lithiumGraph from "@/data/node-v2/lithium-supply-graph.json";
import lithiumEntities from "@/data/node-v2/lithium-entity-graph.json";
import trailRecord from "@/data/node-v2/entities/pe_trail_smelter.json";
import teckOrgRecord from "@/data/node-v2/entities/org_teck_resources.json";
import mpOrgRecord from "@/data/node-v2/entities/org_mp_materials.json";
import kwinanaRecord from "@/data/node-v2/entities/pe_kwinana_li_refinery.json";
import tianqiRecord from "@/data/node-v2/entities/org_tianqi_lithium.json";

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

/* ── Node Object Overview (landing page metadata) ── */
export type NodeOverview = {
  node: string;
  description: { what: string; why: string; how: string };
  metrics: {
    global_production: string;
    market_price: string;
    top_countries: { name: string; share?: string }[];
    top_companies: { name: string; country?: string; note?: string }[];
  };
  stillpoint_view: string;
  stages: Record<string, { quantity_metric: string; description: string }>;
};

export type LoadedNode = {
  name: string;
  classGraph: ClassGraph;
  supplyGraph: SupplyGraph;
  entityGraph: EntityGraph;
  groups: Record<string, unknown>;
  routes: unknown[];
  overview?: NodeOverview | null;
};

/* aggregate one supply-chain stage (column) with its entity counts + top countries + overview text */
export type StageInfo = {
  key: string;
  label: string;
  quantity_metric: string;
  description: string;
  entity_count: number;
  entity_class_label: string;
  count_label: string;
  top_countries: string[];
};

function pluralize(cls: string): string {
  if (!cls) return "Entities";
  if (cls.endsWith("y")) return cls.slice(0, -1) + "ies";
  if (cls.endsWith("s")) return cls;
  return cls + "s";
}

export function computeStages(node: LoadedNode): StageInfo[] {
  const ov = node.overview;
  const ents = node.entityGraph.entities;
  const out: StageInfo[] = [];
  for (const col of node.supplyGraph.columns) {
    const stageMeta = ov?.stages?.[col.key];
    const es = ents.filter((e) => e.column === col.key);
    if (!stageMeta && es.length === 0) continue;
    const classCount = new Map<string, number>();
    const countryCount = new Map<string, number>();
    for (const e of es) {
      if (e.entity_class) classCount.set(e.entity_class, (classCount.get(e.entity_class) ?? 0) + 1);
      if (e.country) countryCount.set(e.country, (countryCount.get(e.country) ?? 0) + 1);
    }
    const topClass = Array.from(classCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Entity";
    const topCountries = Array.from(countryCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map((c) => c[0]);
    out.push({
      key: col.key,
      label: col.label,
      quantity_metric: stageMeta?.quantity_metric ?? "",
      description: stageMeta?.description ?? "",
      entity_count: es.length,
      entity_class_label: topClass,
      count_label: es.length ? `${es.length} ${pluralize(topClass)}` : "—",
      top_countries: topCountries,
    });
  }
  return out;
}

const GERMANIUM: LoadedNode = {
  name: "Germanium",
  classGraph: germaniumClass as ClassGraph,
  supplyGraph: germaniumGraph as unknown as SupplyGraph,
  entityGraph: germaniumEntities as unknown as EntityGraph,
  groups: (germaniumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (germaniumRoutes as { routes: unknown[] }).routes,
  overview: germaniumOverview as unknown as NodeOverview,
};

const GALLIUM: LoadedNode = {
  name: "Gallium",
  classGraph: galliumClass as ClassGraph,
  supplyGraph: galliumGraph as unknown as SupplyGraph,
  entityGraph: galliumEntities as unknown as EntityGraph,
  groups: (galliumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (galliumRoutes as { routes: unknown[] }).routes,
};

const LITHIUM: LoadedNode = {
  name: "Lithium",
  classGraph: lithiumClass as ClassGraph,
  supplyGraph: lithiumGraph as unknown as SupplyGraph,
  entityGraph: lithiumEntities as unknown as EntityGraph,
  groups: (lithiumRoutes as { groups: Record<string, unknown> }).groups,
  routes: (lithiumRoutes as { routes: unknown[] }).routes,
};

const BY_KEY: Record<string, LoadedNode> = {};
for (const a of ["germanium", "ge", "elemental germanium", "germanium metal"]) BY_KEY[a] = GERMANIUM;
for (const a of ["gallium", "ga", "elemental gallium", "gallium metal"]) BY_KEY[a] = GALLIUM;
for (const a of ["lithium", "li", "elemental lithium", "lithium metal"]) BY_KEY[a] = LITHIUM;

export function lookupNode(input: string): LoadedNode | null {
  return BY_KEY[input.toLowerCase().trim()] ?? null;
}

export const AVAILABLE_NODES = ["Germanium", "Gallium", "Lithium"];

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
  pe_kwinana_li_refinery: kwinanaRecord as unknown as FullEntityRecord,
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

/* ── Company Entity Schema v2.0 (nested value-chain hierarchy) — source for the Company Subgraph projection ── */
export type V2Market = { market_participation_id: string; market_name: string; market_type: string; geographic_scope: string; buyer_customer_category: string; specific_buyer_organizational_entity_ids: string[]; volume_revenue_exposure: string; reporting_period: string };
export type V2Output = { commercial_output_id: string; output_name: string; output_type: string; description: string; volume_quantity: string; quantity_unit: string; reporting_period: string; revenue: string; reported_or_estimated: string; markets: V2Market[] };
export type V2Physical = { physical_entity_id: string; physical_entity_name: string; physical_entity_class: string; relationship_to_corporate_vehicle: string; resolution_status: string; geographic_scope: string; commercial_outputs: V2Output[] };
export type V2Group = { product_service_group_id: string; group_name: string; description: string; physical_entities: V2Physical[] };
export type V2Vehicle = { corporate_vehicle_id: string; vehicle_type: string; vehicle_company_id: string; vehicle_company_name: string; ownership_percentage: number | null; control_status: string; relationship_description: string; product_service_groups: V2Group[] };
export type V2Activity = { economic_activity_id: string; activity_name: string; description: string; activity_category: string; geographic_scope: string[]; activity_status: string; corporate_vehicles: V2Vehicle[] };
export type CompanyRecordV2 = {
  common: { organizational_entity_id: string; entity_type: string; entity_subtype: string };
  identity: { company_name: string; legal_name: string; company_type: string; company_status: string; country_of_incorporation: string; headquarters: string; short_description: string };
  financial: { total_revenue: { amount: number | null; currency: string; reporting_period: string } };
  economic_activities: V2Activity[];
};

const ORG_RECORDS_V2: Record<string, CompanyRecordV2> = {};
function regOrgV2(rec: CompanyRecordV2, keys: string[]) { for (const k of keys) ORG_RECORDS_V2[k.toLowerCase().trim()] = rec; }
regOrgV2(mpOrgRecord as unknown as CompanyRecordV2, ["mp materials", "mp materials corp", "mp", "org_mp_materials"]);
regOrgV2(tianqiRecord as unknown as CompanyRecordV2, ["tianqi lithium", "tianqi", "tianqi lithium corporation", "org_tianqi_lithium"]);

export function getCompanyRecordV2(nameOrId: string): CompanyRecordV2 | null {
  return ORG_RECORDS_V2[nameOrId.toLowerCase().trim()] ?? null;
}
export const AVAILABLE_COMPANIES = ["MP Materials", "Tianqi Lithium"];
