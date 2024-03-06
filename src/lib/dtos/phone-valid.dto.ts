import { ApiProperty } from '@nestjs/swagger';

export class PhoneValidDto {
  @ApiProperty({ type: 'boolean' })
  phoneValid: boolean;
}
