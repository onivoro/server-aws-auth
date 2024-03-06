import { ApiProperty } from "@nestjs/swagger";
import { IAuthMfaDto } from "../interfaces/auth.interface";

export class AuthMfaDto implements IAuthMfaDto {
    @ApiProperty({ type: 'string' }) mfa: string;
    @ApiProperty({ type: 'string' }) username: string;
    @ApiProperty({ type: 'string' }) isTotp?: boolean;
}