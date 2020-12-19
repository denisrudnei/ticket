import express from 'express';
import { UploadedFile } from 'express-fileupload';
import AnalystService from '~/server/services/AnalystService';
import { getUser } from '../utils/authUtil';

export default {
  updateImage: async (req: express.Request, res: express.Response) => {
    const user = await getUser(req);
    if (!user) {
      return res.status(500).json({
        message: 'User not found',
      });
    }
    const userId = user.id;
    const file = req.files!.image as UploadedFile;
    return AnalystService.updateImage(userId, file)
      .then(() => res.sendStatus(202))
      .catch((e: Error) => res.status(500).json(e));
  },
};
