import { Server } from 'http';
import { Express } from 'express';

export interface AppServer {
  app: Express;
  server: Server | null;

  start(port: number): Promise<void>;

  shutdown(): Promise<void>;
}

export class ServerError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ServerError';
  }
}
