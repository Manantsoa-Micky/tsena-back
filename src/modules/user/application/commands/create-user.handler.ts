import {
  CreateUserCommand,
  ICreateUserCommandHandler,
} from '@user/core/commands/create-user.command';
import { User } from '@user/core/entities/user.entity';
import { UserRepositoryPort } from '@user/core/ports/user.repository.port';
import { logger } from 'common/logger';

export class CreateUserCommandHandler implements ICreateUserCommandHandler {
  constructor(private userRepository: UserRepositoryPort) {}
  async execute(command: CreateUserCommand): Promise<void> {
    try {
      logger.info(`${command.type} command fired`);
      const newUser = new User({
        ...command.props,
        isEmailVerified: false,
        isActive: false,
      });
      await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }
}
