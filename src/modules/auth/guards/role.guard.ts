import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext)   {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user?.role ?? UserRole.USER;
    if (requiredRoles.includes(userRole as UserRole)) {
      return true;
    }
    throw new ForbiddenException();
  }
}
