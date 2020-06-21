import { Resolver, FieldResolver, Root } from 'type-graphql'
import File from '@/server/models/File'
import TicketService from '../services/ticket/TicketService'

@Resolver(of => File)
class FileResolver {
  GetAllFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      File.find().then(files => {
        resolve(files)
      })
    })
  }
}

export default FileResolver
