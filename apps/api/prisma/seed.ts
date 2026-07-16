import { PrismaClient, RuleVersionStatus, MembershipStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const tenantSlug = 'demo-paineis';
  const tenantName = 'Painéis Demo Ltda';
  const adminEmail = 'admin@paineisdemo.com';
  const adminPassword = 'SenhaForte@123';
  const adminRoleCode = 'admin';

  // 1. Tenant (idempotente por slug)
  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: { name: tenantName, defaultCurrency: 'BRL' },
    create: {
      name: tenantName,
      slug: tenantSlug,
      defaultCurrency: 'BRL',
      defaultPricingContext: { currencyCode: 'BRL', markupPct: 0 },
    },
  });
  console.log(`[seed] tenant: ${tenant.id} (${tenant.slug})`);

  // 2. Role admin (idempotente por tenant+code)
  const permissions = {
    catalog: ['read', 'write'],
    rules: ['read', 'write', 'approve'],
    configurations: ['read', 'write', 'submit'],
    quotes: ['read', 'write', 'calculate', 'send', 'approve'],
    bom: ['read', 'write', 'generate'],
    orders: ['read', 'write', 'advance'],
    shipments: ['read', 'write'],
  };

  const role = await prisma.role.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: adminRoleCode } },
    update: { name: 'Administrador', permissions },
    create: {
      tenantId: tenant.id,
      name: 'Administrador',
      code: adminRoleCode,
      permissions,
      isSystemRole: true,
    },
  });
  console.log(`[seed] role: ${role.id} (${role.code})`);

  // 3. User admin (idempotente por email)
  const passwordHash = await argon2.hash(adminPassword);
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isActive: true },
    create: {
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'Demo',
      passwordHash,
      isActive: true,
    },
  });
  console.log(`[seed] user: ${user.id} (${user.email})`);

  // 4. Membership ACTIVE (idempotente por tenant+user)
  const membership = await prisma.membership.upsert({
    where: { tenantId_userId: { tenantId: tenant.id, userId: user.id } },
    update: { roleId: role.id, status: MembershipStatus.ACTIVE },
    create: {
      tenantId: tenant.id,
      userId: user.id,
      roleId: role.id,
      status: MembershipStatus.ACTIVE,
    },
  });
  console.log(`[seed] membership: ${membership.id} (${membership.status})`);

  // 5. Categoria de componente + templates de atributo
  const categoryCode = 'disjuntora';
  const category = await prisma.componentCategory.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: categoryCode } },
    update: { name: 'Disjuntoras' },
    create: {
      tenantId: tenant.id,
      name: 'Disjuntoras',
      code: categoryCode,
      description: 'Disjuntoras para quadros de distribuição',
      attributeTemplates: {
        create: [
          {
            tenantId: tenant.id,
            name: 'Corrente Nominal (A)',
            code: 'corrente_a',
            valueType: 'DECIMAL',
            isRequired: true,
            unit: 'A',
            sortOrder: 1,
          },
          {
            tenantId: tenant.id,
            name: 'Polos',
            code: 'polos',
            valueType: 'INTEGER',
            isRequired: true,
            sortOrder: 2,
          },
          {
            tenantId: tenant.id,
            name: 'Curva de Disparo',
            code: 'curva',
            valueType: 'TEXT',
            isRequired: false,
            sortOrder: 3,
          },
        ],
      },
    },
    include: { attributeTemplates: true },
  });
  console.log(`[seed] category: ${category.id} (${category.code})`);

  const tmplByCode = new Map(category.attributeTemplates.map((t) => [t.code, t]));
  const correnteTmpl = tmplByCode.get('corrente_a')!;
  const polosTmpl = tmplByCode.get('polos')!;
  const curvaTmpl = tmplByCode.get('curva')!;

  // 6. Componentes (idempotente por tenant+sku)
  const componentDefs = [
    {
      sku: 'DJ-32A-2P',
      name: 'Disjuntora 32A 2P Curva C',
      corrente: '32',
      polos: '2',
      curva: 'C',
    },
    {
      sku: 'DJ-63A-3P',
      name: 'Disjuntora 63A 3P Curva D',
      corrente: '63',
      polos: '3',
      curva: 'D',
    },
  ];

  for (const def of componentDefs) {
    await prisma.component.upsert({
      where: { tenantId_sku: { tenantId: tenant.id, sku: def.sku } },
      update: { name: def.name, componentCategoryId: category.id },
      create: {
        tenantId: tenant.id,
        componentCategoryId: category.id,
        sku: def.sku,
        name: def.name,
        description: def.name,
        isActive: true,
        attributes: {
          create: [
            {
              tenantId: tenant.id,
              componentAttributeTemplateId: correnteTmpl.id,
              valueDecimal: Number(def.corrente),
            },
            {
              tenantId: tenant.id,
              componentAttributeTemplateId: polosTmpl.id,
              valueInteger: Number(def.polos),
            },
            {
              tenantId: tenant.id,
              componentAttributeTemplateId: curvaTmpl.id,
              valueText: def.curva,
            },
          ],
        },
      },
    });
    console.log(`[seed] component: ${def.sku}`);
  }

  // 7. Regra + versão aprovada (idempotente por tenant+code)
  const ruleCode = 'regra-capacidade-maxima';
  const rule = await prisma.rule.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: ruleCode } },
    update: { name: 'Capacidade máxima do quadro' },
    create: {
      tenantId: tenant.id,
      name: 'Capacidade máxima do quadro',
      code: ruleCode,
      status: 'ACTIVE',
      createdByUserId: user.id,
    },
  });

  const existingApproved = await prisma.ruleVersion.findFirst({
    where: { ruleId: rule.id, status: RuleVersionStatus.APPROVED },
  });

  if (!existingApproved) {
    const ruleVersion = await prisma.ruleVersion.create({
      data: {
        ruleId: rule.id,
        tenantId: tenant.id,
        versionNumber: 1,
        status: RuleVersionStatus.DRAFT,
        definition: {
          type: 'MAX_TOTAL_CURRENT',
          maxAmps: 200,
          message: 'Soma das correntes não pode exceder 200A',
        },
      },
    });

    await prisma.ruleVersion.update({
      where: { id: ruleVersion.id },
      data: {
        status: RuleVersionStatus.APPROVED,
        approvedByUserId: user.id,
        approvedAt: new Date(),
      },
    });
    console.log(`[seed] ruleVersion approved: ${ruleVersion.id}`);
  } else {
    console.log(`[seed] ruleVersion already approved: ${existingApproved.id}`);
  }

  // 8. CustomerAccount (idempotente por tenant+name via findFirst)
  const customerName = 'Cliente Industrial S.A.';
  const existingCustomer = await prisma.customerAccount.findFirst({
    where: { tenantId: tenant.id, name: customerName },
  });

  const customer =
    existingCustomer ??
    (await prisma.customerAccount.create({
      data: {
        tenantId: tenant.id,
        name: customerName,
        legalName: 'Cliente Industrial S.A.',
        taxId: '12.345.678/0001-90',
        isActive: true,
      },
    }));
  console.log(`[seed] customer: ${customer.id} (${customer.name})`);

  console.log('\n[seed] CREDENCIAIS DE TESTE');
  console.log(`  tenantId: ${tenant.id}`);
  console.log(`  userId:   ${user.id}`);
  console.log(`  email:    ${adminEmail}`);
  console.log(`  password: ${adminPassword}`);
  console.log(`  roleCode: ${adminRoleCode}`);
}

main()
  .catch((e) => {
    console.error('[seed] erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
