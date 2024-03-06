import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthConfig {
    constructor(
        public mfaEnabled: boolean,
        public AWS_COGNITO_CLIENT_ID: string,
        public AWS_COGNITO_USER_POOL_ID: string,
        public AWS_REGION: string
    ) { }
}