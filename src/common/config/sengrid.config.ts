import { registerAs } from '@nestjs/config';

export default registerAs('sendGrid', () => ({
  apiKey: process.env.SENDGRID_API_KEY,
}));
