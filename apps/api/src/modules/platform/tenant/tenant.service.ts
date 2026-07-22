import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantBranding } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateBrandingDto } from './dto/update-branding.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getBranding(tenantId: string): Promise<TenantBranding> {
    const branding = await this.prisma.tenantBranding.findUnique({
      where: { tenantId },
    });

    if (!branding) {
      return this.prisma.tenantBranding.create({
        data: { tenantId },
      });
    }

    return branding;
  }

  async updateBranding(
    tenantId: string,
    dto: UpdateBrandingDto,
  ): Promise<TenantBranding> {
    await this.getBranding(tenantId);

    if (dto.customDomain) {
      const existing = await this.prisma.tenantBranding.findFirst({
        where: {
          customDomain: dto.customDomain,
          tenantId: { not: tenantId },
        },
      });
      if (existing) {
        throw new BadRequestException('Domain already in use by another tenant.');
      }
    }

    return this.prisma.tenantBranding.update({
      where: { tenantId },
      data: {
        logoUrl: dto.logoUrl,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
        faviconUrl: dto.faviconUrl,
        customDomain: dto.customDomain,
        domainVerified: dto.customDomain ? false : undefined,
      },
    });
  }

  async verifyDomain(tenantId: string, domain: string): Promise<boolean> {
    const branding = await this.getBranding(tenantId);
    const expectedCname =
      this.configService.get<string>('PLATFORM_DOMAIN') ??
      'platform.cpqpaineis.com.br';

    if (branding.customDomain !== domain) {
      throw new BadRequestException('Domain does not match tenant configuration.');
    }

    let verified = false;
    try {
      const dns = await import('node:dns/promises');
      const records = await dns.resolveCname(domain);
      verified = records.includes(expectedCname);
    } catch {
      verified = false;
    }

    await this.prisma.tenantBranding.update({
      where: { tenantId },
      data: { domainVerified: verified },
    });

    return verified;
  }

  async resolveTenantByDomain(domain: string): Promise<{
    tenantId: string;
    branding: TenantBranding;
  } | null> {
    const branding = await this.prisma.tenantBranding.findFirst({
      where: { customDomain: domain, domainVerified: true },
    });

    if (!branding) return null;

    return {
      tenantId: branding.tenantId,
      branding,
    };
  }
}
