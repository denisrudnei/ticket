import express from 'express'
import Analyst from '../models/Analyst'
import ChatService from '~/server/services/ChatService'

export default {
  createMessage: (req: express.Request, res: express.Response) => {
    const toId = req.body.to.id
    const fromId = req.session!.authUser.id
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
    const userId = req.session!.authUser.id
    ChatService.changeStatus(userId, req.body.status)
      .then(() => {
        return res.sendStatus(201)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  },

  getMessage: (req: express.Request, res: express.Response) => {
    const fromId = req.session!.authUser.id
    const toId = parseInt(req.params.user)
    ChatService.get(fromId, toId)
      .then(messages => {
        return res.status(200).json(messages)
      })
      .catch((e: Error) => {
        return res.status(500).json(e)
      })
  }
}
