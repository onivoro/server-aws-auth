import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessTokenRaw = createParamDecorator(function (
  _data: any,
  ctx: ExecutionContext
) {
  const request = ctx.switchToHttp().getRequest();

  return request['headers']['authorization']
    ? request['headers']['authorization']
    : '';
});
