import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sentDate: { type: Date, default: Date.now },
  content: {
    text: String,
    media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' }, // Referência ao documento de mídia
  },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
