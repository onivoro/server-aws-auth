import { DynamicModule, Module } from '@nestjs/common';
import { AuthConfig } from './classes/auth-config.class';
import { moduleFactory } from '@onivoro/server-common';
import { AdminCognitoService } from './services/admin-cognito.service';
import { CognitoIdentityServiceProvider } from 'aws-sdk';


@Module({})
export class ServerAwsCognitoModule {
  static configure(config: AuthConfig, apiVersion?: string): DynamicModule {
    return moduleFactory({
      providers: [
        {
          provide: AdminCognitoService, useFactory: () => new AdminCognitoService(
            config,
            new CognitoIdentityServiceProvider({
              apiVersion: apiVersion || '2016-04-18',
              region: config.AWS_REGION,
            })
          )
        }
      ],
      module: ServerAwsCognitoModule,
    });
  }
}
