import mongoose, { Document, Model, PipelineStage } from 'mongoose';
import { logger } from '../../../common/logger';
import { IBaseRepository } from './interfaces/baseRepository';
import { TPagination } from '@_shared/types/pagination';

class BaseRepository<U, T extends Document> implements IBaseRepository<U, T> {
  constructor(private model: Model<T>) {}

  async create(data: U): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newData = new this.model(data) as T;
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

  findAllAndPaginate(pagination: TPagination): Promise<T[]> {
    const skip = (pagination.page - 1) * pagination.limit;
    const pipeline: PipelineStage[] = [
      {
        $match: {},
      },
      {
        $skip: skip,
      },
      {
        $limit: pagination.limit,
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
