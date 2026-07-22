import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { TenantService } from './tenant.service';
import { UpdateBrandingDto, VerifyDomainDto } from './dto/update-branding.dto';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('branding')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'engineer', 'sales')
  getBranding(@TenantContext() tc: ITenantContext) {
    return this.tenantService.getBranding(tc.tenantId);
  }

  @Patch('branding')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  updateBranding(@TenantContext() tc: ITenantContext, @Body() dto: UpdateBrandingDto) {
    return this.tenantService.updateBranding(tc.tenantId, dto);
  }

  @Post('verify-domain')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  verifyDomain(@TenantContext() tc: ITenantContext, @Body() dto: VerifyDomainDto) {
    return this.tenantService.verifyDomain(tc.tenantId, dto.domain);
  }

  @Get('by-domain/:domain')
  resolveByDomain(@Param('domain') domain: string) {
    return this.tenantService.resolveTenantByDomain(domain);
  }
}
