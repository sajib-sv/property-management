import { Request } from 'express';
import { UserEnum } from '../enum/user.enum';

export interface TokenPayload {
  role: UserEnum[];
  email: string;
  userId: string;
  [key: string]: any; // * Allow additional properties
}

export interface UserRequest extends Request {
  user?: TokenPayload;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}
export interface JWTOptions {
  secret: string;
  expiresIn: string;
}
export interface JWTVerifyOptions {
  secret: string;
  ignoreExpiration?: boolean;
}
export interface JWTSignOptions {
  secret: string;
  expiresIn?: string;
}
