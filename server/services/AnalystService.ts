import { UploadedFile } from 'express-fileupload';
import AWS from 'aws-sdk';
import Analyst from '../../server/models/Analyst';
import Group from '../models/ticket/Group';
import Sound from '../models/Sound';
import Role from '../models/Role';
import Path from '../models/Path';
import S3 from '~/plugins/S3';

class AnalystService {
  static async create(analyst: Analyst): Promise<Analyst> {
    const existing = await Analyst.findOne({
      where: {
        email: analyst.email,
      },
    });
    const role = await Role.findOne({
      name: 'user',
    });
    if (existing) throw new Error('User already registered');

    return Analyst.create({
      ...analyst,
      ...role,
    })
      .save();
  }

  static getAnalysts(): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Analyst.find().then((analysts) => {
        resolve(analysts);
      });
    });
  }

  static getOne(analystId: Analyst['id']): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOneOrFail(analystId).then((analyst) => {
        resolve(analyst);
      });
    });
  }

  static getConfigAnalysts(): Promise<Analyst[]> {
    return new Promise((resolve, reject) => {
      Analyst.find().then((analysts) => {
        resolve(analysts);
      });
    });
  }

  static updateAnalyst(userId: Analyst['id'], analyst: Analyst): Promise<Analyst> {
    return new Promise((resolve, reject) => [
      Analyst.findOne(userId).then((fromDb) => {
        analyst.role = fromDb!.role;
        Object.assign(fromDb, analyst);
        fromDb!.save().then((saved) => {
          resolve(saved);
        });
      }),
    ]);
  }

  static async updateImage(userId: Analyst['id'], file: UploadedFile): Promise<Analyst> {
    const analyst = await Analyst.findOne(userId);
    const name = userId;
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `analyst/picture/${name}`,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    const { Location } = await S3.upload(params).promise();
    analyst!.picture = Location!;
    return analyst!.save();
  }

  static async setSoundConfig(analystId: Analyst['id'], config: Sound[]): Promise<Analyst> {
    const analyst = await Analyst.findOne(analystId, { relations: ['sounds'] });
    Sound.save(config);
    analyst!.sounds.push(...config);
    return analyst!.save();
  }

  static getGroups(userId: Analyst['id']): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then((analyst) => {
        analyst!.getGroups().then((result: Group[]) => {
          resolve(result);
        });
      });
    });
  }

  static async removeImage(userId: Analyst['id']): Promise<Analyst> {
    await S3.deleteObject(
      {
        Bucket: process.env.BUCKET!,
        Key: userId.toString(),
      },
    ).promise();
    const analyst = await Analyst.findOne();
    analyst!.picture = '/user.svg';
    return analyst!.save();
  }

  static async remove(userId: Analyst['id']): Promise<void> {
    const analyst = await Analyst.findOne(userId, {
      relations: ['groups', 'sounds', 'paths'],
    });
    analyst!.active = false;
    analyst!.contactEmail = '';
    analyst!.groups = [];
    AnalystService.removeImage(userId);
    analyst!.paths.forEach((path) => Path.delete(path.id));
    analyst!.sounds.forEach((sound) => Sound.delete(sound.id));
    await analyst!.save();
  }
}

export default AnalystService;
