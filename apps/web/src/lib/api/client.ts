import { env } from '@/lib/env';
import type { ApiError } from './types';

interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

class ApiClient {
  private accessToken: string | null = null;
  private tenantId: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  setTenantId(id: string | null) {
    this.tenantId = id;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const baseUrl = env.API_BASE_URL.startsWith('http')
      ? env.API_BASE_URL
      : typeof window !== 'undefined'
        ? ''
        : 'http://localhost:3000';
    const url = new URL(path.startsWith('http') ? path : `${baseUrl}${env.API_BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private buildHeaders(config?: RequestConfig): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }
    if (this.tenantId) {
      headers.set('X-Tenant-ID', this.tenantId);
    }
    if (config?.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
        error: 'Unknown error',
      }));

      if (response.status === 401) {
        const event = new CustomEvent('api:unauthorized');
        window.dispatchEvent(event);
      }

      throw error;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(path, config?.params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(config),
      signal: config?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(path, config?.params);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(config),
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(path, config?.params);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.buildHeaders(config),
      body: data ? JSON.stringify(data) : undefined,
      signal: config?.signal,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    const url = this.buildUrl(path, config?.params);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.buildHeaders(config),
      signal: config?.signal,
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient();
