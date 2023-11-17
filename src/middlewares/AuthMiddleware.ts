import { Request, Response, NextFunction } from 'express';
import { sign, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
if (JWT_SECRET === undefined) throw new Error('JWT_SECRET is undefined');

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1] || req.cookies['CCS-AUTH-TOKEN'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, missing token' });
  }

  verify(token, JWT_SECRET, (error: any, user: any) => {
    if (error) {
      return res.status(403).json({ message: 'Access denied, invalid token' });
    }
    req.userId = user;
    next();
  });
};

export function signToken(_id: any) {
  return sign({_id}, JWT_SECRET);
};