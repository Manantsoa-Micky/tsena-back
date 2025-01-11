import { UserRepository } from '../domain/interfaces/UserRepository';
import { User } from '../domain/entities/User';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {
  }

  async execute(userData: User) {
    try {
      const userExists = await this.userRepository.findOne({ email: userData.email });
      if (userExists) {
        return new Error('User already exists');
      }
      return await this.userRepository.create(userData);
    } catch (e) {
      console.log(e);
    }
  }
}