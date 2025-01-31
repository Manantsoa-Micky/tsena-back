import { NextFunction, Request, Response } from 'express';
import { TApiResponse } from '@_shared/types/apiResponse';

class UserController {
  public getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = [''];
      const response: TApiResponse = {
        status: 200,
        message: 'Users retrieved successfully',
        data: { users },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
