/* eslint-disable class-methods-use-this */
import { Resolver } from 'type-graphql';
import File from '@/server/models/File';

@Resolver((of) => File)
class FileResolver {
  async GetAllFiles(): Promise<File[]> {
    return File.find();
  }
}

export default FileResolver;
