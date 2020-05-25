import path from 'path'
import { createConnection } from 'typeorm'
import Analyst from '../models/Analyst'
const modelsPath = path.resolve(__dirname, '..', 'models/**/*.ts')

export const connection = createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'ticket',
  entities: [modelsPath],
  synchronize: true,
  dropSchema: true,
  logging: ['error']
})
