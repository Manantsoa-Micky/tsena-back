import {
  GetAllUserResult,
  GetAllUsersHandler,
  GetAllUsersQuery,
} from '@user/core/queries/get-user.query';
import { logger } from '@common/logger';

export class GetAllUsersQueryHandler implements GetAllUsersHandler {
  execute(query: GetAllUsersQuery): Promise<GetAllUserResult> {
    logger.info('user list handled');
    return Promise.resolve({
      users: [],
    });
  }
}
