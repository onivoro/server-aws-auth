import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAccessToken } from '../interfaces/access-token.interface';
import { accessTokenKey } from '../constants/access-token-key.constant';

export const AccessToken = createParamDecorator(function (
  _data: any,
  ctx: ExecutionContext
) {
  const request = ctx.switchToHttp().getRequest();

  return request[accessTokenKey]
    ? (request[accessTokenKey] as IAccessToken)
    : {};
});
