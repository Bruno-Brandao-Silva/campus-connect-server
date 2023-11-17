import { Request, Response } from 'express';
import Message from '../models/Message';

const MessageController = {
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { content, senderId, recipientId } = req.body;
      const message = await Message.create({ content, senderId, recipientId });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  },
};

export default MessageController;
