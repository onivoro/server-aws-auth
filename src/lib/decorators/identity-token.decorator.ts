import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import { identityTokenKey } from '../constants/identity-token-key.constant';
import { IIdentityToken } from '../interfaces/identity-token.interface';

export const IdentityToken = createParamDecorator(function (
  _data: any,
  ctx: ExecutionContext
) {
  const request = ctx.switchToHttp().getRequest();

  return request[identityTokenKey]
    ? (jsonwebtoken.decode(request[identityTokenKey]) as IIdentityToken)
    : {};
});
