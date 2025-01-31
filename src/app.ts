import 'reflect-metadata';
import { Express } from 'express';
import { Server } from 'http';
import { logger } from '@common/logger';
import { AppServer, ServerError } from './types/server.types';
import { connectDB } from '@common/mongoConnection';
import { EventBus, SystemEvents } from '@common/events/EventBus';
import setupApp from '@common/configs/app';
import { bootstrapCommandQuery } from '@_shared/bootstrap';
import { config } from '@common/constants/app.config';
import mongoose from 'mongoose';

export class Application implements AppServer {
  public app!: Express;
  public server: Server | null = null;
  private isShuttingDown: boolean = false;
  constructor(private readonly eventBus: EventBus) {}

  public async initialize(): Promise<void> {
    try {
      this.app = setupApp();
      this.setupEventHandler();
      this.setupProcessHandler();
      await bootstrapCommandQuery();
      await connectDB();
    } catch (error) {
      logger.error('Failed to initialize application:', error);
      throw new ServerError('Failed to initialize application', 'INIT_FAILED');
    }
  }

  public async start(port: number): Promise<void> {
    try {
      this.eventBus.emit(SystemEvents.SERVER_STARTING);

      this.server = this.app.listen(port, () => {
        this.eventBus.emit(SystemEvents.SERVER_STARTED, port);
      });

      this.server.on('error', (error: Error) => {
        this.eventBus.emit(SystemEvents.UNHANDLED_ERROR, error);
      });
    } catch (error) {
      const serverError = new ServerError(
        'Failed to start application',
        'SERVER_START_FAILED',
      );
      this.eventBus.emit(SystemEvents.UNHANDLED_ERROR, serverError);
      logger.error(serverError.message, error);
      throw serverError;
    }
  }

  public async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      logger.info('Shutdown already in progress');
      return;
    }

    this.isShuttingDown = true;
    this.eventBus.emit(SystemEvents.SERVER_SHUTDOWN);
    logger.info('Received kill signal, shutting down gracefully');

    try {
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server?.close((err) => {
            if (err) {
              logger.error('Error closing server:', err);
              reject(err);
              return;
            }
            logger.info('Closed out remaining connections');
            resolve();
          });

          setTimeout(() => {
            reject(
              new ServerError('Server shutdown timeout', 'SHUTDOWN_TIMEOUT'),
            );
          }, config.server.gracefulShutdownTimeout);
        });
      }

      try {
        await mongoose.disconnect();
        logger.info('Disconnected from database');
      } catch (error) {
        logger.error('Error disconnecting from database:', error);
      }

      process.exit(0);
    } catch (error) {
      logger.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1);
    }
  }

  public setupProcessHandler = (): void => {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
    process.on('unhandledRejection', (reason: Error) => {
      this.eventBus.emit(SystemEvents.UNHANDLED_ERROR, reason);
      logger.error('Unhandled Rejection:', reason);
    });
    process.on('uncaughtException', (error: Error) => {
      this.eventBus.emit(SystemEvents.UNHANDLED_ERROR, error);
      logger.error('Uncaught Exception:', error);
      this.shutdown();
    });
  };

  public setupEventHandler = (): void => {
    this.eventBus.on(SystemEvents.SERVER_STARTED, (port: number) => {
      logger.info(
        `Server starting in ${config.server.nodeEnv} mode on port ${port}`,
      );
    });

    this.eventBus.on(SystemEvents.SERVER_SHUTDOWN, () => {
      logger.info('Server shutdown event received');
    });

    this.eventBus.on(SystemEvents.UNHANDLED_ERROR, (error: Error) => {
      logger.error('Unhandled error occurred:', error);
      if (!this.isShuttingDown) {
        this.shutdown();
      }
    });
  };
}
