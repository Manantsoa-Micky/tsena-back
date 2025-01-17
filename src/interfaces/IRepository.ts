export interface IRepository<T> {
    findAllAndPaginate(page: number, limit: number): Promise<T[]>
    findOne(id: string): Promise<T>
    create(data: T): Promise<T>
    update(id: string, data: T): Promise<T>
    delete(id: string): Promise<T>
}