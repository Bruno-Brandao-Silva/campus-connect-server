import { Request, Response, NextFunction } from 'express';
import { SignJWT, jwtVerify } from 'jose'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv';
dotenv.config();

const expiresIn = 1000 * 60 * 60

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_KEY = "CCS-AUTH-TOKEN"

if (JWT_SECRET === undefined) throw new Error('JWT_SECRET is undefined');

export async function VerifyAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace('Bearer ', '') || req.header("Authorization")?.replace('Bearer ', '') || req.cookies[TOKEN_KEY];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, missing token' });
  }
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    req.UserJwtPayload = verified.payload as UserJwtPayload;
    next();
  } catch (err: any) {
    console.error(err)
    return res.status(403).json({ error: 'Access denied, invalid token' });
  }
}
export async function SignAuth(res: Response, _id: string) {
  const newDate = new Date(Date.now() + expiresIn)
  const token = await new SignJWT({ _id })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(newDate)
    .sign(new TextEncoder().encode(JWT_SECRET))
  res.cookie(TOKEN_KEY, token, { httpOnly: true, secure: false, expires: newDate });
  return { TOKEN_KEY, token, expires: newDate }
}
