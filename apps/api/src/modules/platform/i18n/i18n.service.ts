import { Injectable } from '@nestjs/common';

export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';

export interface TranslationMap {
  [key: string]: string | TranslationMap;
}

const TRANSLATIONS: Record<SupportedLocale, TranslationMap> = {
  'pt-BR': {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      search: 'Buscar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      confirm: 'Confirmar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
    },
    auth: {
      login: 'Entrar',
      logout: 'Sair',
      email: 'E-mail',
      password: 'Senha',
      forgotPassword: 'Esqueceu a senha?',
      invalidCredentials: 'Credenciais inválidas.',
    },
    subscription: {
      trial: 'Período de teste',
      active: 'Ativa',
      pastDue: 'Pagamento atrasado',
      canceled: 'Cancelada',
      upgrade: 'Fazer upgrade',
      currentPlan: 'Plano atual',
      daysRemaining: '{days} dias restantes',
      trialEnding: 'Seu período de teste termina em {days} dias.',
    },
    errors: {
      somethingWentWrong: 'Algo deu errado.',
      notFound: 'Não encontrado.',
      unauthorized: 'Não autorizado.',
      forbidden: 'Acesso negado.',
      validationError: 'Erro de validação.',
    },
  },
  'en-US': {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    auth: {
      login: 'Sign in',
      logout: 'Sign out',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      invalidCredentials: 'Invalid credentials.',
    },
    subscription: {
      trial: 'Trial period',
      active: 'Active',
      pastDue: 'Payment overdue',
      canceled: 'Canceled',
      upgrade: 'Upgrade',
      currentPlan: 'Current plan',
      daysRemaining: '{days} days remaining',
      trialEnding: 'Your trial ends in {days} days.',
    },
    errors: {
      somethingWentWrong: 'Something went wrong.',
      notFound: 'Not found.',
      unauthorized: 'Unauthorized.',
      forbidden: 'Access denied.',
      validationError: 'Validation error.',
    },
  },
  'es-ES': {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
    },
    auth: {
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidó su contraseña?',
      invalidCredentials: 'Credenciales inválidas.',
    },
    subscription: {
      trial: 'Período de prueba',
      active: 'Activa',
      pastDue: 'Pago vencido',
      canceled: 'Cancelada',
      upgrade: 'Mejorar',
      currentPlan: 'Plan actual',
      daysRemaining: '{days} días restantes',
      trialEnding: 'Tu período de prueba termina en {days} días.',
    },
    errors: {
      somethingWentWrong: 'Algo salió mal.',
      notFound: 'No encontrado.',
      unauthorized: 'No autorizado.',
      forbidden: 'Acceso denegado.',
      validationError: 'Error de validación.',
    },
  },
};

@Injectable()
export class I18nService {
  private readonly supportedLocales: SupportedLocale[] = [
    'pt-BR',
    'en-US',
    'es-ES',
  ];
  private readonly defaultLocale: SupportedLocale = 'pt-BR';

  getSupportedLocales(): SupportedLocale[] {
    return this.supportedLocales;
  }

  getDefaultLocale(): SupportedLocale {
    return this.defaultLocale;
  }

  supports(locale: string): locale is SupportedLocale {
    return this.supportedLocales.includes(locale as SupportedLocale);
  }

  translate(
    key: string,
    locale: SupportedLocale | string,
    params?: Record<string, string | number>,
  ): string {
    const effectiveLocale = this.supports(locale) ? locale : this.defaultLocale;
    const keys = key.split('.');
    let value: unknown = TRANSLATIONS[effectiveLocale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') return key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [paramKey, paramValue]) =>
          acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
        value,
      );
    }

    return value;
  }

  getTranslations(locale: SupportedLocale | string): TranslationMap {
    const effectiveLocale = this.supports(locale) ? locale : this.defaultLocale;
    return TRANSLATIONS[effectiveLocale];
  }
}
