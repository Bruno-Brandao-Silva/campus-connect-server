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
	academicRegistration: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	academicSchedule: {
		type: [String],
		required: false, // Opcional, dependendo dos requisitos
	},
	profilePicture: {
		type: Buffer,
		required: false, // Opcional, dependendo dos requisitos
	},
	entryYear: {
		type: Number,
		required: false, // Opcional, dependendo dos requisitos
	},
	entryPeriod: {
		type: Number,
		required: false, // Opcional, dependendo dos requisitos
	}
},
	{ timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

export default User;