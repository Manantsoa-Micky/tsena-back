import { IUser } from '../../infrastructure/types/userTypes';
import { GetAllUsers } from '@user/application/use-cases/queries/get-all-users.query';
import { TPagination } from '@_shared/types/pagination';

export interface IQueryHandler<T> {
  execute(query: unknown): Promise<T[]>;
}

class UserService {
  private query: IQueryHandler<IUser>;

  constructor() {
    this.query = new GetAllUsers();
  }

  // public async createUser(user: TUser): Promise<IUser> {
  //   return await this.userRepository.create(user);
  // }

  public async findAllUsers(params: TPagination): Promise<IUser[]> {
    return await this.query.execute(params);
  }
}

export default UserService;
