import { Query } from '@_shared/cqrs/query-bus';
import { User } from '../entities/user.entity';
import { Queries } from '@_shared/command.registry';

export class GetAllUsersQuery implements Query {
  type: string = Queries.GET_ALL_USERS;
}

export interface GetAllUserResult {
  users: User[] | null;
}

export interface GetAllUsersHandler {
  execute(query: GetAllUsersQuery): Promise<GetAllUserResult>;
}
