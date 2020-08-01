import 'reflect-metadata';
import { connection } from '@/server/db/testConnection';
import SeedExecutor from './seed';

connection.then(async () => {
  const seed = new SeedExecutor();
  await seed.destroy();
  await seed.execute();
});
