class HttpResponse {
  readonly statusCode: number;
  readonly message: string | null;
  readonly error: string;
}

export const httpResponse = (data: HttpResponse): HttpResponse => {
  return data;
};
