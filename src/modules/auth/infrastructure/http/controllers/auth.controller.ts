import { CommandBus } from '@_shared/cqrs/command-bus';
import { RegisterUserCommand } from '@auth/core/commands/register-user.command';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userData = req.body;
      await this.commandBus.execute<RegisterUserCommand>(
        new RegisterUserCommand(userData),
      );
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      next(error);
    }
  }
}
