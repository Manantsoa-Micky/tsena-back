import { User } from '@user/infrastructure/mongodb/models/user.model';
import { UserRepositoryPort } from '@user/core/ports/user.repository.port';
import { Model } from 'mongoose';
import { logger } from '@common/logger';

export class UserRepository implements UserRepositoryPort {
  private model: Model<User>;

  constructor(model: Model<User>) {
    this.model = model;
  }

  private toModel(user: User): any {
    return {
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      address: {
        city: user.address.city,
        country: user.address.country,
        postalCode: user.address.postalCode,
      },
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
    };
  }

  private toEntity(model: any): User {
    return new User({
      email: model.email,
      password: model.password,
      firstname: model.firstname,
      lastname: model.lastname,
      phoneNumber: model.phoneNumber,
      address: {
        city: model.address.city,
        country: model.address.country,
        postalCode: model.address.postalCode,
      },
      isEmailVerified: model.isEmailVerified,
      isActive: model.isActive,
    });
  }

  async save(user: User): Promise<void> {
    const userModel = this.toModel(user);
    try {
      await this.model.create({ ...userModel, password: user.password });
    } catch (error: any) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.model.findOne({ email });
    return model ? this.toEntity(model) : null;
  }

  async findAll(): Promise<User[]> {
    return this.model.find();
  }

  async delete(email: string): Promise<void> {
    const user = await this.model.findOneAndDelete({ email: email });
    if (user) return;
  }

  async update(email: string, user: Partial<User>): Promise<void> {
    await this.model.findOneAndUpdate({ email: email }, user);
  }
}
