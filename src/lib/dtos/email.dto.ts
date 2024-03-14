import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiPropertyOptional({ type: 'boolean' })
  isAnon: boolean;
}
