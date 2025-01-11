import { UserRepository } from '../domain/interfaces/UserRepository';

export class GetAllUsers {
  constructor(private readonly userRepository: UserRepository) {
  }

  async execute() {
    return await this.userRepository.findAll();
  }
}