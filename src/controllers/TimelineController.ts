import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';

const TimelineController = {
    getTimeline: async (req: Request, res: Response) => {
    try {
      const { _id } = req.UserJwtPayload;
      const user = await User.findById(_id);
      const publicUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        entryBadge: user.entryBadge,
        showEntryBadge: user.showEntryBadge
      }
      if (!user) return res.status(404).json({ error: 'User not found' });

      const users = [publicUser, ...await User.find({ _id: { $in: user.following } }).select('_id name username profilePicture entryBadge showEntryBadge')];
      const posts = await Post.find({
        $or: [
          { author: { $in: user.following } },
          { author: user._id },
        ]
      }).sort({ createdAt: -1 }).limit(20);

      if (!posts) return res.status(404).json({ error: 'Posts not found' });

      res.json({ users, posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching posts' });
    }
  }
}

export default TimelineController;