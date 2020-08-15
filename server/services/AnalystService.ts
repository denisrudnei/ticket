import { UploadedFile } from 'express-fileupload';
import S3 from '~/plugins/S3';

import Analyst from '../../server/models/Analyst';
import AnalystInput from '../inputs/AnalystInput';
import Path from '../models/Path';
import Role from '../models/Role';
import Sound from '../models/Sound';
import Group from '../models/ticket/Group';

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

  static async getAnalysts(): Promise<Analyst[]> {
    return Analyst.find();
  }

  static async getOne(analystId: Analyst['id']): Promise<Analyst> {
    const analyst = await Analyst.findOne(analystId);
    if (!analyst) throw new Error('Analyst not found');
    return analyst;
  }

  static async getConfigAnalysts(): Promise<Analyst[]> {
    return Analyst.find();
  }

  static async updateAnalyst(userId: Analyst['id'], analyst: AnalystInput): Promise<Analyst> {
    const fromDb = await Analyst.findOne(userId);
    if (!fromDb) throw new Error('Analyst not found');

    Object.assign(fromDb, analyst);
    const saved = await fromDb.save();
    return saved;
  }

  static async updateImage(userId: Analyst['id'], file: UploadedFile): Promise<Analyst> {
    const analyst = await Analyst.findOne(userId);
    if (!analyst) throw new Error('Analyst not found');
    const name = userId;
    const params = {
      Bucket: process.env.BUCKET!,
      Key: `analyst/picture/${name}`,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    const { Location } = await S3.upload(params).promise();
    analyst.picture = Location!;
    return analyst.save();
  }

  static async setSoundConfig(analystId: Analyst['id'], config: Sound[]): Promise<Analyst> {
    const analyst = await Analyst.findOne(analystId, { relations: ['sounds'] });
    Sound.save(config);
    analyst!.sounds.push(...config);
    return analyst!.save();
  }

  static async getGroups(userId: Analyst['id']): Promise<Group[]> {
    const analyst = await Analyst.findOne(userId);
    if (!analyst) throw new Error('Analyst not found');
    const groups = await analyst.getGroups();
    return groups;
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
    if (!analyst) throw new Error('Analyst not found');
    analyst.active = false;
    analyst.contactEmail = '';
    analyst.groups = [];
    await AnalystService.removeImage(userId);
    analyst.paths.forEach((path) => Path.delete(path.id));
    analyst.sounds.forEach((sound) => Sound.delete(sound.id));
    await analyst!.save();
  }
}

export default AnalystService;
