export interface Query {
  readonly type: string;
}

export interface QueryHandler<T extends Query, R> {
  execute(query: T): Promise<R>;
}

export class QueryBus {
  private static instance: QueryBus;
  private handlers = new Map<string, QueryHandler<any, any>>();

  private constructor() {}

  static getInstance(): QueryBus {
    if (!QueryBus.instance) {
      QueryBus.instance = new QueryBus();
    }
    return QueryBus.instance;
  }

  register<T extends Query, R>(
    queryType: string,
    handler: QueryHandler<T, R>,
  ): void {
    if (this.handlers.has(queryType)) {
      throw new Error(`Query handler for ${queryType} already registered`);
    }
    this.handlers.set(queryType, handler);
  }

  async execute<T extends Query, R>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query ${query.type}`);
    }

    try {
      return await handler.execute(query);
    } catch (error: any) {
      throw new Error(`Error executing query ${query.type}: ${error.message}`);
    }
  }

  hasHandler(queryType: string): boolean {
    return this.handlers.has(queryType);
  }

  unregister(queryType: string): void {
    this.handlers.delete(queryType);
  }
}
