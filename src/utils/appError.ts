export default class AppError extends Error {
  statusCode: number;
  status: string;
  operational: boolean;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.message = message;

    // All errors using this class will be marked as operational
    this.operational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
