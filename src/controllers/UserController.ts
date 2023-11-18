import { Request, Response } from 'express';
import User from '../models/User';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { SignAuth } from '../middlewares/AuthMiddleware';
import mongoose from 'mongoose';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!;

const UserController = {
	login: async (req: Request, res: Response) => {
		try {
			const { academicRegistration, password } = req.body;
			const user = await User.findOne({ academicRegistration });

			if (!user) {
				const loginData = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: academicRegistration, password })
					.then((res: any) => res.data)

				const [userData, profilePicture, hashedPassword] = await Promise.all([
					axios.get(`${UTFPR_BASE_URI}/dados`, { headers: { Authorization: `Bearer ${loginData.token}` } })
						.then((res: any) => res.data),
					axios.get(`${UTFPR_BASE_URI}/fotoCracha`, { headers: { Authorization: `Bearer ${loginData.token}` } })
						.then((res: any) => res.data),
					bcrypt.hash(password, 10)
				]);

				const profileBuffer = Buffer.from(profilePicture, 'base64');

				const { year, period } = userData.cursos.reduce((prev: any, curr: any) => {
					return (prev.year > curr.alCuAnoingNr || (prev.year === curr.alCuAnoingNr && prev.period >= curr.alCuPerAnoingNr)) ? prev : curr;
				}, {});

				const newUser = await User.create({
					academicRegistration,
					password: hashedPassword,
					fullName: (userData.pessNomeVc as string).toProperCase(),
					profilePicture: profileBuffer,
					academicSchedule: userData.cursos.map((curso: any) => curso.cursNomeVc),
					entryYear: year,
					entryPeriod: period,
				});

				const token = SignAuth(res, newUser._id);

				return res.json({ statusText: "User registered successfully", token, firstAccess: true });
			} else {
				const isPasswordValid = await bcrypt.compare(password, user.password);

				if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

				const token = await SignAuth(res, user._id);

				return res.json({ statusText: "User already exists", token, firstAccess: false });
			}
		} catch (error: any) {
			if (error.response?.status === 401) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}
			console.error(error);
			return res.status(error.response?.status || 500).json({ message: error.message });
		}
	},

	get: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			const user = await User.findById(_id).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting user data' });
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
			res.status(500).json({ message: 'Error editing profile' });
		}
	},

	delete: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			await User.findByIdAndDelete(_id);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error deleting user' });
		}
	},
	deleteTestes: async (req: Request, res: Response) => {
		try {
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);
			await User.findByIdAndDelete(id);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error deleting user' });
		}
	},
	search: async (req: Request, res: Response) => {
		try {
			const { query } = req.params;
			const users = await User.find({
				$or: [
					{ fullName: { $regex: query as string, $options: 'i' } },
					{ username: { $regex: query as string, $options: 'i' } },
					{ academicSchedule: { $regex: query as string, $options: 'i' } },
				],
			}).select('_id fullName username profilePicture');
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error searching users' });
		}
	},
	getById: async (req: Request, res: Response) => {
		try {
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);
			const user = await User.findById(id).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting user data' });
		}
	},
	follow: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload!;
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);

			if (_id === id) {
				return res.status(400).json({ message: 'You cannot unfollow yourself' });
			}

			const user = await User.findById(_id);
			if (user.following.includes(id)) {
				return res.status(400).json({ message: 'You are already following this user' });
			}

			user.following.push(id);
			await user.save();

			await User.findByIdAndUpdate(id, { $addToSet: { followers: _id } });

			res.status(200).json({ message: 'You are now following this user' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error following user' });
		}
	},
	unfollow: async (req: Request, res: Response) => {
		try {
			const { _id } = req.UserJwtPayload;
			const id = new mongoose.Schema.Types.ObjectId(req.params.id);

			if (_id === id) {
				return res.status(400).json({ message: 'You cannot unfollow yourself' });
			}

			const user = await User.findById(_id);
			if (!user.following.includes(id)) {
				return res.status(400).json({ message: 'You are not following this user' });
			}


			user.following = user.following.filter((_id: mongoose.Schema.Types.ObjectId) => _id !== id);
			await user.save();

			await User.findByIdAndUpdate(id, { $pull: { followers: _id } });

			res.status(200).json({ message: 'You are not following this user anymore' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error unfollowing user' });
		}
	},
};

export default UserController;
