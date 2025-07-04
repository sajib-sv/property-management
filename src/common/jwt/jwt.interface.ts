import { Request } from 'express';
import { UserEnum } from '../enum/user.enum';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string | UserEnum;
}

export interface RequestPayload extends JWTPayload {
  [key: string]: any; // * Allow additional properties
}

export interface UserRequest extends Request {
  user?: RequestPayload;
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
