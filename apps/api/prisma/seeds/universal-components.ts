export const UNIVERSAL_COMPONENTS = [
  // ==================== MCB (Disjuntores Termomagnéticos) ====================
  { category: 'MCB', code: 'MCB_1P_C10', name: 'Disjuntor Termomagnético 1P 10A Curva C', specs: { ratedCurrent: 10, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 12, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C16', name: 'Disjuntor Termomagnético 1P 16A Curva C', specs: { ratedCurrent: 16, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 13, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C20', name: 'Disjuntor Termomagnético 1P 20A Curva C', specs: { ratedCurrent: 20, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 14, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C25', name: 'Disjuntor Termomagnético 1P 25A Curva C', specs: { ratedCurrent: 25, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 15, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C32', name: 'Disjuntor Termomagnético 1P 32A Curva C', specs: { ratedCurrent: 32, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 18, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C40', name: 'Disjuntor Termomagnético 1P 40A Curva C', specs: { ratedCurrent: 40, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 22, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_1P_C63', name: 'Disjuntor Termomagnético 1P 63A Curva C', specs: { ratedCurrent: 63, poles: '1P', curve: 'C', voltage: '230V', breakingCapacity: '3kA' }, moduleWidth: 1, widthMm: 17.5, typicalPrice: 35, formFactor: 'MCB_1P' },
  { category: 'MCB', code: 'MCB_2P_C20', name: 'Disjuntor Termomagnético 2P 20A Curva C', specs: { ratedCurrent: 20, poles: '2P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 2, widthMm: 35, typicalPrice: 40, formFactor: 'MCB_2P' },
  { category: 'MCB', code: 'MCB_2P_C40', name: 'Disjuntor Termomagnético 2P 40A Curva C', specs: { ratedCurrent: 40, poles: '2P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 2, widthMm: 35, typicalPrice: 50, formFactor: 'MCB_2P' },
  { category: 'MCB', code: 'MCB_3P_C16', name: 'Disjuntor Termomagnético 3P 16A Curva C', specs: { ratedCurrent: 16, poles: '3P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 3, widthMm: 52.5, typicalPrice: 120, formFactor: 'MCB_3P' },
  { category: 'MCB', code: 'MCB_3P_C25', name: 'Disjuntor Termomagnético 3P 25A Curva C', specs: { ratedCurrent: 25, poles: '3P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 3, widthMm: 52.5, typicalPrice: 135, formFactor: 'MCB_3P' },
  { category: 'MCB', code: 'MCB_3P_C32', name: 'Disjuntor Termomagnético 3P 32A Curva C', specs: { ratedCurrent: 32, poles: '3P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 3, widthMm: 52.5, typicalPrice: 150, formFactor: 'MCB_3P' },
  { category: 'MCB', code: 'MCB_3P_C63', name: 'Disjuntor Termomagnético 3P 63A Curva C', specs: { ratedCurrent: 63, poles: '3P', curve: 'C', voltage: '400V', breakingCapacity: '3kA' }, moduleWidth: 3, widthMm: 52.5, typicalPrice: 200, formFactor: 'MCB_3P' },

  // ==================== MCCB (Disjuntores Caixa Moldada) ====================
  { category: 'MCCB', code: 'MCCB_100A_3P', name: 'Disjuntor Caixa Moldada 100A 3P', specs: { ratedCurrent: 100, poles: '3P', breakingCapacity: '36kA', tripUnit: 'TM' }, moduleWidth: 0, widthMm: 105, typicalPrice: 700, formFactor: 'MCCB_100' },
  { category: 'MCCB', code: 'MCCB_160A_3P', name: 'Disjuntor Caixa Moldada 160A 3P', specs: { ratedCurrent: 160, poles: '3P', breakingCapacity: '36kA', tripUnit: 'TM' }, moduleWidth: 0, widthMm: 105, typicalPrice: 900, formFactor: 'MCCB_160' },
  { category: 'MCCB', code: 'MCCB_250A_3P', name: 'Disjuntor Caixa Moldada 250A 3P', specs: { ratedCurrent: 250, poles: '3P', breakingCapacity: '36kA', tripUnit: 'TM' }, moduleWidth: 0, widthMm: 140, typicalPrice: 1600, formFactor: 'MCCB_250' },
  { category: 'MCCB', code: 'MCCB_400A_3P', name: 'Disjuntor Caixa Moldada 400A 3P', specs: { ratedCurrent: 400, poles: '3P', breakingCapacity: '36kA', tripUnit: 'Electronic' }, moduleWidth: 0, widthMm: 210, typicalPrice: 3200, formFactor: 'MCCB_400' },
  { category: 'MCCB', code: 'MCCB_630A_3P', name: 'Disjuntor Caixa Moldada 630A 3P', specs: { ratedCurrent: 630, poles: '3P', breakingCapacity: '50kA', tripUnit: 'Electronic' }, moduleWidth: 0, widthMm: 210, typicalPrice: 5000, formFactor: 'MCCB_630' },
  { category: 'MCCB', code: 'MCCB_800A_3P', name: 'Disjuntor Caixa Moldada 800A 3P', specs: { ratedCurrent: 800, poles: '3P', breakingCapacity: '50kA', tripUnit: 'Electronic' }, moduleWidth: 0, widthMm: 280, typicalPrice: 8000, formFactor: 'MCCB_800' },

  // ==================== CONTACTOR ====================
  { category: 'CONTACTOR', code: 'CONT_9A', name: 'Contator 9A AC-3 (4kW)', specs: { ac3Current: 9, motorPowerKw: 4, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 45, typicalPrice: 120, formFactor: 'CONT_SMALL' },
  { category: 'CONTACTOR', code: 'CONT_12A', name: 'Contator 12A AC-3 (5.5kW)', specs: { ac3Current: 12, motorPowerKw: 5.5, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 45, typicalPrice: 140, formFactor: 'CONT_SMALL' },
  { category: 'CONTACTOR', code: 'CONT_18A', name: 'Contator 18A AC-3 (7.5kW)', specs: { ac3Current: 18, motorPowerKw: 7.5, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 45, typicalPrice: 160, formFactor: 'CONT_SMALL' },
  { category: 'CONTACTOR', code: 'CONT_25A', name: 'Contator 25A AC-3 (11kW)', specs: { ac3Current: 25, motorPowerKw: 11, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 45, typicalPrice: 200, formFactor: 'CONT_SMALL' },
  { category: 'CONTACTOR', code: 'CONT_32A', name: 'Contator 32A AC-3 (15kW)', specs: { ac3Current: 32, motorPowerKw: 15, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 55, typicalPrice: 260, formFactor: 'CONT_MEDIUM' },
  { category: 'CONTACTOR', code: 'CONT_40A', name: 'Contator 40A AC-3 (22kW)', specs: { ac3Current: 40, motorPowerKw: 22, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 1, widthMm: 75, typicalPrice: 350, formFactor: 'CONT_MEDIUM' },
  { category: 'CONTACTOR', code: 'CONT_65A', name: 'Contator 65A AC-3 (37kW)', specs: { ac3Current: 65, motorPowerKw: 37, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 0, widthMm: 85, typicalPrice: 600, formFactor: 'CONT_LARGE' },
  { category: 'CONTACTOR', code: 'CONT_80A', name: 'Contator 80A AC-3 (45kW)', specs: { ac3Current: 80, motorPowerKw: 45, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 0, widthMm: 85, typicalPrice: 750, formFactor: 'CONT_LARGE' },
  { category: 'CONTACTOR', code: 'CONT_95A', name: 'Contator 95A AC-3 (55kW)', specs: { ac3Current: 95, motorPowerKw: 55, coilVoltage: '220VAC', auxContacts: '1NO+1NC' }, moduleWidth: 0, widthMm: 100, typicalPrice: 900, formFactor: 'CONT_LARGE' },
  { category: 'CONTACTOR', code: 'CONT_140A', name: 'Contator 140A AC-3 (75kW)', specs: { ac3Current: 140, motorPowerKw: 75, coilVoltage: '220VAC', auxContacts: '2NO+2NC' }, moduleWidth: 0, widthMm: 120, typicalPrice: 1700, formFactor: 'CONT_XLARGE' },
  { category: 'CONTACTOR', code: 'CONT_205A', name: 'Contator 205A AC-3 (110kW)', specs: { ac3Current: 205, motorPowerKw: 110, coilVoltage: '220VAC', auxContacts: '2NO+2NC' }, moduleWidth: 0, widthMm: 160, typicalPrice: 2600, formFactor: 'CONT_XLARGE' },

  // ==================== RELAY ====================
  { category: 'RELAY', code: 'RELAY_1CO_10A_24VDC', name: 'Relé 1CO 10A 24VDC', specs: { contactForm: '1CO', switchingCurrent: 10, coilVoltage: '24VDC' }, moduleWidth: 1, widthMm: 12, typicalPrice: 35, formFactor: 'RELAY_MINI' },
  { category: 'RELAY', code: 'RELAY_2CO_10A_24VDC', name: 'Relé 2CO 10A 24VDC', specs: { contactForm: '2CO', switchingCurrent: 10, coilVoltage: '24VDC' }, moduleWidth: 1, widthMm: 22, typicalPrice: 42, formFactor: 'RELAY_MINI' },
  { category: 'RELAY', code: 'RELAY_4CO_7A_230VAC', name: 'Relé 4CO 7A 230VAC DIN', specs: { contactForm: '4CO', switchingCurrent: 7, coilVoltage: '230VAC' }, moduleWidth: 1, widthMm: 22, typicalPrice: 75, formFactor: 'RELAY_DIN' },
  { category: 'RELAY', code: 'RELAY_2CO_16A_24VDC', name: 'Relé 2CO 16A 24VDC DIN', specs: { contactForm: '2CO', switchingCurrent: 16, coilVoltage: '24VDC' }, moduleWidth: 1, widthMm: 22, typicalPrice: 70, formFactor: 'RELAY_DIN' },

  // ==================== TERMINAL BLOCK ====================
  { category: 'TERMINAL', code: 'TERM_2.5_GRAY', name: 'Borne Passagem 2.5mm² Cinza', specs: { crossSection: 2.5, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 1, widthMm: 5, typicalPrice: 6, formFactor: 'TERM_SMALL' },
  { category: 'TERMINAL', code: 'TERM_4_GRAY', name: 'Borne Passagem 4mm² Cinza', specs: { crossSection: 4, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 1, widthMm: 6, typicalPrice: 8, formFactor: 'TERM_SMALL' },
  { category: 'TERMINAL', code: 'TERM_6_GRAY', name: 'Borne Passagem 6mm² Cinza', specs: { crossSection: 6, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 1, widthMm: 8, typicalPrice: 10, formFactor: 'TERM_MEDIUM' },
  { category: 'TERMINAL', code: 'TERM_10_GRAY', name: 'Borne Passagem 10mm² Cinza', specs: { crossSection: 10, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 1, widthMm: 10, typicalPrice: 12, formFactor: 'TERM_MEDIUM' },
  { category: 'TERMINAL', code: 'TERM_16_GRAY', name: 'Borne Passagem 16mm² Cinza', specs: { crossSection: 16, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 2, widthMm: 12, typicalPrice: 15, formFactor: 'TERM_LARGE' },
  { category: 'TERMINAL', code: 'TERM_35_GRAY', name: 'Borne Passagem 35mm² Cinza', specs: { crossSection: 35, color: 'Cinza', connectionType: 'Screw' }, moduleWidth: 2, widthMm: 16, typicalPrice: 22, formFactor: 'TERM_LARGE' },
  { category: 'TERMINAL', code: 'TERM_PE_2.5', name: 'Borne Terra 2.5mm² Verde-Amarelo', specs: { crossSection: 2.5, color: 'Verde-Amarelo', connectionType: 'Screw' }, moduleWidth: 1, widthMm: 5, typicalPrice: 8, formFactor: 'TERM_PE' },

  // ==================== PLC ====================
  { category: 'PLC', code: 'PLC_8DI_6DO', name: 'CLP 8DI/6DO Relé', specs: { ioCount: 14, commProtocol: 'Ethernet', programMemory: 40 }, moduleWidth: 0, widthMm: 110, typicalPrice: 2500, formFactor: 'PLC_COMPACT' },
  { category: 'PLC', code: 'PLC_14DI_10DO', name: 'CLP 14DI/10DO Transistor', specs: { ioCount: 24, commProtocol: 'Profinet', programMemory: 75 }, moduleWidth: 0, widthMm: 130, typicalPrice: 4000, formFactor: 'PLC_COMPACT' },
  { category: 'PLC', code: 'PLC_24DI_16DO', name: 'CLP 24DI/16DO Expansível', specs: { ioCount: 40, commProtocol: 'Ethernet/IP', programMemory: 150 }, moduleWidth: 0, widthMm: 170, typicalPrice: 8000, formFactor: 'PLC_MODULAR' },

  // ==================== VFD ====================
  { category: 'VFD', code: 'VFD_1.5KW', name: 'Inversor Frequência 1.5kW 380V', specs: { motorPowerKw: 1.5, outputCurrent: 5.6, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 130, typicalPrice: 3400, formFactor: 'VFD_SMALL' },
  { category: 'VFD', code: 'VFD_3KW', name: 'Inversor Frequência 3kW 380V', specs: { motorPowerKw: 3, outputCurrent: 9, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 150, typicalPrice: 4500, formFactor: 'VFD_SMALL' },
  { category: 'VFD', code: 'VFD_5.5KW', name: 'Inversor Frequência 5.5kW 380V', specs: { motorPowerKw: 5.5, outputCurrent: 15.6, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 180, typicalPrice: 6200, formFactor: 'VFD_MEDIUM' },
  { category: 'VFD', code: 'VFD_7.5KW', name: 'Inversor Frequência 7.5kW 380V', specs: { motorPowerKw: 7.5, outputCurrent: 23, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 200, typicalPrice: 7200, formFactor: 'VFD_MEDIUM' },
  { category: 'VFD', code: 'VFD_11KW', name: 'Inversor Frequência 11kW 380V', specs: { motorPowerKw: 11, outputCurrent: 32, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 250, typicalPrice: 9000, formFactor: 'VFD_LARGE' },
  { category: 'VFD', code: 'VFD_15KW', name: 'Inversor Frequência 15kW 380V', specs: { motorPowerKw: 15, outputCurrent: 44, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 280, typicalPrice: 11000, formFactor: 'VFD_LARGE' },
  { category: 'VFD', code: 'VFD_30KW', name: 'Inversor Frequência 30kW 380V', specs: { motorPowerKw: 30, outputCurrent: 72, inputVoltage: '380V' }, moduleWidth: 0, widthMm: 350, typicalPrice: 18000, formFactor: 'VFD_XLARGE' },

  // ==================== POWER SUPPLY ====================
  { category: 'PSU', code: 'PSU_24V_5A', name: 'Fonte 24VDC 5A', specs: { outputVoltage: '24VDC', outputCurrent: 5, powerW: 120 }, moduleWidth: 1, widthMm: 45, typicalPrice: 1200, formFactor: 'PSU_SMALL' },
  { category: 'PSU', code: 'PSU_24V_10A', name: 'Fonte 24VDC 10A', specs: { outputVoltage: '24VDC', outputCurrent: 10, powerW: 240 }, moduleWidth: 1, widthMm: 68, typicalPrice: 2200, formFactor: 'PSU_MEDIUM' },
  { category: 'PSU', code: 'PSU_24V_20A', name: 'Fonte 24VDC 20A', specs: { outputVoltage: '24VDC', outputCurrent: 20, powerW: 480 }, moduleWidth: 0, widthMm: 110, typicalPrice: 3800, formFactor: 'PSU_LARGE' },
  { category: 'PSU', code: 'PSU_24V_40A', name: 'Fonte 24VDC 40A', specs: { outputVoltage: '24VDC', outputCurrent: 40, powerW: 960 }, moduleWidth: 0, widthMm: 160, typicalPrice: 6000, formFactor: 'PSU_XLARGE' },

  // ==================== MOTOR PROTECTION ====================
  { category: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_4A', name: 'Protetor Motor 1.6-2.5A', specs: { currentRange: '1.6-2.5A', motorPowerKw: 1.1, tripClass: '10A' }, moduleWidth: 1, widthMm: 45, typicalPrice: 380, formFactor: 'MOTOR_PROT_SMALL' },
  { category: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_10A', name: 'Protetor Motor 6.3-10A', specs: { currentRange: '6.3-10A', motorPowerKw: 4, tripClass: '10A' }, moduleWidth: 1, widthMm: 45, typicalPrice: 450, formFactor: 'MOTOR_PROT_SMALL' },
  { category: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_18A', name: 'Protetor Motor 12-18A', specs: { currentRange: '12-18A', motorPowerKw: 7.5, tripClass: '10A' }, moduleWidth: 1, widthMm: 55, typicalPrice: 550, formFactor: 'MOTOR_PROT_MEDIUM' },
  { category: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_32A', name: 'Protetor Motor 24-32A', specs: { currentRange: '24-32A', motorPowerKw: 15, tripClass: '10A' }, moduleWidth: 1, widthMm: 55, typicalPrice: 700, formFactor: 'MOTOR_PROT_MEDIUM' },
  { category: 'MOTOR_PROTECTION', code: 'MOTOR_PROT_40A', name: 'Protetor Motor 30-40A', specs: { currentRange: '30-40A', motorPowerKw: 18.5, tripClass: '10A' }, moduleWidth: 0, widthMm: 70, typicalPrice: 900, formFactor: 'MOTOR_PROT_LARGE' },

  // ==================== PUSHBUTTON ====================
  { category: 'PUSHBUTTON', code: 'PB_GREEN_1NO', name: 'Botoeira Verde 1NO 22mm', specs: { function: 'Momentâneo', color: 'Verde', contactType: '1NO', mountingDiameter: 22 }, moduleWidth: 0, widthMm: 30, typicalPrice: 60, formFactor: 'PB_22MM' },
  { category: 'PUSHBUTTON', code: 'PB_RED_1NC', name: 'Botoeira Vermelha 1NC 22mm', specs: { function: 'Momentâneo', color: 'Vermelho', contactType: '1NC', mountingDiameter: 22 }, moduleWidth: 0, widthMm: 30, typicalPrice: 60, formFactor: 'PB_22MM' },
  { category: 'PUSHBUTTON', code: 'PB_BLACK_1NO_1NC', name: 'Botoeira Preta 1NO+1NC 22mm', specs: { function: 'Momentâneo', color: 'Preto', contactType: '1NO+1NC', mountingDiameter: 22 }, moduleWidth: 0, widthMm: 30, typicalPrice: 65, formFactor: 'PB_22MM' },
  { category: 'PUSHBUTTON', code: 'PB_EMERGENCY', name: 'Botoeira Emergência 40mm', specs: { function: 'Girar destravar', color: 'Vermelho', contactType: '1NC', mountingDiameter: 40 }, moduleWidth: 0, widthMm: 40, typicalPrice: 100, formFactor: 'PB_EMERGENCY' },

  // ==================== SIGNALING ====================
  { category: 'SIGNALING', code: 'PILOT_GREEN_220V', name: 'Piloto Verde LED 220V 22mm', specs: { function: 'Piloto', color: 'Verde', voltage: '220VAC' }, moduleWidth: 0, widthMm: 30, typicalPrice: 70, formFactor: 'PILOT_22MM' },
  { category: 'SIGNALING', code: 'PILOT_RED_220V', name: 'Piloto Vermelho LED 220V 22mm', specs: { function: 'Piloto', color: 'Vermelho', voltage: '220VAC' }, moduleWidth: 0, widthMm: 30, typicalPrice: 70, formFactor: 'PILOT_22MM' },
  { category: 'SIGNALING', code: 'PILOT_YELLOW_220V', name: 'Piloto Amarelo LED 220V 22mm', specs: { function: 'Piloto', color: 'Amarelo', voltage: '220VAC' }, moduleWidth: 0, widthMm: 30, typicalPrice: 70, formFactor: 'PILOT_22MM' },

  // ==================== DISCONNECT SWITCH ====================
  { category: 'DISCONNECT_SWITCH', code: 'DISC_3P_40A', name: 'Seccionadora 3P 40A Frontal', specs: { ratedCurrent: 40, poles: '3P', mounting: 'Painel' }, moduleWidth: 0, widthMm: 80, typicalPrice: 200, formFactor: 'DISC_SMALL' },
  { category: 'DISCONNECT_SWITCH', code: 'DISC_3P_100A', name: 'Seccionadora 3P 100A Frontal', specs: { ratedCurrent: 100, poles: '3P', mounting: 'Painel' }, moduleWidth: 0, widthMm: 100, typicalPrice: 420, formFactor: 'DISC_MEDIUM' },
  { category: 'DISCONNECT_SWITCH', code: 'DISC_3P_250A', name: 'Seccionadora 3P 250A Frontal', specs: { ratedCurrent: 250, poles: '3P', mounting: 'Painel' }, moduleWidth: 0, widthMm: 140, typicalPrice: 950, formFactor: 'DISC_LARGE' },

  // ==================== SPD (DPS) ====================
  { category: 'SPD', code: 'SPD_T2_1P', name: 'DPS Classe II 1P 20kA', specs: { type: 'T2', maxDischarge: 20, voltageProtection: 1.5 }, moduleWidth: 1, widthMm: 18, typicalPrice: 480, formFactor: 'SPD_1P' },
  { category: 'SPD', code: 'SPD_T2_3P', name: 'DPS Classe II 3P 20kA', specs: { type: 'T2', maxDischarge: 20, voltageProtection: 1.5 }, moduleWidth: 3, widthMm: 54, typicalPrice: 1500, formFactor: 'SPD_3P' },

  // ==================== CONTROL TRANSFORMER ====================
  { category: 'CONTROL_TRANSFORMER', code: 'TRAFO_100VA', name: 'Transformador Controle 100VA 380/220V', specs: { vaRating: 100, primaryVoltage: '380V', secondaryVoltage: '220V' }, moduleWidth: 0, widthMm: 70, typicalPrice: 250, formFactor: 'TRAFO_SMALL' },
  { category: 'CONTROL_TRANSFORMER', code: 'TRAFO_200VA', name: 'Transformador Controle 200VA 380/220V', specs: { vaRating: 200, primaryVoltage: '380V', secondaryVoltage: '220V' }, moduleWidth: 0, widthMm: 80, typicalPrice: 340, formFactor: 'TRAFO_MEDIUM' },
  { category: 'CONTROL_TRANSFORMER', code: 'TRAFO_500VA', name: 'Transformador Controle 500VA 380/220V', specs: { vaRating: 500, primaryVoltage: '380V', secondaryVoltage: '220V' }, moduleWidth: 0, widthMm: 100, typicalPrice: 550, formFactor: 'TRAFO_LARGE' },

  // ==================== ETHERNET SWITCH ====================
  { category: 'ETHERNET_SWITCH', code: 'SWITCH_5P', name: 'Switch Ethernet 5 Portas', specs: { ports: 5, speed: '10/100', managed: false }, moduleWidth: 0, widthMm: 60, typicalPrice: 1750, formFactor: 'SWITCH_SMALL' },
  { category: 'ETHERNET_SWITCH', code: 'SWITCH_8P', name: 'Switch Ethernet 8 Portas Gerenciável', specs: { ports: 8, speed: '10/100', managed: true }, moduleWidth: 0, widthMm: 80, typicalPrice: 4000, formFactor: 'SWITCH_MEDIUM' },

  // ==================== HMI ====================
  { category: 'HMI', code: 'HMI_7IN', name: 'IHM 7" Touchscreen Colorida', specs: { screenSize: 7, resolution: '800x480', touch: true, commProtocol: 'Profinet' }, moduleWidth: 0, widthMm: 200, typicalPrice: 6200, formFactor: 'HMI_7IN' },
  { category: 'HMI', code: 'HMI_12IN', name: 'IHM 12" Touchscreen Colorida', specs: { screenSize: 12, resolution: '1280x800', touch: true, commProtocol: 'Profinet' }, moduleWidth: 0, widthMm: 300, typicalPrice: 11500, formFactor: 'HMI_12IN' },

  // ==================== ENCLOSURE ====================
  { category: 'ENCLOSURE', code: 'ENC_400_300_150', name: 'QGX 400×300×150 IP65 Aço', specs: { widthMm: 400, heightMm: 300, depthMm: 150, ipRating: 'IP65', material: 'Aço Pintado' }, moduleWidth: 0, widthMm: 400, typicalPrice: 350, formFactor: 'ENC_SMALL' },
  { category: 'ENCLOSURE', code: 'ENC_600_400_200', name: 'QGX 600×400×200 IP65 Aço', specs: { widthMm: 600, heightMm: 400, depthMm: 200, ipRating: 'IP65', material: 'Aço Pintado' }, moduleWidth: 0, widthMm: 600, typicalPrice: 650, formFactor: 'ENC_MEDIUM' },
  { category: 'ENCLOSURE', code: 'ENC_800_600_250', name: 'QGX 800×600×250 IP65 Aço', specs: { widthMm: 800, heightMm: 600, depthMm: 250, ipRating: 'IP65', material: 'Aço Pintado' }, moduleWidth: 0, widthMm: 800, typicalPrice: 1000, formFactor: 'ENC_LARGE' },
  { category: 'ENCLOSURE', code: 'ENC_1000_800_300', name: 'QGX 1000×800×300 IP65 Aço', specs: { widthMm: 1000, heightMm: 800, depthMm: 300, ipRating: 'IP65', material: 'Aço Pintado' }, moduleWidth: 0, widthMm: 1000, typicalPrice: 1500, formFactor: 'ENC_XLARGE' },
  { category: 'ENCLOSURE', code: 'ENC_1800_800_500', name: 'QGI 1800×800×500 IP55 Aço', specs: { widthMm: 1800, heightMm: 800, depthMm: 500, ipRating: 'IP55', material: 'Aço Pintado' }, moduleWidth: 0, widthMm: 1800, typicalPrice: 5000, formFactor: 'ENC_FLOOR' },
];

export const BRAND_PRICES = [
  // MCB 1P C10
  { componentCode: 'MCB_1P_C10', brand: 'Steck', sku: 'SDD61C10', price: 9 },
  { componentCode: 'MCB_1P_C10', brand: 'Schneider', sku: 'EZ9F33110', price: 35 },
  { componentCode: 'MCB_1P_C10', brand: 'ABB', model: 'S201-C10', price: 45 },
  { componentCode: 'MCB_1P_C10', brand: 'Siemens', model: '5SY6110', price: 55 },
  { componentCode: 'MCB_1P_C10', brand: 'Legrand', model: 'DX³ 6000 10A', price: 40 },
  // MCB 1P C20
  { componentCode: 'MCB_1P_C20', brand: 'Steck', sku: 'SDD61C20', price: 12 },
  { componentCode: 'MCB_1P_C20', brand: 'Schneider', sku: 'EZ9F33120', price: 40 },
  { componentCode: 'MCB_1P_C20', brand: 'ABB', model: 'S201-C20', price: 55 },
  { componentCode: 'MCB_1P_C20', brand: 'Siemens', model: '5SY6120', price: 65 },
  // MCB 1P C32
  { componentCode: 'MCB_1P_C32', brand: 'Steck', sku: 'SDD61C32', price: 16 },
  { componentCode: 'MCB_1P_C32', brand: 'Schneider', sku: 'EZ9F33132', price: 50 },
  { componentCode: 'MCB_1P_C32', brand: 'ABB', model: 'S201-C32', price: 65 },
  // Contactor 9A
  { componentCode: 'CONT_9A', brand: 'ABB', sku: 'AF09-30-10-11', price: 450 },
  { componentCode: 'CONT_9A', brand: 'Schneider', sku: 'LC1D096M7C', price: 75 },
  { componentCode: 'CONT_9A', brand: 'Siemens', sku: '3RT2015-1AP01', price: 110 },
  { componentCode: 'CONT_9A', brand: 'WEG', sku: 'CWC09-10-22', price: 90 },
  // Contactor 25A
  { componentCode: 'CONT_25A', brand: 'ABB', sku: 'AF25-30-10-11', price: 650 },
  { componentCode: 'CONT_25A', brand: 'Schneider', sku: 'LC1D256M7C', price: 130 },
  { componentCode: 'CONT_25A', brand: 'Siemens', sku: '3RT2025-1AP01', price: 170 },
  { componentCode: 'CONT_25A', brand: 'WEG', sku: 'CWC025-10-22', price: 150 },
  // Contactor 40A
  { componentCode: 'CONT_40A', brand: 'ABB', sku: 'AF40-30-10-11', price: 900 },
  { componentCode: 'CONT_40A', brand: 'Schneider', sku: 'LC1D40A0M7', price: 200 },
  { componentCode: 'CONT_40A', brand: 'Siemens', sku: '3RT2027-1AP01', price: 260 },
  // VFD 5.5kW
  { componentCode: 'VFD_5.5KW', brand: 'ABB', sku: 'ACS355-03E-15A6-4', price: 6200 },
  { componentCode: 'VFD_5.5KW', brand: 'Schneider', sku: 'ATV320U40N4B', price: 4500 },
  { componentCode: 'VFD_5.5KW', brand: 'Siemens', sku: '6SL3210-5BB21-5UV0', price: 5000 },
  { componentCode: 'VFD_5.5KW', brand: 'WEG', sku: 'CFW11 00550 T 2', price: 3800 },
  // VFD 7.5kW
  { componentCode: 'VFD_7.5KW', brand: 'ABB', sku: 'ACS355-03E-23A1-4', price: 7200 },
  { componentCode: 'VFD_7.5KW', brand: 'Schneider', sku: 'ATV320U55N4B', price: 5500 },
  { componentCode: 'VFD_7.5KW', brand: 'WEG', sku: 'CFW11 00750 T 2', price: 4600 },
  // VFD 15kW
  { componentCode: 'VFD_15KW', brand: 'ABB', sku: 'ACS355-03E-44A0-4', price: 11000 },
  { componentCode: 'VFD_15KW', brand: 'Schneider', sku: 'ATV630D15N4', price: 12000 },
  { componentCode: 'VFD_15KW', brand: 'WEG', sku: 'CFW11 01500 T 2', price: 7200 },
  // PLC 14DI/10DO
  { componentCode: 'PLC_14DI_10DO', brand: 'Siemens', sku: 'CPU 1214C DC/DC/DC', price: 4000 },
  { componentCode: 'PLC_14DI_10DO', brand: 'Schneider', sku: 'M221CE24T', price: 2600 },
  { componentCode: 'PLC_14DI_10DO', brand: 'Wago', sku: 'PFC200 750-8212', price: 4800 },
  // PSU 24V 10A
  { componentCode: 'PSU_24V_10A', brand: 'Phoenix Contact', sku: 'QUINT-PS/1AC/24DC/10', price: 2200 },
  { componentCode: 'PSU_24V_10A', brand: 'Mean Well', sku: 'NDR-240-24', price: 550 },
  { componentCode: 'PSU_24V_10A', brand: 'Siemens', sku: 'PSU100C 24V/10A', price: 1500 },
  // Terminal 2.5mm²
  { componentCode: 'TERM_2.5_GRAY', brand: 'Phoenix Contact', sku: 'UT 2,5', price: 6 },
  { componentCode: 'TERM_2.5_GRAY', brand: 'Wago', sku: '280-992', price: 7 },
  { componentCode: 'TERM_2.5_GRAY', brand: 'Weidmüller', sku: 'WDU 2,5', price: 8 },
];
