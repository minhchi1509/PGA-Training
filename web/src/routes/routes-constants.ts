export const RoutePaths = {
  // non auth
  SIGN_IN: '/sign-in',
  SIGN_UP: (userType = ':userType') => `/sign-up/${userType}`,
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PRACTITIONER_SIGN_UP: '/practitioner/register',
  CONFIRM_EMAIL: '/confirm-email',
  TERM: '/term',
  PRIVACY: '/privacy',
  EMAIL_VERIFY: (id = ':id') => `/verify-email/${id}`,
  VERIFY_PROFILE: (profileId = ':profileId') => `/verify-invite/${profileId}`,
  REGISTER_PROFILE: (profileId = ':profileId') => `/register-profile/${profileId}`,
  OTP_VERIFICATION: '/otp-verification',

  // auth
  HOME: '/',
  PRACTITIONER: '/practitioner',
  MESSAGES: '/messages',
  HOMEWORK: '/homework',
  FILES: '/files',
  REPORT: '/report',
  HELP: '/help',
  PROFILE: '/profile',
  CREATE_CLINIC_PROFILE: (userType = ':userType') => `/create-profile/${userType}`,

  //files
  FILES_FOLDER: (folderId = ':folderId') => `/files/${folderId}`,

  // client
  CLIENTS: '/clients',
  CLIENT_DETAILS: (clientId = ':clientId') => `/clients/${clientId}`,

  // practitioner
  PRACTITIONER_DETAILS: (practitionerId = ':practitionerId') => `/practitioner/${practitionerId}`,

  //pricing
  PRICING_PACKAGE: '/pricing-package',
  PAYMENT: (packageId = ':packageId') => `/payment/${packageId}`,

  // psychoeducation
  PSYCHOEDUCATION: '/psychoeducation',
};
