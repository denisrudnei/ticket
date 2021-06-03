import AWS from 'aws-sdk';
import fileUpload from 'express-fileupload';
import { launch } from 'puppeteer';
import Group from '../../models/ticket/Group';
import Knowledge from '~/server/models/knowledge/Knowledge';
import KnowledgeFile from '~/server/models/knowledge/KnowledgeFile';
import S3 from '~/plugins/S3';
import '~/server/models/knowledge/KnowledgeStatus';
import { PuppeteerRenderer } from '../../utils/PupperteerRenderer';

class KnowledgeService {
  static async getAll(): Promise<Knowledge[]> {
    return Knowledge.find({ relations: ['category', 'group'] });
  }

  static async getOne(id: Knowledge['id']): Promise<Knowledge> {
    const knowledge = await Knowledge.findOne(id, { relations: ['files', 'category', 'group'] });
    if (!knowledge) throw new Error('Knowledge not found');
    return knowledge;
  }

  static async getUnCategorized(): Promise<Knowledge[]> {
    return Knowledge.find({
      group: undefined,
    });
  }

  static async getByKnowledgeGroup(groupName: string): Promise<Knowledge[]> {
    const group = await Group.findOne({
      name: groupName,
    });
    if (!group) throw new Error('Group not found');
    const knowledges = await Knowledge.find({
      where: {
        group: {
          id: group.id,
        },
      },
      relations: ['group'],
    });
    return knowledges;
  }

  static async create(knowledge: Knowledge): Promise<Knowledge> {
    const {
      name, group, description, category, status,
    } = knowledge;
    const result = await Knowledge.create({
      name,
      status,
      group,
      category,
      description,
    }).save();

    await KnowledgeService.setPreviewInPDF(result.id, name);
    return result;
  }

  static async setPreviewInPDF(knowledgeId: Knowledge['id'], name: string): Promise<void> {
    const key = `knowledge/pdf/${name}.pdf`;
    const response = await KnowledgeService.generatePDF(knowledgeId);
    const link = await KnowledgeService.uploadPDF(key, response);
    const knowledge = await Knowledge.findOne(knowledgeId);
    if (!knowledge) throw new Error('Knowledge not found');
    knowledge.url = link;
    knowledge.key = key;
    await knowledge.save();
  }

  static async updateKnowledge(
    knowledgeId: Knowledge['id'],
    knowledgeToEdit: Knowledge,
  ): Promise<void> {
    const knowledge = await Knowledge.findOne(knowledgeId);
    if (!knowledge) throw new Error('Knowledge not found');
    Object.assign(knowledge, knowledgeToEdit);
    await knowledge.save();
    KnowledgeService.setPreviewInPDF(knowledgeId, knowledge.name);
  }

  static async addFile(knowledgeId: Knowledge['id'], file: fileUpload.UploadedFile) {
    const knowledge = await Knowledge.findOne(knowledgeId);
    const name = `knowledge/${knowledgeId}/${file.name}`;
    const params = {
      Bucket: process.env.BUCKET!,
      Key: name,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    const { Location, ...dataInfo } = await S3.upload(params).promise();

    const knowledgeFile = await KnowledgeFile.create({
      name,
      url: Location,
    }).save();

    if (!knowledge!.files) knowledge!.files = [];
    knowledge!.files.push(knowledgeFile);
    knowledgeFile.save();
    knowledge!.save();
    return { Location, ...dataInfo };
  }

  static async addTempFile(file: fileUpload.UploadedFile): Promise<string> {
    const name = `knowledge/temp/${file.name}`;
    const params = {
      Bucket: process.env.BUCKET!,
      Key: name,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    const { Location } = await S3.upload(params).promise();

    const knowledgeFile = await KnowledgeFile.create({
      name,
      url: Location,
    }).save();

    return `/api/knowledge/${knowledgeFile.id}/file`;
  }

  static async getAllFiles(knowledgeId: Knowledge['id']): Promise<KnowledgeFile[]> {
    const { files } = (await Knowledge.findOne(knowledgeId, { relations: ['files'] })) as Knowledge;
    return files;
  }

  static async getFile(id: KnowledgeFile['id']): Promise<Buffer> {
    const knowledgeFile = await KnowledgeFile.findOne(id);
    if (!knowledgeFile) throw new Error('Knowledge not found');
    const { Body } = await S3.getObject(
      {
        Bucket: process.env.BUCKET!,
        Key: knowledgeFile!.name,
      },
    ).promise();
    return Body as Buffer;
  }

  static async remove(id: Knowledge['id']): Promise<boolean> {
    const knowledge = await Knowledge.findOne(id, { relations: ['files'] });
    if (!knowledge) throw new Error('Knowledge not found');
    const deleteFilesFromKnowledge = knowledge.files.map(async (file) => {
      await S3.deleteObject(
        {
          Bucket: process.env.BUCKET!,
          Key: file.name,
        },
      ).promise();

      return KnowledgeFile.delete(file.id);
    });

    await Promise.all(deleteFilesFromKnowledge);

    await Knowledge.delete(knowledge.id);

    if (!knowledge.key) return true;

    await S3.deleteObject(
      {
        Bucket: process.env.BUCKET!,
        Key: knowledge.key,
      },
    ).promise();
    return true;
  }

  static async uploadPDF(name: string, body: any): Promise<AWS.S3.Types.Location> {
    const params = {
      Bucket: process.env.BUCKET!,
      Key: name,
      Body: body,
      ContentType: 'application/pdf',
      ACL: 'public-read',
    };
    const { Location } = await S3.upload(params).promise();
    return Location;
  }

  static async generatePDF(knowledgeId: Knowledge['id']): Promise<Buffer> {
    const knowledge = await KnowledgeService.getOne(knowledgeId);
    const browser = await launch();
    const page = browser.newPage();
    return new PuppeteerRenderer().renderFromHtml(knowledge.description);
  }
}

export default KnowledgeService;
