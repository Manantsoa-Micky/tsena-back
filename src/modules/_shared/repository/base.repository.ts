import mongoose, { Document, Model, PipelineStage } from 'mongoose';
import { logger } from '../../common/logger';
import { IBaseRepository } from './repository/interfaces/baseRepository';

class BaseRepository<U, T extends Document> implements IBaseRepository<U, T> {
  constructor(private model: Model<T>) {}

  async create(data: U): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newData = new this.model(data) as unknown as T;
      await newData.save({ session });

      await session.commitTransaction();
      await session.endSession();

      return newData;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      logger.error(error);
      throw error;
    }
  }

  findAllAndPaginate(page: number, limit: number): Promise<T[]> {
    const skip = (page - 1) * limit;
    const pipeline: PipelineStage[] = [
      {
        $match: {},
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];
    return this.model.aggregate(pipeline);
  }

  findOne(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }

  update(id: string, data: Partial<U>): Promise<T> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default BaseRepository;
