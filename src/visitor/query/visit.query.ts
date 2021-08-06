import { PartialType } from '@nestjs/mapped-types';
import { PaginationQuery } from 'src/common/query/pagination.query';

export class PTVisitQuery extends PartialType(PaginationQuery) {}
