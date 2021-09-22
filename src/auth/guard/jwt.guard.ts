import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { decode } from 'jsonwebtoken';
import { User } from 'src/user/entity/user.entity';
import { Jwt } from '../interface/jwt.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  decodedUserAccessToken = {};

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    const req = context.switchToHttp().getRequest();

    if (req['cookies'] && req['cookies']['accessToken']) {
      this.decodedUserAccessToken = decode(req['cookies']['accessToken']);
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    const currentUser = user as User;
    const userAccessToken = this.decodedUserAccessToken as Jwt;

    if (err || info || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnprocessableEntityException(
          'The session has expired. Please re-login',
        );
      }

      throw new UnauthorizedException('Invalid access token!');
    }

    if (currentUser.isLocked) {
      throw new UnauthorizedException('Account is locked!');
    }

    if (currentUser.passwordChangedAt) {
      const changedTimeStamp = currentUser.passwordChangedAt.getTime() / 1000;

      if (userAccessToken.iat < changedTimeStamp) {
        throw new UnauthorizedException(
          'Password has been changed recently please login again!',
        );
      }
    }

    return user;
  }
}
