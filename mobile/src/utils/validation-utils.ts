import * as Yup from 'yup';

export const loginFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email'),
  password: Yup.string().required('Please enter your password'),
});

export const contactHelpValidationSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  comment: Yup.string().required('Please enter your comment'),
});

export const doActivityAndWrittenTaskValidationSchema = Yup.object().shape({
  response: Yup.string().required('Please enter your response'),
});
