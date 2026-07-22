const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function main() {
  const app = await NestFactory.create(AppModule);
  const instance = app.getHttpAdapter().getInstance();
  console.log('Middleware layers:');
  instance._router.stack.forEach((layer, i) => {
    if (layer.name) {
      console.log(`  ${i}: ${layer.name}`);
    } else if (layer.handle && layer.handle.name) {
      console.log(`  ${i}: ${layer.handle.name}`);
    } else {
      console.log(`  ${i}: (unknown)`);
    }
  });
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
