import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/marketplace.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(tc: ITenantContext) {
    return this.prisma.category.findMany({
      where: { tenantId: tc.tenantId },
      orderBy: { name: 'asc' },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { products: true, children: true } },
      },
    });
  }

  async getById(tc: ITenantContext, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, tenantId: tc.tenantId },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(tc: ITenantContext, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        tenantId: tc.tenantId,
        name: dto.name,
        slug: this.slugify(dto.name),
        parentId: dto.parentId,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(tc: ITenantContext, id: string, dto: UpdateCategoryDto) {
    await this.getById(tc, id);
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.name ? this.slugify(dto.name) : undefined,
        parentId: dto.parentId,
        isActive: dto.isActive,
      },
    });
  }

  async remove(tc: ITenantContext, id: string) {
    await this.getById(tc, id);
    return this.prisma.category.delete({ where: { id } });
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
