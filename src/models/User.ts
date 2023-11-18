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
	about: {
		type: String,
		required: false,
	},
	academicSchedule: {
		type: [String],
		required: false,
	},
	profilePicture: {
		type: Buffer,
		required: false,
	},
	entryYear: {
		type: Number,
		required: false,
	},
	entryPeriod: {
		type: Number,
		required: false,
	},
	following: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	}],
	
},
	{ timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

export default User;