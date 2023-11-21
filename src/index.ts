import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
import messageRoutes from './routes/MessageRoutes';
import fileRoutes from './routes/FileRoutes';
import mongoose from 'mongoose';
import './utils';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI!;
if (MONGODB_URI === undefined) throw new Error('MONGODB_URI is undefined');

//socket.io area

// io.on('connection', (socket: Socket) => {
//   console.log('Usuário conectado');

//   socket.on('login', (username: string) => {
//     // const user: User = { id: socket.id, username };
//     // users.push(user);
//     console.log(`${username} logado`);
//   });

//   socket.on('chat-message', ({ to, message }: { to: string; message: string }) => {
//     // const sender = users.find(user => user.id === socket.id);
//     // if (!sender) return;

//     // const receiver = users.find(user => user.username === to);
//     // if (!receiver) return;

//     // io.to(receiver.id).emit('chat message', { from: sender.username, message });
//   });

//   socket.on('disconnect', () => {
//     // const userIndex = users.findIndex(user => user.id === socket.id);
//     // if (userIndex !== -1) {
//     //   const username = users[userIndex].username;
//     //   users.splice(userIndex, 1);
//     //   console.log(`${username} desconectado`);
//     // }
//   });
// });

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/file', fileRoutes);

mongoose.connect(MONGODB_URI, {}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
  });
});