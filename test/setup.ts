import 'reflect-metadata';
import { before, after } from 'mocha';
import { connection } from '@/server/db/testConnection';
import consola from 'consola';
import CheckACL from '../server/models/CheckACL';
import SeedExecutor from './seed';

before(async function () {
  this.timeout(0);
  await connection;

  const seed = new SeedExecutor();
  await seed.destroy();
  await seed.execute();
  consola.info('Seed finished');

  CheckACL.checkDb((err: Error) => {
    if (err) throw err;
  });
});

after((done) => {
  const seed = new SeedExecutor();
  try {
    seed.destroy();
  } finally {
    done();
  }
});
