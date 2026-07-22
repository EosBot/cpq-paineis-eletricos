import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantContext } from '../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../tenancy/tenant-context';
import { BomService } from './bom.service';
import { GenerateBomVersionDto } from './dto/generate-bom-version.dto';

@Controller('bom')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Post('versions')
  @Roles('admin', 'engineer', 'sales')
  generate(
    @TenantContext() tenantContext: ITenantContext,
    @Body() dto: GenerateBomVersionDto,
  ) {
    return this.bomService.generateBomVersion(tenantContext, dto);
  }

  @Get('versions')
  @Roles('admin', 'engineer', 'sales')
  list(
    @TenantContext() tenantContext: ITenantContext,
    @Query('quoteId') quoteId?: string,
  ) {
    return this.bomService.listBomVersions(tenantContext, quoteId);
  }
}
