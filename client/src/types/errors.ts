export type ValidationErrors = Record<string, string[]>;

export type SignUpReturnType = {
  message: string;
  errors?: ValidationErrors;
};

export type SignInReturnType =
  | {
      user: {
        id: string;
        email: string;
      };
    }
  | SignUpReturnType;
