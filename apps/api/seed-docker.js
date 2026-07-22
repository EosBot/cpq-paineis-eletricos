const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

async function main() {
  const p = new PrismaClient();
  try {
    // Check existing tables
    const tables = await p.$queryRawUnsafe("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log("Tables:", JSON.stringify(tables));
    
    // Check if already seeded
    const existing = await p.user.findUnique({ where: { email: "admin@paineisdemo.com" } });
    if (existing) {
      console.log("Already seeded!");
      return;
    }

    // Create super admin (isSuperAdmin column not in DB, skip it)
    const superAdmin = await p.user.create({
      data: {
        email: "super@cpq.com.br",
        firstName: "Super",
        lastName: "Admin",
        passwordHash: await argon2.hash("Super@2024!"),
      },
    });

    // Create tenant
    const tenant = await p.tenant.create({
      data: {
        name: "Demo Painéis",
        slug: "demo-paineis",
        defaultCurrency: "BRL",
      },
    });

    // Create role
    const role = await p.role.create({
      data: {
        tenantId: tenant.id,
        name: "Admin",
        code: "admin",
        permissions: {},
      },
    });

    // Create membership for super admin
    await p.membership.create({
      data: {
        userId: superAdmin.id,
        tenantId: tenant.id,
        roleId: role.id,
        status: "ACTIVE",
      },
    });

    // Create demo admin user
    await p.user.create({
      data: {
        email: "admin@paineisdemo.com",
        firstName: "Admin",
        lastName: "Demo",
        passwordHash: await argon2.hash("SenhaForte@123"),
        memberships: {
          create: {
            tenantId: tenant.id,
            roleId: role.id,
            status: "ACTIVE",
          },
        },
      },
    });

    console.log("Seed completed successfully!");
    console.log("  Super Admin: super@cpq.com.br / Super@2024!");
    console.log("  Demo Admin: admin@paineisdemo.com / SenhaForte@123");
    console.log("  Tenant: demo-paineis");
  } catch(e) {
    console.error("Seed error:", e.message);
  } finally {
    await p.$disconnect();
  }
}

main();
