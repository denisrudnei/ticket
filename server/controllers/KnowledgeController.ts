import express from 'express';
import { UploadedFile } from 'express-fileupload';
import KnowledgeService from '~/server/services/knowledge/KnowledgeService';

export default {
  getFile: (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    KnowledgeService.getFile(parseInt(id, 10))
      .then((file: Buffer) => res.end(file))
      .catch((e: Error) => res.status(500).json(e));
  },

  getAllFiles: (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id, 10);
    KnowledgeService.getAllFiles(id)
      .then((file) => res.end(file))
      .catch((e: Error) => res.status(500).json(e));
  },

  addTempFile: (req: express.Request, res: express.Response) => {
    const file = req.files!.file as UploadedFile;
    KnowledgeService.addTempFile(file)
      .then((data: string) => res.status(201).json(data))
      .catch((e: Error) => res.status(500).json(e));
  },

  addFile: (req: express.Request, res: express.Response) => {
    const file = req.files!.file as UploadedFile;
    const id = parseInt(req.params.id, 10);
    KnowledgeService.addFile(id, file)
      .then(() => res.sendStatus(201))
      .catch((e: Error) => res.status(500).json(e));
  },
};
