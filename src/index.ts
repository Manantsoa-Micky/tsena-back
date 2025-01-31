import { config } from '@common/constants/app.config';
import { Application } from './app';
import { logger } from '@common/logger';
import { EventBus } from '@common/events/EventBus';
async function bootstrap() {
  try {
    const eventBus: EventBus = EventBus.getInstance();
    const application = new Application(eventBus);
    await application.initialize();
    await application.start(config.server.port);
  } catch (error) {
    logger.error('Application failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
