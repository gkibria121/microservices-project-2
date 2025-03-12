export type ValidationErrors = Record<string, string[]>;

export type AuthReturnType = {
  user?: { id: string; email: string };
  errors?: Record<string, string[]>;
  message: string;
  data?: unknown;
  success?: string;
  formField?: {
    email?: string | null;
  };
};
