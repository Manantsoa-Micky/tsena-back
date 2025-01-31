export const Commands = {
  REGISTER_USER: 'command:register_user',
  CREATE_USER: 'command:create_user',
} as const;

export type CommandType = (typeof Commands)[keyof typeof Commands];

export const Queries = {
  GET_ALL_USERS: 'query:get_all_users',
} as const;

export type QueryType = (typeof Queries)[keyof typeof Queries];
