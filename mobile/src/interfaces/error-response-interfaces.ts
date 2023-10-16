export type TErrorResponseData = {
  id: string;
  statusCode: number;
  errorType: string;
  message: string;
  error: string;
};

class ErrorResponse extends Error {
  data?: TErrorResponseData;
  constructor(message: string, data?: TErrorResponseData) {
    super(message);
    this.data = data;
  }
}

export default ErrorResponse;
