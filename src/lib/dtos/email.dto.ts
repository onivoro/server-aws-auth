import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiPropertyOptional({ type: 'string' })
  isAnon: boolean;
}
