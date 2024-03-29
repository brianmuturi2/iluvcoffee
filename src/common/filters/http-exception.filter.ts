import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // access to native inflight request or response objects
    const response = ctx.getResponse<Response>(); // return underlying platform response (express)

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof response === 'string' ? { message: exceptionResponse } : (exceptionResponse as object);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString()
    });
  }
}
