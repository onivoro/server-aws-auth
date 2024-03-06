import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';

import { AuthConfig } from './classes/auth-config.class';
import { AuthGuard } from './guards/auth.guard';
import { AuthController } from './controllers/auth.controller';
import { moduleFactory } from '@onivoro/server-common';
import { ServerAwsCognitoModule } from './server-aws-cognito.module';
import { MfaAuthService } from './services/mfa-auth.service';

const providers = [AuthService, AuthMiddleware, AuthGuard, MfaAuthService];

@Module({})
export class AuthModule {
  static configure(config: AuthConfig, apiVersion?: string): DynamicModule {
    return moduleFactory({
      module: AuthModule,
      providers: [
        ...providers,
        {
          provide: AuthConfig, useValue: config
        }
      ],
      controllers: [AuthController],
      imports: [ServerAwsCognitoModule.configure(config, apiVersion)]
    });
  }
}
