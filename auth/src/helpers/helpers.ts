import { ValidationError } from "express-validator";

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${noun}${count !== 1 ? suffix : ""}`;

export const makeValidationError = (
  fieldName: string,
  message: string
): ValidationError => ({
  type: "field",
  path: fieldName,
  location: "body",
  msg: message,
});
