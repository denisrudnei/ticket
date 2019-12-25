import express from 'express'
import ChatService from '../services/ChatService'
import { IAnalyst } from '../models/Analyst'

export default {
  createMessage: (req: express.Request, res: express.Response) => {
    const toId = req.body.to._id
    const fromId = req.session!.authUser._id
    const content = req.body.content
    ChatService.addMessage(fromId, toId, content)
      .then(messageToSend => {
        return res.status(200).json(messageToSend)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  changeStatus: (req: express.Request, res: express.Response) => {
    const userId = req.session!.authUser._id
    ChatService.changeStatus(userId, req.body.status)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getMessage: (req: express.Request, res: express.Response) => {
    const fromId = req.session!.authUser._id
    const toId = req.params.user as IAnalyst['_id']
    ChatService.get(fromId, toId)
      .then(messages => {
        return res.status(200).json(messages)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
