import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { CreateProductDto, UpdateProductDto } from './dto/marketplace.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(tc: ITenantContext, filters?: { categoryId?: string; type?: string; search?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId: tc.tenantId, isActive: true };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.type) where.type = filters.type;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { cartItems: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: products, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getBySlug(tc: ITenantContext, slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { tenantId: tc.tenantId, slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getById(tc: ITenantContext, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId: tc.tenantId },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(tc: ITenantContext, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        tenantId: tc.tenantId,
        name: dto.name,
        slug: dto.slug || this.slugify(dto.name),
        description: dto.description,
        type: dto.type || 'STANDARD',
        price: dto.price,
        categoryId: dto.categoryId,
        metadata: dto.metadata as Prisma.InputJsonValue,
        cpqTemplate: dto.cpqTemplate as Prisma.InputJsonValue,
        sku: dto.slug || this.slugify(dto.name),
      },
    });
  }

  async update(tc: ITenantContext, id: string, dto: UpdateProductDto) {
    await this.getById(tc, id);
    const { metadata, cpqTemplate, ...rest } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        slug: dto.slug || (dto.name ? this.slugify(dto.name) : undefined),
        metadata: metadata as Prisma.InputJsonValue,
        cpqTemplate: cpqTemplate as Prisma.InputJsonValue,
      },
    });
  }

  async remove(tc: ITenantContext, id: string) {
    await this.getById(tc, id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
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
