import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AdminSetUserMFAPreferenceRequest, AssociateSoftwareTokenRequest, SetUserMFAPreferenceRequest, UsersListType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AuthConfig } from '../classes/auth-config.class';
import { convertObjectToAttributeList } from '../functions/convert-object-to-attribute-list.function';

@Injectable()
export class AdminCognitoService {

  constructor(public config: AuthConfig,
    private cognitoIdentityService: CognitoIdentityServiceProvider) {
  }

  async getSecretCode(AccessToken: string): Promise<any> {
    return this.cognitoIdentityService.associateSoftwareToken({AccessToken}).promise();
  }

  async vefifyTotpToken(AccessToken: string, UserCode: string) {
    return this.cognitoIdentityService.verifySoftwareToken({AccessToken, UserCode}).promise();
  }

  deleteAdminUser(Username: string) {
    const { AWS_COGNITO_USER_POOL_ID } = this.config;
    return new Promise((resolve, reject) => {
      this.cognitoIdentityService.adminDeleteUser(
        { UserPoolId: AWS_COGNITO_USER_POOL_ID, Username },
        (error, result) => {
          if (error) {
            console.error({
              msg: `failed to delete ${Username}`,
              context: AdminCognitoService.prototype.deleteAdminUser.name,
              error,
            });
            if (error?.code === 'UserNotFoundException') {
              resolve({});
            } else {
              reject(error);
            }
          } else {
            console.log({
              msg: `deleted ${Username}`,
              context: AdminCognitoService.prototype.deleteAdminUser.name,
              error,
            });
            resolve(result);
          }
        }
      );
    });
  }

  async getCognitoUser(Username: string) {
    try {
      const { AWS_COGNITO_USER_POOL_ID } = this.config;
      return await this.cognitoIdentityService
        .adminGetUser({
          Username,
          UserPoolId: AWS_COGNITO_USER_POOL_ID,
        })
        .promise();
    } catch (e) { }
  }

  async adminCreateUser(usernameOverride: string, password: string, attributes: Record<string, string | number | null | undefined>) {

    const { AWS_COGNITO_USER_POOL_ID: UserPoolId } = this.config;

    const params: CognitoIdentityServiceProvider.AdminCreateUserRequest = {
      ForceAliasCreation: false,
      MessageAction: 'SUPPRESS',
      UserAttributes: convertObjectToAttributeList(attributes),
      Username: usernameOverride,
      UserPoolId,
    };

    const data = await this.cognitoIdentityService
      .adminCreateUser(params)
      .promise();

    const { Username } = data.User;

    const passwordParams: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordRequest =
    {
      Permanent: true,
      UserPoolId,
      Username,
      Password: password,
    };

    await this.cognitoIdentityService
      .adminSetUserPassword(passwordParams)
      .promise();

    return Username;
  }

  async setUserPassword(UserPoolId: string, email: string, Password: string) {
    const passwordParams: CognitoIdentityServiceProvider.Types.AdminSetUserPasswordRequest =
    {
      Permanent: true,
      UserPoolId,
      Username: email,
      Password,
    };

    await this.cognitoIdentityService
      .adminSetUserPassword(passwordParams)
      .promise();
  }

  async getUsers() {
    const users: UsersListType = [];
    let res: CognitoIdentityServiceProvider.Types.ListUsersResponse =
      await this.getPagedUsers();
    users.push(...res.Users);
    let { PaginationToken } = res;
    while (PaginationToken) {
      res = await this.getPagedUsers(PaginationToken);
      users.push(...res.Users);
      PaginationToken = res.PaginationToken;
    }

    return users;
  }

  private getPagedUsers(PaginationToken?: string) {
    return this.cognitoIdentityService
      .listUsers({
        UserPoolId: this.config.AWS_COGNITO_USER_POOL_ID,
        PaginationToken,
      })
      .promise();
  }

  async listGroups() {
    return (
      await this.cognitoIdentityService
        .listGroups({ UserPoolId: this.config.AWS_COGNITO_USER_POOL_ID })
        .promise()
    ).Groups;
  }

  async adminListGroupsForUser(Username: string) {
    const params: CognitoIdentityServiceProvider.Types.AdminListGroupsForUserRequest =
    {
      Username,
      UserPoolId: this.config.AWS_COGNITO_USER_POOL_ID,
    };
    return (
      await this.cognitoIdentityService.adminListGroupsForUser(params).promise()
    ).Groups;
  }

  async addGroupsForApps(apps: string[], email: string) {
    const { AWS_COGNITO_USER_POOL_ID: UserPoolId } = this.config;

    await Promise.all(
      apps.map((GroupName) => {
        const groupParams: CognitoIdentityServiceProvider.Types.AdminAddUserToGroupRequest =
        {
          UserPoolId,
          Username: email,
          GroupName,
        };

        return this.cognitoIdentityService
          .adminAddUserToGroup(groupParams)
          .promise();
      })
    );
  }


  async setCognitoPreferredMfa(smsPreferred: boolean, AccessToken: string) {
    const on = {
      "Enabled": true,
      "PreferredMfa": true
    };
    const off = {
      "Enabled": false,
      "PreferredMfa": false
    };

    let SMSMfaSettings, SoftwareTokenMfaSettings;

    if (smsPreferred) {
      SMSMfaSettings = on;
      SoftwareTokenMfaSettings = off;
    } else {
      SMSMfaSettings = off;
      SoftwareTokenMfaSettings = on;
    }

    await this.cognitoIdentityService.setUserMFAPreference({
      AccessToken,
      SMSMfaSettings,
      SoftwareTokenMfaSettings}).promise();

      await this.afterSetCognitoPreferredMfa(smsPreferred, AccessToken);
  }

  // this is only here as a hook that consuming modules can override
  async afterSetCognitoPreferredMfa(smsPreferred: boolean, accessTokenRaw: string) {}
}
