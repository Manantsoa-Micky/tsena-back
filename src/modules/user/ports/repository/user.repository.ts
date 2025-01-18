import BaseRepository from '../../../../common/base.repository';
import { IUser, TUser } from '../../types';
import { UserModel } from '../../user.model';

class UserRepository extends BaseRepository<TUser, IUser> {
  constructor() {
    super(UserModel);
  }
}

export default UserRepository;
