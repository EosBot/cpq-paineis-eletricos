-- CreateTable
CREATE TABLE "TenantPrivacyConfig" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "dpoName" VARCHAR(160),
    "dpoEmail" VARCHAR(320),
    "dpoPhone" VARCHAR(40),
    "privacyPolicyUrl" VARCHAR(500),
    "privacyPolicyUpdatedAt" TIMESTAMP(3),
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "termsOfUseUrl" VARCHAR(500),
    "allowDataSharing" BOOLEAN NOT NULL DEFAULT false,
    "requireExplicitConsent" BOOLEAN NOT NULL DEFAULT true,
    "lgpdComplianceEnabled" BOOLEAN NOT NULL DEFAULT true,
    "legalBasisDefault" TEXT NOT NULL DEFAULT 'LEGITIMATE_INTEREST',
    "anonymizeOnDeletion" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantPrivacyConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" VARCHAR(200) NOT NULL,
    "purposeDescription" VARCHAR(500) NOT NULL,
    "legalBasis" VARCHAR(40) NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "grantedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "consentVersion" VARCHAR(10) NOT NULL DEFAULT '1.0',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSubjectRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestType" VARCHAR(40) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "description" VARCHAR(500),
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),
    "responseNotes" VARCHAR(500),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSubjectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacyAuditLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" VARCHAR(120) NOT NULL,
    "entityType" VARCHAR(120) NOT NULL,
    "entityId" TEXT,
    "dataFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(500),
    "legalBasis" VARCHAR(40),
    "consentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivacyAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantPrivacyConfig_tenantId_key" ON "TenantPrivacyConfig"("tenantId");

-- CreateIndex
CREATE INDEX "ConsentRecord_tenantId_userId_idx" ON "ConsentRecord"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "ConsentRecord_tenantId_purpose_idx" ON "ConsentRecord"("tenantId", "purpose");

-- CreateIndex
CREATE INDEX "DataSubjectRequest_tenantId_userId_idx" ON "DataSubjectRequest"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "DataSubjectRequest_tenantId_status_idx" ON "DataSubjectRequest"("tenantId", "status");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_tenantId_entityType_idx" ON "PrivacyAuditLog"("tenantId", "entityType");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_tenantId_actorUserId_idx" ON "PrivacyAuditLog"("tenantId", "actorUserId");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_tenantId_createdAt_idx" ON "PrivacyAuditLog"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "PrivacyAuditLog_entityId_idx" ON "PrivacyAuditLog"("entityId");

-- AddForeignKey
ALTER TABLE "TenantPrivacyConfig" ADD CONSTRAINT "TenantPrivacyConfig_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentRecord" ADD CONSTRAINT "ConsentRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSubjectRequest" ADD CONSTRAINT "DataSubjectRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacyAuditLog" ADD CONSTRAINT "PrivacyAuditLog_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
