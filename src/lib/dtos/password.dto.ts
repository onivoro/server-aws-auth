import { ApiProperty } from '@nestjs/swagger';

export class PasswordDto {
  @ApiProperty({ type: 'string' })
  password: string;

  @ApiProperty({ type: 'string' })
  confirm: string;
}
