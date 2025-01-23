import { NextFunction } from 'express-serve-static-core';
import UserService from '../../../application/services/user.service';
import { Request, Response } from 'express';
import { TApiResponse } from '@_shared/types/apiResponse';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      const response: TApiResponse = {
        status: 201,
        message: 'User created successfully',
        data: { user },
      };
      res.status(201).json(response);
    } catch (err: any) {
      next(err);
    }
  }

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = this.userService.findAllUsers();
      res.json(users);
    } catch (err: any) {
      next(err);
    }
  };
}

export default UserController;
