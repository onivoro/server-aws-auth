import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthMfaDto } from '../dtos/auth-mfa.dto';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { AuthTokensDto } from '../dtos/auth-tokens.dto';
import { AccessToken } from '../decorators/access-token.decorator';
import { AdminCognitoService } from '../services/admin-cognito.service';
import { VerifyTotpDto } from '../dtos/verify-totp.dto';
import { MfaAuthService } from '../services/mfa-auth.service';
import { AccessTokenRaw } from '../decorators/access-token-raw.decorator';
import { SetPreferredMfaDto } from '../dtos/set-preferred-mfa.dto';

@Controller('auth')
export class AuthController {
  mfaMap = new Map();
  constructor(
    private readonly authService: AuthService, 
    private readonly mfaAuthService: MfaAuthService, 
    private readonly adminCognitoSvc: AdminCognitoService
  ) {}

  @Post('login')
  @ApiBody({type: AuthCredentialsDto})
  @ApiResponse({ type: AuthTokensDto }) 
  async login(@Body() authenticateRequest: AuthCredentialsDto) {
    return await this.mfaAuthService.login(authenticateRequest);
  }

  @Post('authenticate')
  @ApiBody({ type: AuthCredentialsDto })
  @ApiResponse({ type: AuthTokensDto })
  async authenticate(@Body() authenticateRequest: AuthCredentialsDto) {
    return await this.mfaAuthService.authenticate(authenticateRequest);
  }

  @Post('associate-software-token')
  async associateSoftwareToken(@AccessTokenRaw() accessToken: any) {
    return await this.adminCognitoSvc.getSecretCode(accessToken);
  }

  @Post('verify-software-token')
  @ApiBody({ type: VerifyTotpDto })
  async verifySoftwareToken(@Body() verifyTotpRequest: VerifyTotpDto, @AccessTokenRaw() accessToken: any) {
    return await this.adminCognitoSvc.vefifyTotpToken(accessToken, verifyTotpRequest.userCode);
  }

  @Post('set-preferred-mfa')
  @ApiBody({ type: SetPreferredMfaDto })
  async setPreferredMfa(@Body() setPreferredMfaRequest: SetPreferredMfaDto, @AccessTokenRaw() accessToken: any) {
    return await this.adminCognitoSvc.setCognitoPreferredMfa(setPreferredMfaRequest.smsPreferred, accessToken);
  }

  @Post('logout')
  async logout(@AccessToken() accessToken: any) {
    return await this.mfaAuthService.logout(accessToken);
  }

  @Post('validate-mfa')
  @ApiBody({ type: AuthMfaDto })
  @ApiResponse({ type: AuthTokensDto })
  async validateMfaCode(@Body() { mfa, username, isTotp }: AuthMfaDto) {
    return await this.mfaAuthService.validateMfa(username, mfa, isTotp)
  }
}
