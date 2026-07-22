import { PrismaClient, PoleCount, MountingType, ClimateZone, RuleType, RuleSeverity, TemplateComplexity } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { code: 'MCB', name: 'Disjuntores Termomagnéticos', attrs: [
    { code: 'rated_current', name: 'Corrente Nominal (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'breaking_capacity', name: 'Capacidade de Interrupção', valueType: 'TEXT' as const, unit: 'kA' },
    { code: 'curve', name: 'Curva', valueType: 'TEXT' as const },
    { code: 'poles', name: 'Número de Polos', valueType: 'TEXT' as const },
  ]},
  { code: 'MCCB', name: 'Disjuntores Caixa Moldada', attrs: [
    { code: 'rated_current', name: 'Corrente Nominal (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'breaking_capacity', name: 'Capacidade de Interrupção', valueType: 'TEXT' as const, unit: 'kA' },
    { code: 'trip_unit', name: 'Unidade de Disparo', valueType: 'TEXT' as const },
  ]},
  { code: 'CONTACTOR', name: 'Contatores', attrs: [
    { code: 'ac3_current', name: 'Corrente AC-3 (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'motor_power', name: 'Potência do Motor (kW)', valueType: 'DECIMAL' as const, unit: 'kW' },
    { code: 'coil_voltage', name: 'Tensão da Bobina', valueType: 'TEXT' as const, unit: 'V' },
    { code: 'aux_contacts', name: 'Contatos Auxiliares', valueType: 'TEXT' as const },
  ]},
  { code: 'RELAY', name: 'Relés', attrs: [
    { code: 'switching_current', name: 'Corrente de Comutação (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'coil_voltage', name: 'Tensão da Bobina', valueType: 'TEXT' as const, unit: 'V' },
    { code: 'contact_form', name: 'Formato dos Contatos', valueType: 'TEXT' as const },
  ]},
  { code: 'TERMINAL', name: 'Bornes/Terminais', attrs: [
    { code: 'cross_section', name: 'Seção Transversal (mm²)', valueType: 'DECIMAL' as const, unit: 'mm²' },
    { code: 'color', name: 'Cor', valueType: 'TEXT' as const },
    { code: 'connection_type', name: 'Tipo de Conexão', valueType: 'TEXT' as const },
  ]},
  { code: 'PLC', name: 'CLPs', attrs: [
    { code: 'io_count', name: 'Contagem de I/O', valueType: 'INTEGER' as const },
    { code: 'comm_protocol', name: 'Protocolo de Comunicação', valueType: 'TEXT' as const },
    { code: 'program_memory', name: 'Memória de Programa (KB)', valueType: 'INTEGER' as const, unit: 'KB' },
  ]},
  { code: 'VFD', name: 'Inversores de Frequência', attrs: [
    { code: 'motor_power_kw', name: 'Potência do Motor (kW)', valueType: 'DECIMAL' as const, unit: 'kW' },
    { code: 'output_current', name: 'Corrente de Saída (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'input_voltage', name: 'Tensão de Entrada', valueType: 'TEXT' as const, unit: 'V' },
  ]},
  { code: 'PSU', name: 'Fontes de Alimentação', attrs: [
    { code: 'output_voltage', name: 'Tensão de Saída', valueType: 'TEXT' as const, unit: 'V' },
    { code: 'output_current', name: 'Corrente de Saída (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'power_w', name: 'Potência (W)', valueType: 'INTEGER' as const, unit: 'W' },
  ]},
  { code: 'MOTOR_PROTECTION', name: 'Disjuntores Motores', attrs: [
    { code: 'current_range', name: 'Faixa de Corrente (A)', valueType: 'TEXT' as const, unit: 'A' },
    { code: 'motor_power', name: 'Potência do Motor (kW)', valueType: 'DECIMAL' as const, unit: 'kW' },
    { code: 'trip_class', name: 'Classe de Disparo', valueType: 'TEXT' as const },
  ]},
  { code: 'FUSE', name: 'Fusíveis', attrs: [
    { code: 'rated_current', name: 'Corrente Nominal (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'size', name: 'Tamanho', valueType: 'TEXT' as const },
    { code: 'breaking_capacity', name: 'Capacidade de Interrupção', valueType: 'TEXT' as const },
  ]},
  { code: 'PUSHBUTTON', name: 'Botoeiras', attrs: [
    { code: 'function', name: 'Função', valueType: 'TEXT' as const },
    { code: 'color', name: 'Cor', valueType: 'TEXT' as const },
    { code: 'contact_type', name: 'Tipo de Contato', valueType: 'TEXT' as const },
    { code: 'mounting_diameter', name: 'Diâmetro de Montagem (mm)', valueType: 'INTEGER' as const, unit: 'mm' },
  ]},
  { code: 'SIGNALING', name: 'Sinalização', attrs: [
    { code: 'function', name: 'Função', valueType: 'TEXT' as const },
    { code: 'color', name: 'Cor', valueType: 'TEXT' as const },
    { code: 'voltage', name: 'Tensão', valueType: 'TEXT' as const, unit: 'V' },
  ]},
  { code: 'DISCONNECT_SWITCH', name: 'Seccionadoras', attrs: [
    { code: 'rated_current', name: 'Corrente Nominal (A)', valueType: 'DECIMAL' as const, unit: 'A' },
    { code: 'poles', name: 'Número de Polos', valueType: 'TEXT' as const },
    { code: 'mounting', name: 'Tipo de Montagem', valueType: 'TEXT' as const },
  ]},
  { code: 'SPD', name: 'Protetores contra Surtos (DPS)', attrs: [
    { code: 'type', name: 'Tipo (I, II, III)', valueType: 'TEXT' as const },
    { code: 'max_discharge', name: 'Corrente Máxima de Descarga (kA)', valueType: 'INTEGER' as const, unit: 'kA' },
    { code: 'voltage_protection', name: 'Nível de Proteção (kV)', valueType: 'DECIMAL' as const, unit: 'kV' },
  ]},
  { code: 'CONTROL_TRANSFORMER', name: 'Transformadores de Controle', attrs: [
    { code: 'va_rating', name: 'Potência (VA)', valueType: 'INTEGER' as const, unit: 'VA' },
    { code: 'primary_voltage', name: 'Tensão Primário', valueType: 'TEXT' as const, unit: 'V' },
    { code: 'secondary_voltage', name: 'Tensão Secundário', valueType: 'TEXT' as const, unit: 'V' },
  ]},
  { code: 'ETHERNET_SWITCH', name: 'Switches Ethernet', attrs: [
    { code: 'ports', name: 'Número de Portas', valueType: 'INTEGER' as const },
    { code: 'speed', name: 'Velocidade', valueType: 'TEXT' as const },
    { code: 'managed', name: 'Gerenciável', valueType: 'BOOLEAN' as const },
  ]},
  { code: 'HMI', name: 'Interfaces Homem-Máquina', attrs: [
    { code: 'screen_size', name: 'Tamanho da Tela (")', valueType: 'DECIMAL' as const, unit: 'in' },
    { code: 'resolution', name: 'Resolução', valueType: 'TEXT' as const },
    { code: 'touch', name: 'Touchscreen', valueType: 'BOOLEAN' as const },
    { code: 'comm_protocol', name: 'Protocolo', valueType: 'TEXT' as const },
  ]},
  { code: 'ENCLOSURE', name: 'Invólucros', attrs: [
    { code: 'width_mm', name: 'Largura (mm)', valueType: 'INTEGER' as const, unit: 'mm' },
    { code: 'height_mm', name: 'Altura (mm)', valueType: 'INTEGER' as const, unit: 'mm' },
    { code: 'depth_mm', name: 'Profundidade (mm)', valueType: 'INTEGER' as const, unit: 'mm' },
    { code: 'ip_rating', name: 'IP Rating', valueType: 'TEXT' as const },
    { code: 'material', name: 'Material', valueType: 'TEXT' as const },
  ]},
];

const REGIONS = [
  { stateCode: 'SP', stateName: 'São Paulo', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 15, typicalTempMax: 32, humidityAvg: 65, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'RJ', stateName: 'Rio de Janeiro', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 18, typicalTempMax: 35, humidityAvg: 75, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316', isCoastal: true },
  { stateCode: 'MG', stateName: 'Minas Gerais', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 12, typicalTempMax: 30, humidityAvg: 60, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'RS', stateName: 'Rio Grande do Sul', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 5, typicalTempMax: 28, humidityAvg: 70, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'PR', stateName: 'Paraná', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 8, typicalTempMax: 30, humidityAvg: 68, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'SC', stateName: 'Santa Catarina', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SOUTHERN_HIGHLANDS, typicalTempMin: 5, typicalTempMax: 28, humidityAvg: 72, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'BA', stateName: 'Bahia', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 18, typicalTempMax: 33, humidityAvg: 70, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
  { stateCode: 'PE', stateName: 'Pernambuco', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 20, typicalTempMax: 32, humidityAvg: 72, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
  { stateCode: 'CE', stateName: 'Ceará', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SEMI_ARID, typicalTempMin: 22, typicalTempMax: 35, humidityAvg: 55, recommendedIpMin: 'IP54', recommendedMaterial: 'STEEL' },
  { stateCode: 'AM', stateName: 'Amazonas', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 34, humidityAvg: 85, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'PA', stateName: 'Pará', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 33, humidityAvg: 82, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'DF', stateName: 'Distrito Federal', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 12, typicalTempMax: 30, humidityAvg: 50, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'GO', stateName: 'Goiás', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 14, typicalTempMax: 33, humidityAvg: 52, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'MT', stateName: 'Mato Grosso', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 16, typicalTempMax: 36, humidityAvg: 55, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'MS', stateName: 'Mato Grosso do Sul', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 14, typicalTempMax: 34, humidityAvg: 58, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'AL', stateName: 'Alagoas', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 20, typicalTempMax: 32, humidityAvg: 73, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
  { stateCode: 'PB', stateName: 'Paraíba', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SEMI_ARID, typicalTempMin: 20, typicalTempMax: 33, humidityAvg: 60, recommendedIpMin: 'IP54', recommendedMaterial: 'STEEL' },
  { stateCode: 'RN', stateName: 'Rio Grande do Norte', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 21, typicalTempMax: 32, humidityAvg: 70, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
  { stateCode: 'PI', stateName: 'Piauí', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.SEMI_ARID, typicalTempMin: 20, typicalTempMax: 36, humidityAvg: 50, recommendedIpMin: 'IP54', recommendedMaterial: 'STEEL' },
  { stateCode: 'MA', stateName: 'Maranhão', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 33, humidityAvg: 78, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'TO', stateName: 'Tocantins', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.PLATEAU, typicalTempMin: 18, typicalTempMax: 36, humidityAvg: 55, recommendedIpMin: 'IP41', recommendedMaterial: 'STEEL' },
  { stateCode: 'RO', stateName: 'Rondônia', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 20, typicalTempMax: 34, humidityAvg: 75, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'AC', stateName: 'Acre', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 20, typicalTempMax: 33, humidityAvg: 80, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'RR', stateName: 'Roraima', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 34, humidityAvg: 72, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'AP', stateName: 'Amapá', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '220V', climateZone: ClimateZone.AMAZON, typicalTempMin: 22, typicalTempMax: 32, humidityAvg: 78, recommendedIpMin: 'IP55', recommendedMaterial: 'STAINLESS_316' },
  { stateCode: 'SE', stateName: 'Sergipe', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 20, typicalTempMax: 32, humidityAvg: 72, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
  { stateCode: 'ES', stateName: 'Espírito Santo', singlePhaseVoltage: '127V', twoPhaseVoltage: '220V', threePhaseVoltage: '380V', climateZone: ClimateZone.COASTAL, typicalTempMin: 18, typicalTempMax: 33, humidityAvg: 70, recommendedIpMin: 'IP54', recommendedMaterial: 'STAINLESS_304', isCoastal: true },
];

async function main() {
  console.log('Seeding panel builder data...');

  for (const region of REGIONS) {
    await prisma.region.upsert({
      where: { stateCode: region.stateCode },
      update: region,
      create: region,
    });
  }
  console.log(`Seeded ${REGIONS.length} regions`);

  for (const cat of CATEGORIES) {
    const category = await prisma.componentCategory.upsert({
      where: {
        tenantId_code: { tenantId: 'SYSTEM', code: cat.code },
      },
      update: { name: cat.name },
      create: {
        tenantId: 'SYSTEM',
        name: cat.name,
        code: cat.code,
      },
    });

    for (let i = 0; i < cat.attrs.length; i++) {
      const attr = cat.attrs[i];
      await prisma.componentAttributeTemplate.upsert({
        where: {
          componentCategoryId_code: { componentCategoryId: category.id, code: attr.code },
        },
        update: { name: attr.name, valueType: attr.valueType, unit: attr.unit, sortOrder: i },
        create: {
          tenantId: 'SYSTEM',
          componentCategoryId: category.id,
          name: attr.name,
          code: attr.code,
          valueType: attr.valueType,
          unit: attr.unit,
          sortOrder: i,
        },
      });
    }
  }
  console.log(`Seeded ${CATEGORIES.length} component categories with attribute templates`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
