import knowledgeStatusService from '../../services/knowledge/KnowledgeStatusService'
import express from 'express'

export default {
  getAll: (_: express.Request, res: express.Response) => {
    knowledgeStatusService
      .getAll()
      .then(result => {
        return res.status(200).json(result)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
