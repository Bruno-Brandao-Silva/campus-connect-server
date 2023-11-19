import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		unique: true,
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
	},
	academicSchedule: {
		type: [String],
	},
	profilePicture: {
		type: Buffer,
	},
	showEntryBadge: {
		type: Boolean,
	},
	entryYear: {
		type: Number,
	},
	entryPeriod: {
		type: Number,
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