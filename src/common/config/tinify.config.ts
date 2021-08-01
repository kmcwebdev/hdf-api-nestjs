import { registerAs } from '@nestjs/config';

export default registerAs('tinify', () => ({
  apiKey: process.env.TINIFY_API_KEY,
}));
