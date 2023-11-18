import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      UserJwtPayload: UserJwtPayload;
    }
  }

  type UserJwtPayload = {
    _id: ObjectId; // Aqui ajustamos para o tipo ObjectId
    jti: string;
    iat: number;
    exp: number;
  }
  interface String {
    toProperCase(): string;
  }
}
