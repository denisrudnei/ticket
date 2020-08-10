import AWS from 'aws-sdk';
import fileUpload from 'express-fileupload';
import pdf from 'html-pdf';
import Group from '../../models/ticket/Group';
import Knowledge from '~/server/models/knowledge/Knowledge';
import KnowledgeFile from '~/server/models/knowledge/KnowledgeFile';
import S3 from '~/plugins/S3';
import '~/server/models/knowledge/KnowledgeStatus';

class KnowledgeService {
  static getAll(): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Knowledge.find({ relations: ['category', 'group'] }).then((result) => resolve(result));
    });
  }

  static getOne(id: Knowledge['id']): Promise<Knowledge> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(id, { relations: ['files', 'category', 'group'] }).then(
        (result) => resolve(result),
      );
    });
  }

  static getUnCategorized(): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Knowledge.find({
        group: undefined,
      }).then((result: Knowledge[]) => resolve(result));
    });
  }

  static getByKnowledgeGroup(groupName: string): Promise<Knowledge[]> {
    return new Promise((resolve, reject) => {
      Group.findOne({
        name: groupName,
      }).then((result) => {
        Knowledge.find({
          where: {
            group: {
              id: result!.id,
            },
          },
          relations: ['group'],
        }).then((knowledge) => resolve(knowledge));
      });
    });
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

    KnowledgeService.setPreviewInPDF(result.id, name);
    return result;
  }

  static setPreviewInPDF(knowledgeId: Knowledge['id'], name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = `knowledge/pdf/${name}.pdf`;
      KnowledgeService.generatePDF(knowledgeId).then((response) => {
        KnowledgeService.uploadPDF(key, response).then((link) => {
          Knowledge.findOne(knowledgeId).then((knowledge) => {
            knowledge!.url = link;
            knowledge!.key = key;
            knowledge!.save().then(() => {
              resolve();
            });
          });
        });
      });
    });
  }

  static updateKnowledge(
    knowledgeId: Knowledge['id'],
    knowledgeToEdit: Knowledge,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId).then((knowledge) => {
        Object.assign(knowledge, knowledgeToEdit);
        knowledge!.save().then(() => {
          KnowledgeService.setPreviewInPDF(knowledgeId, knowledge!.name);
          return resolve();
        });
      });
    });
  }

  static addFile(knowledgeId: Knowledge['id'], file: fileUpload.UploadedFile) {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId).then((knowledge) => {
        S3.createBucket(() => {
          const name = `knowledge/${knowledgeId}/${file.name}`;
          const params = {
            Bucket: process.env.BUCKET!,
            Key: name,
            Body: file.data,
            ContentType: file.mimetype,
            ACL: 'public-read',
          };
          S3.upload(
            params,
            (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
              if (err) reject(err);
              KnowledgeFile.create({
                name,
                url: data.Location!,
              })
                .save()
                .then((knowledgeFile) => {
                  if (!knowledge!.files) knowledge!.files = [];
                  knowledge!.files.push(knowledgeFile);
                  knowledgeFile.save();
                  knowledge!.save();
                  return resolve(data);
                });
            },
          );
        });
      });
    });
  }

  static addTempFile(file: fileUpload.UploadedFile): Promise<string> {
    return new Promise((resolve, reject) => {
      S3.createBucket(() => {
        const name = `knowledge/temp/${file.name}`;
        const params = {
          Bucket: process.env.BUCKET!,
          Key: name,
          Body: file.data,
          ContentType: file.mimetype,
          ACL: 'public-read',
        };
        S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) reject(err);
            KnowledgeFile.create({
              name,
              url: data.Location!,
            })
              .save()
              .then((knowledgeFile: KnowledgeFile) => {
                knowledgeFile.save();
                return resolve(`/api/knowledge/${knowledgeFile.id}/file`);
              });
          },
        );
      });
    });
  }

  static getAllFiles(knowledgeId: Knowledge['id']): Promise<KnowledgeFile[]> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(knowledgeId, { relations: ['files'] }).then(
        (knowledge) => {
          resolve(knowledge!.files);
        },
      );
    });
  }

  static getFile(id: KnowledgeFile['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      KnowledgeFile.findOne(id).then((knowledgeFile) => {
        S3.getObject(
          {
            Bucket: process.env.BUCKET!,
            Key: knowledgeFile!.name,
          },
          (err: Error, file: AWS.S3.Types.GetObjectOutput) => {
            if (err) reject(err);
            return resolve(file.Body as Buffer);
          },
        );
      });
    });
  }

  static remove(id: Knowledge['id']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(id, { relations: ['files'] }).then((knowledge) => {
        const deleteFilesFromKnowledge = knowledge!.files.map((file) => {
          S3.deleteObject(
            {
              Bucket: process.env.BUCKET!,
              Key: file.name,
            },
            (err: Error) => {
              if (err) reject(err);
            },
          );
          return KnowledgeFile.delete(file.id);
        });
        Promise.all(deleteFilesFromKnowledge).then(() => {
          Knowledge.delete(knowledge!.id).then(() => {
            if (!knowledge!.key) resolve();
            S3.deleteObject(
              {
                Bucket: process.env.BUCKET!,
                Key: knowledge!.key,
              },
              (err: Error) => {
                if (err) reject(err);
                return resolve(true);
              },
            );
          });
        });
      });
    });
  }

  static uploadPDF(name: string, body: any): Promise<string> {
    return new Promise((resolve, reject) => {
      S3.createBucket(() => {
        const params = {
          Bucket: process.env.BUCKET!,
          Key: name,
          Body: body,
          ContentType: 'application/pdf',
          ACL: 'public-read',
        };
        S3.upload(
          params,
          (err: Error, data: AWS.S3.Types.CompleteMultipartUploadOutput) => {
            if (err) reject(err);
            return resolve(data.Location);
          },
        );
      });
    });
  }

  static generatePDF(knowledgeId: Knowledge['id']): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      KnowledgeService.getOne(knowledgeId).then((knowledge) => {
        pdf
          .create(knowledge.description, {
            format: 'A4',
          })
          .toBuffer((err: Error, result) => {
            if (err) reject(err);
            return resolve(result);
          });
      });
    });
  }
}

export default KnowledgeService;
