import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats() {
    const [tenants, users, components, configurations, quotes, orders] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.user.count(),
      this.prisma.component.count(),
      this.prisma.configuration.count(),
      this.prisma.quote.count(),
      this.prisma.order.count(),
    ]);

    return { tenants, users, components, configurations, quotes, orders };
  }

  async getTenants(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              memberships: true,
              components: true,
              configurations: true,
              quotes: true,
            },
          },
          privacyConfig: {
            select: {
              dpoName: true,
              dpoEmail: true,
              lgpdComplianceEnabled: true,
            },
          },
        },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      data: tenants,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getTenantDetails(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        memberships: {
          include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true, isActive: true } },
            role: { select: { id: true, name: true, code: true } },
          },
        },
        _count: {
          select: {
            components: true,
            configurations: true,
            quotes: true,
            orders: true,
            products: true,
            inventoryItems: true,
          },
        },
        privacyConfig: true,
      },
    });
  }

  async createTenant(data: { name: string; slug: string; defaultCurrency?: string }) {
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        defaultCurrency: data.defaultCurrency ?? 'BRL',
      },
    });
  }

  async toggleTenantActive(tenantId: string, isActive: boolean) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { memberships: true },
    });
    if (!tenant) return null;

    for (const membership of tenant.memberships) {
      await this.prisma.user.update({
        where: { id: membership.userId },
        data: { isActive },
      });
    }

    return { tenantId, isActive, affectedUsers: tenant.memberships.length };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          isSuperAdmin: true,
          createdAt: true,
          memberships: {
            include: {
              tenant: { select: { id: true, name: true, slug: true } },
              role: { select: { id: true, name: true, code: true } },
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async toggleUserActive(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
}
