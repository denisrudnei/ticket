/* eslint-disable class-methods-use-this */
import { Resolver } from 'type-graphql';
import File from '@/server/models/File';

@Resolver((of) => File)
class FileResolver {
  GetAllFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      File.find().then((files) => {
        resolve(files);
      });
    });
  }
}

export default FileResolver;
