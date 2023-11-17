import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		unique: true,
		required: false,
		trim: true,
		lowercase: true,
	},
	
	academicSchedule: {
		type: [String],
		required: false, // Opcional, dependendo dos requisitos
	},
	profilePicture: {
		type: mongoose.Schema.Types.Mixed,
		required: false, // Opcional, dependendo dos requisitos
	},
	entryYear: {
		type: Number,
		required: false, // Opcional, dependendo dos requisitos
	},
	entryPeriod: {
		type: Number,
		required: false, // Opcional, dependendo dos requisitos
	},
});

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

export default User;
