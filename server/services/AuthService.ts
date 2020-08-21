import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';

import { ILike } from '../db/FindOperator';
import AnalystMergeInput from '../inputs/AnalystMergeInput';
import Analyst from '../models/Analyst';
import Role from '../models/Role';
import MailService from './MailService';

class AuthService {
  static async login(email: string, password: string): Promise<Analyst> {
    const user = await Analyst.findOne({
      where: { email: ILike(email) },
      relations: ['role'],
    });

    if (!user) throw new Error('Username or password incorrect');

    if (!user.verifyPassword(password)) throw new Error('Incorrect password');
    return user;
  }

  static async register(user: Analyst): Promise<Analyst> {
    const userFromDB = await Analyst.findOne({
      where: {
        email: ILike(user.email),
      },
    });
    if (userFromDB) throw new Error('Already registered');

    const analyst = new Analyst();
    Object.assign(analyst, user);
    analyst.role = (await Role.findOne({
      name: 'user',
    })) as Role;
    return analyst.save();
  }

  static async mergeUser(email: string, userBody: AnalystMergeInput): Promise<Analyst> {
    const analyst = await Analyst.findOne({
      where: {
        email: ILike(email),
      },
      relations: ['role'],
    });
    if (!analyst) {
      return Analyst.create({
        ...userBody,
        email,
        password: bcrypt.hashSync(new Date().toString()),
        role: await Role.findOne({
          name: 'user',
        }),
      }).save();
    }
    if (analyst.mergePictureWithExternalAccount) {
      analyst.picture = userBody.picture;
      return analyst.save();
    }

    Object.assign(analyst, userBody);

    return analyst.save();
  }

  static async generateEmailToReset(email: string, req: express.Request): Promise<string> {
    const analyst = await Analyst.findOne({
      where: {
        email: ILike(email),
      },
    });
    if (!analyst) throw new Error('Not found');
    const token = jwt.sign(
      {
        id: analyst!.id,
        email: analyst!.email,
      },
      process.env.JWT_TOKEN as string,
    );
    MailService.sendConfirmationEmail(analyst!, req, token).catch((error) => { throw error; });
    return token;
  }

  static async resetPasswordWithToken(token: string, newPassword: string): Promise<Analyst> {
    const info = jwt.verify(token, process.env.JWT_TOKEN!) as Analyst;
    const analyst = await Analyst.findOne(info.id);
    analyst!.password = newPassword;
    return analyst!.save();
  }

  static async resetPassword(
    userId: Analyst['id'],
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await Analyst.findOne(userId);
    const result = user!.verifyPassword(oldPassword);
    if (!result) {
      throw new Error('incorrect old password');
    }
    user!.password = newPassword;
    await user!.save();
    return true;
  }
}

export default AuthService;
