import { APIError } from '@common/middlewares';

export interface IHandler {
  execute(payload: any): any;
}

export class Mediator {
  private static instance: Mediator;
  private handlers: Map<string, IHandler> = new Map();

  private constructor() {}

  static getInstance(): Mediator {
    if (!this.instance) {
      this.instance = new Mediator();
    }
    return this.instance;
  }

  register(handlerName: string, handler: any) {
    if (this.handlers.has(handlerName)) {
      throw new Error(` handler for ${handlerName} already registered`);
    }
    this.handlers.set(handlerName, handler);
  }

  async send(handlerName: string, data: any) {
    const handler = this.handlers.get(handlerName);
    if (!handler) {
      throw new APIError(404, `Handler ${handlerName} not found`);
    }
    try {
      await handler.execute(data);
    } catch (error: any) {
      const errorMessage = `Error executing handler ${handlerName}: ${error}`;
      throw new APIError(400, errorMessage);
    }
  }
}
