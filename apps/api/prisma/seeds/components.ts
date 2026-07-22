import { PrismaClient, PoleCount, MountingType } from '@prisma/client';

const prisma = new PrismaClient();

const COMPONENTS = [
  // MCBs — Steck SDD (Brazilian, most common)
  { cat: 'MCB', sku: 'STD-SDD61C10', brand: 'Steck', model: 'SDD61C10', name: 'Disjuntor 1P 10A Curva C', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 9, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C16', brand: 'Steck', model: 'SDD61C16', name: 'Disjuntor 1P 16A Curva C', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 11, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C20', brand: 'Steck', model: 'SDD61C20', name: 'Disjuntor 1P 20A Curva C', moduleWidth: 1, ratedCurrent: 20, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 12, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C25', brand: 'Steck', model: 'SDD61C25', name: 'Disjuntor 1P 25A Curva C', moduleWidth: 1, ratedCurrent: 25, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 13, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C32', brand: 'Steck', model: 'SDD61C32', name: 'Disjuntor 1P 32A Curva C', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 16, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C40', brand: 'Steck', model: 'SDD61C40', name: 'Disjuntor 1P 40A Curva C', moduleWidth: 1, ratedCurrent: 40, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 19, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C50', brand: 'Steck', model: 'SDD61C50', name: 'Disjuntor 1P 50A Curva C', moduleWidth: 1, ratedCurrent: 50, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 28, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD61C63', brand: 'Steck', model: 'SDD61C63', name: 'Disjuntor 1P 63A Curva C', moduleWidth: 1, ratedCurrent: 63, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 35, formFactorGroup: 'MCB_1P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD63C16', brand: 'Steck', model: 'SDD63C16', name: 'Disjuntor 3P 16A Curva C', moduleWidth: 3, ratedCurrent: 16, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 120, formFactorGroup: 'MCB_3P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD63C25', brand: 'Steck', model: 'SDD63C25', name: 'Disjuntor 3P 25A Curva C', moduleWidth: 3, ratedCurrent: 25, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 135, formFactorGroup: 'MCB_3P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD63C32', brand: 'Steck', model: 'SDD63C32', name: 'Disjuntor 3P 32A Curva C', moduleWidth: 3, ratedCurrent: 32, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 150, formFactorGroup: 'MCB_3P_3KA' },
  { cat: 'MCB', sku: 'STD-SDD63C63', brand: 'Steck', model: 'SDD63C63', name: 'Disjuntor 3P 63A Curva C', moduleWidth: 3, ratedCurrent: 63, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 200, formFactorGroup: 'MCB_3P_3KA' },

  // MCBs — Schneider Easy9
  { cat: 'MCB', sku: 'SCH-EZ9C10', brand: 'Schneider', model: 'EZ9F33110', name: 'Disjuntor Easy9 1P 10A', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 35, formFactorGroup: 'MCB_1P_4KA' },
  { cat: 'MCB', sku: 'SCH-EZ9C20', brand: 'Schneider', model: 'EZ9F33120', name: 'Disjuntor Easy9 1P 20A', moduleWidth: 1, ratedCurrent: 20, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 40, formFactorGroup: 'MCB_1P_4KA' },
  { cat: 'MCB', sku: 'SCH-EZ9C32', brand: 'Schneider', model: 'EZ9F33132', name: 'Disjuntor Easy9 1P 32A', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 50, formFactorGroup: 'MCB_1P_4KA' },
  { cat: 'MCB', sku: 'SCH-EZ9C63', brand: 'Schneider', model: 'EZ9F33163', name: 'Disjuntor Easy9 1P 63A', moduleWidth: 1, ratedCurrent: 63, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 60, formFactorGroup: 'MCB_1P_4KA' },

  // MCCBs — ABB Tmax
  { cat: 'MCCB', sku: 'ABB-T2S100', brand: 'ABB', model: 'T2S 100 3P', name: 'Disjuntor Caixa Moldada T2S 100A', moduleWidth: 0, ratedCurrent: 100, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 650, formFactorGroup: 'MCCB_100A' },
  { cat: 'MCCB', sku: 'ABB-T2S160', brand: 'ABB', model: 'T2S 160 3P', name: 'Disjuntor Caixa Moldada T2S 160A', moduleWidth: 0, ratedCurrent: 160, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 800, formFactorGroup: 'MCCB_160A' },
  { cat: 'MCCB', sku: 'ABB-T4S250', brand: 'ABB', model: 'T4S 250 3P', name: 'Disjuntor Caixa Moldada T4S 250A', moduleWidth: 0, ratedCurrent: 250, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 1600, formFactorGroup: 'MCCB_250A' },
  { cat: 'MCCB', sku: 'ABB-T5S400', brand: 'ABB', model: 'T5S 400 3P', name: 'Disjuntor Caixa Moldada T5S 400A', moduleWidth: 0, ratedCurrent: 400, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 3200, formFactorGroup: 'MCCB_400A' },
  { cat: 'MCCB', sku: 'ABB-T5S630', brand: 'ABB', model: 'T5S 630 3P', name: 'Disjuntor Caixa Moldada T5S 630A', moduleWidth: 0, ratedCurrent: 630, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 5000, formFactorGroup: 'MCCB_630A' },

  // MCCBs — Schneider NSX
  { cat: 'MCCB', sku: 'SCH-NSX100', brand: 'Schneider', model: 'NSX100F 3P', name: 'Disjuntor Compact NSX 100A', moduleWidth: 0, ratedCurrent: 100, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 1000, formFactorGroup: 'MCCB_100A' },
  { cat: 'MCCB', sku: 'SCH-NSX250', brand: 'Schneider', model: 'NSX250F 3P', name: 'Disjuntor Compact NSX 250A', moduleWidth: 0, ratedCurrent: 250, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 1600, formFactorGroup: 'MCCB_250A' },
  { cat: 'MCCB', sku: 'SCH-NSX400', brand: 'Schneider', model: 'NSX400F 3P', name: 'Disjuntor Compact NSX 400A', moduleWidth: 0, ratedCurrent: 400, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 3200, formFactorGroup: 'MCCB_400A' },
  { cat: 'MCCB', sku: 'SCH-NSX630', brand: 'Schneider', model: 'NSX630F 3P', name: 'Disjuntor Compact NSX 630A', moduleWidth: 0, ratedCurrent: 630, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, typicalPrice: 4500, formFactorGroup: 'MCCB_630A' },

  // Contactors — ABB AF Series
  { cat: 'CONTACTOR', sku: 'ABB-AF09', brand: 'ABB', model: 'AF09-30-10-11', name: 'Contator ABB AF09 9A 24-60V', moduleWidth: 1, ratedCurrent: 9, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 450, formFactorGroup: 'CONTACTOR_AF09' },
  { cat: 'CONTACTOR', sku: 'ABB-AF16', brand: 'ABB', model: 'AF16-30-10-11', name: 'Contator ABB AF16 16A 24-60V', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 580, formFactorGroup: 'CONTACTOR_AF16' },
  { cat: 'CONTACTOR', sku: 'ABB-AF25', brand: 'ABB', model: 'AF25-30-10-11', name: 'Contator ABB AF25 25A 24-60V', moduleWidth: 1, ratedCurrent: 25, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 650, formFactorGroup: 'CONTACTOR_AF25' },
  { cat: 'CONTACTOR', sku: 'ABB-AF40', brand: 'ABB', model: 'AF40-30-10-11', name: 'Contator ABB AF40 40A 24-60V', moduleWidth: 1, ratedCurrent: 40, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 900, formFactorGroup: 'CONTACTOR_AF40' },
  { cat: 'CONTACTOR', sku: 'ABB-AF65', brand: 'ABB', model: 'AF65-30-10-11', name: 'Contator ABB AF65 65A 24-60V', moduleWidth: 1, ratedCurrent: 65, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 1250, formFactorGroup: 'CONTACTOR_AF65' },
  { cat: 'CONTACTOR', sku: 'ABB-AF95', brand: 'ABB', model: 'AF95-30-10-11', name: 'Contator ABB AF95 95A 24-60V', moduleWidth: 1, ratedCurrent: 95, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 1700, formFactorGroup: 'CONTACTOR_AF95' },
  { cat: 'CONTACTOR', sku: 'ABB-AF140', brand: 'ABB', model: 'AF140-30-10-11', name: 'Contator ABB AF140 140A 24-60V', moduleWidth: 0, ratedCurrent: 140, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 1700, formFactorGroup: 'CONTACTOR_AF140' },
  { cat: 'CONTACTOR', sku: 'ABB-AF205', brand: 'ABB', model: 'AF205-30-10-11', name: 'Contator ABB AF205 205A 24-60V', moduleWidth: 0, ratedCurrent: 205, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 2600, formFactorGroup: 'CONTACTOR_AF205' },

  // Contactors — Schneider LC1D
  { cat: 'CONTACTOR', sku: 'SCH-LC1D09', brand: 'Schneider', model: 'LC1D096M7C', name: 'Contator Tesys D LC1D09 9A 220V', moduleWidth: 1, ratedCurrent: 9, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 75, formFactorGroup: 'CONTACTOR_LC1D09' },
  { cat: 'CONTACTOR', sku: 'SCH-LC1D18', brand: 'Schneider', model: 'LC1D186M7C', name: 'Contator Tesys D LC1D18 16A 220V', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 100, formFactorGroup: 'CONTACTOR_LC1D18' },
  { cat: 'CONTACTOR', sku: 'SCH-LC1D32', brand: 'Schneider', model: 'LC1D326M7C', name: 'Contator Tesys D LC1D32 32A 220V', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 155, formFactorGroup: 'CONTACTOR_LC1D32' },
  { cat: 'CONTACTOR', sku: 'SCH-LC1D65', brand: 'Schneider', model: 'LC1D65AM7C', name: 'Contator Tesys D LC1D65 65A 220V', moduleWidth: 1, ratedCurrent: 65, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 300, formFactorGroup: 'CONTACTOR_LC1D65' },
  { cat: 'CONTACTOR', sku: 'SCH-LC1D95', brand: 'Schneider', model: 'LC1D95AM7C', name: 'Contator Tesys D LC1D95 95A 220V', moduleWidth: 1, ratedCurrent: 95, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 450, formFactorGroup: 'CONTACTOR_LC1D95' },

  // Contactors — WEG CWC (Brazilian)
  { cat: 'CONTACTOR', sku: 'WEG-CWC09', brand: 'WEG', model: 'CWC09-10-22', name: 'Contator WEG CWC09 9A', moduleWidth: 1, ratedCurrent: 9, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 90, formFactorGroup: 'CONTACTOR_CWC09' },
  { cat: 'CONTACTOR', sku: 'WEG-CWC016', brand: 'WEG', model: 'CWC016-10-22', name: 'Contator WEG CWC016 16A', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 120, formFactorGroup: 'CONTACTOR_CWC016' },
  { cat: 'CONTACTOR', sku: 'WEG-CWC025', brand: 'WEG', model: 'CWC025-10-22', name: 'Contator WEG CWC025 25A', moduleWidth: 1, ratedCurrent: 25, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 150, formFactorGroup: 'CONTACTOR_CWC025' },

  // Relays — Finder
  { cat: 'RELAY', sku: 'FIN-40.31', brand: 'Finder', model: '40.31.8.230.0000', name: 'Relé Finder 40.31 1CO 230VAC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 38, formFactorGroup: 'RELAY_1CO_10A' },
  { cat: 'RELAY', sku: 'FIN-40.52', brand: 'Finder', model: '40.52.8.230.0000', name: 'Relé Finder 40.52 2CO 230VAC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 42, formFactorGroup: 'RELAY_2CO_10A' },
  { cat: 'RELAY', sku: 'FIN-55.34', brand: 'Finder', model: '55.34.8.230.0400', name: 'Relé Finder 55.34 4CO 230VAC DIN', moduleWidth: 1, ratedCurrent: 7, ratedVoltage: '250V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 75, formFactorGroup: 'RELAY_4CO_7A' },
  { cat: 'RELAY', sku: 'FIN-60.12', brand: 'Finder', model: '60.12.8.230.0000', name: 'Relé Finder 60.12 2CO 230VAC DIN', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 68, formFactorGroup: 'RELAY_2CO_10A' },

  // Relays — Omron
  { cat: 'RELAY', sku: 'OMR-MY2N', brand: 'Omron', model: 'MY2N-DC24', name: 'Relé Omny MY2N 2CO 24VDC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 32, formFactorGroup: 'RELAY_2CO_10A' },
  { cat: 'RELAY', sku: 'OMR-MY4N', brand: 'Omron', model: 'MY4N-DC24', name: 'Relé Omny MY4N 4CO 24VDC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 45, formFactorGroup: 'RELAY_4CO_10A' },

  // Terminal Blocks — Phoenix Contact UT
  { cat: 'TERMINAL', sku: 'PXC-UT2.5', brand: 'Phoenix Contact', model: 'UT 2,5', name: 'Borne Phoenix UT 2.5mm² Cinza', moduleWidth: 1, ratedCurrent: 24, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 5, formFactorGroup: 'TERMINAL_2.5MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT4', brand: 'Phoenix Contact', model: 'UT 4', name: 'Borne Phoenix UT 4mm² Cinza', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 7, formFactorGroup: 'TERMINAL_4MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT6', brand: 'Phoenix Contact', model: 'UT 6', name: 'Borne Phoenix UT 6mm² Cinza', moduleWidth: 1, ratedCurrent: 41, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 8, formFactorGroup: 'TERMINAL_6MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT10', brand: 'Phoenix Contact', model: 'UT 10', name: 'Borne Phoenix UT 10mm² Cinza', moduleWidth: 1, ratedCurrent: 57, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 10, formFactorGroup: 'TERMINAL_10MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT16', brand: 'Phoenix Contact', model: 'UT 16', name: 'Borne Phoenix UT 16mm² Cinza', moduleWidth: 1, ratedCurrent: 76, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 13, formFactorGroup: 'TERMINAL_16MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT35', brand: 'Phoenix Contact', model: 'UT 35', name: 'Borne Phoenix UT 35mm² Cinza', moduleWidth: 2, ratedCurrent: 125, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 20, formFactorGroup: 'TERMINAL_35MM2' },
  { cat: 'TERMINAL', sku: 'PXC-UT2.5-PE', brand: 'Phoenix Contact', model: 'UT 2,5-PE', name: 'Borne Phoenix UT 2.5mm² PE', moduleWidth: 1, ratedCurrent: 24, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 8, formFactorGroup: 'TERMINAL_PE_2.5MM2' },

  // Terminal Blocks — Wago
  { cat: 'TERMINAL', sku: 'WAG-280-992', brand: 'Wago', model: '280-992', name: 'Borne Wago 280 2.5mm²', moduleWidth: 1, ratedCurrent: 24, ratedVoltage: '500V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 7, formFactorGroup: 'TERMINAL_2.5MM2' },

  // PLCs — Siemens S7-1200
  { cat: 'PLC', sku: 'SIE-1211C', brand: 'Siemens', model: 'CPU 1211C DC/DC/DC', name: 'CLP Siemens S7-1200 1211C', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 2500, formFactorGroup: 'PLC_S7_1200' },
  { cat: 'PLC', sku: 'SIE-1214C', brand: 'Siemens', model: 'CPU 1214C DC/DC/DC', name: 'CLP Siemens S7-1200 1214C', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4000, formFactorGroup: 'PLC_S7_1200' },
  { cat: 'PLC', sku: 'SIE-1215C', brand: 'Siemens', model: 'CPU 1215C DC/DC/DC', name: 'CLP Siemens S7-1200 1215C', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 5200, formFactorGroup: 'PLC_S7_1200' },

  // PLCs — Schneider M221
  { cat: 'PLC', sku: 'SCH-M221CE24T', brand: 'Schneider', model: 'M221CE24T', name: 'CLP Schneider M221 24I/O', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 2600, formFactorGroup: 'PLC_M221' },
  { cat: 'PLC', sku: 'SCH-M241CE24T', brand: 'Schneider', model: 'M241CE24T', name: 'CLP Schneider M241 24I/O', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4800, formFactorGroup: 'PLC_M241' },

  // PLCs — Wago PFC200
  { cat: 'PLC', sku: 'WAG-PFC200', brand: 'Wago', model: 'PFC200 750-8212', name: 'CLP Wago PFC200', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4800, formFactorGroup: 'PLC_PFC200' },

  // VFDs — ABB ACS355
  { cat: 'VFD', sku: 'ABB-ACS355-1.5', brand: 'ABB', model: 'ACS355-03E-05A6-4', name: 'Inversor ABB ACS355 1.5kW', moduleWidth: 0, ratedCurrent: 5.6, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 3400, formFactorGroup: 'VFD_1.5KW' },
  { cat: 'VFD', sku: 'ABB-ACS355-3.0', brand: 'ABB', model: 'ACS355-03E-09A0-4', name: 'Inversor ABB ACS355 3kW', moduleWidth: 0, ratedCurrent: 9, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 4500, formFactorGroup: 'VFD_3KW' },
  { cat: 'VFD', sku: 'ABB-ACS355-5.5', brand: 'ABB', model: 'ACS355-03E-15A6-4', name: 'Inversor ABB ACS355 5.5kW', moduleWidth: 0, ratedCurrent: 15.6, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 6200, formFactorGroup: 'VFD_5.5KW' },
  { cat: 'VFD', sku: 'ABB-ACS355-7.5', brand: 'ABB', model: 'ACS355-03E-23A1-4', name: 'Inversor ABB ACS355 7.5kW', moduleWidth: 0, ratedCurrent: 23.1, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 7200, formFactorGroup: 'VFD_7.5KW' },
  { cat: 'VFD', sku: 'ABB-ACS355-11', brand: 'ABB', model: 'ACS355-03E-32A-4', name: 'Inversor ABB ACS355 11kW', moduleWidth: 0, ratedCurrent: 32, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 9000, formFactorGroup: 'VFD_11KW' },
  { cat: 'VFD', sku: 'ABB-ACS355-15', brand: 'ABB', model: 'ACS355-03E-44A0-4', name: 'Inversor ABB ACS355 15kW', moduleWidth: 0, ratedCurrent: 44, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 11000, formFactorGroup: 'VFD_15KW' },

  // VFDs — WEG CFW11 (Brazilian)
  { cat: 'VFD', sku: 'WEG-CFW11-1.5', brand: 'WEG', model: 'CFW11 00150 T 2', name: 'Inversor WEG CFW11 1.5HP', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '220V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 1900, formFactorGroup: 'VFD_1.5HP' },
  { cat: 'VFD', sku: 'WEG-CFW11-3.0', brand: 'WEG', model: 'CFW11 00370 T 2', name: 'Inversor WEG CFW11 3.7HP', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '220V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 3200, formFactorGroup: 'VFD_3.7HP' },
  { cat: 'VFD', sku: 'WEG-CFW11-7.5', brand: 'WEG', model: 'CFW11 00750 T 2', name: 'Inversor WEG CFW11 7.5HP', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '220V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 4600, formFactorGroup: 'VFD_7.5HP' },

  // Power Supplies — Phoenix Contact QUINT
  { cat: 'PSU', sku: 'PXC-QUINT-5A', brand: 'Phoenix Contact', model: 'QUINT-PS/1AC/24DC/5', name: 'Fonte QUINT 24VDC 5A', moduleWidth: 1, ratedCurrent: 5, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1400, formFactorGroup: 'PSU_24V_5A' },
  { cat: 'PSU', sku: 'PXC-QUINT-10A', brand: 'Phoenix Contact', model: 'QUINT-PS/1AC/24DC/10', name: 'Fonte QUINT 24VDC 10A', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 2200, formFactorGroup: 'PSU_24V_10A' },
  { cat: 'PSU', sku: 'PXC-QUINT-20A', brand: 'Phoenix Contact', model: 'QUINT-PS/1AC/24DC/20', name: 'Fonte QUINT 24VDC 20A', moduleWidth: 0, ratedCurrent: 20, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 3800, formFactorGroup: 'PSU_24V_20A' },

  // Power Supplies — Mean Well (economical)
  { cat: 'PSU', sku: 'MW-HDR60', brand: 'Mean Well', model: 'HDR-60-24', name: 'Fonte Mean Well 24VDC 2.5A', moduleWidth: 1, ratedCurrent: 2.5, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 220, formFactorGroup: 'PSU_24V_2.5A' },
  { cat: 'PSU', sku: 'MW-HDR100', brand: 'Mean Well', model: 'HDR-100-24', name: 'Fonte Mean Well 24VDC 4.2A', moduleWidth: 1, ratedCurrent: 4.2, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 320, formFactorGroup: 'PSU_24V_4A' },

  // Motor Protection — Schneider GV2
  { cat: 'MOTOR_PROTECTION', sku: 'SCH-GV2ME08', brand: 'Schneider', model: 'GV2ME08', name: 'Protetor Motor GV2ME 2.5-4A', moduleWidth: 1, ratedCurrent: 4, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 380, formFactorGroup: 'MOTOR_PROT_4A' },
  { cat: 'MOTOR_PROTECTION', sku: 'SCH-GV2ME14', brand: 'Schneider', model: 'GV2ME14', name: 'Protetor Motor GV2ME 9-13A', moduleWidth: 1, ratedCurrent: 13, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 480, formFactorGroup: 'MOTOR_PROT_13A' },
  { cat: 'MOTOR_PROTECTION', sku: 'SCH-GV2ME22', brand: 'Schneider', model: 'GV2ME22', name: 'Protetor Motor GV2ME 24-32A', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 680, formFactorGroup: 'MOTOR_PROT_32A' },

  // Pushbuttons — Schneider Harmony XB5
  { cat: 'PUSHBUTTON', sku: 'SCH-XB5AA33', brand: 'Schneider', model: 'XB5AA3311C', name: 'Botoeira Verde 1NO+1NC 22mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PUSHBUTTON_22MM' },
  { cat: 'PUSHBUTTON', sku: 'SCH-XB5AA45', brand: 'Schneider', model: 'XB5AA4511C', name: 'Botoeira Vermelha 1NO+1NC 22mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PUSHBUTTON_22MM' },
  { cat: 'PUSHBUTTON', sku: 'SCH-XB5AVB3', brand: 'Schneider', model: 'XB5AVB3', name: 'Piloto Verde LED 220V 22mm', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '220V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PILOT_22MM' },

  // Disconnect Switches — ABB OT
  { cat: 'DISCONNECT_SWITCH', sku: 'ABB-OT40F3', brand: 'ABB', model: 'OT40F3', name: 'Seccionadora ABB OT40 40A 3P', moduleWidth: 0, ratedCurrent: 40, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 200, formFactorGroup: 'DISCONNECT_40A' },
  { cat: 'DISCONNECT_SWITCH', sku: 'ABB-OT100F3', brand: 'ABB', model: 'OT100F3', name: 'Seccionadora ABB OT100 100A 3P', moduleWidth: 0, ratedCurrent: 100, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 420, formFactorGroup: 'DISCONNECT_100A' },
  { cat: 'DISCONNECT_SWITCH', sku: 'ABB-OT250F3', brand: 'ABB', model: 'OT250F3', name: 'Seccionadora ABB OT250 250A 3P', moduleWidth: 0, ratedCurrent: 250, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 950, formFactorGroup: 'DISCONNECT_250A' },

  // SPD — Phoenix Contact
  { cat: 'SPD', sku: 'PXC-VAL-MS', brand: 'Phoenix Contact', model: 'VAL-MS 275', name: 'DPS Phoenix Contact T2 1P', moduleWidth: 1, ratedCurrent: 0, ratedVoltage: '275V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 480, formFactorGroup: 'SPD_T2_1P' },
  { cat: 'SPD', sku: 'PXC-VAL-MS-3P', brand: 'Phoenix Contact', model: 'VAL-MS 275 3P', name: 'DPS Phoenix Contact T2 3P', moduleWidth: 3, ratedCurrent: 0, ratedVoltage: '275V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1500, formFactorGroup: 'SPD_T2_3P' },

  // Control Transformers
  { cat: 'CONTROL_TRANSFORMER', sku: 'TRAFO-100VA', brand: 'WEG', model: 'TF 100VA 380/220V', name: 'Transformador 100VA 380/220V', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 250, formFactorGroup: 'TRAFO_100VA' },
  { cat: 'CONTROL_TRANSFORMER', sku: 'TRAFO-200VA', brand: 'WEG', model: 'TF 200VA 380/220V', name: 'Transformador 200VA 380/220V', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 340, formFactorGroup: 'TRAFO_200VA' },
  { cat: 'CONTROL_TRANSFORMER', sku: 'TRAFO-500VA', brand: 'WEG', model: 'TF 500VA 380/220V', name: 'Transformador 500VA 380/220V', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 550, formFactorGroup: 'TRAFO_500VA' },

  // Ethernet Switches
  { cat: 'ETHERNET_SWITCH', sku: 'SIE-XB005', brand: 'Siemens', model: 'SCALANCE XB005', name: 'Switch Ethernet 5 portas', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1750, formFactorGroup: 'SWITCH_5P' },
  { cat: 'ETHERNET_SWITCH', sku: 'SIE-X208', brand: 'Siemens', model: 'SCALANCE X208', name: 'Switch Ethernet 8 portas gerenciável', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4000, formFactorGroup: 'SWITCH_8P' },

  // HMI — Siemens KTP
  { cat: 'HMI', sku: 'SIE-KTP700', brand: 'Siemens', model: 'KTP700 Basic', name: 'IHM Siemens KTP700 7"', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '24V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 6200, formFactorGroup: 'HMI_7IN' },
  { cat: 'HMI', sku: 'SIE-KTP1200', brand: 'Siemens', model: 'KTP1200 Basic', name: 'IHM Siemens KTP1200 12"', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: '24V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 11500, formFactorGroup: 'HMI_12IN' },

  // Enclosures
  { cat: 'ENCLOSURE', sku: 'ENC-604020', brand: 'Eletrofrio', model: '600×400×200', name: 'QGX 600×400×200 IP65', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: null, poles: null, mountingType: MountingType.DIRECT, typicalPrice: 650, formFactorGroup: 'ENC_604020' },
  { cat: 'ENCLOSURE', sku: 'ENC-806025', brand: 'Eletrofrio', model: '800×600×250', name: 'QGX 800×600×250 IP65', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: null, poles: null, mountingType: MountingType.DIRECT, typicalPrice: 1000, formFactorGroup: 'ENC_806025' },
  { cat: 'ENCLOSURE', sku: 'ENC-1008030', brand: 'Eletrofrio', model: '1000×800×300', name: 'QGX 1000×800×300 IP65', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: null, poles: null, mountingType: MountingType.DIRECT, typicalPrice: 1500, formFactorGroup: 'ENC_1008030' },
  { cat: 'ENCLOSURE', sku: 'ENC-1800800', brand: 'Eletrofrio', model: '1800×800×500', name: 'QGI 1800×800×500 IP55', moduleWidth: 0, ratedCurrent: 0, ratedVoltage: null, poles: null, mountingType: MountingType.DIRECT, typicalPrice: 5000, formFactorGroup: 'ENC_1800800' },
];

async function main() {
  console.log('Seeding real components...');

  for (const comp of COMPONENTS) {
    const category = await prisma.componentCategory.findFirst({
      where: { tenantId: 'SYSTEM', code: comp.cat },
    });
    if (!category) continue;

    await prisma.component.upsert({
      where: {
        tenantId_sku: { tenantId: 'SYSTEM', sku: comp.sku },
      },
      update: {
        name: comp.name,
        brand: comp.brand,
        modelNumber: comp.modelNumber,
        moduleWidth: comp.moduleWidth,
        ratedCurrent: comp.ratedCurrent,
        ratedVoltage: comp.ratedVoltage,
        poles: comp.poles,
        mountingType: comp.mountingType,
        typicalPrice: comp.typicalPrice,
        formFactorGroup: comp.formFactorGroup,
      },
      create: {
        tenantId: 'SYSTEM',
        componentCategoryId: category.id,
        sku: comp.sku,
        name: comp.name,
        brand: comp.brand,
        manufacturer: comp.brand,
        modelNumber: comp.modelNumber,
        moduleWidth: comp.moduleWidth,
        ratedCurrent: comp.ratedCurrent,
        ratedVoltage: comp.ratedVoltage,
        poles: comp.poles,
        mountingType: comp.mountingType,
        typicalPrice: comp.typicalPrice,
        formFactorGroup: comp.formFactorGroup,
      },
    });
  }

  console.log(`Seeded ${COMPONENTS.length} real components`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
