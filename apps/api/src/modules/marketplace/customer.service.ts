import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { type ITenantContext } from '../../tenancy/tenant-context';
import { CreateCustomerDto } from './dto/marketplace.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(tc: ITenantContext, filters?: { search?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId: tc.tenantId };
    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data: customers, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getById(tc: ITenantContext, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId: tc.tenantId },
      include: {
        orders: { orderBy: { createdAt: 'desc' }, take: 10 },
        cart: true,
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(tc: ITenantContext, dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findFirst({
      where: { tenantId: tc.tenantId, email: dto.email },
    });
    if (existing) throw new ConflictException('Customer with this email already exists');

    return this.prisma.customer.create({
      data: {
        tenantId: tc.tenantId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        taxId: dto.taxId,
        address: dto.address,
      },
    });
  }

  async register(dto: CreateCustomerDto, tenantId: string) {
    const existing = await this.prisma.customer.findFirst({
      where: { tenantId, email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    return this.prisma.customer.create({
      data: {
        tenantId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        taxId: dto.taxId,
        address: dto.address,
      },
    });
  }

  async update(tc: ITenantContext, id: string, dto: Partial<CreateCustomerDto>) {
    await this.getById(tc, id);
    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(tc: ITenantContext, id: string) {
    await this.getById(tc, id);
    return this.prisma.customer.delete({ where: { id } });
  }
}
