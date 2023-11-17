import { Request, Response } from 'express';
import Post from '../models/Post';

const PostController = {
  createPost: async (req: Request, res: Response) => {
    try {
      const { title, mediaUrl, contextId } = req.body;
      const post = await Post.create({ title, mediaUrl, author: req.userId, context: contextId ? 'group' : 'timeline' });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  },

  getPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts' });
    }
  },
};

export default PostController;
