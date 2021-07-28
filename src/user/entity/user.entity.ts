import { Permission } from './permission.entity';

export class User {
  readonly id: number;
  readonly email: string;
  readonly userType: string;
  readonly isLocked: number;
  readonly permissions: Permission[];
  readonly passwordChangedAt: Date;
}
