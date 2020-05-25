import path from 'path'
import { createConnection } from 'typeorm'

export default createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ticket',
  entities: [path.resolve(__dirname, '..', 'models/**/*.ts')],
  synchronize: true,
  logging: ['error']
})
