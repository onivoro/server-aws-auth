export * from './lib/classes/auth-config.class';

export * from './lib/constants/access-token-key.constant';
export * from './lib/constants/identity-token-key.constant';

export * from './lib/decorators/access-token.decorator';
export * from './lib/decorators/access-token-raw.decorator';
export * from './lib/decorators/identity-token.decorator';
export * from './lib/decorators/user-id.decorator';

export * from './lib/dtos/access-token.dto';
export * from './lib/dtos/auth-credentials.dto';
export * from './lib/dtos/auth-mfa.dto';
export * from './lib/dtos/auth-tokens.dto';
export * from './lib/dtos/code.dto';
export * from './lib/dtos/contact-info.dto';
export * from './lib/dtos/email.dto';
export * from './lib/dtos/password.dto';
export * from './lib/dtos/phone-valid.dto';
export * from './lib/dtos/phone.dto';
export * from './lib/dtos/set-preferred-mfa.dto';
export * from './lib/dtos/verify-totp.dto';

export * from './lib/functions/convert-object-to-attribute-list.function';
export * from './lib/functions/convert-phone-to-plus-one.function';
export * from './lib/functions/extract-user-attribute-value.function';


export * from './lib/guards/auth.guard';

export * from './lib/interfaces/access-token.interface';
export * from './lib/interfaces/auth.interface';
export * from './lib/interfaces/identity-token.interface';

export * from './lib/middleware/auth.middleware';

export * from './lib/services/admin-cognito.service';
export * from './lib/services/auth.service';
export * from './lib/services/mfa-auth.service';

export * from './lib/auth.module';
export * from './lib/server-aws-cognito.module';