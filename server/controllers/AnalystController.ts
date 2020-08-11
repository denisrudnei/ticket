import express from 'express';
import { UploadedFile } from 'express-fileupload';
import AnalystService from '~/server/services/AnalystService';

export default {
  updateImage: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser.id;
    const file = req.files!.image as UploadedFile;
    AnalystService.updateImage(userId, file)
      .then(() => res.sendStatus(202))
      .catch((e: Error) => res.status(500).json(e));
  },
};
