import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { applyTenantScope } from '../tenancy/prisma-tenant-scope';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$use(async (params, next) => {
      const tenantContext = getTenantContextFromStorage();
      return next(applyTenantScope(params, tenantContext));
    });
  }

  async $transactionWithRLS<T>(
    tenantId: string,
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
      return callback(tx);
    });
  }

  async setTenantContext(tenantId: string): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
  }
}
