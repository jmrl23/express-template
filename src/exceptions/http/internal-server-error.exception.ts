import { HttpException } from './http.exception';

export class InternalServerErrorException extends HttpException {
  constructor(message?: string) {
    super(500, message);
  }
}
