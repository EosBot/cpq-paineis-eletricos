export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3001',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? '',
  API_BASE_URL: process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1',
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'CPQ Painéis',
};
