import { Request } from 'express';
import { UserEnum } from '../enum/user.enum';

export interface RequestWithUser extends Request {
  user?: UserTokenPayload;
}

export interface UserTokenPayload {
  role: UserEnum[];
  email: string;
  userId: string;
  [key: string]: unknown;
}
