import { BaseError } from '../base.error';

export interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface ErrorHandler {
  setNext(handler: ErrorHandler): ErrorHandler;
  handle(error: BaseError): ErrorResponse | null;
}
