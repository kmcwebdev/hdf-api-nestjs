import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class SiteTotalRecordCountDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  totalRecordCount: number;
}
