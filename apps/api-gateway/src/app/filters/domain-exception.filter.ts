import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import {
  BaseError,
  ErrorHandlerChain,
  ValidationErrors,
} from '@my-poc-monorepo/domain-errors';

@Catch(BaseError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);
  private readonly errorHandlerChain = ErrorHandlerChain.create();

  catch(exception: BaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const errorResponse = this.errorHandlerChain.handle(exception);

    const httpResponse = {
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      code: errorResponse.code,
      timestamp: errorResponse.timestamp,
      path: request.url,
      method: request.method,
      context: errorResponse.context,
    };

    if (exception instanceof ValidationErrors) {
      httpResponse['errors'] = exception.errors;
    }

    this.logger.error(
      `[${errorResponse.code}] ${errorResponse.message}`,
      JSON.stringify({
        statusCode: errorResponse.statusCode,
        path: request.url,
        method: request.method,
        context: errorResponse.context,
        stack: exception.stack,
      })
    );

    response.status(errorResponse.statusCode).json(httpResponse);
  }
}
