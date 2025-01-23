import { TPagination } from '@_shared/types/pagination';
import UserRepository from '@user/infrastructure/mongodb/repositories/user.repository';
import { User } from '../entities/user';

export class GetAllUsers {
  constructor(private userRepository: UserRepository) {}

  execute(pagination: TPagination): Promise<User[]> {
    return this.userRepository.findAllAndPaginate(pagination);
  }
}
