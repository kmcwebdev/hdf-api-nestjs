import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  awsConfig: {
    accessKeyId: process.env.AWS_S3_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET,
    endpoint: process.env.AWS_S3_ENDPOINT,
    region: process.env.AWS_S3_REGION,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  },
  bucket: process.env.AWS_S3_BUCKET,
  fileSize: 1 * 1024 * 1024,
}));
