import { assertTenantContext, type ITenantContext } from './tenant-context';
import { isTenantScopedModel } from './tenant-scope-registry';

type PrismaOperation =
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'findMany'
  | 'count'
  | 'aggregate'
  | 'groupBy'
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateMany'
  | 'upsert'
  | 'delete'
  | 'deleteMany';

export interface IPrismaQueryParams {
  model?: string;
  operation: PrismaOperation;
  args?: Record<string, unknown>;
}

interface IWhereInput {
  AND?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function withTenantWhere(
  where: Record<string, unknown> | undefined,
  tenantId: string,
): IWhereInput {
  if (!where) {
    return { tenantId };
  }

  if (where.tenantId !== undefined) {
    return where as IWhereInput;
  }

  return {
    AND: [{ tenantId }, where],
  };
}

function withTenantData(
  data: unknown,
  tenantId: string,
): unknown {
  if (Array.isArray(data)) {
    return data.map((entry) => withTenantData(entry, tenantId));
  }

  if (!isObject(data)) {
    return data;
  }

  if ('tenantId' in data) {
    return data;
  }

  return {
    ...data,
    tenantId,
  };
}

export function applyTenantScope(
  params: IPrismaQueryParams,
  tenantContext: ITenantContext | null | undefined,
): IPrismaQueryParams {
  const tenant = assertTenantContext(tenantContext);

  if (!params.model || !isTenantScopedModel(params.model)) {
    return params;
  }

  const args = params.args ?? {};

  switch (params.operation) {
    case 'findUnique':
    case 'findUniqueOrThrow':
    case 'findFirst':
    case 'findFirstOrThrow':
    case 'findMany':
    case 'count':
    case 'aggregate':
    case 'groupBy':
    case 'update':
    case 'updateMany':
    case 'delete':
    case 'deleteMany':
      return {
        ...params,
        args: {
          ...args,
          where: withTenantWhere(
            isObject(args.where) ? args.where : undefined,
            tenant.tenantId,
          ),
        },
      };

    case 'create':
      return {
        ...params,
        args: {
          ...args,
          data: withTenantData(args.data, tenant.tenantId),
        },
      };

    case 'createMany':
      return {
        ...params,
        args: {
          ...args,
          data: withTenantData(args.data, tenant.tenantId),
        },
      };

    case 'upsert':
      return {
        ...params,
        args: {
          ...args,
          where: withTenantWhere(
            isObject(args.where) ? args.where : undefined,
            tenant.tenantId,
          ),
          create: withTenantData(args.create, tenant.tenantId),
          update: withTenantData(args.update, tenant.tenantId),
        },
      };

    default:
      return params;
  }
}
