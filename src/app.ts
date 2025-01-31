import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { setupSwagger } from '@common/swagger';
import {
  errorHandler,
  requestTimeout,
  setupLogging,
  setupSecurityMiddleware,
} from '@common/middlewares';
import { logger } from '@common/logger';
import { bootstrapCommandQuery } from '@_shared/bootstrap';
import userRoutes from '@user/infrastructure/http/routes/user.routes';
import { ServerConfig } from './config/server.config';
import { AppServer, ServerError } from './types/server.types';
import { connectDB } from '@common/mongoConnection';

class Application implements AppServer {
  public app: express.Express;
  public server: Server | null = null;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupProcessHandlers();
  }

  private setupMiddlewares(): void {
    setupLogging(this.app);
    setupSecurityMiddleware(this.app);
    this.app.use(requestTimeout({ timeout: ServerConfig.requestTimeout }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    setupSwagger(this.app);
  }

  private setupRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        environment: ServerConfig.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });
    this.app.use('/user', userRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler(err, req, res, next);
      },
    );
  }

  private setupProcessHandlers(): void {
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
    process.on('unhandledRejection', (reason: Error) => {
      logger.error('Unhandled Rejection:', reason);
    });
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      this.shutdown();
    });
  }

  public async start(port: number): Promise<void> {
    try {
      await bootstrapCommandQuery();
      await connectDB();
      this.server = this.app.listen(port, () => {
        logger.info(
          `Server starting in ${ServerConfig.nodeEnv} mode on port ${port}`,
        );
      });
    } catch (error) {
      const serverError = new ServerError(
        'Failed to start application',
        'SERVER_START_FAILED',
      );
      logger.error(serverError.message, error);
      throw serverError;
    }
  }

  public async shutdown(): Promise<void> {
    if (this.server) {
      logger.info('Received kill signal, shutting down gracefully');

      try {
        await new Promise<void>((resolve, reject) => {
          this.server?.close(() => {
            logger.info('Closed out remaining connections');
            resolve();
          });

          setTimeout(() => {
            reject(
              new ServerError('Server shutdown timeout', 'SHUTDOWN_TIMEOUT'),
            );
          }, ServerConfig.gracefulShutdownTimeout);
        });

        process.exit(0);
      } catch (error) {
        logger.error(
          'Could not close connections in time, forcefully shutting down',
        );
        process.exit(1);
      }
    }
  }
}

const application = new Application();
export { application as default };
