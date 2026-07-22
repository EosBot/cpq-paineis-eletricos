// @ts-nocheck
import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve ter método $transactionWithRLS', () => {
    expect(typeof service.$transactionWithRLS).toBe('function');
  });

  it('deve ter método setTenantContext', () => {
    expect(typeof service.setTenantContext).toBe('function');
  });
});
