import { HttpException } from './http.exception';

export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(429, message);
  }
}
