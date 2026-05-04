# Universal Node List (Deduplicated)

98 total keys across 3 data files. After deduplication: ~78 unique entities.

## Duplicates Identified

| Keep | Remove (merge into kept) | Reason |
|------|--------------------------|--------|
| Amazon | Amazon / AWS | Same entity |
| Google | Google / Alphabet | Same entity |
| Microsoft | Microsoft / Azure | Same entity |
| Various State Operators | Various State Ops | Same entity, different name |
| Umicore | Umicore GeCl4 | Same facility, different role |
| Yunnan Chihong | Yunnan Chihong GeCl4, Yunnan Chihong Refinery | Same company, different stages |
| JSC Germanium | JSC Germanium GeCl4, JSC Germanium Refinery | Same company, different stages |
| Chinese State Refiners | Smaller Chinese Refiners | Same aggregate |
| Chinese Primary Supply | China Supply, China Primary Supply | Same aggregate |

## Output/Specification Nodes (not real entities)

- AI Datacenter (output node)
- Optical Fiber Strand (output node)
- Datacenter Cable (cable spec)
- Deployed Fiber Network (output)
- Terrestrial Long-Haul (cable spec)
- Subsea Cable (cable spec)
- Global Supply (aggregate)
- Global AI Datacenter Capacity (output)
- Germanium Metal (commodity)
- Western Recycled Supply (aggregate)
- Western Refined Supply (aggregate)
- Hyperscaler In-House (internal team)
- Hyperscaler Self-Build (internal program)

## Deduplicated Entity List (78 nodes)

### Germanium Chain — Deposits (8)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Lincang | Deposit | China | nodes.json |
| Wulantuga | Deposit | China | nodes.json |
| Yimin | Deposit | China | nodes.json |
| Huize | Deposit | China | nodes.json |
| Yiliang + SYGT | Deposit | China | nodes.json |
| Red Dog | Deposit | USA | nodes.json |
| Spetsugli | Deposit | Russia | nodes.json |
| Big Hill | Deposit | DRC | nodes.json |

### Germanium Chain — Operations (6)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Lincang Xinyuan | Miner | China | nodes.json |
| Shengli Coal Group | Miner | China | nodes.json |
| Yunnan Chihong | Miner/Refiner/Converter | China | nodes.json |
| Teck Resources | Miner | Canada | nodes.json |
| STL / Gecamines | Host Operation | DRC | nodes.json |
| Various State Operators | Host Operation | China | germanium-nodes.json |

### Germanium Chain — Refiners (5)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Umicore | Refiner/Converter | Belgium | nodes.json |
| 5N Plus | Refiner | Canada | nodes.json |
| PPM Pure Metals | Refiner | Germany | nodes.json |
| JSC Germanium | Refiner/Converter | Russia | nodes.json |
| Chinese State Refiners | Refiner (aggregate) | China | germanium-nodes.json |
| Blue Moon Metals | Refiner | USA | germanium-nodes.json |
| Lincang Xinyuan Refinery | Refinery | China | nodes.json |

### Fiber Chain — Converters (1, merged into refiners above)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Chinese State GeCl4 Plants | Converter | China | nodes.json |

### Fiber Chain — Manufacturers (6)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Corning | Manufacturer | USA | nodes.json |
| YOFC | Manufacturer | China | nodes.json |
| Shin-Etsu | Manufacturer | Japan | nodes.json |
| Prysmian | Manufacturer | Italy | nodes.json |
| Sumitomo Electric | Manufacturer | Japan | nodes.json |
| Fujikura | Manufacturer | Japan | nodes.json |

### Fiber Chain — Assemblers & Infrastructure (6)
| Node | Type | Country | Source |
|------|------|---------|--------|
| CommScope | Assembler | USA | nodes.json |
| AFL | Assembler | USA | nodes.json |
| Vertiv | Infrastructure | USA | nodes.json |
| Schneider Electric | Infrastructure | France | nodes.json |
| SubCom | Subsea cable | USA | nodes.json |
| Alcatel SN | Subsea cable | France | nodes.json |
| NEC | Subsea cable | Japan | nodes.json |

### End Use — Hyperscalers (7)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Amazon | Hyperscaler | USA | nodes.json |
| Microsoft | Hyperscaler | USA | nodes.json |
| Google | Hyperscaler | USA | nodes.json |
| Meta | Hyperscaler | USA | nodes.json |
| Oracle | Hyperscaler | USA | nodes.json |
| xAI | Hyperscaler | USA | nodes.json |
| Equinix | Colocation | USA | nodes.json |
| CoreWeave | AI cloud | USA | nodes.json |
| Digital Realty | Colocation | USA | nodes.json |
| G42 | Sovereign AI | UAE | nodes.json |
| NEOM / PIF | Sovereign | Saudi Arabia | nodes.json |

### End Use — Construction & Installation (7)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Dycom Industries | Installer | USA | nodes.json |
| MasTec | Installer | USA | nodes.json |
| MYR Group | Installer | USA | nodes.json |
| Wesco International | Distributor | USA | nodes.json |
| Turner Construction | Constructor | USA | nodes.json |
| Mortenson | Constructor | USA | nodes.json |
| DPR Construction | Constructor | USA | nodes.json |
| Holder Construction | Constructor | USA | nodes.json |
| AECOM | Engineering | USA | nodes.json |

### Gallium Chain — Sources (5)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Guinea Bauxite | Byproduct Source | Guinea | gallium-nodes.json |
| Australian Bauxite | Byproduct Source | Australia | gallium-nodes.json |
| Chinese Domestic Bauxite | Byproduct Source | China | gallium-nodes.json |
| Brazilian Bauxite | Byproduct Source | Brazil | gallium-nodes.json |
| Indonesian Bauxite | Byproduct Source | Indonesia | gallium-nodes.json |

### Gallium Chain — Refineries & Refiners (9)
| Node | Type | Country | Source |
|------|------|---------|--------|
| Chinese Bauxite Refineries | Primary Producer | China | gallium-nodes.json |
| Alcoa / JAGA (Wagerup) | Primary Producer | Australia | gallium-nodes.json |
| Alcoa Corporation | Primary Producer | USA | gallium-nodes.json |
| Metlen Energy & Metals | Primary Producer | Greece | gallium-nodes.json |
| Rio Tinto / Indium JV | Primary Producer | Canada | gallium-nodes.json |
| Korea Zinc / Crucible JV | Primary Producer | USA | gallium-nodes.json |
| Nyrstar Tennessee | Primary Producer | USA | gallium-nodes.json |
| Dowa Holdings | Refiner | Japan | gallium-nodes.json |
| Indium Corporation | Refiner | USA | gallium-nodes.json |
| Vital Materials | Refiner | China | gallium-nodes.json |
| Zhuzhou Smelter Group | Refiner | China | gallium-nodes.json |

### Special Nodes (non-chain entities with briefs)
| Node | Type | Country | Source |
|------|------|---------|--------|
| LightPath Technologies | Device Manufacturer | USA | germanium-nodes.json |
| Germanium Metal | Commodity | Global | germanium-nodes.json |
