import ChatService from '@/server/services/ChatService'
import Analyst from '~/server/models/Analyst'
import Chat from '~/server/models/chat/Chat'
import Message from '~/server/models/chat/Message'

describe('ChatService', function() {
  it('Should get one chat, if not exists, create a new one', async () => {
    const [to, from] = await Analyst.find()
    await ChatService.getOne(to!.id, from!.id)
  })

  it('Should return all chats', async () => {
    const user = await Analyst.findOne()
    await ChatService.getChats(user!.id)
  })

  it('Should get all unread messages from one chat', async () => {
    const user = await Analyst.findOne()
    const chat = await Chat.findOne()
    await ChatService.getUnReadMessagesFromChat(chat!.id, user!.id)
  })

  it('Should add a new message', async () => {
    const [to, from] = await Analyst.find()
    await ChatService.addMessage(from!.id, to!.id, 'hi')
  })

  it('Should mark a single message as read', async () => {
    const message = await Message.findOne()
    await ChatService.readMessage(message!.id)
  })

  it('Should change status from analyst', async () => {
    const user = await Analyst.findOne()
    await ChatService.changeStatus(user!.id, 'Online')
  })

  it('Should last time when user is active', async () => {
    const user = await Analyst.findOne()
    await ChatService.updateLastActive(user!.id)
  })

  it('Should get all messages from two users', async () => {
    const [to, from] = await Analyst.find()
    await ChatService.get(to!.id, from!.id)
  })
})
