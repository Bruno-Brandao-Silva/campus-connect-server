import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { ObjectId } from 'mongoose';

const PostController = {
  createPost: async (req: Request, res: Response) => {
    try {
      const { _id } = req.UserJwtPayload;
      const { title, mediaId, context } = req.body;
      const post = await Post.create({ title, mediaId, author: _id, context });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Error creating post' });
    }
  },

  getMyPosts: async (req: Request, res: Response) => {
    try {
      const { _id } = req.UserJwtPayload;
      const user = await User.findById(_id);
      const posts = await Post.find({ author: _id }).sort({ createdAt: -1 }).limit(10);
      const postsWithAuthor = posts.map((post) => {
        return {
          id: post._id,
          avatar: user.profilePicture,
          username: user.name,
          userAt: user.username,
          createdAt: post.createdAt,
          showEntryBadge: user.showEntryBadge,
          entryBadge: user.entryBadge,
          description: post.title,
          file: post.mediaId
        }
      })
      res.json(postsWithAuthor);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching posts' });
    }
  },
  getPostsFromUserId: async (req: Request, res: Response) => {
    try {
      const { _id } = req.UserJwtPayload;

      const targetUserId = req.params.userId;

      const isFollowing = await User.exists({ _id, following: targetUserId });

      const searchCriteria = isFollowing ? { author: targetUserId } : { author: targetUserId, context: 'public' };

      const posts = await Post.find(searchCriteria).sort({ createdAt: -1 }).limit(10);

      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching posts' });
    }
  },
  likePost: async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { _id } = req.UserJwtPayload;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isLiked = post.likes.some((id: ObjectId) => id == _id);

      if (!isLiked) {
        post.likes.push(_id);
        await post.save();
      }

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error liking post' });
    }
  },

  unlikePost: async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { _id } = req.UserJwtPayload;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const isLiked = post.likes.some((id: ObjectId) => id == _id);

      if (isLiked) {
        post.likes = post.likes.filter((id: ObjectId) => id != _id);
        await post.save();
      }

      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error unliking post' });
    }
  },
  commentOnPost: async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { _id } = req.UserJwtPayload;
    const { text } = req.body;
    try {
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      post.comments.push({ commenter: _id, text });
      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error commenting post' });
    }
  },
  deletePost: async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { _id } = req.UserJwtPayload;
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      if (post.author.toString() !== _id) return res.status(401).json({ error: 'You are not authorized to delete this post' });
      await post.delete();
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting post' });
    }
  }
};

export default PostController;
