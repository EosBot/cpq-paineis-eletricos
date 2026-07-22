import { PrismaClient, RuleVersionStatus, MembershipStatus, ClimateZone, RuleType, RuleSeverity, TemplateComplexity, PoleCount, MountingType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const CATEGORIES = [
  { code: 'MCB', name: 'Disjuntores Termomagnéticos' },
  { code: 'MCCB', name: 'Disjuntores Caixa Moldada' },
  { code: 'CONTACTOR', name: 'Contatores' },
  { code: 'RELAY', name: 'Relés' },
  { code: 'TERMINAL', name: 'Bornes/Terminais' },
  { code: 'PLC', name: 'CLPs' },
  { code: 'VFD', name: 'Inversores de Frequência' },
  { code: 'PSU', name: 'Fontes de Alimentação' },
  { code: 'MOTOR_PROTECTION', name: 'Disjuntores Motores' },
  { code: 'FUSE', name: 'Fusíveis' },
  { code: 'PUSHBUTTON', name: 'Botoeiras' },
  { code: 'SIGNALING', name: 'Sinalização' },
  { code: 'DISCONNECT_SWITCH', name: 'Seccionadoras' },
  { code: 'SPD', name: 'Protetores contra Surtos' },
  { code: 'CONTROL_TRANSFORMER', name: 'Transformadores de Controle' },
  { code: 'ETHERNET_SWITCH', name: 'Switches Ethernet' },
  { code: 'HMI', name: 'Interfaces Homem-Máquina' },
  { code: 'ENCLOSURE', name: 'Invólucros' },
];

async function seedPlatformData() {
  const regions = [
    { stateCode: 'SP', stateName: 'São Paulo', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 15, typicalTempMax: 32, humidityAvg: 65, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
    { stateCode: 'RJ', stateName: 'Rio de Janeiro', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 18, typicalTempMax: 35, humidityAvg: 75, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316', isCoastal: true },
    { stateCode: 'MG', stateName: 'Minas Gerais', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 12, typicalTempMax: 30, humidityAvg: 60, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
    { stateCode: 'RS', stateName: 'Rio Grande do Sul', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 5, typicalTempMax: 28, humidityAvg: 70, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
    { stateCode: 'BA', stateName: 'Bahia', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 18, typicalTempMax: 33, humidityAvg: 70, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
    { stateCode: 'PE', stateName: 'Pernambuco', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 20, typicalTempMax: 32, humidityAvg: 72, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
    { stateCode: 'CE', stateName: 'Ceará', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SEMI_ARID, typicalTempMin: 22, typicalTempMax: 35, humidityAvg: 55, recommendedIpMin: 'IP54', recommendedMaterial: 'STEEL' },
    { stateCode: 'AM', stateName: 'Amazonas', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 34, humidityAvg: 85, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
    { stateCode: 'DF', stateName: 'Distrito Federal', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 12, typicalTempMax: 30, humidityAvg: 50, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
    { stateCode: 'SC', stateName: 'Santa Catarina', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 5, typicalTempMax: 28, humidityAvg: 72, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
    { stateCode: 'PR', stateName: 'Paraná', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 8, typicalTempMax: 30, humidityAvg: 68, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  ];
  for (const r of regions) {
    await prisma.region.upsert({ where: { stateCode: r.stateCode }, update: r, create: r });
  }

  const templates = [
    { code: 'CCM_DOL_4M', name: 'CCM Partida Direta 4 Motores', description: 'Centro de Controle de Motores com 4 partidas diretas (DOL), até 7.5kW cada', panelType: 'CCM', complexity: TemplateComplexity.SIMPLE, enclosureWidthMm: 800, enclosureHeightMm: 600, enclosureDepthMm: 250, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 15000, estimatedPriceMax: 28000, estimatedHours: 40, templateData: { drawerCount: 4, starterType: 'DOL', maxMotorPowerKw: 7.5 } },
    { code: 'CCM_SD_4M', name: 'CCM Estrela-Triângulo 4 Motores', description: 'CCM com partida estrela-triângulo para motores 11-75kW', panelType: 'CCM', complexity: TemplateComplexity.MEDIUM, enclosureWidthMm: 1000, enclosureHeightMm: 800, enclosureDepthMm: 300, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 35000, estimatedPriceMax: 60000, estimatedHours: 70, templateData: { drawerCount: 4, starterType: 'STAR_DELTA', minMotorPowerKw: 11, maxMotorPowerKw: 75 } },
    { code: 'CCMI_4VFD', name: 'CCM Inversor 4 VFDs 7.5kW', description: 'CCM com inversores de frequência 7.5kW e PLC', panelType: 'CCMI', complexity: TemplateComplexity.COMPLEX, enclosureWidthMm: 1200, enclosureHeightMm: 1000, enclosureDepthMm: 400, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 50000, estimatedPriceMax: 80000, estimatedHours: 90, templateData: { drawerCount: 4, vfdPowerKw: 7.5, includesPLC: true, includesHMI: true } },
    { code: 'QGBT_800A', name: 'QGBT 800A 4 Feeders', description: 'Quadro Geral de Baixa Tensão 800A com 4 alimentadores', panelType: 'QGBT', complexity: TemplateComplexity.MEDIUM, enclosureWidthMm: 1000, enclosureHeightMm: 1800, enclosureDepthMm: 500, ipRating: 'IP41', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 25000, estimatedPriceMax: 45000, estimatedHours: 50, templateData: { incomer: 'ACB_800A', feeders: 4, feederRating: 'MCCB_250A' } },
    { code: 'AUTO_PLC_HMI', name: 'Painel Automação PLC+HMI', description: 'Painel de automação com CLP S7-1200 e IHM 7"', panelType: 'AUTOMATION', complexity: TemplateComplexity.MEDIUM, enclosureWidthMm: 600, enclosureHeightMm: 600, enclosureDepthMm: 250, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 15000, estimatedPriceMax: 30000, estimatedHours: 50, templateData: { plc: 'S7_1214C', hmi: 'KTP700', ioCount: 24 } },
    { code: 'DIST_400A', name: 'Distribuição 400A 12 Feeders', description: 'Painel de distribuição 400A com 12 disjuntores', panelType: 'DISTRIBUTION', complexity: TemplateComplexity.SIMPLE, enclosureWidthMm: 800, enclosureHeightMm: 800, enclosureDepthMm: 250, ipRating: 'IP41', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 8000, estimatedPriceMax: 16000, estimatedHours: 25, templateData: { incomer: 'MCCB_400A', feeders: 12, feederRating: 'MCB_63A' } },
    { code: 'VFD_15KW', name: 'Painel VFD 15kW', description: 'Painel com inversor de frequência 15kW e bypass', panelType: 'VFD_PANEL', complexity: TemplateComplexity.MEDIUM, enclosureWidthMm: 800, enclosureHeightMm: 800, enclosureDepthMm: 300, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 12000, estimatedPriceMax: 20000, estimatedHours: 28, templateData: { vfdPowerKw: 15, includesBypass: true } },
    { code: 'PUMP_2VFD', name: 'Painel Bombeamento 2 Bombas VFD', description: 'Painel para 2 bombas com VFD e alternância', panelType: 'PUMPING', complexity: TemplateComplexity.MEDIUM, enclosureWidthMm: 1000, enclosureHeightMm: 800, enclosureDepthMm: 300, ipRating: 'IP55', material: 'STEEL', supplyVoltage: '380V', supplyPhases: 3, estimatedPriceMin: 25000, estimatedPriceMax: 45000, estimatedHours: 55, templateData: { pumpCount: 2, includesPLC: true, alternation: true } },
  ];
  for (const t of templates) {
    await prisma.panelTemplate.upsert({ where: { code: t.code }, update: t, create: t });
  }

  console.log(`[seed] platform: ${regions.length} regions, ${templates.length} templates`);
}

async function seedTenantCatalog(tenantId: string) {
  for (const cat of CATEGORIES) {
    await prisma.componentCategory.upsert({
      where: { tenantId_code: { tenantId, code: cat.code } },
      update: { name: cat.name },
      create: { tenantId, name: cat.name, code: cat.code },
    });
  }
}

async function seedTenantRules(tenantId: string) {
  const rules = [
    { code: 'MIN_CLEARANCE_LV', name: 'Espaçamento Mínimo BT', description: 'Clearance mínima entre partes vivas em baixa tensão (IEC 61439 / NR-10)', ruleType: RuleType.CLEARANCE, severity: RuleSeverity.ERROR, condition: { voltageMax: 250, minClearanceMm: 3 }, action: { message: 'Espaçamento mínimo de 3mm entre partes vivas em ≤250V' }, message: 'Espaçamento mínimo de 3mm entre partes vivas não atendido' },
    { code: 'VFD_CLEARANCE', name: 'Espaçamento VFD', description: 'VFD requer mínimo 100mm ao redor para dissipação de calor', ruleType: RuleType.THERMAL, severity: RuleSeverity.WARNING, condition: { componentCategory: 'VFD', minClearanceMm: 100 }, action: { message: 'Mantenha 100mm de espaço livre ao redor do VFD' }, message: 'VFD precisa de 100mm de espaço livre ao redor para dissipação' },
    { code: 'IP_RATING_INDOOR', name: 'IP Mínimo Interno', description: 'Painel interno deve ter IP mínimo 41', ruleType: RuleType.VALIDATION, severity: RuleSeverity.WARNING, condition: { indoorOutdoor: 'INDOOR', minIpRating: 'IP41' }, action: { message: 'Use IP41 ou superior para ambientes internos' }, message: 'IP rating muito baixo para ambiente interno' },
    { code: 'CONTACTOR_AC3', name: 'Contator AC-3', description: 'Contator deve ser dimensionado para categoria AC-3 (motor gaiola)', ruleType: RuleType.SIZING, severity: RuleSeverity.ERROR, condition: { componentCategory: 'CONTACTOR', dutyType: 'AC3' }, action: { message: 'Use contator com rating AC-3 para partida de motores' }, message: 'Contator deve ter rating AC-3 para partida direta de motores' },
    { code: 'RAIL_CAPACITY', name: 'Capacidade Trilho DIN', description: 'Soma dos módulos não pode exceder capacidade do trilho', ruleType: RuleType.SIZING, severity: RuleSeverity.ERROR, condition: { railCapacityCheck: true }, action: { message: 'Reduza componentes ou adicione outro trilho' }, message: 'Capacidade do trilho DIN excedida (1 módulo = 18mm)' },
    { code: 'MARKUP_MIN', name: 'Markup Mínimo', description: 'Markup mínimo de 20% sobre custo', ruleType: RuleType.PRICING, severity: RuleSeverity.WARNING, condition: { markupMin: 0.20 }, action: { message: 'Verifique se markup está acima de 20%' }, message: 'Markup abaixo do mínimo recomendado (20%)' },
  ];
  for (const r of rules) {
    await prisma.businessRule.upsert({ where: { tenantId_code: { tenantId, code: r.code } }, update: r, create: { tenantId, ...r } });
  }
}

async function seedDemoTenant() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-paineis' },
    update: {},
    create: { name: 'Painéis Demo Ltda', slug: 'demo-paineis', defaultCurrency: 'BRL', defaultPricingContext: { currencyCode: 'BRL', markupPct: 30 } },
  });

  const adminRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'admin' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Administrador', code: 'admin', permissions: { catalog: ['read', 'write'], rules: ['read', 'write', 'approve'], configurations: ['read', 'write', 'submit'], quotes: ['read', 'write', 'send'], orders: ['read', 'write'], erp: ['read', 'write'], fiscal: ['read', 'write'] } },
  });

  const engineerRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'engineer' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Engenheiro', code: 'engineer', permissions: { catalog: ['read'], rules: ['read'], configurations: ['read', 'write', 'submit'], quotes: ['read'], orders: ['read'] } },
  });

  const salesRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'sales' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Comercial', code: 'sales', permissions: { catalog: ['read'], configurations: ['read'], quotes: ['read', 'write', 'send'], orders: ['read'] } },
  });

  const adminPassword = await argon2.hash('SenhaForte@123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paineisdemo.com' },
    update: {},
    create: { email: 'admin@paineisdemo.com', firstName: 'Admin', lastName: 'Demo', passwordHash: adminPassword, isActive: true },
  });

  await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: adminUser.id } },
    update: { status: MembershipStatus.ACTIVE },
    create: { tenantId: tenant.id, userId: adminUser.id, roleId: adminRole.id, status: MembershipStatus.ACTIVE },
  });

  const engPassword = await argon2.hash('Eng@2024');
  const engUser = await prisma.user.upsert({
    where: { email: 'engenheiro@paineisdemo.com' },
    update: {},
    create: { email: 'engenheiro@paineisdemo.com', firstName: 'Carlos', lastName: 'Silva', passwordHash: engPassword, isActive: true },
  });
  await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: engUser.id } },
    update: { status: MembershipStatus.ACTIVE },
    create: { tenantId: tenant.id, userId: engUser.id, roleId: engineerRole.id, status: MembershipStatus.ACTIVE },
  });

  const salesPassword = await argon2.hash('Vendas@2024');
  const salesUser = await prisma.user.upsert({
    where: { email: 'vendas@paineisdemo.com' },
    update: {},
    create: { email: 'vendas@paineisdemo.com', firstName: 'Ana', lastName: 'Costa', passwordHash: salesPassword, isActive: true },
  });
  await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: salesUser.id } },
    update: { status: MembershipStatus.ACTIVE },
    create: { tenantId: tenant.id, userId: salesUser.id, roleId: salesRole.id, status: MembershipStatus.ACTIVE },
  });

  await seedTenantCatalog(tenant.id);
  await seedTenantRules(tenant.id);
  await seedTenantPrivacyConfig(tenant.id);

  const customer = await prisma.customerAccount.upsert({
    where: { id: 'demo-customer-001' },
    update: {},
    create: { id: 'demo-customer-001', tenantId: tenant.id, name: 'Cliente Industrial S.A.', legalName: 'Cliente Industrial S.A. LTDA', taxId: '12.345.678/0001-90', isActive: true },
  });

  console.log(`[seed] demo tenant: ${tenant.slug} (${tenant.id})`);
  console.log(`  admin:    admin@paineisdemo.com / SenhaForte@123`);
  console.log(`  engineer: engenheiro@paineisdemo.com / Eng@2024`);
  console.log(`  sales:    vendas@paineisdemo.com / Vendas@2024`);
  console.log(`  customer: ${customer.name}`);

  return { tenant, adminUser };
}

async function seedSecondTenant() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'mega-paineis' },
    update: {},
    create: { name: 'Mega Painéis Industriais', slug: 'mega-paineis', defaultCurrency: 'BRL', defaultPricingContext: { currencyCode: 'BRL', markupPct: 25 } },
  });

  const adminRole = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'admin' } },
    update: {},
    create: { tenantId: tenant.id, name: 'Administrador', code: 'admin', permissions: { catalog: ['read', 'write'], configurations: ['read', 'write'], quotes: ['read', 'write'] } },
  });

  const password = await argon2.hash('Mega@2024');
  const user = await prisma.user.upsert({
    where: { email: 'admin@megapaineis.com' },
    update: {},
    create: { email: 'admin@megapaineis.com', firstName: 'Roberto', lastName: 'Mega', passwordHash: password, isActive: true },
  });

  await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: user.id } },
    update: { status: MembershipStatus.ACTIVE },
    create: { tenantId: tenant.id, userId: user.id, roleId: adminRole.id, status: MembershipStatus.ACTIVE },
  });

  await seedTenantCatalog(tenant.id);
  await seedTenantPrivacyConfig(tenant.id);

  console.log(`[seed] second tenant: ${tenant.slug} (${tenant.id})`);
  console.log(`  admin: admin@megapaineis.com / Mega@2024`);
}

async function seedTenantPrivacyConfig(tenantId: string) {
  await prisma.tenantPrivacyConfig.upsert({
    where: { tenantId },
    update: {},
    create: {
      tenantId,
      dpoName: 'Encarregado de Proteção de Dados',
      dpoEmail: 'dpo@paineisdemo.com',
      privacyPolicyUrl: 'https://paineisdemo.com.br/privacidade',
      privacyPolicyUpdatedAt: new Date(),
      dataRetentionDays: 365,
      termsOfUseUrl: 'https://paineisdemo.com.br/termos',
      allowDataSharing: false,
      requireExplicitConsent: true,
      lgpdComplianceEnabled: true,
      legalBasisDefault: 'LEGITIMATE_INTEREST',
      anonymizeOnDeletion: true,
    },
  });
}

async function seedSuperAdmin() {
  const password = await argon2.hash('Super@2024!');
  const user = await prisma.user.upsert({
    where: { email: 'super@cpq.com.br' },
    update: {},
    create: { email: 'super@cpq.com.br', firstName: 'Super', lastName: 'Admin', passwordHash: password, isActive: true, isSuperAdmin: true },
  });
  console.log(`[seed] super admin: super@cpq.com.br / Super@2024! (${user.id})`);
}

async function seedUniversalComponents(tenantId: string) {
  const CATEGORIES: Record<string, string> = {};
  const cats = await prisma.componentCategory.findMany({ where: { tenantId } });
  for (const c of cats) CATEGORIES[c.code] = c.id;

  const components: Array<{ cat: string; code: string; name: string; moduleWidth: number; ratedCurrent: number | null; ratedVoltage: string | null; poles: PoleCount | null; mountingType: MountingType; typicalPrice: number; formFactorGroup: string; widthMm: number; heightMm?: number; depthMm?: number }> = [
    { cat: 'MCB', code: 'MCB_1P_C10', name: 'Disjuntor Termomagnético 1P 10A Curva C', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 12, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C16', name: 'Disjuntor Termomagnético 1P 16A Curva C', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 13, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C20', name: 'Disjuntor Termomagnético 1P 20A Curva C', moduleWidth: 1, ratedCurrent: 20, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 14, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C25', name: 'Disjuntor Termomagnético 1P 25A Curva C', moduleWidth: 1, ratedCurrent: 25, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 15, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C32', name: 'Disjuntor Termomagnético 1P 32A Curva C', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 18, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C40', name: 'Disjuntor Termomagnético 1P 40A Curva C', moduleWidth: 1, ratedCurrent: 40, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 22, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_1P_C63', name: 'Disjuntor Termomagnético 1P 63A Curva C', moduleWidth: 1, ratedCurrent: 63, ratedVoltage: '230V', poles: PoleCount.ONE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 35, formFactorGroup: 'MCB_1P', widthMm: 17 },
    { cat: 'MCB', code: 'MCB_2P_C20', name: 'Disjuntor Termomagnético 2P 20A Curva C', moduleWidth: 2, ratedCurrent: 20, ratedVoltage: '400V', poles: PoleCount.TWO_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 40, formFactorGroup: 'MCB_2P', widthMm: 35 },
    { cat: 'MCB', code: 'MCB_2P_C40', name: 'Disjuntor Termomagnético 2P 40A Curva C', moduleWidth: 2, ratedCurrent: 40, ratedVoltage: '400V', poles: PoleCount.TWO_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 50, formFactorGroup: 'MCB_2P', widthMm: 35 },
    { cat: 'MCB', code: 'MCB_3P_C16', name: 'Disjuntor Termomagnético 3P 16A Curva C', moduleWidth: 3, ratedCurrent: 16, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 120, formFactorGroup: 'MCB_3P', widthMm: 52 },
    { cat: 'MCB', code: 'MCB_3P_C25', name: 'Disjuntor Termomagnético 3P 25A Curva C', moduleWidth: 3, ratedCurrent: 25, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 135, formFactorGroup: 'MCB_3P', widthMm: 52 },
    { cat: 'MCB', code: 'MCB_3P_C32', name: 'Disjuntor Termomagnético 3P 32A Curva C', moduleWidth: 3, ratedCurrent: 32, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 150, formFactorGroup: 'MCB_3P', widthMm: 52 },
    { cat: 'MCB', code: 'MCB_3P_C63', name: 'Disjuntor Termomagnético 3P 63A Curva C', moduleWidth: 3, ratedCurrent: 63, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 200, formFactorGroup: 'MCB_3P', widthMm: 52 },
    { cat: 'MCCB', code: 'MCCB_100A', name: 'Disjuntor Caixa Moldada 100A 3P', moduleWidth: 0, ratedCurrent: 100, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 700, formFactorGroup: 'MCCB_100', widthMm: 105 },
    { cat: 'MCCB', code: 'MCCB_160A', name: 'Disjuntor Caixa Moldada 160A 3P', moduleWidth: 0, ratedCurrent: 160, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 900, formFactorGroup: 'MCCB_160', widthMm: 105 },
    { cat: 'MCCB', code: 'MCCB_250A', name: 'Disjuntor Caixa Moldada 250A 3P', moduleWidth: 0, ratedCurrent: 250, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 1600, formFactorGroup: 'MCCB_250', widthMm: 140 },
    { cat: 'MCCB', code: 'MCCB_400A', name: 'Disjuntor Caixa Moldada 400A 3P', moduleWidth: 0, ratedCurrent: 400, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 3200, formFactorGroup: 'MCCB_400', widthMm: 210 },
    { cat: 'MCCB', code: 'MCCB_630A', name: 'Disjuntor Caixa Moldada 630A 3P', moduleWidth: 0, ratedCurrent: 630, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 5000, formFactorGroup: 'MCCB_630', widthMm: 210 },
    { cat: 'MCCB', code: 'MCCB_800A', name: 'Disjuntor Caixa Moldada 800A 3P', moduleWidth: 0, ratedCurrent: 800, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 8000, formFactorGroup: 'MCCB_800', widthMm: 280 },
    { cat: 'CONTACTOR', code: 'CONT_9A', name: 'Contator 9A AC-3 (4kW)', moduleWidth: 1, ratedCurrent: 9, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 120, formFactorGroup: 'CONT_SMALL', widthMm: 45 },
    { cat: 'CONTACTOR', code: 'CONT_12A', name: 'Contator 12A AC-3 (5.5kW)', moduleWidth: 1, ratedCurrent: 12, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 140, formFactorGroup: 'CONT_SMALL', widthMm: 45 },
    { cat: 'CONTACTOR', code: 'CONT_18A', name: 'Contator 18A AC-3 (7.5kW)', moduleWidth: 1, ratedCurrent: 18, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 160, formFactorGroup: 'CONT_SMALL', widthMm: 45 },
    { cat: 'CONTACTOR', code: 'CONT_25A', name: 'Contator 25A AC-3 (11kW)', moduleWidth: 1, ratedCurrent: 25, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 200, formFactorGroup: 'CONT_SMALL', widthMm: 45 },
    { cat: 'CONTACTOR', code: 'CONT_32A', name: 'Contator 32A AC-3 (15kW)', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 260, formFactorGroup: 'CONT_MEDIUM', widthMm: 55 },
    { cat: 'CONTACTOR', code: 'CONT_40A', name: 'Contator 40A AC-3 (22kW)', moduleWidth: 1, ratedCurrent: 40, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 350, formFactorGroup: 'CONT_MEDIUM', widthMm: 75 },
    { cat: 'CONTACTOR', code: 'CONT_65A', name: 'Contator 65A AC-3 (37kW)', moduleWidth: 0, ratedCurrent: 65, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 600, formFactorGroup: 'CONT_LARGE', widthMm: 85 },
    { cat: 'CONTACTOR', code: 'CONT_80A', name: 'Contator 80A AC-3 (45kW)', moduleWidth: 0, ratedCurrent: 80, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 750, formFactorGroup: 'CONT_LARGE', widthMm: 85 },
    { cat: 'CONTACTOR', code: 'CONT_95A', name: 'Contator 95A AC-3 (55kW)', moduleWidth: 0, ratedCurrent: 95, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 900, formFactorGroup: 'CONT_LARGE', widthMm: 100 },
    { cat: 'CONTACTOR', code: 'CONT_140A', name: 'Contator 140A AC-3 (75kW)', moduleWidth: 0, ratedCurrent: 140, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 1700, formFactorGroup: 'CONT_XLARGE', widthMm: 120 },
    { cat: 'CONTACTOR', code: 'CONT_205A', name: 'Contator 205A AC-3 (110kW)', moduleWidth: 0, ratedCurrent: 205, ratedVoltage: '400V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 2600, formFactorGroup: 'CONT_XLARGE', widthMm: 160 },
    { cat: 'RELAY', code: 'RELAY_1CO_10A', name: 'Relé 1CO 10A 24VDC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 35, formFactorGroup: 'RELAY_MINI', widthMm: 12 },
    { cat: 'RELAY', code: 'RELAY_2CO_10A', name: 'Relé 2CO 10A 24VDC', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '250V', poles: null, mountingType: MountingType.PLUG_IN, typicalPrice: 42, formFactorGroup: 'RELAY_MINI', widthMm: 22 },
    { cat: 'RELAY', code: 'RELAY_4CO_7A', name: 'Relé 4CO 7A 230VAC DIN', moduleWidth: 1, ratedCurrent: 7, ratedVoltage: '250V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 75, formFactorGroup: 'RELAY_DIN', widthMm: 22 },
    { cat: 'RELAY', code: 'RELAY_2CO_16A', name: 'Relé 2CO 16A 24VDC DIN', moduleWidth: 1, ratedCurrent: 16, ratedVoltage: '250V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 70, formFactorGroup: 'RELAY_DIN', widthMm: 22 },
    { cat: 'TERMINAL', code: 'TERM_2.5', name: 'Borne Passagem 2.5mm² Cinza', moduleWidth: 1, ratedCurrent: 24, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 6, formFactorGroup: 'TERM_SMALL', widthMm: 5 },
    { cat: 'TERMINAL', code: 'TERM_4', name: 'Borne Passagem 4mm² Cinza', moduleWidth: 1, ratedCurrent: 32, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 8, formFactorGroup: 'TERM_SMALL', widthMm: 6 },
    { cat: 'TERMINAL', code: 'TERM_6', name: 'Borne Passagem 6mm² Cinza', moduleWidth: 1, ratedCurrent: 41, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 10, formFactorGroup: 'TERM_MEDIUM', widthMm: 8 },
    { cat: 'TERMINAL', code: 'TERM_10', name: 'Borne Passagem 10mm² Cinza', moduleWidth: 1, ratedCurrent: 57, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 12, formFactorGroup: 'TERM_MEDIUM', widthMm: 10 },
    { cat: 'TERMINAL', code: 'TERM_16', name: 'Borne Passagem 16mm² Cinza', moduleWidth: 2, ratedCurrent: 76, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 15, formFactorGroup: 'TERM_LARGE', widthMm: 12 },
    { cat: 'TERMINAL', code: 'TERM_35', name: 'Borne Passagem 35mm² Cinza', moduleWidth: 2, ratedCurrent: 125, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 22, formFactorGroup: 'TERM_LARGE', widthMm: 16 },
    { cat: 'TERMINAL', code: 'TERM_PE', name: 'Borne Terra 2.5mm² PE', moduleWidth: 1, ratedCurrent: 24, ratedVoltage: '1000V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 8, formFactorGroup: 'TERM_PE', widthMm: 5 },
    { cat: 'PLC', code: 'PLC_8DI_6DO', name: 'CLP 8DI/6DO Relé', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 2500, formFactorGroup: 'PLC_COMPACT', widthMm: 110 },
    { cat: 'PLC', code: 'PLC_14DI_10DO', name: 'CLP 14DI/10DO', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4000, formFactorGroup: 'PLC_COMPACT', widthMm: 130 },
    { cat: 'PLC', code: 'PLC_24DI_16DO', name: 'CLP 24DI/16DO Expansível', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 8000, formFactorGroup: 'PLC_MODULAR', widthMm: 170 },
    { cat: 'VFD', code: 'VFD_1.5KW', name: 'Inversor Frequência 1.5kW', moduleWidth: 0, ratedCurrent: 5.6, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 3400, formFactorGroup: 'VFD_SMALL', widthMm: 130 },
    { cat: 'VFD', code: 'VFD_3KW', name: 'Inversor Frequência 3kW', moduleWidth: 0, ratedCurrent: 9, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 4500, formFactorGroup: 'VFD_SMALL', widthMm: 150 },
    { cat: 'VFD', code: 'VFD_5.5KW', name: 'Inversor Frequência 5.5kW', moduleWidth: 0, ratedCurrent: 15.6, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 6200, formFactorGroup: 'VFD_MEDIUM', widthMm: 180 },
    { cat: 'VFD', code: 'VFD_7.5KW', name: 'Inversor Frequência 7.5kW', moduleWidth: 0, ratedCurrent: 23, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 7200, formFactorGroup: 'VFD_MEDIUM', widthMm: 200 },
    { cat: 'VFD', code: 'VFD_11KW', name: 'Inversor Frequência 11kW', moduleWidth: 0, ratedCurrent: 32, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 9000, formFactorGroup: 'VFD_LARGE', widthMm: 250 },
    { cat: 'VFD', code: 'VFD_15KW', name: 'Inversor Frequência 15kW', moduleWidth: 0, ratedCurrent: 44, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 11000, formFactorGroup: 'VFD_LARGE', widthMm: 280 },
    { cat: 'VFD', code: 'VFD_30KW', name: 'Inversor Frequência 30kW', moduleWidth: 0, ratedCurrent: 72, ratedVoltage: '380V', poles: PoleCount.THREE_P, mountingType: MountingType.FLANGE, typicalPrice: 18000, formFactorGroup: 'VFD_XLARGE', widthMm: 350 },
    { cat: 'PSU', code: 'PSU_24V_5A', name: 'Fonte 24VDC 5A', moduleWidth: 1, ratedCurrent: 5, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1200, formFactorGroup: 'PSU_SMALL', widthMm: 45 },
    { cat: 'PSU', code: 'PSU_24V_10A', name: 'Fonte 24VDC 10A', moduleWidth: 1, ratedCurrent: 10, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 2200, formFactorGroup: 'PSU_MEDIUM', widthMm: 68 },
    { cat: 'PSU', code: 'PSU_24V_20A', name: 'Fonte 24VDC 20A', moduleWidth: 0, ratedCurrent: 20, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 3800, formFactorGroup: 'PSU_LARGE', widthMm: 110 },
    { cat: 'PSU', code: 'PSU_24V_40A', name: 'Fonte 24VDC 40A', moduleWidth: 0, ratedCurrent: 40, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 6000, formFactorGroup: 'PSU_XLARGE', widthMm: 160 },
    { cat: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_4A', name: 'Protetor Motor 1.6-2.5A', moduleWidth: 1, ratedCurrent: null, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 380, formFactorGroup: 'MOTOR_PROT_SMALL', widthMm: 45 },
    { cat: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_10A', name: 'Protetor Motor 6.3-10A', moduleWidth: 1, ratedCurrent: null, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 450, formFactorGroup: 'MOTOR_PROT_SMALL', widthMm: 45 },
    { cat: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_18A', name: 'Protetor Motor 12-18A', moduleWidth: 1, ratedCurrent: null, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 550, formFactorGroup: 'MOTOR_PROT_MEDIUM', widthMm: 55 },
    { cat: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_32A', name: 'Protetor Motor 24-32A', moduleWidth: 1, ratedCurrent: null, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIN_RAIL, typicalPrice: 700, formFactorGroup: 'MOTOR_PROT_MEDIUM', widthMm: 55 },
    { cat: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_40A', name: 'Protetor Motor 30-40A', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.PLATE, typicalPrice: 900, formFactorGroup: 'MOTOR_PROT_LARGE', widthMm: 70 },
    { cat: 'PUSHBUTTON', code: 'PB_GREEN_1NO', name: 'Botoeira Verde 1NO 22mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 60, formFactorGroup: 'PB_22MM', widthMm: 30 },
    { cat: 'PUSHBUTTON', code: 'PB_RED_1NC', name: 'Botoeira Vermelha 1NC 22mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 60, formFactorGroup: 'PB_22MM', widthMm: 30 },
    { cat: 'PUSHBUTTON', code: 'PB_BLACK_1NO_1NC', name: 'Botoeira Preta 1NO+1NC 22mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 65, formFactorGroup: 'PB_22MM', widthMm: 30 },
    { cat: 'PUSHBUTTON', code: 'PB_EMERGENCY', name: 'Botoeira Emergência 40mm', moduleWidth: 0, ratedCurrent: 10, ratedVoltage: '600V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 100, formFactorGroup: 'PB_EMERGENCY', widthMm: 40 },
    { cat: 'SIGNALING', code: 'PILOT_GREEN', name: 'Piloto Verde LED 220V 22mm', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '220V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PILOT_22MM', widthMm: 30 },
    { cat: 'SIGNALING', code: 'PILOT_RED', name: 'Piloto Vermelho LED 220V 22mm', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '220V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PILOT_22MM', widthMm: 30 },
    { cat: 'SIGNALING', code: 'PILOT_YELLOW', name: 'Piloto Amarelo LED 220V 22mm', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '220V', poles: null, mountingType: MountingType.DIRECT, typicalPrice: 70, formFactorGroup: 'PILOT_22MM', widthMm: 30 },
    { cat: 'DISCONNECT_SWITCH', code: 'DISC_3P_40A', name: 'Seccionadora 3P 40A Frontal', moduleWidth: 0, ratedCurrent: 40, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 200, formFactorGroup: 'DISC_SMALL', widthMm: 80 },
    { cat: 'DISCONNECT_SWITCH', code: 'DISC_3P_100A', name: 'Seccionadora 3P 100A Frontal', moduleWidth: 0, ratedCurrent: 100, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 420, formFactorGroup: 'DISC_MEDIUM', widthMm: 100 },
    { cat: 'DISCONNECT_SWITCH', code: 'DISC_3P_250A', name: 'Seccionadora 3P 250A Frontal', moduleWidth: 0, ratedCurrent: 250, ratedVoltage: '690V', poles: PoleCount.THREE_P, mountingType: MountingType.DIRECT, typicalPrice: 950, formFactorGroup: 'DISC_LARGE', widthMm: 140 },
    { cat: 'SPD', code: 'SPD_T2_1P', name: 'DPS Classe II 1P 20kA', moduleWidth: 1, ratedCurrent: null, ratedVoltage: '275V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 480, formFactorGroup: 'SPD_1P', widthMm: 18 },
    { cat: 'SPD', code: 'SPD_T2_3P', name: 'DPS Classe II 3P 20kA', moduleWidth: 3, ratedCurrent: null, ratedVoltage: '275V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1500, formFactorGroup: 'SPD_3P', widthMm: 54 },
    { cat: 'CONTROL_TRANSFORMER', code: 'TRAFO_100VA', name: 'Transformador 100VA 380/220V', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 250, formFactorGroup: 'TRAFO_SMALL', widthMm: 70 },
    { cat: 'CONTROL_TRANSFORMER', code: 'TRAFO_200VA', name: 'Transformador 200VA 380/220V', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 340, formFactorGroup: 'TRAFO_MEDIUM', widthMm: 80 },
    { cat: 'CONTROL_TRANSFORMER', code: 'TRAFO_500VA', name: 'Transformador 500VA 380/220V', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '380V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 550, formFactorGroup: 'TRAFO_LARGE', widthMm: 100 },
    { cat: 'ETHERNET_SWITCH', code: 'SWITCH_5P', name: 'Switch Ethernet 5 Portas', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 1750, formFactorGroup: 'SWITCH_SMALL', widthMm: 60 },
    { cat: 'ETHERNET_SWITCH', code: 'SWITCH_8P', name: 'Switch Ethernet 8P Gerenciável', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.DIN_RAIL, typicalPrice: 4000, formFactorGroup: 'SWITCH_MEDIUM', widthMm: 80 },
    { cat: 'HMI', code: 'HMI_7IN', name: 'IHM 7" Touchscreen', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 6200, formFactorGroup: 'HMI_7IN', widthMm: 200 },
    { cat: 'HMI', code: 'HMI_12IN', name: 'IHM 12" Touchscreen', moduleWidth: 0, ratedCurrent: null, ratedVoltage: '24V', poles: null, mountingType: MountingType.PLATE, typicalPrice: 11500, formFactorGroup: 'HMI_12IN', widthMm: 300 },
    { cat: 'ENCLOSURE', code: 'ENC_400_300', name: 'QGX 400×300×150 IP65', moduleWidth: 0, ratedCurrent: null, ratedVoltage: null, poles: null, mountingType: 'DIRECT', typicalPrice: 350, formFactorGroup: 'ENC_SMALL', widthMm: 400, heightMm: 300, depthMm: 150 },
    { cat: 'ENCLOSURE', code: 'ENC_600_400', name: 'QGX 600×400×200 IP65', moduleWidth: 0, ratedCurrent: null, ratedVoltage: null, poles: null, mountingType: 'DIRECT', typicalPrice: 650, formFactorGroup: 'ENC_MEDIUM', widthMm: 600, heightMm: 400, depthMm: 200 },
    { cat: 'ENCLOSURE', code: 'ENC_800_600', name: 'QGX 800×600×250 IP65', moduleWidth: 0, ratedCurrent: null, ratedVoltage: null, poles: null, mountingType: 'DIRECT', typicalPrice: 1000, formFactorGroup: 'ENC_LARGE', widthMm: 800, heightMm: 600, depthMm: 250 },
    { cat: 'ENCLOSURE', code: 'ENC_1000_800', name: 'QGX 1000×800×300 IP65', moduleWidth: 0, ratedCurrent: null, ratedVoltage: null, poles: null, mountingType: 'DIRECT', typicalPrice: 1500, formFactorGroup: 'ENC_XLARGE', widthMm: 1000, heightMm: 800, depthMm: 300 },
    { cat: 'ENCLOSURE', code: 'ENC_1800_800', name: 'QGI 1800×800×500 IP55', moduleWidth: 0, ratedCurrent: null, ratedVoltage: null, poles: null, mountingType: 'DIRECT', typicalPrice: 5000, formFactorGroup: 'ENC_FLOOR', widthMm: 1800, heightMm: 800, depthMm: 500 },
  ];

  let count = 0;
  for (const comp of components) {
    const catId = CATEGORIES[comp.cat];
    if (!catId) continue;

    await prisma.component.upsert({
      where: { tenantId_sku: { tenantId, sku: comp.code } },
      update: {
        name: comp.name, moduleWidth: comp.moduleWidth, ratedCurrent: comp.ratedCurrent,
        ratedVoltage: comp.ratedVoltage, poles: comp.poles, mountingType: comp.mountingType,
        typicalPrice: comp.typicalPrice, formFactorGroup: comp.formFactorGroup,
      },
      create: {
        tenantId, componentCategoryId: catId, sku: comp.code, name: comp.name,
        moduleWidth: comp.moduleWidth, ratedCurrent: comp.ratedCurrent,
        ratedVoltage: comp.ratedVoltage, poles: comp.poles, mountingType: comp.mountingType,
        typicalPrice: comp.typicalPrice, formFactorGroup: comp.formFactorGroup,
      },
    });
    count++;
  }
  console.log(`  [seed] ${count} universal components (${tenantId})`);
}

async function main() {
  await seedPlatformData();
  const { tenant } = await seedDemoTenant();
  await seedUniversalComponents(tenant.id);
  await seedSecondTenant();
  await seedSuperAdmin();
  console.log('\n[seed] concluído com sucesso');
}

main()
  .catch((e) => { console.error('[seed] erro:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
