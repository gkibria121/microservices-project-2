import { z } from "zod";
import { AuthReturnType, ValidationErrors } from "../types/errors";
import createAxios from "../utils/axios";
import { AxiosResponse } from "axios";

// Validation Schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Validate Form Data
export function validateSignUpData(formData: FormData): {
  success: boolean;
  data?: Record<string, unknown>;
  errors?: ValidationErrors;
} {
  const errors = {} as ValidationErrors;

  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    result.error.errors.forEach((e) => {
      const field = e.path[0] as string;
      errors[field] = [e.message];
    });

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}

export function validateSignInData(formData: FormData): {
  success: boolean;
  data?: Record<string, unknown>;
  errors?: ValidationErrors;
} {
  const errors = {} as ValidationErrors;

  const result = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    result.error.errors.forEach((e) => {
      const field = e.path[0] as string;
      errors[field] = [e.message];
    });

    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
// Sign Up Request to API
export async function submitSignUpData(
  data: Record<string, unknown>
): Promise<AuthReturnType> {
  const customAxios = await createAxios();
  const { data: resData } = await customAxios.post("/api/auth/signup", data);
  return { message: "Successfully signed up!", data: resData };
}
// Sign Up Request to API
export async function submitSignInData(
  data: Record<string, unknown>
): Promise<AxiosResponse> {
  const customAxios = await createAxios();

  const response = await customAxios.post("/api/auth/signin", data);

  return response;
}

export async function logout() {
  const customAxios = await createAxios();
  const response = await customAxios.post("/api/auth/signout");

  return response;
}
