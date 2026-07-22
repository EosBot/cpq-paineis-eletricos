import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { dump } from 'js-yaml';
import { AppModule } from '../src/app.module';

async function generate(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const config = new DocumentBuilder()
    .setTitle('CPQ Painéis Elétricos API')
    .setDescription('API de Configure-Price-Quote para painéis elétricos (vertical validado).')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addServer('http://localhost:3000', 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yaml = dump(document, { skipInvalid: true });
  const outPath = resolve(__dirname, '..', 'openapi.yaml');
  writeFileSync(outPath, yaml, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`OpenAPI YAML gerado em ${outPath}`);
  await app.close();
}

void generate().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
