import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { credentials } from 'src/config/credential';
import { jwtExtract } from 'src/utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwt = jwtExtract(request);

    if (!jwt) {
      return false;
    }

    const user = verify(jwt, credentials.jwtSecret);
    if (!user || !user.data?.userId || !user.data?.email) {
      return false;
    }

    const userData: User = user.data;
    request.user = userData;
    return true;
  }
}

export interface User {
  userId: string,
  email: string,
}

