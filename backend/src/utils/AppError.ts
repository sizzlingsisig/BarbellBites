import CustomError from './CustomError.js';

export class AppError<C extends string = string> extends CustomError<C> {
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code?: C) {
    super({ message, statusCode, code });
    this.isOperational = true;
  }
}