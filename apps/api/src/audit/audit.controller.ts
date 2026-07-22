import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({
    summary: 'Lista registros de auditoria do tenant (mais recentes primeiro)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de registros de auditoria.',
  })
  list(@TenantContext() tenantContext: ITenantContext, @Query() query: AuditQueryDto) {
    return this.auditService.list(tenantContext, query);
  }
}
