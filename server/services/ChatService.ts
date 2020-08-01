import { In } from 'typeorm';
import Message from '../models/chat/Message';
import Analyst from '../models/Analyst';
import Chat from '../models/chat/Chat';
import AnalystStatus from '../enums/AnalystStatus';

class ChatService {
  static getChats(fromId: Analyst['id']): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      Chat.find({ relations: ['participants'] }).then((result) => {
        const chats = result.filter((chat) => chat.participants
          .map((participant) => participant.id)
          .includes(fromId));
        resolve(chats);
      });
    });
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

  static readMessage(messageId: Message['id']): Promise<void> {
    return new Promise((resolve, reject) => {
      Message.findOne(messageId, { relations: ['read'] }).then((message) => {
        message!.read = [];
        message!.save().then(() => {
          resolve();
        });
      });
    });
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

  static addMessage(
    fromId: Analyst['id'],
    toId: Analyst['id'],
    content: string,
  ): Promise<Message> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(fromId, { relations: ['chats'] }).then(async (from) => {
        const to = await Analyst.findOne(toId, { relations: ['chats'] });

        const chat = await ChatService.getOne(fromId, toId);
        from!.chats.push(chat);
        const message = Message.create();
        message.to = to!;
        message.from = from!;
        message.date = new Date();
        message.content = content!;
        message.save().then(() => {
          chat.messages.push(message);
          chat.save().then(() => {
            resolve(message);
          });
        });
      });
    });
  }

  static get(fromId: Analyst['id'], toId: Analyst['id']): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      Message.find({
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
      }).then((messages: Message[]) => resolve(messages));
    });
  }

  static changeStatus(userId: Analyst['id'], status: AnalystStatus): Promise<Analyst> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then((analyst) => {
        analyst!.status = status;
        analyst!.save().then(() => {
          resolve(analyst);
        });
      });
    });
  }

  static updateLastActive(userId: Analyst['id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId).then((analyst) => {
        analyst!.lastTimeActive = new Date();
        analyst!.save().then(() => {
          resolve(analyst);
        });
      });
    });
  }
}

export default ChatService;
