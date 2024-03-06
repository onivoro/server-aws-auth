import * as Axios from 'axios';

import jwkToPem from 'jwk-to-pem';
import { IMapOfKidToPublicKey, PublicKeys } from '../interfaces/auth.interface';

export const getPublicKeys = async (
  cognitoIssuer: string
): Promise<IMapOfKidToPublicKey> => {
  const url = `${cognitoIssuer}/.well-known/jwks.json`;
  const publicKeys = await Axios.default.get<PublicKeys>(url);
  const keys = publicKeys.data.keys.reduce((agg, current) => {
    const pem = jwkToPem(current as any);
    agg[current.kid] = { instance: current, pem };
    return agg;
  }, {} as IMapOfKidToPublicKey);

  return keys;
};
