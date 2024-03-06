import { ApiProperty } from '@nestjs/swagger';

export class SetPreferredMfaDto {
  @ApiProperty({ type: 'boolean' }) smsPreferred: boolean;
}
