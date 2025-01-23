import { TPagination } from '@_shared/types/pagination';
import { User } from '@user/core/entities/user';
import { IUser } from '@user/infrastructure/types/userTypes';

export interface IUserRepository {
  create(payload: User): Promise<IUser>;

  findAllAndPaginate(query: TPagination): Promise<IUser[]>;
}
