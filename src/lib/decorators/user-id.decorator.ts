import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { accessTokenKey } from '../constants/access-token-key.constant';
import { IAccessToken } from '../interfaces/access-token.interface';

export const UserId = createParamDecorator(function (
  _data: any,
  ctx: ExecutionContext
) {
  const request = ctx.switchToHttp().getRequest();

  return request[accessTokenKey]
    ? (request[accessTokenKey] as IAccessToken).sub
    : undefined;
});
