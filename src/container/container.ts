import UserRepository from '@user/infrastructure/mongodb/repositories/user.repository';
import UserService from '@user/application/services/user.service';
import UserController from '@user/infrastructure/http/controllers/user.controller';

export class Container {
  private services: Map<string, any>;

  constructor() {
    this.services = new Map();
    this.setupUserModule();
  }

  private setupUserModule() {
    // Setup repositories
    const userRepository = new UserRepository();
    this.services.set('userRepository', userRepository);

    // Setup services
    const userService = new UserService();
    this.services.set('userService', userService);

    // Setup controllers
    const userController = new UserController();
    this.services.set('userController', userController);
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service;
  }
}

export const container = new Container();
