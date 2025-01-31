import { Commands } from '@_shared/command.registry';
import { Mediator } from '@_shared/mediator';
import { IRegisterUserCommandHandler } from '@auth/core/commands/register-user.command';
import { CreateUserCommand } from '@user/core/commands/create-user.command';
import { encrypt } from '@common/utils/utils';

export class RegisterUserCommandHandler implements IRegisterUserCommandHandler {
  constructor(private readonly mediator: Mediator) {}

  async execute(command: CreateUserCommand): Promise<void> {
    command.props.password = await encrypt(command.props.password);
    try {
      await this.mediator.send(Commands.CREATE_USER, command);
    } catch (error) {
      throw error;
    }
  }
}
