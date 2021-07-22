import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessTokenSecretKey: process.env.JWT_SECRET,
  refreshTokenKey: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpires: process.env.JWT_SECRET_EXPIRES_IN,
}));
