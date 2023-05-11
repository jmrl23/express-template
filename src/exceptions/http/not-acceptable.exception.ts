import { HttpException } from './http.exception';

export class NotAcceptableException extends HttpException {
  constructor(message: string) {
    super(406, message);
  }
}
