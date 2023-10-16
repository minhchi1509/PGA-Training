import { Rule } from 'antd/es/form';

export const emailRules: Rule[] = [
  {
    type: 'email',
    message: 'Please enter a valid email address',
  },
  {
    required: true,
    message: 'Please enter your email',
  },
];
