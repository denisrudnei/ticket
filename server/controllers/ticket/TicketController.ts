import express from 'express';
import { UploadedFile } from 'express-fileupload';
import TicketService from '../../services/ticket/TicketService';

export default {
  getFile: (req: express.Request, res: express.Response) => {
    TicketService.getFile(req.params!.id)
      .then((result) => res.end(result))
      .catch((e: Error) => res.status(500).json(e));
  },

  deleteFile: async (req: express.Request, res: express.Response) => {
    await TicketService.removeFile(
      parseInt(req.params.id, 10),
      parseInt(req.params.file, 10),
    )
      .then(() => res.sendStatus(201))
      .catch((e: Error) => res.status(500).json(e));
  },

  sendFile: async (req: express.Request, res: express.Response) => {
    const files = Object.values(req.files!) as UploadedFile[];
    await TicketService.insertFile(parseInt(req.params.id, 10), files)
      .then((result) => res.status(200).json(result))
      .catch((e: Error) => res.status(500).json(e));
  },
};
