import { In } from 'typeorm';
import Message from '../models/chat/Message';
import Analyst from '../models/Analyst';
import Chat from '../models/chat/Chat';
import AnalystStatus from '../enums/AnalystStatus';

class ChatService {
  static async getChats(fromId: Analyst['id']): Promise<Chat[]> {
    const result = await Chat.find({ relations: ['participants'] });
    const chats = result.filter((chat) => chat.participants
      .map((participant) => participant.id)
      .includes(fromId));

    return chats;
  }

  static async getUnReadMessagesFromChat(
    chatId: Chat['id'],
    userId: Analyst['id'],
  ): Promise<Message[]> {
    const chat = await Chat.findOne(chatId, {
      relations: ['messages', 'messages.from', 'messages.read'],
    });

    // FIXME not getting analyst list from messages
    const unReadMessages = chat!.messages.filter((message) => (
      message.from.id !== userId
        && !message.read.map((analyst) => analyst.id).includes(userId)
    ));
    return unReadMessages;
  }

  static async readMessage(messageId: Message['id']): Promise<void> {
    const message = await Message.findOne(messageId, { relations: ['read'] });
    if (!message) throw new Error('Message not found');
    message.read = [];
    await message.save();
  }

  static async getOne(fromId: Analyst['id'], toId: Analyst['id']): Promise<Chat> {
    const result = await Chat.find({ relations: ['participants', 'messages'] });
    const to = await Analyst.findOne(toId);
    const from = await Analyst.findOne(fromId);
    const chats = result.filter((chat) => {
      const participantsIds = chat.participants.map(
        (participant) => participant.id,
      );
      return (
        participantsIds.includes(from!.id)
          && participantsIds.includes(to!.id)
      );
    });
    if (chats.length === 0) {
      const chat = Chat.create();
      chat.participants = [];
      chat.messages = [];
      chat.participants.push(to!, from!);
      return chat.save();
    }
    return chats[0];
  }

  static async addMessage(
    fromId: Analyst['id'],
    toId: Analyst['id'],
    content: string,
  ): Promise<Message> {
    const from = await Analyst.findOne(fromId, { relations: ['chats'] });
    const to = await Analyst.findOne(toId, { relations: ['chats'] });

    if (!from || !to) throw new Error('Analyst not found');

    const chat = await ChatService.getOne(fromId, toId);

    from.chats.push(chat);

    const message = Message.create();

    message.to = to;
    message.from = from;
    message.date = new Date();
    message.content = content!;

    await message.save();

    chat.messages.push(message);
    chat.save();

    return message;
  }

  static async get(fromId: Analyst['id'], toId: Analyst['id']): Promise<Message[]> {
    return Message.find({
      where: [
        {
          from: fromId,
          to: toId,
        },
        {
          from: toId,
          to: fromId,
        },
      ],
    });
  }

  static async changeStatus(userId: Analyst['id'], status: AnalystStatus): Promise<Analyst> {
    const analyst = await Analyst.findOne(userId);
    if (!analyst) throw new Error('Analyst not found');
    analyst.status = status;
    const savedAnalyst = await analyst.save();
    return savedAnalyst;
  }

  static async updateLastActive(userId: Analyst['id']) {
    const analyst = await Analyst.findOne(userId);
    if (!analyst) throw new Error('Analyst not found');
    analyst.lastTimeActive = new Date();
    const savedAnalyst = await analyst!.save();
    return savedAnalyst;
  }
}

export default ChatService;
