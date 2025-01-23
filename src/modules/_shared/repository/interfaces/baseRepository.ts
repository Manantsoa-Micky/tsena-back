export interface IBaseRepository<U, T> {
  create(data: U): Promise<T>;

  findAllAndPaginate(page: number, limit: number): Promise<T[]>;

  findOne(id: string): Promise<T>;

  update(id: string, data: Partial<U>): Promise<T>;

  delete(id: string): Promise<void>;
}
