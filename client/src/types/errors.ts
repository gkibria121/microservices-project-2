export type ValidationErrors = Record<string, string[]>;

export type SignUpReturnType = {
  message: string;
  errors?: ValidationErrors;
};
