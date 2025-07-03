import { AuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEnum } from '../enum/user.enum';
import { ROLE_KEY } from './jwt.decorator';
import { UserRequest } from './jwt.interface';

// This guard checks if the user is authenticated using JWT
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// This guard checks if the user has the required roles
// It uses the ROLES_KEY to get the required roles from the route handler or class
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserEnum[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('User roles not found');
    }

    const hasRole = requiredRoles.some((role) => user.role!.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
