import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactInfoDto {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  phone: string;

  @ApiProperty({ type: 'string' })
  orgId: string;

  @ApiPropertyOptional({ type: 'string' })
  isAnon: boolean;
}
