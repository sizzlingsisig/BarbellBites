class CustomError<C extends string = string> extends Error {
  public statusCode: number;
  public code?: C;

  constructor({
    message,
    statusCode,
    code,
  }: {
    message: string;
    statusCode: number;
    code?: C;
  }) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default CustomError;