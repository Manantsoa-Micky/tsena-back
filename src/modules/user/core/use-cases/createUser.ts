import { IUserRepository } from '@user/core/interfaces/userRepository';
import { User } from '@user/core/entities/user';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  execute(user: User) {
    const newUser = new User(user);
    return this.userRepository.create(newUser);
  }
}
