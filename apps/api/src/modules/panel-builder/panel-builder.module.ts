import { Module } from '@nestjs/common';
import { PanelBuilderService } from './panel-builder.service';
import { PanelBuilderController } from './panel-builder.controller';
import { BuilderIntegrationService } from './builder-integration.service';
import { BuilderIntegrationController } from './builder-integration.controller';

@Module({
  controllers: [PanelBuilderController, BuilderIntegrationController],
  providers: [PanelBuilderService, BuilderIntegrationService],
  exports: [PanelBuilderService, BuilderIntegrationService],
})
export class PanelBuilderModule {}
