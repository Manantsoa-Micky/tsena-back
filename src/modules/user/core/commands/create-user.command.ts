import { Command } from '@_shared/cqrs/command-bus';
import { UserProps } from '../entities/user.entity';
import { Commands } from '@_shared/command.registry';

export class CreateUserCommand implements Command {
  type: string = Commands.CREATE_USER;
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

  constructor(
    public readonly props: Omit<UserProps, 'isEmailVerified' | 'isActive'>,
  ) {}
}

export interface ICreateUserCommandHandler {
  execute(command: CreateUserCommand): Promise<void>;
}
