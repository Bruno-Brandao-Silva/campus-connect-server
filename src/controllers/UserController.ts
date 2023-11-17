import { Request, Response } from 'express';
import User from '../models/User';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { signToken } from '../middlewares/AuthMiddleware';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!;

const UserController = {
	login: async (req: Request, res: Response) => {
		try {
			const { academicRegistration, password } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await User.findOne({ academicRegistration });

			if (!user) {
				const { data: loginData } = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: academicRegistration, password });
				const { data: userData } = await axios.get(`${UTFPR_BASE_URI}/dados`, { headers: { Authorization: `Bearer ${loginData.token}` } });
				const { data: profilePicture } = await axios.get(`${UTFPR_BASE_URI}/fotoCracha`, { headers: { Authorization: `Bearer ${loginData.token}` } });
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

				const token = signToken(newUser._id);
				res.cookie('CCS-AUTH-TOKEN', token);
				return res.json({ statusText: "User registered successfully", token, firstAccess: true });
			} else {
				const token = signToken(user._id);
				res.cookie('CCS-AUTH-TOKEN', token);
				return res.json({ statusText: "User already exists", token, firstAccess: false });
			}
		} catch (error: any) {
			console.error(error);
			return res.status(error.response?.status || 500).json({ message: error.message });
		}
	},

	get: async (req: Request, res: Response) => {
		try {
			const userId = req.userId;
			const user = await User.findById(userId).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting user data' });
		}
	},


	patch: async (req: Request, res: Response) => {
		try {
			const userId = req.userId;
			const updatedFields = req.body;
			const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
			res.json(updatedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error editing profile' });
		}
	},

	delete: async (req: Request, res: Response) => {
		try {
			const userId = req.userId;
			await User.findByIdAndDelete(userId);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error deleting user' });
		}
	},
	deleteTestes: async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
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
			const { id } = req.params;
			const user = await User.findById(id).select('-password');
			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting user data' });
		}
	},
};

export default UserController;
