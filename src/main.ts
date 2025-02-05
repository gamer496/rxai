import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './shared/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.useLogger(app.get(LoggerService));
  const port = process.env.PORT || 8000;
  await app.listen(port);
}
bootstrap(); 