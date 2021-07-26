import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  key: process.env.AWS_S3_KEY,
  secret: process.env.AWS_S3_SECRET,
  endpoint: process.env.AWS_S3_ENDPOINT,
  bucket: process.env.AWS_S3_BUCKET,
}));
