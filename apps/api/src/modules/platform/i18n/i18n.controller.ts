import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../auth/roles.decorator';
import { RolesGuard } from '../../../auth/roles.guard';
import { TenantContext } from '../../../tenancy/tenant-context.decorator';
import { type ITenantContext } from '../../../tenancy/tenant-context';
import { I18nService } from './i18n.service';

@Controller('i18n')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('locales')
  @Roles('admin', 'engineer', 'sales')
  getLocales(@TenantContext() tc: ITenantContext) {
    return {
      locales: this.i18nService.getSupportedLocales(),
      default: this.i18nService.getDefaultLocale(),
    };
  }

  @Get('translations/:locale')
  @Roles('admin', 'engineer', 'sales')
  getTranslations(@TenantContext() tc: ITenantContext, @Param('locale') locale: string) {
    return this.i18nService.getTranslations(locale);
  }
}
