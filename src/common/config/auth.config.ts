import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessTokenSecretKey: process.env.APPSETTING_JWT_SECRET,
  refreshTokenKey: process.env.APPSETTING_REFRESH_TOKEN_SECRET,
  accessTokenExpires: process.env.APPSETTING_JWT_SECRET_EXPIRES_IN,
}));
