import { Request, Response } from 'express';
import User from '../models/User';

const UserController = {
	getDataById: async (req: Request, res: Response) => {
		try {
			const userId = req.userId;
			const users = await User.find({ _id: userId });
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting users' });
		}
	},
	getPublicData: async (req: Request, res: Response) => {
		try {
			const users = await User.find();
			// Remove os campos que não devem ser públicos
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting users' });
		}
	},
	getPublicDataById: async (req: Request, res: Response) => {
		try {
			const userId = req.params.id;
			const users = await User.find({ _id: userId });
			// Remove os campos que não devem ser públicos

			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error getting users' });
		}
	},


	edit: async (req: Request, res: Response) => {
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
			// const userId = req.userId;
			const userId = req.params.id;
			await User.findByIdAndDelete(userId);
			res.json({ message: 'User deleted successfully' });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Error deleting user' });
		}
	}
};

export default UserController;
