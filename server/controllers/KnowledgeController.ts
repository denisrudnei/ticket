import express from 'express'
import { UploadedFile } from 'express-fileupload'
import KnowledgeService from '~/server/services/knowledge/KnowledgeService'

export default {
  getFile: (req: express.Request, res: express.Response) => {
    const id = req.params.id
    KnowledgeService.getFile(parseInt(id))
      .then((file: Buffer) => {
        return res.end(file)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getAllFiles: (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id)
    KnowledgeService.getAllFiles(id)
      .then(file => {
        return res.end(file)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  addTempFile: (req: express.Request, res: express.Response) => {
    const file = req.files!.file as UploadedFile
    KnowledgeService.addTempFile(file)
      .then((data: string) => {
        return res.status(201).json(data)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  addFile: (req: express.Request, res: express.Response) => {
    const file = req.files!.file as UploadedFile
    const id = parseInt(req.params.id)
    KnowledgeService.addFile(id, file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
