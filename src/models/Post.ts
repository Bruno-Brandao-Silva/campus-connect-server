import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  mediaUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postDate: { type: Date, default: Date.now },
  context: { type: String, enum: ['timeline', 'group'], required: true }, // Novo campo para contexto
  contextId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // ID do grupo (opcional)
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    commentDate: { type: Date, default: Date.now },
  }],
});

const Post = mongoose.model('Post', postSchema);

export default Post;
