import * as Yup from "yup";
const minPasswordLen = 8;
const minFullNameLen = 2;
const minProjectNameLen = 2;
const maxProjectNameLen = 255;
const minProjectDescriptionLen = 50;
const maxProjectDescriptionLen = 500;

export const emailValidationSchema = Yup.string("Enter your email")
  .email("Enter a valid email")
  .required("Email is required");

export const passwordValidationSchema = Yup.string("Enter your password")
  .min(
    minPasswordLen,
    `Password should be of minimum ${minPasswordLen} characters length`
  )
  .required("Password is required");

export const fullNameValidationSchema = Yup.string("Enter your full name")
  .required("Full name is required")
  .min(
    minFullNameLen,
    `Full name should be of minimum ${minFullNameLen} characters length`
  );

export const projectNameValidSchema = Yup.string("Enter project name")
  .required("Project name is required")
  .min(
    minProjectNameLen,
    `Project name should be of minimum ${minProjectNameLen} characters length`
  )
  .max(
    maxProjectNameLen,
    `Project name should be of maximum ${maxProjectNameLen}`
  );

export const projectDescriptionValidSchema = Yup.string("Enter project description")
  .required("Project description is required")
  .min(
    minProjectDescriptionLen,
    `Project description should be of minimum ${minProjectDescriptionLen} characters length`
  )
  .max(
    maxProjectDescriptionLen,
    `Project description should be of maximum ${maxProjectDescriptionLen} characters length`
  );
