import { MongoUserRepository } from './repositories/userRepository';
import { GetAllUsers } from '../use-cases/getAllUsers';
import { CreateUser } from '../use-cases/createUser';

class DIContainer {
  private static _userRepository = new MongoUserRepository();

  static getUserRepository() {
    return this._userRepository;
  }

  static getGetAllUsersUseCase() {
    return new GetAllUsers(this.getUserRepository());
  }

  static getCreateUserUseCase() {
    return new CreateUser(this.getUserRepository());
  }
}

export { DIContainer };