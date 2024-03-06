import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { getPublicKeys } from '../functions/get-public-keys.function';
import { validateToken } from '../functions/validate-token.function';
import * as jsonwebtoken from 'jsonwebtoken';
import { IAuthCredentialsDto, IMapOfKidToPublicKey } from '../interfaces/auth.interface';
import { AuthConfig } from '../classes/auth-config.class';

@Injectable()
export class AuthService implements OnModuleInit {
  private authConfig: {
    UserPoolId: string;
    ClientId: string;
    region: string;
  };

  private keys: IMapOfKidToPublicKey;

  constructor(private config: AuthConfig) {

    this.authConfig = {
      UserPoolId: this.config.AWS_COGNITO_USER_POOL_ID,
      ClientId: this.config.AWS_COGNITO_CLIENT_ID,
      region: this.config.AWS_REGION,
    };
  }

  async onModuleInit() {
    const { AWS_REGION, AWS_COGNITO_USER_POOL_ID } = this.config;
    const cognitoIssuer = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${AWS_COGNITO_USER_POOL_ID}`;

    this.keys = await getPublicKeys(cognitoIssuer);
  }

  get poolData() {
    return {
      UserPoolId: this.authConfig.UserPoolId,
      ClientId: this.authConfig.ClientId,
    };
  }

  get userPool() {
    return new CognitoUserPool({
      UserPoolId: this.authConfig.UserPoolId,
      ClientId: this.authConfig.ClientId,
    });
  }

  async authenticateUser(
    user: IAuthCredentialsDto,
    validateMfa?: (userData: {
      Username: string,
      Pool: CognitoUserPool
    }, newUser: CognitoUser) => void
  ): Promise<{ username: string }> {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      let result: any;
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (r) => {
          result = r;
          if(!this.config.mfaEnabled) {
            resolve({ username: userData.Username, result } as any);
          }
        },
        onFailure: (error) => {
          console.error({
            msg: `failed to authenticate user ${name}`,
            error
          });
          reject(error);
        },
        mfaRequired: (d) => {
          if(this.config.mfaEnabled) {
            if (!validateMfa) {
              throw new InternalServerErrorException(`${AuthService.name}.${AuthService.prototype.authenticateUser.name} missing mfa callback. If this was intentional, disable mfa via ${AuthConfig.name}.`);
            } else {
              validateMfa(userData, newUser);
            }
          }
          resolve({ username: userData.Username });
        },
        totpRequired: (d) => {
          if(this.config.mfaEnabled) {
            if (!validateMfa) {
              throw new InternalServerErrorException(`${AuthService.name}.${AuthService.prototype.authenticateUser.name} missing mfa callback. If this was intentional, disable mfa via ${AuthConfig.name}.`);
            } else {
              validateMfa(userData, newUser);
            }
          }
          resolve({ username: userData.Username });
        }
      });
    });
  }

  async logout(user: Pick<IAuthCredentialsDto, 'name'>) {
    const { name } = user;
    try {
      const userData = {
        Username: name,
        Pool: this.userPool,
      };
      const newUser = new CognitoUser(userData);
      return new Promise((resolve) => {
        return newUser.signOut(() => resolve({}));
      });
    } catch (e: any) {
      console.error(
        `failed to logout user.name "${name}" with error ${e?.message}`
      );
    }
  }

  async validateToken({ token }) {
    const { AWS_COGNITO_USER_POOL_ID, AWS_REGION, AWS_COGNITO_CLIENT_ID } =
      this.config;

    return AWS_COGNITO_CLIENT_ID
      ? await validateToken(
          { token },
          AWS_COGNITO_USER_POOL_ID,
          AWS_REGION,
          this.keys
        )
      : jsonwebtoken.decode(token);
  }
}
