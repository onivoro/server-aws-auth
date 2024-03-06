export interface IIdentityToken {
  sub: string;
  email_verified: boolean;
  address?: {
    formatted?: string;
  };
  birthdate?: string;
  iss: string;
  phone_number_verified: boolean;
  'cognito:username': string;
  given_name?: string;
  middle_name?: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: 'id';
  auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  family_name?: string;
  jti: string;
  email: string;
  name?: string;
}
