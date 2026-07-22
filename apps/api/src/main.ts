import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { StructuredLogger } from './common/logging/structured.logger';

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

function validateEnv(): void {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function resolveCorsOrigins(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN;
  if (!raw) {
    return false;
  }
  const origins = raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  if (origins.length === 0) {
    return false;
  }
  return origins.length === 1 ? origins[0] : origins;
}

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CPQ Painéis Elétricos API')
    .setDescription(
      'API de Configure-Price-Quote para painéis elétricos (vertical validado).',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addServer('http://localhost:3000', 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}

async function bootstrap(): Promise<void> {
  validateEnv();

  const isProduction = process.env.NODE_ENV === 'production';
  const port = parseInt(process.env.PORT || '3000', 10);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(new StructuredLogger());

  app.setGlobalPrefix('api/v1');

  app.use(helmet());
  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();

  if (!isProduction) {
    setupSwagger(app);
  }

  await app.listen(port);
}

void bootstrap();
