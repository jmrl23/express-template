import httpErrorList from './http-error-list.json';

export interface HttpExceptionResponse {
  statusCode: number;
  message?: string;
  error?: string;
}

export class HttpException extends Error {
  private response: HttpExceptionResponse;

  constructor(
    private readonly statusCode: number,
    message?: string,
    private readonly error?: string,
  ) {
    super(message);
    this.response = { statusCode: this.statusCode };
    this.setResponse();
  }

  getStatusCode() {
    return this.statusCode;
  }

  getResponse() {
    return { ...this.response };
  }

  private setResponse() {
    const errorInfo = httpErrorList.find(
      (item) => item.statusCode === this.statusCode,
    );
    if (!errorInfo) return;
    this.response.message = this.message || errorInfo.message;
    this.response.error = this.error || errorInfo.title;
  }
}
