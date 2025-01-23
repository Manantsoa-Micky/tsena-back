import { IUser, TUser } from './infrastructure/types/userTypes';
import UserRepository from '@user/infrastructure/mongodb/repositories/user.repository';

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(user: TUser): Promise<IUser> {
    return await this.userRepository.create(user);
  }

  public async findAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAllAndPaginate(1, 10);
  }
}

export default UserService;
