import { EUserType } from 'src/variables/enum-variables';

export type TAuthToken = {
  accessToken: string;
};

export type TBaseAuthRequest = {
  email: string;
  password: string;
};

export type TSignInRequest = TBaseAuthRequest & {
  otp: string;
};

export type TSignInResponse = {
  id: string;
  accessToken: string;
};

export type TSignUpRequest = TBaseAuthRequest & {
  type: EUserType;
  practiceName?: string;
};

export type TSignUpResponse = {
  id: string;
};

export type TPractitionerSignUpRequest = {
  password: string;
  profileId: string;
};

export type TPractitionerSignUpResponse = {
  id: string;
  profileId: string;
  accessToken: string;
};

export type TVerifyProfileResponse = {
  profileId: string;
  sucess: boolean;
};

export type TCheckVerifyProfileResponse = {
  status: boolean;
};

export type TForgotPasswordRequest = {
  email: string;
};

export type TForgotPasswordResponse = {
  id: string;
};

export type TResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

export type TCheckStatusResetPasswordTokenResponse = {
  token: string;
  email: string;
};

export type TChangePasswordRequest = {
  email: string;
  password: string;
  newPassword: string;
};

export type TSendOTPLoginRequest = {
  email: string;
  password: string;
};

export type TSendOTPLoginResponse = {
  id: string;
};
