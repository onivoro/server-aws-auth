import { ApiProperty } from "@nestjs/swagger";
import { IAuthCredentialsDto } from "../interfaces/auth.interface";

export class AuthCredentialsDto implements IAuthCredentialsDto {
    @ApiProperty({ type: 'string' }) password: string;
    @ApiProperty({ type: 'string' }) name: string;
}