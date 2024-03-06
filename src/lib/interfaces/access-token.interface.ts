export interface IAccessToken {
  sub: string;
  // device_key: string;
  iss: string;
  client_id: string;
  // origin_jti: string;
  event_id: string;
  token_use: 'access';
  scope: 'aws.cognito.signin.user.admin';
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
  'cognito:groups': string[];
}
