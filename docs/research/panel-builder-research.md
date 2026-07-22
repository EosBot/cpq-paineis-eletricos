# Electrical Panel Assembly & CPQ/Configuration Systems — Research Document

**Date:** July 2026  
**Purpose:** Inform the architecture and design of a CPQ Panel Builder tool for industrial electrical panel manufacturers.

---

## Table of Contents

1. [Electrical Panel Assembly Process](#1-electrical-panel-assembly-process)
2. [Electrical Norms and Standards](#2-electrical-norms-and-standards)
3. [CPQ Competitors for Electrical Panels](#3-cpq-competitors-for-electrical-panels)
4. [Panel Structure and Layout](#4-panel-structure-and-layout)
5. [Pricing Models for Custom Panels](#5-pricing-models-for-custom-panels)
6. [3D Visualization for Panels](#6-3d-visualization-for-panels)
7. [Actionable Insights for CPQ Panel Builder](#7-actionable-insights-for-cpq-panel-builder)
8. [Data Model Recommendations](#8-data-model-recommendations)
9. [References](#9-references)

---

## 1. Electrical Panel Assembly Process

### 1.1 Standard Stages/Steps

The typical electrical panel assembly workflow follows these stages:

| Stage | Description | Key Output |
|-------|-------------|------------|
| **1. Specification** | Define electrical requirements, I/O count, power distribution needs, environmental conditions | Technical specification document |
| **2. Schematic Design** | Create electrical schematics (single-line, control circuit, power circuit) | Eschematic diagrams |
| **3. Enclosure Selection** | Choose enclosure type, size, IP rating, material | Enclosure model & dimensions |
| **4. Component Selection** | Select breakers, contactors, relays, PLCs, terminals, power supplies | Bill of materials (BOM) |
| **5. Layout Design** | Place components on DIN rails inside enclosure, route wiring ducts | 2D/3D layout model |
| **6. Wiring & Assembly** | Physical assembly: mount rails, place components, wire connections | Physical panel |
| **7. Testing & QA** | Insulation test, continuity test, functional test, hi-pot test | Test certificate |
| **8. Documentation** | As-built drawings, wiring diagrams, component labels, manuals | Final documentation package |

### 1.2 Typical Workflow

```
Specification → Schematic Design → Enclosure Selection → Component Placement → 
Rail Mounting → Wiring → Testing → Documentation → Delivery
```

### 1.3 Component Categories

| Category | Examples | Function |
|----------|----------|----------|
| **Circuit Breakers** | MCB, MCCB, ACB, RCBO | Overcurrent protection |
| **Contactors** | 3-pole, 4-pole, reversing | Motor/power switching |
| **Relays** | Thermal overload, time delay, auxiliary | Control/protection logic |
| **Terminal Blocks** | Screw, spring-cage, fuse, ground | Wire connection points |
| **PLCs** | Compact, modular, safety-rated | Automation control |
| **Power Supplies** | 24VDC, 48VDC, DC-DC converters | Control voltage supply |
| **Enclosures** | Wall-mount, floor-mount, modular | Physical housing |
| **DIN Rails** | TS35, C-section, G-section | Component mounting |
| **Wiring Ducts** | Slotted, solid, finger-type | Cable management |
| **HMI/Displays** | Touch panels, push buttons, indicator lights | Operator interface |

---

## 2. Electrical Norms and Standards

### 2.1 NR-10 (Brazil)

**NR-10** (Norma Regulamentadora 10) is the Brazilian safety standard for electrical installations and services involving electricity.

**Key requirements:**
- Safety training (40-hour course for qualified workers)
-锁out/tagout (LOTO) procedures
- Personal protective equipment (PPE) requirements
- Safety signaling and barricading
- Risk assessment and emergency procedures
- Compliance documentation (Prontuário de Instalações Elétricas - PIE)

**Impact on panel configuration:**
- Enforces minimum safe clearances
- Requires specific labeling and warning signs
- Mandates use of certified components
- Requires documentation of safety procedures

### 2.2 NBR 5410 (Brazil)

**NBR 5410** governs low-voltage electrical installations (up to 1000V AC / 1500V DC) in buildings.

**Key requirements:**
- Circuit separation (lighting, outlets, dedicated)
- Conductor sizing based on current capacity and voltage drop
- Protection against overcurrent and earth leakage
- Earthing system requirements (TN, TT, IT)
- Residual current device (RCD) installation

**Impact on panel configuration:**
- Defines minimum wire gauges
- Specifies protection device coordination
- Requires earth fault protection
- Mandates circuit identification

### 2.3 IEC 61439 (International)

**IEC 61439** is the primary international standard for low-voltage switchgear and controlgear assemblies (replaces the older IEC 60439).

**Key requirements:**
- **Part 1:** General rules for type-tested (TTA) and partially type-tested (PTTA) assemblies
- **Part 2:** Power switchgear and controlgear assemblies
- **Part 3:** Distribution boards
- **Part 4:** Construction site assemblies (ACS)
- **Part 5:** Power distribution assemblies
- **Part 6:** Busbar trunking systems

**Technical requirements:**
- Temperature rise limits (max 70K for copper)
- Short-circuit withstand strength
- Clearance and creepage distances
- Degree of protection (IP rating)
- Electromagnetic compatibility (EMC)
- Mechanical operation and durability

**Impact on panel configuration:**
- Mandates thermal verification for assemblies >100A
- Requires short-circuit rated component selection
- Defines minimum IP ratings for different environments
- Enforces clearance/creepage distances based on voltage and pollution degree

### 2.4 Additional Standards

| Standard | Description | Relevance |
|----------|-------------|-----------|
| **IEC 60204-1** | Safety of machinery — Electrical equipment of machines | Machine control panels |
| **IEC 60529** | Degrees of protection (IP Code) | Enclosure selection |
| **IEC 60715** | Dimensions for DIN rail mounting | Component dimensions |
| **NEMA 250** | Enclosure types (North America) | Enclosure selection |
| **UL 508A** | Industrial control panels (USA) | Panel certification |
| **NR-12** | Machine safety (Brazil) | Safety-related control systems |

---

## 3. CPQ Competitors for Electrical Panels

### 3.1 EPLAN (by Friedhelm Loh Group / Rittal)

**EPLAN** is the market leader in electrical engineering software for panel building.

#### EPLAN Electric P8
- **Purpose:** Schematic design and electrical documentation
- **Features:**
  - Automatic wire numbering and cross-referencing
  - Template-based project generation
  - Integration with EPLAN Data Portal (millions of component data sets)
  - Fluid power engineering (pneumatic, hydraulic, cooling)
  - PLC connection diagrams
  - Automatic BOM generation
  - ERP/PDM integration
- **Pricing:** Subscription license (12-36 months), annual version updates
- **Users:** 525,000+ worldwide

#### EPLAN Pro Panel
- **Purpose:** 3D panel layout and digital twin creation
- **Features:**
  - 3D enclosure layout from schematic data
  - Automatic wire length calculation
  - Cable duct fill-level verification
  - Drilling/milling data generation
  - Thermal and EMC clearance checking
  - Integration with Rittal RiPanel configurator
  - Mounting and wiring data export
- **Impact:** 8× faster 3D layout creation (customer testimonials)

#### EPLAN Data Portal
- **Purpose:** Central component database
- **Manufacturers:** 550+ (Siemens, ABB, Eaton, Schneider, Rittal, Phoenix Contact, etc.)
- **Components:** 2.3M static, 4M+ configurable
- **Data per component:** Commercial data, technical data, schematic macros, 3D models, datasheets

### 3.2 Rittal

**Rittal** is the global leader in enclosure systems and provides integrated configuration tools.

#### Rittal RiPanel
- **Purpose:** 3D configuration of Rittal enclosures
- **Features:**
  - 3D enclosure selection and layout
  - Component placement with collision detection
  - Integration with EPLAN Pro Panel
  - Automatic accessory suggestions (mounting plates, rails, etc.)
  - Drilling pattern generation
  - BOM and order list generation
  - Direct ordering from configurator

#### Rittal RiCAD
- **Purpose:** 2D enclosure design with standard components
- **Focus:** Simpler panels, faster design time

#### Rittal Automation Systems (RAS)
- **Purpose:** Automated panel production
- **Products:**
  - Perforating stations (for enclosure machining)
  - Wire processing machines (cut, strip, crimp)
  - Control systems for automated assembly

### 3.3 Schneider Electric

**Schneider Electric** offers several tools for panel builders:

#### EcoStruxure Machine Expert
- Configuration software for Schneider control products
- Integration with Vijeo Designer for HMI configuration
- Variable drive sizing and selection

#### PanelStruxure
- Cloud-based panel design and documentation
- Integration with Schneider product catalog
- Collaborative design environment

#### Ecodial (now Electrical Design Software)
- Electrical calculation and sizing software
- Cable sizing, protection coordination
- Short-circuit current calculations
- Automatic single-line diagram generation

### 3.4 Eaton

**Eaton** provides PanelBuilder (now part of their broader portfolio):

#### Eaton PanelBuilder
- **Purpose:** Configuration tool for Eaton assembles
- **Features:**
  - Product selection from Eaton catalog
  - Compliance checking against UL 508A
  - BOM generation
  - Documentation package creation
  - Integration with Eaton's ordering system

### 3.5 Siemens

**Siemens** offers tools through SIMATIC and TIA Portal ecosystem:

#### SIMATIC S7 + TIA Selection Tool
- PLC and HMI selection
- Integration with TIA Portal engineering framework
- Automation product configuration

#### SIMARIS
- Electrical design and calculation software
- Network calculation,短路 current, selectivity
- Single-line diagram generation
- Cable sizing according to IEC/NEC

#### SIMATIC Panel PC Configurator
- Selection of Siemens industrial panels (HMI panels)
- Integration with TIA Portal

### 3.6 ABB

**ABB** provides tools through their CPQ ecosystem:

#### ABB CPQ (formerly.Configure One / Tacton integration)
- Product configuration for ABB panels
- Integration with ABB product catalog
- Pricing and quoting automation
- Document generation

#### Panel Builder Solutions
- Support for ABB MNS, ArTu, and other panel systems
- 3D layout capabilities
- Integration with ABB component data

---

## 4. Panel Structure and Layout

### 4.1 Standard Enclosure Sizes

#### Wall-Mount Enclosures

| Width (mm) | Height (mm) | Depth (mm) | Typical Application |
|------------|-------------|-------------|---------------------|
| 300-400 | 300-400 | 150-200 | Small control boxes, junction boxes |
| 400-600 | 400-600 | 200-300 | Light industrial, building automation |
| 600-800 | 600-800 | 250-350 | Standard control panels |
| 800-1000 | 800-1000 | 300-400 | Medium control panels |
| 1000-1200 | 1000-1200 | 400-500 | Large control panels |

#### Floor-Mount Enclosures

| Width (mm) | Height (mm) | Depth (mm) | Typical Application |
|------------|-------------|-------------|---------------------|
| 600-800 | 1800-2200 | 400-600 | MCC (Motor Control Centers) |
| 800-1000 | 1800-2200 | 500-800 | Power distribution panels |
| 1000-1200 | 2000-2400 | 600-1000 | Large switchgear assemblies |
| 1200-2400 | 2000-2400 | 800-1200 | Modular switchgear |

### 4.2 DIN Rail Layout

#### Standard DIN Rail Types (IEC 60715)

| Type | Dimensions | Use Case |
|------|------------|----------|
| **Top Hat (TS35)** | 35 × 7.5 mm | Standard control components |
| **Top Hat (TS35 deep)** | 35 × 15 mm | Larger components, more rigid |
| **C-Section** | C20, C30, C40, C50 | Heavy components |
| **G-Section** | G32 | Very heavy components |
| **Miniature** | 15 × 5.5 mm | Small junction boxes |
| **Wide Top Hat** | 75 mm | Special applications |

#### Module Width System

- **1 Module = 18 mm** (industry standard)
- Components are designed in module multiples
- Common sizes: 1M, 2M, 3M, 4M, 6M, 12M, 24M
- Enclosure DIN rail length often specified in modules (e.g., "20-module rail")

#### Typical Rail Layout in a Panel

```
┌─────────────────────────────────────────────┐
│  Enclosure Interior                          │
│  ┌─────────────────────────────────────┐    │
│  │  DIN Rail 1 (Top) - Power section    │    │
│  │  [MCB] [MCB] [Contactor] [Contactor]│    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  DIN Rail 2 (Middle) - Control section│    │
│  │  [PLC] [PSU] [Relay] [Relay] [Relay]│    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  DIN Rail 3 (Bottom) - Terminal section│   │
│  │  [Terminal] [Terminal] [Terminal]...│    │
│  └─────────────────────────────────────┘    │
│  Wiring Ducts (left and right sides)        │
└─────────────────────────────────────────────┘
```

### 4.3 Component Placement Rules

#### Clearance Requirements

| Parameter | Minimum Distance | Standard |
|-----------|-----------------|----------|
| Between live parts (LV) | 5-8 mm | IEC 60664-1 |
| Between live part and earth | 5-8 mm | IEC 60664-1 |
| Between different voltage circuits | Per insulation coordination | IEC 60664-1 |
| Above/below wiring ducts | 20-30 mm | Manufacturer |
| Around heat-generating components | 50-100 mm | Thermal derating |
| For component removal | 50-80 mm above | Maintenance access |

#### Heat Dissipation Considerations

- Hot components (VFDs, power supplies, braking resistors) should be placed at the top (heat rises)
- Maintain minimum 50mm clearances around devices with cooling fins
- Use thermal calculation for enclosed panels (IEC 61439 requires verification for >100A)
- Forced ventilation or air conditioning may be needed for high heat loads

#### Grouping Principles

1. **Power Section:** Main circuit breakers, power distribution, high-current paths
2. **Control Section:** PLCs, relays, control power supplies, fuses
3. **Terminal Section:** Field wiring terminals (power, signal, communication)
4. **Communication Section:** Ethernet switches, protocol converters

### 4.4 Wiring Ducts

| Type | Width (mm) | Use Case |
|------|------------|----------|
| Mini duct | 20-25 | Small control boxes |
| Standard duct | 30-40 | Standard control panels |
| Wide duct | 50-100 | Large panels, high wire count |
| Finger duct | Variable | Wire routing flexibility |

---

## 5. Pricing Models for Custom Panels

### 5.1 Cost Breakdown Structure

A typical custom panel price is calculated as:

```
Total Price = Material Cost + Labor Cost + Overhead + Profit Margin

Material Cost = Σ(Component Price × Quantity) + Enclosure + Consumables
Labor Cost = Assembly Hours × Hourly Rate + Testing Hours × Hourly Rate
Overhead = Facility + Tools + Quality + Administration
Profit Margin = (Material + Labor + Overhead) × Markup %
```

### 5.2 Component Cost Factors

| Factor | Impact on Price |
|--------|-----------------|
| **Brand** | Premium brands (ABB, Siemens, Schneider) vs. Generic |
| **Volume** | Price breaks at quantity thresholds |
| **Availability** | Stock vs. lead time surcharge |
| **Certification** | UL/CE certified components cost more |
| **Customization** | Modified components (auxiliary contacts, coils) |

### 5.3 Typical Markup Structure

| Panel Type | Material Markup | Labor Rate (USD/hr) |
|------------|-----------------|---------------------|
| Simple (junction box) | 20-30% | $40-60 |
| Standard control panel | 25-40% | $50-80 |
| Complex (PLC/VFD) | 20-35% | $60-100 |
| MCC/Switchgear | 15-25% | $70-120 |

### 5.4 Labor Estimation Rules of Thumb

| Panel Complexity | Estimated Assembly Hours |
|-----------------|--------------------------|
| Simple (< 20 components) | 8-16 hours |
| Medium (20-60 components) | 20-60 hours |
| Complex (60-150 components) | 60-150 hours |
| Very Complex (150+ components) | 150-300+ hours |

### 5.5 Inventory Turnover Impact

- **High-turnover components** (standard breakers, terminals, DIN rails): Lower cost, better availability
- **Specialty components** (custom PLCs, branded VFDs): Higher cost, longer lead times
- **Generic alternatives:** Can reduce material cost 20-40% on non-critical components
- **Just-in-time purchasing:** Reduces inventory cost but increases lead time risk

---

## 6. 3D Visualization for Panels

### 6.1 How Competitors Render Panels in 3D

| Tool | 3D Capabilities | Level of Detail |
|------|-----------------|-----------------|
| **EPLAN Pro Panel** | Full 3D enclosure + component models | Exact manufacturer models |
| **Rittal RiPanel** | Rittal enclosures with exact geometry | Rittal-specific catalog |
| **Autodesk Inventor** | Mechanical 3D with electrical data | Generic/simplified models |
| **SolidWorks Electrical** | 3D panel layout | Generic + manufacturer content |
| **Eaton PanelBuilder** | 2D/3D representation | Eaton product catalog |

### 6.2 Level of Detail Required

#### For Sales/Quoting (CPQ Level)
- **Goal:** Visual confirmation, space validation, customer communication
- **Detail:** Generic block models with correct dimensions and approximate appearance
- **File size:** Lightweight (hundreds of KB per model)
- **Render time:** Real-time or near real-time
- **Requirements:**
  - Correct physical dimensions
  - Appropriate color/materials
  - Basic visual distinction between component types
  - Mounting behavior (snap to DIN rail)

#### For Engineering/Manufacturing
- **Goal:** Exact representation, collision detection, manufacturing data
- **Detail:** High-fidelity manufacturer-specific models
- **File size:** Larger (MB per model)
- **Render time:** Acceptable slower rendering
- **Requirements:**
  - Exact geometry including terminals and connection points
  - Mounting dimensions and clearances
  - Connection point locations for wire routing
  - Manufacturer metadata

### 6.3 Handling Brand Switching (Same Form Factor, Different Manufacturer)

This is a critical challenge for CPQ systems. The approach used by market leaders:

1. **Form-Factor Grouping:** Group components by physical dimensions and mounting type
   - Example: "1-module circuit breaker" (18mm wide, DIN rail mount)
   - Generic model represents the form factor
   - Brand switching changes metadata (price, specs) but not geometry

2. **Configurable Models:** Parametric 3D models that can be adjusted
   - Width in modules (1M, 2M, 3M, etc.)
   - Number of poles (1P, 2P, 3P, 4P)
   - Terminal types (screw, spring-cage)

3. **Tiered Model Strategy:**
   - Tier 1: Exact models for top 20% most-used components (covers 80% of use)
   - Tier 2: Generic substitutes based on form-factor class
   - Tier 3: Placeholder blocks with correct bounding box

4. **Metadata-Centric Approach:**
   - Store component as data record first
   - 3D representation is a visualization concern
   - Brand switch = metadata swap, minimal geometry change

### 6.4 Technologies for Web-Based 3D

| Technology | Pros | Cons |
|------------|------|------|
| **Three.js** | Free, web-native, large community | Requires 3D models |
| **Babylon.js** | Microsoft-backed, good tooling | Steeper learning curve |
| **WebGL (low-level)** | Maximum control | High development cost |
| **glTF/GLB format** | Compact, PBR materials | Requires conversion pipeline |
| **3D Tiles (Cesium)** | Streaming large models | Overkill for single panels |
| **CAD Exchanger** | STEP/IGES conversion | Commercial license |
| **Autodesk Platform Services** | Cloud-based CAD processing | Vendor lock-in, cost |

---

## 7. Actionable Insights for CPQ Panel Builder

### 7.1 Step-by-Step Configurator Flow

Based on competitor analysis, the optimal configuration flow is:

```
Step 1: Project Setup
  ├── Panel type selection (wall-mount, floor-mount, modular)
  ├── Environmental conditions (IP rating, temperature, hazards)
  └── Basic dimensions or auto-sized by component count

Step 2: Enclosure Selection
  ├── Visual selection from catalog
  ├── Auto-suggest based on component count
  └── Manual override for specific requirements

Step 3: Schematic/Power Distribution Input
  ├── Define circuits (power, control, signal)
  ├── Specify loads (motor power, I/O count)
  └── Automatic component sizing (breakers, wire gauges)

Step 4: Component Selection
  ├── Browse/search component catalog
  ├── Filter by category, brand, specifications
  ├── Auto-place on optimal DIN rail position
  └── Manual drag-and-drop placement

Step 5: Layout Validation
  ├── Space availability check
  ├── Thermal clearance verification
  ├── Weight distribution check
  └── Wire duct fill-level check

Step 6: 3D Visualization
  ├── Real-time 3D render of panel interior
  ├── Exploded view option
  ├── Component highlighting and details
  └── Export to standard 3D formats

Step 7: Pricing
  ├── Automatic BOM generation
  ├── Component pricing (with markup rules)
  ├── Labor estimation
  └── Quote document generation

Step 8: Documentation
  ├── Schematic diagrams
  ├── Panel layout drawings
  ├── BOM with supplier info
  └── Assembly instructions
```

### 7.2 What Competition Does Well

| Strength | Example | Lesson for CPQ |
|----------|---------|----------------|
| Component data ecosystem | EPLAN Data Portal (550+ manufacturers) | Build or integrate with rich component database |
| 3D digital twin | EPLAN Pro Panel | 3D visualization drives sales and reduces errors |
| Integration with ERP | Most competitors | Seamless data flow from quote to production |
| Manufacturer configurators | Rittal RiPanel | Integration with enclosure manufacturer data |
| Thermal validation | EPLAN Pro Panel | Automated clearance checking builds trust |
| Template-based design | EPLAN Electric P8 | Reuse speeds up quoting for standard panels |

### 7.3 What Competition Does Poorly

| Weakness | Example | Opportunity |
|----------|---------|-------------|
| Steep learning curve | EPLAN (requires extensive training) | Simpler, guided configuration flow |
| Desktop-only tools | EPLAN Electric P8 (Windows) | Web-based, accessible anywhere |
| Complex pricing | EPLAN (expensive licensing) | Transparent, affordable pricing |
| Slow setup | Most competitors (hours to configure) | Quick start templates |
| Limited brand choice | Proprietary catalogs | Open catalog with multi-brand support |
| Poor mobile experience | Almost all competitors | Mobile-responsive design |
| No integrated CPQ/Quoting | Most focus on engineering design | Unified design-to-quote workflow |

### 7.4 Key Differentiators to Pursue

1. **Web-Based Accessibility:** No installation, works in browser
2. **Fast Configuration:** 30-minute panel configuration (vs. days with EPLAN)
3. **Integrated CPQ:** Seamless flow from design to quote to order
4. **Brazilian Market Focus:** NR-10, NBR 5410 compliance built-in
5. **Multi-Brand catalog:** Flexibility in component choice
6. **Affordable Pricing:** Suitable for small-to-medium panel builders
7. **3D Visualization:** Immediate visual feedback during configuration

---

## 8. Data Model Recommendations

### 8.1 Core Entities for CPQ Panel Builder

```
┌─────────────────┐     ┌──────────────────┐
│   Tenant         │     │   Customer       │
│  (Manufacturer)  │     │  (B2B Account)   │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         │    ┌──────────────────┘
         │    │
         ▼    ▼
┌─────────────────┐     ┌──────────────────┐
│   Quote          │────▶│   QuoteVersion   │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│   Configuration  │────▶│ ConfigSnapshot   │
└────────┬────────┘     └──────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────────┐
│BOM     │ │ PanelLayout│
└────────┘ └────────────┘
```

### 8.2 Component Catalog Model

```yaml
Component:
  - id: UUID
  - category: enum [breaker, contactor, relay, terminal, plc, psu, enclosure, din_rail, duct, hmi]
  - brand: string
  - manufacturer: string
  - model_number: string
  - description: string
  - specifications: JSON (voltage, current, poles, etc.)
  - dimensions: { width_mm, height_mm, depth_mm, weight_g }
  - module_width: int (in 18mm modules, 0 if N/A)
  - mounting_type: enum [din_rail, plate, flange, direct]
  - price: { amount, currency, valid_from, valid_to }
  - supplier_info: { lead_time_days, min_order_qty, availability }
  - certifications: [string] (UL, CE, CCC, etc.)
  - replacements: [UUID] (alternative components)
  - form_factor_group: string (for 3D model substitution)
  - rules: [RuleCompatibility] (validation rules)
  - created_at: datetime
  - updated_at: datetime
```

### 8.3 Configuration/Panel Model

```yaml
Configuration:
  - id: UUID
  - tenant_id: UUID
  - customer_id: UUID
  - quote_id: UUID
  - name: string
  - status: enum [draft, validated, quoted, approved, production]
  - panel_type: enum [wall_mount, floor_mount, modular]
  - enclosure: { model_id, width_mm, height_mm, depth_mm, ip_rating, material }
  - components: [ComponentPlacement]
  - din_rails: [RailDefinition]
  - wiring_ducts: [DuctDefinition]
  - power_specs: { supply_voltage, supply_phases, total_load_a, short_circuit_rating }
  - environmental: { ambient_temp_c, ip_rating, indoor_outdoor }
  - clearances: [ClearanceCheck]
  - thermal_calc: { total_heat_w, cooling_required, cooling_method }
  - total_weight_kg: float
  - created_by: UUID
  - created_at: datetime
  - updated_at: datetime

ComponentPlacement:
  - id: UUID
  - component_id: UUID (reference to catalog)
  - din_rail_id: UUID
  - position_on_rail: float (mm from left end of rail)
  - rotation: enum [0, 90, 180, 270]
  - circuit_id: string (electrical grouping)
  - labels: [string] (wire numbers, device tags)
  - custom_notes: string

RailDefinition:
  - id: UUID
  - type: enum [top_hat_7_5, top_hat_15, c_section, g_section]
  - length_mm: int
  - position: { x, y, z } (relative to enclosure interior)
  - orientation: enum [horizontal, vertical]
  - module_capacity: int (how many 18mm modules fit)
  - used_modules: int (sum of component module widths on this rail)
```

### 8.4 Pricing Engine Model

```yaml
PricingRule:
  - id: UUID
  - tenant_id: UUID
  - name: string
  - type: enum [percentage_markup, fixed_amount, tiered_volume, labor_rate, min_charge]
  - applies_to: enum [component_category, specific_component, assembly_total, labor]
  - conditions: JSON (when this rule applies)
  - value: float (percentage or amount)
  - priority: int (evaluation order)

QuoteCalculation:
  - component_costs: [{ component_id, unit_price, quantity, subtotal }]
  - enclosure_cost: float
  - consumables_cost: float
  - material_subtotal: float
  - material_markup: float
  - labor_hours: float
  - labor_rate: float
  - labor_cost: float
  - testing_cost: float
  - overhead: float
  - discount: float
  - tax: float
  - total_price: float
```

---

## 9. References

### Official Sources

1. **IEC 61439 Standard** — Low-voltage switchgear and controlgear assemblies. IEC Webstore: https://webstore.iec.ch
2. **IEC 60715** — Dimensions of low-voltage switchgear — Standardized mounting on rails. IEC Webstore.
3. **IEC 60529** — Degrees of protection (IP Code). IEC Webstore.
4. **NBR 5410** — Low-voltage electrical installations. ABNT (Brazilian Association of Technical Standards).
5. **NR-10** — Safety in electrical installations and services. Brazilian Ministry of Labor.

### Competitor Websites

6. **EPLAN** — Official product pages: https://www.eplan.us/products/
7. **Rittal** — Configuration systems: https://www.rittal.com
8. **Schneider Electric** — Panel building tools: https://www.se.com
9. **Eaton** — PanelBuilder: https://www.eaton.com
10. **Siemens** — Electrical design software: https://www.siemens.com
11. **ABB** — Panel solutions: https://new.abb.com

### Technical References

12. **DIN Rail** — Wikipedia: https://en.wikipedia.org/wiki/DIN_rail
13. **Electrical Enclosure** — Wikipedia: https://en.wikipedia.org/wiki/Electrical_enclosure
14. **NEMA Enclosure Types** — NEMA: https://www.nema.org

### Industry Articles

15. **All About Circuits** — Electrical panel design articles: https://www.allaboutcircuits.com
16. **Control Engineering** — Panel building best practices: https://www.controleng.com

---

## Appendix A: Glossary of Terms

| Term | Definition |
|------|------------|
| **BOM** | Bill of Materials — list of all components |
| **DIN Rail** | Standard metal mounting rail (35mm top hat most common) |
| **EMC** | Electromagnetic Compatibility |
| **IP Rating** | Ingress Protection (e.g., IP65 = dust-tight, water jets) |
| **MCC** | Motor Control Center |
| **MCB** | Miniature Circuit Breaker |
| **MCCB** | Molded Case Circuit Breaker |
| **PLC** | Programmable Logic Controller |
| **PSU** | Power Supply Unit |
| **RCBO** | Residual Current Breaker with Overcurrent |
| **RCD** | Residual Current Device |
| **TTA** | Type-Tested Assembly (IEC 61439) |
| **PTTA** | Partially Type-Tested Assembly |
| **VFD** | Variable Frequency Drive |
| **HMI** | Human-Machine Interface |

---

*This document should be updated quarterly as standards evolve and competitor offerings change.*
