import { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(email: string): Promise<void>;
  update(email: string, user: Partial<User>): Promise<void>;
}
