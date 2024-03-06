import { ApiProperty } from '@nestjs/swagger';

export class PhoneDto {
  @ApiProperty({ type: 'string' })
  phone: string;
}
