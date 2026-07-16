import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { createTenantContext } from '../tenancy/tenant-context';
import { BomService } from './bom.service';
import { GenerateBomVersionDto } from './dto/generate-bom-version.dto';

@Controller('bom')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Post('versions')
  @Roles('admin', 'engineer', 'sales')
  generate(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: GenerateBomVersionDto,
  ) {
    return this.bomService.generateBomVersion(createTenantContext(tenantId, userId), dto);
  }

  @Get('versions')
  @Roles('admin', 'engineer', 'sales')
  list(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Query('quoteId') quoteId?: string,
  ) {
    return this.bomService.listBomVersions(createTenantContext(tenantId, userId), quoteId);
  }
}
