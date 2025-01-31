import { APIError } from '@common/middlewares';

export interface Command {
  readonly type: string;
}

export interface CommandHandler<T extends Command> {
  execute(command: T): Promise<void>;
}

export class CommandBus {
  private static instance: CommandBus;
  private handlers = new Map<string, CommandHandler<any>>();

  private constructor() {}

  static getInstance(): CommandBus {
    if (!this.instance) {
      this.instance = new CommandBus();
    }
    return this.instance;
  }

  register<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>,
  ): void {
    if (this.handlers.has(commandType)) {
      throw new Error(`Command handler for ${commandType} already registered`);
    }
    this.handlers.set(commandType, handler);
  }

  async execute<T extends Command>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      // throw new Error(`No handler registered for command ${command.type}`);
      throw new APIError(404, `No handler registered for ${command.type}`);
    }

    try {
      await handler.execute(command);
    } catch (error: any) {
      // throw new APIError(500, `Error executing: ${command.type}`);
      throw error;
    }
  }
}
