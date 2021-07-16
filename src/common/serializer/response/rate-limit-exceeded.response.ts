export function rateLimitExceededResponse() {
  return {
    statusCode: 429,
    message: 'Request has been blocked',
    error: 'Rate limit exceeded',
  };
}
