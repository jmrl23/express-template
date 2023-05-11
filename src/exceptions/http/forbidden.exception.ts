import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(403, message);
  }
}
