export class User {
  readonly id: number;
  readonly email: string;
  readonly userType: string;
  readonly isLocked: number;
  readonly passwordChangedAt: Date;
}
