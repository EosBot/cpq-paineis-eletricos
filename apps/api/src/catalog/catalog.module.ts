import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComponentCategoriesController } from './component-categories.controller';
import { ComponentsController } from './components.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [PrismaModule],
  controllers: [ComponentCategoriesController, ComponentsController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
