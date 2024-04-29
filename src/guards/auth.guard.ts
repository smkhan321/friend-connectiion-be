import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      // if the route is public, grant permission
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const uuid = req.headers['api-key'];
    if (uuid) {
      const user = await this.userService.findById(uuid);
      req['user'] = user;
      if (user) {
        return true;
      }
      return false;
    }
    return false;
  }
}
