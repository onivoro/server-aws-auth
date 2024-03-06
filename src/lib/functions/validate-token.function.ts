import { promisify } from 'util';
import * as jsonwebtoken from 'jsonwebtoken';
import {
  IClaimVerifyRequest,
  IMapOfKidToPublicKey,
  ITokenHeader,
} from '../interfaces/auth.interface';

const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

export const validateToken = async (
  request: IClaimVerifyRequest,
  cognitoPoolId: string,
  region: string,
  publicKeys: IMapOfKidToPublicKey
): Promise<any> => {
  const cognitoIssuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}`;

  let result: any;
  try {
    const token = request.token;
    const tokenSections = (token || '').split('.');
    if (tokenSections.length < 2) {
      throw new Error('requested token is invalid');
    }
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON) as ITokenHeader;
    const key = publicKeys[header.kid];
    if (key === undefined) {
      throw new Error('claim made for unknown kid');
    }
    const claim = await verifyPromised(token, key.pem);
    const currentSeconds = Math.floor(new Date().valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      throw new Error('claim is expired or invalid');
    }

    if (claim.iss !== cognitoIssuer) {
      throw new Error('claim issuer is invalid');
    }

    if (!['access', 'id'].includes(claim.token_use)) {
      throw new Error('claim use is not supported');
    }

    result = claim as any;
  } catch (error) {
    result = {} as any;
  }
  return result;
};
