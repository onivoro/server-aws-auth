import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
  @ApiProperty({ type: 'string' })
  code: string;
}
