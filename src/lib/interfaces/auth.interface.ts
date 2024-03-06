
export interface IAuthRegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface IAuthCredentialsDto {
  password: string;
  name: string;
}

export interface IAuthMfaDto {
  mfa: string;
  username: string;
}

export interface IClaimVerifyRequest {
  readonly token?: string;
}

export interface IClaimVerifyResult {
  readonly userName: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: any;
}

export interface ITokenHeader {
  kid: string;
  alg: string;
}
export interface IPublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
export interface IPublicKeyMeta {
  instance: IPublicKey;
  pem: string;
}

export interface PublicKeys {
  keys: IPublicKey[];
}

export interface IMapOfKidToPublicKey {
  [key: string]: IPublicKeyMeta;
}

export interface IClaim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}
