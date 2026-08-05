// Pre-generated Class Node Engine results (Node Initialization + Self-Discovery),
// produced by Claude earlier in the build sessions. Served by the terminal with
// NO API call, so the engine can be demoed without an ANTHROPIC_API_KEY.
// Shape matches the EngineResult contract the Node Explorer renders.

type Rec = Record<string, unknown>;

const germanium: Rec = {
  input: "Germanium",
  cached: true,
  initialization: {
    initialization_type: "de-novo",
    gate_1: { result: "pass", reasoning: "Reusable industrial object category: a naturally occurring metalloid with upstream recovery, downstream transformation forms, producers, consumers, and connected objects. Not a company, facility, geography, or market." },
    gate_2: { result: "pass", outcome: "D — no existing node found", reasoning: "No canonical/alias match (Germanium, Ge, elemental germanium, germanium metal, ekasilicon) in the store." },
    proposed_class_type: "raw material",
    rejected: false,
    status: "created — pending, sent to Self-Discovery",
  },
  class_node: {
    node_id: "class_node_000001",
    node_name: "Germanium",
    class_type: "raw material",
    basic_identity: {
      common_name: "Germanium",
      alternate_names: ["Germanium metal", "Ekasilicon"],
      abbreviations: ["Ge"],
      technical_names: ["Elemental germanium", "Metallic germanium"],
      chemical_formula: "Ge",
    },
    physical_identity: {
      physical_form_and_appearance: "Solid crystalline metalloid. Lustrous, hard, brittle, grayish-white with a metallic sheen; forms an ordered diamond-cubic crystal. Opaque to visible light but transmits infrared.",
      source_form: "Not mined directly — recovered as a byproduct. Starts as crude germanium concentrate from (a) residues and leach dusts of zinc (sphalerite) refining and (b) germanium-rich coal fly ash.",
      output_forms: ["High-purity germanium metal (zone-refined bars/ingots/lump)", "Germanium dioxide (GeO₂)", "Germanium tetrachloride (GeCl₄)"],
      source_to_sold_process: "Crude concentrate → chlorination to GeCl₄ → fractional distillation (purify) → hydrolysis to GeO₂ → hydrogen reduction to germanium metal → zone refining.",
    },
    core_properties: [
      { property: "Metalloid character", description: "Both metal-like and nonmetal-like behavior; looks metallic but behaves more like a semiconductor." },
      { property: "Semiconductor behavior", description: "Conducts electricity under controlled conditions rather than freely like a metal." },
      { property: "Narrow band gap", description: "Needs relatively little energy to become electrically active compared with many semiconductors." },
      { property: "Photoconductivity", description: "Electrical behavior changes when exposed to light." },
      { property: "Infrared transparency", description: "Passes certain infrared wavelengths while blocking most visible light." },
      { property: "High refractive index", description: "Bends light strongly at material boundaries." },
      { property: "Low infrared dispersion", description: "Transmits infrared without spreading wavelengths apart much." },
      { property: "Crystalline structure", description: "Forms an ordered lattice with a regular atomic arrangement." },
      { property: "High-purity processability", description: "Refinable to very high purity; small impurities change performance." },
      { property: "Dopability", description: "Electrical behavior tunable by adding small amounts of other elements." },
      { property: "Glass-forming oxide behavior", description: "Forms germanium dioxide, a glass-like oxide usable in glass systems." },
      { property: "Chemical convertibility", description: "Converts into commercial forms such as oxide, chloride, and metal." },
    ],
    functions: [
      { function: "Controlled electrical behavior", properties_used: "Semiconductor behavior; narrow band gap; dopability", why_it_matters: "Lets downstream devices control how electricity moves rather than acting as a plain conductor/insulator." },
      { function: "Light-responsive electrical behavior", properties_used: "Photoconductivity; narrow band gap; semiconductor behavior", why_it_matters: "Lets electrical behavior change with light — useful where a device must detect or respond to light." },
      { function: "Infrared light transmission", properties_used: "Infrared transparency", why_it_matters: "Lets infrared light pass through instead of being blocked." },
      { function: "Infrared light focusing / bending", properties_used: "High refractive index; low infrared dispersion", why_it_matters: "Lets infrared be bent and focused without spreading the light out too much." },
      { function: "Stable crystal platform", properties_used: "Crystalline structure; high-purity processability", why_it_matters: "Lets the material form clean, ordered wafers/substrates where performance depends on crystal quality." },
      { function: "Tunable material behavior", properties_used: "Dopability; high-purity processability; semiconductor behavior", why_it_matters: "Lets producers adjust behavior via purity and dopants." },
      { function: "Glass property modification", properties_used: "Glass-forming oxide behavior; chemical convertibility", why_it_matters: "Lets the material become an oxide that mixes into glass and changes its refractive index." },
      { function: "Multiple commercial conversion routes", properties_used: "Chemical convertibility", why_it_matters: "Lets the material move between oxide, chloride, metal, and wafer forms per the downstream route." },
    ],
    downstream_end_products: [
      { function_realization_object: "Multijunction solar cell", class_type: "component", general_functions_used: "Stable crystal platform; controlled electrical behavior", specific_role: "Base wafer that helps the cell absorb more sunlight and operate efficiently in space", node_derived_form: "Germanium substrate wafer", host_object: "Space solar panel / array", host_system: "Satellite / spacecraft", end_use_application: "Power generation for spacecraft", vertical: "Space" },
      { function_realization_object: "Germanium infrared optic", class_type: "component", general_functions_used: "Infrared light transmission; infrared light focusing/bending; precision shaping", specific_role: "Transmits and focuses infrared (heat) so the system can form a thermal image", node_derived_form: "Germanium optical blank", host_object: "Thermal-imaging optical assembly", host_system: "Thermal imager / FLIR", end_use_application: "Night vision and thermal imaging", vertical: "Defense" },
      { function_realization_object: "Optical fiber", class_type: "component", general_functions_used: "Glass property modification; infrared light transmission", specific_role: "Raises the refractive index of the fiber core so light stays confined and travels far", node_derived_form: "Germanium tetrachloride (→ GeO₂ dopant)", host_object: "Fiber-optic cable", host_system: "Telecom / data-center network", end_use_application: "High-bandwidth data transmission", vertical: "Telecom" },
      { function_realization_object: "Near-IR / SWIR photodetector", class_type: "component", general_functions_used: "Light-responsive electrical behavior; controlled electrical behavior", specific_role: "Converts incoming near-IR light into an electrical signal", node_derived_form: "Germanium photodetector material / Ge-on-Si layer", host_object: "Optical transceiver / SWIR sensor", host_system: "Optical interconnect / SWIR camera", end_use_application: "Optical signal detection and SWIR imaging", vertical: "Telecom / Sensing" },
      { function_realization_object: "SiGe RF / BiCMOS device", class_type: "component", general_functions_used: "Controlled electrical behavior; tunable material behavior", specific_role: "Raises carrier speed in the transistor for high-frequency operation", node_derived_form: "SiGe material / wafer", host_object: "RF front-end module / IC", host_system: "Smartphone / 5G base station", end_use_application: "High-frequency signal processing", vertical: "Electronics" },
      { function_realization_object: "PET resin (polyester)", class_type: "product", general_functions_used: "Glass property modification / chemical convertibility (catalytic)", specific_role: "Acts as a low-color polymerization catalyst that yields high-clarity polyester", node_derived_form: "Germanium dioxide (GeO₂)", host_object: "PET bottle / film / fiber", host_system: "Consumer packaging / textiles", end_use_application: "High-clarity PET packaging and fiber", vertical: "Packaging" },
    ],
    scope_boundary: {
      starting: "None — raw-material root; source categories only (coal-ash / zinc-residue recovery streams).",
      ending: "Germanium substrate wafer · germanium tetrachloride · germanium dioxide · germanium optical blank · Ge-on-Si / photodetector material · SiGe material / wafer.",
    },
    uncertainties: [
      "GeO₂ and GeCl₄ are both output forms of germanium AND next-layer children (tagged as both).",
      "Germanium metal being elemental stays an output form only, not a child; its transforms (wafer, blank, Ge-on-Si, SiGe) are the children it feeds.",
      "Detector-grade single-crystal germanium overlaps the substrate-wafer node; boundary to reconcile downstream.",
    ],
  },
  source_categories: [
    { name: "Sphalerite-hosted zinc sulfide deposits", description: "Zinc sulfide ore bodies (MVT/SEDEX/VMS/carbonate-hosted) where germanium substitutes into the sphalerite lattice.", materials_hosted: "Zinc, lead, germanium, indium, cadmium, silver, gallium", source_form: "Trace substituent in sphalerite (not a discrete mineral)", regions: "China (Yunnan), USA (Alaska, Tennessee), DRC, Namibia, Kazakhstan, Peru, Mexico" },
    { name: "Germanium-bearing coal / lignite deposits", description: "Coal (especially lignite) where germanium is organically bound, enriched near basement granite.", materials_hosted: "Coal, germanium, gallium, rare earths, uranium (local)", source_form: "Organically-bound trace element in coal", regions: "China (Inner Mongolia, Yunnan), Russia (Primorsky Krai), Ukraine" },
    { name: "End-of-life Ge products & production scrap", description: "Post-consumer/post-industrial germanium materials and refining scrap (secondary source).", materials_hosted: "Germanium, glass, other metals", source_form: "GeO₂-in-glass, metallic Ge in optics/wafers, Ge in scrap", regions: "Belgium, Germany, USA, Japan, China" },
  ],
  upstream_nodes: [],
  downstream_nodes: [
    { name: "Germanium substrate wafer", class_type: "intermediate material", why_it_qualifies: "Reusable across space solar, LEDs, III-V epitaxy; clear market; first reusable handoff after the germanium output form.", input_form_from_parent: "High-purity germanium metal", grandchild_candidate: "Multijunction solar cell" },
    { name: "Germanium tetrachloride", class_type: "intermediate material", why_it_qualifies: "Traded ultra-pure merchant precursor; also an output form of germanium; branches to fiber doping and Ge recovery.", input_form_from_parent: "Recovered germanium feedstock (also an output form of the parent)", grandchild_candidate: "Optical fiber" },
    { name: "Germanium dioxide", class_type: "intermediate material", why_it_qualifies: "Refined oxide sold to market; also an output form of germanium; feeds GeCl₄, metal reduction, and PET catalysis.", input_form_from_parent: "Recovered germanium feedstock (also an output form of the parent)", grandchild_candidate: "PET resin" },
    { name: "Germanium optical blank", class_type: "intermediate material", why_it_qualifies: "Reusable IR-optics feedstock sold to lens/window fabricators.", input_form_from_parent: "High-purity germanium metal", grandchild_candidate: "Germanium IR lens / window" },
    { name: "Germanium photodetector material / Ge-on-Si layer", class_type: "intermediate material", why_it_qualifies: "Reusable epitaxial layer feeding detectors and transceivers.", input_form_from_parent: "High-purity germanium metal", grandchild_candidate: "Near-IR / SWIR photodetector" },
    { name: "SiGe material / wafer", class_type: "intermediate material", why_it_qualifies: "Reusable across RF/BiCMOS and photonics; distinct market from the pure-Ge wafer.", input_form_from_parent: "High-purity germanium metal", grandchild_candidate: "SiGe RF / BiCMOS device" },
  ],
};

const germaniumDioxide: Rec = {
  input: "Germanium dioxide",
  cached: true,
  initialization: {
    initialization_type: "de-novo",
    gate_1: { result: "pass", reasoning: "A distinct refined compound with its own commercial identity, production route, and downstream uses — a reusable intermediate material, not a company/facility/market." },
    gate_2: { result: "pass", outcome: "D — no existing node found", reasoning: "Related to germanium but a separate compound (Ge vs GeO₂); not an alias." },
    proposed_class_type: "intermediate material",
    rejected: false,
    status: "created — pending, sent to Self-Discovery",
  },
  class_node: {
    node_id: "class_node_000002",
    node_name: "Germanium dioxide",
    class_type: "intermediate material",
    basic_identity: {
      common_name: "Germanium dioxide",
      alternate_names: ["Germanium oxide", "Germania", "Germanic oxide"],
      abbreviations: ["GeO₂"],
      technical_names: ["Germanium(IV) oxide", "Argutite"],
      chemical_formula: "GeO₂",
    },
    physical_identity: {
      physical_form_and_appearance: "White to off-white fine crystalline (or amorphous/glassy) inorganic oxide powder; commonly supplied at 5N–6N purity.",
      source_form: "Produced by germanium refiners from recovered germanium feedstock — by hydrolysis of GeCl₄ or oxidation of germanium concentrate.",
      output_forms: ["High-purity GeO₂ powder (5N–6N)", "Catalyst / PET-grade GeO₂"],
      source_to_sold_process: "Crude concentrate → chlorination/distillation → hydrolysis to GeO₂ (or direct oxidation) → purity grading and packaging.",
    },
    core_properties: [
      { property: "Hydrogen-reducibility", description: "Reduced to elemental germanium by hydrogen at ~1000 °C." },
      { property: "Reversible chloride conversion", description: "Convertible to GeCl₄ with HCl and recoverable back by hydrolysis." },
      { property: "Low-color polycondensation catalysis", description: "Catalyzes polyester formation without imparting yellowing." },
      { property: "High refractive index", description: "~1.99 in the glassy form, higher than fused silica." },
      { property: "Extreme purity availability", description: "Made to 5N–6N where trace metals are disqualifying." },
      { property: "Polymorphism / glass-forming", description: "Hexagonal, tetragonal, and amorphous forms; acts as a network-forming oxide." },
    ],
    functions: [
      { function: "Purified feedstock to germanium metal", properties_used: "Hydrogen-reducibility", why_it_matters: "Standard controllable entry point to high-purity elemental germanium." },
      { function: "Precursor to germanium tetrachloride", properties_used: "Reversible chloride conversion", why_it_matters: "GeCl₄ is the vapor species deposited into fiber cores; GeO₂ is the shippable form feeding it." },
      { function: "PET polymerization catalyst", properties_used: "Low-color polycondensation catalysis", why_it_matters: "Produces clear, high-clarity PET without antimony color." },
      { function: "Refractive-index modifier in glass", properties_used: "High refractive index; polymorphism / glass-forming", why_it_matters: "Raising the core index enables light confinement in telecom fiber." },
    ],
    downstream_end_products: [
      { function_realization_object: "PET resin (polyester)", class_type: "product", general_functions_used: "PET polymerization catalyst", specific_role: "Low-color catalyst yielding high-clarity PET", node_derived_form: "Catalyst-grade GeO₂", host_object: "PET bottle / film", host_system: "Consumer packaging / textiles", end_use_application: "High-clarity PET packaging", vertical: "Packaging" },
      { function_realization_object: "Optical fiber", class_type: "component", general_functions_used: "Refractive-index modifier (via GeCl₄)", specific_role: "Germania doping raises the core refractive index", node_derived_form: "Germanium tetrachloride", host_object: "Fiber-optic cable", host_system: "Telecom network", end_use_application: "Data transmission", vertical: "Telecom" },
      { function_realization_object: "Infrared optics / semiconductor germanium", class_type: "component", general_functions_used: "Purified feedstock to germanium metal", specific_role: "Reduced to high-purity Ge metal, then formed into optics/wafers", node_derived_form: "High-purity germanium metal", host_object: "IR optic / wafer", host_system: "Thermal imager / semiconductor", end_use_application: "IR imaging / electronics", vertical: "Defense / Semiconductors" },
    ],
    scope_boundary: {
      starting: "Germanium (raw material) — GeO₂ is its first refined oxide.",
      ending: "Germanium tetrachloride · high-purity/single-crystal germanium metal · PET resin.",
    },
    uncertainties: [
      "PET use is catalytic (not incorporated) — arguably a terminal application edge rather than a child.",
      "GeCl₄ and germanium metal are both children of GeO₂ and siblings at the intermediate layer; graph topology to reconcile.",
    ],
  },
  source_categories: [],
  upstream_nodes: [
    { name: "Germanium", class_type: "raw material", relationship: "GeO₂ is the first refined oxide of germanium; recovered germanium is captured and purified as GeO₂." },
  ],
  downstream_nodes: [
    { name: "Germanium tetrachloride", class_type: "intermediate material", why_it_qualifies: "Distinct traded volatile precursor with its own supply chain feeding fiber doping.", input_form_from_parent: "High-purity GeO₂ powder", grandchild_candidate: "Optical fiber" },
    { name: "High-purity / single-crystal germanium metal", class_type: "intermediate material", why_it_qualifies: "Reduced and zone-refined from GeO₂; broad reusable market (IR optics, wafers, detectors).", input_form_from_parent: "High-purity GeO₂ powder", grandchild_candidate: "Germanium substrate wafer" },
    { name: "PET resin", class_type: "product", why_it_qualifies: "Function-object-as-child: GeO₂ is used directly as catalyst with no reusable intermediate in the gap.", input_form_from_parent: "Catalyst-grade GeO₂", grandchild_candidate: "PET packaging / bottle" },
  ],
};

const germaniumTetrachloride: Rec = {
  input: "Germanium tetrachloride",
  cached: true,
  initialization: {
    initialization_type: "de-novo",
    gate_1: { result: "pass", reasoning: "A discrete, commercially traded ultra-high-purity chemical intermediate (fiber-grade precursor) — a reusable intermediate material, not a company/facility/market." },
    gate_2: { result: "pass", outcome: "D — no existing node found", reasoning: "Related to germanium but a chemically distinct compound (GeCl₄ vs Ge); not an alias." },
    proposed_class_type: "intermediate material",
    rejected: false,
    status: "created — pending, sent to Self-Discovery",
  },
  class_node: {
    node_id: "class_node_000003",
    node_name: "Germanium tetrachloride",
    class_type: "intermediate material",
    basic_identity: {
      common_name: "Germanium tetrachloride",
      alternate_names: ["Germanium(IV) chloride", "Germanium chloride", "Tetrachlorogermane"],
      abbreviations: ["GeCl₄"],
      technical_names: ["Germanium(IV) chloride"],
      chemical_formula: "GeCl₄",
    },
    physical_identity: {
      physical_form_and_appearance: "Colorless, volatile, fuming liquid (boiling point ~83 °C) with a sharp acidic odor; fumes in moist air.",
      source_form: "Produced by chlorinating germanium feedstock (metal, oxide, or concentrate) with chlorine / HCl.",
      output_forms: ["Fiber-grade (6N–7N) germanium tetrachloride"],
      source_to_sold_process: "Germanium feed + Cl₂/HCl → chlorination → fractional distillation to 6N–7N → moisture-excluded packaging.",
    },
    core_properties: [
      { property: "Volatility / low boiling point", description: "Vaporizes readily (~83 °C), giving appreciable vapor pressure at modest temperatures." },
      { property: "Distillable to ultra-high purity", description: "Fractional distillation removes metal/transition-element impurities to 6N–7N." },
      { property: "Hydrolysis to GeO₂", description: "Reacts with moisture: GeCl₄ + 2H₂O → GeO₂ + 4HCl." },
      { property: "Clean oxidation to GeO₂", description: "Oxidizes at high temperature to deposit germanium dioxide." },
      { property: "Corrosive / moisture-sensitive", description: "Releases HCl with water; requires dry, inert handling." },
    ],
    functions: [
      { function: "Vapor-phase dopant delivery", properties_used: "Volatility / low boiling point", why_it_matters: "Can be metered as a gas into deposition reactors for precise, reproducible doping." },
      { function: "Ultra-purification carrier", properties_used: "Distillable to ultra-high purity", why_it_matters: "Delivers germanium free of impurities that would cause optical loss in fiber." },
      { function: "In-situ conversion to GeO₂", properties_used: "Clean oxidation to GeO₂; hydrolysis to GeO₂", why_it_matters: "Deposits the germania that raises the fiber core's refractive index." },
    ],
    downstream_end_products: [
      { function_realization_object: "Optical fiber", class_type: "component", general_functions_used: "Vapor-phase dopant delivery; ultra-purification carrier; in-situ conversion to GeO₂", specific_role: "Germanium doping raises the core refractive index so the fiber guides light with low loss", node_derived_form: "Germania (GeO₂) doped into silica core", host_object: "Fiber-optic cable", host_system: "Telecom / data-center network", end_use_application: "High-bandwidth data transmission", vertical: "Telecom" },
    ],
    scope_boundary: {
      starting: "Germanium (raw material) — GeCl₄ is its chlorinated/purified derivative.",
      ending: "Optical fiber.",
    },
    uncertainties: [
      "Fiber-grade purity nomenclature varies by supplier (6N vs 7N).",
      "GeCl₄'s germanium-recovery/purification loop back to germanium is process-route context, not a child.",
    ],
  },
  source_categories: [],
  upstream_nodes: [
    { name: "Germanium", class_type: "raw material", relationship: "GeCl₄ is the volatile purified derivative of germanium feedstock, made by chlorination and distillation." },
  ],
  downstream_nodes: [
    { name: "Optical fiber", class_type: "component", why_it_qualifies: "Nearest reusable market object that carries GeCl₄'s doping function into the market; branches to telecom, datacom, specialty fibers. The doped preform is a process-route artifact, not the child.", input_form_from_parent: "Fiber-grade (6N–7N) germanium tetrachloride", grandchild_candidate: "Fiber-optic cable" },
  ],
};

/** normalized-name → result */
const BY_KEY: Record<string, Rec> = {};
function register(rec: Rec, aliases: string[]) {
  for (const a of aliases) BY_KEY[a.toLowerCase().trim()] = rec;
}
register(germanium, ["germanium", "ge", "elemental germanium", "germanium metal", "ekasilicon"]);
register(germaniumDioxide, ["germanium dioxide", "geo2", "geo₂", "germanium oxide", "germania", "germanium(iv) oxide"]);
register(germaniumTetrachloride, ["germanium tetrachloride", "gecl4", "gecl₄", "germanium chloride", "germanium(iv) chloride", "tetrachlorogermane"]);

export function lookupCached(input: string): Rec | null {
  return BY_KEY[input.toLowerCase().trim()] ?? null;
}

export const CACHED_NAMES = ["Germanium", "Germanium dioxide", "Germanium tetrachloride"];
