import { assertTenantContext, type ITenantContext } from './tenant-context';
import { isTenantScopedModel } from './tenant-scope-registry';
import type { PrismaClient } from '@prisma/client';

type PrismaMiddlewareParams = Parameters<
  Parameters<PrismaClient['$use']>[0]
>[0];

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

function toQueryParams(params: PrismaMiddlewareParams): IPrismaQueryParams {
  return {
    model: params.model,
    operation: params.action as PrismaOperation,
    args: params.args as Record<string, unknown> | undefined,
  };
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

// Para WhereUniqueInput (findUnique/OrThrow, update/delete único, upsert) a
// chave (id ou unique composto) deve ficar no NÍVEL SUPERIOR. O wrapper AND
// de withTenantWhere é INVÁLIDO para esses inputs. Mesclamos tenantId no
// nível superior, preservando o isolamento multi-tenant (fail-closed).
function withTenantUniqueWhere(
  where: Record<string, unknown> | undefined,
  tenantId: string,
): Record<string, unknown> {
  if (!where) {
    return { tenantId };
  }

  if (where.tenantId !== undefined) {
    return where;
  }

  return {
    ...where,
    tenantId,
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
  params: PrismaMiddlewareParams,
  tenantContext: ITenantContext | null | undefined,
): PrismaMiddlewareParams {
  const query = toQueryParams(params);

  // Modelos não tenant-scoped (ex.: User — a camada de identidade/diretório)
  // são acessíveis sem contexto de tenant. O isolamento multi-tenant é
  // aplicado SOMENTE a modelos scoped, que EXIGEM contexto de tenant
  // (fail-closed). Isso também permite que fluxos de autenticação não
  // autenticados (login/refresh) leiam o registro de User.
  if (!query.model || !isTenantScopedModel(query.model)) {
    return params;
  }

  const tenant = assertTenantContext(tenantContext);

  const args = query.args ?? {};

  switch (query.operation) {
    // Operações com WhereInput: o wrapper AND é válido e preserva o
    // isolamento multi-tenant (fail-closed).
    case 'findFirst':
    case 'findFirstOrThrow':
    case 'findMany':
    case 'count':
    case 'aggregate':
    case 'groupBy':
    case 'updateMany':
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

    // Operações com WhereUniqueInput (findUnique/OrThrow, update/delete
    // único, upsert): a chave (id ou unique composto) deve ficar no NÍVEL
    // SUPERIOR. O wrapper AND de withTenantWhere é INVÁLIDO para esses
    // inputs e quebra a chamada. Mesclamos tenantId no nível superior,
    // preservando o isolamento (fail-closed).
    case 'findUnique':
    case 'findUniqueOrThrow':
    case 'update':
    case 'delete':
    case 'upsert':
      return {
        ...params,
        args: {
          ...args,
          where: withTenantUniqueWhere(
            isObject(args.where) ? args.where : undefined,
            tenant.tenantId,
          ),
          ...(query.operation === 'upsert'
            ? {
                create: withTenantData(args.create, tenant.tenantId),
                update: withTenantData(args.update, tenant.tenantId),
              }
            : {}),
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

    default:
      return params;
  }
}
