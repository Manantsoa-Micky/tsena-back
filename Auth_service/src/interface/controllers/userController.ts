import { Request, Response } from 'express';
import { DIContainer } from '../../infrastructure/DIContainer';
import { User } from '../../domain/entities/User';
import { CreateUserDto } from '../dto/CreateUserdto';
import { validate } from 'class-validator';

export class UserController {
  private getAllUsers = DIContainer.getGetAllUsersUseCase();
  private createUser = DIContainer.getCreateUserUseCase();

  async getAll(req: Request, res: Response) {
    const users = await this.getAllUsers.execute();
    res.json(users);
  }

  async create(req: Request, res: Response) {
    const dto = Object.assign(new CreateUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json(errors);
    }
    const user = await this.createUser.execute(req.body);
    res.status(201).json(user);
  }
}