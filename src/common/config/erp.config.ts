import { registerAs } from '@nestjs/config';

export default registerAs('erp', () => ({
  baseUrl: process.env.ERP_API_BASE_URL,
  apiKey: process.env.ERP_API_KEY,
}));
