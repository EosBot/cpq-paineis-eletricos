import { Controller, Get, Param } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('locales')
  getLocales() {
    return {
      locales: this.i18nService.getSupportedLocales(),
      default: this.i18nService.getDefaultLocale(),
    };
  }

  @Get('translations/:locale')
  getTranslations(@Param('locale') locale: string) {
    return this.i18nService.getTranslations(locale);
  }
}
