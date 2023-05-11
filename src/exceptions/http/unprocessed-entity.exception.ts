import { HttpException } from './http.exception';

export class UnprocessedEntityException extends HttpException {
  constructor(message: string) {
    super(422, message);
  }
}
