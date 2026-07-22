import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { UpdateBrandingDto, VerifyDomainDto } from './dto/update-branding.dto';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('branding')
  getBranding(@Query('tenantId') tenantId: string) {
    return this.tenantService.getBranding(tenantId);
  }

  @Patch('branding')
  updateBranding(
    @Query('tenantId') tenantId: string,
    @Body() dto: UpdateBrandingDto,
  ) {
    return this.tenantService.updateBranding(tenantId, dto);
  }

  @Post('verify-domain')
  verifyDomain(@Body() dto: VerifyDomainDto & { tenantId: string }) {
    return this.tenantService.verifyDomain(dto.tenantId, dto.domain);
  }

  @Get('by-domain/:domain')
  resolveByDomain(@Param('domain') domain: string) {
    return this.tenantService.resolveTenantByDomain(domain);
  }
}
