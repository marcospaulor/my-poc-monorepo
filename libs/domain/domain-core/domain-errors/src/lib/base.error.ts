export interface ErrorContext {
  userId?: string;
  [key: string]: unknown;
}

export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly timestamp: string;

  constructor(message: string, code: string, context: ErrorContext = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}
