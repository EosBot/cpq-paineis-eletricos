import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StructuredLogger } from '../common/logging/structured.logger';
import { type ITenantContext } from '../tenancy/tenant-context';
import { type AuditQueryDto } from './dto/audit-query.dto';

export interface IAuditListResult {
  items: unknown[];
  total: number;
  limit: number;
  offset: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new StructuredLogger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async list(tenantContext: ITenantContext, query: AuditQueryDto): Promise<IAuditListResult> {
    const where = {
      tenantId: tenantContext.tenantId,
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.action ? { action: query.action } : {}),
      ...(query.correlationId ? { correlationId: query.correlationId } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: query.offset,
        take: query.limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    this.logger.log('Audit log listed', {
      entityType: query.entityType,
      resultCount: items.length,
      total,
    });

    return { items, total, limit: query.limit, offset: query.offset };
  }
}
