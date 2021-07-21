import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AzureGraphApiService {
  constructor(private httpService: HttpService) {}

  getEmailDetails(value: string) {
    const url = '/api/Azure/get-users';

    const queryParameters = {
      propertyName: 'mail',
      value,
    };

    const result = this.httpService.get(url, { params: queryParameters }).pipe(
      map((resp) => resp.data['value'][0]),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );

    return result;
  }
}
