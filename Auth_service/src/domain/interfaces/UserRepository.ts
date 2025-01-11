import { User } from '../entities/User';

export type Paginated<T> = {
  data: T[];
  metadata: {}
}

export interface UserRepository {
  findAll(page?: number, limit?: number): Promise<Paginated<User>>;

  findOneById(id: string): Promise<User | null>;

  findOne(filter: { [key: string]: string }): Promise<User | null>;

  create(data: User): Promise<User>;

  delete(id: string): Promise<User | null>;

  update(id: string, data: User): Promise<User | null>;
}