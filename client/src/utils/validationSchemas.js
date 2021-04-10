import * as Yup from 'yup';

export const emailValidationSchema = Yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required');

export const passwordValidationSchema = Yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required');