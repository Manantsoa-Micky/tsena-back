import BaseRepository from '@_shared/repository/base.repository';
import { IUserRepository } from '@user/core/interfaces/userRepository';
import { IUser, TUser } from '@user/infrastructure/types/userTypes';
import { UserModel } from '@user/infrastructure/models/user.model';

class UserRepository
  extends BaseRepository<TUser, IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }
}

export default UserRepository;
