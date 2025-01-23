import { User } from '../entities/user';

export interface IUserRepository {
  create(payload: User): Promise<User>;
}
