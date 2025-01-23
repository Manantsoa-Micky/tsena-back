import { TPagination } from '@_shared/types/pagination';
import { IQueryHandler } from '@user/application/services/user.service';
import { IUserRepository } from '@user/core/interfaces/userRepository';
import { IUser } from '@user/infrastructure/types/userTypes';

export class GetAllUsers implements IQueryHandler<IUser> {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(query: TPagination): Promise<IUser[]> {
    return this.userRepository.findAllAndPaginate(query);
  }
}
