import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserEnum } from '../enum/user.enum';
import { UserRequest } from './jwt.interface';

export const ROLE_KEY = 'role';
export const Role = (...role: UserEnum[]) => SetMetadata(ROLE_KEY, role);

export const User = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
