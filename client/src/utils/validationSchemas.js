import * as Yup from 'yup';

export const emailValidationSchema = Yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required");

export const passwordValidationSchema = Yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required");

export const lastNameValidationSchema = Yup
    .string("Enter your last name")
    .required("Last name is required")
    .min(2, "Last name should be of minimum 2 characters length");

export const firstNameValidationSchema = Yup
    .string("Enter your first name")
    .required("First name is required")
    .min(2, "First name should be of minimum 2 characters length");

export const userTypeValidationSchema = Yup
    .string()
    .required("Select role")
    .oneOf(['teacher', 'student']);

export const studentGroupValidationSchema = Yup
    .string()
    .required("Select group")
    

export const jobTypeValidationSchema = Yup
    .string("Enter your job type")
    .required("Select job type")
    
    
