import { Injectable, NotFoundException } from '@nestjs/common';
import { Plan, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlanDto): Promise<Plan> {
    return this.prisma.plan.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        priceMonthly: dto.priceMonthly,
        priceYearly: dto.priceYearly,
        currency: dto.currency ?? 'BRL',
        features: dto.features,
        limits: dto.limits,
        isPublic: dto.isPublic ?? true,
        stripePriceIdMonthly: dto.stripePriceIdMonthly,
        stripePriceIdYearly: dto.stripePriceIdYearly,
      },
    });
  }

  async findAll(includePrivate = false): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      where: includePrivate ? {} : { isPublic: true, isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found.');
    return plan;
  }

  async findByCode(code: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({ where: { code } });
  }

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    await this.findOne(id);

    return this.prisma.plan.update({
      where: { id },
      data: {
        ...dto,
        features: dto.features ?? undefined,
        limits: dto.limits ?? undefined,
      },
    });
  }

  async remove(id: string): Promise<Plan> {
    await this.findOne(id);
    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
