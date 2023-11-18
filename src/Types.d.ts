import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      jwtToken: {
        _id: ObjectId; // Aqui ajustamos para o tipo ObjectId
        iat: number;
      };
    }
  }

  interface String {
    toProperCase(): string;
  }
}
