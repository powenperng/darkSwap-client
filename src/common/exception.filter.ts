import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DarkpoolException } from '../exception/darkpool.exception';
import { DarkPoolResponse, DarkPoolSimpleResponse } from './response.interface';

@Catch(DarkpoolException)
export class DarkpoolExceptionFilter implements ExceptionFilter {
  catch(exception: DarkpoolException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const responseBody: DarkPoolSimpleResponse = {
      code: status,
      message: exception.message || 'Unknown error',
      error: exception.message || 'Unknown error',
    };

    response.status(status).json(responseBody);
  }
}