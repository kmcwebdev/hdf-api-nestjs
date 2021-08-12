import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CurrentVisitQuery {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  visitId: string;
}
