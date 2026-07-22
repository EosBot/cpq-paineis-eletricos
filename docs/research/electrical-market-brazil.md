# Elétrica do Brasil — Electrical Panel Market Research (Brazil)

> Extensive research for CPQ Panel Builder system — real components, real prices (BRL), Brazilian norms, and industry business rules.
> Last updated: July 2026
> Currency: BRL (Brazilian Real) — prices are approximate retail ranges observed on Amazon Brazil, distributor catalogs, and industry sources in 2025–2026.

---

## Table of Contents

1. [Panel Types (Tipos de Painéis)](#1-panel-types)
2. [Geographic & Environmental Variations](#2-geographic-variations)
3. [Component Catalog — Real Data](#3-component-catalog)
4. [Technical Rules & Norms](#4-technical-rules)
5. [Business Rules for Panel Manufacturers](#5-business-rules)
6. [Pricing Reference Summary](#6-pricing-reference)

---

## 1. Panel Types (Tipos de Painéis)

### 1.1 CCM — Centro de Controle de Motores (Motor Control Center)

**Purpose:** Centralized starting, protection, and control of multiple electric motors. The workhorse of industrial panels.

**Typical components per drawer/unit:**
- Molded-case circuit breaker (MCCB) or fuse-switch disconnector (main protection)
- Contactor (3-pole, AC-3 duty) — star-delta or DOL (direct-on-line)
- Thermal overload relay or electronic motor protection relay
- Control transformer (380V/220V or 380V/127V, 50–200VA)
- Power terminal block for motor output
- PLC I/O modules (when integrated with automation)

**Config variants:**
- DOL (Direct-On-Line) — up to ~7.5 kW motors
- Star-Delta — 11–75 kW motors
- Soft Starter controlled — 11–500+ kW
- VFD controlled — any power rating

**Construction:** Vertical sections (gavetas), typically 1–6 drawers per section, IP20–IP42 enclosure rating. Barramento horizontal (horizontal busbar) at top or bottom, barramento vertical per section.

**Norms:** IEC 61439-1/2, NR-10

### 1.2 CTA — Centro de Transformação e Automação

**Purpose:** Integrated panel that combines power distribution and automation control in one enclosure. Common in industrial plants where space is limited.

**Typical components:**
- Main incoming disconnector (seccionadora)
- MCCB or switch-disconnector
- Surge protection device (SPD/DPS)
- Terminal blocks (power + control)
- PLC (Siemens S7-1200, Schneider M241, Wago PFC200)
- VFDs or soft-starters
- Control relays and miniature circuit breakers (MCBs) for auxiliary circuits
- Ethernet switch (Profinet, Ethernet/IP, Modbus TCP)

### 1.3 QGBT — Quadro Geral de Baixa Tensão (Main Low-Voltage Distribution Board)

**Purpose:** Main power distribution from transformer to subordinate panels. Installed at the service entrance of commercial/industrial facilities.

**Typical components:**
- Main MCCB or air circuit breaker (ACB) on incomer — 400A to 6300A
- Busbars — copper, sized per continuous current rating
- MCCBs for outgoing feeders
- Energy meter / power analyzer (optional)
- Surge protection (Class I+II, Type 1+2)
- Current transformers (CTs) for metering

**Construction:** Floor-standing, single-front or back-to-back. IP31–IP54. Often factory-assembled per project specification.

### 1.4 Painel de Comando (Command Panel)

**Purpose:** Dedicated control panel for specific machine or process. Contains only control components — no main power distribution.

**Typical components:**
- 24VDC power supply (10–20A)
- PLC (compact or modular)
- Relays (interposing, auxiliary)
- Terminal blocks
- Pushbuttons and indicator lights (on panel door)
- Disconnect switch (main isolator on door)

### 1.5 Painel de Automação (Automation Panel)

**Purpose:** PLC/HMI/SCADA front-end panel. Contains controllers, remote I/O, network switches, and supervisory equipment.

**Typical components:**
- PLC CPU + I/O modules + communication modules
- Industrial Ethernet switch (managed)
- HMI (touch panel) on panel door
- 24VDC power supply (redundant options)
- Terminals (signal + power)
- Surge protection for communication lines

### 1.6 CCMI — CCM Inversor (VFD Motor Control Center)

**Purpose:** CCM variant where each motor control drawer uses a Variable Frequency Drive instead of contactor-based starting.

**Key design requirements:**
- VFD generates harmonic currents — requires line reactors or active filters
- Heat dissipation is significantly higher (VFD losses ~3–5% of rated power)
- Minimum 100mm clearance around each VFD
- RFI/EMC filtering required

### 1.7 Painel de Distribuição (Distribution Panel)

**Purpose:** Light-commercial / small industrial distribution. Simpler than QGBT. Typically 100–800A.

**Typical configuration:**
- Incoming: MCCB or switch-disconnector
- Outgoing: MCBs (C60, Easy9 series)
- Row-based DIN rail mounting

### 1.8 Painel de Substituição (Retrofit/Replacement)

**Purpose:** Drop-in replacement of legacy panels. Common market in Brazil where many facilities still run 1970s–1990s panels with obsolete components.

**Business note:** Often sold as "modernização" — keeping the enclosure, replacing internals.

### 1.9 Painéis Especiais — Special Application Panels

**Painel de Bombeamento (Pumping Panel):**
- Controls water pumps with alternation (lead/lag)
- Pressure transducer input (4–20mA or 0–10V)
- Soft-starters or VFDs for pressure control
- Flow meter input
- Often solar-compatible (hybrid AC/DC)

**Painel de Irrigação:**
- Same as pumping but with scheduler/calendar function
- Modbus communication to central controller
- Outdoor-rated enclosure (IP54 minimum)

**Painel de Compressores:**
- VFD for screw compressors
- Temperature monitoring (PT100/thermocouple)
- Automatic condensate drain control

### 1.10 Painéis Solares / Fotovoltaicos

**Painel de Proteção CC (DC Protection Box):**
- DC string fuses or DC-rated MCBs
- DC surge protection (Type II, T2)
- DC disconnect switch (load-break rated)
- String monitoring (optional)

**Painel de Proteção CA (AC Protection Board — "QGD" or "Quadro de Guarda do Distribuidor"):**
- AC surge protection (Type II)
- AC disconnect switch
- Grid-tie connection per ANEEL 482/2012 and PRODIST
- Energy meter (bidirectional, homologated by INMETRO)

---

## 2. Geographic & Environmental Variations

### 2.1 Voltage by Region

Brazil has a complex voltage landscape due to historical utility fragmentation:

| Region | States | Single-phase (L-N) | Two-phase (L-L) | Three-phase (L-L) |
|--------|--------|---------------------|------------------|---------------------|
| Southeast | SP, RJ, MG, ES | 127V | 220V | 380V |
| South | PR, SC, RS | 127V | 220V | 380V |
| Northeast | AL, BA, CE, MA, PB, PE, PI, RN, SE | 127V | 220V | 380V (most) / 220V (some rural) |
| North | AC, AM, AP, PA, RO, RR, TO | 127V | 220V | 220V (some) / 380V |
| Center-West | DF, GO, MT, MS | 127V | 220V | 380V |
| Manaus (AM) | Amazonas capital | 127V | 220V | 220V (industrial) |

**Key rule:** Most Brazilian industry runs 380V three-phase. Some older industrial parks (especially in the North and parts of the Northeast) use 220V three-phase. The configurator MUST validate motor voltage against system voltage.

**Frequency:** 60 Hz nationwide (except some border areas near Itaipu — still 60Hz).

### 2.2 Climate Considerations

| Climate Zone | Region | Issues | Mitigation |
|-------------|--------|--------|------------|
| Coastal | Coast (RJ, ES, BA, NE coast) | Salt spray corrosion | Stainless steel 316L or epoxy-coated steel. IP55+. Tropicalized electronics |
| Amazon | AM, PA, AC, RR | Extreme humidity (>80% RH), fungus | Anti-fungal coating. Internal heater + thermostat. IP55+ |
| Semi-arid | Northeast interior | Extreme heat (40°C+), dust | Oversized enclosures. IP55. Air conditioning or heat exchanger |
| Southern Highlands | PR, SC, RS highlands | Cold (0–10°C in winter), occasional frost | Internal heater. Components rated for -10°C |
| Plateau | GO, DF, MT, MS | Large temperature swings (10–35°C) | Standard IP41–IP54. Adequate ventilation |

### 2.3 IP Rating by Application

| Application | Minimum IP | Enclosure Material | Notes |
|-------------|-----------|-------------------|-------|
| Indoor clean (office, hospital) | IP41 | Carbon steel painted (RAL 7035) | Standard |
| Indoor light industrial | IP54 | Carbon steel painted or 304 SS | Ventilation + filters |
| Indoor heavy industrial | IP55 | 304 or 316 SS | Washed environments |
| Outdoor covered | IP55 | 304 SS or polyester | UV-resistant |
| Outdoor exposed | IP65 | 316 SS or polyester | Down-directed ventilation |
| Outdoor submersible (pumphouse) | IP68 (occasional) | 316 SS or fiberglass | Special designs |

---

## 3. Component Catalog — Real Data

> All prices are approximate retail ranges from Amazon Brazil, distributor quotes (CEMIG, Eletromax, Eletropatu), and manufacturer catalogs. Industrial distributor prices are typically 15–30% lower than retail.

### 3.1 Disjuntores Termomagnéticos (MCBs — Miniature Circuit Breakers)

**Application:** Control circuits, auxiliary power, lighting, small motors (control panel internal distribution).

#### Steck SDD Series (Brazilian brand, DIN rail mount, 3kA breaking capacity)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| SDD61C06 | 1P | 6A | R$ 7–10 | Monopolar, Curve C |
| SDD61C10 | 1P | 10A | R$ 7–12 | Monopolar |
| SDD61C16 | 1P | 16A | R$ 8–13 | Monopolar |
| SDD61C20 | 1P | 20A | R$ 9–14 | Monopolar |
| SDD61C25 | 1P | 25A | R$ 10–16 | Monopolar |
| SDD61C32 | 1P | 32A | R$ 12–19 | Monopolar |
| SDD61C40 | 1P | 40A | R$ 15–22 | Monopolar |
| SDD61C50 | 1P | 50A | R$ 22–35 | Monopolar |
| SDD62C06 | 2P | 6A | R$ 28–45 | Bipolar |
| SDD62C10 | 2P | 10A | R$ 30–48 | Bipolar |
| SDD62C20 | 2P | 20A | R$ 32–52 | Bipolar |
| SDD62C40 | 2P | 40A | R$ 34–55 | Bipolar |
| SDD63C10 | 3P | 10A | R$ 95–130 | Tripolar |
| SDD63C16 | 3P | 16A | R$ 100–140 | Tripolar |
| SDD63C25 | 3P | 25A | R$ 110–155 | Tripolar |

#### Elgin Series (Brazilian brand)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| Bipolar 100A | 2P | 100A | R$ 60–80 | Box mount, high-capacity MCB |
| Tripolar 100A | 3P | 100A | R$ 95–130 | Industrial distribution |

#### Schneider Electric Easy9 (Multi9)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| EZ9F332xx | 1P | 6–63A | R$ 25–60 | DIN rail, 4.5kA |
| EZ9F332xx | 2P | 6–63A | R$ 80–150 | Bipolar |
| EZ9F333xx | 3P | 6–63A | R$ 100–200 | Tripolar |

### 3.2 Disjuntores Caixa Moldada (MCCBs — Molded-Case Circuit Breakers)

**Application:** Main feeder protection, high-capacity outgoing circuits (63A–1600A).

#### ABB Tmax T Series

| Model | Poles | Current Rating | Breaking Capacity | Approx. Price (BRL) | Notes |
|-------|-------|---------------|-------------------|---------------------|-------|
| T1B 125 | 3P/4P | 125A | 25kA (F), 36kA (N) | R$ 400–700 | Fixed thermal-magnetic |
| T2S 100 | 3P/4P | 100A | 36kA (N), 50kA (S) | R$ 500–800 | Fixed thermal-magnetic |
| T2S 125 | 3P/4P | 125A | 36kA (N) | R$ 550–900 | |
| T2S 160 | 3P/4P | 160A | 36kA (N) | R$ 650–1.000 | |
| T4S 220 | 3P/4P | 200A | 36kA (N) | R$ 1.000–1.800 | Fixed TM, adjustable 63–200A |
| T4S 250 | 3P/4P | 250A | 36kA (N) | R$ 1.200–2.000 | |
| T5S 400 | 3P/4P | 400A | 36kA (N), 50kA (S) | R$ 2.500–4.200 | Electronic trip unit optional |
| T5S 500 | 3P/4P | 500A | 36kA (N) | R$ 3.000–5.000 | |
| T5S 630 | 3P/4P | 630A | 36kA (N) | R$ 3.800–6.500 | |
| T6S 800 | 3P/4P | 800A | 50kA (N), 70kA (S) | R$ 6.000–9.000 | Electronic, adjustable Ir, Isd, Ii |
| T6S 1000 | 3P/4P | 1000A | 50kA (N) | R$ 7.500–11.000 | |
| T7S 1250 | 3P/4P | 1250A | 50kA (N), 70kA (S) | R$ 10.000–15.000 | |
| T7S 1600 | 3P/4P | 1600A | 50kA (N) | R$ 12.000–18.000 | |

**ABB Tmax suffix codes:** F = fixed, P = plug-in, W = withdrawable
**Breaking capacity codes:** N = Normal, S = Standard, H = High, V = Very high, L = Limiting
**Trip units:** PR221DS (thermal-magnetic), PR222DS/P (electronic 4–6 poles), PR222MP/DSP (motor protection electronic)

#### Schneider Electric Compact NSX (PowerPact)

| Model | Poles | Current Rating | Breaking Capacity | Approx. Price (BRL) | Notes |
|-------|-------|---------------|-------------------|---------------------|-------|
| NSX100F | 3P/4P | 100A | 36kA (F) | R$ 800–1.200 | Micrologic 2.0 or 5.0 |
| NSX100N | 3P/4P | 100A | 50kA (N) | R$ 900–1.400 | |
| NSX160F | 3P/4P | 160A | 36kA (F) | R$ 1.000–1.600 | |
| NSX250F | 3P/4P | 250A | 36kA (F) | R$ 1.200–2.000 | |
| NSX400F | 3P/4P | 400A | 36kA (F), 50kA (N) | R$ 2.500–4.000 | Micrologic 5.0 / 6.0 / 7.0 |
| NSX630F | 3P/4P | 630A | 36kA (F) | R$ 3.500–5.500 | |
| NSX1000N | 3P/4P | 1000A | 50kA (N) | R$ 8.000–12.000 | |
| NSX1600N | 3P/4P | 1600A | 50kA (N) | R$ 15.000–22.000 | |

**Micrologic trip units:** 2.0 (L-S protection), 5.0 (LSI), 6.0 (LSIG + ground), 7.0 (LSIG + ground + power metering)

#### Siemens 3VL Series

| Model | Poles | Current Rating | Breaking Capacity | Approx. Price (BRL) | Notes |
|-------|-------|---------------|-------------------|---------------------|-------|
| 3VL160 | 3P/4P | 160A | 55kA (N) | R$ 1.200–2.000 | ETU12 (standard) |
| 3VL250 | 3P/4P | 250A | 55kA (N) | R$ 1.800–3.000 | ETU20 / ETU40 |
| 3VL400 | 3P/4P | 400A | 66kA (H) | R$ 3.000–5.000 | ETU40 / ETU70 |
| 3VL630 | 3P/4P | 630A | 66kA (H) | R$ 4.500–7.000 | |
| 3VL800 | 3P/4P | 800A | 66kA (H) | R$ 6.000–9.000 | |
| 3VL1600 | 3P/4P | 1600A | 100kA (C) | R$ 14.000–20.000 | |

#### Eaton NZM Series

| Model | Poles | Current Rating | Breaking Capacity | Approx. Price (BRL) | Notes |
|-------|-------|---------------|-------------------|---------------------|-------|
| NZM100 | 3P/4P | 100A | 50kA | R$ 800–1.200 | |
| NZM125 | 3P/4P | 125A | 50kA | R$ 1.000–1.500 | |
| NZM160 | 3P/4P | 160A | 50kA | R$ 1.200–2.000 | |
| NZM250 | 3P/4P | 250A | 50kA | R$ 1.800–3.000 | |
| NZM400 | 3P/4P | 400A | 50kA | R$ 3.000–5.000 | |
| NZM630 | 3P/4P | 630A | 50kA | R$ 4.500–7.000 | |

### 3.3 Contatores (Contactors)

**Application:** Motor switching, capacitor switching, lighting control. Must be rated for AC-3 (squirrel cage motor starting) for motor control.

#### ABB AF Series (Wide-range electronic coil — the most versatile)

| Model | AC-3 Current @ 400V | Max Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|---------------------|------------------------|---------------------|-------|
| AF09 | 9A | 4 kW | R$ 350–550 | 4-pole variants available |
| AF12 | 12A | 5.5 kW | R$ 400–600 | |
| AF16 | 16A | 7.5 kW | R$ 450–700 | |
| AF25 | 25A | 11 kW | R$ 500–800 | |
| AF30 | 30A | 15 kW | R$ 580–900 | |
| AF38 | 38A | 18.5 kW | R$ 650–1.000 | |
| AF40 | 40A | 22 kW | R$ 700–1.100 | |
| AF52 | 52A | 30 kW | R$ 800–1.200 | |
| AF65 | 65A | 37 kW | R$ 900–1.600 | |
| AF80 | 80A | 45 kW | R$ 1.100–1.800 | |
| AF95 | 95A | 55 kW | R$ 1.300–2.100 | |
| AF116 | 116A | 59 kW | R$ 1.100–1.500 | |
| AF140 | 140A | 75 kW | R$ 1.400–2.000 | |
| AF146 | 146A | 75 kW | R$ 1.600–2.400 | |
| AF190 | 190A | 100 kW | R$ 1.900–2.800 | |
| AF205 | 205A | 110 kW | R$ 2.100–3.200 | |
| AF300 | 300A | 160 kW | R$ 3.500–5.000 | |
| AF370 | 370A | 200 kW | R$ 4.500–6.500 | |
| AF400 | 404A | 220 kW | R$ 5.500–8.000 | Requires mounting bracket |
| AF580 | 580A | 315 kW | R$ 8.000–12.000 | No DIN rail — bolt mount |
| AF750 | 750A | 400 kW | R$ 10.000–15.000 | Bolt mount |
| AF1650 | 1650A | 900 kW | R$ 25.000–35.000 | Bolt mount |

**ABB AF coil voltage codes:** 10 = 100-250V AC/DC, 11 = 24-60V AC/DC, 12 = 48-130V AC/DC, 13 = 250-500V AC/DC, 84 = 100-250V AC/DC (specific)

**Auxiliary contacts in model suffix:** 30 = 3NO, 10 = 1NO, 01 = 1NC, 12 = 1NO+1NC, etc.

#### Schneider Electric LC1D Series (Tesys D — traditional)

| Model | AC-3 Current @ 400V | Max Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|---------------------|------------------------|---------------------|-------|
| LC1D09 | 9A | 4 kW | R$ 60–90 | LC1D096 (with 1NO+1NC aux) |
| LC1D12 | 12A | 5.5 kW | R$ 65–100 | |
| LC1D18 | 16A | 7.5 kW | R$ 80–120 | |
| LC1D25 | 25A | 11 kW | R$ 100–160 | |
| LC1D32 | 32A | 15 kW | R$ 120–190 | |
| LC1D40 | 40A | 22 kW | R$ 150–250 | |
| LC1D50 | 50A | 30 kW | R$ 180–300 | |
| LC1D65 | 65A | 37 kW | R$ 220–380 | |
| LC1D80 | 80A | 45 kW | R$ 280–450 | |
| LC1D95 | 95A | 55 kW | R$ 350–550 | |
| LC1D115 | 115A | 55 kW | R$ 450–700 | |
| LC1D150 | 150A | 90 kW | R$ 500–800 | |
| LC1D170 | 170A | 100 kW | R$ 600–1.000 | |
| LC1D500 | 500A | 250 kW | R$ 2.500–4.000 | Bolt mount |
| LC1D650 | 650A | 335 kW | R$ 3.500–5.500 | Bolt mount |

**Coil voltages (Tesys D):** 7 = 24V AC, F7 = 110V AC, M7 = 220V AC, P7 = 230V AC, U7 = 240V AC, E7 = 48V AC, B7 = 24V DC

#### Siemens 3RT2 Series

| Model | AC-3 Current @ 400V | Max Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|---------------------|------------------------|---------------------|-------|
| 3RT2015 | 9A | 4 kW | R$ 80–130 | 1NO aux |
| 3RT2016 | 12A | 5.5 kW | R$ 90–140 | |
| 3RT2017 | 16A | 7.5 kW | R$ 110–170 | |
| 3RT2025 | 25A | 11 kW | R$ 130–200 | |
| 3RT2026 | 32A | 15 kW | R$ 160–250 | |
| 3RT2027 | 40A | 22 kW | R$ 200–320 | |
| 3RT2028 | 50A | 30 kW | R$ 250–380 | |
| 3RT2036 | 65A | 37 kW | R$ 320–480 | |
| 3RT2037 | 80A | 45 kW | R$ 400–600 | |
| 3RT2038 | 95A | 55 kW | R$ 480–720 | |

#### WEG CWC Series (Brazilian brand — low-cost alternative)

| Model | AC-3 Current @ 400V | Max Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|-----|-----|-----|-----|
| CWC09 | 9A | 4 kW | R$ 70–110 | Compact mini-contactor |
| CWC012 | 12A | 5.5 kW | R$ 80–130 | |
| CWC016 | 16A | 7.5 kW | R$ 90–150 | |
| CWC025 | 25A | 11 kW | R$ 110–180 | |

### 3.4 Relés (Relays)

#### Finder 40-Series (Miniature PCB/Plug-in)

| Model | Poles | Switching Current | Coil Voltage | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|--------------|---------------------|-------|
| 40.31 | 1CO (SPDT) | 10A @ 250VAC | 12–24VDC | R$ 30–45 | 1 changeover |
| 40.52 | 2CO (DPDT) | 10A @ 250VAC | 12–24VDC | R$ 35–50 | 2 changeover |
| 40.61 | 1CO | 10A @ 250VAC | 220VAC | R$ 35–50 | 110mm height |

#### Finder 44-Series (Power PCB/Plug-in)

| Model | Poles | Switching Current | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|---------------------|-------|
| 44.31 | 1CO | 6A @ 250VAC | R$ 45–70 | DPDT |
| 44.52 | 2CO | 6A @ 250VAC | R$ 50–80 | |

#### Finder 55-Series (Industrial socket, DIN rail)

| Model | Poles | Switching Current | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|---------------------|-------|
| 55.34 | 4CO | 7A @ 250VAC | R$ 60–90 | 4PDT, DIN rail |

#### Finder 60-Series (Industrial socket, DIN rail)

| Model | Poles | Switching Current | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|---------------------|-------|
| 60.12 | 2CO | 10A @ 250VAC | R$ 55–80 | Classic octal socket equivalent |

#### Finder 62-Series (Power relay socket, DIN rail)

| Model | Poles | Switching Current | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|---------------------|-------|
| 62.31 | 1CO | 16A @ 250VAC | R$ 60–90 | DPDT, DIN rail |
| 62.33 | 3CO | 16A @ 250VAC | R$ 70–100 | 3PDT |

#### Omny MY2N Series (General-purpose plug-in)

| Model | Poles | Approx. Price (BRL) | Notes |
|-------|-------|---------------------|-------|
| MY2N-DC24 | 2CO | R$ 25–40 | DPDT, 24VDC coil |
| MY2N-AC220 | 2CO | R$ 28–45 | DPDT, 220VAC coil |
| MY4N-DC24 | 4CO | R$ 35–55 | 4PDT, 24VDC coil |

#### Phoenix Contact PLC-RSC (Plug-in relay with pluggable interface)

| Model | Poles | Switching Current | Approx. Price (BRL) | Notes |
|-------|-------|-------------------|---------------------|-------|
| PLC-RSC-24DC/21-21 | 2CO | 6A | R$ 90–130 | Push-in connection |
| PLC-RSC-230UC/21-21 | 2CO | 6A | R$ 95–140 | 230VAC coil |

#### Schneider Electric RPM / RSB

| Model | Poles | Approx. Price (BRL) | Notes |
|-------|-------|---------------------|-------|
| RSB1A160P7 | 1CO | R$ 50–80 | Industrial, 16A |
| RPM41FD | 4CO | R$ 90–140 | 4PDT |

### 3.5 Bornes / Terminais (Terminal Blocks)

#### Phoenix Contact UT Series (Screw connection)

| Model | Cross-section | Color | Approx. Price (BRL) | Notes |
|-------|--------------|-------|---------------------|-------|
| UT 2,5 | 0.14–2.5mm² | Gray | R$ 4–6 | Standard feed-through |
| UT 2,5 BU | 0.14–2.5mm² | Blue | R$ 5–7 | Color-coded |
| UT 2,5 PE | 0.14–2.5mm² | Green-yellow | R$ 6–9 | Protective earth |
| UT 4 | 0.14–4mm² | Gray | R$ 5–8 | |
| UT 6 | 0.5–6mm² | Gray | R$ 6–10 | |
| UT 10 | 1.5–10mm² | Gray | R$ 8–12 | |
| UT 16 | 1.5–16mm² | Gray | R$ 10–15 | |
| UT 35 | 2.5–35mm² | Gray | R$ 15–25 | |
| UT 70 | 10–70mm² | Gray | R$ 35–50 | |

#### Phoenix Contact ST Series (Spring-cage)

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| ST 2,5 | 0.08–2.5mm² | R$ 8–12 | Spring, fast |
| ST 4 | 0.08–4mm² | R$ 9–14 | |

#### Phoenix Contact UK Series (UK-style, high-current)

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| UK 5N | 0.5–4mm² | R$ 3–5 | Classic UK terminal |
| UK 10N | 1.5–10mm² | R$ 6–9 | |
| UK 16N | 2.5–16mm² | R$ 8–12 | |
| UK 35 | 2.5–35mm² | R$ 18–28 | |
| UK 70 | 10–70mm² | R$ 35–50 | |

#### Phoenix Contact MK Series (Multi-conductor)

| Model | Poles | Approx. Price (BRL) | Notes |
|-------|-------|---------------------|-------|
| MKDSN 1,5/2-5,08 | 2-pole | R$ 5–8 | Diode/fuse terminal |
| MKDSN 1,5/3-5,08 | 3-pole | R$ 6–10 | |

#### Phoenix Contact Fuse Terminal Blocks

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| ST 2,5-QUATTRO/30M | 2.5mm² | R$ 15–25 | G-fuse 5×20 |
| UT 4-PE/HEDI | 4mm² | R$ 18–30 | LED indicator |

#### Phoenix Contact Disconnect Terminal Blocks

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| ST 2,5-M | 2.5mm² | R$ 20–35 | Knife-disconnect |
| P-FU 5×20 | 4mm² | R$ 25–40 | Fuse + disconnect |

#### Wago 280 Series (Cage Clamp — push-in)

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| 280-992 | 2.5mm² | R$ 5–8 | 2-conductor |

#### Weidmüller W Series (Screw)

| Model | Cross-section | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| WDU 2,5 | 2.5mm² | R$ 6–10 | Classic W-series |
| WDU 4 | 4mm² | R$ 7–12 | |
| WDU 6 | 6mm² | R$ 9–15 | |
| WDU 10 | 10mm² | R$ 12–20 | |
| WDU 16 | 16mm² | R$ 15–25 | |
| WDU 35 | 35mm² | R$ 28–42 | |
| WDU 70 | 70mm² | R$ 50–75 | |

### 3.6 CLPs (PLCs)

#### Siemens S7-1200 (Most popular in Brazil)

| Model | DI/DO/AI/AO | Comm Modules | Approx. Price (BRL) | Notes |
|-------|-------------|--------------|---------------------|-------|
| CPU 1211C DC/DC/DC | 6DI/4DO | 1×RS485 (PtP) | R$ 2.200–2.800 | 6×100kHz high-speed counters |
| CPU 1212C DC/DC/DC | 8DI/6DO | 1×RS485 | R$ 2.500–3.200 | |
| CPU 1212C AC/DC/RLY | 8DI/6DO | 1×RS485 | R$ 2.400–3.000 | Relay output |
| CPU 1214C DC/DC/DC | 14DI/10DO | 2×RS485, 1×PN (Profinet) | R$ 3.500–4.500 | 6×100kHz counters |
| CPU 1215C DC/DC/DC | 14DI/10DO, 2AI/2AO | 2×RS485, 1×PN | R$ 4.500–5.800 | Profinet + analog onboard |
| CPU 1217C DC/DC/DC | 14DI/10DO | 1×PN, motion control | R$ 6.000–7.500 | High-speed, 1MHz |
| Signal Board SB1221 | 2DI | — | R$ 500–700 | Expansion CPU |
| Signal Board SB1231 | 1AI | — | R$ 600–900 | |
| SM1223 DI/DO | 8DI/8DO | — | R$ 1.200–1.600 | Digital mixed |
| SM1231 AI | 4AI | — | R$ 1.800–2.500 | 16-bit resolution |
| SM1232 AO | 2AO | — | R$ 1.200–1.800 | |
| CM1241 RS232/485 | — | 1×RS232/485 | R$ 1.000–1.400 | Modbus RTU master |
| CB1241 RS485 | — | 1×RS485 add-on | R$ 800–1.100 | For 1211C |
| TS Adapter | — | TeleService | R$ 2.000–3.000 | Remote access |

#### Siemens S7-1500

| Model | DI/DO/AI/AO | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| CPU 1511-1 PN | 16DI/16DO | R$ 8.000–10.000 | Profinet, basic |
| CPU 1513-1 PN | 32DI/32DO | R$ 12.000–15.000 | Mid-range |
| CPU 1516-3 PN/DP | 64DI/64DO | R$ 20.000–28.000 | High-end, Profinet + Profibus DP |
| CPU 1517-3 PN/DP | 128DI/128DO | R$ 30.000–40.000 | Advanced |
| CPU 1518-4 PN/DP | 256DI/256DO | R$ 50.000–70.000 | Top performance |

#### Schneider Electric Modicon M221 (Machine Controller)

| Model | DI/DO/AI/AO | Comm | Approx. Price (BRL) | Notes |
|-------|-------------|------|---------------------|-------|
| M221CE16R | 9DI/7DO (relay) | — | R$ 1.800–2.500 | Standalone, relay output |
| M221CE24T | 14DI/10DO (transistor) | — | R$ 2.200–3.000 | Standalone |
| M221CE40R | 24DI/16DO (relay) | — | R$ 3.500–4.500 | |

#### Schneider Electric Modicon M241 (Logic Controller)

| Model | DI/DO | Comm | Approx. Price (BRL) | Notes |
|-------|-------|------|---------------------|-------|
| M241CE24T | 14DI/10DO | 1×CAN, 2×Serial, 1×Ethernet | R$ 4.000–5.500 | |
| M241CE40T | 24DI/16DO | Same | R$ 6.000–8.000 | |

#### Schneider Electric Modicon M251 (Automation Controller)

| Model | I/O | Comm | Approx. Price (BRL) | Notes |
|-------|-----|------|---------------------|-------|
| M251ESE | Modular I/O | EtherCAT, Ethernet, CANopen | R$ 8.000–12.000 | Embedded EtherCAT master |

#### Schneider Electric Modicon M262 (Motion Controller)

| Model | I/O | Comm | Approx. Price (BRL) | Notes |
|-------|-----|------|---------------------|-------|
| M262ESE | Modular I/O | EtherCAT master, API, OPC UA | R$ 10.000–15.000 | IIoT-ready |

#### Wago PFC100 / PFC200

| Model | DI/DO/AI/AO | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| PFC100 750-8101 | 4DI/4DO | R$ 2.000–2.800 | CODESYS runtime |
| PFC200 750-8212 | Modular I/O | R$ 4.000–5.500 | Linux-based, CODESYS |
| PFC200 750-8214 | Modular I/O | R$ 6.000–8.000 | High-performance |

#### Rockwell Automation Micro800 (Allen-Bradley)

| Model | DI/DO | Comm | Approx. Price (BRL) | Notes |
|-------|-------|------|---------------------|-------|
| Micro810 12DI/8DO | 12DI/8DO | Built-in LCD, 1×RS232 | R$ 1.800–2.500 | |
| Micro820 24DI/16DO | 24DI/16DO | Ethernet | R$ 3.000–4.000 | |
| Micro850 24DI/16DO | 24DI/16DO | Ethernet, 1×RS232/485 | R$ 4.000–5.500 | Modular expansion |

#### Rockwell CompactLogix 5380

| Model | Approx. Price (BRL) | Notes |
|-------|---------------------|-------|
| 5069-L306ER | R$ 8.000–12.000 | Compact, 64K I/O |
| 5069-L310ER | R$ 10.000–15.000 | Mid-range |
| 5069-L320ER | R$ 13.000–18.000 | High-capacity |

### 3.7 Inversores de Frequência (VFDs / Variable Frequency Drives)

#### ABB ACS355 (General machinery)

| Model | Motor Power | Output Current | Approx. Price (BRL) | Notes |
|-------|-------------|----------------|---------------------|-------|
| ACS355-03E-01A2-4 | 0.37 kW | 1.2A | R$ 1.800–2.400 | Single-phase 220V input |
| ACS355-03E-02A4-4 | 0.75 kW | 2.4A | R$ 2.200–2.800 | |
| ACS355-03E-03A3-4 | 1.1 kW | 3.3A | R$ 2.600–3.200 | |
| ACS355-03E-05A6-4 | 1.5 kW | 5.6A | R$ 3.000–3.800 | |
| ACS355-03E-07A5-4 | 2.2 kW | 7.5A | R$ 3.500–4.200 | |
| ACS355-03E-09A0-4 | 3.0 kW | 9.0A | R$ 4.000–5.000 | |
| ACS355-03E-12A5-4 | 4.0 kW | 12.5A | R$ 4.500–5.500 | |
| ACS355-03E-15A6-4 | 5.5 kW | 15.6A | R$ 5.500–7.000 | 7.5HP 380/480V |
| ACS355-03E-23A1-4 | 7.5 kW | 23.1A | R$ 6.500–8.000 | |
| ACS355-03E-032A-4 | 11 kW | 32A | R$ 8.000–10.000 | |
| ACS355-03E-44A0-4 | 15 kW | 44A | R$ 10.000–12.000 | |
| ACS355-03E-59A0-4 | 18.5 kW | 59A | R$ 12.000–15.000 | |
| ACS355-03E-72A0-4 | 22 kW | 72A | R$ 14.000–18.000 | |
| ACS355-03E-85A0-4 | 30 kW | 85A | R$ 18.000–22.000 | |

#### ABB ACS380 (Machinery drive, newer generation)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| ACS380-040S-02A7-4 | 0.75 kW | R$ 2.000–2.500 | Compact |
| ACS380-040S-07A6-4 | 3.0 kW | R$ 3.000–4.000 | |
| ACS380-040S-09A8-4 | 4.0 kW | R$ 3.500–4.500 | |
| ACS380-040S-18A5-4 | 7.5 kW | R$ 5.000–6.500 | |
| ACS380-040S-26A9-4 | 11 kW | R$ 6.500–8.000 | |

#### ABB ACS580 (All-round, general purpose)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| ACS580-01-02A7-4 | 0.75 kW | R$ 2.200–2.800 | Wall mount |
| ACS580-01-04A1-4 | 1.5 kW | R$ 2.700–3.300 | |
| ACS580-01-07A6-4 | 3.0 kW | R$ 3.500–4.500 | |
| ACS580-01-09A8-4 | 4.0 kW | R$ 4.000–5.000 | |
| ACS580-01-17A5-4 | 7.5 kW | R$ 5.500–7.000 | |
| ACS580-01-24A7-4 | 11 kW | R$ 7.000–9.000 | |
| ACS580-01-34A1-4 | 15 kW | R$ 8.500–10.500 | |
| ACS580-01-61A9-4 | 30 kW | R$ 14.000–18.000 | |
| ACS580-01-72A3-4 | 37 kW | R$ 16.000–20.000 | |

#### ABB ACS880 (Industrial, high-performance)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| ACS880-01-03A3-3 | 1.1 kW | R$ 4.000–5.500 | Module or cabinet |
| ACS880-01-07A5-3 | 3.0 kW | R$ 5.000–6.500 | |
| ACS880-01-18A8-3 | 7.5 kW | R$ 8.000–10.000 | |
| ACS880-01-25A8-3 | 11 kW | R$ 10.000–12.000 | |
| ACS880-01-44A0-3 | 15 kW | R$ 12.000–15.000 | |
| ACS880-01-61A0-3 | 30 kW | R$ 18.000–22.000 | |
| ACS880-01-105A-3 | 55 kW | R$ 28.000–35.000 | |
| ACS880-01-145A-3 | 75 kW | R$ 38.000–48.000 | |
| ACS880-01-246A-3 | 132 kW | R$ 60.000–75.000 | |
| ACS880-01-302A-3 | 160 kW | R$ 75.000–90.000 | |

#### Schneider Electric ATV320 (Compact, machinery)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| ATV320U07N4B | 0.75 kW | R$ 2.000–2.500 | Book form factor |
| ATV320U15N4B | 1.5 kW | R$ 2.500–3.000 | |
| ATV320U22N4B | 3.0 kW | R$ 3.000–3.800 | |
| ATV320U30N4B | 4.0 kW | R$ 3.500–4.200 | |
| ATV320U40N4B | 5.5 kW | R$ 4.000–5.000 | |
| ATV320U55N4B | 7.5 kW | R$ 5.000–6.000 | |
| ATV320U75N4B | 11 kW | R$ 6.500–8.000 | |

#### Schneider Electric ATV630 / ATV930 (Process drives)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| ATV630U30N4 | 4 kW | R$ 5.000–6.500 | Process/pump |
| ATV630U55N4 | 7.5 kW | R$ 7.000–9.000 | |
| ATV630U75N4 | 11 kW | R$ 9.000–11.000 | |
| ATV630D15N4 | 15 kW | R$ 11.000–14.000 | |
| ATV630D30N4 | 30 kW | R$ 20.000–25.000 | |
| ATV630D55N4 | 55 kW | R$ 35.000–42.000 | |
| ATV930D15N4 | 15 kW | R$ 13.000–16.000 | High performance |

#### Siemens SINAMICS V20 (Basic, economical)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| V20 6SL3210-5BB11-2UF0 | 0.12 kW | R$ 1.200–1.600 | Basic BOP |
| V20 6SL3210-5BB13-7UF0 | 0.37 kW | R$ 1.500–2.000 | |
| V20 6SL3210-6BB17-5UF0 | 0.75 kW | R$ 2.000–2.500 | |
| V20 6SL3210-8BB21-1UF0 | 1.5 kW | R$ 2.500–3.000 | |
| V20 6SL3210-8BB21-5UF0 | 2.2 kW | R$ 3.000–3.500 | |
| V20 6SL3210-8BB22-2UF0 | 3.0 kW | R$ 3.500–4.200 | |
| V20 6SL3210-8BB23-0UF0 | 4.0 kW | R$ 4.000–5.000 | |

#### Siemens SINAMICS G120 (General purpose, modular)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| G120 6SL3210-1PC22-2UL0 | 1.5 kW | R$ 4.000–5.000 | PM240-2 power module |
| G120 6SL3210-1PC24-2UL0 | 4.0 kW | R$ 5.500–7.000 | |
| G120 6SL3210-1PC28-8UL0 | 11 kW | R$ 9.000–12.000 | |

#### WEG CFW11 (Brazilian-made VFD — price leader)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| CFW11 00075 T 2 | 0.75 HP | R$ 1.500–2.000 | 220V single-phase input |
| CFW11 00150 T 2 | 1.5 HP | R$ 1.800–2.300 | |
| CFW11 00220 T 2 | 2.2 HP | R$ 2.200–2.800 | |
| CFW11 00370 T 2 | 3.7 HP | R$ 2.800–3.500 | |
| CFW11 00550 T 2 | 5.5 HP | R$ 3.500–4.200 | |
| CFW11 00750 T 2 | 7.5 HP | R$ 4.200–5.000 | |
| CFW11 01100 T 2 | 11 HP | R$ 5.500–6.500 | |
| CFW11 01500 T 2 | 15 HP | R$ 6.500–8.000 | |

#### WEG CFW500 (Compact, new generation)

| Model | Motor Power | Approx. Price (BRL) | Notes |
|-------|-------------|---------------------|-------|
| CFW500 A07P0 T 2 | 7.5 HP | R$ 3.800–4.800 | 220V |
| CFW500 A15P0 T 2 | 15 HP | R$ 5.500–7.000 | |
| CFW500 A22P0 T 2 | 22 HP | R$ 7.000–8.500 | |

### 3.8 Fontes de Alimentação (Power Supplies — 24VDC)

#### Phoenix Contact QUINT Series (High-end, industrial-grade)

| Model | Output Voltage | Current | Approx. Price (BRL) | Notes |
|-------|---------------|---------|---------------------|-------|
| QUINT-PS/1AC/24DC/10 | 24VDC | 10A (peak 15A) | R$ 1.800–2.500 | 1-phase, selective fuse breaking |
| QUINT-PS/1AC/24DC/20 | 24VDC | 20A | R$ 3.200–4.200 | 1-phase |
| QUINT-PS/3AC/24DC/20 | 24VDC | 20A | R$ 3.800–5.000 | 3-phase, essential for panel |
| QUINT-PS/3AC/24DC/40 | 24VDC | 40A | R$ 5.500–7.000 | 3-phase |
| QUINT-PS/1AC/24DC/5 | 24VDC | 5A | R$ 1.200–1.600 | 1-phase, economical |

#### Phoenix Contact TRIO Series (Mid-range)

| Model | Output | Current | Approx. Price (BRL) | Notes |
|-------|--------|---------|---------------------|-------|
| TRIO-PS/1AC/24DC/10 | 24VDC | 10A | R$ 1.000–1.400 | DIN rail, 1-phase |
| TRIO-PS/1AC/24DC/20 | 24VDC | 20A | R$ 1.500–2.000 | DIN rail |
| TRIO-PS/1AC/24DC/5 | 24VDC | 5A | R$ 800–1.100 | |

#### Phoenix Contact UNO Series (Compact)

| Model | Output | Current | Approx. Price (BRL) | Notes |
|-------|--------|---------|---------------------|-------|
| UNO POWER 24V/10A | 24VDC | 10A | R$ 700–1.000 | Slim form factor |

#### Mean Well HDR Series (Economical, DIN rail)

| Model | Output | Current | Approx. Price (BRL) | Notes |
|-------|--------|---------|---------------------|-------|
| HDR-15-24 | 24VDC | 0.63A | R$ 100–150 | Ultra-slim, 15W |
| HDR-30-24 | 24VDC | 1.25A | R$ 130–180 | 30W |
| HDR-60-24 | 24VDC | 2.5A | R$ 180–250 | 60W |
| HDR-100-24 | 24VDC | 4.2A | R$ 280–350 | 100W |

#### Mean Well NDR Series (Slim, DIN rail)

| Model | Output | Current | Approx. Price (BRL) | Notes |
|-------|--------|---------|---------------------|-------|
| NDR-480-24 | 24VDC | 20A | R$ 700–900 | 480W, single |
| NDR-720-24 | 24VDC | 30A | R$ 950–1.200 | 720W |

#### Siemens SITOP PSU

| Model | Output | Current | Approx. Price (BRL) | Notes |
|-------|--------|---------|---------------------|-------|
| PSU100C 24V/5A | 24VDC | 5A | R$ 800–1.200 | Basic |
| PSU100C 24V/10A | 24VDC | 10A | R$ 1.200–1.800 | |
| PSU8600 Redundant | 24VDC | 20–40A | R$ 8.000–12.000 | Redundant system |

#### Weidmüller PRO ECO Series

| Model | Output Current | Approx. Price (BRL) | Notes |
|-------|---------------|---------------------|-------|
| PRO ECO 240W 24V/10A | 10A | R$ 800–1.100 | 1-phase |
| PRO ECO 480W 24V/20A | 20A | R$ 1.500–2.000 | 1-phase |
| PRO ECO 960W 24V/40A | 40A | R$ 2.800–3.500 | 1-phase |

### 3.9 Disjuntores Motores (Motor Protection Circuit Breakers / Motor Protections)

#### ABB MS Series (Motor protection switch)

| Model | Current Range | Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|---------------------|-------|
| MS116-0.16 | 0.10–0.16A | 0.06 kW | R$ 300–450 | Manual motor starter |
| MS116-1.0 | 0.63–1.0A | 0.37 kW | R$ 300–450 | |
| MS116-2.5 | 1.6–2.5A | 1.1 kW | R$ 320–480 | |
| MS116-6.3 | 4.0–6.3A | 3.0 kW | R$ 350–520 | |
| MS116-10 | 6.3–10A | 4.0 kW | R$ 370–550 | |
| MS116-12 | 8–12A | 5.5 kW | R$ 400–600 | |
| MS132-16 | 10–16A | 7.5 kW | R$ 450–650 | |
| MS132-20 | 16–20A | 7.5 kW | R$ 480–700 | |
| MS132-32 | 25–32A | 15 kW | R$ 550–750 | |
| MS325-40 | 40A | 18.5 kW | R$ 800–1.200 | With undervoltage release |

#### Schneider Electric GV Series

| Model | Current Range | Motor Power @ 400V | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|---------------------|-------|
| GV2ME01 | 0.1–0.16A | 0.06 kW | R$ 250–380 | Thermal-magnetic |
| GV2ME06 | 1–1.6A | 0.55 kW | R$ 280–400 | |
| GV2ME08 | 2.5–4A | 1.5 kW | R$ 300–450 | |
| GV2ME10 | 4–6A | 2.2 kW | R$ 320–480 | |
| GV2ME14 | 9–13A | 5.5 kW | R$ 380–550 | |
| GV2ME16 | 12–18A | 7.5 kW | R$ 420–600 | |
| GV2ME20 | 17–23A | 11 kW | R$ 480–700 | |
| GV2ME21 | 20–25A | 11 kW | R$ 500–750 | |
| GV2ME22 | 24–32A | 15 kW | R$ 550–800 | |
| GV2ME32 | 30–40A | 18.5 kW | R$ 650–950 | |

#### Schneider GV3 (Higher capacity)

| Model | Current Range | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| GV3P40 | 30–40A | R$ 800–1.100 | 22 kW |
| GV3P50 | 37–50A | R$ 900–1.300 | 22–30 kW |
| GV3P65 | 48–65A | R$ 1.100–1.500 | 30–37 kW |

#### Schneider GV4 (Electronic, latest generation)

| Model | Current Range | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| GV4P115 | 54–115A | R$ 1.500–2.000 | 55 kW |
| GV4PE115 | 54–115A (electronic) | R$ 2.200–3.000 | Electronic trip |

#### Siemens 3RV2 (Motor protection)

| Model | Current Range | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| 3RV2011 | 0.11–0.16A | R$ 280–400 | S00 size |
| 3RV2011 | 1.25–2.0A | R$ 300–420 | |
| 3RV2011 | 4.0–6.3A | R$ 320–450 | |
| 3RV2021 | 9–12.5A | R$ 400–550 | S0 size |
| 3RV2031 | 16–22A | R$ 550–750 | S2 size |
| 3RV2041 | 28–40A | R$ 800–1.200 | S2 size |

### 3.10 Fusíveis e Porta-Fusíveis (Fuses & Holders)

#### NH Blade Fuses (Industrial, most common in panels for power distribution)

| Size | Amperage Range | Approx. Price (BRL) | Notes |
|------|---------------|---------------------|-------|
| NH00 | 6–160A | R$ 25–60 per fuse | Common for feeder protection |
| NH1 | 80–250A | R$ 40–80 | |
| NH2 | 125–400A | R$ 60–120 | |
| NH3 | 315–630A | R$ 100–200 | |

#### NH Fuse Bases / Holders

| Model | Rated Current | Approx. Price (BRL) | Notes |
|-------|--------------|---------------------|-------|
| NH00 base panel mount | 160A | R$ 150–250 | Single-pole kit |
| NH1 base | 250A | R$ 250–400 | |
| NH00 disconnect switch | 160A | R$ 600–900 | 3-pole with visible break |
| NH00 switch-fuse | 160A | R$ 800–1.200 | 3P+N+earth |

#### Cylindrical Fuses (Control/signal circuits, 5×20mm and 6×32mm)

| Size | Voltage | Approx. Price (BRL) | Notes |
|------|---------|---------------------|-------|
| 5×20mm glass | 250V | R$ 2–5 | Control circuits |
| 5×20mm ceramic | 250V | R$ 3–8 | Higher breaking |
| 6×32mm ceramic | 250V | R$ 5–12 | Common in industrial control |
| 10×38mm | 500V | R$ 8–20 | Power fuses |

#### Fuse Holders for Cylindrical Fuses

| Model | Approx. Price (BRL) | Notes |
|-------|---------------------|-------|
| DIN rail 5×20mm | R$ 15–30 | Single-pole |
| DIN rail 6×32mm | R$ 20–40 | Single-pole |
| DIN rail 10×38mm | R$ 25–50 | Single-pole |
| Panel mount 5×20mm | R$ 10–20 | Chassis mount |

#### Brands: Siba, Mersen (Ferraz-Shawmut), Bussmann (Eaton), Littelfuse

### 3.11 Botoeiras e Sinalização (Pushbuttons & Signaling)

#### Schneider Electric Harmony XB5 (22mm, standard industrial)

| Model | Function | Color | Approx. Price (BRL) | Notes |
|-------|----------|-------|---------------------|-------|
| XB5AA31 | Momentary pushbutton | Green | R$ 45–70 | 1NO contact |
| XB5AA33 | Momentary pushbutton | Green | R$ 55–85 | 1NO+1NC |
| XB5AA41 | Momentary pushbutton | Red | R$ 45–70 | 1NC |
| XB5AA45 | Momentary pushbutton | Red | R$ 55–85 | 1NO+1NC |
| XB5AA35 | Momentary pushbutton | Black | R$ 45–70 | 1NO+1NC |
| XB5AK33 | Selector switch 3-pos | Black | R$ 70–100 | 1NO+1NC maintained |
| XB5AL33 | Mushroom head (emergency) | Red | R$ 80–120 | 1NC, twist release |
| XB5AVB3 | Pilot light | Green | R$ 55–85 | LED 220VAC |
| XB5AVB1 | Pilot light | White | R$ 55–85 | LED 220VAC |
| XB5AVB4 | Pilot light | Red | R$ 55–85 | LED 220VAC |
| XB5AVB5 | Pilot light | Yellow | R$ 55–85 | LED 220VAC |
| XB5AVB6 | Pilot light | Blue | R$ 55–85 | LED 220VAC |

#### Schneider Electric Harmony XB4 (22mm, metal, heavy-duty)

| Model | Function | Approx. Price (BRL) | Notes |
|-------|----------|---------------------|-------|
| XB4BW33B5 | Green pushbutton 1NO+1NC | R$ 70–100 | Metal, LED |
| XB4BW34B5 | Red pushbutton 1NO+1NC | R$ 70–100 | Metal |
| XB4BVB3 | Green pilot light | R$ 80–120 | LED 220VAC |

#### Schneider Electric Harmony XB7 (22mm, plastic, economical)

| Model | Function | Approx. Price (BRL) | Notes |
|-------|----------|---------------------|-------|
| XB7NA31 | Green pushbutton 1NO | R$ 25–40 | Plastic, economy |
| XB7NA42 | Red pushbutton 1NC | R$ 25–40 | |

#### Schneider Electric Harmony XAL (Emergency stop / mushroom)

| Model | Function | Approx. Price (BRL) | Notes |
|-------|----------|---------------------|-------|
| XALD02 | Emergency stop, 40mm | R$ 120–180 | Twist release, 1NC |
| XALD102 | Emergency stop + key release | R$ 180–250 | |

#### ABB CPM Series (22mm)

| Model | Function | Approx. Price (BRL) | Notes |
|-------|----------|---------------------|-------|
| CPM1-10R-20 | Red pushbutton 1NO | R$ 40–60 | |
| CPM1-10G-20 | Green pushbutton 1NO | R$ 40–60 | |
| CPM2-11R-20 | Red pushbutton 1NO+1NC | R$ 50–75 | |
| CPM3-10B-00 | Black selector 2-pos | R$ 60–90 | |
| CPM4-10R-20 | Emergency stop 40mm | R$ 90–130 | |

#### Siemens SIRIUS 3SB3 (22mm)

| Model | Function | Approx. Price (BRL) | Notes |
|-------|----------|---------------------|-------|
| 3SB3202-6AA20 | Green pushbutton 1NO | R$ 50–80 | |
| 3SB3202-6AA40 | Red pushbutton 1NC | R$ 50–80 | |
| 3SB3202-6AA60 | Yellow pushbutton 1NO | R$ 50–80 | |

### 3.12 Seccionadoras e Chaves (Disconnect Switches / Isolators)

#### ABB OT Series (Front-operated, panel mount)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| OT16F3 | 3P | 16A | R$ 120–180 | Base mount |
| OT25F3 | 3P | 25A | R$ 150–220 | |
| OT40F3 | 3P | 40A | R$ 180–260 | |
| OT63F3 | 3P | 63A | R$ 220–320 | |
| OT80F3 | 3P | 80A | R$ 280–400 | |
| OT100F3 | 3P | 100A | R$ 350–500 | |
| OT125F3 | 3P | 125A | R$ 400–600 | |
| OT160F3 | 3P | 160A | R$ 500–750 | |
| OT200F3 | 3P | 200A | R$ 650–900 | |
| OT250F3 | 3P | 250A | R$ 800–1.100 | |
| OT400F3 | 3P | 400A | R$ 1.200–1.800 | |
| OT630F3 | 3P | 630A | R$ 2.000–3.000 | |
| OT800F3 | 3P | 800A | R$ 2.800–4.000 | |
| OT1000F3 | 3P | 1000A | R$ 3.500–5.000 | |
| OT1250F3 | 3P | 1250A | R$ 4.500–6.500 | |
| OT1600F3 | 3P | 1600A | R$ 6.000–8.500 | |

**Suffix codes:** 3 = 3-pole, 4 = 4-pole, F = front operated, D = door mount, B = base mount

#### ABB OETL Series (Changeover / bypass switches)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| OETL100C3 | 3P | 100A | R$ 800–1.200 | Manual changeover |
| OETL200C3 | 3P | 200A | R$ 1.200–1.800 | |
| OETL400C3 | 3P | 400A | R$ 2.500–3.500 | |

#### Schneider Electric INS Series (Switch-disconnectors)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| INS100 | 3P | 100A | R$ 350–500 | With visible break |
| INS160 | 3P | 160A | R$ 450–650 | |
| INS250 | 3P | 250A | R$ 650–900 | |
| INS400 | 3P | 400A | R$ 1.000–1.500 | |
| INS630 | 3P | 630A | R$ 1.500–2.200 | |
| INS800 | 3P | 800A | R$ 2.200–3.200 | |

#### Schneider Electric Compact INS (Compact series)

| Model | Poles | Current | Approx. Price (BRL) | Notes |
|-------|-------|---------|---------------------|-------|
| INS100 | 3P | 100A | R$ 300–450 | Direct mount |
| INS160 | 3P | 160A | R$ 400–600 | |
| INS250 | 3P | 250A | R$ 550–800 | |

### 3.13 Dispositivos de Proteção contra Surtos (SPD / DPS)

#### Phoenix Contact VALVETRAB (Type 1+2)

| Model | Type | Approx. Price (BRL) | Notes |
|-------|------|---------------------|-------|
| 2858640 | T1+T2, 1-pole | R$ 400–600 | Pluggable |
| 2858653 | T1+T2, 3-pole | R$ 1.200–1.800 | 3-phase |

#### Phoenix Contact VAL-MS (Type 2)

| Model | Type | Approx. Price (BRL) | Notes |
|-------|------|---------------------|-------|
| 2807788 | T2, 1-pole | R$ 200–350 | Pluggable |
| 2807791 | T2, 3-pole | R$ 600–900 | 3-phase |

#### Phoenix Contact COAXPRO (Signal/data line SPD)

| Model | Approx. Price (BRL) | Notes |
|-------|---------------------|-------|
| 2800008 | R$ 150–250 | Coaxial |

#### Dehn (German brand, premium)

| Model | Type | Approx. Price (BRL) | Notes |
|-------|------|---------------------|-------|
| DEHnventil 275 | T2, 1-pole | R$ 350–500 | Premium |
| DEHnventil 275 T1+T2 | T1+T2, 1-pole | R$ 500–750 | Premium |

### 3.14 Control Transformers

| VA Rating | Primary | Secondary | Approx. Price (BRL) | Notes |
|-----------|---------|-----------|---------------------|-------|
| 50VA | 380V | 220V | R$ 150–220 | Single-phase |
| 100VA | 380V | 220V | R$ 200–300 | |
| 100VA | 380V | 127V | R$ 200–300 | |
| 200VA | 380V | 220V | R$ 280–400 | |
| 300VA | 380V | 220V | R$ 350–500 | |
| 500VA | 380V | 220V | R$ 450–650 | |
| 1000VA | 380V | 220V | R$ 700–1.000 | |
| 2000VA | 380V | 220V | R$ 1.200–1.800 | |

### 3.15 Industrial Ethernet Switches

#### Siemens SCALANCE X (Managed)

| Model | Ports | Approx. Price (BRL) | Notes |
|-------|-------|---------------------|-------|
| XB005 | 5×10/100 | R$ 1.500–2.000 | Unmanaged |
| X208 | 8×10/100 | R$ 3.500–4.500 | Managed |
| X208-1 | 8×10/100 + 1×1000 | R$ 4.500–5.500 | Managed, fiber |
| X216 | 16×10/100 | R$ 6.000–8.000 | Managed |

#### Phoenix Contact FL SWITCH (Managed)

| Model | Ports | Approx. Price (BRL) | Notes |
|-------|-------|---------------------|-------|
| 2891001 | 5×10/100 | R$ 1.200–1.800 | Unmanaged |
| 2891952 | 8×10/100 | R$ 2.500–3.500 | Managed |
| 2891111 | 16×10/100 | R$ 4.500–6.000 | Managed |

### 3.16 HMI (Human-Machine Interface)

#### Siemens KTP Series (Basic Panel)

| Model | Screen Size | Resolution | Approx. Price (BRL) | Notes |
|-------|------------|------------|---------------------|-------|
| KTP400 Basic | 4" | 320×240 | R$ 3.500–4.500 | Mono |
| KTP700 Basic | 7" | 800×480 | R$ 5.500–7.000 | Color |
| KTP900 Basic | 9" | 800×480 | R$ 7.000–9.000 | Color |
| KTP1200 Basic | 12" | 1280×800 | R$ 10.000–13.000 | Color |

#### Schneider Electric HMIGTO Series (Harmony)

| Model | Screen Size | Approx. Price (BRL) | Notes |
|----|------------|---------------------|-------|
| HMIGTO2300 | 3.5" | R$ 3.000–4.000 | Touch |
| HMIGTO3510 | 5.7" | R$ 5.000–6.500 | Touch |
| HMIGTO5510 | 10.4" | R$ 8.000–10.000 | Touch |
| HMIGTO7310 | 12.1" | R$ 12.000–15.000 | Touch |

### 3.17 Enclosures / Invólucros (Panel Enclosures)

#### Rittal / Eletrofrio / Stahl (Brazilian manufacturers)

| Type | Dimensions (H×W×D) | IP Rating | Approx. Price (BRL) | Notes |
|------|---------------------|-----------|---------------------|-------|
| Wall-mount small | 300×200×150 | IP65 | R$ 250–400 | Polyester or steel |
| Wall-mount medium | 600×400×200 | IP65 | R$ 500–800 | Steel, RAL 7035 |
| Wall-mount large | 800×600×250 | IP65 | R$ 800–1.200 | |
| Floor-standing | 1200×600×400 | IP55 | R$ 2.000–3.500 | |
| Floor-standing | 1800×800×500 | IP55 | R$ 4.000–6.000 | |
| Floor-standing | 2000×800×600 | IP55 | R$ 5.500–8.000 | |

**Materials:** Carbon steel painted (RAL 7035 standard), 304 stainless steel (food/pharma), 316 stainless steel (coastal/marine), polyester (corrosive environments).

---

## 4. Technical Rules & Norms

### 4.1 Applicable Standards

| Standard | Description | Application |
|----------|-------------|-------------|
| NR-10 | Safety in electrical installations and services | Mandatory for all electrical work in Brazil |
| NR-12 | Machine safety | Panels integrated with machines |
| NBR 5410 | Low-voltage electrical installations | Building wiring, distribution panels |
| IEC 61439-1/2 | Low-voltage switchgear and controlgear assemblies | Panel manufacturing (replaces NBR IEC 60439) |
| NBR IEC 60947 | Low-voltage switchgear and controlgear | Component selection |
| NBR 14039 | Medium voltage installations | QGBT panels > 1kV |
| NR-12 | Safety at work in machinery | Machine control panels |
| ABNT NBR IEC 62271 | High-voltage switchgear | Not typical for panel builders |
| ANEEL 482/2012 | Distributed generation connection | Solar panels |
| PRODIST | Distribution procedures | Solar grid-tie panels |

### 4.2 Minimum Clearances (IEC 61439 / NR-10)

| Voltage | Minimum clearance (air) | Minimum creepage (surface) |
|---------|------------------------|---------------------------|
| ≤ 250V | 3mm | 3mm |
| 251–690V | 5.5mm | 10mm |
| 691–1000V | 10mm | 14mm |

**NR-10 restricted approach boundary:** 0.65m for ≤ 600V, 1.0m for 601V–38kV.

### 4.3 Thermal Dissipation Requirements

**Rule of thumb for panel sizing:**
- Each VFD dissipates ~3–5% of rated power as heat
- Each soft-starter dissipates ~1–2% of rated power
- Each power supply dissipates ~15–20% of rated power
- Each PLC + I/O dissipates ~10–30W fixed

**Calculation:** Total heat (W) = Σ(P_component × loss_factor)

**Cooling methods by heat load:**
- < 200W: Natural convection (ventilation grilles)
- 200–800W: Forced ventilation (filtered fans)
- 800–3000W: Air conditioning (closed-loop cooling)
- > 3000W: Air-to-water heat exchanger or oversized enclosure

**Ambient temperature derating:** Most components rated for 40°C. For every 10°C above, derate by 10–15%.

### 4.4 Short-Circuit Withstand Ratings

**IEC 61439-1 requires:**
- Rated short-time withstand current (Icw): typically 10–50kA for 1 second
- Rated peak withstand current (Ipk): 2.2 × Icw
- Conditional short-circuit current: coordinated with upstream protective device

**Panel builder must verify:**
- Busbar rating ≥ maximum prospective fault current at point of installation
- All components rated for the available fault current
- Coordination study for selective tripping

### 4.5 Wire Sizing Rules (NBR 5410)

**Minimum cross-sections in panels:**
- Power circuits (contactors, VFDs): 1.5mm² minimum, typically 2.5–16mm²
- Control circuits: 0.5mm² minimum, typically 0.75–1.5mm²
- PLC signal wiring: 0.5mm² minimum, shielded for analog
- PE (protective earth): 2.5mm² minimum, or equal to phase conductor up to 16mm²

**Current capacity (copper, PVC insulated, in conduit):**
- 1.5mm²: 15.5A
- 2.5mm²: 21A
- 4mm²: 28A
- 6mm²: 36A
- 10mm²: 50A
- 16mm²: 68A
- 25mm²: 89A
- 35mm²: 110A
- 50mm²: 134A
- 70mm²: 171A
- 95mm²: 207A
- 120mm²: 239A

**Derating factors:** Temperature > 30°C, grouping (> 3 circuits in same conduit), harmonic content.

### 4.6 Protection Coordination

**Motor circuit coordination (Type B per IEC 60947-4-1):**
- Contactor + overload relay + short-circuit protective device (MCCB or fuses)
- Must withstand 8× motor starting current without nuisance trip
- Coordination type 1: No damage to contactor, but may need replacement
- Coordination type 2: No damage, immediate restart possible
- Coordination type a: Short-circuit protection by fuses only

**Selectivity rules:**
- Upstream device trip time ≥ 1.3× downstream device trip time at any fault current
- Time-current curves must not overlap for selectivity

### 4.7 IP Rating vs Environment Mapping

| Environment | IP Rating | Enclosure Type | Notes |
|-------------|-----------|---------------|-------|
| Indoor clean, climate-controlled | IP41 | Wall-mount steel | Standard |
| Indoor industrial, light dust | IP54 | Wall-mount steel with filters | Fan-filter ventilation |
| Indoor industrial, heavy dust/water | IP55 | Wall-mount steel or 304 SS | Gasketed door |
| Outdoor, covered (under roof) | IP55 | 304 SS or polyester | UV-resistant |
| Outdoor, exposed to rain | IP65 | 316 SS or polyester | Down-directed louvers |
| Food/beverage washdown | IP66/IP69K | 316 SS | Hygienic design |
| Coastal/marine | IP66 | 316 SS or fiberglass | Corrosion-resistant |

### 4.8 Color Coding (NBR 5410 / IEC 60446)

| Conductor | Color |
|-----------|-------|
| Phase 1 (R) | Brown or Black |
| Phase 2 (S) | Black or Brown |
| Phase 3 (T) | Gray |
| Neutral (N) | Blue |
| Protective Earth (PE) | Green-Yellow |
| PEN (combined) | Green-Yellow with blue markings |
| DC Positive | Red |
| DC Negative | Blue |
| DC Mid-point | Gray |

### 4.9 Terminal Block Color Coding

| Type | Color |
|------|-------|
| Feed-through | Gray |
| Fuse terminal | Dark gray |
| Disconnect terminal | Orange |
| Ground (PE) | Green-Yellow |
| Neutral (N) | Blue |
| Thermocouple | Brown |
| Diode terminal | Light gray |

---

## 5. Business Rules for Panel Manufacturers

### 5.1 Cost Structure

**Typical panel cost breakdown:**

| Cost Category | % of Total Cost | Notes |
|---------------|----------------|-------|
| Components (BOM) | 55–70% | Largest cost driver |
| Enclosure + accessories | 8–12% | Steel, mounting plates, DIN rails |
| Labor (assembly + wiring) | 12–18% | Skilled electricians |
| Engineering (design + drawings) | 5–8% | Electrical design, PLC programming |
| Testing (FAT) | 2–3% | Insulation, functional, hi-pot |
| Overhead (facility, tools, admin) | 5–8% | |
| **Total** | **100%** | |

### 5.2 Profit Margins by Panel Type

| Panel Type | Typical Gross Margin | Notes |
|------------|---------------------|-------|
| Simple distribution panel (QGBT) | 15–25% | Commodity, price-sensitive |
| CCM (standard) | 20–30% | Competitive market |
| CCM with VFDs | 25–35% | Higher value-add |
| Automation panel (PLC + HMI) | 30–45% | Engineering-intensive |
| Special application (pumping, solar) | 25–40% | Niche, less competition |
| Retrofit/replacement | 30–50% | Urgency premium |
| OEM (series production) | 15–25% | Volume discount, repeat business |

### 5.3 Labor Estimation Benchmarks

| Panel Type | Labor Hours | Notes |
|------------|-------------|-------|
| Simple distribution (≤ 80A) | 8–16 hours | 1 person |
| Medium distribution (80–400A) | 20–40 hours | 1–2 persons |
| CCM (4–8 drawers) | 40–80 hours | 2 persons |
| CCM (8–16 drawers) | 80–160 hours | 2–3 persons |
| Automation panel (PLC + HMI) | 40–100 hours | 1–2 persons + programmer |
| VFD panel (per VFD) | 16–32 hours | Per drive, including commissioning |
| QGBT (400–1000A) | 40–80 hours | 2 persons |
| QGBT (1000–2500A) | 80–200 hours | 2–3 persons |

**Hourly rate for skilled panel electrician (Brazil, 2025):** R$ 45–80/hour depending on region.

### 5.4 Inventory Turnover Strategy

**Components to stock (high turnover, make-to-order panels):**
- MCBs (Steck SDD, Schneider Easy9) — common ratings
- Contactors (AF09–AF65, LC1D09–LC1D65) — most common sizes
- Terminal blocks (UT 2.5, UT 4, UK 5N) — always needed
- Relays (Finder 40-series, Omny MY2N) — always needed
- Power supplies (24VDC 5A, 10A) — always needed
- Pushbuttons (Harmony XB5) — always needed
- DIN rails, wire ducts, cable ties — consumables

**Components to order per project (low turnover, high value):**
- MCCBs > 250A
- VFDs > 15 kW
- PLCs (S7-1200, M241)
- HMIs
- Disconnect switches > 250A
- Control transformers > 500VA
- Enclosures (custom sizes)

### 5.5 Common Business Models

| Model | Description | Pros | Cons |
|-------|-------------|------|------|
| Make-to-order (MTO) | Build per customer specification | No inventory risk, custom | Longer lead time |
| Assemble-to-order (ATO) | Pre-assemble sub-assemblies, configure per order | Faster delivery, some inventory | Requires forecasting |
| Make-to-stock (MTS) | Build standard panels for inventory | Immediate delivery | High inventory risk |
| OEM contract | Series production for machine builder | Stable revenue, volume discount | Price pressure, dependency |
| Retrofit/upgrade | Replace internals of existing panels | High margin, urgency | One-off, unpredictable |

### 5.6 Lead Time Benchmarks

| Panel Type | Design | Procurement | Assembly | Testing | Total |
|------------|--------|-------------|----------|---------|-------|
| Simple distribution | 2–3 days | 3–5 days | 2–3 days | 0.5 day | 8–12 days |
| CCM (standard) | 3–5 days | 5–10 days | 5–8 days | 1 day | 14–24 days |
| CCM (with VFDs) | 5–7 days | 7–14 days | 8–12 days | 1–2 days | 21–35 days |
| Automation panel | 5–10 days | 7–14 days | 8–15 days | 1–2 days | 21–41 days |
| QGBT | 3–5 days | 5–10 days | 5–10 days | 1 day | 14–26 days |

### 5.7 Pricing Strategy

**Common pricing methods in Brazil:**

1. **Cost-plus pricing:** BOM cost × 1.4–1.6 (for simple panels) to × 1.8–2.5 (for complex panels)
2. **Value-based pricing:** Based on customer's perceived value (urgency, technical complexity)
3. **Competitive pricing:** Based on market quotes (common for government tenders — "pregão eletrônico")
4. **Target costing:** Start from market price, work backward to cost

**Payment terms common in Brazil:**
- 30/60/90 days (most common for B2B)
- 14 days (for urgent/small jobs, often with 5–10% discount)
- Cartão de crédito (up to 12× for small panels)
- Boleto bancário (standard for B2B)

### 5.8 Tax Considerations

| Tax | Rate | Notes |
|-----|------|-------|
| ICMS | 17–18% (varies by state) | State VAT, applies to goods |
| IPI | 5–15% | Industrialized product tax |
| PIS | 1.65% | Federal contribution |
| COFINS | 7.6% | Federal contribution |
| ISS | 2–5% | Service tax (on labor portion) |
| **Total tax burden** | **~25–35%** | Depends on state and regime |

**Tax regimes:**
- Simples Nacional: 4–17.4% (for small businesses, revenue < R$ 4.8M/year)
- Lucro Presumido: ~13.3% (for medium businesses)
- Lucro Real: ~34% (for large businesses)

### 5.9 Common Mistakes in Panel Costing

1. **Underestimating wiring labor** — often 30–40% of total assembly time
2. **Forgetting shipping costs** — panels are heavy and bulky
3. **Ignoring engineering time** — especially for first-of-kind panels
4. **Not accounting for FAT (Factory Acceptance Test)** — customer witness testing
5. **Underpricing PLC programming** — often 20–40 hours for complex automation
6. **Forgetting spare parts** — typically 2–5% of BOM for critical spares
7. **Not including commissioning** — on-site startup is often a separate line item

---

## 6. Pricing Reference Summary

### Quick-Reference Price Table (Approximate BRL Ranges)

| Component Category | Low End | Mid Range | High End |
|-------------------|---------|-----------|----------|
| MCB (1P, 10–32A) | R$ 7 | R$ 12 | R$ 25 |
| MCB (3P, 10–63A) | R$ 95 | R$ 130 | R$ 200 |
| MCCB (100–250A) | R$ 500 | R$ 1.200 | R$ 2.000 |
| MCCB (400–630A) | R$ 2.500 | R$ 4.000 | R$ 6.500 |
| Contactor (9–25A) | R$ 60 | R$ 150 | R$ 300 |
| Contactor (32–65A) | R$ 120 | R$ 300 | R$ 500 |
| Contactor (80–116A) | R$ 280 | R$ 600 | R$ 1.200 |
| Contactor (140–205A) | R$ 500 | R$ 1.500 | R$ 3.200 |
| Contactor (300–400A) | R$ 1.500 | R$ 4.000 | R$ 8.000 |
| Relay (miniature) | R$ 25 | R$ 45 | R$ 80 |
| Terminal block (standard) | R$ 4 | R$ 8 | R$ 15 |
| Terminal block (high-current) | R$ 15 | R$ 30 | R$ 75 |
| PLC (compact, 8–14 I/O) | R$ 1.800 | R$ 3.000 | R$ 5.500 |
| PLC (modular, 15–16 I/O) | R$ 4.000 | R$ 8.000 | R$ 15.000 |
| VFD (0.75–2.2 kW) | R$ 1.500 | R$ 3.000 | R$ 5.000 |
| VFD (4–7.5 kW) | R$ 3.500 | R$ 6.000 | R$ 9.000 |
| VFD (11–15 kW) | R$ 6.500 | R$ 10.000 | R$ 15.000 |
| VFD (22–30 kW) | R$ 12.000 | R$ 18.000 | R$ 25.000 |
| Power supply (24VDC, 5–10A) | R$ 700 | R$ 1.200 | R$ 2.500 |
| Power supply (24VDC, 20–40A) | R$ 1.500 | R$ 3.000 | R$ 7.000 |
| Pushbutton (22mm) | R$ 25 | R$ 55 | R$ 120 |
| Pilot light (22mm) | R$ 55 | R$ 85 | R$ 120 |
| Disconnect switch (63–125A) | R$ 220 | R$ 400 | R$ 600 |
| Disconnect switch (250–400A) | R$ 650 | R$ 1.200 | R$ 1.800 |
| Disconnect switch (630–1000A) | R$ 2.000 | R$ 3.500 | R$ 5.000 |
| Motor protection (GV2, 6–18A) | R$ 300 | R$ 450 | R$ 600 |
| Motor protection (GV2, 25–40A) | R$ 480 | R$ 700 | R$ 950 |
| Control transformer (100–500VA) | R$ 200 | R$ 400 | R$ 650 |
| HMI (7" color) | R$ 5.500 | R$ 7.000 | R$ 10.000 |
| Ethernet switch (8-port) | R$ 1.200 | R$ 3.000 | R$ 5.500 |
| Enclosure (wall-mount, 600×400) | R$ 500 | R$ 800 | R$ 1.200 |
| Enclosure (floor-standing, 1800×800) | R$ 4.000 | R$ 6.000 | R$ 8.000 |

### Typical Panel Total Prices (Approximate)

| Panel Type | Typical Price Range (BRL) | Notes |
|------------|--------------------------|-------|
| Simple distribution (100A, 8 outgoing) | R$ 3.000–6.000 | MCBs, terminals, enclosure |
| Distribution (400A, 12 outgoing) | R$ 8.000–18.000 | MCCBs, busbars |
| QGBT (800A, 4 feeders) | R$ 25.000–50.000 | ACB incomer, MCCB feeders |
| CCM (4 drawers, DOL) | R$ 15.000–30.000 | Contactors, overloads, MCCB |
| CCM (8 drawers, mixed) | R$ 35.000–70.000 | Star-delta + DOL |
| CCMI (4 VFDs, 7.5 kW each) | R$ 50.000–80.000 | VFDs + filters + PLC |
| Automation panel (PLC + HMI) | R$ 15.000–40.000 | PLC, HMI, power supply, terminals |
| VFD panel (1 × 15 kW) | R$ 12.000–20.000 | VFD, bypass, control |
| Solar AC protection board | R$ 2.000–5.000 | SPD, disconnect, MCBs |
| Solar DC protection box | R$ 1.500–4.000 | DC fuses, SPD, disconnect |
| Pumping panel (2 pumps, VFD) | R$ 25.000–50.000 | VFDs, PLC, pressure transducer |
| Retrofit (replace internals) | R$ 8.000–25.000 | Keep enclosure, replace all |

---

## Appendix A: Manufacturer Contact Information (Brazil)

| Manufacturer | Website (Brazil) | Notes |
|-------------|-----------------|-------|
| ABB | abb.com/pt | Full range, strong in VFDs and contactors |
| Schneider Electric | se.com/br | Full range, strong in breakers and automation |
| Siemens | siemens.com/br | Full range, strong in PLCs and automation |
| Eaton | eaton.com/br | MCCBs, UPS, power distribution |
| Wago | wago.com/br | Terminals, PLCs, interface |
| Rockwell Automation | rockwellautomation.com.br | PLCs, HMIs, strong in automotive |
| Phoenix Contact | phoenixcontact.com.br | Terminals, power supplies, relays |
| Weidmüller | weidmueller.com.br | Terminals, relays, enclosures |
| Finder | finder.pt | Relays (manufactured in Italy) |
| Omron | omron.com.br | Relays, sensors, automation |
| Mean Well | meanwell.com.br | Power supplies (Taiwanese, strong in Brazil) |
| WEG | weg.net/br | Brazilian! VFDs, motors, transformers, MCCBs |
| Steck | steck.com.br | Brazilian! MCBs, distribution |
| Elgin | elgin.com.br | Brazilian! MCBs, distribution |
| Soprano | soprano.com.br | Brazilian! Contactors, mini-contactors |

## Appendix B: Key Brazilian Industry Associations

| Association | Website | Relevance |
|-------------|---------|-----------|
| ABNT | abt.org.br | Brazilian technical standards |
| ANEEL | aneel.gov.br | Energy regulatory authority |
| CNI | cni.org.br | National industry confederation |
| SENAI | senai.org.br | Technical training (NR-10 courses) |
| ABINEE | abinee.org.br | Electrical and electronics industry association |
| QUALIVERDE | qualiverde.org.br | Panel quality certification |

## Appendix C: Glossary of Brazilian Electrical Terms

| Portuguese | English | Notes |
|------------|---------|-------|
| Painel elétrico | Electrical panel | General term |
| CCM | Motor Control Center | Centro de Controle de Motores |
| QGBT | Main distribution board | Quadro Geral de Baixa Tensão |
| Disjuntor | Circuit breaker | |
| Contator | Contactor | |
| Relé | Relay | |
| Borne / Terminal | Terminal block | |
| CLP | PLC | Controlador Lógico Programável |
| IHM | HMI | Interface Homem-Máquina |
| Inversor / VFD | Variable Frequency Drive | Inversor de Frequência |
| Fonte | Power supply | Fonte de Alimentação |
| Seccionadora | Disconnect switch | |
| Botoeira | Pushbutton | |
| Sinalização | Signaling / indicator light | |
| Barramento | Busbar | |
| Gaveta | Drawer (CCM) | |
| Partida direta | DOL (Direct-On-Line) | |
| Partida estrela-triângulo | Star-delta starter | |
| Soft-starter | Soft starter | |
| Cabo | Cable / wire | |
| Fio | Wire | |
| Montagem | Assembly | |
| Comissionamento | Commissioning | |
| FAT | Factory Acceptance Test | |
| SAT | Site Acceptance Test | |
| NR-10 | Safety regulation | Norma Regulamentadora 10 |
| ART | Technical responsibility note | Anotação de Responsabilidade Técnica |
| CREA | Engineering council | Conselho Regional de Engenharia |
| Técnico responsável | Responsible technician | Must have CREA registration |

---

*This document is intended as a comprehensive reference for building a CPQ Panel Builder system for the Brazilian market. All prices are approximate and subject to market fluctuations. Always verify current pricing with authorized distributors before quoting.*
