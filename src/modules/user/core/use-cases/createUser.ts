import { IUserRepository } from '../interfaces/userRepository';
import { User } from '../entities/user';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  execute(user: User) {
    return this.userRepository.create(user);
  }
}
