import KnowledgeService from '../../services/knowledge/KnowledgeService'
import express from 'express'
import { UploadedFile } from 'express-fileupload'

export default {
  getUnCategorized: (req: express.Request, res: express.Response) => {
    KnowledgeService.getUnCategorized()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getAll: (_: express.Request, res: express.Response) => {
    KnowledgeService.getAll()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getOne: (req: express.Request, res: express.Response) => {
    const id = req.params.id
    KnowledgeService.getOne(id as any)
      .then(knowledge => {
        return res.status(200).json(knowledge)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getFile: (req: express.Request, res: express.Response) => {
    const id = req.params.id
    KnowledgeService.getFile(id)
      .then(file => {
        return res.end(file)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getAllFiles: (req: express.Request, res: express.Response) => {
    const id = req.params.id
    KnowledgeService.getAllFiles(id)
      .then(file => {
        return res.end(file)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getByKnowledgeGroup: (req: express.Request, res: express.Response) => {
    const groupName = req.params.groupName
    KnowledgeService.getByKnowledgeGroup(groupName)
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  create: (req: express.Request, res: express.Response) => {
    const knowledge = req.body

    KnowledgeService.create(knowledge)
      .then(result => {
        return res.status(201).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  edit: (req: express.Request, res: express.Response) => {
    const knowledge = req.body

    KnowledgeService.updateKnowledge(req.params.id, knowledge)
      .then(result => {
        return res.status(201).json(result)
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
    const id = req.params.id
    KnowledgeService.addFile(id, file)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  remove: (req: express.Request, res: express.Response) => {
    const knowledgeId = req.params.id
    KnowledgeService.remove(knowledgeId)
      .then(() => {
        return res.sendStatus(202)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
