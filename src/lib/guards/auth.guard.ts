import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { accessTokenKey } from '../constants/access-token-key.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const hasToken = !!(request[accessTokenKey]);
    if(!hasToken) {
      console.warn(`${AuthGuard.name}: token missing`);
    }
    return hasToken;
  }
}
