/* eslint-disable import/prefer-default-export */
import express from 'express';
import jwt from 'jsonwebtoken';

import Analyst from '@/server/models/Analyst';

type info = {
  id: Analyst['id'],
  email: Analyst['email'],
  name: Analyst['name']
};

export async function getUser(req: express.Request): Promise<Analyst | undefined> {
  const jwtString = req.headers.authorization!.replace('Bearer ', '');

  const { email } = (jwt.decode(jwtString) as info);

  const user = await Analyst.findOne({
    where: {
      email,
    },
  });

  return user;
}
