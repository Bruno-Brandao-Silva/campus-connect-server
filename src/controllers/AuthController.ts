import { Request, Response } from 'express';
import Auth from "../models/Auth";
import axios from 'axios';
import bcrypt from 'bcrypt';
import { signToken } from '../middlewares/AuthMiddleware';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!; // URL base da API Portal do Aluno

const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            const { academicRegistration, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Auth.find({ academicRegistration });
            if (user.length === 0) {
                const { data: login_data } = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: academicRegistration, password });
                await Auth.create({
                    academicRegistration,
                    password: hashedPassword,
                   
                });
                const user = await Auth.find({ academicRegistration });
                const token = signToken(user[0]._id);
                res.cookie('CCS-AUTH-TOKEN', token);
                // prosseguir com o cadastro do usuário na rota 'api/user/create'
                
                // return res.json({ statusText: "Usuário cadastrado com sucesso", token, firstAcess: true });
            } else {
                const token = signToken(user[0]._id);
                res.cookie('CCS-AUTH-TOKEN', token);
                return res.json({ statusText: "Usuário  já existe", token, firstAcess: false });
            }
        } catch (error: any) {
            console.error(error);
            return res.status(error.response.status).json({ message: error.message });
        }
    },
};

export default AuthController;
/*

import { Request, Response } from 'express';
import Auth from "../models/Auth";
import axios from 'axios';
import bcrypt from 'bcrypt';
import { signToken } from '../middlewares/AuthMiddleware';

const UTFPR_BASE_URI = process.env.UTFPR_BASE_URI!; // URL base da API Portal do Aluno

const AuthController = {
    login: async (req: Request, res: Response) => {
        try {
            const { academicRegistration, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await Auth.find({ academicRegistration });
            if (user.length === 0) {
                console.log("Usuário não existe, fazendo requisição para o Portal do Aluno");
                const { data: login_data } = await axios.post(`${UTFPR_BASE_URI}/auth`, { username: academicRegistration, password });
                // const { data: user_data } = await axios.get(`${UTFPR_BASE_URI}/dados`, { headers: { Authorization: `Bearer ${login_data.token}` } });
                // const { data: profilePicture } = await axios.get(`${UTFPR_BASE_URI}/fotoCracha`, { headers: { Authorization: `Bearer ${login_data.token}` } });
                // const profileBuffer = Buffer.from(profilePicture, 'base64');

                // const { year, period } = user_data.cursos.map((curso: any) => { return { year: curso.alCuAnoingNr, period: curso.alCuPerAnoingNr } }).reduce((prev: any, curr: any) => {
                //     if (prev.year > curr.year) {
                //         return prev;
                //     } else if (prev.year < curr.year) {
                //         return curr;
                //     } else {
                //         if (prev.period > curr.period) {
                //             return prev;
                //         } else {
                //             return curr;
                //         }
                //     }
                // });
                await Auth.create({
                    academicRegistration,
                    password: hashedPassword,
                    // fullName: (user_data.pessNomeVc as string),
                    // profilePicture: profileBuffer,
                    // academicSchedule: user_data.cursos.map((curso: any) => curso.cursNomeVc),
                    // entryYear: year,
                    // entryPeriod: period,
                });
                const user = await Auth.find({ academicRegistration });
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
};

export default AuthController;*/