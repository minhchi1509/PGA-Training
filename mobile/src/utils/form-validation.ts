import * as Yup from 'yup';

export const loginFormValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Please enter your email'),
  password: Yup.string().required('Please enter your password'),
});

export const updateMyInformationValidationSchema = Yup.object().shape({
  title: Yup.string().trim().required('Please enter the title'),
  firstName: Yup.string().trim().required('Please enter the first name'),
  lastName: Yup.string().trim().required('Please enter the last name'),
  email: Yup.string()
    .trim()
    .required('Please enter your email')
    .email('Please enter a valid email'),
  phone: Yup.string()
    .min(15, 'Please enter a valid phone number')
    .max(15, 'Please enter a valid phone number')
    .required('Please enter the phone number'),
  gender: Yup.string().required('Please select the gender'),
  occupation: Yup.string().trim().required('Please enter the occupation'),
  address: Yup.string().trim().required('Please enter the address'),
});

export const updateMedicalProfileValidationSchema = Yup.object().shape({
  drName: Yup.string().trim().required(`Please enter the Dr's Name`),
  drProvideNumber: Yup.string().trim().required(`Please enter the Dr's Provider Number`),
  drAddress: Yup.string().trim().required(`Please enter the Dr's Address`),
  diagnosis: Yup.string().trim().required('Please enter the Current Diagnoses'),
  history: Yup.string().trim().required('Please enter the Previous Diagnoses'),
  medication: Yup.string().trim().required('Please enter the Medications'),
  emergencyContactName: Yup.string().trim().required('Please enter Emergency Contact Name'),
  emergencyContactRelationship: Yup.string()
    .trim()
    .required('Please enter the Emergency Contact Relationship'),
  emergencyContactPhone: Yup.string()
    .min(15, 'Please enter a valid phone number')
    .max(15, 'Please enter a valid phone number')
    .required('Please enter the Emergency Contact Phone'),
});

export const changePasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Please enter the old password')
    .min(8, 'The length should be 8-16 characters')
    .max(16, 'The length should be 8-16 characters'),
  newPassword: Yup.string()
    .required('Please enter the old password')
    .max(16, 'The length should be 8-16 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
      'Must contain at least 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number',
    ),
  confirmNewPassword: Yup.string()
    .required('Please enter the old password')
    .max(16, 'The length should be 8-16 characters')
    .oneOf([Yup.ref('newPassword')], 'Password must be matches'),
});
