-- CreateEnum
CREATE TYPE "MountingType" AS ENUM ('DIN_RAIL', 'PLATE', 'FLANGE', 'DIRECT', 'PLUG_IN');

-- CreateEnum
CREATE TYPE "PoleCount" AS ENUM ('ONE_P', 'TWO_P', 'THREE_P', 'FOUR_P');

-- CreateEnum
CREATE TYPE "ClimateZone" AS ENUM ('COASTAL', 'AMAZON', 'SEMI_ARID', 'SOUTHERN_HIGHLANDS', 'PLATEAU');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('VALIDATION', 'PRICING', 'COMPATIBILITY', 'SIZING', 'THERMAL', 'CLEARANCE', 'BUSINESS');

-- CreateEnum
CREATE TYPE "RuleSeverity" AS ENUM ('ERROR', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "TemplateComplexity" AS ENUM ('SIMPLE', 'MEDIUM', 'COMPLEX');

-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "brand" VARCHAR(120),
ADD COLUMN     "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "formFactorGroup" VARCHAR(120),
ADD COLUMN     "leadTimeDays" INTEGER,
ADD COLUMN     "manufacturer" VARCHAR(120),
ADD COLUMN     "modelNumber" VARCHAR(120),
ADD COLUMN     "moduleWidth" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "mountingType" "MountingType" NOT NULL DEFAULT 'DIN_RAIL',
ADD COLUMN     "poles" "PoleCount",
ADD COLUMN     "ratedCurrent" DECIMAL(18,4),
ADD COLUMN     "ratedVoltage" VARCHAR(20),
ADD COLUMN     "typicalPrice" DECIMAL(18,4),
ADD COLUMN     "weightG" INTEGER;

-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "ambientTempC" INTEGER,
ADD COLUMN     "climateZone" VARCHAR(20),
ADD COLUMN     "enclosureDepthMm" INTEGER,
ADD COLUMN     "enclosureHeightMm" INTEGER,
ADD COLUMN     "enclosureMaterial" VARCHAR(20),
ADD COLUMN     "enclosureWidthMm" INTEGER,
ADD COLUMN     "indoorOutdoor" VARCHAR(10),
ADD COLUMN     "ipRating" VARCHAR(10),
ADD COLUMN     "panelType" VARCHAR(40),
ADD COLUMN     "shortCircuitRating" VARCHAR(20),
ADD COLUMN     "stateCode" VARCHAR(2),
ADD COLUMN     "supplyPhases" INTEGER,
ADD COLUMN     "supplyVoltage" VARCHAR(10),
ADD COLUMN     "totalHeatW" DECIMAL(18,2),
ADD COLUMN     "totalLoadA" DECIMAL(18,4);

-- CreateTable
CREATE TABLE "ComponentImage" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "imageType" VARCHAR(20) NOT NULL DEFAULT 'MAIN',
    "svgContent" TEXT NOT NULL,
    "widthMm" INTEGER,
    "heightMm" INTEGER,
    "depthMm" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentPricing" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "supplierName" VARCHAR(160) NOT NULL,
    "supplierSku" VARCHAR(120),
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'BRL',
    "quantityMin" INTEGER NOT NULL DEFAULT 1,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "source" VARCHAR(120),
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentRule" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "ruleType" "RuleType" NOT NULL,
    "severity" "RuleSeverity" NOT NULL DEFAULT 'ERROR',
    "condition" JSONB NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "stateCode" VARCHAR(2) NOT NULL,
    "stateName" VARCHAR(120) NOT NULL,
    "singlePhaseVoltage" VARCHAR(10) NOT NULL DEFAULT '127V',
    "twoPhaseVoltage" VARCHAR(10) NOT NULL DEFAULT '220V',
    "threePhaseVoltage" VARCHAR(10) NOT NULL DEFAULT '380V',
    "climateZone" "ClimateZone" NOT NULL DEFAULT 'PLATEAU',
    "typicalTempMin" INTEGER NOT NULL DEFAULT 10,
    "typicalTempMax" INTEGER NOT NULL DEFAULT 35,
    "humidityAvg" INTEGER NOT NULL DEFAULT 60,
    "recommendedIpMin" VARCHAR(10) NOT NULL DEFAULT 'IP41',
    "recommendedMaterial" VARCHAR(20) NOT NULL DEFAULT 'STEEL',
    "isCoastal" BOOLEAN NOT NULL DEFAULT false,
    "isOutdoorRated" BOOLEAN NOT NULL DEFAULT false,
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PanelTemplate" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" VARCHAR(500),
    "panelType" VARCHAR(40) NOT NULL,
    "complexity" "TemplateComplexity" NOT NULL DEFAULT 'SIMPLE',
    "enclosureWidthMm" INTEGER NOT NULL,
    "enclosureHeightMm" INTEGER NOT NULL,
    "enclosureDepthMm" INTEGER NOT NULL,
    "ipRating" VARCHAR(10) NOT NULL DEFAULT 'IP55',
    "material" VARCHAR(20) NOT NULL DEFAULT 'STEEL',
    "supplyVoltage" VARCHAR(10) NOT NULL DEFAULT '380V',
    "supplyPhases" INTEGER NOT NULL DEFAULT 3,
    "estimatedPriceMin" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "estimatedPriceMax" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "estimatedHours" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "templateData" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PanelTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" VARCHAR(500),
    "ruleType" "RuleType" NOT NULL,
    "severity" "RuleSeverity" NOT NULL DEFAULT 'WARNING',
    "condition" JSONB NOT NULL,
    "action" JSONB NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DINRail" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "railType" VARCHAR(20) NOT NULL DEFAULT 'TOP_HAT_7_5',
    "lengthMm" INTEGER NOT NULL,
    "positionY" DECIMAL(18,2) NOT NULL,
    "orientation" VARCHAR(20) NOT NULL DEFAULT 'HORIZONTAL',
    "moduleCapacity" INTEGER NOT NULL,
    "usedModules" INTEGER NOT NULL DEFAULT 0,
    "label" VARCHAR(40),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DINRail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circuit" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "circuitType" VARCHAR(20) NOT NULL DEFAULT 'POWER',
    "voltage" VARCHAR(10) NOT NULL DEFAULT '380V',
    "color" VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
    "protectionDeviceId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Circuit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentPlacement" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "railId" TEXT,
    "circuitId" TEXT,
    "positionMm" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "moduleWidth" INTEGER NOT NULL DEFAULT 1,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" VARCHAR(300),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentPlacement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ComponentImage_componentId_imageType_idx" ON "ComponentImage"("componentId", "imageType");

-- CreateIndex
CREATE INDEX "ComponentPricing_componentId_supplierName_idx" ON "ComponentPricing"("componentId", "supplierName");

-- CreateIndex
CREATE INDEX "ComponentPricing_validFrom_validTo_idx" ON "ComponentPricing"("validFrom", "validTo");

-- CreateIndex
CREATE INDEX "ComponentRule_componentId_ruleType_idx" ON "ComponentRule"("componentId", "ruleType");

-- CreateIndex
CREATE UNIQUE INDEX "Region_stateCode_key" ON "Region"("stateCode");

-- CreateIndex
CREATE INDEX "Region_climateZone_idx" ON "Region"("climateZone");

-- CreateIndex
CREATE UNIQUE INDEX "PanelTemplate_code_key" ON "PanelTemplate"("code");

-- CreateIndex
CREATE INDEX "PanelTemplate_panelType_complexity_idx" ON "PanelTemplate"("panelType", "complexity");

-- CreateIndex
CREATE INDEX "BusinessRule_tenantId_ruleType_idx" ON "BusinessRule"("tenantId", "ruleType");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessRule_tenantId_code_key" ON "BusinessRule"("tenantId", "code");

-- CreateIndex
CREATE INDEX "DINRail_configurationId_idx" ON "DINRail"("configurationId");

-- CreateIndex
CREATE INDEX "Circuit_configurationId_idx" ON "Circuit"("configurationId");

-- CreateIndex
CREATE INDEX "ComponentPlacement_configurationId_idx" ON "ComponentPlacement"("configurationId");

-- CreateIndex
CREATE INDEX "ComponentPlacement_componentId_idx" ON "ComponentPlacement"("componentId");

-- CreateIndex
CREATE INDEX "Component_tenantId_brand_idx" ON "Component"("tenantId", "brand");

-- CreateIndex
CREATE INDEX "Component_formFactorGroup_idx" ON "Component"("formFactorGroup");

-- CreateIndex
CREATE INDEX "Configuration_tenantId_panelType_idx" ON "Configuration"("tenantId", "panelType");

-- AddForeignKey
ALTER TABLE "ComponentImage" ADD CONSTRAINT "ComponentImage_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPricing" ADD CONSTRAINT "ComponentPricing_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentRule" ADD CONSTRAINT "ComponentRule_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessRule" ADD CONSTRAINT "BusinessRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DINRail" ADD CONSTRAINT "DINRail_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circuit" ADD CONSTRAINT "Circuit_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPlacement" ADD CONSTRAINT "ComponentPlacement_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPlacement" ADD CONSTRAINT "ComponentPlacement_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPlacement" ADD CONSTRAINT "ComponentPlacement_railId_fkey" FOREIGN KEY ("railId") REFERENCES "DINRail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentPlacement" ADD CONSTRAINT "ComponentPlacement_circuitId_fkey" FOREIGN KEY ("circuitId") REFERENCES "Circuit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
