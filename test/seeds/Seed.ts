import { DeleteResult } from 'typeorm';

export default interface Seed<T> {
  init(): Promise<T>
  generateMany(number: number): Promise<T[]>
  destroy(): Promise<DeleteResult>
}
