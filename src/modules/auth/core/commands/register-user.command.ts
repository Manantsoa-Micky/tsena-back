import { Commands } from '@_shared/command.registry';
import { Command, CommandBus } from '@_shared/cqrs/command-bus';
import { UserProps } from '@user/core/entities/user.entity';

export class RegisterUserCommand implements Command {
  constructor(
    public readonly props: Omit<UserProps, 'isEmailVerified' | 'isActive'>,
  ) {}

  type: string = Commands.REGISTER_USER;
  email!: string;
  password!: string;
  firstname!: string;
  lastname!: string;
  phoneNumber!: string;
  address!: {
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface IRegisterUserCommandHandler {
  execute(command: RegisterUserCommand, commandBus: CommandBus): Promise<void>;
}
