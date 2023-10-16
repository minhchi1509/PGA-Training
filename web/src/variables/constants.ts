export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/;

export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;

export const STRING_NOT_ONLY_SPACE_REGEX = /^(?!\s*$).+/;

export const STRING_ONLY_NUMBER_REGEX = /^\d+$/;

export const STATIC_PAGE = {
  TERM: `${process.env.REACT_APP_API_URL}/antsa-terms-and-conditions.pdf`,
  PRIVACY: `${process.env.REACT_APP_API_URL}/antsa-privacy-policy.pdf`,
};

export const STRING_VALIDATION_TIME_REGEX = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/i;
