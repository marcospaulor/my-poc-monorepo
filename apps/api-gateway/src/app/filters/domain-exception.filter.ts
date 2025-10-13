import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseError, ErrorHandlerChain } from '@my-poc-monorepo/domain-errors';

@Catch(BaseError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);
  private readonly errorHandlerChain = ErrorHandlerChain.create();

  catch(exception: BaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Usa o Chain of Responsibility para mapear o erro de domínio
    const errorResponse = this.errorHandlerChain.handle(exception);

    // Enriquece a resposta com informações do request
    const httpResponse = {
      ...errorResponse,
      path: request.url,
      method: request.method,
    };

    // Log estruturado para observabilidade
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

    // Envia a resposta HTTP
    response.status(errorResponse.statusCode).json(httpResponse);
  }
}
