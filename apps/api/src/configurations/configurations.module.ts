import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigurationsController } from './configurations.controller';
import { ConfigurationsService } from './configurations.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
