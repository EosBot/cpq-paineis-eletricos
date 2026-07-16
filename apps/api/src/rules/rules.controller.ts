import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { ApproveRuleVersionDto } from './dto/approve-rule-version.dto';
import { CreateRuleDto } from './dto/create-rule.dto';
import { CreateRuleVersionDto } from './dto/create-rule-version.dto';
import { RulesService } from './rules.service';

@Controller('rules')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @Roles('admin', 'engineer')
  createRule(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateRuleDto,
  ) {
    return this.rulesService.createRule(createTenantContext(tenantId, userId), dto);
  }

  @Post('versions')
  @Roles('admin', 'engineer')
  createRuleVersion(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateRuleVersionDto,
  ) {
    return this.rulesService.createRuleVersion(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Post('versions/approve')
  @Roles('admin')
  approveRuleVersion(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: ApproveRuleVersionDto,
  ) {
    return this.rulesService.approveRuleVersion(
      createTenantContext(tenantId, userId),
      dto,
    );
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  listRules(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.rulesService.listRules(createTenantContext(tenantId, userId));
  }
}
