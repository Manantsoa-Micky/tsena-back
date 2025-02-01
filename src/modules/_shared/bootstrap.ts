import { CreateUserCommandHandler } from '@user/application/commands/create-user.handler';
import { Commands } from './command.registry';
import { CommandBus } from './cqrs/command-bus';
import { UserRepository } from '@user/infrastructure/mongodb/repositories/user.repository';
import { UserModel } from '@user/infrastructure/mongodb/models/user.model';
import { RegisterUserCommandHandler } from '@auth/application/command/register-user.handler';
import { QueryBus } from '@_shared/cqrs/query-bus';
import { RegisterUserCommand } from '@auth/core/commands/register-user.command';
import { CreateUserCommand } from '@user/core/commands/create-user.command';
import { Mediator } from './mediator';

export async function bootstrapCommandQuery() {
  const commandBus = CommandBus.getInstance();
  const queryBus = QueryBus.getInstance();
  const mediator = Mediator.getInstance();

  const userRepository = new UserRepository(UserModel);
  const createUserCommandHandler = new CreateUserCommandHandler(userRepository);
  const registerUserCommandHandler = new RegisterUserCommandHandler(mediator);

  /**
   * COMMANDS
   */
  commandBus.register<RegisterUserCommand>(
    Commands.REGISTER_USER,
    registerUserCommandHandler,
  );
  commandBus.register<CreateUserCommand>(
    Commands.CREATE_USER,
    createUserCommandHandler,
  );

  /**
   * QUERIES
   */

  /**
   * SHARED
   */
  mediator.register(Commands.CREATE_USER, createUserCommandHandler);
}
