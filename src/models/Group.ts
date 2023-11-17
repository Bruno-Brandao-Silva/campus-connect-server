import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name: String,
  description: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
