import { Request, Response } from 'express';
import User from '../models/User';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { signToken } from '../middlewares/AuthMiddleware';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!; // URL base da API Portal do Aluno

const UserController = {
	login: async (req: Request, res: Response) => {
		try {
			const { academicRegistration, password } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await User.find({ academicRegistration });
			if (user.length === 0) {
				console.log("Usuário não existe, fazendo requisição para o Portal do Aluno");
				const { data: login_data } = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: academicRegistration, password });
				const { data: user_data } = await axios.get(`${UTFPR_BASE_URI}/dados`, { headers: { Authorization: `Bearer ${login_data.token}` } });
				const { data: profilePicture } = await axios.get(`${UTFPR_BASE_URI}/fotoCracha`, { headers: { Authorization: `Bearer ${login_data.token}` } });
				const profileBuffer = Buffer.from(profilePicture, 'base64');

				const { year, period } = user_data.cursos.map((curso: any) => { return { year: curso.alCuAnoingNr, period: curso.alCuPerAnoingNr } }).reduce((prev: any, curr: any) => {
					if (prev.year > curr.year) {
						return prev;
					} else if (prev.year < curr.year) {
						return curr;
					} else {
						if (prev.period > curr.period) {
							return prev;
						} else {
							return curr;
						}
					}
				});
				await User.create({
					academicRegistration,
					password: hashedPassword,
					fullName: (user_data.pessNomeVc as string),
					profilePicture: profileBuffer,
					academicSchedule: user_data.cursos.map((curso: any) => curso.cursNomeVc),
					entryYear: year,
					entryPeriod: period,
				});
				const user = await User.find({ academicRegistration });
				console.log(user[0]);
				const token = signToken(user[0]._id);
				res.cookie('CCS-AUTH-TOKEN', token);
				return res.json({ statusText: "Usuário cadastrado com sucesso", token, firstAcess: true });
			} else {
				const token = signToken(user[0]._id);
				console.log(user[0]);
				res.cookie('CCS-AUTH-TOKEN', token);
				return res.json({ statusText: "Usuário  já existe", token, firstAcess: false });
			}
		} catch (error: any) {
			console.error(error);
			return res.status(error.response.status).json({ message: error.message });
		}
	},
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