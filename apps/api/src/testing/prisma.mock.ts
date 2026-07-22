import { PrismaService } from '../prisma/prisma.service';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P];
};

export type PrismaMock = {
  [K in keyof PrismaService]: PrismaService[K] extends (...args: infer A) => infer R
    ? jest.Mock<R, A>
    : PrismaService[K];
};

export function createPrismaMock(overrides: DeepPartial<PrismaMock> = {}): PrismaMock {
  const models = [
    'user',
    'tenant',
    'membership',
    'role',
    'customerAccount',
    'customerContact',
    'commercialContract',
    'componentCategory',
    'componentAttributeTemplate',
    'component',
    'componentAttribute',
    'configuration',
    'configurationItem',
    'configurationSnapshot',
    'rule',
    'ruleVersion',
    'quote',
    'quoteVersion',
    'quoteVersionRule',
    'bOMVersion',
    'order',
    'shipment',
    'shippingQuote',
    'auditLog',
  ];

  const mock: Record<string, jest.Mock> = {};

  for (const model of models) {
    const delegate: Record<string, jest.Mock> = {};
    delegate.findUnique = jest.fn();
    delegate.findUniqueOrThrow = jest.fn();
    delegate.findFirst = jest.fn();
    delegate.findFirstOrThrow = jest.fn();
    delegate.findMany = jest.fn();
    delegate.create = jest.fn();
    delegate.createMany = jest.fn();
    delegate.update = jest.fn();
    delegate.updateMany = jest.fn();
    delegate.delete = jest.fn();
    delegate.deleteMany = jest.fn();
    delegate.count = jest.fn();
    delegate.aggregate = jest.fn();
    delegate.groupBy = jest.fn();
    delegate.upsert = jest.fn();
    mock[model] = delegate as unknown as jest.Mock;
  }

  mock['$transaction'] = jest.fn().mockImplementation(async (callback) => {
    const tx = {
      ...Object.fromEntries(
        models.map((m) => [m, mock[m]])
      ),
      '$executeRaw': jest.fn(),
      '$queryRaw': jest.fn(),
    };
    return callback(tx);
  });
  mock['$transactionWithRLS'] = jest.fn().mockImplementation(async (_tenantId, callback) => {
    const tx = {
      ...Object.fromEntries(
        models.map((m) => [m, mock[m]])
      ),
      '$executeRaw': jest.fn(),
      '$queryRaw': jest.fn(),
    };
    return callback(tx);
  });
  mock['$connect'] = jest.fn();
  mock['$disconnect'] = jest.fn();
  mock['$use'] = jest.fn();
  mock['$executeRaw'] = jest.fn();
  mock['$queryRaw'] = jest.fn();
  mock['setTenantContext'] = jest.fn();

  return { ...mock, ...overrides } as unknown as PrismaMock;
}
