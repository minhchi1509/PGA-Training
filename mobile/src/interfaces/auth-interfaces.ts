export interface ILoginBody {
  email: string;
  password: string;
  otp: string;
}

export interface ISendOTPBody {
  email: string;
  password: string;
}

export interface ILoginResponse {
  id: string;
  accessToken: string;
}

export interface IChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IChangePasswordBody {
  email: string | undefined;
  password: string;
  newPassword: string;
}
