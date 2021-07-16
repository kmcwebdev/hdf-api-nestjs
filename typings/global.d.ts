import { User as IUser } from 'src/user/entity/user.entity';

declare global {
  namespace Express {
    class User extends IUser {}
  }
}
