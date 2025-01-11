import { User } from '../../domain/entities/User';
import { Paginated, UserRepository } from '../../domain/interfaces/UserRepository';
import { UserModel } from '../models/userModel';
import { FilterQuery } from 'mongoose';

export class MongoUserRepository implements UserRepository {
  async findAll(): Promise<Paginated<User>> {
    const users = await UserModel.find();
    return {
      data: users || [],
      metadata: {},
    };
  }

  async findOne(filter: FilterQuery<User>): Promise<User | null> {
    return UserModel.findOne(filter);
  }

  async findOneById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  }

  async create(data: User): Promise<User> {
    return UserModel.create(data);
  }

  async delete(id: string): Promise<User | null> {
    return UserModel.findOneAndDelete({ _id: id });
  }

  async update(id: string, data: User): Promise<User | null> {
    return UserModel.findOneAndUpdate({ _id: id, data });
  }
}