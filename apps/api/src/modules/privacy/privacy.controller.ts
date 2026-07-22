import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantContext } from '../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { PrivacyService } from './privacy.service';

@Controller('privacy')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('config')
  @Roles('admin')
  getPrivacyConfig(@TenantContext() tc: ITenantContext) {
    return this.privacyService.getPrivacyConfig(tc);
  }

  @Patch('config')
  @Roles('admin')
  updatePrivacyConfig(@TenantContext() tc: ITenantContext, @Body() data: Record<string, unknown>) {
    return this.privacyService.updatePrivacyConfig(tc, data as any);
  }

  @Get('consents')
  getMyConsents(@TenantContext() tc: ITenantContext, @Req() req: any) {
    return this.privacyService.getUserConsents(tc, req.user.sub);
  }

  @Post('consents')
  grantConsent(@TenantContext() tc: ITenantContext, @Body() data: { purpose: string; purposeDescription: string; legalBasis: string }, @Req() req: any) {
    return this.privacyService.grantConsent(tc, { ...data, userId: req.user.sub });
  }

  @Patch('consents/:id/revoke')
  revokeConsent(@TenantContext() tc: ITenantContext, @Param('id') id: string) {
    return this.privacyService.revokeConsent(tc, id);
  }

  @Post('data-request')
  createDataSubjectRequest(
    @TenantContext() tc: ITenantContext,
    @Body() data: { requestType: string; description?: string },
    @Req() req: any,
  ) {
    return this.privacyService.createDataSubjectRequest(tc, { ...data, userId: req.user.sub });
  }

  @Get('data-requests')
  @Roles('admin')
  getDataRequests(@TenantContext() tc: ITenantContext) {
    return this.privacyService.getDataSubjectRequests(tc);
  }

  @Patch('data-requests/:id/fulfill')
  @Roles('admin')
  fulfillDataRequest(@TenantContext() tc: ITenantContext, @Param('id') id: string, @Body() data: { status: string; responseNotes?: string }) {
    return this.privacyService.fulfillDataSubjectRequest(tc, id, data);
  }

  @Get('export-data')
  exportUserData(@TenantContext() tc: ITenantContext, @Req() req: any) {
    return this.privacyService.exportUserData(tc, req.user.sub);
  }

  @Post('delete-data')
  deleteUserData(@TenantContext() tc: ITenantContext, @Body() data: { anonymize: boolean }, @Req() req: any) {
    return this.privacyService.deleteUserData(tc, req.user.sub, data.anonymize);
  }

  @Get('audit-logs')
  @Roles('admin')
  getAuditLogs(@TenantContext() tc: ITenantContext, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.privacyService.getPrivacyAuditLogs(tc, page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
  }
}
