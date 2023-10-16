import { TSendOTPLoginRequest, TSignInRequest, TSignInResponse } from 'src/interfaces/auth-interface';
import ResponseError from 'src/interfaces/error-response-interface';

export type TSendOtpLoginAction = TSendOTPLoginRequest & {
  onSuccess?: () => void;
  onError?: (error: ResponseError) => void;
};

export type TSignInAction = TSignInRequest & {
  onSuccess?: (response: TSignInResponse) => void;
  onError?: (error: ResponseError) => void;
};
