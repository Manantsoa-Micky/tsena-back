import BaseRepository from '../../common/base.repository';
import { TUser } from './types';
import { IUser, UserModel } from './user.model';

class UserRepository extends BaseRepository<TUser, IUser> {
  constructor() {
    super(UserModel);
  }
}

export default UserRepository;
