import { Injectable } from '@nestjs/common';
import { Prisma, type AttributeValueType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { type ITenantContext } from '../tenancy/tenant-context';
import { getTenantContextFromStorage } from '../tenancy/tenant-context.storage';
import { CreateComponentCategoryDto } from './dto/create-component-category.dto';
import { CreateComponentDto } from './dto/create-component.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComponentCategory(
    tenantContext: ITenantContext,
    dto: CreateComponentCategoryDto,
  ) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    return this.prismaService.componentCategory.create({
      data: {
        tenantId: tenantContext.tenantId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        attributeTemplates: {
          create: dto.attributeTemplates.map((template, index) => ({
            tenantId: tenantContext.tenantId,
            name: template.name,
            code: template.code,
            valueType: template.valueType,
            isRequired: template.isRequired,
            unit: template.unit,
            sortOrder: template.sortOrder ?? index,
          })),
        },
      },
      include: {
        attributeTemplates: true,
      },
    });
  }

  async listComponentCategories(tenantContext: ITenantContext) {
    return this.prismaService.componentCategory.findMany({
      where: {
        tenantId: tenantContext.tenantId,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        attributeTemplates: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  async createComponent(tenantContext: ITenantContext, dto: CreateComponentDto) {
    await this.prismaService.setTenantContext(tenantContext.tenantId);
    const componentCategory = await this.prismaService.componentCategory.findFirstOrThrow({
      where: {
        id: dto.componentCategoryId,
        tenantId: tenantContext.tenantId,
      },
      include: {
        attributeTemplates: true,
      },
    });

    const attributeTemplateMap = new Map(
      componentCategory.attributeTemplates.map((template) => [template.id, template]),
    );

    const attributeCreates = dto.attributes.map((attribute) => {
      const template = attributeTemplateMap.get(attribute.componentAttributeTemplateId);

      if (!template) {
        throw new Error('Attribute template does not belong to the selected category.');
      }

      return {
        tenantId: tenantContext.tenantId,
        componentAttributeTemplateId: template.id,
        ...this.mapAttributeValue(template.valueType, attribute.value),
      };
    });

    return this.prismaService.component.create({
      data: {
        tenantId: tenantContext.tenantId,
        componentCategoryId: dto.componentCategoryId,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        attributes: {
          create: attributeCreates,
        },
      },
      include: {
        componentCategory: true,
        attributes: {
          include: {
            componentAttributeTemplate: true,
          },
        },
      },
    });
  }

  async listComponents(tenantContext: ITenantContext) {
    return this.prismaService.component.findMany({
      where: {
        tenantId: tenantContext.tenantId,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        componentCategory: true,
        attributes: {
          include: {
            componentAttributeTemplate: true,
          },
        },
      },
    });
  }

  private mapAttributeValue(valueType: AttributeValueType, value: string) {
    switch (valueType) {
      case 'TEXT':
        return { valueText: value };
      case 'INTEGER':
        return { valueInteger: Number.parseInt(value, 10) };
      case 'DECIMAL':
        return { valueDecimal: new Prisma.Decimal(value) };
      case 'BOOLEAN':
        return { valueBoolean: value === 'true' };
      case 'DATE':
        return { valueDate: new Date(value) };
      default: {
        const exhaustiveCheck: never = valueType;
        throw new Error(`Unsupported attribute value type: ${exhaustiveCheck}`);
      }
    }
  }
}
