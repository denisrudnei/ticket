/* eslint-disable import/prefer-default-export */
import path from 'path';
import { createConnection } from 'typeorm';

export const connection = createConnection({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.PASSWORD || 'postgres',
  database: process.env.DATABASE || 'test',
  entities: [path.resolve(__dirname, '..', 'models/**/*')],
  synchronize: true,
  dropSchema: true,
  logging: ['error'],
});
