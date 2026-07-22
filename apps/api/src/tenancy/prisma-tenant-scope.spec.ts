// @ts-nocheck
import { applyTenantScope } from './prisma-tenant-scope';
import { createTenantContext } from './tenant-context';

describe('applyTenantScope', () => {
  const tenantContext = createTenantContext('tenant-123', 'user-456');

  it('deve injetar tenantId em findMany', () => {
    const params = {
      model: 'Quote',
      action: 'findMany',
      args: {},
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { where: { tenantId: string } };
    };

    expect(result.args.where.tenantId).toBe('tenant-123');
  });

  it('deve injetar tenantId em findFirst', () => {
    const params = {
      model: 'Quote',
      action: 'findFirst',
      args: { where: { status: 'DRAFT' } },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { where: { AND: Array<Record<string, unknown>> } };
    };

    expect(result.args.where.AND).toEqual([
      { tenantId: 'tenant-123' },
      { status: 'DRAFT' },
    ]);
  });

  it('deve injetar tenantId em findUnique', () => {
    const params = {
      model: 'Quote',
      action: 'findUnique',
      args: { where: { id: 'quote-1' } },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { where: { id: string; tenantId: string } };
    };

    expect(result.args.where.tenantId).toBe('tenant-123');
    expect(result.args.where.id).toBe('quote-1');
  });

  it('deve injetar tenantId em create', () => {
    const params = {
      model: 'Quote',
      action: 'create',
      args: { data: { title: 'Test', quoteNumber: 'Q-001' } },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { data: { title: string; tenantId: string } };
    };

    expect(result.args.data.tenantId).toBe('tenant-123');
  });

  it('deve injetar tenantId em update', () => {
    const params = {
      model: 'Quote',
      action: 'update',
      args: {
        where: { id: 'quote-1' },
        data: { status: 'CALCULATED' },
      },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { where: { id: string; tenantId: string } };
    };

    expect(result.args.where.tenantId).toBe('tenant-123');
  });

  it('deve injetar tenantId em upsert', () => {
    const params = {
      model: 'Quote',
      action: 'upsert',
      args: {
        where: { id: 'quote-1' },
        create: { title: 'Test' },
        update: { status: 'CALCULATED' },
      },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: {
        where: { tenantId: string };
        create: { tenantId: string };
        update: { tenantId: string };
      };
    };

    expect(result.args.where.tenantId).toBe('tenant-123');
    expect(result.args.create.tenantId).toBe('tenant-123');
    expect(result.args.update.tenantId).toBe('tenant-123');
  });

  it('deve injetar tenantId em delete', () => {
    const params = {
      model: 'Quote',
      action: 'delete',
      args: { where: { id: 'quote-1' } },
    };

    const result = applyTenantScope(params, tenantContext) as {
      args: { where: { id: string; tenantId: string } };
    };

    expect(result.args.where.tenantId).toBe('tenant-123');
  });

  it('deve injetar tenantId em count e aggregate', () => {
    for (const action of ['count', 'aggregate', 'groupBy']) {
      const params = {
        model: 'Quote',
        action,
        args: {},
      };

      const result = applyTenantScope(params, tenantContext) as {
        args: { where: { tenantId: string } };
      };

      expect(result.args.where.tenantId).toBe('tenant-123');
    }
  });

  it('deve pular modelos não tenant-scoped (User)', () => {
    const params = {
      model: 'User',
      action: 'findMany',
      args: {},
    };

    const result = applyTenantScope(params, tenantContext);

    expect(result).toEqual(params);
  });

  it('deve preservar tenantId existente no where (não duplicar)', () => {
    const params = {
      model: 'Quote',
      action: 'findFirst',
      args: { where: { tenantId: 'existing-tenant', status: 'DRAFT' } },
    };

    const result = applyTenantScope(params, tenantContext);

    expect(result).toEqual(params);
  });

  it('deve lançar erro quando tenant context é nulo para modelo scoped', () => {
    const params = {
      model: 'Quote',
      action: 'findMany',
      args: {},
    };

    expect(() => applyTenantScope(params, null)).toThrow(
      'Tenant context is required.',
    );
  });
});
