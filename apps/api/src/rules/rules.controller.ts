import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
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
  createRule(@TenantContext() tenantContext: ITenantContext, @Body() dto: CreateRuleDto) {
    return this.rulesService.createRule(tenantContext, dto);
  }

  @Post('versions')
  @Roles('admin', 'engineer')
  createRuleVersion(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: CreateRuleVersionDto,
  ) {
    return this.rulesService.createRuleVersion(tenantContext, dto);
  }

  @Post('versions/approve')
  @Roles('admin')
  approveRuleVersion(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: ApproveRuleVersionDto,
  ) {
    return this.rulesService.approveRuleVersion(tenantContext, dto);
  }

  @Get()
  @Roles('admin', 'engineer', 'sales')
  listRules(@TenantContext() tenantContext: ITenantContext) {
    return this.rulesService.listRules(tenantContext);
  }
}
