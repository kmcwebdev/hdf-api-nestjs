import { registerAs } from '@nestjs/config';

export default registerAs('env', () => ({
  mode: process.env.NODE_ENV,
}));
