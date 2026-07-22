import { PrismaClient, PoleCount, MountingType } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { code: 'MCB', name: 'Disjuntores Termomagnéticos', description: 'Disjuntores DIN rail para proteção de circuitos' },
  { code: 'MCCB', name: 'Disjuntores Caixa Moldada', description: 'Disjuntores de grande capacidade' },
  { code: 'CONTACTOR', name: 'Contatores', description: 'Contatores para acionamento de cargas' },
  { code: 'RELAY', name: 'Relés', description: 'Relés de interface e temporização' },
  { code: 'TERMINAL', name: 'Bornes e Terminais', description: 'Terminais de conexão DIN rail' },
  { code: 'PLC', name: 'CLPs', description: 'Controladores Lógicos Programáveis' },
  { code: 'VFD', name: 'Inversores de Frequência', description: 'Variadores de velocidade' },
  { code: 'PSU', name: 'Fontes de Alimentação', description: 'Fontes 24VDC para painéis' },
  { code: 'MOTOR_PROTECTION', name: 'Disjuntores Motores', description: 'Proteção específica de motores' },
  { code: 'FUSE', name: 'Fusíveis', description: 'Fusíveis NH, Diazed, Silized' },
  { code: 'PUSHBUTTON', name: 'Botoeiras e Sinalização', description: 'Botoeiras, sinalizadores e seletores 22mm' },
  { code: 'DISCONNECT_SWITCH', name: 'Seccionadoras', description: 'Chaves seccionadoras com carga' },
  { code: 'SPD', name: 'Protetores contra Surtos (DPS)', description: 'Dispositivos de proteção contra surtos' },
  { code: 'CONTROL_TRANSFORMER', name: 'Transformadores de Controle', description: 'Transformadores 380/220 ou 380/127V' },
  { code: 'ETHERNET_SWITCH', name: 'Switches Ethernet', description: 'Switches industriais gerenciáveis' },
  { code: 'HMI', name: 'Interfaces Homem-Máquina', description: 'Painéis de operação e visualização' },
  { code: 'ENCLOSURE', name: 'Invólucros', description: 'Quadros e gabinetes elétricos' },
  { code: 'DIN_RAIL', name: 'Trilhos DIN', description: 'Trilhos de montagem padrão 35mm' },
];

const COMPONENTS = [
  { sku: 'ABB-S201-C6', name: 'Disjuntor S201-C6', brand: 'ABB', category: 'MCB', ratedCurrent: 6, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 28.5, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S201-C10', name: 'Disjuntor S201-C10', brand: 'ABB', category: 'MCB', ratedCurrent: 10, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 28.5, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S201-C16', name: 'Disjuntor S201-C16', brand: 'ABB', category: 'MCB', ratedCurrent: 16, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 28.5, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S201-C20', name: 'Disjuntor S201-C20', brand: 'ABB', category: 'MCB', ratedCurrent: 20, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 28.5, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S201-C32', name: 'Disjuntor S201-C32', brand: 'ABB', category: 'MCB', ratedCurrent: 32, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 32.0, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S202-C16', name: 'Disjuntor S202-C16', brand: 'ABB', category: 'MCB', ratedCurrent: 16, poles: PoleCount.TWO_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 65.0, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-S203-C16', name: 'Disjuntor S203-C16', brand: 'ABB', category: 'MCB', ratedCurrent: 16, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 3, typicalPrice: 95.0, ratedVoltage: '230/400V', breakingCapacity: '6kA', isActive: true },
  { sku: 'ABB-T1B-125', name: 'Disjuntor Tmax T1B 125', brand: 'ABB', category: 'MCCB', ratedCurrent: 125, poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, moduleWidth: 6, typicalPrice: 450.0, ratedVoltage: '690V', breakingCapacity: '25kA', isActive: true },
  { sku: 'ABB-T2S-160', name: 'Disjuntor Tmax T2S 160', brand: 'ABB', category: 'MCCB', ratedCurrent: 160, poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, moduleWidth: 8, typicalPrice: 680.0, ratedVoltage: '690V', breakingCapacity: '36kA', isActive: true },
  { sku: 'ABB-T4S-250', name: 'Disjuntor Tmax T4S 250', brand: 'ABB', category: 'MCCB', ratedCurrent: 250, poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, moduleWidth: 10, typicalPrice: 1200.0, ratedVoltage: '690V', breakingCapacity: '36kA', isActive: true },
  { sku: 'SCH-EASY9-C16', name: 'Disjuntor Easy9 C16', brand: 'Schneider', category: 'MCB', ratedCurrent: 16, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 25.0, ratedVoltage: '230/400V', breakingCapacity: '4.5kA', isActive: true },
  { sku: 'SCH-EASY9-C32', name: 'Disjuntor Easy9 C32', brand: 'Schneider', category: 'MCB', ratedCurrent: 32, poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 32.0, ratedVoltage: '230/400V', breakingCapacity: '4.5kA', isActive: true },
  { sku: 'SCH-NSX100F', name: 'Disjuntor Compact NSX100F', brand: 'Schneider', category: 'MCCB', ratedCurrent: 100, poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, moduleWidth: 6, typicalPrice: 850.0, ratedVoltage: '690V', breakingCapacity: '36kA', isActive: true },
  { sku: 'WEG-CWC09', name: 'Contator CWC09', brand: 'WEG', category: 'CONTACTOR', ratedCurrent: 9, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 75.0, ratedVoltage: '220V', ac3Current: 4, isActive: true },
  { sku: 'WEG-CWC012', name: 'Contator CWC012', brand: 'WEG', category: 'CONTACTOR', ratedCurrent: 12, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 85.0, ratedVoltage: '220V', ac3Current: 5.5, isActive: true },
  { sku: 'WEG-CWC016', name: 'Contator CWC016', brand: 'WEG', category: 'CONTACTOR', ratedCurrent: 16, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 95.0, ratedVoltage: '220V', ac3Current: 7.5, isActive: true },
  { sku: 'WEG-CWC025', name: 'Contator CWC025', brand: 'WEG', category: 'CONTACTOR', ratedCurrent: 25, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 110.0, ratedVoltage: '220V', ac3Current: 11, isActive: true },
  { sku: 'SCH-LC1D09', name: 'Contator Tesys LC1D09', brand: 'Schneider', category: 'CONTACTOR', ratedCurrent: 9, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 65.0, ratedVoltage: '220V', ac3Current: 4, isActive: true },
  { sku: 'SCH-LC1D25', name: 'Contator Tesys LC1D25', brand: 'Schneider', category: 'CONTACTOR', ratedCurrent: 25, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 100.0, ratedVoltage: '220V', ac3Current: 11, isActive: true },
  { sku: 'ABB-AF09', name: 'Contator AF09', brand: 'ABB', category: 'CONTACTOR', ratedCurrent: 9, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 350.0, ratedVoltage: '220V', ac3Current: 4, isActive: true },
  { sku: 'PHOENIX-UT-2.5', name: 'Terminal Phoenix UT 2.5', brand: 'Phoenix Contact', category: 'TERMINAL', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 4.5, ratedVoltage: '400V', isActive: true },
  { sku: 'PHOENIX-UT-4', name: 'Terminal Phoenix UT 4', brand: 'Phoenix Contact', category: 'TERMINAL', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 5.5, ratedVoltage: '400V', isActive: true },
  { sku: 'WAGO-280-992', name: 'Terminal Wago 280-992', brand: 'WAGO', category: 'TERMINAL', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 1, typicalPrice: 5.5, ratedVoltage: '400V', isActive: true },
  { sku: 'SIT-1215', name: 'Fonte SITOP PSU100C 24V/5A', brand: 'Siemens', category: 'PSU', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 3, typicalPrice: 1200.0, ratedVoltage: '24VDC', isActive: true },
  { sku: 'PHOENIX-QUINT-5A', name: 'Fonte QUINT 24VDC/5A', brand: 'Phoenix Contact', category: 'PSU', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 3, typicalPrice: 1600.0, ratedVoltage: '24VDC', isActive: true },
  { sku: 'MEANWELL-HDR-100-24', name: 'Fonte Mean Well HDR-100-24', brand: 'Mean Well', category: 'PSU', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 280.0, ratedVoltage: '24VDC', isActive: true },
  { sku: 'WEG-CFW11-00075-T2', name: 'Inversor WEG CFW11 0.75HP 220V', brand: 'WEG', category: 'VFD', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, moduleWidth: 4, typicalPrice: 1500.0, ratedVoltage: '220V', isActive: true },
  { sku: 'WEG-CFW500-A07P0-T2', name: 'Inversor WEG CFW500 7.5HP 220V', brand: 'WEG', category: 'VFD', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, moduleWidth: 4, typicalPrice: 3800.0, ratedVoltage: '220V', isActive: true },
  { sku: 'ABB-ACS355-5A6-4', name: 'Inversor ABB ACS355 3kW', brand: 'ABB', category: 'VFD', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, moduleWidth: 4, typicalPrice: 3000.0, ratedVoltage: '380V', isActive: true },
  { sku: 'SCH-ATV320U07N4B', name: 'Inversor Schneider ATV320 0.75kW', brand: 'Schneider', category: 'VFD', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, moduleWidth: 4, typicalPrice: 2000.0, ratedVoltage: '380V', isActive: true },
  { sku: 'SCH-GV2ME14', name: 'Disjuntor Motor GV2ME14 (6-10A)', brand: 'Schneider', category: 'MOTOR_PROTECTION', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 320.0, ratedVoltage: '690V', isActive: true },
  { sku: 'SCH-GV2ME20', name: 'Disjuntor Motor GV2ME20 (17-23A)', brand: 'Schneider', category: 'MOTOR_PROTECTION', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 480.0, ratedVoltage: '690V', isActive: true },
  { sku: 'ABB-MS116-10', name: 'Protetor Motor ABB MS116-10', brand: 'ABB', category: 'MOTOR_PROTECTION', ratedCurrent: null, poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 370.0, ratedVoltage: '690V', isActive: true },
  { sku: 'NH00-63A', name: 'Fusível NH00 63A', brand: 'Mersen', category: 'FUSE', ratedCurrent: 63, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 45.0, ratedVoltage: '500V', isActive: true },
  { sku: 'NH00-160A', name: 'Fusível NH00 160A', brand: 'Mersen', category: 'FUSE', ratedCurrent: 160, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 80.0, ratedVoltage: '500V', isActive: true },
  { sku: 'SCH-XB5AA31', name: 'Botoeira Verde XB5AA31 (1NO)', brand: 'Schneider', category: 'PUSHBUTTON', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 1, typicalPrice: 45.0, ratedVoltage: '24V', isActive: true },
  { sku: 'SCH-XB5AA41', name: 'Botoeira Vermelha XB5AA41 (1NC)', brand: 'Schneider', category: 'PUSHBUTTON', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 1, typicalPrice: 45.0, ratedVoltage: '24V', isActive: true },
  { sku: 'SCH-XB5AVB3', name: 'Sinalizador Verde XB5AVB3', brand: 'Schneider', category: 'PUSHBUTTON', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 1, typicalPrice: 55.0, ratedVoltage: '220VAC', isActive: true },
  { sku: 'ABB-CPM1-10R-20', name: 'Botoeira ABB CPM1-10R-20 Vermelha', brand: 'ABB', category: 'PUSHBUTTON', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 1, typicalPrice: 40.0, ratedVoltage: '24V', isActive: true },
  { sku: 'ABB-OT16F3', name: 'Seccionadora OT16F3', brand: 'ABB', category: 'DISCONNECT_SWITCH', ratedCurrent: 16, poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 120.0, ratedVoltage: '690V', isActive: true },
  { sku: 'ABB-OT63F3', name: 'Seccionadora OT63F3', brand: 'ABB', category: 'DISCONNECT_SWITCH', ratedCurrent: 63, poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 220.0, ratedVoltage: '690V', isActive: true },
  { sku: 'PHOENIX-VAL-MS-230', name: 'DPS Phoenix Contact VAL-MS 230', brand: 'Phoenix Contact', category: 'SPD', ratedCurrent: null, poles: null, mountingType: MountingType.DIN_RAIL, moduleWidth: 2, typicalPrice: 400.0, ratedVoltage: '230V', isActive: true },
  { sku: 'TR-CONTROL-100VA', name: 'Transformador 380/220V 100VA', brand: 'WEG', category: 'CONTROL_TRANSFORMER', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 200.0, ratedVoltage: '380/220V', isActive: true },
  { sku: 'TR-CONTROL-500VA', name: 'Transformador 380/220V 500VA', brand: 'WEG', category: 'CONTROL_TRANSFORMER', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 2, typicalPrice: 450.0, ratedVoltage: '380/220V', isActive: true },
  { sku: 'SCH-XB4BW33B5', name: 'Botoeira XB4BW33B5 Verde 1NO', brand: 'Schneider', category: 'PUSHBUTTON', ratedCurrent: null, poles: null, mountingType: MountingType.FLANGE, moduleWidth: 1, typicalPrice: 70.0, ratedVoltage: '24V', isActive: true },
  { sku: 'WEG-MINI-NSX100F', name: 'Disjuntor WEG Mini NSX100F', brand: 'WEG', category: 'MCCB', ratedCurrent: 100, poles: PoleCount.THREE_P, mountingType: MountingType.FIXED, moduleWidth: 6, typicalPrice: 750.0, ratedVoltage: '690V', breakingCapacity: '25kA', isActive: true },
];

async function seedBrazilianComponents() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: 'demo-paineis' } });
  if (!tenant) {
    console.log('Demo tenant not found, skipping component seed');
    return;
  }

  for (const cat of CATEGORIES) {
    await prisma.componentCategory.upsert({
      where: { tenantId_code: { tenantId: tenant.id, code: cat.code } },
      update: cat,
      create: { tenantId: tenant.id, ...cat },
    });
  }

  for (const comp of COMPONENTS) {
    const category = await prisma.componentCategory.findFirst({
      where: { tenantId: tenant.id, code: comp.category },
    });
    if (!category) continue;

    await prisma.component.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: comp.sku } },
      update: {
        name: comp.name,
        brand: comp.brand,
        componentCategoryId: category.id,
        ratedCurrent: comp.ratedCurrent ?? undefined,
        poles: comp.poles ?? undefined,
        mountingType: comp.mountingType,
        moduleWidth: comp.moduleWidth,
        typicalPrice: comp.typicalPrice ? new Prisma.Decimal(comp.typicalPrice) : undefined,
        ratedVoltage: comp.ratedVoltage,
        breakingCapacity: comp.breakingCapacity,
        isActive: comp.isActive,
      },
      create: {
        tenantId: tenant.id,
        sku: comp.sku,
        name: comp.name,
        brand: comp.brand,
        componentCategoryId: category.id,
        ratedCurrent: comp.ratedCurrent ?? undefined,
        poles: comp.poles ?? undefined,
        mountingType: comp.mountingType,
        moduleWidth: comp.moduleWidth,
        typicalPrice: comp.typicalPrice ? new Prisma.Decimal(comp.typicalPrice) : undefined,
        ratedVoltage: comp.ratedVoltage,
        breakingCapacity: comp.breakingCapacity,
        isActive: comp.isActive,
      },
    });
  }

  console.log(`Seeded ${COMPONENTS.length} components for tenant ${tenant.name}`);
}

async function main() {
  await seedBrazilianComponents();
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
