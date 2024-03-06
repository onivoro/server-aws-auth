
import { ApiProperty } from '@nestjs/swagger';
import { IAccessToken } from '../interfaces/access-token.interface';

export class AccessTokenDto implements IAccessToken {
  @ApiProperty({ type: 'string', name: 'sub' }) sub: string;
  // @ApiProperty({ type: 'string', name: 'device_key' }) device_key: string;
  @ApiProperty({ type: 'string', name: 'iss' }) iss: string;
  @ApiProperty({ type: 'string', name: 'client_id' }) client_id: string;
  // @ApiProperty({ type: 'string', name: 'origin_jti' }) origin_jti: string;
  @ApiProperty({ type: 'string', name: 'event_id' }) event_id: string;
  @ApiProperty({ type: 'string', name: 'token_use' }) token_use: 'access';
  @ApiProperty({ type: 'string', name: 'scope' })
  scope: 'aws.cognito.signin.user.admin';
  @ApiProperty({ type: 'string', name: 'auth_time' }) auth_time: number;
  @ApiProperty({ type: 'string', name: 'exp' }) exp: number;
  @ApiProperty({ type: 'string', name: 'iat' }) iat: number;
  @ApiProperty({ type: 'string', name: 'jti' }) jti: string;
  @ApiProperty({ type: 'string', name: 'username' }) username: string;
  @ApiProperty({ type: 'string', name: 'cognito:groups', isArray: true })
  'cognito:groups': string[];
}
