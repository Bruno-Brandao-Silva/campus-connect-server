import { Request, Response } from 'express';
import User from '../models/User';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { SignAuth } from '../middlewares/AuthMiddleware';
import mongoose from 'mongoose';
import { ConnectToDb } from '../models/File';
import { Readable } from 'stream';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!;

const UserController = {
	login: async (req: Request, res: Response) => {
		try {
			const { login, password } = req.body;
			const user = await User.findOne({ $or: [{ academicRegistration: login }, { username: login }] });

			if (!user) {
				if (!/^\d+$/.test(login)) {
					return res.status(400).json({ error: 'Invalid academic registration' });
				}

				const loginData = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: 'a' + login, password })
					.then((res: any) => res.data)

				const [userData, profilePictureData, hashedPassword] = await Promise.all([
					axios.get(`${UTFPR_BASE_URI}/dados`, { headers: { Authorization: `Bearer ${loginData.token}` } })
						.then((res: any) => res.data),
					axios.get(`${UTFPR_BASE_URI}/fotoCracha`, { headers: { Authorization: `Bearer ${loginData.token}` } })
						.then((res: any) => res.data),
					bcrypt.hash(password, 10)
				]);

				const buffer = Buffer.from(profilePictureData, 'base64');
				const mimetype = 'image/jpeg';
				const { bucket } = await ConnectToDb();

				const filename = ("profilePicture" + userData.pessNomeVc + ".jpg").replace(/[^a-z0-9]/gi, '-').toLowerCase();

				const stream = Readable.from(buffer);

				const uploadStream = bucket.openUploadStream(filename, {
					contentType: mimetype,
				});
				stream.pipe(uploadStream);
				console.log(userData.cursos);
				const { alCuAnoingNr: year, alCuPerAnoingNr: period } = userData.cursos.reduce((prev: any, curr: any) => {
					return (prev.year > curr.alCuAnoingNr || (prev.year === curr.alCuAnoingNr && prev.period >= curr.alCuPerAnoingNr)) ? prev : curr;
				}, {});
				console.log(year, period);

				const newUser = await User.create({
					academicRegistration: login,
					password: hashedPassword,
					name: (userData.pessNomeVc as string).toProperCase(),
					profilePicture: uploadStream.id,
					academicSchedule: userData.cursos.map((curso: any) => curso.cursNomeVc),
					entryBadge: `${year}.${period}`,
				});

				const token = await SignAuth(res, newUser._id);

				return res.json({ ...token, firstAccess: true });
			} else {
				const isPasswordValid = await bcrypt.compare(password, user.password);

				if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });

				const token = await SignAuth(res, user._id);
				const firstAccess = user.username ? false : true;
				return res.json({ ...token, firstAccess });
			}
		} catch (error: any) {
			if (error.response?.status === 401) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}
			console.error(error);
			return res.status(error.response?.status || 500).json({ error: error.message });
		}
	},

	get: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			const user = await User.findById(_id).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error getting user data' });
		}
	},


	patch: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			const updatedFields = req.body;
			await User.findByIdAndUpdate(_id, updatedFields, { new: true });
			res.status(200).json({ message: 'Profile edited successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error editing profile' });
		}
	},

	delete: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			await User.findByIdAndDelete(_id);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error deleting user' });
		}
	},
	deleteTestes: async (req: Request, res: Response) => {
		try {
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);
			await User.findByIdAndDelete(id);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error deleting user' });
		}
	},
	search: async (req: Request, res: Response) => {
		try {
			const { query } = req.params;
			const users = await User.find({
				$or: [
					{ name: { $regex: query as string, $options: 'i' } },
					{ username: { $regex: query as string, $options: 'i' } },
					{ academicSchedule: { $regex: query as string, $options: 'i' } },
				],
			}).select('_id name username profilePicture').limit(10);
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error searching users' });
		}
	},
	getById: async (req: Request, res: Response) => {
		try {
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);
			const user = await User.findById(id).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error getting user data' });
		}
	},
	follow: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload!;
			const id = req.params.id as unknown as mongoose.Schema.Types.ObjectId;
			console.log(_id, id);
			if (_id === id) {
				return res.status(400).json({ error: 'You cannot follow yourself' });
			}

			const user = await User.findById(_id);
			if (user.following.includes(id)) {
				return res.status(400).json({ error: 'You are already following this user' });
			}

			user.following.push(id);
			await user.save();

			await User.findByIdAndUpdate(id, { $addToSet: { followers: _id } });

			res.status(200).json({ message: 'You are now following this user' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error following user' });
		}
	},
	unfollow: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);

			if (_id === id) {
				return res.status(400).json({ error: 'You cannot unfollow yourself' });
			}

			const user = await User.findById(_id);
			if (!user.following.includes(id)) {
				return res.status(400).json({ error: 'You are not following this user' });
			}


			user.following = user.following.filter((_id: mongoose.Schema.Types.ObjectId) => _id !== id);
			await user.save();

			await User.findByIdAndUpdate(id, { $pull: { followers: _id } });

			res.status(200).json({ message: 'You are not following this user anymore' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Error unfollowing user' });
		}
	},
};

export default UserController;
