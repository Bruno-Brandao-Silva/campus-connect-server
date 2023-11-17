import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  dateTime: Date, // Data e hora do evento
  location: String,
  confirmedParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
