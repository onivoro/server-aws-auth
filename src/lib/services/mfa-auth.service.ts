import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokensDto } from '../dtos/auth-tokens.dto';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';

@Injectable()
export class MfaAuthService {
  mfaMap = new Map();

  constructor(private authService: AuthService) {}

  async login(authenticateRequest: AuthCredentialsDto) {
    try {
        const result: any = await this.authService.authenticateUser(
          authenticateRequest
        );
  
    const response: AuthTokensDto = {
          token: result?.accessToken?.jwtToken,
          idToken: result?.idToken?.jwtToken
        };
  
        return response;
      } catch (e) {
        throw new BadRequestException(e.message);
      }
  }

  async authenticate(authenticateRequest: AuthCredentialsDto) {
    try {
        const result: any = await this.authService.authenticateUser(
          authenticateRequest,
          (userData, newUser) => {
            this.mfaMap.set(userData.Username, newUser);
          }
        );

        return result; 
      } catch (e) {
        const cachedUser = this.mfaMap.get(authenticateRequest.name);
        if (cachedUser) {
          this.mfaMap.delete(authenticateRequest.name);
        }
        throw new BadRequestException(e.message);
      }
  }

  async logout(accessToken: any) {
    try {
        this.authService.logout({ name: accessToken.sub });
      } catch (e) {
        throw new BadRequestException(e.message);
      }
  }

  async validateMfa(username: string, mfa: string, isTotp?: boolean) {
    return new Promise((res, rej) => {
        this.mfaMap.get(username).sendMFACode(mfa, {
          onSuccess: (token) => {
            const payload = {
              username,
              token: token.getAccessToken().getJwtToken(),
              idToken: token.getIdToken().getJwtToken(),
            };
            this.mfaMap.delete(username);
            res(payload);
          },
          onFailure: (err) => {
            rej(err);
          },
        }, isTotp ? 'SOFTWARE_TOKEN_MFA' : '');
      });
  }
}
